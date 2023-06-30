import { Parameter } from "./parameter";
export interface Command {
	name: string;
	parameters: Array<Parameter>;
}
