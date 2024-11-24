import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // preconditions
        this.assertIsValidDelimiterCharacter(delimiter);

        this.delimiter = delimiter;
    }

    public clone(): Name {
        this.assertClassInvariants();
        return { ...this };
    }

    public asString(delimiter: string = this.delimiter): string {
        // preconditions
        this.assertIsValidDelimiterCharacter(delimiter);
        this.assertClassInvariants();

        let s: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            s.push(this.getComponent(i).replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER).replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter));
        }
        return s.join(delimiter);
    }

    public toString(): string {
        this.assertClassInvariants();
        return "{deliminer:" + this.delimiter + ",name:" + this.asDataString() + "}";
    }

    public asDataString(): string {
        this.assertClassInvariants();
        let s: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let c = this.getComponent(i);
            if(this.delimiter !== DEFAULT_DELIMITER) {
                // escape default delimiter and unescape this.delimiter
                c = c.replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER).replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter);
            }
            s.push(c);
        }
        return s.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        // preconditions
        this.assertIsValidName(other);
        this.assertClassInvariants();

        if(this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if(this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        this.assertClassInvariants();
        let hashCode: number = 0;
        const s: string = this.toString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        this.assertClassInvariants();
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidName(other);
        IllegalArgumentException.assertCondition(this.delimiter === other.getDelimiterCharacter(), "incompatible delimiter character") // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&pos_pk=1130228&thr_pk=385173&page=0&viewmode=2&cmd=markPostRead&cmdNode=13z:tp&baseClass=ilRepositoryGUI#1130228

        for(let i = 0; i < other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

    protected assertIsValidComponent(c: string) {
        IllegalArgumentException.assertIsNotNullOrUndefined(c);
    }

    protected assertIsValidDelimiterCharacter(delimiter: string){
        let condition: boolean = delimiter.length == 1;
        IllegalArgumentException.assertIsNotNullOrUndefined(delimiter, "delimiter character is null or undefined");
        IllegalArgumentException.assertCondition(condition, "invalid delimiter character");
    }

    protected assertIsValidName(name: Name){
        IllegalArgumentException.assertIsNotNullOrUndefined(name);
    }

    protected assertIsValidInnerIndex(i: number) {
        let condition: boolean = (i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assertCondition(condition, "index out of bounds");
    }

    protected assertIsValidOuterIndex(i: number) {
        let condition: boolean = (i >= 0 && i <= this.getNoComponents());
        IllegalArgumentException.assertCondition(condition, "index out of bounds");
    }

    protected assertHasValidDelimiterCharacter(){
        let condition: boolean = this.delimiter.length == 1;
        InvalidStateException.assertCondition(condition, "invalid delimiter character");
    }

    protected assertClassInvariants(){
        this.assertHasValidDelimiterCharacter();
    }
}