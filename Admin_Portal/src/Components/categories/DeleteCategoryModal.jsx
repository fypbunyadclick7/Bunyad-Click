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

const DeleteCategoryModal = ({ show, toggleShow, Id, fetchCategories }) => {
  const [submit, setSubmit] = useState(false);
  const [id, setId] = useState(Id);
  useEffect(() => {
    setId(Id);
  }, [Id]);

  return (
    <MDBModal show={show} setShow={() => {}} tabIndex="-1">
      <MDBModalDialog centered>
        <MDBModalContent className="p-2" id="card">
          {/* Modal Header */}
          <MDBModalHeader className="border-0">
            <MDBModalTitle>Delete Category</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => {
                toggleShow(!show);
              }}
            ></MDBBtn>
          </MDBModalHeader>

          <MDBModalBody>
            <Form>
              <p style={{ textAlign: "left" }}>
                Are you sure you want to delete this category?
              </p>
            </Form>
          </MDBModalBody>

          {/* Modal Footer */}
          <MDBModalFooter>
            <MDBBtn type="submit" className="btnsc" style={{ borderRadius: 0 }}>
              {submit ? <MDBSpinner color="warning" /> : <span>Delete</span>}
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default DeleteCategoryModal;
