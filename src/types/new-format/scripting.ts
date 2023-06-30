import { Command } from "./command";

export interface Scripting {
	commands: { [commandName: string]: Command };
	functions: { [functionName: string]: string };
}
