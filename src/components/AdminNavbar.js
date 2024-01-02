import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

export default function AdminNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Admin Panel</Navbar.Brand>
    

         <Link as={Link} to="/admin/trusts" style={{ textDecoration: 'none', color: 'inherit' }}>All Trusts</Link>
         <Link as={Link} to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>All Users</Link>
         <Link as={Link} to="/admin/assets" style={{ textDecoration: 'none', color: 'inherit' }}>All Assets</Link>
         <Link as={Link} to="/admin/beneficiaries" style={{ textDecoration: 'none', color: 'inherit' }}>All Beneficiaries</Link>

    </Navbar>
  );
}
