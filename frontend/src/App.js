import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InvoiceGenerator from './components/InvoiceGenerator';
import InvoicesList from './components/InvoicesList';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<InvoiceGenerator />} />
        <Route path="/invoiceslist" element={<InvoicesList />} />
      </Routes>
    </Router>
  );
};

export default App;
