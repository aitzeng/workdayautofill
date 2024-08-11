/*global chrome*/
(function () {

  let levenshteinDistance = (a, b) => {
    const matrix = [];

    // Initialize the first row and column of the matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Calculate distances
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // Substitution
            matrix[i][j - 1] + 1,     // Insertion
            matrix[i - 1][j] + 1      // Deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  let selectDropDown = (desiredString, id) => {
    const dropdownButton = document.querySelector(`[data-automation-id="${id}"]`)
    dropdownButton.click();

    return new Promise((resolve) => {
      setTimeout(() => {
        const options = document.querySelectorAll('[role="option"]');
        console.log('These are all the options after searching:', options);
        let foundOption = false;
        let closestOption = null;
        let closestDistance = Infinity;

        options.forEach((option) => {
          const optionText = option.textContent.trim();

          if (optionText === desiredString) {
            foundOption = true;
            option.click();
            resolve();
            return;
          } else {
            const distance = levenshteinDistance(desiredString, optionText);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestOption = option;
            }
          }
        });
        if (!foundOption && closestOption) {
          console.log('This is the option that matches closest:', closestOption)
          const inputElement = closestOption.querySelector('input');
          if (inputElement) {
            inputElement.click();
          }
          resolve();
        } else if (!foundOption) {
          dropdownButton.click(); // Click out the dropdown
          dropdownButton.click(); // Close the dropdown
          resolve();
        }
      }, 500);
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
        let continueElement = document.querySelector('[data-automation-id="bottom-navigation-next-button"]');
        const continueListenHandler = (event) => {
          setTimeout(() => {
            document.querySelector('[data-automation-id="legalNameSection_firstName"]').focus();
            document.querySelector('[data-automation-id="legalNameSection_lastName"]').focus();
            document.querySelector('[data-automation-id="addressSection_addressLine1"]').focus();
            document.querySelector('[data-automation-id="addressSection_city"]').focus();
            document.querySelector('[data-automation-id="addressSection_postalCode"]').focus();
            document.querySelector('[data-automation-id="phone-number"]').focus();
            document.querySelector('[data-automation-id="bottom-navigation-next-button"]').click(); //After refocusing, automatically clicks the 'Save and Continue' button

            continueElement.removeEventListener('click', continueListenHandler)
          }, 100)
        }
        continueElement.addEventListener('click', continueListenHandler)
      })
  }

  populateMyInformation();

})();