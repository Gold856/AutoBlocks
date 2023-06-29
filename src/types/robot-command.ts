import { Parameter } from "./new-format/parameter";

export interface RobotCommand {
	name: string;
	parameters: Array<Parameter>;
}
