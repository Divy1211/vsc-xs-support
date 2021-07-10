import { Variable, Function, Parameter, Rule, Occurance } from "./interfaces";
import * as vscode from "vscode";
import * as extension from "../extension";

var deletedFiles: string[] = [];
var lastParsedFileText: { [index: string]: string } = {};

// var installedModsDir = "";
// var profileDir = "";
// var gameDir = "";

export var includedFiles: { [index: string]: vscode.TextDocument[] } = {};
export var variables: { [index: string]: { [index: string]: Variable[] } } = {};
export var functions: { [index: string]: { [index: string]: Function[] } } = {};
export var parameters: { [index: string]: { [index: string]: Parameter[] } } = {};
export var rules: { [index: string]: { [index: string]: Rule }[] } = {};

function count(str: string, char: string): number {
    return str.split(char).length - 1;
}

function scope(str: string): number {
    var openingCount = count(str, "{");
    var closingCount = count(str, "}");
    return openingCount - closingCount;
}

// variable info generation functions:
function generateImportedVariableInfo(
    document: vscode.TextDocument,
    importedDoc: vscode.TextDocument
): { [index: string]: Variable[] } {
    const text = document.getText();
    var importedVariabless: { [index: string]: Variable[] } = {};

    for (const varName in variables[importedDoc.fileName]) {
        const vars = variables[importedDoc.fileName][varName];
        for (const variable of vars) {
            if (!variable.exported || variable.startChar === -1) {
                continue;
            }
            const occurances: Occurance[] = [];
            const variableOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${variable.name}\\b`, "g")) ?? [];

            for (const occurance of variableOccurances) {
                const codeTillOccurance = text.slice(0, occurance.index);
                const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
                const lineCount = linesOfCodeTillOccurance.length - 1;
                const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

                occurances.push({
                    fileName: document.fileName,
                    startLine: lineCount,
                    endLine: lineCount,
                    startChar: lineCharCount,
                    length: occurance[0].length,
                });
            }
            importedVariabless[variable.name] = importedVariabless[variable.name] ?? [];
            importedVariabless[variable.name].push({
                ...variable,
                scope: [0, -1],
                occurances,
            });
        }
    }
    return importedVariabless;
}

function generateSelfVariable(document: vscode.TextDocument): { [index: string]: Variable[] } {
    var selfVariables: { [index: string]: Variable[] } = {};
    const text: any = document.getText();
    const variableDefs =
        text.matchAll(
            /(?<=(?<!\/\/.*)(extern[\s\r\n]+)?(const[\s\r\n]+)?(?:(int|float|bool|String|Vector|string|vector|char|long|double)([\s\r\n]+))|for(\([\s\r\n]*))([a-zA-Z_]+[a-zA-Z_0-9]*)([\s\r\n]+)=([\s\r\n]+)(.*?);/g
        ) ?? [];

    for (const variable of variableDefs) {
        const codeTilleDeclaration = text.slice(0, variable.index);
        const linesTillDeclaration = codeTilleDeclaration.split(/\r\n/g);
        const lineCharCount = linesTillDeclaration.slice(-1)[0].length;
        const lineCount = linesTillDeclaration.length;

        var variableScope = scope(codeTilleDeclaration);
        // if(variableScope > 0) {
        //     continue;
        // }
        var scopeEndLine = text.split(/\r\n/g).length;

        if (variableScope !== 0) {
            var openingCount = 0,
                closingCount = 0;
            for (var i = variable.index; i < text.length; i++) {
                if (text[i] === "{") {
                    openingCount++;
                } else if (text[i] === "}") {
                    closingCount++;
                }
                if (closingCount - openingCount >= variableScope) {
                    scopeEndLine = text.slice(0, i).split(/\r\n/g).length;
                    break;
                }
            }
        }

        const occurances: Occurance[] = [];
        const constantOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${variable[6]}\\b`, "g")) ?? [];

        for (const occurance of constantOccurances) {
            if (occurance.index <= variable.index) {
                continue;
            }

            const codeTillOccurance = text.slice(0, occurance.index);

            if (scope(codeTillOccurance) < variableScope) {
                continue;
            }

            const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
            const lineCount = linesOfCodeTillOccurance.length - 1;
            const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

            occurances.push({
                fileName: document.fileName,
                startLine: lineCount,
                endLine: lineCount,
                startChar: lineCharCount,
                length: occurance[0].length,
            });
        }

        selfVariables[variable[6]] = selfVariables[variable[6]] ?? [];
        selfVariables[variable[6]].push({
            startLine: lineCount + (variable[4] || variable[5]).split(/\r\n/).length - 2,
            endLine: lineCount + variable[7].split(/\r\n/).length + variable[8].split(/\r\n/).length - 3,
            startChar: lineCharCount,
            length: variable[6].length,
            exported: Boolean(variable[1]),
            fromFile: document,
            constant: Boolean(variable[2]),
            type: variable[3],
            name: variable[6],
            value: variable[9],
            scope: [lineCount-1, scopeEndLine-1], // 0: starting line, 1: ending line
            occurances,
        });
    }
    return selfVariables;
}

function generateAllVariableInfo(document: vscode.TextDocument): { [index: string]: Variable[] } {
    var selfVariables: { [index: string]: Variable[] } = generateSelfVariable(document);
    var importedVariables: { [index: string]: Variable[] } = {};
    for (const doc of includedFiles[document.fileName]) {
        importedVariables = { ...importedVariables, ...generateImportedVariableInfo(document, doc) };
    }
    return { ...selfVariables, ...importedVariables };
}

