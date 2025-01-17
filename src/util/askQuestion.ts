export default function askQuestion(query: any) {
	const readlineSync = require("readline-sync");
	return readlineSync.question(query);
}