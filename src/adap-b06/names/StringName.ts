import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        // preconditions

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

        this.assertClassInvariants();
    }

    public clone(): Name {
        this.assertClassInvariants();
        return new StringName(this.name, this.delimiter);
    }

    public getNoComponents(): number {
        this.assertClassInvariants();
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertClassInvariants();

        let [i_start, i_end] = this.getIndices(i);
        return this.name.substring(i_start, i_end);
    }

    public setComponent(i: number, c: string): Name {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let [i_start, i_end] = this.getIndices(i);
        let sn = this.name.substring(0, i_start) + c + this.name.substring(i_end);
        let n: Name = new StringName(sn, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents()) && (n.getComponent(i) === c);
        MethodFailedException.assert(cond , "failed to set component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    public insert(i: number, c: string): Name {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidOuterIndex(i);
        this.assertIsValidComponent(c);

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        if(i === this.noComponents){
            return this.append(c);
        }
        let i_start = this.getStartIndex(i);
        let sn = this.name.substring(0, i_start) + c + this.delimiter + this.name.substring(i_start);
        let n: Name = new StringName(sn, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents() + 1) && (n.getComponent(i) === c);
        MethodFailedException.assert(cond, "failed to insert component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    public append(c: string): Name {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidComponent(c);

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        // da leerer String bereits eine Komponente besitzt kein check auf isEmpty
        let sn = this.name.concat(this.delimiter, c);
        let n: Name = new StringName(sn, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents() + 1) && (n.getComponent(n.getNoComponents()-1) === c);
        MethodFailedException.assert(cond, "failed to append component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    public remove(i: number): Name {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidInnerIndex(i);
        IllegalArgumentException.assert(i > 0 || this.noComponents > 1, "cannot remove component from name with only one component");

        let name_bck = this.asDataString();
        let del_bck = this.delimiter;

        let [i_start, i_end] = this.getIndices(i);
        let sn = "";
        if(i === this.noComponents - 1){
            sn = this.name.substring(0, i_start-1);
        }else{
            sn = this.name.substring(0, i_start) + this.name.substring(i_end+1);
        }
        let n: Name = new StringName(sn, this.delimiter);

        // postconditions
        let cond: boolean = (n.getNoComponents() === this.getNoComponents() - 1);
        MethodFailedException.assert(cond, "failed to remove component");
        this.assertClassInvariants(name_bck, del_bck);

        return n;
    }

    /**
     * Get start and end index of component i in this.name
     * i_start is inclusive
     * i_end is exclusive
     * @param i index of component
     * @returns [i_start, i_end]
     */
    private getIndices(i: number): [number, number]{
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
    private getStartIndex(i: number): number{
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
    private getEndIndex(i_start: number): number{
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

    protected assertHasValidComponents(){
        InvalidStateException.assert(this.noComponents > 0, "invalid number of components");
    }

    protected assertClassInvariants(name_bck?: string, del_bck?: string){
        super.assertClassInvariants(name_bck, del_bck);
        this.assertHasValidComponents();
    }
}