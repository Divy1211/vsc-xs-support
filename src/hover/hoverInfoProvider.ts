import * as vscode from "vscode";
import fd from "../common/data/functions.json";
import cd from "../common/data/constants.json";
import kw from "../common/data/keywords.json";
import * as fileParser from "../common/fileParser";
import { Variable, Function, Rule } from "../common/interfaces";

const functionDocs: { [index: string]: any } = fd;
const constantDocs: { [index: string]: any } = cd;
const keywordDocs: { [index: string]: any } = kw;

function toTitle(str: string): string {
    str = str.slice(1);
    str = str.split(/(?=[A-Z])/g).join(" ");
    return str.trim().replace("Attribute", "");
}

function builtinHoverProvider(position: vscode.Position, word: string, wordEnd: number, wordStart: number) {
    var func = functionDocs[word];
    var functionDocString = `\`\`\`xs\n${func.return_type} ${func.name}(`;
    var functionParameterInfo = "";
    var paramCount = 0;
    for (var param of func.params) {
        paramCount += 1;
        functionDocString += "\n\t" + param.type + " " + param.name + ", ";

        functionParameterInfo += paramCount + ".";
        if (!param.required) {
            functionParameterInfo += " (Optional)";
        }
        functionParameterInfo += " **`" + param.name + ":`** " + param.desc + "\n";
    }
    if (paramCount !== 0) {
        functionDocString = functionDocString.slice(0, -2) + "\n";
        functionParameterInfo = "\n\n**Parameters**\n" + functionParameterInfo;
    }
    functionDocString += ")\n```\n\n" + func.desc + "\n\n" + functionParameterInfo;
    return new vscode.Hover(
        new vscode.MarkdownString(functionDocString),
        new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
    );
}

function constantHoverProvider(position: vscode.Position, word: string, wordStart: number, wordEnd: number) {
    const constant = constantDocs[word];
    var constantDocString = "```xs\n" + constant.type + " " + constant.name + " = " + constant.value + "\n```\n\n";
    constantDocString += constant.desc.replace(/(RES_NAME|CIV_NAME|ATTR_NAME|CLASS_NAME)/g, toTitle(constant.name));
    if (constant.usage) {
        constantDocString += "\n\nSyntax: `" + constant.usage.syntax + "`\n\n";
        constantDocString += "Example: `" + constant.usage.example + "`\n\n";
        constantDocString += "" + constant.usage.explanation;
    }
    return new vscode.Hover(
        new vscode.MarkdownString(constantDocString),
        new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
    );
}

function keywordHoverProvider(position: vscode.Position, word: string, wordStart: number, wordEnd: number) {
    const keyword = keywordDocs[word];
    if (keyword.desc) {
        var docString = keyword.desc;
        return new vscode.Hover(
            new vscode.MarkdownString(docString),
            new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
        );
    }
}

function variableHoverProvider(position: vscode.Position, variables: Variable[], wordStart: number, wordEnd: number) {
    for (const variable of variables) {
        if (!(variable.scope[0] <= position.line) || !(variable.scope[1] === -1 || position.line <= variable.scope[1])) {
            continue;
        }
        var docString = `\`\`\`xs\n${variable.type} ${variable.name}\n\`\`\``;
        if (variable.constant) {
            docString = `\`\`\`xs\nconst ${variable.type} ${variable.name} = ${variable.value}\n\`\`\``;
        }
        return new vscode.Hover(
            new vscode.MarkdownString(docString),
            new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
        );
    }
}

function functionHoverProvider(document: vscode.TextDocument, position: vscode.Position, func: Function, wordStart: number, wordEnd: number) {
    if (func.fromFile.fileName === document.fileName && !(func.startLine < position.line)) {
        return undefined;
    }
    var functionDocString = `\`\`\`xs\n${func.returnType} ${func.name}(`;
    var paramCount = 0;
    for (var param of func.parameters) {
        paramCount += 1;
        functionDocString += "\n\t" + param.type + " " + param.name + " = " + param.defaultValue + ", ";
    }
    if (paramCount !== 0) {
        functionDocString = functionDocString.slice(0, -2) + "\n";
    }
    functionDocString += ")\n```\n\n";
    return new vscode.Hover(
        new vscode.MarkdownString(functionDocString),
        new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
    );
}

function ruleHoverProvider(position: vscode.Position, rule: Rule, wordStart: number, wordEnd: number) {
    var ruleProto = `\`\`\`xs\n${rule.proto.slice(0, -2)}\n\`\`\``;
    return new vscode.Hover(
        new vscode.MarkdownString(ruleProto),
        new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
    );
}

function groupHoverProvider(position: vscode.Position, rules: string[], wordStart: number, wordEnd: number) {
    var ruleList = `The following rules are part of this rule group:\n\n\`\`\`xs\n`;
    for(var ruleName of rules) {
        ruleList+=ruleName+`\n`;
    }
    ruleList+=`\n\`\`\``;
    return new vscode.Hover(
        new vscode.MarkdownString(ruleList),
        new vscode.Range(new vscode.Position(position.line, wordStart), new vscode.Position(position.line, wordEnd))
    );
}

function parameterHoverProvider(document: vscode.TextDocument, position: vscode.Position, word: string, wordStart: number, wordEnd: number) {
    for (const funcName in fileParser.functions[document.fileName]) {
        const func = fileParser.functions[document.fileName][funcName][0];
        if (func.fromFile.fileName === document.fileName) {
            if (func.startLine < position.line && position.line < func.feLine) {
                for (const param of func.parameters) {
                    if (param.name === word) {
                        var docString = `\`\`\`xs\n${param.type} ${param.name} = ${param.defaultValue}\n\`\`\``;
                        return new vscode.Hover(
                            new vscode.MarkdownString(docString),
                            new vscode.Range(
                                new vscode.Position(position.line, wordStart),
                                new vscode.Position(position.line, wordEnd)
                            )
                        );
                    }
                }
            }
        }
    }
    return undefined;
}

export class HoverProvider implements vscode.HoverProvider {
    provideHover(document: any, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        const cursorLine = document.getText().split(/\r\n/g)[position.line];
        const lineTillCursor = cursorLine.slice(0, position.character);
        if (lineTillCursor.indexOf("//") !== -1) {
            return undefined;
        }
        const wordPosition = lineTillCursor.split(/\b/g).length - 1;
        const words = cursorLine.split(/\b/g);
        const word = words[wordPosition];
        const wordStart = words.slice(0, wordPosition).join("").length;
        const wordEnd = words.slice(0, wordPosition + 1).join("").length;
        if (word in functionDocs) {
            return builtinHoverProvider(position, word, wordStart, wordEnd);
        } else if (word in constantDocs) {
            return constantHoverProvider(position, word, wordStart, wordEnd);
        } else if (word in keywordDocs) {
            return keywordHoverProvider(position, word, wordStart, wordEnd);
        } else if (word in fileParser.variables[document.fileName]) {
            return variableHoverProvider(position, fileParser.variables[document.fileName][word], wordStart, wordEnd);
        } else if (word in fileParser.functions[document.fileName]) {
            return functionHoverProvider(document, position, fileParser.functions[document.fileName][word][0], wordStart, wordEnd);
        } else if (word in fileParser.rules[document.fileName]) {
            return ruleHoverProvider(position, fileParser.rules[document.fileName][word][0], wordStart, wordEnd);
        } else if (word in fileParser.groups[document.fileName]) {
            return groupHoverProvider(position, fileParser.groups[document.fileName][word], wordStart, wordEnd);
        } else {
            return parameterHoverProvider(document, position, word, wordStart, wordEnd);
        }
    }
}
