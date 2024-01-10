import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, ListGroup } from 'react-bootstrap';
import AdminCardBeneficiary from './AdminCardBeneficiary';

export default function AdminTrustBeneficiaries() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); // Get the ID from the URL

    useEffect(() => {
        const fetchTrustDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/trust/${id}/beneficiaries`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setBeneficiaries(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchTrustDetails();
        }
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    let benHuman = beneficiaries.filter(ben => ben.ben_type === "Human");
    let benOrganization = beneficiaries.filter(ben => ben.ben_type === "Organization");

    return (
        <div className='trust-container'>
            <Container className='trust-middle'>
                <h2>Beneficiaries:</h2>
                <p><strong>Humans:</strong></p>
                <ListGroup>
                    {benHuman.map(dataObject => (
                        <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                            <AdminCardBeneficiary beneficiaryId={dataObject.id} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <p><strong>Organizations:</strong></p>
                <ListGroup>
                    {benOrganization.map(dataObject => (
                        <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                            <AdminCardBeneficiary beneficiaryId={dataObject.id} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Container>
        </div>
    );
}
