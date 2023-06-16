import { Parameter } from "./parameter";

type NewType = `p${Number}`;

type Number = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export interface Command {
	name: string;
	parameters: { [p: string]: Parameter };
}
