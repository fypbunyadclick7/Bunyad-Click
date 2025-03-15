import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddCategoryModal = ({ show, toggleShow, Name, fetchCategories }) => {
  const [submit, setSubmit] = useState(false);
  const [name, setName] = useState(Name);

  useEffect(() => {
    setName(Name);
  }, [Name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmit(true);

    axios
      .post(
        `${process.env.REACT_APP_BACKEND_API_URL}/job/admin/category/add`,
        { Title: name },
        {
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Category added successfully!", {
            duration: 2000, // Show for 2 seconds
            position: "top-right",
          }); // Show success toast
          fetchCategories(); // Re-fetch categories after adding
          setName(""); // Clear the input field
          setTimeout(() => {
            toggleShow(false); // Close modal after success
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error("Failed to add category", {
          duration: 2000, // Show for 2 seconds
          position: "top-right",
        }); // Show error toast
        console.error("Error adding category:", error);
      })
      .finally(() => {
        setSubmit(false); // Stop the spinner after request completes
      });
  };

  return (
    <MDBModal show={show} setShow={() => {}} tabIndex="-1">
      <Toaster position="top-right" />
      <MDBModalDialog centered>
        <MDBModalContent className="p-2" id="card">
          {/* Modal Header */}
          <MDBModalHeader className="border-0">
            <MDBModalTitle>Add Category</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => {
                toggleShow(false);
              }}
            ></MDBBtn>
          </MDBModalHeader>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <MDBModalBody>
              <Form.Group className="mb-3">
                <p className="mb-1 text-left">Name</p>
                <Form.Control
                  type="text"
                  placeholder="Edenrobe"
                  size="lg"
                  name="name"
                  id="card"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  style={{ borderRadius: "6px", color: "black" }}
                />
              </Form.Group>
            </MDBModalBody>

            {/* Modal Footer */}
            <MDBModalFooter>
              <MDBBtn
                type="submit"
                className="btnsc"
                style={{ borderRadius: 0 }}
              >
                {submit ? <MDBSpinner color="info" /> : <span>Add</span>}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default AddCategoryModal;
