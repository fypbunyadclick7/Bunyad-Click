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
import toast, { Toaster } from "react-hot-toast"; // Ensure react-hot-toast is installed

const UpdateCategoryModal = ({
  show,
  toggleShow,
  Id,
  Name,
  fetchCategories,
}) => {
  const [submit, setSubmit] = useState(false);
  const [name, setName] = useState(Name);

  useEffect(() => {
    setName(Name);
  }, [Name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmit(true);

    axios
      .put(
        `${process.env.REACT_APP_BACKEND_API_URL}/job/admin/category/update/${Id}`,
        { Title: name },
        {
          headers: {
            "api-key": process.env.REACT_APP_BACKEND_API_KEY,
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          toast.success("Category updated successfully!", {
            duration: 2000, // Show for 2 seconds
            position: "top-right",
          });
          fetchCategories(); // Re-fetch categories after update
          setTimeout(() => {
            toggleShow(false); // Close modal after success
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error("Failed to update category", {
          duration: 2000, // Show for 2 seconds
          position: "top-right",
        });
        console.error("Error updating category:", error);
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
            <MDBModalTitle>Update Category</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => {
                toggleShow(false); // Close the modal
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
                {submit ? <MDBSpinner color="info" /> : <span>Update</span>}
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default UpdateCategoryModal;
