import { Segment } from "./Segment";
export class Snake
{
    constructor(x,y, direction)
    {
        this.segments = [new Segment(x,y),new Segment(x,y),new Segment(x,y)];
        this.direction = direction;
    }
}