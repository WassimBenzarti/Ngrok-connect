import * as vscode from "vscode"
import { TunnelProvider } from "../TunnelProvider"

export default function refreshTunnels(tunnelProvider:TunnelProvider){
    return ()=>{
        tunnelProvider.refresh();

    }
}