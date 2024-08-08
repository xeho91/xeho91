import type { CssNode } from "css-tree";

export interface ToAST<TNode extends CssNode = CssNode> {
	/**
	 * Convert current instance to a valid [`CSSTree`](https://github.com/csstree/csstree) complaint AST Node _({@link CssNode})_.
	 */
	to_ast(): TNode;
}

/**
 * Infer the {@link CssNode} type from instance
 */
export type InferAST<T extends ToAST> = ReturnType<T["to_ast"]>;
