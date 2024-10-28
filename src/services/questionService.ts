import QuestionAPI from "../api/questionAPI";
import GAME_TYPES from "../types/gameType";

interface IQuestion {
	id: string;
	text: string;
}

const instancesOfQuestion: Question[] = [];
export const getQuestion = (gameType: GAME_TYPES, numberId: string, client: any) => {
	const oldQuestion = instancesOfQuestion.find((qst) => qst.numberId == numberId);
	if (!oldQuestion) {
		const newQuestion = new Question(gameType, numberId, client);
		instancesOfQuestion.push(newQuestion);

		return newQuestion;
	}

	return oldQuestion;
};

export default class Question {
	question: IQuestion | undefined;
	numberId: string;
	gameType: GAME_TYPES;
	callDevice: any;
	questionAPI: QuestionAPI;

	constructor(gameType: GAME_TYPES, numberId: string, callDevice: any) {
		this.gameType = gameType;
		this.numberId = numberId;
		this.callDevice = callDevice;
		this.questionAPI = new QuestionAPI(numberId, gameType);
	}

	interateQuestions = async (answer: string) => {
		if (this.isFirstQuestion()) 
			await this.doQuestion();
		else {
			await this.answerQuestion(answer);
			await this.doQuestion();
		}			
	};

	private readonly answerQuestion = async (answer: string) => {
		try {
			await this.questionAPI.answer(this.question?.id || "0").with(answer);
		} catch (err: any) {
			if (err.response) {
				if (err.response.status === 422) {
					this.callDevice.reply(`Não consegui entender. ${this.question?.text}`);
				}
				if (err.response.status === 400) {
					this.callDevice.reply(
						this.getErrorMsg(err.response.data.errMsg) + this.question?.text,
					);
				}
			}
			return;
		}
	}

	private readonly doQuestion = async () => {
		this.question = await this.questionAPI.getNextQuestion();
		this.callDevice.reply(this.question.text);
	}

	private readonly isFirstQuestion = () => !this.question;

	private readonly getErrorMsg = (err: any) => {
		const msg = err?.response?.data?.errMsg;

		return msg ? msg : "";
	};
}
