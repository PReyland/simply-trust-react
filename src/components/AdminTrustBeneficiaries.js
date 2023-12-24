import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { Container, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdminTrustSidebar from './AdminSidebar';
import AdminCardBeneficiary from './AdminCardBeneficiary';

export default function AdminTrustBeneficiaries({}) {
    const [trust, setTrust] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); // Get the ID from the URL

    useEffect(() => {
        const fetchTrustDetails = async () => {
            try {
                // Use the ID in the URL for fetching specific trust details
                const response = await fetch(`http://127.0.0.1:5555/trust/${id}`);
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

  
    let benHuman = trust && trust.beneficiaries ? 
                   trust.beneficiaries.filter(ben => ben.ben_type === "Human") : [];
    let benOrganization = trust && trust.beneficiaries ? 
                   trust.beneficiaries.filter(ben => ben.ben_type === "Organization") : [];

    console.log(benOrganization)
    console.log(benHuman)

    return (

       
    <div className='trust-container'>
     
   
    <Container className='trust-middle'>
    <h2>Beneficiaries:</h2>
    <p><strong>Humans:</strong></p>
        <ListGroup>
                {benHuman.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                <AdminCardBeneficiary beneficiaryId={dataObject.id}  />
                {console.log(dataObject.id)}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <p><strong>Organizations:</strong></p>
            <ListGroup>
                {benOrganization.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                  <AdminCardBeneficiary beneficiaryId={dataObject.id}  />
                {console.log(dataObject.id)}
                    </ListGroup.Item>
                ))}
            </ListGroup>
      </Container>

        </div>

    );
}

