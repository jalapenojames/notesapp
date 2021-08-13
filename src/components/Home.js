import React, { useEffect, useState } from 'react'
import _arrow from '../arrow.png'
import _create from '../create.png'
import _map from '../map.png'
import { Link, Redirect } from 'react-router-dom'
import PaperCanvas from './PaperCanvas'

export default function Home({ testClick, handleClickNew, redirect, testNotes, updateWho, note, deleteCurrentNote, notesAssoc, users, currentUser, updateUserNotes, notesTitle, notesContent }) {
    
    useEffect(() => {
        checkDeleteNewNote()
        updateWho('')
        

        // Update which notes can be viewed based on current User
        const userIndex = users.indexOf(currentUser) + 1

        // Filter notes based on User
        let filteredUserNotes = []
        notesAssoc.map(elem => {
            elem[1].userID === userIndex? filteredUserNotes.push(elem[0]) : console.log()
        })
        console.log(filteredUserNotes)

        // Update notesTitle and notesContent and testNotes to only include [1,4,6]
        // updateUserNotes()
        const newTitle = returnSelected(notesTitle, filteredUserNotes)
        const newContent = returnSelected(notesContent, filteredUserNotes)
        const newTestNotes = returnSelected(testNotes, filteredUserNotes)

        console.log(newTitle)
        console.log(newContent)

        // updateUserNotes(newTitle,newContent, newTestNotes)
    }, [])

    const returnSelected = (original, filter) => {
        let newItems = []
        original.map((elem,i)=>{
            if(filter.includes(i))
            newItems.push(elem)
        })
        // (5) [1, 5, 6, 7, 9] => update notes to reflect this
        return newItems
    }

    const checkDeleteNewNote = () => {
        // If meets condition, delete Note current index
        if(note[0]==="New note" && note[1]==='' || note[0]==="New note" && note[1]==='<br/>')
            deleteCurrentNote()
    }

    return (
        <div className='d-flex flex-row align-items-center justify-content-center' style={{height: '100%'}}>
            <p style={{marginBottom: '160px', fontFamily: 'quicksand', fontSize: '1.5em', paddingRight: '10%'}}>Welcome, {currentUser}</p>
            <div className='d-flex flex-row' style={{position: 'relative'}}>
                <div className='border-primary' style={{height: '800px', width: '1100px', position: 'absolute', zIndex: '0', top: '-300px', left: '-400px'}}>
                    <PaperCanvas />
                </div>
                <div className='col d-flex justify-content-end' style={{paddingRight: '5%'}}><div className='d-flex align-items-center'><div style={{fontFamily: 'Times New Roman', fontSize: '4em'}}>Notes</div></div></div>
                <div className='col' style={{height: '300px', overflowY: 'auto', whiteSpace: 'nowrap', maxWidth: '500px'}}>
                    {/* {Note Panel} */}
                    {testNotes.map((elem,index) => (
                        <React.Fragment>
                            <div key={index} className='' style={{borderBottom: '1px solid black', padding: '2%'}} onClick={() => testClick(elem, index, 'home')}>
                                <div className='row' style={{overflowX: 'hidden'}}><h2>{elem[0]}</h2></div>
                                <div className='row' style={{overflowX: 'hidden'}}><p>{elem[1].split('<br/>')[0]}</p></div>
                                {/* elem[1] is now a nested array, lets write code to convert to text */}
                                {redirect===1? <Redirect to='/editor'/> : console.log() }
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* {Take me to Notemap} */}
                <div className='row' style={{position: 'absolute', top: '400px', left: '350px'}}><Link to='/makemap'><img src={_map} alt='map or a book' style={{height: '50px'}}/></Link></div>
                {/* {Navigation} */}                
                <div className='col' style={{position: 'absolute', left: '400px'}}>
                    <Link to='/homeOG'><img src={_arrow} alt='arrow' style={{height: '15px'}}/></Link>
                    <button onClick={handleClickNew} style={{backgroundColor: 'transparent', border: 'none'}}><img src={_create} alt='create' style={{height: '20px'}}/></button>
                </div>
            </div>
        </div>
    )
}

