import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useCallback, createContext } from 'react';
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Offcanvas, Button, Form, InputGroup, Container } from 'react-bootstrap';

import AdminListTrusts from './components/AdminListTrusts';
import AdminTrust from './components/AdminTrust';
import AdminListUsers from './components/AdminListUsers';
import AdminNavbar from './components/AdminNavbar';
import AdminUser from './components/AdminUser';
import AdminListBeneficiaries from './components/AdminListBeneficiaries';



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
        <Route path="/admin/beneficiaries" element={<AdminListTrusts />} />
        <Route path="/admin/users" element={<AdminListUsers />} />
        <Route path="/admin/user/:id/*" element={<AdminUser />} />
        <Route path="/admin/trust/:id/*" element={<AdminTrust />} />
      </Routes>
  </BrowserRouter>
</Container>

    </div>
  );
}

export default App;
