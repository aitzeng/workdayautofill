/*global chrome*/
(function () {

  let mimicTyping = (string, element) => {
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

  let adjustWorkCount = (number) => {
    if (number > 0) {
      let element = document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="Add"]') || document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="Add Another"]')
      // console.log(element);
      for (let i = 0; i < number; i++) {
        setTimeout(() => { // Not sure exactly why, but this setTimeout with not time delay helps find the element a lot easier and click it
          element.click();
        })
      }
    } else {
      let element = document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="panel-set-delete-button"]')
      for (let i = 0; i < Math.abs(number); i++) {
        setTimeout(() => {
          element.click();
        })
      }
    }
  }

  let adjustLanguageCount = (number) => {
    if (number > 0) {
      let element = document.querySelector('[data-automation-id="languageSection"] [data-automation-id="Add"]') || document.querySelector('[data-automation-id="languageSection"] [data-automation-id="Add Another"]')
      for (let i = 0; i < number; i++) {
        setTimeout(() => {
          element.click();
        })
      }
    } else {
      let element = document.querySelector('[data-automation-id="languageSection"] [data-automation-id="panel-set-delete-button"]')
      for (let i = 0; i < Math.abs(number); i++) {
        setTimeout(() => {
          element.click();
        })
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

  let adjustEducationCount = (number) => {
    if (number > 0) {
      let element = document.querySelector('[data-automation-id="educationSection"] [data-automation-id="Add"]') || document.querySelector('[data-automation-id="educationSection"] [data-automation-id="Add Another"]')
      // console.log(element);
      for (let i = 0; i < number; i++) {
        setTimeout(() => {
          element.click();
        })
      }
    } else {
      let element = document.querySelector('[data-automation-id="educationSection"] [data-automation-id="panel-set-delete-button"]')
      for (let i = 0; i < Math.abs(number); i++) {
        setTimeout(() => {
          element.click();
        })
      }
    }
  }

  let selectDropDown = (desiredString, element) => {
    // console.log('Element for dropdown:', element)
    const dropdownButton = element
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

  let populateEducationExperience = async (count, array) => {
    for (let i = 0; i < count; i++) {
      document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="school"]`).value = array[i].school;
      await selectDropDown(array[i].degree, document.querySelector(`[data-automation-id="education-${i + 1}"] [data-automation-id="degree"]`))
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
    }
  }

  let workExperienceContainer = () => {
    chrome.storage.local.get("totalJobs")
      .then((result) => {
        let totalJobCount = result.totalJobs; // Number of jobs set in the extension
        let webPageJobCount = document.querySelectorAll('[data-automation-id="formField-jobTitle"]').length || 0; // Number of jobs present on the web page
        let jobCountDifference = totalJobCount - webPageJobCount; // If positive, extension > web page
        adjustWorkCount(jobCountDifference);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalJobCount);
          }, 2000)
        })
      })
      .catch((error) => {
        console.error('Error occured while getting job count', error)
      })
      .then((count) => {
        chrome.storage.local.get("jobs")
          .then((result) => {
            // console.log("Array of jobs:", result.jobs);
            populateWorkExperience(count, result.jobs);
          })
      })
      .catch((error) => {
        console.error('Error occured while filling job', error)
      })
  }

  let educationContainer = () => {
    chrome.storage.local.get("totalEducation")
      .then((result) => {
        let totalEducationCount = result.totalEducation;
        // console.log('Total Education Count:', totalEducationCount)
        let webPageEducationCount = document.querySelectorAll('[data-automation-id="formField-school"]').length || 0;
        // console.log('webPageEducationCount:', webPageEducationCount);
        let educationCountDifference = totalEducationCount - webPageEducationCount;
        adjustEducationCount(educationCountDifference);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalEducationCount);
          }, 2000)
        })
      })
      .catch((error) => {
        console.error('Error occured while adding education counts', error)
      })
      .then((count) => {
        // console.log('This is the count:', count)
        chrome.storage.local.get("education")
          .then((result) => {
            console.log("Array of education:", result.education);
            populateEducationExperience(count, result.education);
          })
      })
      .catch((error) => {
        console.error('Error occured while filling education', error)
      })
  }

  let languageContainer = () => {
    chrome.storage.local.get("languageCount")
      .then((result) => {
        // console.log("Languages Count:", result.languageCount);
        let totalLanguageCount = result.languageCount;
        let webPageLanguageCount = document.querySelectorAll('[data-automation-id="formField-language"]').length || 0;
        let languageCountDifference = totalLanguageCount - webPageLanguageCount; // If positive, extension > web page
        adjustLanguageCount(languageCountDifference);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalLanguageCount);
          }, 500)
        });
      })
      .catch((error) => {
        console.error('Error occured while adding languages', error)
      })
      .then((count) => {
        // console.log('This is the count for languages:', count)
        chrome.storage.local.get("languages")
          .then((result) => {
            console.log("Array of languages:", result.languages);
            populateLanguageExperience(count, result.languages);
          })
          .catch((error) => {
            console.error('Error occured while populating languages', error)
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

    workExperienceContainer();
    educationContainer();
    languageContainer();

  }

  populateMyExperience();

})();