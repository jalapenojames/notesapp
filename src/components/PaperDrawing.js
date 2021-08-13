import Paper from 'paper'

export default function PaperDrawing() {

      // const [count, setCount] = useState(0)

      let count=0

      // let myPath = new Paper.Path()

      let manyPaths = []
      for(let i=0; i<=100; i++) {
        manyPaths[i] = new Paper.Path()
      }


      Paper.view.onMouseDown = (event) => {
        // myPath.strokeColor = "black";
        // myPath.strokeWidth = 3;

        manyPaths[count].strokeColor = "black";
        manyPaths[count].strokeWidth = 3;
      };
    
      Paper.view.onMouseDrag = (event) => {
        // myPath.add(event.point);

        manyPaths[count].add(event.point)
      };

      Paper.view.onMouseUp = (event) => {
        ++count
      }
    
      Paper.view.draw();
}
