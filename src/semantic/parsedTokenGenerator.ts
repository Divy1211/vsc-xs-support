import { IParsedToken } from "../common/interfaces";
import * as fileParser from "../common/fileParser";

export function getConstantTokens(fileName: string): IParsedToken[] {
    const constantTokens: IParsedToken[] = [];

    const variables = fileParser.variables[fileName];
    for (const varName in variables) {
        for (const variable of variables[varName]) {
            if (!variable.constant) {
                continue;
            }
            if (variable.fromFile.fileName === fileName) {
                constantTokens.push({
                    line: variable.startLine,
                    startChar: variable.startChar,
                    length: variable.length,
                    tokenType: "variable",
                    tokenModifiers: ["readonly"],
                });
            }
            for (const occurance of variable.occurances) {
                if (occurance.fileName === fileName) {
                    constantTokens.push({
                        line: occurance.startLine,
                        startChar: occurance.startChar,
                        length: occurance.length,
                        tokenType: "variable",
                        tokenModifiers: ["readonly"],
                    });
                }
            }
        }
    }

    return constantTokens;
}

export function getParameterTokens(fileName: string): IParsedToken[] {
    const parameterTokens: IParsedToken[] = [];
    for (const funcName in fileParser.functions[fileName]) {
        const func = fileParser.functions[fileName][funcName][0];
        if (func.fromFile.fileName === fileName) {
            for (const param of func.parameters) {
                parameterTokens.push({
                    line: func.startLine + param.startLine,
                    startChar: func.startChar + param.startChar,
                    length: param.length,
                    tokenType: "parameter",
                    tokenModifiers: ["declaration"],
                });
                for (const occurance of param.occurances) {
                    parameterTokens.push({
                        line: func.startLine + occurance.startLine,
                        startChar: func.startChar + occurance.startChar,
                        length: occurance.length,
                        tokenType: "parameter",
                        tokenModifiers: [],
                    });
                }
            }
        }
    }
    return parameterTokens;
}