import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AdminCard({ dataObject }) {
  const totalBeneficiaries = dataObject.beneficiaries.length;
  const totalTrustees = dataObject.trustees.length;
  const totalCounsel = dataObject.counsel.length;

  return (
    <Link to={`/admin/trust/${dataObject.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className="grid-item">
      <Card style={{ width: '100%' }}>
        <Card.Body>
          <h2>{dataObject.trust_name}</h2>
          <p>Beneficiaries: {totalBeneficiaries}</p>
          <p>Trustees: {totalTrustees}</p>
          <p>Counsel: {totalCounsel}</p>

        </Card.Body>
      </Card>
    </div>
    </Link>
  );
}
