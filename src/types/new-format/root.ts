import { Command } from "./command";

export interface Root {
	commands: { [commandName: string]: Command };
}
