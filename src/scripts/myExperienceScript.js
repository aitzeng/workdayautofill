/*global chrome*/
(function () {

  const elementsToFocus = [];

  let mimicEnter = (element) => {
    const keydown = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13
    });
    const keypress = new KeyboardEvent('keypress', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13
    });
    const keyup = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13
    });

    element.dispatchEvent(keydown);
    element.dispatchEvent(keypress);
    element.dispatchEvent(keyup);
  }

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

  let adjustContentCount = (number, section) => {
    const event = new Event('contentAdjusted');
    if (number > 0) {
      let element = document.querySelector(`[data-automation-id="${section}"] [data-automation-id="Add"]`) || document.querySelector(`[data-automation-id="${section}"] [data-automation-id="Add Another"]`);
      // console.log('Add button to be clicked:', element);
      for (let i = 0; i < number; i++) {
        setTimeout(() => { // Not sure exactly why, but this setTimeout with not time delay helps find the element a lot easier and click it
          element.click();
          document.dispatchEvent(event);
        }, 500)
      }
    } else {
      let element = document.querySelector(`[data-automation-id="${section}"] [data-automation-id="panel-set-delete-button"]`)
      for (let i = 0; i < Math.abs(number); i++) {
        setTimeout(() => {
          element.click();
          document.dispatchEvent(event);
        }, 500)
      }
    }
  }

  let populateWorkExperience = (count, array) => {
    const event = new Event('input', { bubbles: true });
    for (let i = 0; i < count; i++) {
      let jobTitleElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="jobTitle"]`)
      let companyElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="company"]`)
      let locationElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="location"]`)
      jobTitleElement.value = array[i].jobTitle;
      companyElement.value = array[i].company;
      locationElement.value = array[i].location;

      let startDateMonthElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-startDate"] [data-automation-id="dateSectionMonth-input"]`)
      startDateMonthElement.value = array[i].startDateYear;
      startDateMonthElement.dispatchEvent(event);
      let startDateYearElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-startDate"] [data-automation-id="dateSectionYear-input"]`)
      startDateYearElement.value = array[i].startDateYear;
      startDateYearElement.dispatchEvent(event);

      elementsToFocus.push(jobTitleElement, companyElement, locationElement, startDateMonthElement, startDateYearElement);

      if (array[i].current) {
        document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="currentlyWorkHere"]`).click();
      } else {
        let endDateMonthElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-endDate"] [data-automation-id="dateSectionMonth-input"]`)
        endDateMonthElement.value = array[i].endDateMonth;
        endDateMonthElement.dispatchEvent(event);
        let endDateYearElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-endDate"] [data-automation-id="dateSectionYear-input"]`)
        endDateYearElement.value = array[i].endDateYear;
        endDateYearElement.dispatchEvent(event);

        elementsToFocus.push(endDateMonthElement, endDateYearElement);
      }
      let roleDescriptionElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="description"]`)
      roleDescriptionElement.value = array[i].roleDescription;
      elementsToFocus.push(roleDescriptionElement);
    }
  }

  let selectDropDown = (desiredString, element) => {
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
        const options = document.querySelectorAll('[role="option"]');
        let foundOption = false;
        let closestOption = null;
        let closestDistance = Infinity;

        options.forEach((option) => {
          const optionText = option.textContent.trim();

          if (optionText === desiredString) {
            foundOption = true;
            option.click();
            resolve();
          } else {
            const distance = levenshteinDistance(desiredString, optionText);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestOption = option;
            }
          }
        });

        if (!foundOption && closestOption) {
          closestOption.click();
          resolve();
        } else if (!foundOption) {
          element.click(); // Click out of the dropdown
          element.click(); // Closes the dropdown
          reject(new Error(`Option not found`));
        }
      }, 500);
    });
  };

  let populateEducationExperience = async (count, array) => {
    for (let i = 0; i < count; i++) {
      let schoolElement = document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="school"]`)
      if (schoolElement) {
        schoolElement.value = array[i].school;
        elementsToFocus.push(schoolElement);
      } else {
        let element = document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="multiselectInputContainer"]`)
        element.click();
        await new Promise((resolve) => setTimeout(resolve, 500)) // Let DOM populate with dropdown

        let searchElement = document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="searchBox"]`);
        // console.log(searchElement);
        searchElement.value = array[i].school;
        elementsToFocus.push(searchElement);
        mimicEnter(searchElement);

        await new Promise((resolve) => {
          setTimeout(() => {
            const options = document.querySelectorAll('[role="option"]');
            console.log('These are all the options after searching:', options);
            let foundOption = false;
            let closestOption = null;
            let closestDistance = Infinity;

            options.forEach((option) => {
              const optionText = option.textContent.trim();
              const inputElement = option.querySelector('input');

              if (optionText === array[i].school) {
                foundOption = true;
                console.log('This is the option that matches exactly:', option )
                inputElement.click();
                resolve();
                return;
              } else {
                const distance = levenshteinDistance(array[i].school, optionText);
                if (distance < closestDistance) {
                  closestDistance = distance;
                  closestOption = option;
                }
              }
            });
            if (!foundOption && closestOption) {
              console.log('This is the option that matches closest:', closestOption )
              const inputElement = closestOption.querySelector('input');
              if (inputElement) {
                inputElement.click();
              }
              resolve();
            } else if (!foundOption) {
              let closeElement = document.querySelector('[data-automation-id="clearSearchButton"]')
              console.log('closeElement is present:', closeElement);
              closeElement.click();
              resolve();
            }
          }, 500);
        })
      }
      await selectDropDown(array[i].degree, document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="degree"]`));
    }
  }

  let checkLabelExists = (parentElement, string) => {
    if (parentElement) {
      const labels = parentElement.querySelectorAll('label');

      const labelExists = Array.from(labels).some(label => label.textContent.trim().includes(string));

      if (labelExists) {
        console.log('Label with text exists');
      } else {
        console.log('Label with text does not exist');
      }

      return labelExists;

    } else {
      console.log('Parent element does not exist');
      return false;
    }
  }

  let populateLanguageExperience = async (count, array) => {
    // console.log('populateLanguageExperience triggered')
    for (let i = 0; i < count; i++) {
      try {
        await selectDropDown(array[i].language, document.querySelector(`[data-automation-id="language-${i + 1}"] [data-automation-id="language"]`))
        if (array[i].fluent) {
          document.querySelector(`[data-automation-id="language-${i + 1}"] [data-automation-id="nativeLanguage"]`).click()
        }
        if (checkLabelExists(document.querySelector(`[data-automation-id="language-${i + 1}"]`), "Overall")) {
          console.log('Overall triggered');
          await selectDropDown(array[i].overallProficiency, document.querySelector(`[data-automation-id="language-${i + 1}"] [data-automation-id="languageProficiency-0"]`));
        } else {
          await selectDropDown(array[i].reading, document.querySelector(`[data-automation-id="language-${i + 1}"] [data-automation-id="languageProficiency-0"]`));
          await selectDropDown(array[i].speaking, document.querySelector(`[data-automation-id="language-${i + 1}"] [data-automation-id="languageProficiency-1"]`));
          await selectDropDown(array[i].writing, document.querySelector(`[data-automation-id="language-${i + 1}"] [data-automation-id="languageProficiency-2"]`));
        }
      } catch (error) {
        console.error(`Error processing language at index ${i}`, error);
      }
    }
  }

  let populateWebsiteExperience = async (count, array) => {
    const event = new Event('input', { bubbles: true });
    for (let i = 0; i < count; i++) {
      let websiteElement = document.querySelector(`[data-automation-id="websitePanelSet-${i + 1}"] [data-automation-id="website"]`);
      console.log('Input element for website links:', websiteElement);
      setTimeout(() => {
        websiteElement.value = array[i];
        elementsToFocus.push(websiteElement);
        websiteElement.dispatchEvent(event);
      }, 500)
    }
  }

  let workExperienceContainer = () => {
    return chrome.storage.local.get("totalJobs")
      .then((result) => {
        let totalJobCount = result.totalJobs; // Number of jobs set in the extension
        let webPageJobCount = document.querySelectorAll('[data-automation-id="formField-jobTitle"]').length || 0; // Number of jobs present on the web page
        let jobCountDifference = totalJobCount - webPageJobCount; // If positive, extension > web page

        adjustContentCount(jobCountDifference, 'workExperienceSection'); // Adjust # of listings

        return new Promise((resolve) => { // Gives time to add/delete jobs
          setTimeout(() => {
            resolve(totalJobCount);
          }, 2000);
        });
      })
      .catch((error) => {
        console.error('Error occurred while getting job count', error);
        return 0; // Resolve with default count if there's an error
      })
      .then((count) => {
        return chrome.storage.local.get("jobs")
          .then((result) => {
            populateWorkExperience(count, result.jobs);
          })
          .catch((error) => {
            console.error('Error occurred while getting jobs:', error);
            populateWorkExperience(count, []);
          });
      })
      .catch((error) => {
        console.error('Error occurred while filling job', error);
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished workContainer');
            resolve();
          }, 500);
        });
      });
  }

  let educationContainer = () => {
    return chrome.storage.local.get("totalEducation")
      .then((result) => {
        let totalEducationCount = result.totalEducation;
        let webPageEducationCount = document.querySelectorAll('[data-automation-id="formField-school"]').length +
          document.querySelectorAll('[data-automation-id="formField-schoolItem"]').length;
        let educationCountDifference = totalEducationCount - webPageEducationCount;

        adjustContentCount(educationCountDifference, 'educationSection');

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalEducationCount);
          }, 2000);
        });
      })
      .catch((error) => {
        console.error('Error occurred while adding education counts', error);
        return 0;
      })
      .then((count) => {
        return chrome.storage.local.get("education")
          .then((result) => {
            console.log("Array of education:", result.education);
            populateEducationExperience(count, result.education);
          })
          .catch((error) => {
            console.error("Unable to retrieve education:", error);
            populateEducationExperience(count, []);
          });
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished educationContainer');
            resolve();
          }, 500);
        });
      })
      .catch((error) => {
        console.error('Error occurred while filling education:', error);
      });
  }

  let languageContainer = () => {
    return chrome.storage.local.get("languageCount")
      .then((result) => {
        console.log("Languages Count:", result.languageCount);
        let totalLanguageCount = result.languageCount;
        let webPageLanguageCount = document.querySelectorAll('[data-automation-id="formField-language"]').length || 0;
        console.log('webPageLanguageCount:', webPageLanguageCount);
        let languageCountDifference = totalLanguageCount - webPageLanguageCount;
        console.log('languageCountDifference:', languageCountDifference);

        adjustContentCount(languageCountDifference, 'languageSection');

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalLanguageCount);
          }, 2000);
        });
      })
      .catch((error) => {
        console.error('Error occurred while adding languages:', error);
        return 0;
      })
      .then((count) => {
        return chrome.storage.local.get("languages")
          .then((result) => {
            console.log("Array of languages:", result.languages);
            populateLanguageExperience(count, result.languages);
          })
          .catch((error) => {
            console.error('Error occurred while populating languages:', error);
            populateLanguageExperience(count, []);
          });
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished languageContainer');
            resolve();
          }, 500);
        });
      })
      .catch((error) => {
        console.error('Error occurred while processing languages:', error);
      });
  }

  let websitesContainer = () => {
    return chrome.storage.local.get('websitesCount')
      .then((result) => {
        let totalWebsitesCount = result.websitesCount;
        let webPageWebsitesCount = document.querySelectorAll('[data-automation-id="website"]').length || 0;
        let websitesCountDifference = totalWebsitesCount - webPageWebsitesCount;

        adjustContentCount(websitesCountDifference, 'websiteSection');

        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalWebsitesCount);
          }, 2000);
        });
      })
      .catch((error) => {
        console.error('Error occurred while getting websites count:', error);
        return 0;
      })
      .then((count) => {
        return chrome.storage.local.get('websites')
          .then((result) => {
            console.log("Array of websites:", result.websites);
            populateWebsiteExperience(count, result.websites);
          })
          .catch((error) => {
            console.error('Error occurred while retrieving websites:', error);
            populateWebsiteExperience(count, []);
          });
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished websiteContainer');
            resolve();
          }, 500);
        });
      })
      // .then(() => {
      //   let continueElement = document.querySelector('[data-automation-id="bottom-navigation-next-button"]');
      //   if (continueElement) {
      //     continueElement.click();
      //   } else {
      //     console.warn('Continue button not found');
      //   }
      // })
      .catch((error) => {
        console.error('Error occurred in websitesContainer:', error);
      });
  }

  let focusOnInputs = (array) => {
    for (let i = 0; i < array.length; i++) {
      setTimeout(() => {
        console.log(array[i]);
        array[i].focus();
      }, 100)
    }
  }

  let populateMyExperience = async () => {

    await new Promise((resolve) => {
      setTimeout(() => {
        console.log('Starting up!')
        resolve();
      }, 3000)
    })

    await workExperienceContainer();
    await educationContainer();
    await languageContainer();
    await websitesContainer();

    let continueElement = document.querySelector('[data-automation-id="bottom-navigation-next-button"]');
    const continueListenHandler = (event) => {
      focusOnInputs(elementsToFocus);
      continueElement.click();
      continueElement.removeEventListener('click', continueListenHandler)
    }
    continueElement.addEventListener('click', continueListenHandler);

  }

  populateMyExperience();

})();