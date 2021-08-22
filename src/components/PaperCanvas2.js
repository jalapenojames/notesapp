import React, { useEffect } from 'react'
import Paper from 'paper'
import PaperDrawing2 from './PaperDrawing2'

export default function PaperCanvas(props) {

    const canvasRef = React.useRef()

    useEffect(() => {
        const canvas = document.getElementById('canvas')
        Paper.setup(canvas)
        PaperDrawing2()
    }, [])

    return (
        <React.Fragment>
            {/* <h1>hello</h1> */}
            <canvas ref={canvasRef} {...props} id='canvas' resize='true' style={{height: '600px', width: '600px'}}/>
        </React.Fragment>
    )
}
