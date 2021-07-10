import * as vscode from "vscode";
import * as parsedTokenGen from "./parsedTokenGenerator";
import * as fileParser from "../common/fileParser";
import { IParsedToken } from "../common/interfaces";

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

export const tokenLegend = (() => {
    const tokenTypesLegend = [
        "comment",
        "string",
        "keyword",
        "number",
        "regexp",
        "operator",
        "namespace",
        "type",
        "struct",
        "class",
        "interface",
        "enum",
        "typeParameter",
        "function",
        "method",
        "macro",
        "variable",
        "parameter",
        "property",
        "label",
    ];
    tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

    const tokenModifiersLegend = [
        "declaration",
        "documentation",
        "readonly",
        "static",
        "abstract",
        "deprecated",
        "modification",
        "async",
    ];
    tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

    return new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);
})();

function encodeTokenType(tokenType: string): number {
    if (tokenTypes.has(tokenType)) {
        return tokenTypes.get(tokenType)!;
    } else if (tokenType === "notInLegend") {
        return tokenTypes.size + 2;
    }
    return 0;
}

function encodeTokenModifiers(strTokenModifiers: string[]): number {
    let result = 0;
    for (let i = 0; i < strTokenModifiers.length; i++) {
        const tokenModifier = strTokenModifiers[i];
        if (tokenModifiers.has(tokenModifier)) {
            result = result | (1 << tokenModifiers.get(tokenModifier)!);
        } else if (tokenModifier === "notInLegend") {
            result = result | (1 << (tokenModifiers.size + 2));
        }
    }
    return result;
}

export class ContextBasedTokenProvider implements vscode.DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document: vscode.TextDocument): Promise<vscode.SemanticTokens> {

        fileParser.startDetectingLiveChanges(document);
        await fileParser.generateFileInfo(document);
        
        // console.log(document.fileName);
        // console.log(fileParser.constants[document.fileName]);
        
        
        const tokens: IParsedToken[] = [];
        tokens.push(...parsedTokenGen.getConstantTokens(document.fileName));
        // tokens.push(...parsedTokenGen.getParameterTokens(text));
        // tokens.push(...parsedTokenGen.getRuleTokens(text));
        // tokens.push(...parsedTokenGen.getIncludedConstantTokens(text, includedFileTexts));

        // tokens.push(...await getIncludedRuleTokens(text, document));

        const builder = new vscode.SemanticTokensBuilder();
        tokens.forEach((token) => {
            builder.push(
                token.line,
                token.startChar,
                token.length,
                encodeTokenType(token.tokenType),
                encodeTokenModifiers(token.tokenModifiers)
            );
        });
        return builder.build();
    }
}
