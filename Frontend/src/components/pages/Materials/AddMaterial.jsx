import React, { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./addmaterial.css"

import { useEffect } from "react";
import { CgPathCrop } from "react-icons/cg";
import logoImage from "../../../assets/images/logo.png";

const AddMaterial = () => {
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [materials, setMaterials] = useState([])
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchMaterials();
    }, [])

    const fetchMaterials = async () => {
        try {
            const response = await axios.get("http://localhost:5000/add-materials");
            setMaterials(response.data)
        } catch (error) {
            console.log("Error fethcing Materials", error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/add-materials/add", {
                name,
                unit,
                unitPrice: parseFloat(unitPrice),
            });
            setMessage(response.data.message);
            setName("");
            setUnit("");
            setUnitPrice("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error adding material");
        }
    };

    const generateReport = () => {
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: 'Materials Report',
            subject: 'Detailed Materials Inventory',
            author: 'BuildEase',
            creator: 'PDF Generator'
        });
        
        // Document margins and dimensions
        const margin = 15;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (margin * 2);
        
        // Background styling
        doc.setFillColor(248, 249, 250); // Light background
        doc.rect(0, 0, pageWidth, doc.internal.pageSize.height, "F");
        
        // Add logo
        doc.addImage(logoImage, "PNG", pageWidth - 50, margin, 35, 35);
        
        // Add header with gradient effect (simulated with multiple rectangles)
        const headerHeight = 30;
        const gradientSteps = 20;
        const stepHeight = headerHeight / gradientSteps;
        
        for (let i = 0; i < gradientSteps; i++) {
            // Calculate gradient color from dark teal to lighter teal
            const blueValue = 100 + (i * 3);
            const greenValue = 120 + (i * 2);
            doc.setFillColor(0, greenValue, blueValue);
            doc.rect(margin, margin + (i * stepHeight), contentWidth, stepHeight, "F");
        }
        
        // Add report title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(255, 255, 255);
        doc.text("Materials Report", margin + 5, margin + 20);
        
        // Add date and reference information
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(240, 240, 240);
        const today = new Date().toLocaleDateString();
        doc.text(`Generated: ${today}`, margin + 5, margin + headerHeight + 10);
        doc.text("Ref: MTR-" + Math.floor(Math.random() * 10000), margin + 5, margin + headerHeight + 18);
        
        // Company information
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Build Ease", pageWidth - 50, margin + headerHeight + 15);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("223/B,Malabe, Colombo", pageWidth - 50, margin + headerHeight + 22);
        doc.text("BuildEase@123.com", pageWidth - 50, margin + headerHeight + 28);
        
        // Table position
        const tableStartY = margin + headerHeight + 40;
        const tableX = margin;
        
        // Column definitions with width percentages
        const columns = [
            { header: "ID", width: 0.1 },
            { header: "Material Name", width: 0.4 },
            { header: "Unit of Measure", width: 0.25 },
            { header: "Unit Price", width: 0.25 }
        ];
        
        // Calculate actual column widths
        let xOffset = tableX;
        columns.forEach(col => {
            col.x = xOffset;
            col.actualWidth = contentWidth * col.width;
            xOffset += col.actualWidth;
        });
        
        // Table header with 3D effect
        doc.setFillColor(0, 128, 128); // Teal background for header
        doc.rect(tableX, tableStartY, contentWidth, 12, "F");
        
        // Header shadow effect
        doc.setFillColor(0, 100, 100);
        doc.rect(tableX, tableStartY + 10, contentWidth, 2, "F");
        
        // Header text
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(255, 255, 255);
        
        columns.forEach(col => {
            doc.text(col.header, col.x + 5, tableStartY + 8);
        });
        
        // Table content with alternating row colors
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        
        const rowHeight = 14; // Increased row height for better spacing
        
        materials.forEach((material, index) => {
            const rowY = tableStartY + 12 + (index * rowHeight);
            
            // Alternating row background
            if (index % 2 === 0) {
                doc.setFillColor(240, 240, 240); // Light gray for even rows
            } else {
                doc.setFillColor(255, 255, 255); // White for odd rows
            }
            doc.rect(tableX, rowY, contentWidth, rowHeight, "F");
            
            // Row data
            doc.setTextColor(60, 60, 60);
            doc.text(String(index + 1), columns[0].x + 5, rowY + 10);
            doc.text(material.name, columns[1].x + 5, rowY + 10);
            doc.text(material.unit, columns[2].x + 5, rowY + 10);
            
            // Right-align price
            const priceText = `$${parseFloat(material.unitPrice).toFixed(2)}`;
            const priceWidth = doc.getTextWidth(priceText);
            doc.text(priceText, columns[3].x + columns[3].actualWidth - priceWidth - 5, rowY + 10);
            
            // Add subtle horizontal lines between rows
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.1);
            doc.line(tableX, rowY + rowHeight, tableX + contentWidth, rowY + rowHeight);
        });
        
        // Table border
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 128, 128);
        doc.rect(tableX, tableStartY, contentWidth, 12 + (materials.length * rowHeight), "D");
        
        // Vertical lines between columns
        columns.forEach((col, index) => {
            if (index < columns.length - 1) {
                doc.line(
                    col.x + col.actualWidth, 
                    tableStartY, 
                    col.x + col.actualWidth, 
                    tableStartY + 12 + (materials.length * rowHeight)
                );
            }
        });
        
        // Add summary section
        const tableEndY = tableStartY + 12 + (materials.length * rowHeight) + 15;
        
        doc.setFillColor(240, 240, 240);
        doc.rect(tableX, tableEndY, contentWidth, 50, "F");
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 100, 100);
        doc.text("Summary", tableX + 10, tableEndY + 15);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        
        // Calculate total materials value
        const totalValue = materials.reduce((sum, material) => sum + parseFloat(material.unitPrice), 0);
        
        doc.text(`Total Materials: ${materials.length}`, tableX + 10, tableEndY + 30);
        doc.text(`Total Value: $${totalValue.toFixed(2)}`, tableX + 10, tableEndY + 40);
        
        // Add signature section
        const signatureY = tableEndY + 70;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Approved By:", pageWidth - 80, signatureY);
        
        doc.setDrawColor(0, 100, 100);
        doc.setLineWidth(0.5);
        doc.line(pageWidth - 80, signatureY + 20, pageWidth - 20, signatureY + 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Name & Designation", pageWidth - 80, signatureY + 28);
        
        // Add footer with page number
        const footerY = doc.internal.pageSize.height - 10;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page 1 of 1 | Confidential Company Document`, pageWidth / 2, footerY, null, null, "center");
        
        // Save the PDF
        doc.save("materials-report.pdf");
    };
    
    
    return (
        <div>
            <aside className="sidebar">
                <h2 className="sidebar-title">Stocks & Materials</h2>
                <nav>
                    <ul className="sidebar-menu">
                        <li><a href="/construction-company-react-app/MaterialDashboard"><i className="fas fa-home"></i>Dashboard</a></li>
                        <li><a href="/construction-company-react-app/AddMaterial"><i className="fas fa-user"></i> Add Materials</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-tasks"></i> Stock Management</a></li>
                        <li><a href="/construction-company-react-app/MaterialForm"><i className="fas fa-envelope"></i> Reports & Analytics</a></li>
                        <li><a href="/admin/settings"><i className="fas fa-shopping-cart"></i> Billing & Payments</a></li>
                    </ul>
                </nav>


                    {/* <div className="logout-button">
                        <i className="fas fa-sign-out-alt"></i>
                    </div> */}
            </aside>


            <div className="add-material-container">
                <h2>Add Material</h2>
                {message && <p>{message}</p>}
                <form className="add-material-form" onSubmit={handleSubmit}>
                    <label>Material Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label>Unit of Measure:</label>
                    <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} required />

                    <label>Unit Price:</label>
                    <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />

                    <button type="submit">Add Material</button>
                    <button className="generate-report-button" onClick={generateReport}>Generate Report</button>
                </form>
            </div>


            <h3>All Materials</h3>
            <div className="materialTableContainer">
                <table className="materials-tables">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Material Name</th>
                            <th>Unit of Measure</th>
                            <th>Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materials.length > 0 ? (
                            materials.map((materials, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{materials.name}</td>
                                    <td>{materials.unit}</td>
                                    <td>{materials.unitPrice}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="no-data">No materials added yet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default AddMaterial;
