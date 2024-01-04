import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form,  Modal, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import AdminTrustSidebar from './AdminSidebar';
import AdminCardBeneficiary from './AdminCardBeneficiary';
import AdminCardAssetPhysical from './AdminCardAssetPhysical';

export default function AdminSingleBeneficiary() {
    const [beneficiary, setBeneficiary] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); 
    const navigate = useNavigate();
    let adminOn = true



    useEffect(() => {
        const fetchBeneficiaryDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/admin/beneficiary/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setBeneficiary(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (id) {
            fetchBeneficiaryDetails();
        }
    }, [id]);

    const navigateToBeneficiary = (change) => {
        const newId = parseInt(id) + change;
        navigate(`/admin/beneficiary/${newId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(beneficiary)
    console.log("testingadminon", adminOn)

    return (
        <div className='trust-container'>
            <Container className='trust-sidebar'>
            <AdminTrustSidebar />
            </Container>    
            <Container className='trust-middle'>
            <Button onClick={() => navigateToBeneficiary(-1)} disabled={parseInt(id) <= 1}>Previous</Button>
                <Button onClick={() => navigateToBeneficiary(1)}>Next</Button>
                <AdminCardBeneficiary beneficiaryId={id} />
                <div className='trust-container'>
                    <ListGroup>
                        <p><strong>Associated Trusts</strong></p>
                        {beneficiary.physical_assets && beneficiary.physical_assets.length > 0 ? (
                            beneficiary.physical_assets.map(asset => (
                                <ListGroup.Item key={asset.trust.id} className="list-group-item-container">
                                    <Link to={`/admin/trust/${asset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3>{asset.trust.trust_name}</h3>
                                    </Link>
                                </ListGroup.Item>
                            ))
                        ) : (
                            <p>No associated trusts.</p>
                        )}
                    </ListGroup>

                    

                    
                    <ListGroup>
                    <p><strong>Associated Assets</strong></p>
                    {beneficiary.physical_assets.map(asset => (
                        <ListGroup.Item key={asset.id} className="list-group-item-container">
                       <AdminCardAssetPhysical physicalAssetId={asset.id} adminProp={adminOn} />

                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                    
                </div>
            </Container>
        </div>
    );
}