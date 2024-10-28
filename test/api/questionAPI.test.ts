
import axios from "axios";

import QuestionAPI from "../../src/api/questionAPI";

jest.mock("axios");
const NUMBER_ID = "+5541832990";

describe("QuestionAPI", () => {
    let questionAPISut: QuestionAPI;

    beforeAll(() => {
        questionAPISut = new QuestionAPI(NUMBER_ID, "BIG_BALL")
    })

	test("Should get next question from API", async () => {
		(axios.get as jest.Mock).mockResolvedValue({ data: { id: 1, text: "Test" } });

		const { id, text } = await questionAPISut.getNextQuestion();

		const isTextEmpty = text.length === 0;

		expect(id).not.toBe(null);
		expect(text).not.toBe(null);
		expect(isTextEmpty).toBe(false);

		expect(axios.get).toHaveBeenCalledWith(`http://localhost:3003/question/${"BIG_BALL"}/${NUMBER_ID}`);
	});

    
	test("Should call answer question API", () => {
		const ANSWER = "ANSWER";
        const QUESTION_ID = "12";
        questionAPISut.answer(QUESTION_ID).with(ANSWER);
		expect(axios.post).toHaveBeenCalledWith(`http://localhost:3003/answer/BIG_BALL/${NUMBER_ID}`, {
			answer: ANSWER,
			questionId: QUESTION_ID,
		});
	});
});