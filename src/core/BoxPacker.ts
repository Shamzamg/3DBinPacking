import Box from "./Box";
import Container from "./Container";
import SortedSet from "collections/sorted-set";

class FloorBoxLine {
    public constructor(
        public readonly x: number,
        public readonly z1: number,
        public readonly z2: number
    ) {}

    public static equals(a: FloorBoxLine, b: FloorBoxLine) {
        return a.x === b.x && a.z1 === b.z1 && a.z2 === b.z2;
    }
    public static compare(a: FloorBoxLine, b: FloorBoxLine) {
        return a.x !== b.x ? a.x - b.x : a.z1 !== b.z1 ? a.z1 - b.z1 : a.z2 - b.z2;
    }
}

class Rect2D {
    public constructor(
        public x1: number,
        public y1: number,
        public x2: number,
        public y2: number
    ) {}

    public static overlap(r1: Rect2D, r2: Rect2D) {
        // The rectangles don't overlap if
        // one rectangle's minimum in some dimension 
        // is greater than the other's maximum in
        // that dimension.
        const noOverlap = r1.x1 >= r2.x2 ||
                          r2.x1 >= r1.x2 ||
                          r1.y1 >= r2.y2 ||
                          r2.y1 >= r1.y2;
        return !noOverlap;
    }
}

export default class BoxPacker {
    private container: Container | null;
    private floorBoxLines = new SortedSet<FloorBoxLine>([], FloorBoxLine.equals, (a, b) => FloorBoxLine.compare(b, a));
    private floorRects = new Array<Rect2D>();
    public readonly packed = new Array<Box>();

    public constructor(
        public readonly length: number, 
        public readonly height: number, 
        public readonly width: number
    ) {
        this.container = null;
    }

    /**
     * Pack a box
     */
    public pack(box: Box): boolean {
        if(!this.packBox(box)) {
            return false;
        }
        this.shiftBox(box)
        this.packed.push(box);
        return true;
    }

    /**
     * Check if a box is overlaping with another box on the floor
     */
    public overlapOnFloor(box: Box) {
        if(box.y !== 0) {
            return false;
        }
        const boxRect = new Rect2D(
            box.x,
            box.z,
            box.x + box.length,
            box.z + box.width
        );
        for(const rect of this.floorRects) {
            if(Rect2D.overlap(rect, boxRect)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Pack a box in the container tree
     */
    private packBox(box: Box): boolean {
        if(this.container === null) {
            if(box.length > this.length || box.height > this.height || box.width > this.width) {
                return false;
            }
            this.container = new Container(this, this.length, this.height, this.width, box);
            return true;
        }
        return this.container.push(box);
    }

    /**
     * Shift a box on the floor to take the minimum of space
     */
    private shiftBox(box: Box) {
        if(box.y !== 0) {
            return;
        }

        const x = box.x;
        const z1 = box.z;
        const z2 = box.z + box.width;

        const it = this.floorBoxLines.iterate(0, this.floorBoxLines.length);
        let done = false;
        while(!done) {
            const line = it.next().value;
            if(line) {
                if(line.x <= x && line.z2 > z1 && line.z1 < z2) {
                    // Shift box to line
                    box.container!.length += box.x - line.x;
                    box.x = line.x;
                    done = true;
                }
            } else {
                done = true;
            }
        }

        this.floorBoxLines.push(new FloorBoxLine(box.x + box.length, z1, z2));
        this.floorRects.push(new Rect2D(
            box.x,
            box.z,
            box.x + box.length,
            box.z + box.width
        ));
    }
}
