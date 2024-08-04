/*global chrome*/
import { useState, useEffect } from 'react';

function Login({ getCurrentTabId }) {

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
    return await crypto.subtle.generateKey({
      name: "AES-GCM",
      length: 256,
    },
      true,
      ["encrypt", "decrypt"])
  };

  const exportKey = async (key) => {
    const exportedKey = await crypto.subtle.exportKey("raw", key);
    return new Uint8Array(exportedKey);
  }

  const encryptData = async (key, data) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    chrome.storage.session.set({ 'iv': Array.from(iv) }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error setting IV in session storage:", chrome.runtime.lastError);
      }
    });

    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt({
      name: "AES-GCM", iv: iv
    }, key, encodedData);

    return {
      encryptedData: encryptedData,
      iv: iv
    }
  }

  const saveHandler = (event) => {
    event.preventDefault();
    generateKey().then((key) => {
      exportKey(key).then((exportedKey) => {
        const data = password;
        encryptData(key, data).then((result) => {
          chrome.storage.session.set({ 'email': `${email}` }, () => {
            console.log('Email is stored');
          });
          chrome.storage.session.set({ 'password': result.encryptedData }, () => {
            console.log('Password is stored');
          });
          chrome.storage.session.set({ 'encryptionKey': Array.from(exportedKey) }, () => {
            console.log('Encryption key is stored');
          });
          chrome.storage.session.set({ 'iv': Array.from(result.iv) }, () => {
            console.log('IV is stored');
          });
        });
      });
    });
  };

  const autofillHandler = () => {
    getCurrentTabId()
      .then((result) =>
        chrome.scripting.executeScript({ target: { tabId: result.id }, files: ["./scripts/loginScript.js"] }))
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