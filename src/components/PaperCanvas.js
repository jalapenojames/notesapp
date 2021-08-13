import React, { useEffect } from 'react'
import Paper from 'paper'
import PaperDrawing from './PaperDrawing'

export default function PaperCanvas(props) {

    const canvasRef = React.useRef()

    useEffect(() => {
        const canvas = document.getElementById('canvas')
        Paper.setup(canvas)
        PaperDrawing()
    }, [])

    return (
        <React.Fragment>
            {/* <h1>hello</h1> */}
            <canvas ref={canvasRef} {...props} id='canvas' resize='true' style={{height: '800px', width: '800px'}}/>
        </React.Fragment>
    )
}
