import * as vscode from "vscode";
import fetch from "node-fetch"

export class TunnelProvider implements vscode.TreeDataProvider<Tunnel> {
    private onDidChangeEmitter: vscode.EventEmitter<Tunnel | undefined> = new vscode.EventEmitter<Tunnel|undefined>();
    onDidChangeTreeData?: vscode.Event<Tunnel| undefined >= this.onDidChangeEmitter.event;

    constructor(){
    }

    refresh(){
        this.onDidChangeEmitter.fire();
    }

    getTreeItem(element: any): vscode.TreeItem | Thenable<Tunnel> {
        return element
    }

    getChildren(element?: any): Thenable<Tunnel[]> {
        //https://api.ngrok.com/
        return fetch("https://api.jsonbin.io/b/5e5faa9b763fa966d40ed31b/latest", {
            method: "GET"
        })
            .then(r => r.json())
            .then((data) => {
                return [new Tunnel(data.host,vscode.TreeItemCollapsibleState.None,{
                    command:"extension.setSshConfig",
                    title:"Connect to SSH",
                    arguments:[
                        data.host,
                    ]
                })];
            })
            .catch(err=>{
                console.log(err)
                return [];
            })

    }


}


export class Tunnel extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState?: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
    }

    get tooltip(): string {
        return `${this.label}`;
    }

    get description(): string {
        return "ssh";
    }
    /*
	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
    */

    //contextValue = 'dependency';

}