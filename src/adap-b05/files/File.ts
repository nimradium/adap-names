import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { ExceptionType, AssertionDispatcher } from "../common/AssertionDispatcher";

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
        this.assertIsInState(FileState.CLOSED, ExceptionType.PRECONDITION);
        this.state = FileState.OPEN;
        this.assertIsInState(FileState.OPEN, ExceptionType.POSTCONDITION);
        // do something
    }

    public read(noBytes: number): Int8Array {
        this.assertIsInState(FileState.OPEN, ExceptionType.PRECONDITION);

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
        return 0; // @todo
    }

    public close(): void {
        this.assertIsInState(FileState.OPEN, ExceptionType.PRECONDITION);
        this.state = FileState.CLOSED;
        this.assertIsInState(FileState.CLOSED, ExceptionType.POSTCONDITION);
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    protected assertIsInState(state: FileState, et: ExceptionType): void {
        const condition: boolean = (state != this.doGetFileState());
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }
}