import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        this.name = other;
        if(delimiter != undefined) this.delimiter = delimiter;

        this.length = 1; // laut Forum: leerer String => eine Komponente https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385940&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
        for(let i = 0; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                this.length++;
            }
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let out: string = this.replaceDelimiter(delimiter);
        return out.replaceAll(ESCAPE_CHARACTER, '');
    }

    public asDataString(): string {
        let out: string = this.replaceDelimiter(DEFAULT_DELIMITER);
        return out;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.length;
    }

    public getComponent(x: number): string {
        let ci = 0;
        let i_start = 0; // incl.
        let i_end = this.name.length;  // excl.
        for(let i = 0; i < this.name.length; i++){
            if(ci === x){
                i_start = i;
                break;
            }

            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                ci++;
            }
        }
        for(let i = i_start; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                i_end = i;
                break;
            }
        }
        return this.name.substring(i_start, i_end);
    }

    public setComponent(n: number, c: string): void {
        let ci = 0;
        let i_start = 0; // incl.
        let i_end = this.name.length;  // excl.
        for(let i = 0; i < this.name.length; i++){
            if(ci === n){
                i_start = i;
                break;
            }

            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                ci++;
            }
        }
        for(let i = i_start; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                i_end = i;
                break;
            }
        }
        this.name = this.name.substring(0, i_start) + c + this.name.substring(i_end);
    }

    public insert(n: number, c: string): void {
        let ci = 0;
        let i_start = 0; // incl.
        let i_end = this.name.length;  // excl.
        for(let i = 0; i < this.name.length; i++){
            if(ci === n){
                i_start = i;
                break;
            }

            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                ci++;
            }
        }
        for(let i = i_start; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                i_end = i;
                break;
            }
        }
        this.name = this.name.substring(0, i_start) + c + this.delimiter + this.name.substring(i_start);
        this.length++;
    }

    public append(c: string): void {
        // da leerer String bereits eine Komponente besitzt kein check auf isEmpty
        this.name = this.name.concat(this.delimiter, c);
        this.length++;
    }

    public remove(n: number): void {
        let ci = 0;
        let i_start = 0; // incl.
        let i_end = this.name.length;  // excl.
        for(let i = 0; i < this.name.length; i++){
            if(ci === n){
                i_start = i;
                break;
            }

            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                ci++;
            }
        }
        for(let i = i_start; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter && this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                i_end = i;
                break;
            }
        }
        this.name = this.name.substring(0, i_start) + this.name.substring(i_end+1);
        this.length--;
    }

    public concat(other: Name): void {
        if(this.delimiter !== other.getDelimiterCharacter()) return // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&pos_pk=1130228&thr_pk=385173&page=0&viewmode=2&cmd=markPostRead&cmdNode=13z:tp&baseClass=ilRepositoryGUI#1130228
        for(let i = 0; i < other.getNoComponents(); i++){
            this.append(other.getComponent(i));
        }
    }

    /** replace delimiter ignoring escaped delimiter characters */
    protected replaceDelimiter(delimiter: string): string {
        if(delimiter === this.delimiter) return this.name;

        let out: string = "";
        let i = 0;
        while(i < this.name.length){
            let c: string = this.name.charAt(i);

            // remove unnecessary escape characters
            if(c === ESCAPE_CHARACTER && this.name.charAt(i+1) === this.delimiter){
                out += this.delimiter;
                i += 2;
                continue;
            }

            // replace delimiter
            if(c === this.delimiter){
                c = delimiter;
            }

            out += c;
            i++;
        }
        return out;
    }

}