import axios from "axios";

import Question, { getQuestion } from "../src/services/question";

jest.mock("axios");
const NUMBER_ID = "+5541832990";

describe("Questions", () => {
	let questionService: Question;
	const whatsAppClientMock = { reply: (msg: string) => {} };
	let whatsAppClientSpy: any;

	beforeEach(() => {
		questionService = new Question(NUMBER_ID, whatsAppClientMock);
		whatsAppClientSpy = jest.spyOn(whatsAppClientMock, "reply");
	});

	test("Should get next question from API", async () => {
		(axios.get as jest.Mock).mockResolvedValue({ data: { id: 1, text: "Test" } });

		const { id, text } = await questionService.getNextQuestionByNumberId();

		const isTextEmpty = text.length === 0;

		expect(id).not.toBe(null);
		expect(text).not.toBe(null);
		expect(isTextEmpty).toBe(false);

		expect(axios.get).toHaveBeenCalledWith("http://localhost:3003/bigball/next_question", {
			params: { numberId: NUMBER_ID },
		});
	});

	test("Should call answer question API", () => {
		questionService.answer("12").with("this is crazy shit");
		expect(axios.post).toHaveBeenCalledWith("http://localhost:3003/bigball/answer", {
			answer: "this is crazy shit",
			numberId: "+5541832990",
			questionId: "12",
		});
	});

	test("Should answer next questions", async () => {
		(axios.get as jest.Mock).mockResolvedValue({ data: { id: "1", text: "Qual time vai jogar?" } });

		//when
		await questionService.interateQuestions("Galao Da Massa");

		//then
		expect(whatsAppClientSpy).toHaveBeenCalledWith("Qual time vai jogar?");
		expect(questionService.getIteration).toBeDefined();

		//given
		const answerSpy = jest.spyOn(questionService, "answer");

		(axios.get as jest.Mock).mockResolvedValue({
			data: { id: "2", text: "Qual horário do jogo?" },
		});

		//when
		await questionService.interateQuestions("19:15");

		//then
		expect(whatsAppClientSpy).toHaveBeenCalledWith("Qual horário do jogo?");
		expect(answerSpy).toBeCalledWith("1");
	});

	test("Should answer next question wrongly", async () => {
		const mockedAxios = axios as jest.Mocked<typeof axios>;

		//given
		mockedAxios.get.mockResolvedValue({ data: { id: "1", text: "Qual time vai jogar?" } });
		mockedAxios.post.mockRejectedValue({
			response: { status: 422, data: { errMsg: "Uma msg de erro nada formal" } },
		});

		//when
		await questionService.interateQuestions("Olá");

		await questionService.interateQuestions("Resposta Em Formato Incorreto");

		//then
		expect(whatsAppClientSpy).toHaveBeenCalledWith(
			"Não consegui entender. " + "Qual time vai jogar?",
		);
	});

	test("Should get Question Object if already exists for numberId", () => {
		const questionA = getQuestion("31984", jest.fn());
		const questionB = getQuestion("31984", jest.fn());

		expect(questionA === questionB).toBeTruthy();
	});
});
