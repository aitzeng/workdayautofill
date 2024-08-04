/*global chrome*/
(function() {

  let selectDropDownCountry = (desiredCountry, id) => {
    const dropdownButton = document.querySelector(`[data-automation-id="${id}"]`)
    dropdownButton.click();

    setTimeout(() => {
      const options = document.querySelectorAll('[role="option"]');
      options.forEach(option => {
        if (option.textContent.trim() === desiredCountry) {
          option.click();
          option.dispatchEvent(new Event('click', {bubbles: true}))
        }
      })
    }, 500)

  }

  let mimicTyping = (string, element) => {
    element.focus();
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
      let inputEvent = new Event('input', { bubbles: true }); // Triggering this event and setting value of inputs is actually enough for workday. But I want to mimic the entire process.
      element.dispatchEvent(inputEvent);
    }
  }

  let populateWebpage = () => {
    chrome.storage.local.get(["prevEmployed", "country", "firstName", "lastName", "address", "city", "region", "postalCode", "phoneType", "countryCode", "phoneNumber"])
    .then((result) => {
      let selector = result.prevEmployed === 'Yes' ? '[data-uxi-element-id="radio_1"]' : '[data-uxi-element-id="radio_2"]';
      let previousEmployedButton = document.querySelector(selector);

      previousEmployedButton.click();
      return result;
    })
    .then((result) => {
      selectDropDownCountry(result.country, 'countryDropdown');
      return result;
    })
    .then((result) => {
      mimicTyping(result.firstName, document.querySelector('[data-automation-id="legalNameSection_firstName"]'))
      return result;
    })
    .then((result) => {
      mimicTyping(result.lastName, document.querySelector('[data-automation-id="legalNameSection_lastName"]'))
      return result;
    })
    .then((result) => { // Might be unecessary because setting Country sets up country code too
      selectDropDownCountry(result.countryCode, 'menuItem');
      return result;
    })
    .then((result) => {
      selectDropDownCountry(result.region, 'addressSection_countryRegion');
      return result;
    })
    .then((result) => {
      mimicTyping(result.address, document.querySelector('[data-automation-id="addressSection_addressLine1"]'))
      return result;
    })
    .then((result) => {
      mimicTyping(result.city, document.querySelector('[data-automation-id="addressSection_city"]'))
      return result;
    })
    .then((result) => {
      mimicTyping(result.postalCode, document.querySelector('[data-automation-id="addressSection_postalCode"]'))
      return result;
    })
    .then((result) => {
      selectDropDownCountry(result.phoneType, 'phone-device-type');
      return result;
    })
    .then((result) => {
      mimicTyping(result.phoneNumber, document.querySelector('[data-automation-id="phone-number"]'))
    })
    .then(() => {
      document.querySelector('[data-automation-id="bottom-navigation-next-button"]').dispatchEvent(new Event('click', {bubbles: true}));
    })
  }

  populateWebpage();

})();