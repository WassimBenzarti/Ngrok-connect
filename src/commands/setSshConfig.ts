import * as vscode from "vscode"
// @ts-ignore
import * as sshConfig from "ssh-config"
import * as fs from "fs";

export default  async function (data:any) {
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
                User:"root",
                Port: port,
            });
        }
        const finalConfig = sshConfig.stringify(config)
        fs.writeFileSync(configPath.fsPath,finalConfig);

        vscode.commands.executeCommand("opensshremotes.openEmptyWindow")
    }
}