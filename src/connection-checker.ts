import { Connection, ConnectionChecker, registry } from "blockly";
/**
 * Ensures that only one command/command group can be in a method.
 */
export class OneCommandConnectionChecker extends ConnectionChecker {
	constructor() {
		super();
	}
	/**
	 *
	 * @param a This connection belongs to the block being dragged
	 * @param b This connection belongs to the block you are trying to connect to
	 * @returns
	 */
	doTypeChecks(a: Connection, b: Connection): boolean {
		// Logically, if you try to stack two blocks together, when you drag the 2nd block, b will be the 'next'
		// connection of the first block. This also applies in a method block.
		// To differentiate between stacking blocks inside and outside a method block, we can check if the block
		// we are connecting to is inside a method block and block the connection if it is.
		// Covers dragging blocks into non-empty statement inputs where the block being connected to is also in a method; not allowed
		if (
			b.getParentInput() == null &&
			b.getSourceBlock().getSurroundParent()?.type == "Method"
		) {
			return false;
		}
		return true;
	}
}
const type = registry.Type.CONNECTION_CHECKER;
registry.register(type, "CustomConnectionChecker", OneCommandConnectionChecker);
export const connectionCheckerInfo = {
	// @ts-ignore
	[type]: "CustomConnectionChecker"
};
