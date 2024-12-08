import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state === FileState.CLOSED);
        this.state = FileState.OPEN;
        MethodFailedException.assert(this.state === FileState.OPEN);
        // do something
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(this.state === FileState.OPEN);

        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch(ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        IllegalArgumentException.assert(this.state === FileState.OPEN);
        return 0; // @todo
    }

    public close(): void {
        IllegalArgumentException.assert(this.state === FileState.OPEN);
        this.state = FileState.CLOSED;
        MethodFailedException.assert(this.state === FileState.CLOSED);
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }
}