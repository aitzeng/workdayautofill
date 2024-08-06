/*global chrome*/
(function () {

  let adjustContentCount = (number, section) => {
    if (number > 0) {
      let element = document.querySelector(`[data-automation-id="${section}"] [data-automation-id="Add"]`) || document.querySelector(`[data-automation-id="${section}"] [data-automation-id="Add Another"]`)
      for (let i = 0; i < number; i++) {
        setTimeout(() => { // Not sure exactly why, but this setTimeout with not time delay helps find the element a lot easier and click it
          element.click();
        })
      }
    } else {
      let element = document.querySelector(`[data-automation-id="${section}"] [data-automation-id="panel-set-delete-button"]`)
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
        console.log("Input element:", element);
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

  let populateWebsiteExperience = async (count, array) => {
    const event = new Event('input', { bubbles: true });
    for (let i = 0; i < count; i++) {
      let element = document.querySelector(`[data-automation-id="websitePanelSet-${i + 1}"] [data-automation-id="website"]`);
      element.value = array[i];
      element.dispatchEvent(event);

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
  }

  let languageContainer = () => {
    chrome.storage.local.get("languageCount")
      .then((result) => {
        // console.log("Languages Count:", result.languageCount);
        let totalLanguageCount = result.languageCount;
        let webPageLanguageCount = document.querySelectorAll('[data-automation-id="formField-language"]').length || 0;
        let languageCountDifference = totalLanguageCount - webPageLanguageCount; // If positive, extension > web page
        adjustContentCount(languageCountDifference, 'languageSection');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalLanguageCount);
          }, 500)
        });
      })
      .catch((error) => {
        console.error('Error occured while adding languages', error);
        return 0;
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
            populateLanguageExperience(count, []);
          })
      })
      .catch((error) => {
        console.error('Error occurred while populating languages:', error);
      });
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
          }, 500)
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
      });
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
    await educationContainer();
    // await languageContainer();
    // await websitesContainer();

  }

  populateMyExperience();

})();