import React, { Component } from 'react'
import _arrow from '../arrow.png'
import _plus from '../plus_sign.png'
import _test from '../testRescale.png'
import { Link, Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form'

export default class HomeOG extends Component {

    layer0 = () => { 
        return (
            <div className='col d-flex justify-content-end'>
                <div className='d-flex align-items-center'>
                    <div onClick={() => this.handleClick0()} style={{fontFamily: 'Times New Roman', fontSize: '4em'}}>
                        Notes</div></div></div>
        )
    }

    layer1 = () => { 
        return (
            <div className="border-secondary" style={{height: '600px', width: '800px', position: 'relative'}}>
                <div className="border-dark" style={{position: 'absolute', height: '600px', width: '800px', top: '0px', left: '0px', whiteSpace: 'nowrap'}}>
                    {Array(5).fill().map((elem,indexR) => (<div className='row' style={{height: '20%'}}>{Array(5).fill().map((elem,indexC) => {

                        // Provides index value of note title that should be displayed
                        const boxNum = (indexC+indexR)%2 === 1? indexR%2===0? 5*indexR/2+1 + (indexC+1+indexR%2)/2 - 1 : 5*(indexR+1)/2-2 + (indexC+1+indexR%2)/2 - 1 : console.log() 
                        
                        // for search filter feature, we will need to filter testNotes
                        let testNotes // this.props.testNotes
                        this.props.filtered? testNotes=[] : testNotes=this.props.testNotes
                        this.props.filtered? this.props.filtered.length>0? testNotes=this.props.filtered : console.log() : console.log()

                        // Prints note titles over 5 by 5 grid (created in Array(5).fill()... )
                        return (<div className='col d-flex align-items-center justify-content-center' style={{overflowX: 'hidden', fontFamily: 'Quicksand', fontWeight: 'bold', position: 'relative'}} key={indexR+',1'+indexC}>
                            { testNotes[boxNum-1]? this.lessThanFifteen(testNotes[boxNum-1][0]) : console.log() }
                            {/* { boxNum? boxNum-1 : console.log() } */}
                            { boxNum? <div onClick={() => this.props.testClick(testNotes[boxNum-1], boxNum-1, 'homeOG')} style={{position: 'absolute', height: '30%', width: '80%'}} key={indexR+','+indexC}></div> : console.log()}
                        </div>)
                        })}</div>))
                    }
                    {/* <div onClick={() => this.props.updateLayer(0)} style={{position: 'absolute', height: '30px', width: '30px', top: '0', left: '0'}}>
                        <img src={_arrow} alt='arrow' style={{height: '15px', color: 'black', transform: 'rotate(180deg)'}}/>
                    </div> */}
                </div>
                <div style={{position: 'absolute', height: '100px', width: '100px', left: '-120px'}}>
                    <Form><Form.Group>
                        <Form.Control onInput={()=>this.handleSearch()} id='searchQuery' size="sm" type="text" placeholder="Search..." />
                    </Form.Group></Form>
                </div>
            </div>
        )
    }

    handleClick0 = () => {
        this.props.updateLayer(1)
        this.props.updateFilter(null)
    }

    handleSearch = () => {
        let indexList = []
        let result = []
        const searchTerm = document.getElementById('searchQuery').value.toLowerCase()

        // Makes a list of indices for anybody that is a valid search result
        this.props.testNotes.map(elem => elem[0].concat(elem[1]).toLowerCase()).map((elem,index) => elem.includes(searchTerm)? indexList.push(index) : console.log())
        // Add each valid search result to result[]
        this.props.testNotes.map((elem,index) => indexList.includes(index)? result.push([elem[0]]) : console.log() )

        // console.log(indexList, result)
        this.props.updateFilter(result)
    }

    // Return phrase up to 15 characters long
    lessThanFifteen = (phrase) => {
        let charactersUsed = 0
        let desiredIndex = 0
        phrase.split(' ').map((elem,index) => {
            charactersUsed+= elem.length + 1
            charactersUsed<16? desiredIndex = index : console.log()
        })

        return (phrase.split(' ').map((elem,index) => index<=desiredIndex? elem : console.log()).join(' '))
    }

    componentDidMount() {
        this.props.updateWho('')
        this.props.updateFilter(null)
    }

    render() {
        return (
            <div className='d-flex align-items-center justify-content-center' style={{height: '100%'}}>
                <div className='row' style={{position: 'relative'}}>
                    {/* {this.props.layer===0? this.layer0() : console.log()}
                    {this.props.layer===1? this.layer1(): console.log()} */}
                    {this.layer1()}
                    <div className='col' style={{position: 'absolute', left: '500px'}}>
                        <Link to='/home'><img src={_arrow} alt='arrow' style={{height: '15px'}}/></Link>
                        {/* <img src={_plus} alt='plus sign' style={{height: '15px'}}/> */}
                        {/* <img src={_test} alt='plus sign' style={{height: '100px'}}/> */}
                    </div>
                </div>
                {this.props.redirect===1? <Redirect to='/editor'/> : console.log() }
            </div>
        )
    }
}