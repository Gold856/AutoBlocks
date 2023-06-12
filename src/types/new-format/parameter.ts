export interface Parameter {
	name: string,
	description?: string,
	type: string
	options?: { [opt: string]: string }
}