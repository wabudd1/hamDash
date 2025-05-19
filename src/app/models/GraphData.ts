import { IGraphData } from "./iGraphData";

export class GraphData implements IGraphData {
    name: string;
    value: number;

    constructor(nameParam: string, valueParam: number) {
        this.name = nameParam;
        this.value = valueParam;
    }
}