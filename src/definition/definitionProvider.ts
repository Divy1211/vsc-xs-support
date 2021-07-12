import * as vscode from "vscode";
import * as fileParser from "../common/fileParser";

function getVariableDefinition(document: vscode.TextDocument, position: vscode.Position, word: string) {
    const variables = fileParser.variables[document.fileName][word];
    for (const variable of variables) {
        if (!(variable.scope[0] <= position.line) || !(variable.scope[1] === -1 || position.line < variable.scope[1])) {
            continue;
        }
        return new vscode.Location(
            variable.fromFile.uri,
            new vscode.Range(
                new vscode.Position(variable.startLine, variable.startChar),
                new vscode.Position(variable.startLine, variable.startChar + variable.length)
            )
        );
    }
}

function getParameterDefinition(document: vscode.TextDocument, position: vscode.Position, word: string) {
    for (const funcName in fileParser.functions[document.fileName]) {
        const func = fileParser.functions[document.fileName][funcName][0];
        if (func.fromFile.fileName === document.fileName) {
            if (func.startLine < position.line && position.line < func.feLine) {
                for (const param of func.parameters) {
                    if (word === param.name) {
                        return new vscode.Location(
                            document.uri,
                            new vscode.Range(
                                new vscode.Position(func.startLine + param.startLine, func.startChar + param.startChar),
                                new vscode.Position(
                                    func.startLine + param.startLine,
                                    func.startChar + param.startChar + param.length
                                )
                            )
                        );
                    }
                }
            }
        }
    }
    return undefined;
}

function getFunctionDefinition(document: vscode.TextDocument, position: vscode.Position, word: string) {
    const func = fileParser.functions[document.fileName][word][0];
    return new vscode.Location(
        func.fromFile.uri,
        new vscode.Range(
            new vscode.Position(func.startLine, func.startChar),
            new vscode.Position(func.endLine, func.startChar + func.length)
        )
    );
}

function getRuleDefinition(document: vscode.TextDocument, position: vscode.Position, word: string) {
    const rule = fileParser.rules[document.fileName][word][0];
    return new vscode.Location(
        rule.fromFile.uri,
        new vscode.Range(
            new vscode.Position(rule.startLine, rule.startChar),
            new vscode.Position(rule.endLine, rule.startChar + rule.length)
        )
    );
}

export class GoToDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.Location | undefined {
        const text: string = document.getText();
        const lines = text.split(/\r\n/g);
        const cursorLine = lines[position.line];
        const lineTillCursor = cursorLine.slice(0, position.character);

        if (lineTillCursor.indexOf("//") !== -1) {
            return undefined;
        }

        const wordPosition = lineTillCursor.split(/\b/g).length - 1;
        const words = cursorLine.split(/\b/g);
        const word = words[wordPosition];
        const word2 = words[0];
        if (!isNaN(+word)) {
            return undefined;
        }
        if (word2 === "include") {
            var fileName = cursorLine.split("include").slice(1)[0].trim().slice(1, -2).replace("/", "\\");

            for (const file of fileParser.includedFiles[document.fileName]) {
                if (file.fileName.endsWith(fileName)) {
                    return new vscode.Location(
                        file.uri,
                        new vscode.Range(new vscode.Position(0, 0), new vscode.Position(0, 0))
                    );
                }
            }
        } else if (word in fileParser.variables[document.fileName]) {
            return getVariableDefinition(document, position, word);
        } else if (word in fileParser.functions[document.fileName]) {
            return getFunctionDefinition(document, position, word);
        } else if (word in fileParser.rules[document.fileName]) {
            return getRuleDefinition(document, position, word);
        } else {
            return getParameterDefinition(document, position, word);
        }
    }
}
