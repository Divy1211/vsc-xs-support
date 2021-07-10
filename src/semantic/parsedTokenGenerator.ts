import { IParsedToken } from "../common/interfaces";
import * as fileParser from "../common/fileParser";
import { privateEncrypt } from "crypto";

export function getConstantTokens(fileName: string): IParsedToken[] {
    const constantTokens: IParsedToken[] = [];

    const variables = fileParser.variables[fileName];
    for (const varName in variables) {
        for(const variable of variables[varName]) {
            if(!variable.constant) {
                continue;
            }
            if(variable.fromFile.fileName === fileName) {
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

// export function getParameterTokens(text: any): IParsedToken[] {
//     const parameterTokens: IParsedToken[] = [];

//     const params = text.matchAll(
//         /(?<=(?<!\/\/.*)(?<=\b)(void|int|float|bool|String|Vector|string|vector|char|long|double)[\s\r\n]+[a-zA-Z_]+[a-zA-Z_0-9]*[\s\r\n]*\()[^\)]*/g
//     );
//     for (var param of params) {
//         const names = param[0].matchAll(
//             /(?<=(?<=\b)(int|float|bool|String|Vector|string|vector|char|long|double)[\s\r\n]+)[a-zA-Z_]+[a-zA-Z_0-9]*/g
//         );

//         const scopeStartIndex = param.index + param[0].length;
//         var scopeEndIndex = 0;
//         var openingCount = 0;
//         var closingCount = 0;

//         for (var i = scopeStartIndex; i < text.length; i++) {
//             if (text[i] === "{") {
//                 openingCount += 1;
//             } else if (text[i] === "}") {
//                 closingCount += 1;
//             }
//             if (openingCount > 0 && openingCount === closingCount) {
//                 scopeEndIndex = i;
//                 break;
//             }
//         }

//         for (var name of names) {
//             const codeTillName = text.slice(0, param.index + name.index);
//             const linesOfCodeTillName = codeTillName.split("\r\n");

//             const lineCount = linesOfCodeTillName.length - 1;
//             const lineCharCount = linesOfCodeTillName.slice(-1)[0].length;

//             parameterTokens.push({
//                 line: lineCount,
//                 startChar: lineCharCount,
//                 length: name[0].length,
//                 tokenType: "parameter",
//                 tokenModifiers: ["declaration"],
//             });

//             const occurances = text.matchAll(new RegExp(`(?<!\/\/.*)\\b${name[0]}\\b`, "g"));
//             for (var occurance of occurances) {
//                 const codeTillOccurance = text.slice(0, occurance.index);
//                 if (scopeStartIndex <= occurance.index && occurance.index <= scopeEndIndex) {
//                     const linesOfCodeTillOccurance = codeTillOccurance.split("\r\n");
//                     const lineCount = linesOfCodeTillOccurance.length - 1;
//                     const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

//                     parameterTokens.push({
//                         line: lineCount,
//                         startChar: lineCharCount,
//                         length: occurance[0].length,
//                         tokenType: "parameter",
//                         tokenModifiers: [],
//                     });
//                 }
//             }
//         }
//     }
//     return parameterTokens;
// }

// export function getRuleTokens(text: any): IParsedToken[] {
//     const ruleTokens: IParsedToken[] = [];
//     const rules = text.matchAll(/(?<=(?<!\/\/.*)(?<=\b)(rule|group)[\s\r\n]+)[a-zA-Z_]+[a-zA-Z_0-9]*/g);

//     for (var rule of rules) {
//         const occurances = text.matchAll(new RegExp(`(?<!\/\/.*)\\b${rule[0]}\\b`, "g"));

//         for (var occurance of occurances) {
//             const codeTillOccurance = text.slice(0, occurance.index);
//             const occuranceScope = scope(codeTillOccurance);
//             const linesOfCodeTillOccurance = codeTillOccurance.split("\r\n");

//             const lineCount = linesOfCodeTillOccurance.length - 1;
//             const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

//             ruleTokens.push({
//                 line: lineCount,
//                 startChar: lineCharCount,
//                 length: occurance[0].length,
//                 tokenType: "function",
//                 tokenModifiers: [],
//             });
//         }
//     }
//     return ruleTokens;
// }

// export function getIncludedRuleTokens(text: any, includedFileTexts: any): IParsedToken[] {
//     const ruleTokens: IParsedToken[] = [];
//     const rules = text.matchAll(/(?<=(?<!\/\/.*)(?<=\b)(rule|group)[\s\r\n]+)[a-zA-Z_]+[a-zA-Z_0-9]*/g);

//     for (var rule of rules) {
//         const occurances = text.matchAll(new RegExp(`(?<!\/\/.*)\\b${rule[0]}\\b`, "g"));

//         for (var occurance of occurances) {
//             const codeTillOccurance = text.slice(0, occurance.index);
//             const occuranceScope = scope(codeTillOccurance);
//             const linesOfCodeTillOccurance = codeTillOccurance.split("\r\n");

//             const lineCount = linesOfCodeTillOccurance.length - 1;
//             const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

//             ruleTokens.push({
//                 line: lineCount,
//                 startChar: lineCharCount,
//                 length: occurance[0].length,
//                 tokenType: "function",
//                 tokenModifiers: [],
//             });
//         }
//     }
//     return ruleTokens;
// }