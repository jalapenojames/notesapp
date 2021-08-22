import React from 'react'
import Paper, { Path } from 'paper'

export default function PaperDrawing2() {

    // let myPath = new Paper.Path()

    // let mySquare = new Path.Rectangle(new Paper.Point(0, 0), new Paper.Size(600, 600));
    // mySquare.fillColor = 'black';

    let myCircle3 = new Paper.Path.Circle(new Paper.Point(300, 300), 200)
    myCircle3.fillColor='#2565AE'

    let myCircle2 = new Paper.Path.Circle(new Paper.Point(300, 300), 100)
    myCircle2.fillColor='#66D3FA'

    let myCircle = new Paper.Path.Circle(new Paper.Point(300, 300), 50)
    myCircle.fillColor='#D5F3FE' // powderblue

    // Paper.view.onMouseDown = (event) => {
    //   myPath.strokeColor = "white";
    //   myPath.strokeWidth = 3;
    // };

    // Paper.view.onMouseDrag = (event) => {
    //   myPath.add(event.point);
    // };

    Paper.view.onFrame = () => {
      // myCircle.rotate(3)
      // myCircle2.rotate(3)
      // mySquare.rotate(3)
    }

    Paper.view.draw();
}
