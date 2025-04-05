import React, { useEffect, useState } from "react";
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
  MDBSpinner
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import { saveLogs } from './logs';

export default function ResolutionCenter() {
  const [show, setShow] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [data, setData] = useState([]);
  const [basicModal, setBasicModal] = useState(false);

  // Modal form data
  const [caseId, setCaseId] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [resolution, setResolution] = useState("");

  const toggleShow = () => setBasicModal(!basicModal);

  useEffect(() => {
    setShow(true);
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
    generateRandomCases();
  }, []);

  // Generate random resolution cases
  const generateRandomCases = () => {
    const randomCases = [
      {
        email: "john.doe@example.com",
        title: "Access Denied Issue",
        description: "Unable to access project files in my account.",
        status: Math.random() > 0.5 ? "Resolved" : "Pending",
        createdOn: new Date(),
        caseId: "1"
      },
      {
        email: "jane.smith@example.com",
        title: "Payment Reversal Request",
        description: "A double charge was made on my account. Please assist.",
        status: Math.random() > 0.5 ? "Resolved" : "Pending",
        createdOn: new Date(),
        caseId: "2"
      },
      {
        email: "sam.wilson@example.com",
        title: "Dispute on Service Quality",
        description: "The service provided by the freelancer was subpar.",
        status: Math.random() > 0.5 ? "Resolved" : "Pending",
        createdOn: new Date(),
        caseId: "3"
      },
      {
        email: "alice.johnson@example.com",
        title: "Account Review Request",
        description: "My account was deactivated without notice. Please review.",
        status: Math.random() > 0.5 ? "Resolved" : "Pending",
        createdOn: new Date(),
        caseId: "4"
      }
    ];

    setData(randomCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const resolutionData = {
      caseId: caseId,
      title: caseTitle,
      resolution: resolution,
      email: customerEmail,
    };

    try {
      console.log("Submitting resolution:", resolutionData);

      // Reset fields
      setCustomerEmail("");
      setCaseTitle("");
      setResolution("");
      setCaseId("");
      setSubmit(false);
      setBasicModal(false);
    } catch (error) {
      console.error("Error:", error.message);
      setSubmit(false);
      saveLogs(error.message, "/resolutioncenter", "Admin");
    }
  };

  return (
    <div className="siderow">
      <div className="sidecol1">
        <Sidebar />
      </div>
      <div className="sidecol2">
        <div className={`welcome-animation ${show ? "show" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1
              className="dashboard"
              style={{
                textAlign: "left",
                paddingTop: "40px",
                fontWeight: "bolder",
              }}
            >
              Resolution Center
            </h1>
          </div>

          <div
            className="relative overflow-x-auto shadow-md sm:rounded-lg"
            style={{ borderRadius: 0, marginTop: "30px" }}
          >
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                className="uppercase"
                id="tablehead"
                style={{ padding: "10px", color: "#313a50" }}
              >
                <tr>
                  <th scope="col" className="px-6 py-3">#</th>
                  <th scope="col" className="px-6 py-3">Customer Email</th>
                  <th scope="col" className="px-6 py-3">Case Title</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Created On</th>
                  <th scope="col" className="px-6 py-3">Resolve</th>
                </tr>
              </thead>
              <tbody id="tablebody">
                {data.map((item, index) => (
                  <tr className="border-b" key={item.caseId}>
                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">{item.email}</td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4">{item.status}</td>
                    <td className="px-6 py-4">{new Date(item.createdOn).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => {
                          setBasicModal(true);
                          setCustomerEmail(item.email);
                          setCaseTitle(`Resolution for: ${item.title}`);
                          setCaseId(item.caseId);
                        }}
                      >
                        <i className="fa fa-check-circle" style={{ color: "white" }}></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
        <MDBModalDialog style={{ borderRadius: 0 }}>
          <MDBModalContent id="card">
            <MDBModalHeader>
              <MDBModalTitle>Submit Resolution</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <form onSubmit={handleSubmit} encType="multipart/form-data" id="resolutionForm">
              <MDBModalBody>
                <Form.Group className="mb-3">
                  <p style={{ marginBottom: "0px", textAlign: "left" }}>
                    Resolution Details
                  </p>
                  <Form.Control
                    as="textarea"
                    placeholder="Write resolution details"
                    rows={3}
                    size="lg"
                    id="card"
                    name="resolution"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    required
                    style={{ borderRadius: 0, color: "black", flex: 1 }}
                  />
                </Form.Group>
              </MDBModalBody>

              <MDBModalFooter>
                <MDBBtn
                  type="submit"
                  className="btnsc"
                  style={{ borderRadius: 0 }}
                >
                  {submit ? (
                    <MDBSpinner color="info" />
                  ) : (
                    <span>Submit</span>
                  )}
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
}
