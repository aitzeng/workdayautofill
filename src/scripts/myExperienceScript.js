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
      let element = document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="Add Another"]')
      for (let i = 0; i < number; i++) {
        element.click();
      }
    } else {
      let element = document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="panel-set-delete-button"]')
      for (let i = 0; i < Math.abs(number); i++) {
        element.click();
      }
    }
  }

  let populateWorkExperience = (count, array) => {
    for (let i = 0; i < count; i++) {
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="jobTitle"]`).value = array[i].jobTitle;
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="company"]`).value = array[i].company;
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="location"]`).value = array[i].location;
      let startDateElement = document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-startDate"] [data-automation-id="dateSectionMonth-input"]`)
      startDateElement.value = array[i].startDate;
      if (array[i].current) {
        document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="currentlyWorkHere"]`).click();
      } else {
        document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="formField-endDate""] [data-automation-id="dateInputWrapper"]`).value = array[i].endDate;
      }
      document.querySelector(`[data-automation-id="workExperience-${i + 1}"] [data-automation-id="description"]`).value = array[i].roleDescription;
    }
  }

  let populateMyExperience = () => {
    chrome.storage.local.get("totalJobs")
      .then((result) => {
        let totalJobCount = result.totalJobs; // Number of jobs set in the extension
        let webPageJobCount = document.querySelectorAll('[data-automation-id="formField-jobTitle"]').length; // Number of jobs present on the web page
        let jobCountDifference = totalJobCount - webPageJobCount; // If positive, extension > web page
        adjustWorkCount(jobCountDifference);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(totalJobCount);
          }, 100)
        })
      })
      .then((count) => {
        console.log('This is count:', count);
        chrome.storage.local.get("jobs")
          .then((result) => {
            populateWorkExperience(count, result.jobs);
            // console.log("Array of jobs:", result.jobs);
          })
      })
  }

  populateMyExperience();

})();