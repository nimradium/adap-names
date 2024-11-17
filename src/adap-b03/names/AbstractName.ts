import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        let s: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            s.push(this.getComponent(i).replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER).replaceAll(ESCAPE_CHARACTER + this.delimiter, this.delimiter));
        }
        return s.join(delimiter);
    }

    public toString(): string {
        return "{deliminer:" + this.delimiter + ",name:" + this.asDataString() + "}";
    }

    public asDataString(): string {
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
        if(this.getNoComponents() !== other.getNoComponents()) return false;
        for (let i = 0; i < this.getNoComponents(); i++) {
            if(this.getComponent(i) !== other.getComponent(i)) return false;
        }
        return true;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.toString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        return { ...this };
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if(this.delimiter !== other.getDelimiterCharacter()) return // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&pos_pk=1130228&thr_pk=385173&page=0&viewmode=2&cmd=markPostRead&cmdNode=13z:tp&baseClass=ilRepositoryGUI#1130228
        for(let i = 0; i < other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

}