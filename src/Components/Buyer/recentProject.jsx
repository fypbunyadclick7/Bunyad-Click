import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../../Components/spinner';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBIcon,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import Skills from '../../Components/skills';
import { Link } from 'react-router-dom';

export default function RecentProject({ searchQuery }) {
  const [optSmModal, setOptSmModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState([]);
  const [statusToggle, setStatusToggle] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null); // Track the job to delete
  const userId = Cookies.get('userId');
  const [loading, setLoading] = useState(true);

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/job/getJobs/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY
          }
        });
        setJobs(response.data.jobs.filter(job => job.Status !== 'InActive')); // Only show active jobs
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, [userId]);

  // Step 3: Filter jobs based on searchQuery
  const filteredJobs = jobs.filter(job => job.Title.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleOpen = (job) => {
    if (job) {
      setSelectedJob(job);
      // Ensure job.JobSkills is defined before mapping
      setSkills(job.JobSkills ? job.JobSkills.map(skill => skill.Title) : []); // Set job skills or default to an empty array
      setStatusToggle(job.Status === 'Active'); // Set the toggle based on the job status
    }
    setOptSmModal(!optSmModal);
  };
  

  const handleSkillsChange = (newSkills) => {
    setSkills(newSkills);
  };

  const handleStatusToggle = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Pause' : 'Active'; 

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/job/updateJob/${jobId}`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        }
      );

      toast.success(response.data.message || 'Job status updated successfully');
      
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.Id === jobId ? { ...job, Status: newStatus } : job
        )
      );
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  // Handle opening the delete confirmation modal
  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId); // Set the job to delete
    setDeleteModal(true); // Open the delete modal
  };


  

  // Handle delete
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/job/deleteJob/${jobToDelete}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        }
      );
      
      toast.success(response.data.message || 'Job deleted successfully');
      
      // Remove the job from the list
      setJobs((prevJobs) => prevJobs.filter((job) => job.Id !== jobToDelete));

      setDeleteModal(false); // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };


  return (
    <div>
      {loading ? (
        // Show spinner while loading
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <MDBSpinner grow size="lg" color="primary">
            <span className="visually-hidden">Loading...</span>
          </MDBSpinner>
        </div>
      ) : (
      <>
      {filteredJobs.map((job) => (
        <div key={job.Id}>
          <div className="d-flex justify-content-between align-items-center mt-0">
            <div className="d-flex align-items-center">
              <h5 style={{ marginRight: '10px' }}>{job.Title}</h5>
              <span className={`badge ${job.Status === 'Active' ? 'bg-success' : 'bg-danger'} mr-2`} style={{ fontSize: '12px' }}>
                {job.Status}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <div className='customSwitch' style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: '10px' }}>
                <input
                  type='checkbox'
                  checked={job.Status === 'Active'}
                  onChange={() => handleStatusToggle(job.Id, job.Status)}
                  style={{
                    height: '20px',
                    width: '20px',
                    appearance: 'none',
                    borderRadius: '30px',
                    backgroundColor: job.Status === 'Active' ? 'var(--primary-btn-color)' : '#ccc',
                    position: 'relative',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                    outline: 'none',
                    transition: 'background-color 0.2s',
                    marginTop: '-5px',
                  }}
                />
              </div>
              {/* <i className="fa fa-edit" style={{ cursor: 'pointer', fontSize: '20px', color: 'var(--primary-btn-color)', paddingBottom: '5px' }} onClick={() => toggleOpen(job)}></i> */}
              <i className="fa fa-trash" style={{ cursor: 'pointer', fontSize: '20px', color: 'var(--primary-btn-color)', paddingBottom: '5px', marginLeft: '10px' }} onClick={() => openDeleteModal(job.Id)}></i>
                  <Link
                  to={`/viewBids/${job.Id}`} // Pass the job ID as a route parameter
                  >
                  <i
                  className="fa fa-circle-info"
                  style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: 'var(--primary-btn-color)',
                  paddingBottom: '5px',
                  marginLeft: '10px',
                  }}
                  ></i>
                  </Link>

           
            </div>
          </div>
          <div>
            <span style={{ fontSize: '14px', color: 'var(--secondary-text-color)' }}>Created {new Date(job.CreatedAt).toLocaleDateString()} by you</span>
          </div>
          <hr />
        </div>
      ))}
</>
      )}



      {/* Delete Confirmation Modal */}
      <MDBModal show={deleteModal} setShow={setDeleteModal} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Confirm Deletion</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setDeleteModal(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Are you sure you want to delete this job?</p>
              <div className="d-flex justify-content-end">
                <MDBBtn color="secondary" onClick={() => setDeleteModal(false)}>
                  Cancel
                </MDBBtn>
                <MDBBtn color="danger" onClick={handleDelete} className="ms-3">
                  {isSubmitting ? <Spinner /> : 'Delete'}
                </MDBBtn>
              </div>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>

      {/* Modal */}
      {/* <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
        <MDBModalDialog size="xl">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Edit Project</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <form onSubmit={handleStatusToggle}>
                <div className="container">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="custom-input block w-full mb-3"
                    placeholder="Enter Job Title"
                    defaultValue={selectedJob?.Title || ''}
                  />
                  <div className="row">
                    <div className="col-md-6 sm-12">
                      <input
                        id="scope"
                        name="scope"
                        type="number"
                        required
                        className="custom-input block w-full mb-3"
                        placeholder="Enter Timeline in days"
                        defaultValue={selectedJob?.Timeline || ''}
                      />
                    </div>
                    <div className="col-md-6 sm-12">
                      <input
                        id="budget"
                        name="budget"
                        type="number"
                        required
                        className="custom-input block w-full mb-3"
                        placeholder="Enter your Budget"
                        defaultValue={selectedJob?.Budget || ''}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 sm-12">
                      <select
                        id="category"
                        name="category"
                        required
                        className="custom-input block w-full mb-3"
                        defaultValue={selectedJob?.CategoryId || ''}
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="softwareDeveloper">Software Developer</option>
                        <option value="projectManager">Project Manager</option>
                        <option value="dataAnalyst">Data Analyst</option>
                        <option value="designer">Designer</option>
                      </select>
                    </div>
                    <div className="col-md-6 sm-12">
                      <select
                        id="subcategory"
                        name="subcategory"
                        required
                        className="custom-input block w-full mb-3"
                        defaultValue={selectedJob?.SubCategoryId || ''}
                      >
                        <option value="" disabled>
                          Select Sub Category
                        </option>
                        <option value="softwareDeveloper">Software Developer</option>
                        <option value="projectManager">Project Manager</option>
                        <option value="dataAnalyst">Data Analyst</option>
                        <option value="designer">Designer</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 sm-12">
                      <textarea
                        id="description"
                        name="description"
                        rows="3"
                        required
                        className="custom-input block w-full mb-3"
                        placeholder="Enter Job Description"
                        defaultValue={selectedJob?.Description || ''}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 sm-12">
                      <Skills skills={skills} setSkills={handleSkillsChange} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 sm-12">
                      <button type="submit" className="primary-btn w-100">
                        {isSubmitting ? <Spinner /> : 'Update Project'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal> */}
    </div>
  );
}
