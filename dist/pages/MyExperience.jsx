/*global chrome*/
import { useState, useEffect } from 'react';
import '../styles/MyExperience.css';

function MyExperience({ getCurrentTabId }) {

  const [totalJobs, setTotalJobs] = useState(1);
  const [jobs, setJobs] = useState([]);

  const monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const yearArray = [
    "1950", "1951", "1952", "1953", "1954", "1955", "1956", "1957", "1958", "1959",
    "1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969",
    "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979",
    "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989",
    "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999",
    "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
    "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019",
    "2020", "2021", "2022", "2023", "2024"
  ]


  const totalJobsHandler = (e) => {
    setTotalJobs(e.target.value);
  }

  const populateJobs = () => {
    // chrome.storage.local.remove('jobs').then(() => { // Clear the local storage for jobs
    //   console.log('jobs cleared')
    // })
    chrome.storage.local.get('jobs').then((result) => {
      let storedJobs = Array.isArray(result.jobs) ? result.jobs : [];

      if (storedJobs.length < 5) {
        storedJobs = [...storedJobs];

        for (let i = storedJobs.length; i < 5; i++) {
          storedJobs.push({ jobTitle: '', company: '', location: '', current: false, roleDescription: '', startDateMonth: '', startDateYear: '', endDateMonth: '', endDateYear: '' });
        }

        chrome.storage.local.set({ jobs: storedJobs })
          .then(() => {
            setJobs(storedJobs);
          })
          .then(() => {
            chrome.storage.local.get("totalJobs")
              .then((result) => {
                setTotalJobs(result.totalJobs)
              })
          })
      } else {
        setJobs(storedJobs);
        chrome.storage.local.get("totalJobs")
          .then((result) => {
            setTotalJobs(result.totalJobs)
          })
      }
    });
  };

  const saveExperienceHandler = () => {
    chrome.storage.local.set({ jobs: jobs })
      .then(() => {
        console.log('Job saved to storage:', jobs);
        chrome.storage.local.set({ totalJobs: totalJobs })
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

  const autofillSubmitter = () => {
    getCurrentTabId()
      .then((result) =>
        chrome.scripting.executeScript({ target: { tabId: result.id }, files: ["./scripts/myExperienceScript.js"] }))
      .then(() => console.log('myExperience injected'))
    // .then(() => window.close())
  }

  useEffect(() => {
    populateJobs();
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
    </form >
  )
}

export default MyExperience;