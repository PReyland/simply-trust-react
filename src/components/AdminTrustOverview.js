import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import AdminCard from './AdminCard';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AdminTrustOverview({}) {
    const [trust, setTrust] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); // Get the ID from the URL

    useEffect(() => {
        const fetchTrustDetails = async () => {
            try {
                // Use the ID in the URL for fetching specific trust details
                const response = await fetch(`http://127.0.0.1:5555/trusts/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setTrust(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) { // Only run the fetch if the ID is available
            fetchTrustDetails();
        }
    }, [id]); // Rerun the effect if the ID changes

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log(trust)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    let benHuman = trust && trust.beneficiaries ? 
                   trust.beneficiaries.filter(ben => ben.ben_type === "Human") : [];
    let benOrganization = trust && trust.beneficiaries ? 
                   trust.beneficiaries.filter(ben => ben.ben_type === "Organization") : [];

    console.log(benOrganization)
    console.log(benHuman)

    return (
    <div className="card-grid-container">
    <div>
    <h1>{trust ? trust.trust_name : 'Loading Trust...'}</h1>
                <p>Created: {trust ? trust.created_at : 'Loading...'}</p>
                <p>Updated: {trust ? trust.updated_at : 'Loading...'}</p>

    </div>
<h2>Beneficiaries:</h2>
<p><strong>Humans:</strong></p>
    <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {benHuman.map(dataObject => (
          <div key={dataObject.id} className="masonry-item">
                  <Card style={{ width: '100%' }}>
        <Card.Body>
          <p>{dataObject.human.ben_first_name} {dataObject.human.ben_last_name}</p>
          <p>Birthdate: {dataObject.human.ben_birthdate}</p>
          <p>{dataObject.human.ben_email}</p>
          <p>{dataObject.ben_phone1}</p>
          <p>{dataObject.ben_phone2}</p>

          <p>{dataObject.ben_addressline1}</p>
          <p>{dataObject.ben_addressline2}</p>
          <p>{dataObject.ben_city} {dataObject.ben_state}, {dataObject.ben_zipcode} </p>
        </Card.Body>
      </Card>
         </div>
        ))}
      </Masonry>
      <p><strong>Organizations:</strong></p>
      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {benOrganization.map(dataObject => (
          <div key={dataObject.id} className="masonry-item">
                  <Card style={{ width: '100%' }}>
        <Card.Body>
          <p>{dataObject.organization.ben_org_name}</p>
          <p>{dataObject.organization.ben_org_type}</p> 
          <p>{dataObject.ben_phone1}</p>
          <p>{dataObject.ben_phone2}</p>

          <p>{dataObject.ben_addressline1}</p>
          <p>{dataObject.ben_addressline2}</p>
          <p>{dataObject.ben_city} {dataObject.ben_state}, {dataObject.ben_zipcode} </p>
        </Card.Body>
      </Card>
         </div>
        ))}
      </Masonry>

        </div>
    );
}

