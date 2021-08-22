import React, { useEffect } from 'react'

export default function Rotate2() {
    useEffect(()=>{
        // Generated by CoffeeScript 1.6.3
        var R2D, active, angle, center, init, rotate, rotation, start, startAngle, stop;
        const target=document.getElementById('target2')
      
        active = false;
      
        angle = 0;
      
        rotation = 0;
      
        startAngle = 0;
      
        center = {
          x: 0,
          y: 0
        };
      
        document.ontouchmove = function(e) {
          return e.preventDefault();
        };
      
        init = function() {
          target.addEventListener("mousedown", start, false);
          target.addEventListener("mousemove", rotate, false);
          return target.addEventListener("mouseup", stop, false);
        };
      
        R2D = 180 / Math.PI;
      
        start = function(e) {
          var height, left, top, width, x, y, _ref;
          e.preventDefault();
          _ref = this.getBoundingClientRect() 
          top = _ref.top
          left = _ref.left
          height = _ref.height
          width = _ref.width
          center = {
            x: left + (width / 2),
            y: top + (height / 2)
          };
          x = e.clientX - center.x;
          y = e.clientY - center.y;
          startAngle = R2D * Math.atan2(y, x);
          return active = true;
        };
      
        rotate = function(e) {
          var d, x, y;
          e.preventDefault();
          x = e.clientX - center.x;
          y = e.clientY - center.y;
          d = R2D * Math.atan2(y, x);
          rotation = d - startAngle;
          if (active) {
            return this.style.webkitTransform = "rotate(" + (angle + rotation) + "deg)";
          }
        };
      
        stop = function() {
          angle += rotation;
          return active = false;
        };
    
        init();


    },[])

    return (
        <div>
          <h1 style={{zIndex: '1', position: 'absolute'}} id="target2">{/*'ROTATE ME!'*/}</h1>
        </div>
        
    )
}

{/* <style>
  body {
    display: flex;
    justify-content: center;
  }
  #target {
    margin-top: 100px;
    font-family: "Helvetica Neue", sans-serif;
    font-weight: 100;
    font-size: 150px;
    color: #777;
    -webkit-font-smoothing: antialiased;
  }
  #target:hover {
    color: orange;
    cursor: pointer;
  }
</style> */}