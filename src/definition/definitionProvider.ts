import * as vscode from "vscode";

export class GoToDefinitionProvider implements vscode.DefinitionProvider {
    public provideDefinition(document: vscode.TextDocument, position: vscode.Position): vscode.Location | undefined {
        const lines: any = document.getText().split(/\r\n/g);
        const cursorLine = lines[position.line];
        const wordPosition = cursorLine.slice(0, position.character).split(/\b/g).length - 1;
        const words = cursorLine.split(/\b/g);
        const word = words[wordPosition];

        for (var i = 0; i < lines.length; i++) {
            const line = lines[i];
            const functions = line.matchAll(
                new RegExp(
                    `(?<=(void|int|float|bool|String|Vector|string|vector|char|long|double)[\\s\\r\\n]+)${word}(?=[\\s\\r\\n]*\\()`,
                    "g"
                )
            );
            for (var definition of functions) {
                return new vscode.Location(
                    document.uri,
                    new vscode.Range(
                        new vscode.Position(i, definition.index),
                        new vscode.Position(i, definition.index + definition[0].length)
                    )
                );
            }
        }

        for (var i = 0; i < lines.length; i++) {
            const line = lines[i];
            const rules = line.matchAll(
                new RegExp(`(?<=rule[\\s\\r\\n]+)${word}`, "g")
            );
            for (var definition of rules) {
                console.log(i);
                return new vscode.Location(
                    document.uri,
                    new vscode.Range(
                        new vscode.Position(i, definition.index),
                        new vscode.Position(i, definition.index + definition[0].length)
                    )
                );
            }
        }

        var latestVarDefinition: vscode.Range;
        for (var i = 0; i <= position.line; i++) {
            const line = lines[i];
            const variables = line.matchAll(
                new RegExp(`(?<=(int|float|bool|String|Vector|string|vector|char|long|double)[\\s\\r\\n]+)${word}`, "g")
            );
            for (var definition of variables) {
                latestVarDefinition = new vscode.Range(
                    new vscode.Position(i, definition.index),
                    new vscode.Position(i, definition.index + definition[0].length)
                );
            }
        }
        if (latestVarDefinition) {
            return new vscode.Location(document.uri, latestVarDefinition);
        }
        return undefined;
    }
}
