import * as vscode from "vscode";
import fd from "../data/functions.json";
import cd from "../data/constants.json";

const functionDocs: { [index: string]: any } = fd;
const constantDocs: { [index: string]: any } = cd;

function getFunctionCompletion() {
    const functionCompletion = [];
    for (var key in functionDocs) {
        const func = functionDocs[key];
        const completionItem = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
        var functionSnippetString = `${func.name}(`;
        var functionDocString = `\`\`\`java\n${func.return_type} ${func.name}(`;
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
            functionParameterInfo = "\n\n**Parameters**\n"+functionParameterInfo;
        }
        functionSnippetString += ")";
        functionDocString += ")\n```\n\n" + func.desc + "\n\n" + functionParameterInfo;

        completionItem.insertText = new vscode.SnippetString(functionSnippetString);
        completionItem.documentation = new vscode.MarkdownString(functionDocString);
        functionCompletion.push(completionItem);
    }
    return functionCompletion;
}

function toTitle(str: string): string {
    str = str.slice(1);
    str = str.split(/(?=[A-Z])/g).join(" ");
    return str.trim().replace("Attribute", "");
}

function getConstantCompletion() {
    const constantCompletion = [];
    for (var key in constantDocs) {
        const constant = constantDocs[key];
        const completionItem = new vscode.CompletionItem(constant.name, vscode.CompletionItemKind.Constant);
        completionItem.insertText = new vscode.SnippetString(constant.name);
        var constantDocString =
            "```java\n" + constant.type + " " + constant.name + " = " + constant.value + "\n```\n\n";
        constantDocString += constant.desc.replace("RES_NAME", toTitle(constant.name));
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

export class CompletionProvider implements vscode.CompletionItemProvider<vscode.CompletionItem> {
    provideCompletionItems() {
        return [...getFunctionCompletion(), ...getConstantCompletion()];
    }
}
