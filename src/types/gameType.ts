export type GAME_TYPES = "BIG_BALL" | "RAMAL";
export interface IQuestion {
	id: string;
	text: string;
}
export type QuestionAPIType = {
    getNextQuestion: () => Promise<IQuestion>;
    answer: (questionId: string) => {
      with: (text: string) => Promise<any>;
    };
};

export interface IExecQuestion {
    question: IQuestion | undefined;
	numberId: string;
	gameType: GAME_TYPES;
	callDevice: any;
	questionAPI: QuestionAPIType;
}