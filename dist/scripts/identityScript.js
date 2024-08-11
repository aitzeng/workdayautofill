/*global chrome*/
(function () {

  let levenshteinDistance = (a, b) => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

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

  let selectDropDown = (desiredString, element, roleName, label) => {
    if (!element) {
      console.error('Dropdown not found');
      return Promise.reject(new Error('Dropdown not found'));
    }

    try {
      element.click();
    } catch (error) {
      console.error('Failed to click dropdown:', error);
      return Promise.reject(new Error('Failed to click dropdown'));
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const options = document.querySelectorAll(`[role="${roleName}"]`);
        // console.log('These are all options:', options);
        let foundOption = false;
        let closestOption = null;
        let closestDistance = Infinity;

        options.forEach((option, index) => {
          // console.log('These are all options:', options);
          const optionText = option.textContent.trim().replace(' (United States of America)', '');

          if (optionText === 'select one') {
            return;
          }

          if (optionText === desiredString) {
            foundOption = true;
            console.log('Found Option!', option);
            if (label) {
              option.querySelector('label').click();
            } else {
              option.click();
            }
            resolve();
          } else {
            // console.log('desiredString:', desiredString);
            const distance = levenshteinDistance(desiredString, optionText);
            // console.log('optionText and distance:', optionText, distance);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestOption = option;
            }
          }
        });

        if (!foundOption && closestOption) {
          console.log('This is closest option:', closestOption);
          if (label) {
            closestOption.querySelector('label').click();
          } else {
            closestOption.click();
          }
          resolve();
        } else if (!foundOption) {
          element.click(); // Click out of the dropdown
          element.click(); // Closes the dropdown
          reject(new Error(`Option not found`));
        }
      }, 500)
    })
  }

  let populateIdentity = async () => {
    chrome.storage.local.get('voluntaryIdentity')
      // .then((result) => {
      //   let identityInformation = result.voluntaryIdentity;
      //   // console.log('This is result of voluntaryIdentity:', result.voluntaryIdentity);
      //   let hispanicLatinoElement = document.querySelector('[data-automation-id="hispanicOrLatino"]');
      //   selectDropDown(identityInformation.hispanicLatino, hispanicLatinoElement, 'option')

      //   return new Promise((resolve) => { // Gives time to add/delete jobs
      //     setTimeout(() => {
      //       resolve(result);
      //     }, 1500);
      //   });
      // })
      .then((result) => {
        let raceString = result.voluntaryIdentity.race
        if (document.querySelector('[data-automation-id="ethnicityDropdown"]')) { //Check if race is dropdown
          let raceElement = document.querySelector('[data-automation-id="ethnicityDropdown"]')
          selectDropDown(raceString, raceElement, 'option', false);
        } else { // Check if race is prompt
          let raceElement = document.querySelector('[data-automation-id="ethnicityPrompt"]');
          selectDropDown(raceString, raceElement, 'row', true);
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(result)
          }, 1500)
        });
      })
  }

  populateIdentity();

})();