/*global chrome*/
import '../styles/MyInfo.css';
import { useState, useEffect } from 'react';
import { listOfCountries, countriesWithCodes } from '../listOfCountries.js';

function MyInfo({getCurrentTabId}) {

  const [previousEmployed, setPreviousEmployed] = useState('');
  const [country, setCountry] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneType, setPhoneType] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const populateExtension = () => {
    chrome.storage.local.get(["prevEmployed", "country", "firstName", "lastName", "address", "city", "region", "postalCode", "phoneType", "countryCode", "phoneNumber"])
      .then((result) => {
        setPreviousEmployed(result.prevEmployed);
        setCountry(result.country);
        setFirstName(result.firstName);
        setLastName(result.lastName);
        setAddress(result.address);
        setRegion(result.region);
        setCity(result.city);
        setPostalCode(result.postalCode);
        setCountryCode(result.countryCode);
        setPhoneNumber(result.phoneNumber);
      })
  }

  const autofillSubmitter = () => {
    getCurrentTabId()
      .then((result) =>
        chrome.scripting.executeScript({ target: { tabId: result.id }, files: ["./scripts/myInformationScript.js"] }))
      .then(() => console.log('myInformationScript injected'))
      .then(() => window.close())
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
    chrome.storage.local.set({ 'firstName': e.target.value });
  }

  const lastNameHandler = (e) => {
    setLastName(e.target.value);
    chrome.storage.local.set({ 'lastName': e.target.value });
  }
  const addressHandler = (e) => {
    setAddress(e.target.value);
    chrome.storage.local.set({ 'address': e.target.value });
  }
  const cityHandler = (e) => {
    setCity(e.target.value);
    chrome.storage.local.set({ 'city': e.target.value });
  }
  const regionHandler = (e) => {
    setRegion(e.target.value);
    chrome.storage.local.set({ 'region': e.target.value });
  }
  const postalCodeHandler = (e) => {
    setPostalCode(e.target.value);
    chrome.storage.local.set({ 'postalCode': e.target.value });
  }

  const phoneTypeHandler = (e) => {
    setPhoneType(e.target.value);
    chrome.storage.local.set({ 'phoneType': e.target.value });
  }

  const countryCodeHandler = (e) => {
    setCountryCode(e.target.value);
    chrome.storage.local.set({ 'countryCode': e.target.value });
  }

  const phoneNumberHandler = (e) => {
    setPhoneNumber(e.target.value);
    chrome.storage.local.set({ 'phoneNumber': e.target.value });
  }

  useEffect(() => {
    populateExtension()
  }, [])

  return (
    <form onSubmit={autofillSubmitter}>
      <button type="submit">Auto-fill</button>
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
      <div>Region/State</div>
      <input placeholder="Full name of region" type="text" value={region} onChange={regionHandler} ></input>
      <div>Postal Code</div>
      <input type="text" value={postalCode} onChange={postalCodeHandler} ></input>
      <div>Phone Device Type</div>
      <select value={phoneType} onChange={phoneTypeHandler}>
        <option value="Landline">Landline</option>
        <option value="Mobile">Mobile</option>
      </select>
      <div>Country Phone Code</div>
      <select value={countryCode} onChange={countryCodeHandler}>
        {countriesWithCodes.map((countryCode) => {
          return <option key={countryCode} value={countryCode}>{countryCode}</option>;
        })}
      </select>
      <div>Phone Number</div>
      <input type="text" value={phoneNumber} onChange={phoneNumberHandler} ></input>
    </form>
  )
}

export default MyInfo;