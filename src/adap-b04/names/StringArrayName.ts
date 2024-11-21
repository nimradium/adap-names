import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if(delimiter != undefined){
            super(delimiter);
        }else{
            super();
        }
        this.components = other;
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
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        return super.concat(other);
    }
}