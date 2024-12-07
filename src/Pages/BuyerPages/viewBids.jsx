import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import BuyerNavbar from "../../Components/buyernavbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Spinner from "../../Components/spinner";
import moment from "moment-timezone";

export default function ViewBids() {
  const [bids, setBids] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [infoModal, setInfoModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { jobId } = useParams();
  const userId = Cookies.get("userId");
  const [loading1, setLoading1] = useState(false);

  const startConversation = async (receiverId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/chat/startConversation`,
        {
          participants: [userId, receiverId.toString()],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      window.location.href = "/chat";
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast.error("Unable to start conversation.");
    }
  };

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading1(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/job/getJob/${jobId}?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        console.log("API Response:", response.data); // Log the response
        setJobDetails(response.data.job);
        setBids(response.data.job.Bids || []);
        setLoading1(false);
      } catch (error) {
        console.error("Error fetching bids:", error);
        toast.error("Failed to fetch bids. Please try again.");
      }
    };

    fetchBids();
  }, [jobId, userId]);

  const filteredBids = bids.filter(
    (bid) =>
      bid.User?.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.CoverLetter?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getTimeByCountry = (country, city) => {
    const timezone = moment.tz.guess(); // or use a known timezone for the country and city
    return moment.tz(timezone).format("h:mm A");
  };

  const openInfoModal = async (bid) => {
    setSelectedBid(bid); // Store the selected bid details
    setInfoModal(true); // Open the modal
    setLoading(true); // Set loading to true while fetching details

    try {
      setLoading1(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/job/getSellerJob/${bid.JobId}?userId=${bid.UserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,
          },
        }
      );

      // Update the state with fetched job details
      setJobDetails(response.data.job);
      setLoading1(false);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to fetch job details. Please try again.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const closeInfoModal = () => {
    setSelectedBid(null);
    setInfoModal(false);
  };
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
      <BuyerNavbar />
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Bids for {jobDetails?.Title || "Job"}</h1>
        </div>

        <div
          style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
        >
          <input
            id="search"
            name="search"
            type="text"
            required
            className="custom-input block w-full"
            placeholder="Search bids"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 40px",
              borderRadius: "25px",
              outline: "none",
            }}
          />
        </div>

        {loading1 ? (
          // Show spinner while loading
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <MDBSpinner grow size="lg" color="primary">
              <span className="visually-hidden">Loading...</span>
            </MDBSpinner>
          </div>
        ) : (
          <MDBTable hover>
            <MDBTableHead>
              <tr>
                <th>User</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <tr key={bid.Id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={bid.User.Image}
                          alt={bid.User.Name}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        <span>{bid.User.Name}</span>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <span>${bid.Price}</span>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <span>{calculateDuration(bid.Duration)}</span>
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "10px",
                        }}
                      >
                        <button onClick={() => openInfoModal(bid)}>
                          <i
                            className="fa fa-circle-info"
                            style={{
                              cursor: "pointer",
                              fontSize: "20px",
                              color: "var(--primary-btn-color)",
                              paddingBottom: "5px",
                              marginLeft: "10px",
                            }}
                          ></i>
                        </button>

                        <button onClick={() => startConversation(bid.UserId)}>
                          <i
                            className="fa fa-message"
                            style={{
                              cursor: "pointer",
                              fontSize: "20px",
                              color: "var(--primary-btn-color)",
                              paddingBottom: "5px",
                              marginLeft: "10px",
                            }}
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No bids found.
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        )}
      </div>

      <MDBModal show={infoModal} setShow={setInfoModal} tabIndex="-1">
        <MDBModalDialog size="xl" className="modal-right-sidebar" centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn
                className=""
                color="none"
                onClick={closeInfoModal}
                style={{ fontSize: "20px" }}
              >
                <MDBIcon
                  fas
                  icon="arrow-left"
                  style={{
                    background: "transparent",
                    color: "var(--avatar-bg-color)",
                  }}
                />
              </MDBBtn>
            </MDBModalHeader>
            {loading1 ? (
              // Show spinner while loading
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <MDBSpinner grow size="lg" color="primary">
                  <span className="visually-hidden">Loading...</span>
                </MDBSpinner>
              </div>
            ) : (
              <MDBModalBody className="overflow-auto">
                {loading ? (
                  <Spinner /> // Show spinner while loading data
                ) : jobDetails ? (
                  <div className="container">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="d-flex justify-content-between align-items-left mt-0 w-full">
                          <div className="d-flex align-items-left">
                            <h4
                              style={{
                                marginRight: "10px",
                                marginBottom: "20px",
                              }}
                            >
                              {jobDetails.Title}
                            </h4>
                          </div>
                        </div>

                        <div
                          className="job-details mb-4"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              color: "var(--secondary-text-color)",
                              fontSize: "12px",
                              marginTop: "-2px",
                            }}
                          >
                            <span>
                              Estimated Time:{" "}
                              <strong>
                                {(jobDetails.Timeline / 30.44).toFixed(1)}{" "}
                                months,{" "}
                              </strong>
                            </span>
                            <span style={{ paddingLeft: "10px" }}>
                              Estimated Budget:{" "}
                              <strong>${jobDetails.Budget} </strong>
                            </span>
                          </div>
                        </div>
                        <hr />

                        <div
                          className="job-description"
                          style={{
                            width: "100%",
                            textAlign: "justify",
                            marginTop: "30px",
                          }}
                        >
                          <p
                            style={{
                              fontSize: "14px",
                              color: "var(--secondary-text-color)",
                              marginBottom: "30px",
                            }}
                          >
                            {jobDetails.Description}
                          </p>
                        </div>
                        <hr />
                        <h4 style={{ marginTop: "20px" }}>
                          Experties of Seller
                        </h4>
                        <div style={styles.skillsContainer}>
                          {jobDetails.Skills ? (
                            <div style={styles.skillsContainer}>
                              {jobDetails.Skills.map((skill) => (
                                <span
                                  style={styles.skillBadge}
                                  key={skill.Title}
                                >
                                  {skill.Title}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p>No skills listed</p>
                          )}
                        </div>
                      </div>

                      <div
                        className="borderBid col-md-4"
                        style={{ paddingLeft: "15px" }}
                      >
                        <p
                          style={{
                            fontWeight: "bold",
                            marginBottom: "5px",
                            marginTop: "5px",
                          }}
                        >
                          About the Seller
                        </p>
                        <p>
                          <div style={styles.starsContainer}>
                            {[...Array(5)].map((_, index) => (
                              <i className="fas fa-star" key={index}></i>
                            ))}
                            <span
                              style={{
                                paddingLeft: "10px",
                                color: "gray",
                                fontWeight: "bold",
                              }}
                            >
                              5.0
                            </span>
                          </div>
                          <span style={{ color: "gray" }}>
                            4.95 of 44 reviews
                          </span>
                        </p>
                        <p>
                          <span>
                            {jobDetails?.User?.Country || "Unknown Country"}
                          </span>{" "}
                          <br />
                          {jobDetails?.User?.City || "Unknown City"}{" "}
                          {getTimeByCountry(
                            jobDetails?.User?.Country,
                            jobDetails?.User?.City
                          )}
                        </p>
                        <p>
                          <span>55 Completed Projects</span> <br />
                          90% Acceptance rate
                        </p>
                        <p>
                          <span>$6.9K total earned</span> <br />5 active
                          projects
                        </p>
                        <p>
                          Member since{" "}
                          {jobDetails?.User?.CreatedAt
                            ? new Date(
                                jobDetails.User.CreatedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Unknown"}
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No details available</p>
                )}
              </MDBModalBody>
            )}
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}

const styles = {
  skillsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  skillBadge: {
    backgroundColor: "#e0e0e0",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    color: "#333",
  },
  detailsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  detail: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
    color: "#666",
  },
  starsContainer: {
    display: "flex",
    alignItems: "center",
    color: "var(--star-rating-color)",
    fontSize: "12px",
  },
  proposals: {
    fontSize: "12px",
    color: "var(--secondary-text-color)",
    marginTop: "-2px",
    marginBottom: "10px",
  },
};
