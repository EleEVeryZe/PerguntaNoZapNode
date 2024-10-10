import Question, { getQuestion } from "@/services/question";
import express from "express";
import path from "path";

const { Client } = require('whatsapp-web.js');

import { loadApiEndpoints } from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT ?? 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));

loadApiEndpoints(app);

const client = new Client();

client.on('qr', (qr: any) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg: any) => {
    const question: Question = getQuestion(msg.from, msg);
    try {
        await question.interateQuestions(msg.body);
    } catch (err) {
        console.log(err);
    }
});

function askQuestion(query: any) {
    var readlineSync = require('readline-sync');
    return readlineSync.question(query);
}


const cmdInterface = async () => {
    const question: Question = getQuestion("111", { reply: 
        async (msg: string) => 
    {
        const resposta = await askQuestion(msg);
        await question.interateQuestions(resposta as string);
    }});
    await askQuestion("Hit enter to start");
    question.interateQuestions("Oi");
}

(async () => {
    const aux = await askQuestion("C - CMD ou W - WhatsApp");
    if (aux.toLowerCase() === "c")
        cmdInterface();
    else 
        client.initialize();
})()

export default app;
