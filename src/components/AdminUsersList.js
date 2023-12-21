import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Container, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminTrustSidebar from './AdminSidebar';

export default function AdminUsersList({}) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrusts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/users');
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

        fetchTrusts();
    }, []);
    console.log(users)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='trust-container'>
    
    <Container className='trust-sidebar'>
    <AdminTrustSidebar />
    </Container>     

        <Container className='trust-middle'>
            <ListGroup>
                    {users.map(dataObject => (
                       
                        <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                            <h3>{dataObject.user_firstname} {dataObject.user_lastname}</h3>
                            
                        </ListGroup.Item>

                    ))}
                </ListGroup>
          </Container>
          </div>
    );
}
