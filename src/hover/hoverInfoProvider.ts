import * as vscode from "vscode";
import fd from "../data/functions.json";
import cd from "../data/constants.json";

const functionDocs: { [index: string]: any } = fd;
const constantDocs: { [index: string]: any } = cd;

function toTitle(str: string): string {
    str = str.slice(1);
    str = str.split(/(?=[A-Z])/g).join(" ");
    return str.trim().replace("Attribute", "");
}

export class HoverProvider implements vscode.HoverProvider {
    provideHover(document: any, position: vscode.Position): vscode.ProviderResult<vscode.Hover> {
        const cusrsorLine = document.getText().split(/\r\n/g)[position.line];
        const wordPosition = cusrsorLine.slice(0, position.character).split(/\b/g).length - 1;
        const words = cusrsorLine.split(/\b/g);
        const word = words[wordPosition];
        const wordStart = words.slice(0, wordPosition).join("").length;
        const wordEnd = words.slice(0, wordPosition + 1).join("").length;
        if (word in functionDocs) {
            var func = functionDocs[word];
            var functionDocString = `\`\`\`java\n${func.return_type} ${func.name}(`;
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
                functionParameterInfo = "\n\n**Parameters**\n"+functionParameterInfo;
            }
            functionDocString += ")\n```\n\n" + func.desc + "\n\n" + functionParameterInfo;
            return new vscode.Hover(
                new vscode.MarkdownString(functionDocString),
                new vscode.Range(
                    new vscode.Position(position.line, wordStart),
                    new vscode.Position(position.line, wordEnd)
                )
            );
        }
        else if (word in constantDocs) {
            const constant = constantDocs[word];
            var constantDocString =
                "```java\n" + constant.type + " " + constant.name + " = " + constant.value + "\n```\n\n";
            constantDocString += constant.desc.replace("RES_NAME", toTitle(constant.name));
            if (constant.usage) {
                constantDocString += "\n\nSyntax: `" + constant.usage.syntax + "`\n\n";
                constantDocString += "Example: `" + constant.usage.example + "`\n\n";
                constantDocString += "" + constant.usage.explanation;
            }
            return new vscode.Hover(
                new vscode.MarkdownString(constantDocString),
                new vscode.Range(
                    new vscode.Position(position.line, wordStart),
                    new vscode.Position(position.line, wordEnd)
                )
            );
        }
        return undefined;
    }
}
