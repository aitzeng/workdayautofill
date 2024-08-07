/*global chrome*/
(function () {

  let selectDropDown = (desiredString, id) => {
    const dropdownButton = document.querySelector(`[data-automation-id="${id}"]`)
    dropdownButton.click();

    return new Promise((resolve) => {
      setTimeout(() => {
        const options = document.querySelectorAll('[role="option"]');
        options.forEach(option => {
          if (option.textContent.trim() === desiredString) {
            option.click();
          }
          resolve();
        })
      }, 500)
    })
  }

  let mimicTyping = (string, element) => { // Mimicking key typing still doesn't seem to update value property on the DOM, therefore this function can essentially be replaced with element.value = string.
    element.click();
    element.value = '';
    for (let i = 0; i < string.length; i++) {
      ['keydown', 'keypress', 'keyup'].forEach(eventType => {
        let event = new KeyboardEvent(eventType, {
          bubbles: true,
          cancelable: true,
          keyCode: string.charCodeAt(i),
          charCode: string.charCodeAt(i),
          key: string[i],
          repeat: false
        });
        element.dispatchEvent(event);
      });

      element.value += string[i];
      element.blur();
    }
  }

  let populateMyInformation = () => {
    chrome.storage.local.get(["prevEmployed", "country", "firstName", "lastName", "address", "city", "region", "postalCode", "phoneType", "countryCode", "phoneNumber"])
      .then((result) => {
        let selector = result.prevEmployed === 'Yes' ? '[data-uxi-element-id="radio_1"]' : '[data-uxi-element-id="radio_2"]';
        let previousEmployedButton = document.querySelector(selector);

        previousEmployedButton.click();
        return result;
      })
      .catch((error, result) => {
        console.error('Error grabbing from local storage', error);
        return result;
      })
      .then((result) => {
        selectDropDown(result.country, 'countryDropdown');
        return new Promise((resolve) => {
          setTimeout(() => { // The setTimeout allows for the DOM to dynamically update and have the next promise find the element
            resolve(result);
          }, 1500)
        });
      })
      .catch((error, result) => {
        console.error('Error finding Country', error);
        return result;
      })
      .then((result) => {
        let element = document.querySelector('[data-automation-id="legalNameSection_firstName"]');
        mimicTyping(result.firstName, element);
        return result;
      })
      .catch((error, result) => {
        console.error('Error entering first name', error);
        return result;
      })
      .then((result) => {
        let element = document.querySelector('[data-automation-id="legalNameSection_lastName"]')
        mimicTyping(result.lastName, element);
        return result;
      })
      .catch((error, result) => {
        console.error('Error entering last name', error);
        return result;
      })
      .then((result) => { // Might be unecessary because setting Country sets up country code too
        selectDropDown(result.countryCode, 'menuItem');
        return result;
      })
      .catch((error, result) => {
        console.error('Error finding country code', error);
        return result;
      })
      .then((result) => {
        selectDropDown(result.region, 'addressSection_countryRegion');
        return result;
      })
      .catch((error, result) => {
        console.error('Error finding region', error);
        return result;
      })
      .then((result) => {
        let element = document.querySelector('[data-automation-id="addressSection_addressLine1"]')
        mimicTyping(result.address, element);
        return result;
      })
      .catch((error, result) => {
        console.error('Error finding address', error);
        return result;
      })
      .then((result) => {
        let element = document.querySelector('[data-automation-id="addressSection_city"]')
        mimicTyping(result.city, element);
        return result;
      })
      .catch((error, result) => {
        console.error('Error finding city', error);
        return result;
      })
      .then((result) => {
        let element = document.querySelector('[data-automation-id="addressSection_postalCode"]')
        mimicTyping(result.postalCode, element);
        return result;
      })
      .catch((error, result) => {
        console.error('Error finding postalCode', error);
        return result;
      })
      .then((result) => {
        selectDropDown(result.phoneType, 'phone-device-type');
        return result;
      })
      .catch((error, result) => {
        console.error('Error finding device type', error);
        return result;
      })
      .then((result) => {
        let element = document.querySelector('[data-automation-id="phone-number"]')
        mimicTyping(result.phoneNumber, element);
      })
      .catch((error, result) => {
        console.error('Error finding phone number', error);
        return result;
      })
      .then(() => {
        let element = document.querySelector('[data-automation-id="bottom-navigation-next-button"]');
        element.addEventListener('click', (event) => { //This event listener will retrace over all text inputs and update their value in DOM
          setTimeout(() => {
            document.querySelector('[data-automation-id="legalNameSection_firstName"]').focus();
            document.querySelector('[data-automation-id="legalNameSection_lastName"]').focus();
            document.querySelector('[data-automation-id="addressSection_addressLine1"]').focus();
            document.querySelector('[data-automation-id="addressSection_city"]').focus();
            document.querySelector('[data-automation-id="addressSection_postalCode"]').focus();
            document.querySelector('[data-automation-id="phone-number"]').focus();
            document.querySelector('[data-automation-id="bottom-navigation-next-button"]').click(); //After refocusing, automatically clicks the 'Save and Continue' button
          }, 100)
        })
      })
  }

  populateMyInformation();

})();