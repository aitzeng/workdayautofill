/*global chrome*/
import { useState, useEffect } from 'react';
import { raceList, genderList, veteranList } from '../data.js';

function Identity({ getCurrentTabId }) {

  const [voluntaryIdentity, setVoluntaryIdentity] = useState({});


  const setIdentityStorage = () => {
    chrome.storage.local.set({ 'voluntaryIdentity': { hispanicLatino: 'Yes', veteranStatus: 'I am not a veteran', gender: 'Male', race: 'American Indian or Alaska Native', terms: false, agreementBox: false } })
      .then(() => {
        chrome.storage.local.get("voluntaryIdentity")
          .then((result) => {
            setVoluntaryIdentity(result.voluntaryIdentity);
          })
      })
  }

  const populateIdentityExtension = () => {
    chrome.storage.local.get('voluntaryIdentity')
      .then((result) => {
        if (!result.voluntaryIdentity) {
          setIdentityStorage();
        } else {
          setVoluntaryIdentity(result.voluntaryIdentity)
        }
      })
      .catch((error) => {
        console.error('Error retreiving voluntaryIdentity', error);
      })
  }

  const saveExperienceHandler = () => {
    chrome.storage.local.set({ 'voluntaryIdentity': voluntaryIdentity })
    console.log('Current voluntaryIdentity state:', voluntaryIdentity)
  }

  const autofillSubmitter = () => {
    getCurrentTabId()
      .then((result) => {
        chrome.scripting.executeScript({ target: { tabId: result.id }, files: ["./scripts/identityScript.js"] })
          .then(() => {
            console.log('IdentityScript injected');
          })
      })
  }

  const hispanicLatinoHandler = (e) => {
    let updatedIdentity = { ...voluntaryIdentity };
    updatedIdentity.hispanicLatino = e.target.value;
    setVoluntaryIdentity(updatedIdentity);
    console.log('hispanicLatinoHandler value', e.target.value);
  }
  const raceHandler = (e) => {
    let updatedIdentity = { ...voluntaryIdentity };
    updatedIdentity.race = e.target.value;
    setVoluntaryIdentity(updatedIdentity);
    console.log('race value', e.target.value);
  }
  const genderHandler = (e) => {
    let updatedIdentity = { ...voluntaryIdentity };
    updatedIdentity.gender = e.target.value;
    setVoluntaryIdentity(updatedIdentity);
    console.log('gender value', e.target.value);
  }
  const veteranHandler = (e) => {
    let updatedIdentity = { ...voluntaryIdentity };
    updatedIdentity.veteranStatus = e.target.value;
    setVoluntaryIdentity(updatedIdentity);
    console.log('veteran value', e.target.value);
  }

  const agreementHandler = (e) => {
    const updatedAgreement = {...voluntaryIdentity};
    updatedAgreement.agreementBox = e.target.value === 'true';
    setVoluntaryIdentity(updatedAgreement);
  };

  useEffect(() => {
    populateIdentityExtension();
  }, [])

  return (
    <form onSubmit={autofillSubmitter}>
      <button type="button" onClick={saveExperienceHandler}>Save</button>
      <button type="submit">Auto-fill</button>
      <div>Hispanic or Latino</div>
      <select value={voluntaryIdentity.hispanicLatino} onChange={hispanicLatinoHandler}>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <div>Gender</div>
      <select value={voluntaryIdentity.gender} onChange={genderHandler}>
        {genderList.map((gender, index) => <option key={index} value={gender}>{gender}</option>)}
      </select>
      <div>Race</div>
      <select value={voluntaryIdentity.race} onChange={raceHandler}>
        {raceList.map((race, index) => <option key={index} value={race}>{race}</option>)}
      </select>
      <div>Veteran Status</div>
      <select value={voluntaryIdentity.veteranStatus} onChange={veteranHandler}>
        {veteranList.map((status, index) => <option key={index} value={status}>{status}</option>)}
      </select>
      <div>Agreement Box</div>
      <select value={voluntaryIdentity.agreementBox} onChange={agreementHandler}>
        <option value="false">Uncheck</option>
        <option value="true">Check</option>
      </select>
    </form>
  )
}

export default Identity;