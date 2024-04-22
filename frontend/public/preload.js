//import { contextBridge } from "electron";
//contextBridge.exposeInMainWorld("nexusBackendPort", process.env.NEXUS_BACKEND_PORT);

window.nexusBackendPort = process.env.NEXUS_BACKEND_PORT;
window.test = "Test"