// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TunnelProvider } from './TunnelProvider';
// @ts-ignore
import * as sshConfig from "ssh-config"
import * as fs from "fs";
import { hostname } from 'os';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	vscode.window.registerTreeDataProvider('tunnelExplorerView', new TunnelProvider())

	vscode.commands.registerCommand("tunnels.connect", () => {
		vscode.window.showInformationMessage('Connecting to tunnel!');
	})

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ngrok-connect" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json


	let disposable = vscode.commands.registerCommand("extension.editConfig", async (data) => {
		if(!data.match(/^tcp\:\/\/.*:\d+$/)){
			return vscode.window.showErrorMessage("The address doesn't look right");
		}
		const homedir = require('os').homedir();
		const configPath = vscode.Uri.parse(homedir+"\\.ssh\\config");
		const [full, address, port] = data.match(/\/\/(.*):(\d+)/);

		if(fs.existsSync(configPath.scheme+":"+configPath.fsPath)){
			const output = fs.readFileSync(configPath.fsPath).toString()
			const config = sshConfig.parse(output)

			const found = config.compute(address);
			
			if(found.hasOwnProperty("Host")){
				config.remove({Host:address})
				found.Port = port
				found.HostName = address.replace("tcp","ssh");
				config.append(found);
			}else{
				config.append({
					Host:address,
					HostName: address,
					Port: port,
				});
			}
			const finalConfig = sshConfig.stringify(config)
			fs.writeFileSync(configPath.fsPath,finalConfig);
		}
	})

	context.subscriptions.push(
		disposable
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
