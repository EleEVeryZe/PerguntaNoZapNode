const { Client } = require("whatsapp-web.js");

let client;

export function start(onMessage: any) {
    client = new Client();
    client.on("qr", (qr: any) => {
        console.log("QR RECEIVED", qr);
    });
    
    client.on("ready", () => {
        console.log("Client is ready!");
    });
    
    client.on("message", async (whatsAppClient: any) => {
        onMessage(whatsAppClient);
    });
}