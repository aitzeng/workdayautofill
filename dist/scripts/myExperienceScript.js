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

  let findMostSimilarString = (sample, array) => {
    let closestString = array[0];
    let closestDistance = levenshteinDistance(sample, closestString);

    for (let i = 1; i < array.length; i++) {
      const currentDistance = levenshteinDistance(sample, array[i]);
      if (currentDistance < closestDistance) {
        closestDistance = currentDistance;
        closestString = array[i];
      }
    }

    return closestString;
  }

  let adjustContentCount = (number, section) => {
    const event = new Event('contentAdjusted');
    if (number > 0) {
      let element = document.querySelector(`[data-automation-id="${section}"] [data-automation-id="Add"]`) || document.querySelector(`[data-automation-id="${section}"] [data-automation-id="Add Another"]`);
      console.log('Add button to be clicked:', element);
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
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="jobTitle"]`).value = array[i].jobTitle;
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="company"]`).value = array[i].company;
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="location"]`).value = array[i].location;
      let startDateMonthElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-startDate"] [data-automation-id="dateSectionMonth-input"]`)
      startDateMonthElement.value = array[i].startDateYear;
      startDateMonthElement.dispatchEvent(event);
      let startDateYearElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-startDate"] [data-automation-id="dateSectionYear-input"]`)
      startDateYearElement.value = array[i].startDateYear;
      startDateYearElement.dispatchEvent(event);
      if (array[i].current) {
        document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="currentlyWorkHere"]`).click();
      } else {
        let endDateMonthElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-endDate"] [data-automation-id="dateSectionMonth-input"]`)
        endDateMonthElement.value = array[i].endDateMonth;
        endDateMonthElement.dispatchEvent(event);
        let endDateYearElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-endDate"] [data-automation-id="dateSectionYear-input"]`)
        endDateYearElement.value = array[i].endDateYear;
        endDateYearElement.dispatchEvent(event);
      }
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="description"]`).value = array[i].roleDescription;
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

        options.forEach(option => {
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
    const keydown = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13
    });
    const keypress = new KeyboardEvent('keypress', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13
    });
    const keyup = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13
    });
    for (let i = 0; i < count; i++) {
      if (document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="school"]`)) {
        document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="school"]`).value = array[i].school;
      } else {
        let element = document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="multiselectInputContainer"]`)
        element.click();
        setTimeout(() => {
          let searchElement = document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="searchBox"]`);
          console.log(searchElement);
          searchElement.value = array[i].school;
          searchElement.dispatchEvent(keydown);
          searchElement.dispatchEvent(keypress);
          searchElement.dispatchEvent(keyup);
        }, 1000);
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
      let element = document.querySelector(`[data-automation-id="websitePanelSet-${i + 1}"] [data-automation-id="website"]`);
      console.log('Input element for website links:', element);
      setTimeout(() => {
        element.value = array[i];
        element.dispatchEvent(event);
      }, 500)
    }
  }

  let workExperienceContainer = () => {
    chrome.storage.local.get("totalJobs")
      .then((result) => {
        let totalJobCount = result.totalJobs; // Number of jobs set in the extension
        let webPageJobCount = document.querySelectorAll('[data-automation-id="formField-jobTitle"]').length || 0; // Number of jobs present on the web page
        let jobCountDifference = totalJobCount - webPageJobCount; // If positive, extension > web page
        adjustContentCount(jobCountDifference, 'workExperienceSection');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalJobCount);
          }, 2000)
        })
      })
      .catch((error) => {
        console.error('Error occured while getting job count', error);
        return 0;
      })
      .then((count) => {
        chrome.storage.local.get("jobs")
          .then((result) => {
            // console.log("Array of jobs:", result.jobs);
            populateWorkExperience(count, result.jobs);
          })
          .catch((error) => {
            console.error('Error occurred while getting jobs:', error);
            populateWorkExperience(count, []);
          });
      })
      .catch((error) => {
        console.error('Error occured while filling job', error)
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished workContainer');
            resolve();
          }, 500)
        })
      })
  }

  let educationContainer = () => {
    chrome.storage.local.get("totalEducation")
      .then((result) => {
        let totalEducationCount = result.totalEducation;
        // console.log('Total Education Count:', totalEducationCount)
        let webPageEducationCount = document.querySelectorAll('[data-automation-id="formField-school"]').length + document.querySelectorAll('[data-automation-id="formField-schoolItem"]').length;
        // console.log('webPageEducationCount:', webPageEducationCount);
        let educationCountDifference = totalEducationCount - webPageEducationCount;
        // console.log('Education Count Difference:', educationCountDifference)
        adjustContentCount(educationCountDifference, 'educationSection');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalEducationCount);
          }, 2000)
        })
      })
      .catch((error) => {
        console.error('Error occured while adding education counts', error);
        return 0;
      })
      .then((count) => {
        // console.log('This is the count:', count)
        chrome.storage.local.get("education")
          .then((result) => {
            console.log("Array of education:", result.education);
            populateEducationExperience(count, result.education);
          })
          .catch((error) => {
            console.error("Unable to retreive education");
            populateEducationExperience(count, [])
          })
      })
      .catch((error) => {
        console.error('Error occured while filling education', error)
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished educationContainer');
            resolve();
          }, 500)
        })
      })
  }

  let languageContainer = () => {
    chrome.storage.local.get("languageCount")
      .then((result) => {
        console.log("Languages Count:", result.languageCount);
        let totalLanguageCount = result.languageCount;
        let webPageLanguageCount = document.querySelectorAll('[data-automation-id="formField-language"]').length || 0;
        console.log('webPageLanguageCount:', webPageLanguageCount);
        let languageCountDifference = totalLanguageCount - webPageLanguageCount; // If positive, extension > web page
        console.log('languageCountDifference:', languageCountDifference);
        adjustContentCount(languageCountDifference, 'languageSection');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalLanguageCount);
          }, 2000)
        });
      })
      .catch((error) => {
        console.error('Error occured while adding languages', error);
        return 0;
      })
      .then((count) => {
        console.log('This is the count for languages:', count)
        chrome.storage.local.get("languages")
          .then((result) => {
            // console.log("Array of languages:", result.languages);
            populateLanguageExperience(count, result.languages);
          })
          .catch((error) => {
            console.error('Error occured while populating languages', error)
            populateLanguageExperience(count, []);
          })
      })
      .catch((error) => {
        console.error('Error occurred while populating languages:', error);
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // console.log('Finished languageContainer');
            resolve();
          }, 500)
        })
      })
  }

  let websitesContainer = () => {
    chrome.storage.local.get('websitesCount')
      .then((result) => {
        let totalWebsitesCount = result.websitesCount;
        let webPageWebsitesCount = document.querySelectorAll('[data-automation-id="website"]').length || 0;
        let websitesCountDifference = totalWebsitesCount - webPageWebsitesCount;
        adjustContentCount(websitesCountDifference, 'websiteSection')
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalWebsitesCount);
          }, 2000)
        });
      })
      .catch((error) => {
        console.error('Error occurred while getting websites count:', error);
        return 0;
      })
      .then((count) => {
        chrome.storage.local.get('websites')
          .then((result) => {
            console.log("Array of websites:", result.websites);
            populateWebsiteExperience(count, result.websites);
          })
          .catch((error) => {
            console.error('Error occurred while retrieving websites:', error);
            populateWebsiteExperience(count, []); // Continue with an empty array if an error occurs
          });
      })
      .catch((error) => {
        console.error('Error occurred while populating websites:', error);
      })
      .then(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('Finished websiteContainer');
            resolve();
          }, 500)
        })
      })
  }

  let populateMyExperience = async () => {
    // chrome.storage.local.get("jobs") // Checking to see the arrays
    // .then((result) => {
    //   console.log("This is jobs:", result.jobs);
    //   chrome.storage.local.get("education")
    //   .then((result) => {
    //     console.log('This is education:', result.education);
    //     chrome.storage.local.get("languages")
    //     .then((result) => {
    //       console.log("this is languages:", result.languages)
    //     })
    //   })
    // })

    // await workExperienceContainer();
    // await educationContainer();
    await languageContainer();
    // await websitesContainer();

  }

  populateMyExperience();

})();