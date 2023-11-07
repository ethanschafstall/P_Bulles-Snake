import { Apple } from "./Apple";
import { Segment } from "./Segment";

export class Snake
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.segments = [new Segment(10,10,green,false),new Segment(10,11,green,false),new Segment(10,12,green,false),new Segment(10,14,green,true)];
    }
    Eat(Apple)
    {
        let index = this.segments.lastIndexOf(this.segments);
        this.segments[index].isHead = false;
        this.segments.push(new Segment(Apple.x,Apple.y,darkgreen,true));
    }    
}

let snake = new Snake (10,10);