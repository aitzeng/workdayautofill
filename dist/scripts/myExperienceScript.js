/*global chrome*/
(function() {

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

  let populateMyExperience = () => {
    chrome.storage.local.get("totalJobs")
    .then((result) => {
      let totalJobCount = result.totalJobs; // Number of jobs set in the extension
      let webPageJobCount = document.querySelectorAll('[data-automation-id="formField-jobTitle"]').length; // Number of jobs present on the web page
      let jobCountDifference = totalJobCount - webPageJobCount; // If positive, extension > web page
      adjustWorkCount(jobCountDifference);
      // console.log("Extension Count:", totalJobCount);
      // console.log("Web page count:", webPageJobCount);
    })
    // chrome.storage.local.get("jobs")
    // .then((result) => {
    //   console.log(result.jobs);
    // })
  }

  populateMyExperience();

})();