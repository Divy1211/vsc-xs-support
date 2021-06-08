import {IParsedToken} from "./IParsedToken";

function count(str: string, char: string): number {
    return str.split(char).length - 1;
}

function scope(str: string): number {
    var openingCount = count(str, "{");
    var closingCount = count(str, "}");
    return openingCount - closingCount;
}

export function getConstantTokens(text: any): IParsedToken[] {
    const constantTokens: IParsedToken[] = [];

    const constants = text.matchAll(
        /(?<=const[\s\r\n]+(int|float|bool|String|Vector|string|vector|char|long|double)[\s\r\n]+)[a-zA-Z_]+[a-zA-Z_0-9]*/g
    );

    for (var constant of constants) {
        const codeTillDeclaration = text.slice(0, constant.index);
        const constantScope = scope(codeTillDeclaration);

        const occurances = text.matchAll(new RegExp(`\\b${constant[0]}\\b`, "g"));

        for (var occurance of occurances) {
            const codeTillOccurance = text.slice(0, occurance.index);
            const occuranceScope = scope(codeTillOccurance);

            if (occurance.index >= constant.index && occuranceScope >= constantScope) {
                const linesOfCodeTillOccurance = codeTillOccurance.split("\r\n");
                
                const lineCount = linesOfCodeTillOccurance.length - 1;
                const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;

                constantTokens.push({
                    line: lineCount,
                    startCharacter: lineCharCount,
                    length: occurance[0].length,
                    tokenType: "variable",
                    tokenModifiers: ["readonly"],
                });
            }
        }
    }
    return constantTokens;
}

export function getParameterTokens(text: any): IParsedToken[] {
    const parameterTokens: IParsedToken[] = [];

    const params = text.matchAll(
        /(?<=(void|int|float|bool|String|Vector|string|vector|char|long|double)[\s\r\n]+[a-zA-Z_]+[a-zA-Z_0-9]*[\s\r\n]*\()[^\)]*/g
    );
    for (var param of params) {
        const names = param[0].matchAll(/(?<=(int|float|bool|String|Vector|string|vector|char|long|double)[\s\r\n]+)[a-zA-Z_]+[a-zA-Z_0-9]*/g);

        const scopeStartIndex = param.index+param[0].length;
        var scopeEndIndex = 0;
        var openingCount = 0;
        var closingCount = 0;

        for(var i = scopeStartIndex; i < text.length; i++) {
            if(text[i] === "{") {
                openingCount += 1;
            }
            else if(text[i] === "}") {
                closingCount += 1;
            }
            if(openingCount > 0 && openingCount === closingCount) {
                scopeEndIndex = i;
                break;
            }
        }
        
        for(var name of names) {
            const codeTillName = text.slice(0, param.index+name.index);
            const linesOfCodeTillName = codeTillName.split("\r\n");

            const lineCount = linesOfCodeTillName.length - 1;
            const lineCharCount = linesOfCodeTillName.slice(-1)[0].length;

            parameterTokens.push({
                line: lineCount,
                startCharacter: lineCharCount,
                length: name[0].length,
                tokenType: "parameter",
                tokenModifiers: ["declaration"],
            });

            const occurances = text.matchAll(new RegExp(`\\b${name[0]}\\b`, "g"));
            for (var occurance of occurances) {
                const codeTillOccurance = text.slice(0, occurance.index);
                if (scopeStartIndex <= occurance.index && occurance.index <= scopeEndIndex) {
                    const linesOfCodeTillOccurance = codeTillOccurance.split("\r\n");
                    const lineCount = linesOfCodeTillOccurance.length - 1;
                    const lineCharCount = linesOfCodeTillOccurance.slice(-1)[0].length;
    
                    parameterTokens.push({
                        line: lineCount,
                        startCharacter: lineCharCount,
                        length: occurance[0].length,
                        tokenType: "parameter",
                        tokenModifiers: [],
                    });
                }
            }
        }
    }
    return parameterTokens;
}