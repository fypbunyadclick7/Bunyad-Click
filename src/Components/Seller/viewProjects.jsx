import React, { useState, useEffect,useRef  } from 'react';
import { MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBBtn, MDBIcon,MDBSpinner } from 'mdb-react-ui-kit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast'; // Import React Hot Toast
import moment from 'moment-timezone';

import Spinner from '../spinner';

export default function Project() {
  const [showMore, setShowMore] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [countries, setCountries] = useState({});
  const [optSmModal, setOptSmModal] = useState(false);
  const [statusToggle, setStatusToggle] = useState({});
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null); // New state for job details
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[userBidStatus, setUserBidStatus] = useState(null);
  const[bidRange, setBidRange] = useState("");
  const[totalJobsPostedByUser, setTotalJobsPostedByUser] = useState(0);
  const[createdAt, setCreatedAt] = useState("");
  const[timeAgo, setTimeAgo] = useState("");
  const [loading1, setLoading1] = useState(false);
  


  const formRef = useRef(null);

  
  const initialCharacterLimit = 50;
  const getTimeByCountry = (country, city) => {
    const timezone = moment.tz.guess(); // or use a known timezone for the country and city
    return moment.tz(timezone).format('h:mm A');
  };

  const handleToggle = (jobId) => {
    setStatusToggle((prevStatus) => ({
      ...prevStatus,
      [jobId]: !prevStatus[jobId],
    }));
  };

  const handleCloseModal = () => {
    setOptSmModal(false);
    setSelectedJobId(null);
    
    // Reset the form fields when modal closes
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleButtonClick = async (jobId) => {
    setSelectedJobId(jobId);
    setOptSmModal(true);

    try {
      setLoading1(true);
      const userId = Cookies.get('userId');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job/getSellerJob/${jobId}?userId=${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      setUserBidStatus(response.data.userBidStatus);
      setBidRange(response.data.bidRange);
      setTotalJobsPostedByUser(response.data.totalJobsPostedByUser);
      setCreatedAt(response.data.job.createdAt);
      setTimeAgo(response.data.timeAgo);
      setJobDetails(response.data.job);  // Set the fetched job details
      console.log(response.data);
      setLoading1(false);
    } catch (error) {
      toast.error('Error fetching job details!');
      console.error("Error fetching job details:", error);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedJobId) {
      console.error("No job selected");
      return;
    }
  
    if (userBidStatus) {
      // If user has already submitted a bid, show a message and don't submit again
      toast.error('You have already submitted a proposal for this job!');
      handleCloseModal();
      return;
    }
  
    setIsSubmitting(true);  // Set loading to true when the form is being submitted
  
    const formData = new FormData(e.target);
    const data = {
      Price: formData.get('price'),
      Duration: formData.get('duration'),
      CoverLetter: formData.get('coverletter'),
      JobId: selectedJobId,  // Use the selectedJobId
      UserId: Cookies.get('userId'), // Assuming userId is stored in cookies
    };
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/job/addBid`, data, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      toast.success('Proposal submitted successfully!');  // Show success toast notification
      console.log(response.data.message);  // Display success message
      handleCloseModal();  // Close modal after successful submission
    } catch (error) {
      toast.error('Error submitting proposal!');  // Show error toast notification
      console.error("Error submitting bid:", error);
    } finally {
      setIsSubmitting(false);  // Set loading to false once the submission is complete
    }
  };

  const fetchCountry = async (userId) => {
    if (countries[userId]) return; // Avoid re-fetching for the same userId
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/auth/isUser/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY,
        },
      });
      setCountries((prev) => ({ ...prev, [userId]: response.data.user.Country })); // Save country by userId
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job/getSellerJobs`, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        });
        setJobs(response.data.jobs);

        // Fetch country for each job's userId
        response.data.jobs.forEach((job) => {
          fetchCountry(job.UserId);
        });
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);
  const calculateDuration = (days) => {
    if (days >= 365) {
      // Calculate years
      const years = (days / 365).toFixed(1);
      return `${years} years`;
    } else if (days >= 30) {
      // Calculate months
      const months = (days / 30.44).toFixed(1); // Using 30.44 as the average days per month
      return `${months} months`;
    } else {
      // Return days if less than 30
      return `${days} days`;
    }
  };
  

  return (
    
    <div>
      
      {jobs.map((job) => (
        <div key={job.Id}>
          <button
            className="hoverParagraph w-full text-left"
            onClick={() => handleButtonClick(job.Id)}
          >
            <div className="d-flex justify-content-between align-items-left mt-0 w-full">
              <div className="d-flex align-items-left">
                <h5 style={{ marginRight: '10px' }}>{job.Title}</h5>
              </div>
              <div
                className="customSwitch"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: '10px' }}
                onClick={(e) => { e.stopPropagation(); handleToggle(job.Id); }}  // Prevent modal opening when toggle is clicked
              >
                <input
                  type="checkbox"
                  checked={!!statusToggle[job.Id]}
                  onChange={() => handleToggle(job.Id)}
                  style={{ display: 'none' }}
                />
                <i
                  className={statusToggle[job.Id] ? 'fas fa-heart' : 'far fa-heart'}
                  style={{
                    fontSize: '24px',
                    color: statusToggle[job.Id] ? 'var(--primary-btn-color)' : '#ccc',
                    transition: 'color 0.2s',
                    cursor: 'pointer',
                  }}
                ></i>
              </div>
            </div>
            <div className="job-details" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ color: 'var(--secondary-text-color)', fontSize: '12px', marginTop: '-2px' }}>
                <span>Posted {Math.floor((new Date() - new Date(job.UpdatedAt)) / (1000 * 3600 * 24))} days ago,</span>
                <span style={{ paddingLeft: '10px' }}>
                  Estimated Time: {calculateDuration(job.Timeline )} ,
                </span>
                <span style={{ paddingLeft: '10px' }}>Estimated Budget: ${job.Budget}</span>
              </div>

              <div style={styles.proposals}>
                Proposals: <strong>20 to 50</strong>
              </div>
            </div>
            <div className="job-description" style={{ width: '100%', textAlign: 'justify' }}>
              <p style={{ fontSize: '14px', color: 'var(--secondary-text-color)', marginBottom: '0' }}>
                {showMore === job.Id ? job.Description : `${job.Description.slice(0, initialCharacterLimit)}...`}
              </p>
              {job.Description.length > initialCharacterLimit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMore((prev) => (prev === job.Id ? null : job.Id));
                  }}
                  style={{ background: 'none', color: 'blue', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                >
                  {showMore === job.Id ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>

            <div style={styles.skillsContainer}>
  {(job.Skills || []).map((skill) => ( // Add fallback array
    <span style={styles.skillBadge} key={skill.Title}>{skill.Title}</span>
  ))}
            </div>
            <div style={styles.detailsContainer}>
              <div style={styles.detail}>
                <div style={styles.starsContainer}>
                  {[...Array(5)].map((_, index) => (
                    <i className="fas fa-star" key={index}></i>
                  ))}
                </div>
              </div>
              <div style={styles.detail}>
                <i className="fas fa-map-marker-alt"></i>
                <span style={{ marginLeft: '5px' }}>{countries[job.UserId] || 'Fetching...'}</span>
              </div>
            </div>
          </button>

          <hr />
        </div>
      ))}

      <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
        <MDBModalDialog size="xl" className="modal-right-sidebar" centered>
          <MDBModalContent>
            <MDBModalHeader>
              
              <MDBBtn className="" color="none" onClick={handleCloseModal} style={{fontSize:'20px'}}>
                <MDBIcon fas icon="arrow-left"  style={{background:'transparent', color:'var(--avatar-bg-color)'}}/></MDBBtn>
            </MDBModalHeader>
      {loading1 ? (
        // Show spinner while loading
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <MDBSpinner grow size="lg" color="primary">
            <span className="visually-hidden">Loading...</span>
          </MDBSpinner>
        </div>
      ) : (
            <MDBModalBody className="overflow-auto"> {/* Add overflow-auto here */}
            <div className="container">
            {jobDetails ? (
              <div className="row">
                <div className="col-md-8">
                  <div className="d-flex justify-content-between align-items-left mt-0 w-full">
                    <div className="d-flex align-items-left">
                      <h4 style={{ marginRight: '10px', marginBottom: '20px' }}>
                      {jobDetails.Title}
                      </h4>
                    </div>
                  </div>

                  <div
                    className="job-details mb-4"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <div
                      style={{
                        color: 'var(--secondary-text-color)',
                        fontSize: '12px',
                        marginTop: '-2px',
                      }}
                    >
                <span>Posted {timeAgo},</span>
                <span style={{ paddingLeft: '10px' }}>
                        Estimated Time: <strong>{calculateDuration(jobDetails.Timeline)} </strong>
                      </span>
                      <span style={{ paddingLeft: '10px' }}>
                        Estimated Budget: <strong>${jobDetails.Budget}, </strong>
                      </span>
                      <span style={{ paddingLeft: '10px' }}>
                        Proposals: <strong>{bidRange}</strong>
                      </span>
                    </div>
                  </div>
                  <hr />

                  <div
                    className="job-description"
                    style={{ width: '100%', textAlign: 'justify', marginTop: '30px' }}
                  >
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'var(--secondary-text-color)',
                        marginBottom: '30px',
                      }}
                    >
                    {jobDetails.Description}
                    </p>
                  </div>
                  <hr />
                  <h4 style={{ marginTop: '20px' }}>Skills and Experties</h4>
                  <div style={styles.skillsContainer}>
                  {(jobDetails.Skills || []).map((skill) => ( // Add fallback array
    <span style={styles.skillBadge} key={skill.Title}>{skill.Title}</span>
  ))}

            </div>
                </div>


                <div
                  className="borderBid col-md-4"
                  style={{ paddingLeft: '15px' }}
                >
                  <p style={{ fontWeight: 'bold', marginBottom: '5px', marginTop:'5px' }}>About the client</p>
                  <p>
                    <span style={{ color: 'green', fontWeight: 'bold' }}>✔ </span><span>Payment method verified</span>
                  </p>
                  <p>
                  <div style={styles.starsContainer}>
                  {[...Array(5)].map((_, index) => (
                    <i className="fas fa-star" key={index}></i>
                  ))}
                  <span style={{paddingLeft:'10px' , color:'gray', fontWeight:'bold'}}>5.0</span>
                </div>
                    <span style={{ color: 'gray' }}>4.95 of 44 reviews</span>
                  </p>

                  <p>
                  <span>{jobDetails.User.Country}</span> <br />
                  {jobDetails.User.City} {getTimeByCountry(jobDetails.User.Country, jobDetails.User.City)}
                  </p>

                  <p>
                    <span >{totalJobsPostedByUser} jobs posted</span> <br />
                    88% hire rate, 1 open job
                  </p>
                  <p>
                    <span >$6.9K total spent</span> <br />
                    54 hires, 5 active
                  </p>
                  <p>Member since {new Date(jobDetails.User.CreatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>

              </div>
              ) : (
                <Spinner />
              )}
              </div>

              <form onSubmit={handleSubmit} ref={formRef}>
                <div className="container">
                  <div className="mt-2">
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min={1}
                      required
                      placeholder="Price"
                      className="custom-input block w-full"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      id="duration"
                      name="duration"
                      type="number"
                      min={1}
                      required
                      placeholder="Duration in Days"
                      className="custom-input block w-full"
                    />
                  </div>
                  <div className="mt-2">
                    <textarea
                      id="coverletter"
                      name="coverletter"
                      rows="10"
                      required
                      placeholder="Cover letter"
                      className="custom-input block w-full"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <button
                      type="submit"
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {isSubmitting ? <Spinner /> : 'Submit Proposal'}
                    </button>
                  </div>
                </div>
              </form>
            </MDBModalBody>
             )}
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>;

    </div>
  );
}


const styles = {
  skillsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#e0e0e0',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#333',
  },
  detailsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  detail: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    color: '#666',
  },
  starsContainer: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--star-rating-color)',
    fontSize:'12px'
  },
  proposals: {
    fontSize: '12px',
    color: 'var(--secondary-text-color)',
    marginTop: '-2px',
    marginBottom: '10px',
  },
};