// File info generation functions:
async function getExistingIncludedFilePaths(
    document: vscode.TextDocument,
    checkedPaths: string[] = []
): Promise<string[]> {
    const text: any = document.getText();

    if (!checkedPaths.includes(document.uri.fsPath)) {
        checkedPaths.push(document.uri.fsPath);
    }

    const includedFilePaths: string[] = [];
    const promiseList = [];

    const relativefilePaths = text.matchAll(/(?<=(?<!\/\/.*)(?<=\b)(include)[\s\r\n]*")[:\\./\w]+\.xs+(?=";)/g);
    for (var relativeFilePath of relativefilePaths) {
        const fullPath =
            document.uri.fsPath.split("\\").slice(0, -1).join("\\") + "\\" + relativeFilePath[0].replace("/", "\\");
        if (!checkedPaths.includes(fullPath) && !deletedFiles.includes(fullPath)) {
            checkedPaths.push(fullPath);
            const subPaths: any = vscode.workspace
                .openTextDocument(fullPath)
                .then((doc) => {
                    includedFilePaths.push(fullPath);
                    return getExistingIncludedFilePaths(doc, checkedPaths);
                })
                .then((paths) => includedFilePaths.push(...paths));
            subPaths.catch((error: any) => console.log(`File ${fullPath} does not exist`));

            promiseList.push(subPaths);
        }
    }

    await Promise.allSettled(promiseList);

    return includedFilePaths;
}

async function getAllIncludedFileNames(document: vscode.TextDocument, checkedPaths: string[] = []): Promise<string[]> {
    const text: any = document.getText();

    if (!checkedPaths.includes(document.uri.fsPath)) {
        checkedPaths.push(document.uri.fsPath);
    }

    const includedFilePaths: string[] = [];
    const promiseList = [];

    const relativefilePaths = text.matchAll(/(?<=(?<!\/\/.*)(?<=\b)(include)[\s\r\n]*")[:\\./\w]+\.xs+(?=";)/g);
    for (var relativeFilePath of relativefilePaths) {
        const fullPath =
            document.uri.fsPath.split("\\").slice(0, -1).join("\\") + "\\" + relativeFilePath[0].replace("/", "\\");
        if (!checkedPaths.includes(fullPath)) {
            checkedPaths.push(fullPath);
            includedFilePaths.push(fullPath);

            const subPaths: any = vscode.workspace
                .openTextDocument(fullPath)
                .then((doc) => {
                    return getExistingIncludedFilePaths(doc, checkedPaths);
                })
                .then((paths) => includedFilePaths.push(...paths));
            subPaths.catch((error: any) => console.log(`File ${fullPath} does not exist`));

            promiseList.push(subPaths);
        }
    }

    await Promise.allSettled(promiseList);

    return includedFilePaths;
}

async function getExistingIncludedFiles(document: vscode.TextDocument): Promise<vscode.TextDocument[]> {
    const includedFilePaths: string[] = await getExistingIncludedFilePaths(document);
    const includedFiles: vscode.TextDocument[] = [];
    const promiseList = [];

    for (var path of includedFilePaths) {
        const fileText = vscode.workspace.openTextDocument(path).then((doc) => includedFiles.push(doc));
        promiseList.push(fileText);
    }
    await Promise.all(promiseList);
    return includedFiles;
}

export async function generateFileInfo(document: vscode.TextDocument, forceParsing: boolean = false): Promise<void> {
    if (!forceParsing && lastParsedFileText[document.fileName] === document.getText()) {
        return;
    }

    includedFiles[document.fileName] = await getExistingIncludedFiles(document);
    for (const file of includedFiles[document.fileName]) {
        await generateFileInfo(file);
    }

    variables[document.fileName] = generateAllVariableInfo(document);
    // parameters[document.fileName] = generateParameterInfo(text);
    // rules[document.fileName] = generateRuleInfo(text);
    // functions[document.fileName] = generateFunctionInfo(text);

    // console.log(document.fileName.split("\\").slice(-1)[0]);
    lastParsedFileText[document.fileName] = document.getText();
}

// live file change detection
var activateAfterTimeout = setTimeout(() => {}, 500);
export async function startDetectingLiveChanges(document: vscode.TextDocument): Promise<void> {
    const allIncludedFileNames = await getAllIncludedFileNames(document);

    for (var fileName of allIncludedFileNames) {
        const watcher = vscode.workspace.createFileSystemWatcher(fileName);
        watcher.onDidChange((event) => {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                // console.log("ODCh");

                await generateFileInfo(document, true);
                extension.activate();
            }, 1000);
        });
        watcher.onDidCreate((event) => {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                deletedFiles = deletedFiles.filter((fileName) => fileName !== event.fsPath);
                // console.log("ODC");

                await generateFileInfo(document, true);
                extension.activate();
            }, 1000);
        });
        watcher.onDidDelete((event) => {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                deletedFiles.push(event.fsPath);
                // console.log("ODD");
                delete lastParsedFileText[event.fsPath];

                await generateFileInfo(document, true);
                extension.activate();
            }, 1000);
        });
    }

    vscode.workspace.onDidChangeTextDocument((event) => {
        const changedName = event.document.fileName;
        if (allIncludedFileNames.includes(changedName)) {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                // console.log("ODCTD", document.fileName.split("\\").slice(-1)[0]);

                await generateFileInfo(document, true);
                extension.activate();
            }, 500);
        }
    });
}
