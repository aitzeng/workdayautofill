/*global chrome*/
import { useState, useEffect } from 'react';
import { listOfCountries } from '../listOfCountries.js';

function MyInfo() {

  const [previousEmployed, setPreviousEmployed] = useState('');
  const [country, setCountry] = useState('');

  const populateExtension = () => {
    chrome.storage.local.get(["prevEmployed", "country"])
      .then((result) => {
        setPreviousEmployed(result.prevEmployed);
        setCountry(result.country);
      })
  }

  const prevEmployedHandler = (event) => {
    setPreviousEmployed(event.target.value);
    chrome.storage.local.set({ 'prevEmployed': event.target.value });
  }

  const countryHandler = (event) => {
    setCountry(event.target.value);
    chrome.storage.local.set({ 'country': event.target.value });
  }

  useEffect(() => {
    populateExtension()
  }, [])

  return (
    <form>
      <div>Previously employed at this company?</div>
      <select value={previousEmployed} onChange={prevEmployedHandler}>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
      <div>Country?</div>
      <select value={country} onChange={countryHandler}>
        {listOfCountries.map((country) => {
          return <option value={country}>{country}</option>;
        })}
      </select>
    </form>
  )
}

export default MyInfo;