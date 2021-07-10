import * as vscode from "vscode";
import fd from "../data/functions.json";
import cd from "../data/constants.json";
import kw from "../data/keywords.json";
import * as fileParser from "../common/fileParser";

const functionDocs: { [index: string]: any } = fd;
const constantDocs: { [index: string]: any } = cd;
const keywordDocs: { [index: string]: any } = kw;

function toTitle(str: string): string {
    str = str.slice(1);
    str = str.split(/(?=[A-Z])/g).join(" ");
    return str.trim().replace("Attribute", "");
}

function getBuiltinCompletion(word: string) {
    const functionCompletion = [];
    for (var key in functionDocs) {
        if (!key.startsWith(word)) {
            continue;
        }
        const func = functionDocs[key];
        const completionItem = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
        var functionSnippetString = `${func.name}(`;
        var functionDocString = `\`\`\`xs\n${func.return_type} ${func.name}(`;
        var functionParameterInfo = "";
        var paramCount = 0;
        for (var param of func.params) {
            paramCount += 1;
            functionSnippetString += "${" + paramCount + ":" + param.type + " " + param.name + "}, ";
            functionDocString += "\n\t" + param.type + " " + param.name + ", ";

            functionParameterInfo += paramCount + ".";
            if (!param.required) {
                functionParameterInfo += " (Optional)";
            }
            functionParameterInfo += " **`" + param.name + ":`** " + param.desc + "\n";
        }
        if (paramCount !== 0) {
            functionSnippetString = functionSnippetString.slice(0, -2);
            functionDocString = functionDocString.slice(0, -2) + "\n";
            functionParameterInfo = "\n\n**Parameters**\n" + functionParameterInfo;
        }
        functionSnippetString += ")";
        functionDocString += ")\n```\n\n" + func.desc + "\n\n" + functionParameterInfo;

        completionItem.insertText = new vscode.SnippetString(functionSnippetString);
        completionItem.documentation = new vscode.MarkdownString(functionDocString);
        functionCompletion.push(completionItem);
    }
    return functionCompletion;
}

function getConstantCompletion(word: string) {
    const constantCompletion = [];
    for (var key in constantDocs) {
        if (!key.startsWith(word)) {
            continue;
        }
        const constant = constantDocs[key];
        const completionItem = new vscode.CompletionItem(constant.name, vscode.CompletionItemKind.Constant);
        completionItem.insertText = new vscode.SnippetString(constant.name);
        var constantDocString = "```xs\n" + constant.type + " " + constant.name + " = " + constant.value + "\n```\n\n";
        constantDocString += constant.desc.replace(/(RES_NAME|CIV_NAME|ATTR_NAME|CLASS_NAME)/g, toTitle(constant.name));
        if (constant.usage) {
            constantDocString += "\n\nSyntax: `" + constant.usage.syntax + "`\n\n";
            constantDocString += "Example: `" + constant.usage.example + "`\n\n";
            constantDocString += "" + constant.usage.explanation;
        }
        completionItem.documentation = new vscode.MarkdownString(constantDocString);
        constantCompletion.push(completionItem);
    }
    return constantCompletion;
}

function getKeywordCompletion(word: string) {
    const keywordCompletion = [];
    for (var key in keywordDocs) {
        if (!key.startsWith(word)) {
            continue;
        }
        const keyword = keywordDocs[key];
        const completionItem = new vscode.CompletionItem(keyword.name, vscode.CompletionItemKind.Keyword);
        completionItem.insertText = new vscode.SnippetString(keyword.syntax ?? keyword.name);
        if (keyword.desc) {
            completionItem.documentation = new vscode.MarkdownString(keyword.desc);
        }
        keywordCompletion.push(completionItem);
    }
    return keywordCompletion;
}

function getVariableCompletion(document: vscode.TextDocument, position: vscode.Position, word: string) {
    const variableCompletion = [];
    for (var varName in fileParser.variables[document.fileName]) {
        const variables = fileParser.variables[document.fileName][varName];
        for(const variable of variables) {
            if (!varName.startsWith(word)) {
                continue;
            }
            if (!(variable.scope[0] <= position.line) || !(variable.scope[1] === -1 || position.line < variable.scope[1])) {
                continue;
            }
            var kind = vscode.CompletionItemKind.Variable;
            var docString = `\`\`\`xs\n${variable.type} ${variable.name}\n\`\`\``;
            if (variable.constant) {
                kind = vscode.CompletionItemKind.Constant;
                docString = `\`\`\`xs\nconst ${variable.type} ${variable.name} = ${variable.value}\n\`\`\``;
            }
            const completionItem = new vscode.CompletionItem(variable.name, kind);
            completionItem.insertText = new vscode.SnippetString(variable.name);
            completionItem.documentation = new vscode.MarkdownString(docString);
            variableCompletion.push(completionItem);
        }
    }
    return variableCompletion;
}

export class CompletionProvider implements vscode.CompletionItemProvider<vscode.CompletionItem> {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const lines = document.getText().split(/\r\n/g);
        const cursorLine = lines[position.line];
        const lineTilleCursor = cursorLine.slice(0, position.character);
        if (lineTilleCursor.indexOf("//") !== -1) {
            return undefined;
        }
        const word = lineTilleCursor.split(/\b/s).slice(-1)[0];
        return [
            ...getBuiltinCompletion(word),
            ...getConstantCompletion(word),
            ...getKeywordCompletion(word),
            ...getVariableCompletion(document, position, word),
            // ...getFunctionCompletion(document, position, word),
            // ...getRuleCompletion(document, position, word)
        ];
    }
}