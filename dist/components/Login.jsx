/*global chrome*/
import { useState, useEffect } from 'react';

function Login({getCurrentTabId}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useEffect(() => {
  //   chrome.storage.local.remove(['encryptionKey', 'email', 'password'])
  //     .then((result) => {
  //       console.log('EncryptionKey Cleared!')
  //     })
  //     chrome.storage.local.get('email').then((result) => {
  //       console.log(result.email)
  //     })
  // }, [])

  const emailHandler = (event) => {
    setEmail(event.target.value);
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  }

  const generateKey = async () => {
    return await window.crypto.subtle.generateKey({
      name: "AES-GCM",
      length: 256,
    },
      false,
      ["encrypt", "decrypt"])
  };

  const encryptData = async (key, data) => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    chrome.storage.session.set({'iv': Array.from(iv)}, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting IV in session storage:", chrome.runtime.lastError);
      }
    });

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await window.crypto.subtle.encrypt({
      name: "AES-GCM", iv: iv
    }, key, encodedData);

    return {
      encryptedData: encryptedData,
      iv: iv
    }
  }

  // const emailDetector = async () => {
  //   getCurrentTabId()
  //   .then((result) =>
  //     // console.log(result.id))
  //     chrome.scripting.executeScript({target : {tabId : result.id}, files: ["loginScript.js"]}))
  //   .then(() => console.log('script injected'));
  // }

  const saveHandler = (event) => {
    event.preventDefault();
    generateKey().then((key) => {
      const data = password;
      encryptData(key, data).then((result) => {
        chrome.storage.session.set({ 'email': `${email}` }, () => {
          console.log('Email is stored')
        })
        chrome.storage.session.set({ 'password': result.encryptedData }, () => {
          console.log('Password is stored')
        })
        chrome.storage.session.set({ 'encryptionKey': key}, () => {
          console.log('Encryption key is stored')
        })
      })
    })
  }

  const autofillHandler = () => {
    getCurrentTabId()
    .then((result) =>
      chrome.scripting.executeScript({target : {tabId : result.id}, files: ["./scripts/loginScript.js"]}))
    .then(() => console.log('script injected'));
  }

  return (
    <div>
      <form className="login-information" onSubmit={saveHandler}>
        <div className="email-address">
          <input className="input-email-address" type="text" onChange={emailHandler}></input>
        </div>
        <div className="password">
          <input className="input-password" type="text" onChange={passwordHandler}></input>
        </div>
        <div className="submit-login-info">
          <input className="submit-button" type="submit" value="Save Login"></input>
        </div>
      </form>
      <button onClick={autofillHandler}>Auto-fill Login</button>
    </div>
  )
}

export default Login;