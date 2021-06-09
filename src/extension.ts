import * as vscode from "vscode";
import { CompletionProvider } from "./completion/codeCompletionProvider";
import { TokenProvider, tokenLegend } from "./semantic/semanticHighlightingProvider";
import { HoverProvider } from "./hover/hoverInfoProvider";
import { GoToDefinitionProvider } from "./definition/definitionProvider";

export function activate() {
    vscode.languages.registerDocumentSemanticTokensProvider("xs", new TokenProvider(), tokenLegend);
    vscode.languages.registerCompletionItemProvider("xs", new CompletionProvider());
    vscode.languages.registerHoverProvider("xs", new HoverProvider());
    vscode.languages.registerDefinitionProvider("xs", new GoToDefinitionProvider());
}

export function deactivate() {}
