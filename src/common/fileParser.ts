import { Variable, Function, Parameter, Rule, Occurance } from "./interfaces";
import * as vscode from "vscode";
import * as extension from "../extension";

var deletedFiles: string[] = [];
var lastParsedFileText: { [index: string]: string } = {};

export var includedFiles: { [index: string]: vscode.TextDocument[] } = {};
export var variables: { [index: string]: { [index: string]: Variable[] } } = {};
export var functions: { [index: string]: { [index: string]: Function[] } } = {};
export var rules: { [index: string]: { [index: string]: Rule[] } } = {};
export var groups: { [index: string]: { [index: string]: string[] } } = {};

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
            if (!variable.exported || variable.fromFile.fileName !== importedDoc.fileName) {
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
        const variableOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${variable[6]}\\b`, "g")) ?? [];

        for (const occurance of variableOccurances) {
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
            startLine: lineCount + (variable[5] ?? "").split(/\r\n/).length - 2,
            endLine: lineCount + variable[7].split(/\r\n/).length + variable[8].split(/\r\n/).length - 3,
            startChar: lineCharCount,
            length: variable[6].length,
            exported: Boolean(variable[1]),
            fromFile: document,
            constant: Boolean(variable[2]),
            type: variable[3],
            name: variable[6],
            value: variable[9],
            scope: [lineCount - 1, scopeEndLine - 1], // 0: starting line, 1: ending line
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

// function info generation functions:
function generateParameterInfo(name: string, functionSign: string, functionBody: any): Parameter[] {
    const parameters: Parameter[] = [];

    const params = (functionSign.trim() + ",").matchAll(
        /(?<=(int|float|bool|String|Vector|string|vector|char|long|double)([\s\r\n]+))([a-zA-Z_]+[a-zA-Z_0-9]*)(?=([\s\r\n]+)=([\s\r\n]+)(.*?),(?![^(]*\)))/g
    );
    for (const param of params) {
        var lineCharCount = 0;
        var lineCount = 0;

        const occurances: Occurance[] = [];
        const paramOccurances = functionBody.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${param[0]}\\b`, "g")) ?? [];
        var occuranceCount = 0;
        for (const occurance of paramOccurances) {
            const codeTillOccurance = functionBody.slice(0, occurance.index);
            const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
            const occuranceLineCount = linesOfCodeTillOccurance.length - 1;
            const occuranceLineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;
            if (occuranceCount === 0) {
                lineCount = occuranceLineCount;
                lineCharCount = occuranceLineCharCount;
                occuranceCount++;
            } else {
                occurances.push({
                    fileName: name,
                    startLine: occuranceLineCount,
                    endLine: occuranceLineCount,
                    startChar: occuranceLineCharCount,
                    length: occurance[0].length,
                });
            }
        }
        parameters.push({
            startLine: lineCount,
            endLine: lineCount,
            startChar: lineCharCount,
            length: param[0].length,
            type: param[1],
            name: param[0],
            defaultValue: param[6],
            occurances,
        });
    }
    return parameters;
}

