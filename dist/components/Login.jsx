/*global chrome*/
import { useState, useEffect } from 'react';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // useEffect(() => {
  //   chrome.storage.local.get(['email']).then((result) => console.log(result.email));
  //   chrome.storage.local.get(['password']).then((result) => console.log(result.password));
  // }, [])

  const emailHandler = (event) => {
    setEmail(event.target.value);
  }

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  }

  const str2ab = (str) => {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    const data = str2ab(password);

    window.crypto.subtle.digest({
      name: "SHA-256",
    }, data)
      .then((hash) => {
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        chrome.storage.local.set({ 'email': `${email}` }, () => {
          console.log('Email is stored')
        })
        chrome.storage.local.set({ 'password': hashHex }, () => {
          console.log('Password is stored')
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // const checkStorage = () => {
  //   chrome.storage.local.get(['email', 'password'], (result) => {
  //     console.log('Email:', result.email);
  //     console.log('Password:', result.password);
  //   })
  // }

  return (
    <div>
      <form className="login-information" onSubmit={submitHandler}>
        <div className="email-address">
          <input className="input-email-address" type="text" onChange={emailHandler}></input>
        </div>
        <div className="password">
          <input className="input-password" type="text" onChange={passwordHandler}></input>
        </div>
        <div className="submit-login-info">
          <input className="submit-button" type="submit" value="Submit"></input>
        </div>
      </form>
      {/* <button onClick={checkStorage}>Console log stored email and password</button> */}
    </div>
  )
}

export default Login;