import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected readonly components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if(delimiter != undefined){
            super(delimiter);
        }else{
            super();
        }

        // preconditions
        IllegalArgumentException.assert(other.length > 0, "invalid number of components");
        for (let i = 0; i < other.length; i++) {
            this.assertIsValidComponent(other[i]);
        }

        this.components = other;

        this.assertClassInvariants();
    }

    public clone(): Name {
        this.assertClassInvariants();
        return new StringArrayName(this.components, this.delimiter);
    }

    public getNoComponents(): number {
        this.assertClassInvariants();
        return this.components.length;
    }

    public getComponent(i: number): string {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertClassInvariants();

        return this.components[i];
    }

    public setComponent(i: number, c: string): Name {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let components = this.components.slice();
        components[i] = c;
        let n: Name = new StringArrayName(components, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents()) && (n.getComponent(i) === c);
        MethodFailedException.assert(cond , "failed to set component");
        this.assertClassInvariants(name_bck, del_bck);
        return n;
    }

    public insert(i: number, c: string): Name {
        // preconditions
        this.assertIsValidOuterIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let components = this.components.slice();
        components.splice(i, 0, c);
        let n: Name = new StringArrayName(components, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents() + 1) && (n.getComponent(i) === c);
        MethodFailedException.assert(cond, "failed to insert component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    public append(c: string): Name {
        // preconditions
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let components = this.components.slice();
        components.push(c);
        let n: Name = new StringArrayName(components, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents() + 1) && (n.getComponent(n.getNoComponents()-1) === c);
        MethodFailedException.assert(cond, "failed to append component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    public remove(i: number): Name {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertClassInvariants();
        IllegalArgumentException.assert(i > 0 || this.components.length > 1, "cannot remove component from name with only one component");

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let components = this.components.slice();
        components.splice(i, 1);
        let n: Name = new StringArrayName(components, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents() - 1);
        MethodFailedException.assert(cond, "failed to remove component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    protected assertClassInvariants(name_bck?: string, del_bck?: string){
        super.assertClassInvariants(name_bck, del_bck);
        InvalidStateException.assert(this.components.length > 0, "invalid number of components");
    }
}