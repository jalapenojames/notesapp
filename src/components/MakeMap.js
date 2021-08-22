import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import Interweave from 'interweave';
import Badge from 'react-bootstrap/Badge'
import PaperCanvas2 from './PaperCanvas2'
// import { BFSdriver } from './MapBFS'
import _next from '../next_arrow.png'
import _back from '../note_back.png'
import _grid from '../grid.png'
import _save from '../save.png'
import Rotate from './Rotate'
import Rotate2 from './Rotate2'

export default function MakeMap({ notesTitle, layerMap, updateLayerMap, root, updateRoot, testNotes }) {
    const defaultArr = Array(testNotes.length).fill().map((elem,idx) => idx)

    const [value, setValue] = useState('');
    // const [whatsLeft, setWhatsLeft] = useState(defaultArr);
    // const [citizens, setCitizens] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [grid, setGrid] = useState(false);

    const clickedNote = (id) => {
        // console.log('id here is ', id)
        layerMap===0? handleClick0(id) : console.log()
        layerMap===1? handleClick1(id) : console.log()
    }

    const clickedMapNote = (id) => {
        // If you click the root note, then add value as root's child
        // id for this scenario is the rootID
        root[0].who === id? value || value===0? handleClickRoot1(value) /* Add function here to add value as a child of root */ : console.log() : console.log()
        id!== root[0].who? handleClickChild(id) : console.log()
    }

    // Make note that's clicked on into the root note
    const handleClick0 = (id) => updateRoot([{who: id, children: null}])
    
    const handleClick1 = (id) => value===id? setValue('') : setValue(id)

    const handleClick0Arrow = () => root.length>0? updateLayerMap(1) : console.log()

    const handleClick1Arrow = (who) => {
        who==='left'? updateLayerMap(0) : console.log()
        who==='right'? updateLayerMap(2) : console.log()
    }

    const handleClick2Arrow = (who) => {
        who==='left'? updateLayerMap(1) : console.log()
        // who==='right'? updateLayerMap(2) : console.log()
    }

    const handleClickRoot1 = (who) => {        
        // Add who under root (state)  
        if(root[0].children === null) {
            root[0].children = [{ who: who, children: null}]
            // console.log([{ who: who, children: null}])
            updateRoot(root)
            setToggle(!toggle)
            setValue('')
            return
        }
        if(root[0].children!==null) {
            let arr = []
            // console.log('we selected', who, 'to be added')
            root[0].children.map(elem => arr.push(elem.who))                    // Add existing children
            arr.push(who)                                                       // Add selected note index
            // console.log(arr)
            const append = arr.map(elem => ({ who: elem, children: null}))
            // console.log(append, root)
            root[0].children = append

            updateRoot(root)
            setToggle(!toggle)  
            setValue('')                                    
            // ^Force update, this effectively runs the UseEffect that depends on a change in Root
            //      - Then it displays it in JSX render (done by useEffect(()=>{}, [toggle]))
            return
        }
    }

    const handleClickGrid = () => setGrid(!grid)

    const handleClickChild = (who) => {
        console.log('alright got here', 'clicked: '+who)
        // update root , 
        const flattenedRoot = evalFlattenedOb(flattenObject(root))
        console.log(flattenedRoot)

        console.log('value', value)

        if(value==='') {
            console.log('ready to delete')

            console.log(findPathWho(root,who))
            console.log(findPathCol (root,who))
            // Delete node
            const pathCol = findPathCol(root,who)                   // Path is in this format #=> [col,col,col]

            let holder = [`root[${pathCol[0]}]`]
            pathCol.slice(1,pathCol.length-1).map((elem,i) => {
                holder.push(`children[${pathCol[i+1]}]`)
            })
            const address = eval(holder.join('.'))
            console.log('address' , address)

            // -- Before we delete below, we need to know if there are any children
 
            // If just one child, means we can go ahead and delete
            if(address.children.length===1) {
                address.children = null
                updateRoot(root)
                setToggle(!toggle)
                return
            }
            else {
                // copy complete child 
                const copy = address.children
                // map through and only delete elem.who===who
                let newNode = []
                copy.map(elem => {
                    if(elem.who!==who)
                        newNode.push(elem)
                })
                console.log(newNode, who)
                address.children = newNode
                updateRoot(root)
                setToggle(!toggle)
                return
            }



            return
        }
 

        // Find who, and add 'who' as a child
        // Find path of who
        const path = findPathWho(root,who)                      // Path is in this format #=> [root,parent,who]
        const pathCol = findPathCol(root,who)                   // Path is in this format #=> [col,col,col]
        // console.log(path)
        // console.log(pathCol)
        // Edit that root 
        //      - Find address:
        let holder = [`root[${pathCol[0]}]`]
        pathCol.slice(1,pathCol.length).map((elem,i) => {
            holder.push(`children[${pathCol[i+1]}]`)
        })
        const address = eval(holder.join('.'))
        // console.log('address' , address)
        
            // Add who under node  
            if(address.children === null) {
                address.children = [{ who: value, children: null}]
                // console.log([{ who: who, children: null}])
                updateRoot(root)
                setValue('')
                setToggle(!toggle)
                console.log('1')
                return
            }

            if(address.children!==null) {
                let arr = []
                // console.log('we selected', who, 'to be added')
                address.children.map(elem => arr.push(elem.who))                        // Add existing children
                arr.push(value)                                                         // Add selected note index
                // console.log(arr)
                const append = arr.map(elem => ({ who: elem, children: null}))
                // console.log(append, root)
                address.children = append
    
                updateRoot(root)
                setValue('')
                setToggle(!toggle)  
                console.log('2')                                    
                return
            }

            console.log('nobody in value')

        // upon successfull add, set Value to '' to reset and allow another update
        // might not have to because the conditional checks if its an element of root

        // example: [{who: '1', children: [{who: '2', children: [{who: '3', children: null},{who: '5', children: null}]}, {who: '4', children: [{who: '0', children: null}]}]}]


    }

    // Pick your root
    const layerMap0 = () => (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center">
                <h1>Pick your root</h1>
                <br/><br/>
                <br/><br/>
                {root.length>0? <h2><Badge variant="dark" className='border border-secondary rounded' /*style={{width: '200px'}}*/>{lessThanFifteen(testNotes[root[0].who][0], 20)}</Badge></h2> : <p>your root goes here when selected</p>}
                {/* {console.log(root.length)} */}
                <br/><br/>
                Next<img onClick={handleClick0Arrow} src={_next} alt='next arrow' style={{height: '60px'}}/>
            </div>
        </React.Fragment>
    )

    // Add a child
    const layerMap1 = () => (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center">
                <h1 >Create map</h1>
                <div className=' d-flex flex-column align-items-center justify-content-center' style={{height: '600px', width: '600px', position: 'relative', zIndex: '1', backgroundColor: '#001C57', borderRadius: '10px'}}>
                    
                    {/* Root node */}
                    {root.length>0? rootJSX() : console.log()}
                    
                    {/* Child node */}
                    {root.length>0? drawing() : console.log()}

                    {/* Square frame */}
                    {/* <div style={{zIndex: '-1', transform: 'rotate(45deg)', border: 'solid white 2px', height: '100px', width: '100px', position: 'absolute'}}>square</div> */}

                    {/* {Tree Emoji} */}
                    <div style={{zIndex: '-1', height: '100px', width: '100px', position: 'absolute', fontSize: '4em', top: '400px'}}>🌳</div>

                </div>
                <br/>
                {/* <br/> */}
                <div className='row'>
                    <div className='col'>Back</div>
                    <div className='col'>Next</div>
                </div>
                <div className='row'>
                <img className='col' onClick={() => handleClick1Arrow('left')} src={_next} alt='next arrow' style={{height: '50px', width: 'auto', transform: 'rotate(180deg)', padding: '0 10px 0 10px'}}/>
                <img className='col' onClick={() => handleClick1Arrow('right')} src={_next} alt='next arrow' style={{height: '50px', width: 'auto', padding: '0 10px 0 10px'}}/>
                </div>
            </div>
        </React.Fragment>        
    )

    // Look at note map
    const layerMap2 = () => (
        <React.Fragment>
            <div className="d-flex flex-column align-items-center">
                <h1>Note Map</h1>
                {/* <br/><br/> */}
                <div /*id='target'*/ className='d-flex flex-column align-items-center justify-content-center' style={{height: '600px', width: '600px', position: 'relative'}}>
                    
                    {/* Containers */}
                    <div className='d-flex flex-column align-items-center justify-content-center' style={{position: 'absolute', height: '600px', width: '600px', opacity: '1', zIndex: '1', backgroundColor: '#001C57', borderRadius: '10px'}}>
                        <div id='target2' className='rounded-circle' style={{height: '600px', width: '600px', position: 'absolute', zIndex: '-1', backgroundColor: '#001C57'}}>
                            <div className='d-flex flex-column align-items-center justify-content-center' style={{color: 'white'}}>
                            {/* Root node */}
                            {/* { root.length>0? rootJSX() : console.log() } */}
                            
                            {/* Circles with Paper.js */}
                            <div style={{height: '500px', width: '500px', position: 'absolute', zIndex: '-1', top: 0, left: 0}}>
                                <PaperCanvas2/>
                            </div>

                            {/* {example level 1} */}
                            {/* <div className='border border-danger text-orange' style={{position: 'absolute', top: '250px', left: '250px', height: '100px', width: '100px', transform: 'rotate(-45deg)'}}>
                                <div><Badge variant='secondary'>asdf</Badge></div>
                            </div> */}

                            {/* {example level 2} */}
                            {/* <div className='border border-info text-orange' style={{position: 'absolute', top: '200px', left: '200px', height: '200px', width: '200px', transform: 'rotate(45deg)'}}>
                                <div><Badge variant='secondary'>asdf</Badge></div>
                            </div> */}

                            {/* {example level 3} */}
                            {/* <div className='border border-warning text-orange' style={{position: 'absolute', top: '100px', left: '100px', height: '400px', width: '400px', transform: 'rotate(-45deg)'}}>
                                <div><Badge variant='secondary'>asdf</Badge></div>
                            </div> */}

                            {/* {Radial Tree} */}
                            {radialTree2(grid)}  

                            <Rotate />
                            <Rotate2 />



                            </div>
                        </div>

                        {/* layer 1 */}
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h2 className={`border border-dark bg-primary text-dark rounded d-flex justify-content-center align-items-center`} style={{zIndex: '20', fontWeight: 'bold', position: 'absolute', top: '270px'}}>{lessThanFifteen(testNotes[root[0].who][0],9)}</h2>
                            {/* Test */}
                            {drawingTest()} 
                        </div>  
                         
                         {/* {Grid Icon} */}
                        <img onClick={handleClickGrid} src={_grid} alt='grid button' style={{height: '60px', position: 'absolute', top: '650px', left: '700px'}}/>
                      
                    </div>                    
                </div>
                <br/>
                {/* <br/> */}
                <div className='row'>
                    <div className='col'>Back</div>
                    <div className='col'>Next</div>
                </div>
                <div className='row'>
                <img className='col' onClick={() => handleClick2Arrow('left')} src={_next} alt='next arrow' style={{height: '50px', width: 'auto', transform: 'rotate(180deg)', padding: '0 10px 0 10px'}}/>
                <img className='col' onClick={() => handleClick2Arrow('right')} src={_next} alt='next arrow' style={{height: '50px', width: 'auto', padding: '0 10px 0 10px'}}/>
                </div>
            </div>
        </React.Fragment>        
    )

    const radialTree2 = (toggle) => {
        // const toggle = false

        const borderPalette = ['dark', 'info', 'warning']
        const dispAttribute1 = toggle? `border border-${borderPalette[0]}` : `border border-${borderPalette[0]}`
        const dispAttribute2 = toggle? `border border-${borderPalette[1]}` : ''
        const dispAttribute3 = toggle? `border border-${borderPalette[2]}` : ''

        const flattenedRoot = evalFlattenedOb(flattenObject(root))
        console.log(flattenedRoot)
        console.log(flattenedRoot.join(''))

        let len = 3
        if(flattenedRoot.length<3)
            len=flattenedRoot.length

                // Limit to 3
                const limitedTo3 = Array(len).fill().map((elem,i) => flattenedRoot[i])
        
        console.log(limitedTo3)

        const divAngles = limitedTo3.map(elem=> {
            const count = elem.length
            const angleMultiple = 360/count
            const angleArray = Array(count).fill().map((e2,i) => i*angleMultiple) // [0,1,2] => [0,120,240]
            // Return Array of rotation angles for each layer
            return angleArray
        })
        console.log(divAngles)

        // Layer 2
        let lengthLay2=0
        if(flattenedRoot[1] || flattenedRoot[1]===0)
            lengthLay2 = flattenedRoot[1].length

        // Layer 3
        // will need to have conditional if root has NO children
        let lengthLay3=0
        if(flattenedRoot[2] || flattenedRoot[2]===0)
            lengthLay3 = flattenedRoot[2].length            

        return (
            <React.Fragment>
                {/* {layer 2} */}
                {Array(lengthLay2).fill().map((elem,i) => {
                    return (
                        <div id='target' className={`${dispAttribute2} text-orange`} style={{ zIndex: '5', position: 'absolute', top: '200px', left: '200px', height: '200px', width: '200px', transform: `rotate(${i*360/lengthLay2}deg)`}}>
                            <h4><Badge variant='warning'>{testNotes[flattenedRoot[1][i]][0]}</Badge></h4>
                        </div>                        
                    )
                })}
                {/* {layer 3} */}
                {Array(lengthLay3).fill().map((elem,i) =>{
                    return (
                        <div className={`${dispAttribute3} text-orange`} style={{ position: 'absolute', top: '100px', left: '100px', height: '400px', width: '400px', transform: `rotate(${i*360/lengthLay3}deg)`}}>
                            <h5><Badge className='' style={{backgroundColor: '#155d27', color: '#D5F3FE'}} /*variant='success'*/>{testNotes[flattenedRoot[2][i]][0]}</Badge></h5>
                            {/* {'#fb8500' text-dark fefae0} */}
                        </div>
                    )
                })}
            </React.Fragment>
        )
    }

    const drawing = () => {
        const flattenedRoot = evalFlattenedOb(flattenObject(root))
        // console.log('root', flattenedRoot)
        // console.log('edges', evalMakeEdges(root))

        return (
            <div>{flattenedRoot.splice(1,flattenedRoot.length-1).map(elem => (
                    <div className='row d-flex flex-row align-items-center justify-content-center'>{ elem.map(e => <h5><Badge id={'Tag'+e} onClick={()=>clickedMapNote(e)} className='bg-primary text-white border border-dark rounded' style={{width: '70px', marginTop: '5%', transition: 'all .3s ease-in'}}>{lessThanFifteen(testNotes[e][0],9)}</Badge></h5> )}</div>
            ))}</div>
        )
    }

    const drawingTest = () => {
        // console.log(flattenObject(root))
        const depth = Object.keys(flattenObject(root)).map(elem => elem.split('.').length/2)
        const vals = Object.values(flattenObject(root))

        // console.log(depth,vals) 

        let max_of_array = Math.max.apply(Math, depth);
        // console.log(max_of_array)

        let map = Array(max_of_array).fill().map(elem => [])
        depth.map((elem, i) => vals[i] || vals[i]===0? map[elem-1].push(vals[i]) : console.log())

        // console.log(map)
     

        return (
            <h5 className='text-dark' style={{position: 'absolute', top: '310px'}}>🍗tabTree</h5>
        )

    }

    const rootJSX = () => <h2><Badge onClick={()=>clickedMapNote(root[0].who)} className='bg-dark text-white border border-dark rounded' style={{ margin: 0}}>{lessThanFifteen(testNotes[root[0].who][0],10)}</Badge></h2>

    useEffect(()=>{
        // Reset Root upon render
        updateRoot([])
        // updateLayerMap(0)

        // Reset selected id
        setValue('')



    },[])



    const findPathWho = (tree, who) => {
        // initialization
        const data = evalMakeEdges(tree)
        let holder = [who]
        let depth = []

        // find depth of who
        const flatOb = evalFlattenedOb(flattenObject(tree))
        // console.log(flatOb)
        flatOb.map((elem,i) => {
            if(elem.includes(who.toString()) || elem.includes(who))
                depth.push(i)
        }) 
        // console.log('depth, ' + depth)


        let w=who
        for(let i=0; i<depth[0]; i++) {
            data.map(elem => {
                if(elem[1]===w) {
                    holder.push(elem[0])
                    w=elem[0]
                }
            })
        }
        return holder.reverse()
    }

    const findPathCol = (tree,who) => {
        let data = evalFlattenedOb(flattenObject(tree))
        const path = findPathWho(tree, who)
        let holder = []
        // console.log(data)
        // console.log(path)

        path.map((elem,i) => {
            data[i].map((elem2,i2) => {
                if(+elem2===elem)
                    holder.push(i2)
            })
        })

        return holder
    }

    const evalFlattenedOb = (ob) => {
        let keys = Object.keys(ob)
        let vals = Object.values(ob)

        // Turn keys into 'depth'
        const depth = keys.map(elem => elem.split('.').length/2)
        const combined = depth.map((elem,i) => [depth[i],vals[i]])


        let max_of_array = Math.max.apply(Math, depth);

        let map = Array(max_of_array).fill().map(elem => [])
        depth.map((elem, i) => vals[i] || vals[i]===0? map[elem-1].push(vals[i]) : console.log())

        return map
    }

    function flattenObject(ob) {
        var toReturn = {};
    
        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) continue;
    
            if ((typeof ob[i]) == 'object' && ob[i] !== null) {
                var flatObject = flattenObject(ob[i]);
                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;
    
                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }

    // Display Root's children in JSX render
    useEffect(()=>{
        // root.length>0? displayRoot(root) : console.log()
    },[toggle])

    useEffect(()=>{
        // console.log(root)
    },[root])

    const evalMakeEdges = (tree) => {
        let t = makeEdges(tree,[])

        if(tree[0].children===null)
            return [tree[0].who]
        // if(!t[1]) {
        //     console.log('gottem', t.slice(0,1))
        //     t = t.slice(0,1)

        //     let tResult=[]
        //     t.map(elem => {
        //         // bookmark
        //     })
        // }

        let tResult = []
        t.map(elem => {
            if(elem.length>0)
                tResult.push(+elem)
        })
        let tCoord= []
        for (let i=0; i<tResult.length/2; i++) {
            tCoord.push([ tResult[2*i], tResult[2*i+1] ])
        }

        return tCoord
    }

    const getLastChar = (string) => {
        if(typeof string === 'number')
            return string.toString().split('.')[string.toString().split('.').length-1]
        return string.split('.')[string.split('.').length-1]
    }

    const getEdges = (tree) => {
        let s = getLastChar(tree[0].who)
        if(tree[0].children) {
            let c = tree[0].children.map(elem => getLastChar(elem.who))
            // s += ','+c
            s = c.map(elem => [+s].concat(+elem))
            return s
        }
        return 
    }

    // Recursive function to retrieve edges on Root
    const makeEdges = (tree,a) => {
        if(tree[0].children) {          
            // console.log(getLastChar(tree[0].who), a.length, getEdges(tree), tree[0].who)  
            // return [tree[0].who].concat(tree[0].children.map(elem => makeEdges([elem],a.concat([tree[0].who])))).join().split(',')
            return getEdges(tree).concat(tree[0].children.map(elem=>makeEdges([elem],a.concat([getEdges(tree)])))).join().split(',')
        }
        else {
            // console.log(getLastChar(tree[0].who), a.length, getEdges(tree), tree[0].who)  
            return getEdges(tree)
        }
    }

    // Recursive function to print Root (??? test)
    const mapTree3 = (tree,a) => {
        if(tree[0].children) {          
            console.log(tree[0].who, a.length)  
            return [tree[0].who].concat(tree[0].children.map(elem => mapTree3([elem],a.concat([tree[0].who])))/*.join()*/)//.join().split(',')
        }
        else {
            console.log(tree[0].who, a.length)  
            return tree[0].who
        }
    }

    // Recursive function to print Root
    const mapTree = (tree,a) => {
        if(tree[0].children) {            
            return [tree[0].who].concat(tree[0].children.map(elem => mapTree([elem],a.concat([tree[0].who]))).join()).join().split(',').map(elem => +elem)
        }
        else {
            return tree[0].who
        }
    }

    // Recursive function wrapper to return result as an Array
    const mapTree2 = (tree,a) => {
        const mapTree = (tree,a) => {
            if(tree[0].children) {            
                return [tree[0].who].concat(tree[0].children.map(elem => mapTree([elem],a.concat([tree[0].who]))).join()).join().split(',').map(elem => +elem)
            }
            else {
                return tree[0].who
            }
        }

        if(typeof mapTree(tree,a) === 'number')
            return [mapTree(tree,a)]
        else
            return mapTree(tree,a)
    }

    const displayRoot = (node) => console.log('i should be displaying something')       // currently, Root is being passed in as node 

    const actionDisplay = (val) => {
        const valNum = val.toString().split('.')[val.toString().split('.').length-1]    // Retrieve last number in path name e.g. 4.1.3 => "3"
        const newNode = document.createElement('p')                                     // Create new node to append

    }

    // Return phrase up to 18 characters long
    const lessThanFifteen = (phrase, num) => {
        let charactersUsed = 0
        let desiredIndex = 0
        if(num < 1 || !num)
            num=15
        phrase.split(' ').map((elem,index) => {
            charactersUsed+= elem.length + 1
            charactersUsed<num? desiredIndex = index : console.log()
        })

        return (phrase.split(' ').map((elem,index) => index<=desiredIndex? elem : console.log()).join(' '))
    }

    const printRoot = (node) => {
        if(node[0].children) {
            console.log(node[0].who)

            node[0].children.map(elem => {
                printRoot([elem])
            })
        }
        else {
            console.log(node[0].who)
        }
    }

    const printRootArr = (node) => {
        if(node[0].children) {
            console.log(node[0].who)

            node[0].children.map(elem => {
                printRootArr([elem])
            })
        }
        else {
            console.log(node[0].who)
        }
    }

    const whichList = () => {
        const defaultArr = Array(notesTitle.length).fill().map((elem,idx)=>idx)
        if(layerMap===0)        // This returned array is the complete and full notes list #=> [0,1,2...]
            return defaultArr
        if(layerMap===1 || layerMap===2) {      // need to revisit this and return only 'whats left' - root - any 'taken' notes
            let currentArr = defaultArr

            let rootIndex = ''
            let takenNotes = []                     // Example, placeholder
            let r2 = []
            if(root.length>0) {
                rootIndex = root[0].who             // Get root index           // #=> [n] or [rootIndex]
                // Taken notes (add root)
                takenNotes.push(rootIndex)
                // Taken notes (add all children)
                // >> create this f-n
                const r = mapTree(root, [])
                let r2 = takenNotes.concat(r)
                r2.splice(0,1)

                // if you want to remove clicked child
                // r2.map(elem => takenNotes.push(elem))
                // takenNotes.shift()


                // Remove all root/taken notes
                currentArr.splice(rootIndex,1)      // *** Cannot splice any further, must use different method since index will no longer match
            }

            // Find matching index from takenNotes in currentArr
            // If it matches, splice it from array 
            // console.log(currentArr)
            let toBeRemoved = []
            takenNotes.map(elem => currentArr.includes(elem)? toBeRemoved.push(elem) : console.log())   // Adds 'notes to be removed' to array
            // console.log(toBeRemoved)

            let toBeReturned = []
            currentArr.map(elem => toBeRemoved.includes(elem)? console.log() : toBeReturned.push(elem))
            // console.log(toBeReturned)
            
            return toBeReturned
        }        
        return defaultArr       // default 
    }

    // Disable 'who' in available notes, reminder who is value or currently selected note in left panel
    // Change Left panel selected note to gray
    const conditional = (color1, color2, elem) =>  {
        // layerMap===1? value===elem? root.length>0? mapTree2(root,[]).includes(elem)? color1 : console.log() : console.log() : console.log() : console.log()
        if(layerMap===1 && root.length>0) {
            if(mapTree2(root,[]).includes(elem))
                return color1
            if(value===elem)
                return color2
            if(value!==elem)
                return ''
        }
        return
    }

    const conditional2 = (color1, color2, elem) => layerMap===1? value===elem? root.length>0? mapTree2(root,[]).includes(elem)? color1 : color2 : console.log() : console.log() : console.log()

    const handleSave = () => {

        const patchNotesObj = {
            // need 

        }

        
        // // User patch request
        // fetch('http://localhost:3000/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json'
        //     },
        //     body: JSON.stringify(postObj)
        // })
        //     .then(r => r.json())
        //     .then(console.log("Patched user"))
    }

    return (
        <div className='d-flex align-items-center justify-content-center' style={{height: '100%'}}>

            {/* { PANEL } */}
            <div className='d-flex flex-column justify-content-center align-items-center' style={{height: '100%'/*, borderRight: 'solid 1px black'*/, position: 'relative'}}>
                <div className='' style={{position: '', height: '80px', width: '80px'}}></div>
                <div className='d-flex flex-column align-items-center' style={{width: '300px', height: '500px'}}>
                    <Link to='/home' className='noteTitle' style={{paddingRight: '10%'}}>back</Link>
                    <ul className='notesTitle'style={{margin: 'auto', width: '300px', height: '400px', overflowY: 'auto'}}>
                        {/* notes looks like [0,1,2,3,4,5,6,7,8] */}
                        {/* but it will look like [0,3,4,5] */}
                        {whichList().map((elem,index) => (
                            <li onClick={() => clickedNote(elem)} className='col' style={{width: '200px', listStyleType: 'none', pointerEvents: `${conditional('none','auto',elem)}`}}>
                                <p className='rounded'/*'border border-secondary rounded'*/ style={{backgroundColor: `${conditional('gray','green',elem)}`, color: `${conditional('black','white',elem)}`, fontWeight: 'bold', fontSize: '1.2em', transition: 'all .3s ease-in'}}>{lessThanFifteen(notesTitle[elem].children[0].text,18)}</p>
                            </li>                                                
                        ))}
                    </ul>  
                </div>
                {/* <img onClick={handleSave} src={_save} alt='save btn' style={{height: '30px', paddingRight: '8%'}}/>
                <div style={{paddingRight: '8%'}}>{'saved!'}</div> */}
            </div>

            {/* { MAP MAKER } */}
            <div className="col" style={{position: 'relative'}}>
                {layerMap===0? layerMap0() : console.log()}
                {layerMap===1? layerMap1() : console.log()}
                {layerMap===2? layerMap2() : console.log()}
            </div>
        </div>
    )
}