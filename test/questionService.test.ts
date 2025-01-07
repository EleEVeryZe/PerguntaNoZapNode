import axios from "axios";

import Question from "../src/services/questionService";

jest.mock("axios");
const NUMBER_ID = "553195365338@c.us";

describe("Questions", () => {
	let questionService: Question;
	const whatsAppClientMock = { reply: (msg: string) => {} };
	let whatsAppClientSpy: any;

	beforeEach(() => {
		questionService = new Question("BIG_BALL", NUMBER_ID, whatsAppClientMock);
		whatsAppClientSpy = jest.spyOn(whatsAppClientMock, "reply");
	});

	test("Should answer next questions", async () => {
		(axios.get as jest.Mock).mockResolvedValue({ data: { id: "1", text: "Qual time vai jogar?" } });

		//when
		await questionService.interateQuestions("Galao Da Massa");

		//then
		expect(whatsAppClientSpy).toHaveBeenCalledWith("Qual time vai jogar?");


		(axios.get as jest.Mock).mockResolvedValue({
			data: { id: "2", text: "Qual horário do jogo?" },
		});

		//when
		await questionService.interateQuestions("19:15");

		//then
		expect(whatsAppClientSpy).toHaveBeenCalledWith("Qual horário do jogo?");
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
});
