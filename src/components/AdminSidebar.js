import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

export default function AdminTrustSidebar() {
  let { id } = useParams(); // Get the ID from the URL
  const location = useLocation();
  const path = location.pathname;

  const isTrustRoute = path.startsWith('/admin/trust/');
  const isUserRoute = path.startsWith('/admin/user/');

  return (
    <div>
      {isTrustRoute && id ? (
        <>
          <li><Link to={`/admin/trust/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>Overview</Link></li>
          <li><Link to={`/admin/trust/${id}/assets`} style={{ textDecoration: 'none', color: 'inherit' }}>Assets</Link></li>
          <li><Link to={`/admin/trust/${id}/beneficiaries`} style={{ textDecoration: 'none', color: 'inherit' }}>Beneficiaries</Link></li>
          <li><Link to={`/admin/trust/${id}/users`} style={{ textDecoration: 'none', color: 'inherit' }}>Users</Link></li>
        </>
      ) : isUserRoute && id ? (
        <>
          <li><Link to={`/admin/user/${id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>User Details</Link></li>
        </>
      ) : (
        <>
          <li><Link to={`/admin/trusts`} style={{ textDecoration: 'none', color: 'inherit' }}>All Trusts</Link></li>
          <li><Link to={`/admin/users`} style={{ textDecoration: 'none', color: 'inherit' }}>All Users</Link></li>
          <li><Link to={`/admin/beneficiaries`} style={{ textDecoration: 'none', color: 'inherit' }}>All Beneficiaries</Link></li>
        </>
      )}
    </div>
  );
}
