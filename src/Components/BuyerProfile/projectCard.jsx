import React from 'react'
import {
  MDBCard,
  MDBCardBody,
  MDBRipple,
  MDBCardImage

} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


export default function projectCard() {
  return (
    <div>
      <div className='row'>


        <div className='col-md-4'>
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://parametric-architecture.com/wp-content/uploads/2023/03/Contour-Crafting.jpg"
                fluid
                className="w-100"
              />

              <div className="hover-overlay">
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                ></div>
              </div>

            </MDBRipple>
            <MDBCardBody>
              <p style={{ color: 'gray', textAlign: 'justify' }}>Cost Estimation of House at Lahore</p>
              <h6 style={{ color: 'black', fontWeight: 'bold', justifyContent: 'right', textAlign: 'right' }} className="mb-0"><span style={{ color: 'gray', fontWeight: 'normal' }}>Starting At  </span>$61.99</h6>
            </MDBCardBody>
          </MDBCard>
        </div>

        <div className='col-md-4'>
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://www.3dnatives.com/en/wp-content/uploads/sites/2/2021/05/4.jpg"
                fluid
                className="w-100"
              />

              <div className="hover-overlay">
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                ></div>
              </div>

            </MDBRipple>
            <MDBCardBody>
              <p style={{ color: 'gray', textAlign: 'justify' }}>Cost Estimation of House at Lahore</p>
              <h6 style={{ color: 'black', fontWeight: 'bold', justifyContent: 'right', textAlign: 'right' }} className="mb-0"><span style={{ color: 'gray', fontWeight: 'normal' }}>Starting At  </span>$61.99</h6>
            </MDBCardBody>
          </MDBCard>
        </div>

        <div className='col-md-4'>
          <MDBCard>
            <MDBRipple
              rippleColor="light"
              rippleTag="div"
              className="bg-image rounded hover-zoom"
            >
              <MDBCardImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPXpZdPMnGZy9CDXyGS1ShLyo_MYnod92oNg&s"
                fluid
                className="w-100"
              />

              <div className="hover-overlay">
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                ></div>
              </div>

            </MDBRipple>
            <MDBCardBody>
              <p style={{ color: 'gray', textAlign: 'justify' }}>Cost Estimation of House at Lahore</p>
              <h6 style={{ color: 'black', fontWeight: 'bold', justifyContent: 'right', textAlign: 'right' }} className="mb-0"><span style={{ color: 'gray', fontWeight: 'normal' }}>Starting At  </span>$61.99</h6>
            </MDBCardBody>
          </MDBCard>
        </div>

      </div>


    </div>
  )
}
