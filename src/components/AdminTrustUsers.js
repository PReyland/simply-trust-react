import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AdminTrustSidebar from './AdminSidebar';

export default function AdminTrustUsers({}) {
    const [users, setUsers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams();
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchTrustDetails = async () => {
            try {
                // Use the ID in the URL for fetching specific trust details
                const response = await fetch(`http://127.0.0.1:5555/trusts/${id}/users`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
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

    console.log(users)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    let userOwners = users.owners
    let userTrustees = users.trustees
    let userCounsel = users.counsel
  
    console.log(userOwners)
    console.log(userCounsel)
    console.log(userTrustees)
    
    return (
 
   
    <Container className='trust-middle'>
    <h2>Users:</h2>
    <h3>Owners</h3>
        <ListGroup>
                {userOwners.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                        <h3>{dataObject.user_firstname} {dataObject.user_lastname}</h3>
                        <p>{dataObject.user_phone1} {dataObject.user_email}</p>
                    </ListGroup.Item>
                ))}
        </ListGroup>

        <h3>Trustees</h3>
        <ListGroup>
                {userTrustees.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                        <h3>{dataObject.user_firstname} {dataObject.user_lastname}</h3>
                        <p>{dataObject.user_phone1} {dataObject.user_email}</p>
                    </ListGroup.Item>
                ))}
        </ListGroup>

        <h3>Counsel</h3>
        <ListGroup>
                {userCounsel.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                        <h3>{dataObject.user_firstname} {dataObject.user_lastname}</h3>
                        <p>{dataObject.user_phone1} {dataObject.user_email}</p>
                    </ListGroup.Item>
                ))}
        </ListGroup>

    
      </Container>


    );
}

