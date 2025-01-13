import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaBars, FaTimes } from "react-icons/fa";
import React from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
export default function Buyernavbar() {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIsMobile();
    const intervalId = setInterval(checkIsMobile, 1);
    return () => clearInterval(intervalId);
  }, []);

  const handleToggle = () => {
    setExpanded(!expanded);
    console.log(expanded);
  };

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  // Handle Logout Modal Actions
  const handleCancelLogout = () => setShowLogoutModal(false);

  const handleConfirmLogout = () => {
    // Remove user ID from cookies
    Cookies.remove("userId");

    // Navigate to sign-in page
    history.push("/signin");
  };

  const handleNavMouseEnter = (e) => {
    e.target.style.color = "#4f46e5";
  };

  const handleNavMouseLeave = (e) => {
    e.target.style.color = "#000";
  };

  return (
    <div style={{ marginBottom: "110px" }}>
      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
          padding: "0.1rem 0",
          height: "5rem",
          top: "0",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container style={{ backgroundColor: "#fff" }}>
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={() => setExpanded(false)}
            style={{ margin: "0px 10px" }}
          >
            <img
              src={"../assets/logo.png"}
              alt=""
              style={{
                width: "80px",
                height: "50px",
                margin: "auto",
                marginRight: "auto",
              }}
            />
          </Navbar.Brand>

          {isMobile && (
            <div
              className="custom-dropdown"
              style={{ marginLeft: "auto", marginRight: "30px" }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  visibility: "visible",
                }}
                onClick={toggleSidebar}
              >
                <img
                  src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt=""
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </button>
            </div>
          )}

          {isMobile && (
            <button
              aria-controls="navbarScroll"
              onClick={handleToggle}
              className={expanded ? "black-toggle" : ""}
              style={{
                margin: "0px 10px",

                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "24px",
                color: "#000",
              }}
            >
              {expanded ? <FaTimes /> : <FaBars />}
            </button>
          )}

          <Navbar.Collapse id="navbarScroll">
            <Nav className="ml-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link
                as={Link}
                to="/buyerpostJob"
                onClick={handleNavLinkClick}
                onMouseEnter={handleNavMouseEnter}
                onMouseLeave={handleNavMouseLeave}
                style={{
                  fontWeight: "500",
                  color: "#000",
                  fontSize: "16px",
                  visibility: "visible",
                }}
              >
                Post a Project
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/viewbuyerpostJob"
                onClick={handleNavLinkClick}
                onMouseEnter={handleNavMouseEnter}
                onMouseLeave={handleNavMouseLeave}
                style={{
                  fontWeight: "500",
                  color: "#000",
                  fontSize: "16px",
                  visibility: "visible",
                }}
              >
                All Job Posts
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/chat"
                style={{
                  fontWeight: "500",
                  color: "#000",
                  fontSize: "16px",
                  visibility: "visible",
                }}
              >
                Chat
              </Nav.Link>
            </Nav>

            <Nav
              className="ml-auto"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!isMobile && (
                <div className="custom-dropdown">
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      visibility: "visible",
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt=""
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  </button>
                  <div
                    className="dropdown-menu"
                    style={{ visibility: "visible" }}
                  >
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      style={{ visibility: "visible" }}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="dropdown-item"
                      style={{ visibility: "visible" }}
                    >
                      Settings
                    </Link>
                    <Link
                      to="#"
                      className="dropdown-item"
                      onClick={() => setShowLogoutModal(true)}
                    >
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>

        {sidebarVisible && isMobile && (
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "250px",
              height: "100%",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              zIndex: 1050,
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              transform: sidebarVisible ? "translateX(0)" : "translateX(100%)",
              transition:
                "transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
            }}
          >
            <button
              onClick={toggleSidebar}
              style={{
                alignSelf: "flex-end",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#d65757",
                transition: "color 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ff4a4a")}
              onMouseLeave={(e) => (e.target.style.color = "#d65757")}
            >
              <FaTimes />
            </button>

            <Link
              to="/profile"
              style={{
                margin: "20px 0",
                color: "#000",
                fontSize: "18px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s ease",
              }}
              onClick={toggleSidebar}
              onMouseEnter={(e) => (e.target.style.color = "#d65757")}
              onMouseLeave={(e) => (e.target.style.color = "#000")}
            >
              Profile
            </Link>

            <Link
              to="/settings"
              style={{
                margin: "20px 0",
                color: "#000",
                fontSize: "18px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s ease",
              }}
              onClick={toggleSidebar}
              onMouseEnter={(e) => (e.target.style.color = "#d65757")}
              onMouseLeave={(e) => (e.target.style.color = "#000")}
            >
              Settings
            </Link>

            <Link
              style={{
                margin: "20px 0",
                color: "#000",
                fontSize: "18px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "color 0.2s ease",
              }}
              onClick={() => {
                toggleSidebar();
                setShowLogoutModal(true); // Trigger the logout modal
              }}
              onMouseEnter={(e) => (e.target.style.color = "#d65757")}
              onMouseLeave={(e) => (e.target.style.color = "#000")}
            >
              Logout
            </Link>
          </div>
        )}
      </Navbar>
      {/* Logout Modal */}
      <Modal
        show={showLogoutModal}
        onHide={handleCancelLogout}
        centered
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 2000,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <button
            style={{ width: "55px" }}
            className="flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleCancelLogout}
          >
            No
          </button>
          <button
            style={{ width: "55px" }}
            className="flex  justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleConfirmLogout}
          >
            Yes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
