import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        IllegalArgumentException.assertIsNotNullOrUndefined(bn);
        let set = super.findNodes(bn);
        this.childNodes.forEach(cn => {
            set = new Set<Node>([...set, ...cn.findNodes(bn)]);
        });
        return set;
    }
}