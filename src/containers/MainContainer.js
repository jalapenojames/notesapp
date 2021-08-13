import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom"
import Home from '../components/Home'
import HomeOG from '../components/HomeOG'
import Login from '../components/Login'
import SlateEditor from '../components/SlateEditor'
// import MakeMap from '../components/MakeMap'
import PaperCanvas from '../components/PaperCanvas'

const baseurl = process.env.REACT_APP_BASEURL;


export default class MainContainer extends Component {

    state = {
        currentEditor: '',
        redirect: 0,
        testNotes: [],//[['Flatiron links', 'Homeroom'], ['Asdf', 'view'], ['Draw Boundaries', 'visuals are important to employers'], ['Task list','Urgent/ASAP'],['Places I want to work','Notion'], ['Wonton noodle soup', 'stir fry veggies, cut garlic, add crumbled seA salt and magic'], ['Packing list','Toothbrush'], ['Notes', "4.6 mi, 14 min"], ['Didi college tips', "messing up is learning, even if it’s embarrassing, you’ll learn from it"]],
        notesTitle: [],//[{type: 'paragraph', children: [{text: 'Flatiron links'}]},{type: 'paragraph', children: [{text: 'Asdf'}]},{type: 'paragraph', children: [{text: 'Draw Boundaries'}]},{type: 'paragraph', children: [{text: 'Task list'}]},{type: 'paragraph', children: [{text: 'Places I want to work'}]},{type: 'paragraph', children: [{text: 'Wonton noodle soup'}]},{type: 'paragraph', children: [{text: 'Packing list'}]}, {type: 'paragraph', children: [{text: 'Notes'}]}, {type: 'paragraph', children: [{text: 'Didi college tips'}]}],
        notesContent: [],//[[{type: 'paragraph', children: [{text: 'Homeroom'}]}],[{type: 'paragraph', children: [{text: 'view'}]}],[{type: 'paragraph', children: [{text: 'visuals are important to employers'}]}],[{type: 'paragraph', children: [{text: 'Urgent/ASAP'}]}],[{type: 'paragraph', children: [{text: 'Notion'}]}, {type: 'paragraph', children: [{text: 'Anima'}]}],[{type: 'paragraph', children: [{text: 'stir fry veggies, cut garlic, add crumbled seA salt and magic'}]}],[{type: 'paragraph', children: [{text: 'Toothbrush'}]}], [{type: 'paragraph', children: [{text: "4.6 mi, 14 min"}]}], [{type: 'paragraph', children: [{text: "messing up is learning, even if it’s embarrassing, you’ll learn from it"}]}]],
        index: 0,
        who: '',            // Did I come from Home or HomeOG? (I'm being used in Slate Editor to conditionally render my back Button)
        layer: 0,           // HomeOG display term
        layerMap: 0,
        filtered: null,
        root: [],
        users: [],
        notesAssoc: [],
        currentUser: 'Bradley', // Normally this would be null but for testing purposes
        loginRedirect: false,
    }

    // The following two functions are called to set 'current note' so SlateEditor knows who to show
    //      - Brings you from Home or HomeOG >> SlateEditor
    testClick = (note,index, who) => {
        this.setState({redirect: 1})
        this.setState({ index }, this.setState({currentEditor: this.state.testNotes[index]}))
        this.setState({ who })
    }

    //      - Brings you from (Home) NewNote btn >> (new note) SlateEditor
    handleClickNew = () => {
        // Add new, empty note
        let testNotes = this.state.testNotes.concat([['New note','']])
        let notesTitle = this.state.notesTitle.concat([{type: 'paragraph', children: [{text: 'New note'}]}])
        let notesContent = this.state.notesContent.concat([[{type: 'paragraph', children: [{text: ''}]}]])

        this.setState({ testNotes, notesTitle, notesContent }, () => {
            const index = this.state.testNotes.length-1
            const who = 'home'
            this.setState({index}, () => {this.setState({currentEditor: this.state.testNotes[index]})})
            this.setState({ who })
            this.setState({redirect: 1})                    // Redirect to the editor!
        })
    }

    updateLoginRedirect = (loginRedirect) => this.setState({loginRedirect})

    updateCurrentUser = (currentUser) => this.setState({ currentUser })

    updateRedirect = (redirect) => this.setState({ redirect })

    updateNotes = (val,idx,who) => {
        let notesTitle = this.state.notesTitle
        let notesContent = this.state.notesContent

        if(who==='title') {
            notesTitle[idx] = val
            this.setState({notesTitle}, this.updateTestNotes)
        }
        if(who==='content') {
            notesContent[idx] = val
            this.setState({notesContent}, this.updateTestNotes)
        }
    }

