import * as path from 'path';
import * as vscode from 'vscode';
import {
    workspace,
    ExtensionContext,
} from 'vscode';

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    // vscode.window.showInformationMessage('Hello from XS extension!');

    // Path to the Rust binary built via `cargo build --release`
    const command = path.join(
        context.extensionPath,
        'server',
        'xs-check-lsp' + (process.platform === 'win32' ? '.exe' : '')
    );

    const serverOptions: ServerOptions = {
        run: { command },
        debug: { command }
    };

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