function generateImportedFunctionInfo(
    document: vscode.TextDocument,
    importedDoc: vscode.TextDocument
): { [index: string]: Function[] } {
    const text: any = document.getText();
    var importedFunctions: { [index: string]: Function[] } = {};

    for (const funcName in functions[importedDoc.fileName]) {
        const func = functions[importedDoc.fileName][funcName][0];
        if (func.fromFile.fileName !== importedDoc.fileName) {
            continue;
        }
        const occurances: Occurance[] = [];
        const functionOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${func.name}\\b`, "g")) ?? [];

        for (const occurance of functionOccurances) {
            const codeTillOccurance = text.slice(0, occurance.index);
            const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
            const occurnaceLineCount = linesOfCodeTillOccurance.length - 1;
            const occuranceLineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

            occurances.push({
                fileName: document.fileName,
                startLine: occurnaceLineCount,
                endLine: occurnaceLineCount,
                startChar: occuranceLineCharCount,
                length: occurance[0].length,
            });
        }
        importedFunctions[func.name] = [];
        importedFunctions[func.name].push({
            ...func,
            occurances: occurances,
        });
    }
    return importedFunctions;
}

function generateSelfFunctionInfo(document: vscode.TextDocument): { [index: string]: Function[] } {
    const text: any = document.getText();
    var selfFunctions: { [index: string]: Function[] } = {};

    const functionDefs = text.matchAll(
        /(?<=\b)(?<!\/\/.*?)(void|int|float|bool|String|Vector|string|vector|char|long|double)([\s\r\n]+)([a-zA-Z_]+[a-zA-Z_0-9]*)([\s\r\n]*)\(([^]*?)\)([\s\r\n]*{)/g
    );

    for (const func of functionDefs) {
        const codeTilleDeclaration = text.slice(0, func.index);
        const linesTillDeclaration = codeTilleDeclaration.split(/\r\n/g);
        const lineCharCount = linesTillDeclaration.slice(-1)[0].length;
        const lineCount = linesTillDeclaration.length;

        var feLine = 0;
        var feChar = 0;
        var openingCount = 0;
        var closingCount = 0;

        for (var i = func.index + func[0].length; i < text.length; i++) {
            if (text[i] === "{") {
                openingCount++;
            } else if (text[i] === "}") {
                closingCount++;
            }
            if (closingCount - openingCount > 0) {
                feLine = text.slice(0, i).split(/\r\n/g).length;
                feChar = i;
                break;
            }
        }
        const occurances: Occurance[] = [];
        const functionOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${func[3]}\\b`, "g")) ?? [];

        for (const occurance of functionOccurances) {
            if (occurance.index <= func.index) {
                continue;
            }

            const codeTillOccurance = text.slice(0, occurance.index);
            const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
            const occurnaceLineCount = linesOfCodeTillOccurance.length - 1;
            const occuranceLineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

            occurances.push({
                fileName: document.fileName,
                startLine: occurnaceLineCount,
                endLine: occurnaceLineCount,
                startChar: occuranceLineCharCount,
                length: occurance[0].length,
            });
        }
        var parameters: Parameter[] = generateParameterInfo(func[3], func[5], text.slice(func.index, feChar));
        selfFunctions[func[3]] = [];
        selfFunctions[func[3]].push({
            startLine: lineCount - 1,
            endLine: lineCount + func[0].split("\r\n").length - 2,
            startChar: lineCharCount,
            fromFile: document,
            returnType: func[1],
            name: func[3],
            length: func[0].length,
            feLine: feLine,
            parameters: parameters,
            occurances: occurances,
        });
    }
    return selfFunctions;
}

function generateAllFunctionInfo(document: vscode.TextDocument): { [index: string]: Function[] } {
    var selfFunctions: { [index: string]: Function[] } = generateSelfFunctionInfo(document);
    var importedFunctions: { [index: string]: Function[] } = {};
    for (const doc of includedFiles[document.fileName]) {
        importedFunctions = { ...importedFunctions, ...generateImportedFunctionInfo(document, doc) };
    }
    return { ...selfFunctions, ...importedFunctions };
}