    updateTestNotes = () => {
        const testNotes = this.state.notesTitle.map(elem => elem.children[0].text).map((elem,index) => {
            return [elem].concat([this.state.notesContent[index].map(elem => (elem.children[0].text+'<br/>')).join('')])
        })
        this.setState({ testNotes }, () => this.setState({currentEditor: this.state.testNotes[this.state.index]}))
    }

    updateUserNotes = (notesContent, notesTitle, testNotes) => {
        this.setState({ notesContent, notesTitle, testNotes }/*, this.updateTestNotes*/)
    }

    updateWho = (who) => this.setState({ who })

    updateLayer = (layer) => this.setState({ layer })

    updateLayerMap = (layerMap) => this.setState({ layerMap })

    updateFilter = (filtered) => this.setState({ filtered })

    updateIndex = (index) => this.setState({ index })

    updateRoot = (root) => this.setState({ root })

    updateRootModified = (root) => this.setState(root)

    deleteCurrentNote = () => {
        let index = this.state.index

        // delete note @ current index
        let notesTitle = this.state.notesTitle
        let notesContent = this.state.notesContent
        let testNotes = this.state.testNotes

        console.log('deleting title...', notesTitle.splice(index,1))
        console.log(notesTitle)
        console.log('deleting content...', notesContent.splice(index,1))
        console.log(notesContent)
        console.log('updating testNotes...', testNotes.splice(index,1))
        console.log(testNotes)

        index-=1
        let currentEditor = testNotes[index]

        // NotesTitle, NotesContent, >> TestNotes, currentEditor, index
        this.setState({ notesTitle, notesContent, testNotes, index, currentEditor })
    }

    componentDidMount() {

        // RETRIEVE data from Rails server
        fetch(`${baseurl}/users`)
            .then(r => r.json())
            .then(data => {
                // console.log('users',data)
                const users = data.map(elem => elem.name)
                this.setState({ users })
            })

        fetch(`${baseurl}/notes`)
            .then(r => r.json())
            .then(data => {
                // console.log('notes',data)

                const notesTitle = data.map(elem => elem.title)
                const notesContent = data.map(elem => [elem.content])

                const notesAssoc = data.map(elem => [elem.id, { userID: elem.user_id}])
                
                this.setState({ notesAssoc })

                // console.log('notesTitle, ', notesTitle)
                // console.log('notesContent, ', notesContent)

                this.setState({ notesTitle, notesContent }, this.updateTestNotes)
            })

        // Update notesTitle,Content and testNotes to reflect User change
    }

    render() {
        return (
            <div style={{height: '800px'}}>
                <Switch>
                    <Route exact path='/'><Login loginRedirect={this.state.loginRedirect} updateLoginRedirect={this.updateLoginRedirect} updateCurrentUser={this.updateCurrentUser} currentUser={this.state.currentUser} users={this.state.users} notesAssoc={this.state.notesAssoc}/></Route>
                    {/* <Route exact path='/'><Home note={this.state.currentEditor} testClick={this.testClick} handleClickNew={this.handleClickNew} redirect={this.state.redirect} testNotes={this.state.testNotes} updateWho={this.updateWho} updateIndex={this.updateIndex} deleteCurrentNote={this.deleteCurrentNote}/></Route> */}
                    <Route path='/home'><Home notesTitle={this.state.notesTitle} notesContent={this.state.notesContent} note={this.state.currentEditor} testClick={this.testClick} handleClickNew={this.handleClickNew} redirect={this.state.redirect} testNotes={this.state.testNotes} updateWho={this.updateWho} updateIndex={this.updateIndex} deleteCurrentNote={this.deleteCurrentNote} notesAssoc={this.state.notesAssoc} users={this.state.users} currentUser={this.state.currentUser} updateUserNotes={this.updateUserNotes} filteredPanel={this.state.filteredPanel} updateFilteredPanel={this.updateFilteredPanel}/></Route>
                    <Route path='/homeOG'><HomeOG note={this.state.currentEditor} testClick={this.testClick} testNotes={this.state.testNotes} redirect={this.state.redirect} updateWho={this.updateWho} updateLayer={this.updateLayer} layer={this.state.layer} filtered={this.state.filtered} updateFilter={this.updateFilter}/></Route>
                    <Route path='/editor'><SlateEditor testNotes={this.state.testNotes} note={this.state.currentEditor} index={this.state.index} updateRedirect={this.updateRedirect} updateNotes={this.updateNotes} who={this.state.who} notesTitle={this.state.notesTitle} notesContent={this.state.notesContent}/></Route>
                    {/* <Route path='/makemap'><MakeMap filteredPanel={this.state.filteredPanel} testNotes={this.state.testNotes} notesTitle={this.state.notesTitle} layerMap={this.state.layerMap} updateLayerMap={this.updateLayerMap} root={this.state.root} updateRoot={this.updateRoot} updateRootModified={this.updateRootModified}/></Route> */}
                    <Route path='/canvas'><PaperCanvas/></Route>
                </Switch>
            </div>
        )
    }
}
