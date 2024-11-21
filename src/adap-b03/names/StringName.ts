import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        if(delimiter != undefined){
            super(delimiter);
        }else{
            super();
        }
        this.name = other;

        this.noComponents = 1; // laut Forum: leerer String => eine Komponente https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385940&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
        for(let i = 0; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter){
                if(i-1 < 0 || this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                    this.noComponents++;
                }
            }
        }
    }

    public clone(): Name {
        throw new Error("needs implementation");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation");
    }

    public toString(): string {
        throw new Error("needs implementation");
    }

    public asDataString(): string {
        throw new Error("needs implementation");
    }

    public isEqual(other: Name): boolean {
        throw new Error("needs implementation");
    }

    public getHashCode(): number {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation");
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        let [i_start, i_end] = this.getIndices(i);
        return this.name.substring(i_start, i_end);
    }

    public setComponent(i: number, c: string) {
        let [i_start, i_end] = this.getIndices(i);
        this.name = this.name.substring(0, i_start) + c + this.name.substring(i_end);
    }

    public insert(i: number, c: string) {
        if(i === this.noComponents){
            return this.append(c);
        }
        let i_start = this.getStartIndex(i);
        this.name = this.name.substring(0, i_start) + c + this.delimiter + this.name.substring(i_start);
        this.noComponents++;
    }

    public append(c: string) {
        // da leerer String bereits eine Komponente besitzt kein check auf isEmpty
        this.name = this.name.concat(this.delimiter, c);
        this.noComponents++;
    }

    public remove(i: number) {
        let [i_start, i_end] = this.getIndices(i);
        this.name = this.name.substring(0, i_start) + this.name.substring(i_end+1);
        this.noComponents--;
    }

    /**
     * Get start and end index of component i in this.name
     * i_start is inclusive
     * i_end is exclusive
     * @param i index of component
     * @returns [i_start, i_end]
     */
    getIndices(i: number): [number, number]{
        let i_start = this.getStartIndex(i);
        let i_end = this.getEndIndex(i_start);
        return [i_start, i_end];
    }

    /**
     * Get start index of component i in this.name
     * i_start is inclusive
     * @param i index of component
     * @returns i_start
     */
    getStartIndex(i: number): number{
        let ci = 0;
        let i_start = 0; // incl.
        if(i === 0) return i_start;
        for(let j = 0; j < this.name.length; j++){
            i_start = j+1;
            if(this.name.charAt(j) === this.delimiter){
                if(j-1 < 0 || this.name.charAt(j-1) !== ESCAPE_CHARACTER){
                    ci++;
                    if(ci === i){
                        break;
                    }
                }
            }
        }
        return i_start;
    }

    /**
     * Get index of end of this component
     * i_end is exclusive
     * @param i_start index of component
     * @returns i_end
     */
    getEndIndex(i_start: number): number{
        let i_end = this.name.length;  // excl.
        for(let j = i_start; j < this.name.length; j++){
            if(this.name.charAt(j) === this.delimiter){
                if(j-1 < 0 || this.name.charAt(j-1) !== ESCAPE_CHARACTER){
                    i_end = j;
                    break;
                }
            }
        }
        return i_end;
    }
}