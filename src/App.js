import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback, createContext } from 'react';
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Offcanvas, Button, Form, InputGroup, Container } from 'react-bootstrap';

import AdminNavbar from './components/AdminNavbar';
import AdminListTrusts from './components/AdminListTrusts';
import AdminSingleTrust from './components/AdminSingleTrust';
import AdminListUsers from './components/AdminListUsers';
import AdminSingleUser from './components/AdminSingleUser';
import AdminListBeneficiaries from './components/AdminListBeneficiaries';
import AdminSingleBeneficiary from './components/AdminSingleBeneficiary';
import AdminListAssets from './components/AdminListAssets';
import AdminSingleAsset from './components/AdminSingleAsset';



function App() {


  function AdminNavbarWrapper() {
    const location = useLocation();
  
    // Render the navbar only when the path starts with '/admin'
    if (location.pathname.startsWith('/admin')) {
      return <AdminNavbar />;
    }
  
    return null; // Or return any other component for different routes
  }




  return (
    <div className="App">
    
<Container>

  <BrowserRouter>
  <AdminNavbarWrapper />
      <Routes>
        <Route path="/admin/" element={<AdminListTrusts />} />
        <Route path="/admin/trusts" element={<AdminListTrusts />} />
        <Route path="/admin/beneficiaries" element={<AdminListBeneficiaries />} />
        <Route path="/admin/assets" element={<AdminListAssets />} />
        <Route path="/admin/users" element={<AdminListUsers />} />
        <Route path="/admin/user/:id/*" element={<AdminSingleUser />} />
        <Route path="/admin/asset/:id/*" element={<AdminSingleAsset />} />
        <Route path="/admin/trust/:id/*" element={<AdminSingleTrust />} />
        <Route path="/admin/beneficiary/:id/*" element={<AdminSingleBeneficiary />} />
      </Routes>
  </BrowserRouter>
</Container>

    </div>
  );
}

export default App;
