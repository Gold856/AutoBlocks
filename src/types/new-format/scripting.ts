import { Command } from "./command";

export interface Scripting {
	[commandName: string]: Command;
}
