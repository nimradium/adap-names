import { Node } from "./Node";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";

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
        // preconditions
        this.assertIsInState(FileState.CLOSED);
        // do something
    }

    public close(): void {
        // preconditions
        this.assertIsInState(FileState.OPEN);
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    protected assertIsInState(state: FileState) {
        if(state != this.doGetFileState()){
            throw new InvalidStateException("invalid file state");
        }
    }
}