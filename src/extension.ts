import * as vscode from "vscode";
import { ContextBasedTokenProvider, tokenLegend } from "./semantic/semanticHighlightingProvider";
import { CompletionProvider } from "./completion/codeCompletionProvider";
import { HoverProvider } from "./hover/hoverInfoProvider";
import { GoToDefinitionProvider } from "./definition/definitionProvider";

var resources: vscode.Disposable[] = [];

async function formatter() {
    const editor = vscode.window.activeTextEditor;
    if(editor) {
        var text = editor.document.getText();

        var strings = [];
        var i = 0;
        for(const string of text.matchAll(/"(?:(?!")(?:\\.|[^\\]))*"/g)) {
            strings.push(string[0]);
            text = text.replace(string[0], `REPLACESTRING${i}`);
            ++i;
        }

        // formatting code
        
        i = 0;
        for(const string of strings) {
            text = text.replace(`REPLACESTRING${i}`, string);
            ++i;
        }

        editor.edit(editBuilder => {
            editBuilder.replace(
                new vscode.Range(
                    new vscode.Position(0, 0),
                    new vscode.Position(editor.document.lineCount-1, editor.document.lineAt(editor.document.lineCount-1).text.length)
                ),
                text
            );
        });
    }
}

async function minifier() {
    const editor = vscode.window.activeTextEditor;
    if(editor) {
        var text = editor.document.getText();

        var strings = [];
        var i = 0;
        for(const string of text.matchAll(/"(?:(?!")(?:\\.|[^\\]))*"/g)) {
            strings.push(string[0]);
            text = text.replace(string[0], `REPLACESTRING${i}`);
            ++i;
        }

        // remove comments
        text = text.replace(/\/\/.*/g, "");
        text = text.replace(/\/\*.*\*\//sg, "");

        // remove new lines, redundant spaces and tabs
        text = text.replace(/(?:\n|\r|\t)/g, "");
        text = text.replace(/\s+/g, "");

        // remove redundant spaces
        text = text.replace(/\s+(\W+)\s+/g, "$1");
        text = text.replace(/(\W+)\s+/g, "$1");
        text = text.replace(/\s+(\W+)/g, "$1");
        
        i = 0;
        for(const string of strings) {
            text = text.replace(`REPLACESTRING${i}`, string);
            ++i;
        }

        editor.edit(editBuilder => {
            editBuilder.replace(
                new vscode.Range(
                    new vscode.Position(0, 0),
                    new vscode.Position(editor.document.lineCount-1, editor.document.lineAt(editor.document.lineCount-1).text.length)
                ),
                text
            );
        });
    }
}

export function activate() {

    // vscode.commands.registerCommand('xs.format', formatter);
    // vscode.commands.registerCommand('xs.minify', minifier);

    resources.push(
        vscode.languages.registerDocumentSemanticTokensProvider("xs", new ContextBasedTokenProvider(), tokenLegend)
    );
    resources.push(vscode.languages.registerCompletionItemProvider("xs", new CompletionProvider()));
    resources.push(vscode.languages.registerHoverProvider("xs", new HoverProvider()));
    resources.push(vscode.languages.registerDefinitionProvider("xs", new GoToDefinitionProvider()));
}

export function deactivate() {
    for (var resource of resources) {
        resource.dispose();
    }
    resources = [];
}
