/*global chrome*/
import '../styles/MyInfo.css';
import { useState, useEffect } from 'react';
import { listOfCountries, countriesWithCodes } from '../data.js';

function MyInfo({ getCurrentTabId }) {

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
    // Default values to set if keys do not exist in storage
    const defaultValues = {
      prevEmployed: false, // or whatever default you prefer
      country: 'United States of America',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      region: '',
      postalCode: '',
      phoneType: 'Mobile',
      countryCode: 'United States of America (+1)',
      phoneNumber: ''
    };

    chrome.storage.local.get([
      "prevEmployed",
      "country",
      "firstName",
      "lastName",
      "address",
      "city",
      "region",
      "postalCode",
      "phoneType",
      "countryCode",
      "phoneNumber"
    ])
      .then((result) => {
        setPreviousEmployed(result.prevEmployed ?? defaultValues.prevEmployed);
        setCountry(result.country ?? defaultValues.country);
        setFirstName(result.firstName ?? defaultValues.firstName);
        setLastName(result.lastName ?? defaultValues.lastName);
        setAddress(result.address ?? defaultValues.address);
        setCity(result.city ?? defaultValues.city);
        setRegion(result.region ?? defaultValues.region);
        setPostalCode(result.postalCode ?? defaultValues.postalCode);
        setPhoneType(result.phoneType ?? defaultValues.phoneType);
        setCountryCode(result.countryCode ?? defaultValues.countryCode);
        setPhoneNumber(result.phoneNumber ?? defaultValues.phoneNumber);

        const valuesToStore = {};
        for (const key in defaultValues) {
          if (result[key] === undefined) {
            valuesToStore[key] = defaultValues[key];
          }
        }

        if (Object.keys(valuesToStore).length > 0) {
          chrome.storage.local.set(valuesToStore).then(() => {
            console.log('Default values set:', valuesToStore);
          });
        }
      })
      .catch((error) => {
        console.error('Error retrieving storage values:', error);
      });
  };

  const autofillSubmitter = () => {
    getCurrentTabId()
      .then((result) =>
        chrome.scripting.executeScript({ target: { tabId: result.id }, files: ["./scripts/myInformationScript.js"] }))
      .then(() => console.log('myInformationScript injected'))
      .then(() => window.close())
  }

  const prevEmployedHandler = (event) => {
    setPreviousEmployed(event.target.value);
  }

  const countryHandler = (event) => {
    setCountry(event.target.value);
  }

  const firstNameHandler = (e) => {
    setFirstName(e.target.value);
  }

  const lastNameHandler = (e) => {
    setLastName(e.target.value);
  }
  const addressHandler = (e) => {
    setAddress(e.target.value);
  }
  const cityHandler = (e) => {
    setCity(e.target.value);
  }
  const regionHandler = (e) => {
    setRegion(e.target.value);
  }
  const postalCodeHandler = (e) => {
    setPostalCode(e.target.value);
  }

  const phoneTypeHandler = (e) => {
    setPhoneType(e.target.value);
  }

  const countryCodeHandler = (e) => {
    setCountryCode(e.target.value);
  }

  const phoneNumberHandler = (e) => {
    setPhoneNumber(e.target.value);
  }

  const saveInformationHandler = () => {
    chrome.storage.local.set({
      prevEmployed: previousEmployed,
      country: country,
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      region: region,
      postalCode: postalCode,
      phoneType: phoneType,
      countryCode: countryCode,
      phoneNumber: phoneNumber
    })
      .then(() => {
        console.log('All information saved successfully');
      })
      .catch((error) => {
        console.error('Error saving information:', error);
      });
  };

  useEffect(() => {
    populateExtension()
  }, [])

  return (
    <form onSubmit={autofillSubmitter}>
      <button type="button" onClick={saveInformationHandler}>Save</button>
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