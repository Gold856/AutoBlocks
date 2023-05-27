import { Block, Generator } from "blockly";
export const javaGenerator: Generator = new Generator("Java");
javaGenerator.scrub_ = javaCodegen;
javaGenerator["ParallelCommandGroup"] = (block: Block): string => {
	let code = "new ParallelCommandGroup("
	const statement_members = javaGenerator.statementToCode(block, 'commands');
	return code + statement_members;
};
function javaCodegen(this: Generator, block: Block, code: string, thisOnly?: boolean): string {
	const nextBlock =
		block.nextConnection && block.nextConnection.targetBlock();
	if (nextBlock && !thisOnly) {
		return code + '),\n' + this.blockToCode(nextBlock);
	}
	return code + ")";
}
