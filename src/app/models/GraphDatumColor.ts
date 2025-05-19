export class GraphDatumColor {
    public name: string;
    public value: string;

    constructor(datumName: string, hexColor: string) {
        this.name = datumName;
        this.value = hexColor;
    }
}