// Rule info generation functions:
function generateImportedRuleInfo(
    document: vscode.TextDocument,
    importedDoc: vscode.TextDocument
): { [index: string]: Rule[] } {
    const text: any = document.getText();
    var importedRules: { [index: string]: Rule[] } = {};

    for (const ruleName in rules[importedDoc.fileName]) {
        const rule = rules[importedDoc.fileName][ruleName][0];
        if (rule.fromFile.fileName !== importedDoc.fileName) {
            continue;
        }
        const occurances: Occurance[] = [];
        const ruleOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${rule.name}\\b`, "g")) ?? [];

        for (const occurance of ruleOccurances) {
            const codeTillOccurance = text.slice(0, occurance.index);
            const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
            const occurnaceLineCount = linesOfCodeTillOccurance.length - 1;
            const occuranceLineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

            occurances.push({
                fileName: document.fileName,
                startLine: occurnaceLineCount,
                endLine: occurnaceLineCount,
                startChar: occuranceLineCharCount,
                length: occurance[0].length,
            });
        }
        if(rule.groupName) {
            groups[document.fileName][rule.groupName] = groups[document.fileName][rule.groupName] ?? [];
            groups[document.fileName][rule.groupName].push(rule.name);
        }

        importedRules[rule.name] = [];
        importedRules[rule.name].push({
            ...rule,
            occurances: occurances,
        });
    }
    return importedRules;
}

function generateSelfRuleInfo(document: vscode.TextDocument): { [index: string]: Rule[] } {
    var selfRules: { [index: string]: Rule[] } = {};
    const text: any = document.getText();
    const ruleDefs =
        text.matchAll(
            /(?<=\b)(?<!\/\/[^\n]*?)rule[\s\r\n]+([a-zA-Z_]+[a-zA-Z_0-9]*).*?(?:group[\s\r\n]+([a-zA-Z_]+[a-zA-Z_0-9]*).*?)?[\s\r\n]*{/gs
        ) ?? [];

    for (const rule of ruleDefs) {
        const codeTilleDeclaration = text.slice(0, rule.index);
        const linesTillDeclaration = codeTilleDeclaration.split(/\r\n/g);
        const lineCharCount = linesTillDeclaration.slice(-1)[0].length;
        const lineCount = linesTillDeclaration.length;

        const occurances: Occurance[] = [];
        const ruleOccurances = text.matchAll(new RegExp(`(?<!\\/\\/.*)\\b${rule[1]}\\b`, "g")) ?? [];

        for (const occurance of ruleOccurances) {
            if (occurance.index <= rule.index) {
                continue;
            }

            const codeTillOccurance = text.slice(0, occurance.index);
            const linesOfCodeTillOccurance = codeTillOccurance.split(/\r\n/g);
            const occuranceLineCount = linesOfCodeTillOccurance.length - 1;
            const occuranceLineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

            occurances.push({
                fileName: document.fileName,
                startLine: occuranceLineCount,
                endLine: occuranceLineCount,
                startChar: occuranceLineCharCount,
                length: occurance[0].length,
            });
        }

        if(rule[2]) {
            groups[document.fileName][rule[2]] = groups[document.fileName][rule[2]] ?? [];
            groups[document.fileName][rule[2]].push(rule[1]);
        }

        selfRules[rule[1]] = [];
        selfRules[rule[1]].push({
            startLine: lineCount - 1,
            endLine: lineCount + rule[0].split(/\r\n/).length - 2,
            startChar: lineCharCount,
            fromFile: document,
            name: rule[1],
            groupName: rule[2] ?? null,
            length: rule[0].length,
            proto: rule[0],
            occurances,
        });
    }
    return selfRules;
}

function generateAllRuleInfo(document: vscode.TextDocument): { [index: string]: Rule[] } {
    var selfRules: { [index: string]: Rule[] } = generateSelfRuleInfo(document);
    var importedRules: { [index: string]: Rule[] } = {};
    for (const doc of includedFiles[document.fileName]) {
        importedRules = { ...importedRules, ...generateImportedRuleInfo(document, doc) };
    }
    return { ...selfRules, ...importedRules };
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
    functions[document.fileName] = generateAllFunctionInfo(document);

    groups[document.fileName] = {};
    rules[document.fileName] = generateAllRuleInfo(document);
    
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
                await generateFileInfo(document, true);

                extension.deactivate();
                extension.activate();
            }, 1000);
        });
        watcher.onDidCreate((event) => {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                deletedFiles = deletedFiles.filter((fileName) => fileName !== event.fsPath);

                await generateFileInfo(document, true);

                extension.deactivate();
                extension.activate();
            }, 1000);
        });
        watcher.onDidDelete((event) => {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                deletedFiles.push(event.fsPath);
                delete lastParsedFileText[event.fsPath];

                await generateFileInfo(document, true);

                extension.deactivate();
                extension.activate();
            }, 1000);
        });
    }

    vscode.workspace.onDidChangeTextDocument((event) => {
        const changedName = event.document.fileName;
        if (allIncludedFileNames.includes(changedName)) {
            clearTimeout(activateAfterTimeout);
            activateAfterTimeout = setTimeout(async () => {
                await generateFileInfo(document, true);

                extension.deactivate();
                extension.activate();
            }, 500);
        }
    });
}
