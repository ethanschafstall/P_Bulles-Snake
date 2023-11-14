import { Apple } from "./Apple";
import { Segment } from "./Segment";

export class Snake
{
    constructor(x,y,spacer)
    {
        this.segments = [new Segment(x,y),new Segment(x+spacer,y),new Segment(x+spacer*2,y)];
    }
}