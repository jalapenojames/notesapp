import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router} from "react-router-dom"
// import MainContainer from "./containers/MainContainer";
import {useEffect} from 'react';


const baseurl = process.env.REACT_APP_BASEURL;
console.log("baseurl", baseurl)
function App() {

  useEffect(() => {
    fetch(`${baseurl}/users`)
    .then(res => res.json()).then(result=> console.log("heroku result", result))
  }, [])


  return (
    <Router>
      <div className="App">
        {/* <MainContainer/> */}test
      </div>      
    </Router>
  );
}

export default App;
