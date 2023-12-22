import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { Container, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdminTrustSidebar from './AdminSidebar';

export default function AdminTrustBeneficiaries({}) {
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

  
    let benHuman = trust && trust.beneficiaries ? 
                   trust.beneficiaries.filter(ben => ben.ben_type === "Human") : [];
    let benOrganization = trust && trust.beneficiaries ? 
                   trust.beneficiaries.filter(ben => ben.ben_type === "Organization") : [];

    console.log(benOrganization)
    console.log(benHuman)

    const renderTooltip = (dataObject) => {
        // Check if the beneficiary is a human
        if (dataObject.ben_type === "Human") {
          return (
            <Tooltip id={`tooltip-human-${dataObject.id}`}>
              <p>Email: {dataObject.human.ben_email}</p>
              <p>Phone 1: {dataObject.ben_phone1}</p>
              <p>Phone 2: {dataObject.ben_phone2}</p>
              <p>Address: {dataObject.ben_addressline1} {dataObject.ben_addressline2}</p>
              <p>Location: {dataObject.ben_city}, {dataObject.ben_state} {dataObject.ben_zipcode}</p>
            </Tooltip>
          );
        }

        // If the beneficiary is an organization
        if (dataObject.ben_type === "Organization") {
          return (
            <Tooltip id={`tooltip-org-${dataObject.id}`}>
              <p>Organization Name: {dataObject.organization.ben_org_name}</p>
              <p>Organization Type: {dataObject.organization.ben_org_type}</p>
              <p>Phone 1: {dataObject.ben_phone1}</p>
              <p>Phone 2: {dataObject.ben_phone2}</p>
              <p>Address: {dataObject.ben_addressline1} {dataObject.ben_addressline2}</p>
              <p>Location: {dataObject.ben_city}, {dataObject.ben_state} {dataObject.ben_zipcode}</p>
            </Tooltip>
          );
        }
      
        return null;
      };

    return (

       
    <div className='trust-container'>
     
   
    <Container className='trust-middle'>
    <h2>Beneficiaries:</h2>
    <p><strong>Humans:</strong></p>
        <ListGroup>
                {benHuman.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                        <h3>{dataObject.human.ben_first_name} {dataObject.human.ben_last_name}</h3>
                        <p>Birthdate: {dataObject.human.ben_birthdate}</p>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip(dataObject)}
                        >
                          <Button variant="success">info</Button>
                        </OverlayTrigger>
                
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <p><strong>Organizations:</strong></p>
            <ListGroup>
                {benOrganization.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                        <h3>{dataObject.organization.ben_org_name}</h3>
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip(dataObject)}
                        >
                          <Button variant="success">info</Button>
                        </OverlayTrigger>
                        <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                    </ListGroup.Item>
                ))}
            </ListGroup>
      </Container>

        </div>

    );
}

