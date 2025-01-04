import React, { useState, useEffect } from 'react';
import {
  MDBCard,
  MDBRipple,
  MDBCol,
  MDBBadge,
  MDBCarousel,
  MDBCarouselItem,
  MDBRow,
  MDBCardBody,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
  MDBSpinner, // Import MDBSpinner
} from 'mdb-react-ui-kit';
import Spinner from '../spinner';
import axios from 'axios'; // Axios for API requests
import toast from 'react-hot-toast'; // Toast notifications
import Cookies from 'js-cookie';
import { uploadToCloudinary } from '../../utils/cloudinaryService';

export default function Portfolio() {
  const [optSmModal, setOptSmModal] = useState(false);
  const toggleOpen = () => setOptSmModal(!optSmModal);
  const [isToggled, setIsToggled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [additionalScreenshot, setAdditionalScreenshot] = useState(null);
  const [additionalScreenshot1, setAdditionalScreenshot1] = useState(null);
  const [additionalScreenshot2, setAdditionalScreenshot2] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [lines, setLines] = useState([]);
  const [statusToggles, setStatusToggles] = useState({});
  const [expandedCards, setExpandedCards] = useState({}); // Track expanded cards
  const [loading1, setLoading1] = useState(false);

  const userId = Cookies.get('userId');

  // Handle toggle switch for project status
  const handleToggle = async (projectId) => {
    const currentStatus = statusToggles[projectId] ? 'Pause' : 'Active';

    try {
      // Send status update request to backend
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/user/updateProjectStatus/${projectId}`,
        { status: currentStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY,
          },
        }
      );

      // Update local toggle state upon success
      setStatusToggles((prev) => ({
        ...prev,
        [projectId]: !prev[projectId],
      }));

      // Show success toast
      toast.success(`Project status updated to ${currentStatus}`);
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Show loading toast for image upload
      const toastId = toast.loading('Uploading images...');

      // Upload images to Cloudinary
      const [image1Url, image2Url, image3Url] = await Promise.all([
        uploadToCloudinary(additionalScreenshot),
        uploadToCloudinary(additionalScreenshot1),
        uploadToCloudinary(additionalScreenshot2),
      ]);

      // Show success toast for image upload completion
      toast.success('Images uploaded!', { id: toastId });

      // Step 2: Submit form data to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/addProject/${userId}`,
        {
          title: modalProfile.name,
          description: modalProfile.description,
          image1: image1Url,
          image2: image2Url,
          image3: image3Url,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.REACT_APP_API_KEY, // Use API key from env variables
          },
        }
      );

      // Step 3: Show success toast for project addition
      toast.success('Project added successfully!');

      // Step 4: Reset the form, close modal, and clear image states
      setModalProfile({ name: '', description: '' });
      setAdditionalScreenshot(null);
      setAdditionalScreenshot1(null);
      setAdditionalScreenshot2(null);
      toggleOpen();

      // Step 5: Refetch profile data to update the UI
      fetchProfileData();
    } catch (error) {
      console.error('Error adding project:', error);
      // Show error toast if the project addition fails
      toast.error('Failed to add project.');
    } finally {
      // Hide spinner after submission completes
      setIsSubmitting(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading1(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/getProfile/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_API_KEY, // Use API key from env variables
        },
      });

      // Set the full profile data, including projects
      console.log(response.data);
      setProfileData(response.data);

      // Assuming Projects exist in the response
      if (response.data.Projects && response.data.Projects.length > 0) {
        // Set the project description split by periods for multiple lines
        setLines(response.data.Projects[0].Description.split('. '));

        // Initialize statusToggles based on the fetched project statuses
        const initialStatusToggles = {};
        response.data.Projects.forEach((project) => {
          initialStatusToggles[project.Id] = project.Status === 'Active'; // Assuming 'Status' is the field in your DB
        });
        setStatusToggles(initialStatusToggles);
        setLoading1(false);
      } else {
        // Handle case when there are no projects
        setLines([]);
        setStatusToggles({}); // Reset statusToggles if no projects exist
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const [modalProfile, setModalProfile] = useState({
    name: '',
    description: ''
  });

  const handleExpandCard = (projectId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  return (
    <div>
      {loading1 ? (
        // Show spinner while loading
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <MDBSpinner grow size="lg" color="primary">
            <span className="visually-hidden">Loading...</span>
          </MDBSpinner>
        </div>
      ) : (
        // Render portfolio content once data is loaded
        <MDBRow>
          <div className='container'>
            <div className="d-flex justify-content-between align-items-center">
              <h4>Portfolio</h4>
              <i
                className="fa fa-plus-circle"
                style={{ cursor: 'pointer', fontSize: '30px', color: 'var(--primary-btn-color)', paddingBottom: '10px' }}
                onClick={toggleOpen}
              ></i>
            </div>
          </div>
          {profileData?.Projects && profileData.Projects.map((project) => {
            const isExpanded = expandedCards[project.Id];

            return (
              <MDBCol md="4" key={project.Id}>
                <MDBCard>
                  <MDBRipple
                    rippleColor="light"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom position-relative"
                  >
                    <MDBCarousel showControls>
                      {project.Image1 && (
                        <MDBCarouselItem
                          itemId={1}
                          src={project.Image1}
                          alt="Image 1"
                          style={{
                            width: '100%',
                            height: '150px', // Fixed height for all images
                            objectFit: 'cover', // Ensures aspect ratio while cropping
                            borderRadius: '8px', // Optional rounded corners
                          }}
                        />
                      )}
                      {project.Image2 && (
                        <MDBCarouselItem
                          itemId={2}
                          src={project.Image2}
                          alt="Image 2"
                          style={{
                            width: '100%',
                            height: '150px', // Fixed height for all images
                            objectFit: 'cover', // Ensures aspect ratio while cropping
                            borderRadius: '8px', // Optional rounded corners
                          }}
                        />
                      )}
                      {project.Image3 && (
                        <MDBCarouselItem
                          itemId={3}
                          src={project.Image3}
                          alt="Image 3"
                          style={{
                            width: '100%',
                            height: '150px', // Fixed height for all images
                            objectFit: 'cover', // Ensures aspect ratio while cropping
                            borderRadius: '8px', // Optional rounded corners
                          }}
                        />
                      )}
                    </MDBCarousel>

                    <MDBBadge
                      color={statusToggles[project.Id] ? 'success' : 'danger'}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1,
                      }}
                    >
                      {statusToggles[project.Id] ? 'Active' : 'Pause'}
                    </MDBBadge>
                  </MDBRipple>
                  <MDBCardBody>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 style={{ color: 'var(--text-color)', textAlign: 'left' }}>
                        {project.Title}
                      </h5>

                      <div
                        className="customSwitch"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={statusToggles[project.Id]}
                          onChange={() => handleToggle(project.Id)}
                          style={{
                            height: '18px',
                            width: '18px',
                            appearance: 'none',
                            borderRadius: '30px',
                            backgroundColor: statusToggles[project.Id] ? 'var(--primary-btn-color)' : '#ccc',
                            position: 'relative',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                            outline: 'none',
                            transition: 'background-color 0.2s',
                            marginTop: '-5px',
                          }}
                        />
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-color)', textAlign: 'left' }}>
                      {isExpanded ? project.Description : `${project.Description.slice(0, 100)}...`}
                    </p>
                    <button
                      className="btn btn-link"
                      onClick={() => handleExpandCard(project.Id)}
                      style={{ padding: 0, textDecoration: 'none', color: 'var(--primary-btn-color)' }}
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            );
          })}
        </MDBRow>
      )}
      <MDBModal show={optSmModal} setShow={setOptSmModal} tabIndex="-1">
  <MDBModalDialog size="xl" centered>
    <MDBModalContent>
      <MDBModalHeader>
        <MDBModalTitle>Add Portfolio</MDBModalTitle>
        <MDBBtn className="btn-close" color="none" onClick={toggleOpen}></MDBBtn>
      </MDBModalHeader>
      <MDBModalBody>
        <form  onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="container">
            <div className="row">
                <div className="mt-2">
                <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Project Name"
                        className="custom-input block w-full"
                        value={modalProfile.name}
                        onChange={(e) => setModalProfile({ ...modalProfile, name: e.target.value })}
                      />
                </div>
              <div className="mt-3">
              <textarea
                        id="description"
                        name="description"
                        rows="6"
                        required
                        placeholder="Enter Description"
                        className="custom-input block w-full"
                        value={modalProfile.description}
                        onChange={(e) => setModalProfile({ ...modalProfile, description: e.target.value })}
                      />
              </div>

              <div className="mt-2">
                <div style={{ position: "relative", display: "inline-block", width: "100%", marginTop: '8px' }}>
                  <input
                    type="file"
                    id="additionalScreenshot"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onChange={handleFileChange(setAdditionalScreenshot)}
                    required
                  />
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#f9f9f9",
                      color: "gray",
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => document.getElementById("additionalScreenshot").click()}
                  >
                    <i className="fas fa-upload" style={{ marginRight: "8px" }}></i>
                    {additionalScreenshot ? additionalScreenshot.name : "Featured Image"}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div style={{ position: "relative", display: "inline-block", width: "100%", marginTop: '8px' }}>
                  <input
                    type="file"
                    id="additionalScreenshot1"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onChange={handleFileChange(setAdditionalScreenshot1)}
                    required
                  />
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#f9f9f9",
                      color: "gray",
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => document.getElementById("additionalScreenshot1").click()}
                  >
                    <i className="fas fa-upload" style={{ marginRight: "8px" }}></i>
                    {additionalScreenshot1 ? additionalScreenshot1.name : "Upload Image 1"}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div style={{ position: "relative", display: "inline-block", width: "100%", marginTop: '8px' }}>
                  <input
                    type="file"
                    id="additionalScreenshot2"
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer",
                    }}
                    onChange={handleFileChange(setAdditionalScreenshot2)}
                    required
                  />
                  <button
                    type="button"
                    style={{
                      backgroundColor: "#f9f9f9",
                      color: "gray",
                      width: "100%",
                      padding: "10px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => document.getElementById("additionalScreenshot2").click()}
                  >
                    <i className="fas fa-upload" style={{ marginRight: "8px" }}></i>
                    {additionalScreenshot2 ? additionalScreenshot2.name : "Upload Image 2"}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center">
                    <button
                      type="submit"
                      className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Spinner /> : 'Add Portfolio'}
                    </button>
                  </div>
          </div>
        </form>
      </MDBModalBody>
    </MDBModalContent>
  </MDBModalDialog>
</MDBModal>
    </div>
  );
}
