import * as path from 'path';
import * as vscode from 'vscode';
import {
    workspace,
    ExtensionContext,
} from 'vscode';
import * as net from "net";
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    StreamInfo,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    const useTcp = false;

    let serverOptions: ServerOptions;

    if (useTcp) {
        serverOptions = () => {
            return new Promise<StreamInfo>((resolve, reject) => {
                const socket = net.connect(9257, "127.0.0.1", () => {
                    resolve({
                        reader: socket,
                        writer: socket
                    });
                });
                socket.on("error", reject);
            });
        };
    } else {
        const command = path.join(
            context.extensionPath,
            'server',
            'xs-check-lsp' + (process.platform === 'win32' ? '.exe' : '')
        );

        serverOptions = {
            run: { command },
            debug: { command }
        };
    }

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'xs' },
            { scheme: 'untitled', language: 'xs' },
        ],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.xs')
        },
    };

    client = new LanguageClient(
        'xs-check-ide',
        'XS Language Client',
        serverOptions,
        clientOptions
    );

    const configWatcher = vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('xsc')) {
            client.sendNotification('workspace/didChangeConfiguration', {
                settings: {}
            });
        }
    });

    context.subscriptions.push(configWatcher);

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    return client?.stop();
}
