import React, { useState, useMemo, useEffect } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { NavLink } from 'react-router-dom'
 
export default function SlateEditor({ note, index, updateRedirect, updateNotes, who, notesTitle, notesContent, testNotes }) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const editor2 = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState(notesContent[index]);
  const [value2, setValue2] = useState([notesTitle[index]]);

  useEffect(() => {updateRedirect(0)}, [])

  const patchTitle = (newTitle) => {
    const titleObj = {
      title: newTitle,
      content: value
    }

    // Title patch request
    fetch(`http://localhost:3000/notes/${index+1}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(titleObj)
    })
        .then(r => r.json())
        .then(console.log("Patched notes"))
  }

  const patchContent = () => {

  }

  return (
    <div className="App d-flex flex-row" style={{posiition: 'relative'}}>

      {/* {Editor} */}
      <div className='border border-secondary' style={{padding: '2% 5% 6% 5%', position: 'absolute', height: '100vh', width: '700px'}}>
        { who==='home'? <NavLink to='/home' className="noteTitle"><h1>back</h1></NavLink> : who==='homeOG'? <NavLink to='/homeOG' className="noteTitle"><h1>back</h1></NavLink> : <h1>back</h1>}
        <br/><br/>
        <br/><br/>

        {/* {title} */}
        <Slate editor={editor2} value={value2} onChange={(newValue) => {
              // patchTitle(newValue)

              setValue2(newValue)

              updateNotes(newValue[0], index, 'title')
          }}>
          <Editable style={{ /*border: "1px solid black",*/ borderBottom: 'none', height: '30px', width: '400px', fontFamily: '', fontSize: '2em', fontWeight: 'bold'}}/>
        </Slate>
          <br/>

        {/* {content} */}
        <Slate editor={editor} value={value} onChange={(newValue) => {
              setValue(newValue)

              // Here is where we update testNotes in MC, but we also want it to give paragraph breaks to state
              updateNotes(newValue, index, 'content')
              // patchContent()
          }}>
          <Editable style={{ border: "1px solid black", height: '400px', overFlowY: 'auto'}}/>
        </Slate>
      </div>

      {/* {View notes list} */}
      <div className='col d-flex justify-content-end' style={{paddingRight: '5%', position: 'absolute', width: '300px', left: '50%', top: '50%'}}><div className='d-flex align-items-center'><div style={{fontFamily: 'Times New Roman', fontSize: '4em'}}>Notes</div></div></div>
      <div className='col' style={{height: '300px', overflowY: 'auto', whiteSpace: 'nowrap', maxWidth: '350px', position: 'absolute', left: '70%', top: '30%'}}>
          {/* {Note Panel} */}
          {testNotes.map((elem,index) => (
              <React.Fragment>
                  <div key={index} className='' style={{borderBottom: '1px solid black', padding: '2%'}}>
                      <div className='row' style={{overflowX: 'hidden'}}><h2>{elem[0]}</h2></div>
                      <div className='row' style={{overflowX: 'hidden'}}><p>{elem[1].split('<br/>')[0]}</p></div>
                      {/* elem[1] is now a nested array, lets write code to convert to text */}
                      {/* {redirect===1? <Redirect to='/editor'/> : console.log() } */}
                  </div>
              </React.Fragment>
          ))}
      </div>
    </div>
  );
}
