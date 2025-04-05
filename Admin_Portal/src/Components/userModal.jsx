import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import {
  Phone,
  Globe,
  Users,
  MapPin,
  Mail,
  Info,
  ImageIcon,
  Star,
  Calendar,
} from "lucide-react"; // Import relevant icons
import Sidebar from "./sidebar";
import Cookies from "js-cookie";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBSpinner,
} from "mdb-react-ui-kit";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("tab1"); // State to track the active tab
  const [userData, setUserData] = useState(null); // State to store user data
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
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }

    const fetchUserData = async () => {
      const status = Cookies.get("role");
      let url = "";
      if (status === "Seller") {
        url = `${
          process.env.REACT_APP_BACKEND_API_URL
        }/user/admin/getSellerProfile/${Cookies.get("id")}`;
      } else if (status === "Buyer") {
        url = `${
          process.env.REACT_APP_BACKEND_API_URL
        }/user/admin/getBuyerProfile/${Cookies.get("id")}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        });
        const data = await response.json();

        if (status === "Seller") {
          const sellerData = {
            name: data.Name,
            email: data.Email,
            phoneNumber: data.PhoneNumber,
            country: data.Country,
            state: data.State,
            city: data.City,
            role: "Seller",
            aboutMe: data.AboutMe,
            image: data.Image,
            completedJobs: data.Jobs?.CompletedJobs || [],
            assignedJobs: data.Jobs?.AssignedJobs || [],
            placedBids: data.Jobs?.PlacedBids || [],
          };
          setUserData(sellerData);
        } else if (status === "Buyer") {
          const buyerData = {
            name: data.Name,
            email: data.Email,
            phoneNumber: data.PhoneNumber,
            country: data.Country,
            state: data.State,
            city: data.City,
            role: "Buyer",
            aboutMe: data.AboutMe,
            image: data.Image,
            completedJobs: data.Jobs?.CompletedJobs || [],
            assignedJobs: data.Jobs?.AssignedJobs || [],
            activeJobs: data.Jobs?.ActiveJobs || [],
          };
          setUserData(buyerData);
        }

        // Dummy reviews
        const mockReviews = [
          {
            clientImage: "./Assets/logo.png",
            clientName: "John Doe",
            comment: "Great work, very professional! Highly recommend.",
            date: "2025-01-15",
            rating: 5,
          },
          {
            clientImage: "./Assets/client2.png",
            clientName: "Jane Smith",
            comment:
              "Fantastic job! Delivered on time and exceeded expectations.",
            date: "2025-01-20",
            rating: 4,
          },
          {
            clientImage: "./Assets/client3.png",
            clientName: "Michael Johnson",
            comment: "Very responsive and skilled. Would work with again!",
            date: "2025-01-18",
            rating: 4,
          },
        ];
        setReviews(mockReviews);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!userData) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2" style={{ marginTop: "40px" }}>
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <div className="container">
            <div className="py-4">
              <div className=" w-full mx-auto overflow-hidden ">
                <div className="row">
                  {/* Left side - 4 parts */}
                  <div className="col-12 col-md-4 p-5" id="card">
                    <div className="w-full flex justify-center mb-6">
                      <img
                        src={`./Assets/logo.png`}
                        alt="User Avatar"
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full"
                      />
                    </div>
                    <div className="rating-stars flex items-center justify-center mb-3">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          size={20}
                          fill={
                            index < Math.round(averageRating)
                              ? "#ffc107"
                              : "none"
                          }
                          stroke="#ffc107"
                        />
                      ))}
                    </div>

                    <div className="text-center mb-6">
                      <h2 className="text-lg md:text-xl font-bold">
                        {userData.name}
                      </h2>
                      <p className="text-sm">{userData.role}</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-4">
                        Contact Information
                      </h3>
                      <div className="flex items-center space-x-3">
                        <MapPin size={18} />
                        <span className="text-sm md:text-base">
                          {userData.city}, {userData.state}, {userData.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone size={18} />
                        <span className="text-sm md:text-base">
                          {userData.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe size={18} />
                        <span className="text-sm md:text-base">
                          {userData.email}
                        </span>
                      </div>
                      <h3 className="font-semibold mt-6 mb-4">
                        Additional Information
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Users size={18} />
                        <span className="text-sm md:text-base">
                          {userData.aboutMe}
                        </span>
                      </div>
                      {/* <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                        <Calendar size={18} />
                        <Link to="#" onClick={handleOpenModal}>
                          <span className="text-sm md:text-base">Reviews</span>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                  <MDBModal show={isModalOpen} setShow={setIsModalOpen}>
                    <MDBModalDialog>
                      <MDBModalContent>
                        <MDBModalHeader>
                          <MDBModalTitle>Client Reviews</MDBModalTitle>
                          <MDBBtn
                            color="none"
                            className="btn-close"
                            onClick={handleCloseModal}
                          ></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                          {reviews.map((review, index) => (
                            <div key={index} className="review-item my-3">
                              <div className="flex items-center">
                                <img
                                  src={review.clientImage}
                                  alt="Client"
                                  className="w-12 h-12 rounded-full mr-3"
                                />
                                <div>
                                  <h5 className="font-semibold">
                                    {review.clientName}
                                  </h5>
                                  <p className="text-sm text-gray-600">
                                    {review.date}
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-gray-800">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </MDBModalBody>
                      </MDBModalContent>
                    </MDBModalDialog>
                  </MDBModal>

                  {/* Divider */}
                  {/* <div className="hidden md:block w-px  mx-4"></div> */}

                  {/* Right side - 8 parts */}
                  <div className="col-12 col-md-8  flex">
                    <div
                      style={{ width: "20px", background: "transparent" }}
                    ></div>
                    {/* Tabs */}
                    <div id="card" style={{ width: "100%" }}>
                      <div
                        className="mb-4"
                        id="tablehead"
                        style={{ padding: "10px", color: "#313a50" }}
                      >
                        <ul className="flex">
                          <li
                            className={`mr-1 ${
                              activeTab === "tab1"
                                ? "border-b-2 border-blue-500"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() => handleTabClick("tab1")}
                              className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                              Completed Projects
                            </button>
                          </li>
                          <li
                            className={`mr-1 ${
                              activeTab === "tab2"
                                ? "border-b-2 border-blue-500"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() => handleTabClick("tab2")}
                              className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                              Assigned Projects
                            </button>
                          </li>
                          {Cookies.get("role") === "Seller" && (
                            <li
                              className={`mr-1 ${
                                activeTab === "tab3"
                                  ? "border-b-2 border-blue-500"
                                  : ""
                              }`}
                            >
                              <button
                                onClick={() => handleTabClick("tab3")}
                                className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                              >
                                Bids Placed
                              </button>
                            </li>
                          )}
                          {Cookies.get("role") === "Buyer" && (
                            <li
                              className={`mr-1 ${
                                activeTab === "tab4"
                                  ? "border-b-2 border-blue-500"
                                  : ""
                              }`}
                            >
                              <button
                                onClick={() => handleTabClick("tab4")}
                                className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800"
                              >
                                Active Projects
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Table based on active tab */}
                      {activeTab === "tab1" && (
                        <div
                          className="overflow-x-auto -mx-4 md:mx-0"
                          style={{ maxHeight: "80vh", overflowY: "auto" }}
                        >
                          <div className="inline-block min-w-full align-middle">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead
                                className="uppercase"
                                id="tablehead"
                                style={{ padding: "10px", color: "#313a50" }}
                              >
                                <tr className="border-b">
                                  <th scope="col" className="px-6 py-3">
                                    SR
                                  </th>
                                  {/* <th scope="col" className="px-6 py-3">
                                    Client Name
                                  </th> */}
                                  <th scope="col" className="px-6 py-3">
                                    Project Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Duration
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Price
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="tablebody">
                                {/* Table rows for Tab 1 */}
                                {userData.completedJobs.map((job, jobIndex) =>
                                  job.Bids.map((bid, bidIndex) => (
                                    <tr
                                      key={`${job.Id}-${bid.Id}`}
                                      className="border-b"
                                    >
                                      <td className="px-6 py-4">
                                        {jobIndex + 1}
                                      </td>
                                      {/* <td className="px-6 py-4">Client Name</td>{" "} */}
                                      <td className="px-6 py-4">{job.Title}</td>
                                      <td className="px-6 py-4">
                                        {bid.Duration} month(s)
                                      </td>
                                      <td className="px-6 py-4">
                                        ${bid.Price}
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                          {bid.Status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeTab === "tab2" && (
                        <div
                          className="overflow-x-auto -mx-4 md:mx-0"
                          style={{ maxHeight: "80vh", overflowY: "auto" }}
                        >
                          <div className="inline-block min-w-full align-middle">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead
                                className="uppercase"
                                id="tablehead"
                                style={{ padding: "10px", color: "#313a50" }}
                              >
                                <tr className="border-b">
                                  <th scope="col" className="px-6 py-3">
                                    SR
                                  </th>
                                  {/* <th scope="col" className="px-6 py-3">
                                    Client Name
                                  </th> */}
                                  <th scope="col" className="px-6 py-3">
                                    Project Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Duration
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Price
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="tablebody">
                                {userData.assignedJobs.map((job, jobIndex) =>
                                  job.Bids.map((bid, bidIndex) => (
                                    <tr
                                      key={`${job.Id}-${bid.Id}`}
                                      className="border-b"
                                    >
                                      <td className="px-6 py-4">
                                        {jobIndex + 1}
                                      </td>
                                      {/* <td className="px-6 py-4">Client Name</td>{" "} */}
                                      <td className="px-6 py-4">{job.Title}</td>
                                      <td className="px-6 py-4">
                                        {bid.Duration} month(s)
                                      </td>
                                      <td className="px-6 py-4">
                                        ${bid.Price}
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                          {bid.Status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeTab === "tab3" && (
                        <div
                          className="overflow-x-auto -mx-4 md:mx-0"
                          style={{ maxHeight: "80vh", overflowY: "auto" }}
                        >
                          <div className="inline-block min-w-full align-middle">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead
                                className="uppercase"
                                id="tablehead"
                                style={{ padding: "10px", color: "#313a50" }}
                              >
                                <tr className="border-b">
                                  <th scope="col" className="px-6 py-3">
                                    SR
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Project Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Duration
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Price
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="tablebody">
                                {userData.placedBids?.map((bid, index) => (
                                  <tr key={bid.Id} className="border-b">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4">
                                      {bid.Job?.Title || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                      {bid.Duration} month(s)
                                    </td>
                                    <td className="px-6 py-4">${bid.Price}</td>
                                    <td className="px-6 py-4">
                                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                        {bid.Status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {activeTab === "tab4" && (
                        <div
                          className="overflow-x-auto -mx-4 md:mx-0"
                          style={{ maxHeight: "80vh", overflowY: "auto" }}
                        >
                          <div className="inline-block min-w-full align-middle">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead
                                className="uppercase"
                                id="tablehead"
                                style={{ padding: "10px", color: "#313a50" }}
                              >
                                <tr className="border-b">
                                  <th scope="col" className="px-6 py-3">
                                    SR
                                  </th>
                                  {/* <th scope="col" className="px-6 py-3">
                                    Client Name
                                  </th> */}
                                  <th scope="col" className="px-6 py-3">
                                    Project Name
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Duration
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Price
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody id="tablebody">
                                {userData.activeJobs?.map((job, jobIndex) =>
                                  job.Bids.map((bid, bidIndex) => (
                                    <tr
                                      key={`${job.Id}-${bid.Id}`}
                                      className="border-b"
                                    >
                                      <td className="px-6 py-4">
                                        {jobIndex + 1}
                                      </td>
                                      {/* <td className="px-6 py-4">Client Name</td>{" "} */}
                                      <td className="px-6 py-4">{job.Title}</td>
                                      <td className="px-6 py-4">
                                        {bid.Duration} month(s)
                                      </td>
                                      <td className="px-6 py-4">
                                        ${bid.Price}
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                                          {bid.Status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div id="text">
                        {activeTab === "tab5" && (
                          <div className="h-full flex  px-6 py-8">
                            <div
                              className="w-full max-w-4xl  p-6 md:p-8"
                              id="text"
                            >
                              {/* Client Info */}
                              <div
                                className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8"
                                id="text"
                              >
                                <img
                                  src="./Assets/logo.png"
                                  alt="Client"
                                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                                />
                                <div
                                  className="text-center md:text-left"
                                  id="text"
                                >
                                  <h2 className="text-2xl font-semibold text-gray-800">
                                    John Doe
                                  </h2>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Brief details about the client or job
                                    description.
                                  </p>
                                </div>
                              </div>

                              {/* Project Info */}
                              <div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
                                id="text"
                              >
                                <div id="text">
                                  <span className="block text-sm text-gray-500">
                                    Price
                                  </span>
                                  <span className="block text-lg font-semibold text-gray-800">
                                    $22
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-sm text-gray-500">
                                    Duration
                                  </span>
                                  <span className="block text-lg font-semibold text-gray-800">
                                    10 days
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-sm text-gray-500">
                                    Cover Letter
                                  </span>
                                  <span className="block text-lg font-semibold text-gray-800">
                                    Attached
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div
                                className="flex justify-end gap-4 mt-8"
                                id="text"
                              >
                                <button className="flex justify-center items-center w-12 h-12 text-blue-500 ">
                                  <i
                                    className="fa fa-download text-lg"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                                <button className="flex justify-center items-center w-12 h-12  text-blue-500">
                                  <i
                                    className="fa fa-eye text-lg"
                                    aria-hidden="true"
                                  ></i>
                                </button>
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
    </div>
  );
}
