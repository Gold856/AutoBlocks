import { Parameter } from "./parameter";
export interface Command {
	name: string;
	prefix?: string;
	parameters: Array<Parameter>;
}
