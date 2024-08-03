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

  return (
    <div className="App">
      <header className="App-header">
        <Login getCurrentTabId={getCurrentTabId} />
      </header>
    </div>
  );
}

export default App;
