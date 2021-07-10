import * as vscode from "vscode";
import * as fileParser from "../common/fileParser";

function getVariableDefinition(document: vscode.TextDocument, position: vscode.Position, word: string) {
    const variables = fileParser.variables[document.fileName][word];
    for(const variable of variables) {
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
        if(word2 === "include") {
            var fileName = cursorLine.split("include").slice(1)[0].trim().slice(1, -2).replace("/", "\\");

            for(const file of fileParser.includedFiles[document.fileName]) {
                if(file.fileName.endsWith(fileName)) {
                    return new vscode.Location(
                        file.uri,
                        new vscode.Range(
                            new vscode.Position(0, 0),
                            new vscode.Position(0, 0)
                        )
                    );
                }
            }
        } else if(word in fileParser.variables[document.fileName]) {
            return getVariableDefinition(document, position, word);
        }
        return undefined;
    }
}
