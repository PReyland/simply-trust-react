import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function AdminTrustOverview() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trustData, setTrustData] = useState(null);
    let { id } = useParams(); 

    useEffect(() => {
        const fetchTrustDetails = async () => {
            try {
                // Use the ID in the URL for fetching specific trust details
                const response = await fetch(`http://127.0.0.1:5555/trust/${id}/analytics`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setTrustData(data);
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

    console.log(trustData)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <Container className='trust-middle'>
            <h2>Overview</h2>
            {trustData && (
                <Card>
                <Card.Body>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            Total Beneficiaries: {trustData.total_beneficiaries}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Total Physical Assets: {trustData.total_physical_assets}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Total Physical Assets Value: {trustData.total_physical_assets_value}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Trust Counsel Count: {trustData.trust_counsel_count}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Trust Owners Count: {trustData.trust_owners_count}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Trust Trustees Count: {trustData.trust_trustees_count}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Trust Users Count: {trustData.trust_users_count}
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
            )}
        </Container>
    );
}
