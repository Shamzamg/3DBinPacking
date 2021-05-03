import BoxData from "./BoxData";
import Container from "./Container";

export default class Box {
    public x = 0;
    public y = 0;
    public z = 0;
    public container: Container | null = null;

    public constructor(
        public readonly data: BoxData
    ) { }

    public get length() {
        return this.data.length;
    }
    public get width() {
        return this.data.width;
    }
    public get height() {
        return this.data.height;
    }

    public static equals(a: Box, b: Box) {
        return a.length === b.length && a.width === b.width && a.height === b.height;
    }
    public static compare(a: Box, b: Box) {
        return a.length !== b.length ? a.length - b.length : 
            a.width !== b.width ? a.width - b.width : 
                a.height - b.height;
    }
}