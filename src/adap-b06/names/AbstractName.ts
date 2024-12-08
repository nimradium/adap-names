import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // preconditions
        IllegalArgumentException.assert(delimiter.length === 1, "invalid delimiter character");

        this.delimiter = delimiter;
    }

    abstract clone(): Name;

    public asString(delimiter: string = this.delimiter): string {
        // preconditions
        IllegalArgumentException.assert(delimiter.length === 1, "invalid delimiter character");
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
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        // preconditions
        IllegalArgumentException.assert(this.delimiter === other.getDelimiterCharacter(), "incompatible delimiter character") // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&pos_pk=1130228&thr_pk=385173&page=0&viewmode=2&cmd=markPostRead&cmdNode=13z:tp&baseClass=ilRepositoryGUI#1130228
        this.assertClassInvariants();

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let n: Name = this;
        for(let i = 0; i < other.getNoComponents(); i++){
            n = n.append(other.getComponent(i));
        }

        // postconditions
        let cond: boolean = n.getNoComponents() === (this.getNoComponents() + other.getNoComponents());
        MethodFailedException.assert(cond, "failed to concat names");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    protected assertIsValidComponent(c: string) {
        for(let i = 0; i < c.length; i++){
            if(c.charAt(i) === this.delimiter){
                let cond: boolean = i > 0 && (c.charAt(i-1) === ESCAPE_CHARACTER);
                IllegalArgumentException.assert(cond, "not a valid component")
            }
        }
    }

    protected assertIsValidInnerIndex(i: number) {
        let condition: boolean = (i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assert(condition, "index out of bounds");
    }

    protected assertIsValidOuterIndex(i: number) {
        let condition: boolean = (i >= 0 && i <= this.getNoComponents());
        IllegalArgumentException.assert(condition, "index out of bounds");
    }

    protected assertHasValidDelimiterCharacter(){
        let condition: boolean = this.delimiter.length == 1;
        InvalidStateException.assert(condition, "invalid delimiter character");
    }

    protected assertClassInvariants(name_bck?: string, del_bck?: string){
        this.assertHasValidDelimiterCharacter();
        if(name_bck !== undefined && del_bck !== undefined){
            InvalidStateException.assert(name_bck === this.asDataString(), "state changed");
            InvalidStateException.assert(del_bck === this.delimiter, "state changed");
        }
    }
}