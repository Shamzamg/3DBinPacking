import Box from "./Box";
import BoxPacker from "./BoxPacker";

export default class Container {
    private top: Container | null = null;
    private left: Container | null = null;
    private front: Container | null = null;

    public constructor(
        private packer: BoxPacker,
        public length: number = 0,
        public height: number = 0,
        public width: number = 0,
        public box: Box
    ) {
        box.container = this;
    }

    public push(box: Box): boolean {
        if(!this.top && this.height >= this.box.height + box.height) {
            box.x = this.box.x;
            box.y = this.box.y + this.box.height;
            box.z = this.box.z;
            if(!this.packer.overlapOnFloor(box)) {
                this.top = new Container(
                    this.packer,
                    this.box.length, this.height - this.box.height, this.box.width,
                    box
                );
                return true;
            }
        } 

        if(this.top && this.top.push(box)) {
            return true;
        }

        if(!this.left && this.width >= this.box.width + box.width) {
            box.x = this.box.x;
            box.y = this.box.y;
            box.z = this.box.z + this.box.width;
            if(!this.packer.overlapOnFloor(box)) {
                this.left = new Container(
                    this.packer,
                    this.box.length, this.height, this.width - this.box.width,
                    box
                );
                return true;
            }
        } 
        
        if(this.left && this.left.push(box)) {
            return true;
        }
        
        if(!this.front && this.length >= this.box.length + box.length) {
            box.x = this.box.x + this.box.length;
            box.y = this.box.y;
            box.z = this.box.z;
            if(!this.packer.overlapOnFloor(box)) {
                this.front = new Container(
                    this.packer,
                    this.length - this.box.length, this.height, this.width,
                    box
                );
                return true;
            }
        }
        
        if(this.front && this.front.push(box)) {
            return true;
        }

        box.x = 0;
        box.y = 0;
        box.z = 0;
        
        return false;
    }
}
