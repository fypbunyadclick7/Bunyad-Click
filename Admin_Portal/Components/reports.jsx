import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import jsPDF from "jspdf";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import "jspdf-autotable";
import Cookies from "js-cookie";

export default function Reports() {
  const [pdfUrl, setpdfUrl] = useState("./assets/report");
  const [selectedItem, setSelectedItem] = useState("Select an item");
  const [show, setShow] = useState(false);

 useEffect(() => {
    setShow(true);
    if (Cookies.get('mode') === 'light') {
      document.body.className = 'light-mode';
    } else {
      document.body.className = 'dark-mode';
    }

  }, []);

  const generateRandomData = () => {
    const data = [];
    for (let i = 1; i <= 10; i++) {
      data.push({
        ID: i,
        Name: `Student ${i}`,
        EnrollmentDate: `2025-01-${i < 10 ? `0${i}` : i}`,
        Status: i % 2 === 0 ? "Active" : "Inactive",
      });
    }
    return data;
  };

  const downloadPDF = (data) => {
    const doc = new jsPDF();

    const headers = Object.keys(data[0]);
    const rows = data.map((item) => Object.values(item));

    doc.autoTable({
      head: [headers],
      body: rows,
      margin: { top: 50 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { fontSize: 10 },
      didDrawPage: () => {
        doc.addImage("./assets/logo.png", "PNG", 20, 15, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        const titleText = localStorage.getItem("Report") || "Report";
        const titleWidth =
          (doc.getStringUnitWidth(titleText) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const titleXPos = (doc.internal.pageSize.width - titleWidth) / 2;
        doc.text(titleText, titleXPos, 35);
      },
    });

    const pdfBlob = doc.output("blob");
    setpdfUrl(URL.createObjectURL(pdfBlob));
  };

  const handleSelect = (event) => {
    const value = event.target.value;
    setSelectedItem(value);
    localStorage.setItem("Report", value);
  };

  const handleGenerateReport = () => {
    if (selectedItem === "Select an item") {
      alert("Please select a report type!");
      return;
    }
    const randomData = generateRandomData();
    downloadPDF(randomData);
  };

  return (
<div className="siderow">
  <div className="sidecol1">
    <Sidebar />
  </div>
  <div className="sidecol2">
  <div className={`welcome-animation ${show ? "show" : ""}`}>

    <h1
      className="dashboard"
      style={{ textAlign: "left", paddingTop: "40px", fontWeight: "bolder" }}
    >
      Reports
    </h1>
    <div style={{ width: "100%", display: "flex" }}>
      <div style={{ width: "10%" }}></div>
      <div style={{ width: "80%" }}>
        <div style={{ margin: "35px" }}>
          <div style={{ marginTop: "25px" }}>
            <InputGroup>
              <FormControl
                as="select"
                value={selectedItem}
                onChange={handleSelect}
                id="selectedItem"
              >
                <option>Select an item</option>
                <option>Enrollment Report</option>
                <option>Comprehensive Weekly Enrollment Report</option>
              </FormControl>
            </InputGroup>

            <Button
              className="btnsc"
              style={{ marginTop: "20px" }}
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </div>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <div className="pdf-container">
              <embed
                type="application/pdf"
                src={pdfUrl}
                className="responsive-pdf"
              ></embed>
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
