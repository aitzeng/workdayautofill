/*global chrome*/
import { useState, useEffect } from 'react';
import { listOfCountries } from '../listOfCountries.js';

function MyInfo() {

  const [previousEmployed, setPreviousEmployed] = useState('');
  const [country, setCountry] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const populateExtension = () => {
    chrome.storage.local.get(["prevEmployed", "country", "firstName", "lastName", "address", "city", "postalCode"])
      .then((result) => {
        setPreviousEmployed(result.prevEmployed);
        setCountry(result.country);
        setFirstName(result.firstName);
        setLastName(result.lastName);
        setAddress(result.address);
        setCity(result.city);
        setPostalCode(result.postalCode);
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

  const firstNameHandler = (e) => {
    setFirstName(e.target.value);
    chrome.storage.local.set({'firstName': e.target.value});
  }

  const lastNameHandler = (e) => {
    setLastName(e.target.value);
    chrome.storage.local.set({'lastName': e.target.value});
  }
  const addressHandler = (e) => {
    setAddress(e.target.value);
    chrome.storage.local.set({'address': e.target.value});
  }
  const cityHandler = (e) => {
    setCity(e.target.value);
    chrome.storage.local.set({'city': e.target.value});
  }
  const postalCodeHandler = (e) => {
    setPostalCode(e.target.value);
    chrome.storage.local.set({'postalCode': e.target.value});
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
          return <option key={country} value={country}>{country}</option>;
        })}
      </select>
      <div>First Name</div>
      <input type="text" value={firstName} onChange={firstNameHandler} ></input>
      <div>Last Name</div>
      <input type="text" value={lastName} onChange={lastNameHandler} ></input>
      <div>Address</div>
      <input type="text" value={address} onChange={addressHandler} ></input>
      <div>City</div>
      <input type="text" value={city} onChange={cityHandler} ></input>
      <div>Postal Code</div>
      <input type="text" value={postalCode} onChange={postalCodeHandler} ></input>
    </form>
  )
}

export default MyInfo;