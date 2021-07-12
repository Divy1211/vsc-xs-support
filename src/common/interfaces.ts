import * as vscode from "vscode";

export interface IParsedToken {
    line: number;
    startChar: number;
    length: number;
    tokenType: string;
    tokenModifiers: string[];
}

export interface Occurance {
    fileName: string; // this is function name in case of parameter occurance
    startLine: number;
    endLine: number;
    startChar: number;
    length: number;
}

export interface Variable {
    startLine: number;
    endLine: number;
    startChar: number;
    length: number;
    exported: boolean;
    fromFile: vscode.TextDocument;
    constant: boolean;
    type: string;
    name: string;
    value: any;
    scope: number[]; // 0: starting line, 1: ending line
    occurances: Occurance[];
}

export interface Function {
    startLine: number;
    endLine: number;
    startChar: number;
    fromFile: vscode.TextDocument;
    returnType: string;
    name: string;
    parameters: Parameter[];
    length: number;
    feLine: number;
    occurances: Occurance[];
}

export interface Parameter {
    startLine: number;
    endLine: number;
    startChar: number;
    length: number;
    type: string;
    name: string;
    defaultValue: any;
    occurances: Occurance[];
}

export interface Rule {
    startLine: number;
    endLine: number;
    startChar: number;
    fromFile: vscode.TextDocument;
    name: string;
    groupName: string;
    length: number;
    proto: string;
    occurances: Occurance[];
}
