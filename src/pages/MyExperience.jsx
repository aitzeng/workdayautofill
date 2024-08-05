/*global chrome*/
import { useState, useEffect } from 'react';
import './MyExperience.css';

function MyExperience({ getCurrentTabId }) {

  const [totalJobs, setTotalJobs] = useState(1);
  const [jobs, setJobs] = useState([]);

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
          storedJobs.push({ jobTitle: '', company: '', location: '', current: false, roleDescription: '', startDate: '', endDate: '' });
        }

        chrome.storage.local.set({ jobs: storedJobs }).then(() => {
          setJobs(storedJobs);
        });
      } else {
        setJobs(storedJobs);
      }
    });
  };

  const saveExperienceHandler = () => {
    chrome.storage.local.set({ jobs: jobs }).then(() => {
      console.log('Job saved to storage:', jobs)
    })
  }

  const handleInputChange = (index, field, value) => {
    const updatedJobs = [...jobs];
    updatedJobs[index][field] = value;
    setJobs(updatedJobs);
  };

  useEffect(() => {
    populateJobs();
  }, [])

  return (
    <form className="My-Experience">
      <button type="button" onClick={saveExperienceHandler}>Save Experience</button>
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
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <div>Start Date</div>
          <input placeholder="MM/YYYY" type="text" value={job.startDate} onChange={(e) => {
            handleInputChange(index, 'startDate', e.target.value)
          }} />
          {job.current ? null : <div>
            <div>End Date</div>
            <input placeholder="MM/YYYY" type="text" value={job.endDate} onChange={(e) => {
              handleInputChange(index, 'endDate', e.target.value)
            }} />
          </div>}
          <div>Role Description</div>
          <textarea rows="10" cols="33" value={job.roleDescription} onChange={(e) => {
            handleInputChange(index, 'roleDescription', e.target.value)
          }}></textarea>
        </div>)}
    </form>
  )
}

export default MyExperience;