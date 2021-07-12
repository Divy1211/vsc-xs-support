import * as vscode from "vscode";
import fd from "../common/data/functions.json";
import cd from "../common/data/constants.json";
import kw from "../common/data/keywords.json";
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
    var functionCompletion = [];
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
    var constantCompletion = [];
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
    var keywordCompletion = [];
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
    var variableCompletion = [];
    for (var varName in fileParser.variables[document.fileName]) {
        const variables = fileParser.variables[document.fileName][varName];
        for (const variable of variables) {
            if (!varName.startsWith(word)) {
                continue;
            }
            if (
                !(variable.scope[0] <= position.line) ||
                !(variable.scope[1] === -1 || position.line <= variable.scope[1])
            ) {
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

function getParameterCompleteion(document: vscode.TextDocument, position: vscode.Position, word: string) {
    var parameterCompletion = [];
    for (const funcName in fileParser.functions[document.fileName]) {
        const func = fileParser.functions[document.fileName][funcName][0];
        if (func.fromFile.fileName === document.fileName) {
            if (func.startLine < position.line && position.line < func.feLine) {
                for (const param of func.parameters) {
                    if (param.name.startsWith(word)) {
                        var kind = vscode.CompletionItemKind.Variable;
                        var docString = `\`\`\`xs\n${param.type} ${param.name} = ${param.defaultValue}\n\`\`\``;
                        const completionItem = new vscode.CompletionItem(param.name, kind);
                        completionItem.insertText = new vscode.SnippetString(param.name);
                        completionItem.documentation = new vscode.MarkdownString(docString);
                        parameterCompletion.push(completionItem);
                    }
                }
            }
        }
    }
    return parameterCompletion;
}

function getFunctionCompletion(document: vscode.TextDocument, position: vscode.Position, word: string) {
    var functionCompletion = [];
    for (var key in fileParser.functions[document.fileName]) {
        if (!key.startsWith(word)) {
            continue;
        }
        const func = fileParser.functions[document.fileName][key][0];
        if (func.startLine >= position.line) {
            continue;
        }
        const completionItem = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
        var functionSnippetString = `${func.name}(`;
        var functionDocString = `\`\`\`xs\n${func.returnType} ${func.name}(`;
        var paramCount = 0;
        for (var param of func.parameters) {
            paramCount += 1;
            functionSnippetString += "${" + paramCount + ":" + param.type + " " + param.name + "}, ";
            functionDocString += "\n\t" + param.type + " " + param.name + " = " + param.defaultValue + ", ";
        }
        if (paramCount !== 0) {
            functionSnippetString = functionSnippetString.slice(0, -2);
            functionDocString = functionDocString.slice(0, -2) + "\n";
        }
        functionSnippetString += ")";
        functionDocString += ")\n```\n\n";

        completionItem.insertText = new vscode.SnippetString(functionSnippetString);
        completionItem.documentation = new vscode.MarkdownString(functionDocString);
        functionCompletion.push(completionItem);
    }
    return functionCompletion;
}

function getRuleCompletion(document: vscode.TextDocument, position: vscode.Position, word: string) {
    var ruleCompletion = [];
    for (var key in fileParser.rules[document.fileName]) {
        if (!key.startsWith(word)) {
            continue;
        }
        const rule = fileParser.rules[document.fileName][key][0];
        const completionItem = new vscode.CompletionItem(rule.name, vscode.CompletionItemKind.Function);
        var ruleProto = `\`\`\`xs\n${rule.proto.slice(0, -2)}\n\`\`\``;
        completionItem.insertText = new vscode.SnippetString(rule.name);
        completionItem.documentation = new vscode.MarkdownString(ruleProto);
        ruleCompletion.push(completionItem);
    }
    return ruleCompletion;
}

function getGroupCompletion(document: vscode.TextDocument, position: vscode.Position, word: string) {
    var groupCompletion = [];
    for (var key in fileParser.groups[document.fileName]) {
        if (!key.startsWith(word)) {
            continue;
        }
        const rules = fileParser.groups[document.fileName][key];
        var ruleList = `The following rules are part of this rule group:\n\n\`\`\`xs\n`;
        for (var ruleName of rules) {
            ruleList += ruleName + `\n`;
        }
        ruleList += `\n\`\`\``;
        const completionItem = new vscode.CompletionItem(key, vscode.CompletionItemKind.Module);
        completionItem.insertText = new vscode.SnippetString(key);
        completionItem.documentation = new vscode.MarkdownString(ruleList);
        groupCompletion.push(completionItem);
    }
    return groupCompletion;
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
            ...getParameterCompleteion(document, position, word),
            ...getFunctionCompletion(document, position, word),
            ...getRuleCompletion(document, position, word),
            ...getGroupCompletion(document, position, word),
        ];
    }
}
