export interface Parameter {
	type: "enum" | "raw" | "number";
	name: string;
	options?: Array<string>;
}
