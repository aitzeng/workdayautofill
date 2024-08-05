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
      console.log(element);
      for (let i = 0; i < number; i++) {
        setTimeout(() => {
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

  let populateMyExperience = () => {
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
      .then((count) => {
        chrome.storage.local.get("jobs")
          .then((result) => {
            console.log("Array of jobs:", result.jobs);
            populateWorkExperience(count, result.jobs);
          })
      })
  }

  populateMyExperience();

})();