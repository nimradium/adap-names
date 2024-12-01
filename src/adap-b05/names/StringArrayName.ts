import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if(delimiter != undefined){
            super(delimiter);
        }else{
            super();
        }

        // preconditions
        this.assertIsValidComponentsArray(other);

        this.components = other;

        this.assertClassInvariants();
    }

    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public toString(): string {
        return super.toString();
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
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

    public setComponent(i: number, c: string) {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        this.components[i] = c;

        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        // preconditions
        this.assertIsValidOuterIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let oldComponents = this.components.slice(0);
        this.components.splice(i, 0, c);

        // postconditions
        if(this.components.length !== oldComponents.length + 1){
            this.components = oldComponents;
            throw new MethodFailedException("failed to insert component");
        }
        this.assertClassInvariants();
    }

    public append(c: string) {
        // preconditions
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let oldComponents = this.components.slice(0);
        this.components.push(c);

        //postconditions
        if(this.components.length !== oldComponents.length + 1){
            this.components = oldComponents;
            throw new MethodFailedException("failed to append component");
        }
        this.assertClassInvariants();
    }

    public remove(i: number) {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertClassInvariants();
        IllegalArgumentException.assertCondition(i > 0 || this.components.length > 1, "cannot remove component from name with only one component");

        let oldComponents = this.components.slice(0);
        this.components.splice(i, 1);

        // postconditions
        if(this.components.length !== oldComponents.length - 1){
            this.components = oldComponents;
            throw new MethodFailedException("failed to remove component");
        }
        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        let oldComponents = this.components.slice(0);
        super.concat(other);

        // postconditions
        if(this.components.length !== (oldComponents.length + other.getNoComponents())){
            this.components = oldComponents;
            throw new MethodFailedException("failed to concat names");
        }
        this.assertClassInvariants();
    }

    protected assertIsValidComponentsArray(components: string[]){
        IllegalArgumentException.assertIsNotNullOrUndefined(components);
        IllegalArgumentException.assertCondition(components.length > 0, "invalid number of components");
    }

    protected assertHasValidComponentsArray(){
        InvalidStateException.assertIsNotNullOrUndefined(this.components);
        InvalidStateException.assertCondition(this.components.length > 0, "invalid number of components");
    }

    protected assertClassInvariants(){
        super.assertClassInvariants();
        this.assertHasValidComponentsArray();
    }
}