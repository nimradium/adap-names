import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if(delimiter != undefined){
            super(delimiter);
        }else{
            super();
        }
        this.name = other;

        this.length = 1; // laut Forum: leerer String => eine Komponente https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385940&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI
        for(let i = 0; i < this.name.length; i++){
            if(this.name.charAt(i) === this.delimiter){
                if(i-1 < 0 || this.name.charAt(i-1) !== ESCAPE_CHARACTER){
                    this.length++;
                }
            }
        }
    }

    getNoComponents(): number {
        return this.length;
    }

    getComponent(i: number): string {
        let [i_start, i_end] = this.getIndices(i);
        return this.name.substring(i_start, i_end);
    }

    setComponent(i: number, c: string) {
        let [i_start, i_end] = this.getIndices(i);
        this.name = this.name.substring(0, i_start) + c + this.name.substring(i_end);
    }

    insert(i: number, c: string) {
        if(i === this.length){
            return this.append(c);
        }
        let i_start = this.getStartIndex(i);
        this.name = this.name.substring(0, i_start) + c + this.delimiter + this.name.substring(i_start);
        this.length++;
    }
    
    append(c: string) {
        // da leerer String bereits eine Komponente besitzt kein check auf isEmpty
        this.name = this.name.concat(this.delimiter, c);
        this.length++;
    }
    
    remove(i: number) {
        let [i_start, i_end] = this.getIndices(i);
        this.name = this.name.substring(0, i_start) + this.name.substring(i_end+1);
        this.length--;
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