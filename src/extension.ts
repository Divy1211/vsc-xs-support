import * as vscode from "vscode";
import { CompletionProvider } from "./completion/codeCompletionProvider";
import { TokenProvider, tokenLegend } from "./semantic/semanticHighlightingProvider";
import {HoverProvider} from "./hover/hoverInfoProvider";

export function activate() {
    vscode.languages.registerDocumentSemanticTokensProvider("xs", new TokenProvider(), tokenLegend);
    vscode.languages.registerCompletionItemProvider("xs", new CompletionProvider());
    vscode.languages.registerHoverProvider("xs", new HoverProvider());
}
export function deactivate() {}