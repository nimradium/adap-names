import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";
import { Exception } from "../common/Exception";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        IllegalArgumentException.assertIsNotNullOrUndefined(pn);

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);

        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(to);
        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }

        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;

        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }
    }

    public getFullName(): Name {
        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }

        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());

        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }
        return result;
    }

    public getBaseName(): string {
        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }

        this.doSetBaseName(bn);

        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }

        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }

        IllegalArgumentException.assertIsNotNullOrUndefined(bn);

        if(this.getBaseName() === bn) return new Set<Node>([this]);

        try{
            this.assertClassInvariants();
        }catch(e){
            if(e instanceof Exception){
                throw new ServiceFailureException("internal error", e);
            }
            throw e;
        }
        return new Set<Node>();
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }

}
