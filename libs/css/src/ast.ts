import type { CssNode } from "css-tree";

export interface ToAST {
	to_ast(): CssNode;
}
