export interface Parameter {
	type: "enum" | "select" | "raw" | "javaObject" | "number";
	name: string;
	options?: Array<string>;
}
