import React, { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBSpinner,
} from "mdb-react-ui-kit";
import Form from "react-bootstrap/Form";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

function Login() {
  const [submit, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (Cookies.get("mode") === "light") {
      document.body.className = "light-mode";
    } else {
      document.body.className = "dark-mode";
    }
  }, []);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmit(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.REACT_APP_BACKEND_API_KEY,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save user data in cookies
        Cookies.set("token", data.token, { expires: 2 });
        Cookies.set("email", data.user.email, { expires: 2 });
        Cookies.set("username", data.user.name, { expires: 2 });
        Cookies.set("role", data.user.role, { expires: 2 });

        toast.success("Login successful!");
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error(data.message || "Invalid login credentials");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <div className="login-container">
        <MDBContainer fluid>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol col="12">
              <MDBCard
                className="my-5 mx-auto"
                id="card"
                style={{ borderRadius: 0, maxWidth: "400px" }}
              >
                <MDBCardBody className="p-5 w-100 d-flex flex-column">
                  <form onSubmit={handleLogin}>
                    <center>
                      <img
                        src="./Assets/logo.png"
                        alt="Logo"
                        style={{
                          width: "180px",
                          borderRadius: "50%",
                          height: "180px",
                        }}
                      />
                    </center>
                    <h4 style={{ marginTop: "10px", marginBottom: "30px" }}>
                      Login
                    </h4>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        size="lg"
                        value={email}
                        onChange={handleEmail}
                        required
                        style={{ borderRadius: 0 }}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        size="lg"
                        value={password}
                        onChange={handlePassword}
                        required
                        style={{ borderRadius: 0 }}
                      />
                    </Form.Group>
                    <MDBBtn
                      type="submit"
                      size="lg"
                      style={{
                        borderRadius: 0,
                        width: "100%",
                      }}
                      className="btnsc"
                    >
                      {submit ? <MDBSpinner color="info" /> : "Login"}
                    </MDBBtn>
                  </form>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} BunyadClick. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
