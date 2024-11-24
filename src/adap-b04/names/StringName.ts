import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        // preconditions
        IllegalArgumentException.assertIsNotNullOrUndefined(other);

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
        return new StringName(this.name, this.delimiter);
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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertClassInvariants();

        let [i_start, i_end] = this.getIndices(i);
        return this.name.substring(i_start, i_end);
    }

    public setComponent(i: number, c: string) {
        // preconditions
        this.assertIsValidInnerIndex(i);
        this.assertIsValidComponent(c);
        this.assertClassInvariants();

        let oldName = this.name;
        let oldLength = this.name.length;
        let oldComponentLength = this.getComponent(i).length;

        let [i_start, i_end] = this.getIndices(i);
        this.name = this.name.substring(0, i_start) + c + this.name.substring(i_end);

        // postconditions
        if(this.name.length !== (oldLength - oldComponentLength) + c.length){
            this.name = oldName;
            throw new MethodFailureException("failed to set component");
        }
        this.assertClassInvariants();
    }

    public insert(i: number, c: string) {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidOuterIndex(i);
        this.assertIsValidComponent(c);

        let oldName = this.name;
        let oldLength = this.name.length;

        if(i === this.noComponents){
            return this.append(c);
        }
        let i_start = this.getStartIndex(i);
        this.name = this.name.substring(0, i_start) + c + this.delimiter + this.name.substring(i_start);
        this.noComponents++;

        // postconditions
        if(this.name.length !== (oldLength + c.length + 1)){
            this.name = oldName;
            this.noComponents--;
            throw new MethodFailureException("failed to insert component");
        }
        this.assertClassInvariants();
    }

    public append(c: string) {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidComponent(c);

        let oldName = this.name;
        let oldLength = this.name.length;

        // da leerer String bereits eine Komponente besitzt kein check auf isEmpty
        this.name = this.name.concat(this.delimiter, c);
        this.noComponents++;

        // postconditions
        if(this.name.length !== (oldLength + c.length + 1)){
            this.name = oldName;
            this.noComponents--;
            throw new MethodFailureException("failed to append component");
        }
        this.assertClassInvariants();
    }

    public remove(i: number) {
        // preconditions
        this.assertClassInvariants();
        this.assertIsValidInnerIndex(i);
        IllegalArgumentException.assertCondition(i > 0 || this.noComponents > 1, "cannot remove component from name with only one component");

        let oldName = this.name;
        let oldLength = this.name.length;
        let oldComponent = this.getComponent(i);

        let [i_start, i_end] = this.getIndices(i);
        if(i === this.noComponents - 1){
            this.name = this.name.substring(0, i_start-1);
        }else{
            this.name = this.name.substring(0, i_start) + this.name.substring(i_end+1);
        }
        this.noComponents--;

        // postconditions
        if(this.name.length !== (oldLength - (oldComponent.length+1))){
            this.name = oldName;
            this.noComponents++;
            throw new MethodFailureException("failed to remove component");
        }
        this.assertClassInvariants();
    }

    public concat(other: Name): void {
        let oldName = this.name;
        let oldNoComponents = this.noComponents;
        super.concat(other);

        // postconditions
        if(this.noComponents !== (oldNoComponents + other.getNoComponents())){
            this.name = oldName;
            this.noComponents = oldNoComponents;
            throw new MethodFailureException("failed to concat names");
        }
        this.assertClassInvariants();
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
        InvalidStateException.assertIsNotNullOrUndefined(this.name);
        InvalidStateException.assertCondition(this.noComponents > 0, "invalid number of components");
    }

    protected assertClassInvariants(){
        super.assertClassInvariants();
        this.assertHasValidComponents();
    }
}