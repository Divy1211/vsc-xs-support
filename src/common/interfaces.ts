import * as vscode from "vscode";

export interface IParsedToken {
    line: number;
    startChar: number;
    length: number;
    tokenType: string;
    tokenModifiers: string[];
}

export interface Occurance {
    fileName: string;
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
    endChar: number;
    returnType: string;
    name: string;
    proto: string;
    occurances: Occurance[];
}

export interface Parameter {
    startLine: number;
    endLine: number;
    startChar: number;
    endChar: number;
    type: string;
    name: string;
    defaultValue: any;
    scope: number[]; // 0: starting line, 1: ending line
    occurances: Occurance[];
}

export interface Rule {
    startLine: number;
    endLine: number;
    startChar: number;
    endChar: number;
    name: string;
    proto: string;
    occurances: Occurance[];
}