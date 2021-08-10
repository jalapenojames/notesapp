import logo from './logo.svg';
import './App.css';
import {useEffect} from 'react';


const baseurl = process.env.REACT_APP_BASEURL;
console.log("baseurl", baseurl)
function App() {

  useEffect(() => {
    fetch(`${baseurl}/users`)
    .then(res => res.json()).then(result=> console.log("heroku result", result))
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
