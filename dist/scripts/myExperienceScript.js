chrome.storage.local.get("totalJobs").then((t=>{let e=t.totalJobs,o=document.querySelectorAll('[data-automation-id="formField-jobTitle"]').length;return(t=>{if(t>0){let e=document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="Add Another"]');for(let o=0;o<t;o++)e.click()}else{let e=document.querySelector('[data-automation-id="workExperienceSection"] [data-automation-id="panel-set-delete-button"]');for(let o=0;o<Math.abs(t);o++)e.click()}})(e-o),new Promise((t=>{setTimeout((()=>{t(e)}),100)}))})).then((t=>{console.log("This is count:",t),chrome.storage.local.get("jobs").then((e=>{((t,e)=>{for(let o=0;o<t;o++)document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="jobTitle"]`).value=e[o].jobTitle,document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="company"]`).value=e[o].company,document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="location"]`).value=e[o].location,document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="formField-startDate"] [data-automation-id="dateSectionMonth-input"]`).value=e[o].startDate,e[o].current?document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="currentlyWorkHere"]`).click():document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="formField-endDate""] [data-automation-id="dateInputWrapper"]`).value=e[o].endDate,document.querySelector(`[data-automation-id="workExperience-${o+1}"] [data-automation-id="description"]`).value=e[o].roleDescription})(t,e.jobs)}))}));