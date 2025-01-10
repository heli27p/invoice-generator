import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf"; // Import jsPDF

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [products, setProducts] = useState([
    { name: "", quantity: 0, price: 0, total: 0 },
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const [errors, setErrors] = useState({
    customer: "",
    email: "",
    products: "",
  });

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [name]: value,
      total:
        name === "quantity" || name === "price"
          ? (name === "quantity" ? value : updatedProducts[index].quantity) *
            (name === "price" ? value : updatedProducts[index].price)
          : updatedProducts[index].total,
    };

    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const calculateTotals = (currentProducts) => {
    const subtotal = currentProducts.reduce(
      (sum, product) => sum + (product.total || 0),
      0
    );
    const tax = subtotal * 0.04; // 4% tax rate
    setTotals({
      subtotal,
      tax,
      total: subtotal + tax,
    });
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { name: "", quantity: 0, price: 0, total: 0 },
    ]);
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    calculateTotals(updatedProducts);
  };

  const validateForm = () => {
    let valid = true;
    let errorMessages = { customer: "", email: "", products: "" };

    // Validate customer details
    if (!customerDetails.name || !customerDetails.email || !customerDetails.address) {
      valid = false;
      errorMessages.customer = "All customer details must be filled.";
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(customerDetails.email)) {
      valid = false;
      errorMessages.email = "Please enter a valid email address.";
    }

    // Validate products
    const invalidProduct = products.some(
      (product) => !product.name || product.quantity <= 0 || product.price <= 0
    );
    if (invalidProduct) {
      valid = false;
      errorMessages.products = "Each product must have a valid name, quantity, and price.";
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleAddInvoice = async () => {
    if (!validateForm()) {
      return;
    }
  
    // Structure the invoice data based on your required format
    const invoiceData = {
      customerDetails,
      products,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
    };

    // console.log(invoiceData);
  
    try {
      // Send data to the backend API
      const response = await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });
  
      if (response.ok) {
        navigate("/invoiceslist");  // Navigate to another page on success
      } else {
        console.error("Failed to add invoice");
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };
  
  
  // Function to generate PDF
  const generatePDF = () => {
    if (!validateForm()) {
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Invoice", 105, 20, null, null, "center");

    // Customer Details
    doc.setFontSize(12);
    doc.text(`Customer Name: ${customerDetails.name}`, 10, 30);
    doc.text(`Email: ${customerDetails.email}`, 10, 40);
    doc.text(`Address: ${customerDetails.address}`, 10, 50);

    // Products List
    doc.text("Products:", 10, 60);
    let yPosition = 70;
    products.forEach((product, index) => {
      doc.text(
        `${product.name} - Qty: ${product.quantity} - Price: ₹${product.price} - Total: ₹${product.total}`,
        10,
        yPosition
      );
      yPosition += 10;
    });

    // Totals
    doc.text(`Subtotal: ₹${totals.subtotal.toFixed(2)}`, 10, yPosition + 10);
    doc.text(`Tax (4%): ₹${totals.tax.toFixed(2)}`, 10, yPosition + 20);
    doc.text(`Total: ₹${totals.total.toFixed(2)}`, 10, yPosition + 30);

    // Save the PDF
    doc.save(`Invoice_${customerDetails.name}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="shadow-lg rounded-lg p-6 bg-white">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Invoice Generator
        </h2>

        {/* Customer Details Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
          {errors.customer && <div className="text-red-500 mb-2">{errors.customer}</div>}
          {errors.email && <div className="text-red-500 mb-2">{errors.email}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded w-full"
              name="name"
              placeholder="Customer Name"
              value={customerDetails.name}
              onChange={handleCustomerChange}
            />
            <input
              className="border p-2 rounded w-full"
              name="email"
              type="email"
              placeholder="Email"
              value={customerDetails.email}
              onChange={handleCustomerChange}
            />
            <input
              className="border p-2 rounded w-full md:col-span-2"
              name="address"
              placeholder="Address"
              value={customerDetails.address}
              onChange={handleCustomerChange}
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <button
              onClick={addProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              + Add Product
            </button>
          </div>

          {errors.products && <div className="text-red-500 mb-2">{errors.products}</div>}

          {products.map((product, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center mb-4">
              <input
                className="col-span-4 border p-2 rounded"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={(e) => handleProductChange(index, e)}
              />
              <input
                className="col-span-2 border p-2 rounded"
                name="quantity"
                type="number"
                placeholder="Qty"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, e)}
              />
              <input
                className="col-span-2 border p-2 rounded"
                name="price"
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={(e) => handleProductChange(index, e)}
              />
              <div className="col-span-3">
                <span>₹{product.total}</span>
              </div>
              <button
                onClick={() => removeProduct(index)}
                className="col-span-1 text-red-500 hover:text-red-700"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Totals Section */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Tax (4%):</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleAddInvoice}
            className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700"
          >
            Save Invoice
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
