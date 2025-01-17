import axiosInstance from "../config/axiosInstance"; //TODO: move it to path redirection
import { IQuestion, QuestionAPIType } from "../types/index";

export default function QuestionAPI(this: any, numberId: string, gameType: string) : QuestionAPIType {
    this.numberId = numberId;
    this.gameType = gameType;

    return {
        getNextQuestion: async (): Promise<IQuestion> => {
            try {
                console.log("START: call question endpoint with ", { numberId: this.numberId }); //TODO: implement a better logging library
                const response = await axiosInstance.get(`http://localhost:3003/question/${this.gameType}/${this.numberId}`); //TODO: change hardcoded url
                console.log("FINISH call");
                return response.data;
            } catch (err) {                
                console.log("Bussiness server is probably down");
                throw err;
            }
        },
        answer: (questionId: string) => {
            return {
                with: async (text: string) => {
                    try {
                        console.log("START: call answer endpoint with ", {
                            numberId: this.numberId,
                            text,
                            questionId,
                        }); //TODO: implement a better logging library
                        const result = await axiosInstance.post(`http://localhost:3003/answer/${this.gameType}/${this.numberId}`, {
                            text,
                            questionId: parseInt(questionId)
                        }); //TODO: remove hardcoded url
                        console.log("FINISH call");
                        return result;
                } catch (err) {
                    console.log("Bussiness server is probably down");
                    throw err;
                }
                },
            };
        }
    }
    
}