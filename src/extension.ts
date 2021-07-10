import * as vscode from "vscode";
import { ContextBasedTokenProvider, tokenLegend } from "./semantic/semanticHighlightingProvider";
import { CompletionProvider } from "./completion/codeCompletionProvider";
import { HoverProvider } from "./hover/hoverInfoProvider";
import { GoToDefinitionProvider } from "./definition/definitionProvider";
import * as fileParser from "./common/fileParser";

export function activate() {
    // fileParser.findPaths();
    vscode.languages.registerDocumentSemanticTokensProvider("xs", new ContextBasedTokenProvider(), tokenLegend);
    // completion suggestions in wrong scope
    // for loop var of iteration detection
    vscode.languages.registerCompletionItemProvider("xs", new CompletionProvider());
    vscode.languages.registerHoverProvider("xs", new HoverProvider());
    vscode.languages.registerDefinitionProvider("xs", new GoToDefinitionProvider());
}

export function deactivate() {}
