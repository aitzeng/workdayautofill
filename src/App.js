/*global chrome*/
import './App.css';
import Login from './pages/Login.jsx';
import Layout from './pages/Layout.jsx';
import MyInfo from './pages/MyInfo.jsx';
import { HashRouter, Routes, Route } from "react-router-dom";

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
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login getCurrentTabId={getCurrentTabId}/>} />
          <Route path="MyInfo" element={<MyInfo />} />
        </Route>
      </Routes>
    </HashRouter>
    // <div className="App">
    //   <header className="App-header">
    //     <Login getCurrentTabId={getCurrentTabId} />
    //   </header>
    // </div>
  );
}

export default App;
