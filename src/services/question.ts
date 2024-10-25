import axiosInstance from "@/config/axiosInstance";

interface IQuestion {
	id: string;
	text: string;
}

const instancesOfQuestion: Question[] = [];
export const getQuestion = (numberId: string, client: any) => {
	const oldQuestion = instancesOfQuestion.find((qst) => qst.numberId == numberId);
	if (!oldQuestion) {
		const newQuestion = new Question(numberId, client);
		instancesOfQuestion.push(newQuestion);

		return newQuestion;
	}

	return oldQuestion;
};

export default class Question {
	iteration!: { question: IQuestion };
	numberId: string;
	whatsAppClient: any;

	constructor(numberId: string, whatsAppClient: any) {
		this.numberId = numberId;
		this.whatsAppClient = whatsAppClient;
	}

	getNextQuestionByNumberId = async (): Promise<IQuestion> => {
		const response = await axiosInstance.get("http://localhost:3003/bigball/next_question", {
			params: { numberId: this.numberId },
		});

		return response.data;
	};

	private answer = (questionId: string) => {
		return {
			with: async (answer: string) => {
				console.log("START: call answer endpoint with ", {
					numberId: this.numberId,
					answer,
					questionId,
				}); //TODO: implement a better logging library
				const result = await axiosInstance.post(`http://localhost:3003/answer/BIG_BALL/${this.numberId}`, {
					numberId: this.numberId,
					answer,
					questionId,
				}); //TODO: remove hardcoded url
				console.log("FINISH call");

				return result;
			},
		};
	};

	interateQuestions = async (answer: string) => {
		if (!this.iteration) {
			this.iteration = { question: await this.getNextQuestionByNumberId() };
			this.whatsAppClient.reply(this.iteration.question.text);
		} else {
			try {
				await this.answer(this.iteration.question.id).with(answer);
				this.iteration = { question: await this.getNextQuestionByNumberId() };
				this.whatsAppClient.reply(this.iteration.question.text);
			} catch (err: any) {
				if (err.response) {
					if (err.response.status === 422) {
						this.whatsAppClient.reply(`Não consegui entender. ${this.iteration.question.text}`);
					}
					if (err.response.status === 400) {
						this.whatsAppClient.reply(
							this.getErrorMsg(err.response.data.errMsg) + this.iteration.question.text,
						);
					}
				}

				return;
			}
		}
	};

	private readonly getErrorMsg = (err: any) => {
		const msg = err?.response?.data?.errMsg;

		return msg ? msg : "";
	};

	get getIteration() {
		return this.iteration;
	}
}
