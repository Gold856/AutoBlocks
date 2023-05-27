import { Parameter } from "./parameter";

export interface RobotCommand {
	name: string;
	params: Array<Parameter>
}