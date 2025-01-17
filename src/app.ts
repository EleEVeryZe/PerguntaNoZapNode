import express from "express";
import path from "path";
import { loadApiEndpoints } from "./controllers/api";
import questionSingleton from "./services/questionService";
import * as whatsAppInterface from './services/whatsAppClient';
import askQuestion from "./util/askQuestion";

const app = express();
app.set("port", process.env.PORT ?? 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public"), { maxAge: 31557600000 }));
loadApiEndpoints(app);

const cmdInterface = async () => {
	const question = questionSingleton.getInstance("4444", {  gameType: "RAMAL", numberId: "4444", callDevice: {
		reply: async (msg: string) => {
			const resposta = await askQuestion(msg);
			await question.interateQuestions(resposta as string);
		},
	}});
	await askQuestion("Hit enter to start");
	question.interateQuestions("Oi");
};

(async () => {
	const option = await askQuestion("C - CMD ou W - WhatsApp");
	if (option.toLowerCase() === "c") 
		cmdInterface();
	else 
	whatsAppInterface.start(async (whatsAppClient: any) => {
		const question = questionSingleton.getInstance(whatsAppClient.from, {  gameType: "BIG_BALL", numberId: whatsAppClient.from, callDevice: whatsAppClient } );
        try {
            await question.interateQuestions(whatsAppClient.body);
        } catch (err) {
            console.log(err);
        }
	});
})();

export default app;
