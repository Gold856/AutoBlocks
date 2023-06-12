export interface Parameter {
	type: "enum" | "raw" | "number";
	name: string;
	description?:string;
	prefix?: string;
	options?: Array<string>;
}