export interface Parameter {
	name: string;
	description?: string;
	prefix?: string;
	type: "enum" | "select" | "raw" | "javaObject" | "number";
	options?: Array<string>;
}
