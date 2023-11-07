import './Segment.js';

class Segment
{
    constructor(x,y,color,isHead)
    {
        this.XPos = x;
        this.YPos = y;
        this.Color = color;
        this.IsHead = isHead;
    }    
}

let segment = new Segment(1,2,"red", true);
console.log(segment.Color);