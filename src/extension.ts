import * as vscode from "vscode";
import { ContextBasedTokenProvider, tokenLegend } from "./semantic/semanticHighlightingProvider";
import { CompletionProvider } from "./completion/codeCompletionProvider";
import { HoverProvider } from "./hover/hoverInfoProvider";
import { GoToDefinitionProvider } from "./definition/definitionProvider";

var resources: vscode.Disposable[] = [];

export function activate() {
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
