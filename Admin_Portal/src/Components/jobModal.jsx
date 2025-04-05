import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { Phone, Globe, Users, MapPin, Mail, Info, ImageIcon,Star,Calendar,DollarSign,FileText,Tag,Layers  } from 'lucide-react'; // Import relevant icons
import Sidebar from './sidebar';
import Cookies from 'js-cookie';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner
} from "mdb-react-ui-kit";

export default function JobPage() {
  const [activeTab, setActiveTab] = useState('tab1'); // State to track the active tab
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the active tab when clicked
  };

  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  useEffect(() => {
    setShow(true);
    if (Cookies.get('mode') === 'light') {
      document.body.className = 'light-mode';
    } else {
      document.body.className = 'dark-mode';
    }

  }, []);
  const jobData = {
    title: "Web Development Project",
    timeline: "2 weeks",
    budget: 500,
    description: "Develop a responsive website with a modern design and optimized performance.",
    status: "Active",
    category: "Development",
    subCategory: "Web Development",
  };
  const generateRandomReviews = () => {
    const mockReviews = [
      {
        clientName: "John Doe",
        comment: "Great work, very professional! Highly recommend.",
        date: "2025-01-15",
      },
      {
        clientName: "Jane Smith",
        comment: "Fantastic job! Delivered on time and exceeded expectations.",
        date: "2025-01-20",
      },
      {
        clientName: "Michael Johnson",
        comment: "Very responsive and skilled. Would work with again!",
        date: "2025-01-18",
      },
      {
        clientName: "Emily Davis",
        comment: "A pleasure to work with! Delivered exactly what was promised.",
        date: "2025-01-10",
      },
      {
        clientName: "Chris Lee",
        comment: "Great experience overall. Professional and reliable.",
        date: "2025-01-12",
      },
    ];
    setReviews(mockReviews);
  };


  const handleOpenModal = () => {
    generateRandomReviews();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="siderow" >
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2" style={{ marginTop: "40px" }} >
      <div className={`welcome-animation ${show ? "show" : ""}`}>

          <div className='container'>
            <div className="py-4  flex items-center justify-center">
              <div className=" w-full mx-auto overflow-hidden ">
                <div className="row">
                  {/* Left side - 4 parts */}
                  <div className="col-12 col-md-4 p-5" id="card">
    <div className="w-full flex justify-center mb-6">
    <img
      src={`./Assets/logo.png`}
      alt="Job Logo"
      className="w-16 h-16 md:w-20 md:h-20 rounded-full"
    />
  </div>

  <div className="text-center mb-6">
    <h2 className="text-lg md:text-xl font-bold">{jobData.title}</h2>
    <p className="text-sm">{jobData.category} - {jobData.subCategory}</p>
  </div>

  <div className="space-y-4">
    <h3 className="font-semibold mb-4">Job Details</h3>
    <div className="flex items-center space-x-3">
      <Calendar size={18} />
      <span className="text-sm md:text-base">{jobData.timeline}</span>
    </div>
    <div className="flex items-center space-x-3">
      <DollarSign size={18} />
      <span className="text-sm md:text-base">${jobData.budget}</span>
    </div>
    <div className="flex items-center space-x-3">
      <FileText size={18} />
      <span className="text-sm md:text-base text-justify">{jobData.description}</span>
      </div>
    <div className="flex items-center space-x-3">
      <Tag size={18} />
      <span className="text-sm md:text-base">{jobData.status}</span>
    </div>

    {/* <h3 className="font-semibold mt-6 mb-4">Category Information</h3>
    <div className="flex items-center space-x-3">
      <Layers size={18} />
      <span className="text-sm md:text-base">
        {jobData.category} - {jobData.subCategory}
      </span>
    </div>

    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
      <Calendar size={18} />
      <Link to="#" onClick={handleOpenModal}>
        <span className="text-sm md:text-base">View More Details</span>
      </Link>
    </div> */}
  </div>
</div>



                  {/* Divider */}
                  {/* <div className="hidden md:block w-px  mx-4"></div> */}

                  {/* Right side - 8 parts */}
                  <div className="col-12 col-md-8  flex">
                    <div style={{ width: '20px', background: 'transparent' }}></div>
                    {/* Tabs */}
                    <div id='card' style={{ width: '100%' }}>
                      <div className="mb-4" id="tablehead" style={{ padding: "10px", color: "#313a50" }}>
                        <ul className="flex"  >
                          <li className={`mr-1 ${activeTab === 'tab1' ? 'border-b-2 border-blue-500' : ''}`}>
                            <button
                              onClick={() => handleTabClick('tab1')}
                              className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                              Bids
                            </button>
                          </li>
                          <li className={`mr-1 ${activeTab === 'tab2' ? 'border-b-2 border-blue-500' : ''}`}>
                            <button
                              onClick={() => handleTabClick('tab2')}
                              className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                              Assigned 
                            </button>
                          </li>
                        </ul>
                      </div>

                      {/* Table based on active tab */}
                      {activeTab === 'tab1' && (
  <div className="overflow-x-auto -mx-4 md:mx-0">
    <div className="inline-block min-w-full align-middle">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="uppercase" id="tablehead" style={{ padding: "10px", color: "#313a50" }}>
          <tr className="border-b">
            <th scope="col" className="px-6 py-3">SR</th>
            <th scope="col" className="px-6 py-3">User</th>
            <th scope="col" className="px-6 py-3">Job ID</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">Duration</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Details</th>
          </tr>
        </thead>
        <tbody id="tablebody">
          {/* Sample Data */}
          <tr className="border-b">
            <td className="px-6 py-4">1</td>
            <td className="px-6 py-4">John Doe</td>
            <td className="px-6 py-4">12345</td>
            <td className="px-6 py-4">$500</td>
            <td className="px-6 py-4">3 months</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </td>
            <td className="px-6 py-4">
              <i className="fa fa-eye" style={{ color: "blue", cursor: "pointer" }}></i>
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-6 py-4">2</td>
            <td className="px-6 py-4">Jane Smith</td>
            <td className="px-6 py-4">54321</td>
            <td className="px-6 py-4">$800</td>
            <td className="px-6 py-4">6 months</td>
            <td className="px-6 py-4">
              <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Pending
              </span>
            </td>
            <td className="px-6 py-4">
              <i className="fa fa-eye" style={{ color: "blue", cursor: "pointer" }}></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
)}

{activeTab === 'tab2' && (
  <div className="container py-5">
    <div className="row gy-5">
      {/* Left Section: Assignee Details */}
      <div className="col-md-6">
        <div className="p-4  text-center">
          <img
            src="./Assets/logo.png"
            alt="Assignee"
            className="rounded-circle border border-primary mb-3"
            style={{ width: "120px", height: "120px" }}
          />
          <h5 className="fw-bold mb-1">John Doe</h5>
          <p className="text-muted mb-2">Assigned to this project</p>
          <p className="text-muted small mb-4">
            Brief details about the assignee or job responsibilities.
          </p>
          <button
            className="btn btn-primary btn-sm"
            title="View Assignee"
          >
            <i className="fa fa-eye me-2"></i>View Profile
          </button>
        </div>
      </div>

      {/* Right Section: Timeline and Details */}
      <div className="col-md-6">
        {/* Project Timeline */}
        <div className="p-4  mb-4">
          <h6 className="fw-bold mb-4">Project Timeline</h6>
          <div
            className="timeline position-relative"
            style={{
              paddingLeft: "30px",
              borderLeft: "4px solid #007bff",
            }}
          >
            {/* Step 1 */}
            <div className="mb-4 position-relative">
              <div
                className="timeline-dot"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "-12px",
                  width: "20px",
                  height: "20px",
                  background: "#007bff",
                  borderRadius: "50%",
                }}
              ></div>
              <h6 className="fw-bold">Step 1</h6>
              <p className="text-muted small">Initial phase of the project</p>
            </div>

            {/* Step 2 */}
            <div className="mb-4 position-relative">
              <div
                className="timeline-dot"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "-12px",
                  width: "20px",
                  height: "20px",
                  background: "#007bff",
                  borderRadius: "50%",
                }}
              ></div>
              <h6 className="fw-bold">Step 2</h6>
              <p className="text-muted small">Development phase</p>
            </div>

            {/* Step 3 */}
            <div className="position-relative">
              <div
                className="timeline-dot"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "-12px",
                  width: "20px",
                  height: "20px",
                  background: "#007bff",
                  borderRadius: "50%",
                }}
              ></div>
              <h6 className="fw-bold">Step 3</h6>
              <p className="text-muted small">Testing and delivery</p>
            </div>
          </div>
        </div>

        {/* Cover Letter and Bid */}
        <div className="p-4 ">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted">Cover Letter</span>
            <i
              className="fa fa-download text-primary"
              title="Download Cover Letter"
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Bid</span>
            <span className="fw-bold text-primary">$22</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    
  );
}
