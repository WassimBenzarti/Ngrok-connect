// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TunnelProvider } from './TunnelProvider';

import setSshConfig from './commands/setSshConfig';
import refreshTunnels from './commands/refreshTunnels';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const tunnelProvider = new TunnelProvider();
	vscode.window.registerTreeDataProvider('tunnelExplorerView', tunnelProvider)

	vscode.commands.registerCommand("tunnels.connect", () => {
		vscode.window.showInformationMessage('Connecting to tunnel!');
	})

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ngrok-connect" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json


	context.subscriptions.push(
		vscode.commands.registerCommand("extension.setSshConfig", setSshConfig),
		vscode.commands.registerCommand("extension.refresh", refreshTunnels(tunnelProvider)),
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
