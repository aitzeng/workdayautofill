/*global chrome*/
import { useState, useEffect } from 'react';
import '../styles/MyExperience.css';
import { monthArray, yearArray, degreeArray, languageProficiencyArray, languageList, languageLevels } from '../data.js';

function MyExperience({ getCurrentTabId }) {

  const [totalJobs, setTotalJobs] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [totalEducation, setTotalEducation] = useState(1);
  const [education, setEducation] = useState([]);
  const [languageCount, setLanguageCount] = useState(1);
  const [languages, setLanguages] = useState([]);
  const [websitesCount, setWebsitesCount] = useState(1);
  const [websites, setWebsites] = useState([]);

  const totalJobsHandler = (e) => {
    setTotalJobs(e.target.value);
  }

  const totalEducationHandler = (e) => {
    setTotalEducation(e.target.value);
  }

  const languageCountHandler = (e) => {
    setLanguageCount(e.target.value);
  }

  const websitesCountHandler = (e) => {
    setWebsitesCount(e.target.value);
  }

  const populateJobs = () => {
    // chrome.storage.local.remove('jobs').then(() => { // Clear the local storage for jobs
    //   chrome.storage.local.remove('totalJobs');
    //   console.log('jobs cleared')
    // })
    chrome.storage.local.get('jobs').then((result) => {
      let storedJobs = Array.isArray(result.jobs) ? result.jobs : [];

      if (storedJobs.length < 5) {
        storedJobs = [...storedJobs];

        for (let i = storedJobs.length; i < 5; i++) {
          storedJobs.push({ jobTitle: '', company: '', location: '', current: false, roleDescription: '', startDateMonth: '01', startDateYear: '1950', endDateMonth: '01', endDateYear: '1950' });
        }

        chrome.storage.local.set({ jobs: storedJobs })
          .then(() => {
            setJobs(storedJobs);
          })
          .then(() => {
            chrome.storage.local.get('totalJobs')
              .then((result) => {
                if (result.totalJobs === undefined) {
                  chrome.storage.local.set({ 'totalJobs': 1 })
                  setTotalJobs(1);
                } else {
                  setTotalJobs(result.totalJobs)
                }
              })
          })
      } else {
        setJobs(storedJobs);
        chrome.storage.local.get('totalJobs')
          .then((result) => {
            setTotalJobs(result.totalJobs)
          })
      }
    });
  };

  const populateEducation = () => {
    // chrome.storage.local.remove('education').then(() => { // Clear the local storage for jobs
    //   chrome.storage.local.remove('totalEducation');
    //   console.log('education cleared')
    // })
    chrome.storage.local.get('education').then((result) => {
      let storedEducation = Array.isArray(result.education) ? result.education : [];

      if (storedEducation.length < 3) {
        storedEducation = [...storedEducation];

        for (let i = storedEducation.length; i < 3; i++) {
          storedEducation.push({ school: '', degree: 'Degree in Progress (no degree awarded)', fieldOfStudy: '', gradMonth: '', gradYear: '' });
        }

        chrome.storage.local.set({ education: storedEducation })
          .then(() => {
            setEducation(storedEducation);
          })
          .then(() => {
            chrome.storage.local.get('totalEducation')
              .then((result) => {
                if (result.totalEducation === undefined) {
                  chrome.storage.local.set({ 'totalEducation': 1 })
                  setTotalEducation(1);
                } else {
                  setTotalEducation(result.totalEducation)
                }
              })
          })
      } else {
        setEducation(storedEducation);
        chrome.storage.local.get('totalEducation')
          .then((result) => {
            setTotalEducation(result.totalEducation)
          })
      }
    });
  };

  const populateLanguages = () => {
    // chrome.storage.local.remove('languages').then(() => { // Clear the local storage for education
    //   chrome.storage.local.remove('languageCount');
    //   console.log('language cleared')
    // })
    chrome.storage.local.get('languages').then((result) => {
      let storedLanguages = Array.isArray(result.languages) ? result.languages : [];

      if (storedLanguages.length < 3) {
        storedLanguages = [...storedLanguages];

        for (let i = storedLanguages.length; i < 3; i++) {
          storedLanguages.push({ language: 'Afrikaans', fluent: false, overallProficiency: '1 - Minimal Competency', reading: 'Beginner', speaking: 'Beginner', writing: 'Beginner' });
        }

        chrome.storage.local.set({ languages: storedLanguages })
          .then(() => {
            setLanguages(storedLanguages);
          })
          .then(() => {
            chrome.storage.local.get('languageCount')
              .then((result) => {
                if (result.languageCount === undefined) {
                  chrome.storage.local.set({ 'languageCount': 1 })
                  setLanguageCount(1);
                } else {
                  setLanguageCount(result.languageCount)
                }
              })
          })
      } else {
        setLanguages(storedLanguages);
        chrome.storage.local.get('languageCount')
          .then((result) => {
            setLanguageCount(result.languageCount)
          })
      }
    });
  };

  const populateWebsites = () => {
    // chrome.storage.local.remove('websites').then(() => { // Clear the local storage for education
    //   chrome.storage.local.remove('websitesCount');
    //   console.log('websites cleared')
    // })
    chrome.storage.local.get('websites').then((result) => {
      let storedWebsites = Array.isArray(result.websites) ? result.websites : [];

      if (storedWebsites.length < 3) {
        storedWebsites = [...storedWebsites];

        for (let i = storedWebsites.length; i < 3; i++) {
          storedWebsites.push('')
        }

        chrome.storage.local.set({ websites: websites })
          .then(() => {
            setWebsites(storedWebsites);
          })
          .then(() => {
            chrome.storage.local.get('websitesCount')
              .then((result) => {
                if (result.websitesCount === undefined) {
                  chrome.storage.local.set({ 'websitesCount': 1 })
                  setWebsitesCount(1);
                } else {
                  setWebsitesCount(result.websitesCount)
                }
              })
          })
      } else {
        setWebsites(storedWebsites);
        chrome.storage.local.get('websitesCount')
          .then((result) => {
            setWebsitesCount(result.websitesCount)
          })
      }
    })
  }

  const saveExperienceHandler = () => {
    chrome.storage.local.set({ jobs: jobs })
      .then(() => {
        console.log('Job saved to storage:', jobs);
        chrome.storage.local.set({ totalJobs: totalJobs })
      })
      .then(() => {
        chrome.storage.local.set({ education: education })
          .then(() => {
            console.log('Education saved to storage:', education);
            chrome.storage.local.set({ totalEducation: totalEducation })
          })
          .then(() => {
            chrome.storage.local.set({ languages: languages })
              .then(() => {
                console.log('Languages saved to storage:', languages);
                chrome.storage.local.set({ languageCount: languageCount })
              })
              .then(() => {
                chrome.storage.local.set({ websites: websites })
                  .then(() => {
                    console.log('Websites saved to storage:', websites);
                    chrome.storage.local.set({ websitesCount: websitesCount })
                  })
              })
          })
      })
  }

  const handleInputChange = (index, field, value) => {
    const updatedJobs = [...jobs];
    if (field === 'current') {
      updatedJobs[index][field] = value === 'true';
    } else {
      updatedJobs[index][field] = value;
    }
    setJobs(updatedJobs);
  };

  const handleEducationInputChange = (index, field, value) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = value;
    setEducation(updatedEducation);
  };

  const handleLanguageInputChange = (index, field, value) => {
    const updatedLanguages = [...languages];
    if (field === 'fluent') {
      updatedLanguages[index][field] = value === 'true';
    } else {
      updatedLanguages[index][field] = value;
    }
    setLanguages(updatedLanguages);
  };

  const handleWebsitesInputChange = (index, value) => {
    const updatedWebsites = [...websites];
    updatedWebsites[index] = value;
    setWebsites(updatedWebsites);
  }

  const autofillSubmitter = () => {
    getCurrentTabId()
      .then((result) =>
        chrome.scripting.executeScript({ target: { tabId: result.id }, files: ["./scripts/myExperienceScript.js"] }))
      .then(() => console.log('myExperience injected'))
    // .then(() => window.close())
  }

  useEffect(() => {
    populateJobs();
    populateEducation();
    populateLanguages();
    populateWebsites();
  }, [])

  return (
    <form className="My-Experience" onSubmit={autofillSubmitter}>
      <button type="button" onClick={saveExperienceHandler}>Save</button>
      <button type="submit">Auto-fill</button>
      <div className="work-experience-title">Total Number of Jobs</div>
      <select value={totalJobs} onChange={totalJobsHandler}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
      {jobs.slice(0, totalJobs).map((job, index) =>
        <div key={index}>
          <div className="work-experience-title">Work Experience #{index + 1}</div>
          <div>Job Title</div>
          <input type="text" value={job.jobTitle} onChange={(e) => {
            handleInputChange(index, 'jobTitle', e.target.value)
          }} />
          <div>Company</div>
          <input type="text" value={job.company} onChange={(e) => {
            handleInputChange(index, 'company', e.target.value)
          }} />
          <div>Location</div>
          <input type="text" value={job.location} onChange={(e) => {
            handleInputChange(index, 'location', e.target.value)
          }} />
          <div>Currently Work Here?</div>
          <select value={job.current} onChange={(e) => {
            handleInputChange(index, 'current', e.target.value)
          }}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <div className="work-experience-title">Start Date</div>
          <div className="start-date-container">
            <div className="date-container">
              <div>Month</div>
              <select value={job.startDateMonth} onChange={(e) => {
                handleInputChange(index, 'startDateMonth', e.target.value)
              }}>
                {monthArray.map((month) => <option value={month}>{month}</option>)}
              </select>
            </div>
            <div className="date-container">
              <div>Year</div>
              <select value={job.startDateYear} onChange={(e) => {
                handleInputChange(index, 'startDateYear', e.target.value)
              }}>
                {yearArray.map((year) => <option value={year}>{year}</option>)}
              </select>
            </div>
          </div>
          {job.current ? null : <div>
            <div className="work-experience-title">End Date</div>
            <div className="end-date-container">
              <div className="date-container">
                <div>Month</div>
                <select value={job.endDateMonth} onChange={(e) => {
                  handleInputChange(index, 'endDateMonth', e.target.value)
                }}>
                  {monthArray.map((month) => <option value={month}>{month}</option>)}
                </select>
              </div>
              <div className="date-container">
                <div>Year</div>
                <select value={job.endDateYear} onChange={(e) => {
                  handleInputChange(index, 'endDateYear', e.target.value)
                }}>
                  {yearArray.map((year) => <option value={year}>{year}</option>)}
                </select>
              </div>
            </div>

          </div>}
          <div>Role Description</div>
          <textarea rows="10" cols="33" value={job.roleDescription} onChange={(e) => {
            handleInputChange(index, 'roleDescription', e.target.value)
          }}></textarea>
        </div >)
      }
      <div className="work-experience-title">Total Number of Education</div>
      <select value={totalEducation} onChange={totalEducationHandler}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
      {education.slice(0, totalEducation).map((school, index) =>
        <div key={index}>
          <div className="work-experience-title">School/Univeristy #{index + 1}</div>
          <div>School Name</div>
          <input placeholder="Type the full name of your school" type="text" value={school.school} onChange={(e) => {
            handleEducationInputChange(index, 'school', e.target.value)
          }} />
          <div>Degree</div>
          <input type="text" value={school.degree} onChange={(e) => {
            handleEducationInputChange(index, 'degree', e.target.value)
          }} />
        </div>)}
      <div className="work-experience-title">Total Number of Languages</div>
      <select value={languageCount} onChange={languageCountHandler}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
      {languages.slice(0, languageCount).map((language, index) =>
        <div key={index}>
          <div className="work-experience-title">Language #{index + 1}</div>
          <div className="language-container">
            <div>
              <div>Language</div>
              <select value={language.language} onChange={(e) => {
                handleLanguageInputChange(index, 'language', e.target.value)
              }}>
                {languageList.map((choice) => <option value={choice}>{choice}</option>)}
              </select>
            </div>
            <div>
              <div>Fluent?</div>
              <select value={language.fluent} onChange={(e) => {
                handleLanguageInputChange(index, 'fluent', e.target.value)
              }}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>Overall Proficiency</div>
          <select value={language.overallProficiency} onChange={(e) => {
            handleLanguageInputChange(index, 'overallProficiency', e.target.value)
          }}>
            {languageProficiencyArray.map((proficiency) => <option value={proficiency}>{proficiency}</option>)}
          </select>
          <div>Reading</div>
          <select value={language.reading} onChange={(e) => {
            handleLanguageInputChange(index, 'reading', e.target.value)
          }}>
            {languageLevels.map((level) => <option value={level}>{level}</option>)}
          </select>
          <div>Speaking</div>
          <select value={language.speaking} onChange={(e) => {
            handleLanguageInputChange(index, 'speaking', e.target.value)
          }}>
            {languageLevels.map((level) => <option value={level}>{level}</option>)}
          </select>
          <div>Writing</div>
          <select value={language.writing} onChange={(e) => {
            handleLanguageInputChange(index, 'writing', e.target.value)
          }}>
            {languageLevels.map((level) => <option value={level}>{level}</option>)}
          </select>
        </div>)}
      <div className="work-experience-title">Total Number of Languages</div>
      <select value={websitesCount} onChange={websitesCountHandler}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
      </select>
      {websites.slice(0, websitesCount).map((website, index) =>
        <div key={index}>
          <div>Website #{index + 1}</div>
          <input type="text" value={website} onChange={(e) => {
            handleWebsitesInputChange(index, e.target.value);
          }}/>
        </div>)}
    </form >
  )
}

export default MyExperience;