/*global chrome*/
import './App.css';
import Login from './components/Login.jsx';

function App() {

  // async function getCurrentTabId() {
  //   let queryOptions = { active: true, lastFocusedWindow: true };
  //   let [tab] = await chrome.tabs.query(queryOptions);
  //   return tab;
  // }

  const getCurrentTabId = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

  const emailDetector = async () => {
    getCurrentTabId()
    .then((result) =>
      // console.log(result.id))
      chrome.scripting.executeScript({target : {tabId : result.id}, files: ["loginScript.js"]}))
    .then(() => console.log('script injected'));
  }

  return (
    <div className="App">
      <header className="App-header">
        <Login />
        <button id="input-4" onClick={emailDetector}>Detect Email</button>
      </header>
    </div>
  );
}

export default App;
