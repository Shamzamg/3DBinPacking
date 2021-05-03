export default class BoxData {
    public constructor(
        public length: number = 10,
        public width: number = 10,
        public height: number = 10,
        public quantity: number = 1,
        public tag: string = ""
    ) { }

    public static equals(a: BoxData, b: BoxData) {
        return a.length === b.length && a.width === b.width && a.height === b.height;
    }
    public static compare(a: BoxData, b: BoxData) {
        return a.length !== b.length ? a.length - b.length : 
            a.width !== b.width ? a.width - b.width : 
                a.height - b.height;
    }
}