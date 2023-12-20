import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';



export default function AdminTrustSidebar({}) {

  let { id } = useParams(); // Get the ID from the URL

    return (
  <div>
  <li><Link to={`/admin/trust/${id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>Overview</Link></li>
  <li><Link to={`/admin/trust/${id}/assets`} style={{ textDecoration: 'none', color: 'inherit' }}>Assets</Link></li>
  <li><Link to={`/admin/trust/${id}/beneficiaries`} style={{ textDecoration: 'none', color: 'inherit' }}>Beneficiaries</Link></li>
  <li><Link to={`/admin/trust/${id}/users`} style={{ textDecoration: 'none', color: 'inherit' }}>Users</Link></li>
  </div>
 
    );
}

