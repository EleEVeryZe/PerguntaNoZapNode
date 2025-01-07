const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('get-tsconfig').getTsconfig('./tsconfig.json')['config'];

module.exports = {
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "js"],
	testMatch: ["**/test/**/*.test.(ts|js)"],
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.json",
			},
		],
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' })
};



const holder = temp1.map(({started, timeSpent, issue: { key, summary }}) => {
    const [date, hour] = started.split(" ");
	const days = ['Segunda','Terça','Quarta','Quinta','Sexta','Sabado', 'Domingo'];
	
	const diaSemana = days[new Date(date).getDay()];

	return [diaSemana, date, hour, timeSpent, key, summary]
})

const aux = [
	["Dia da Semana", "Dia", "Horas", "Tempo Gasto", "Task ID", "Descrição"],
	...holder
]

console.log(aux.map(x => x.join(";")).map(x => x.join("\n")));