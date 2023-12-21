import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';



export default function AdminTrustSidebar({}) {

  let { id } = useParams(); // Get the ID from the URL
  const hasParam = id !== undefined;

    return (
<div>
{hasParam ? (
  // Render navigation with param
  <>
    <li><Link to={`/admin/trust/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>Overview</Link></li>
    <li><Link to={`/admin/trust/${id}/assets`} style={{ textDecoration: 'none', color: 'inherit' }}>Assets</Link></li>
    <li><Link to={`/admin/trust/${id}/beneficiaries`} style={{ textDecoration: 'none', color: 'inherit' }}>Beneficiaries</Link></li>
    <li><Link to={`/admin/trust/${id}/users`} style={{ textDecoration: 'none', color: 'inherit' }}>Users</Link></li>
  </>
) : (
  // Render navigation without param
  <>
    <li><Link to={`/admin/trusts`} style={{ textDecoration: 'none', color: 'inherit' }}>All Trusts</Link></li>
    <li><Link to={`/admin/users`} style={{ textDecoration: 'none', color: 'inherit' }}>All Users</Link></li>
  </>
)}
</div>


    );
}

