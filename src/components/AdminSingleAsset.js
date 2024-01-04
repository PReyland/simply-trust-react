import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form,  Modal, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import AdminTrustSidebar from './AdminSidebar';
import AdminCardUser from './AdminCardUser';
import AdminCardBeneficiary from './AdminCardBeneficiary';
import AdminCardAssetPhysical from './AdminCardAssetPhysical';

export default function AdminSingleAsset() {
    const [asset, setAsset] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssetDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/admin/physicalasset/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAsset(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        if (id) {
            fetchAssetDetails();
        }
    }, [id]);

    const navigateToAsset = (change) => {
        const newId = parseInt(id) + change;
        navigate(`/admin/asset/p/${newId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='trust-container'>
            <Container className='trust-sidebar'>
                <AdminTrustSidebar />
            </Container>    
            <Container className='trust-middle'>

      
            <Button onClick={() => navigateToAsset(-1)} disabled={parseInt(id) <= 1}>Previous</Button>
                <Button onClick={() => navigateToAsset(1)}>Next</Button>

                <AdminCardAssetPhysical physicalAssetId={id} />
                <p><strong>Beneficiaries</strong></p>
                <AdminCardBeneficiary beneficiaryId={asset.beneficiary.id} />
                <div className='trust-container'>
                    <ListGroup>
                        <p><strong>Associated Trust</strong></p>
                                      
                                <ListGroup.Item key={asset.id} className="list-group-item-container">
                                    <Link to={`/admin/trust/${asset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3>{asset.trust.trust_name}</h3>
                                    </Link>
                                </ListGroup.Item>
                    </ListGroup>

                    
                </div>
            </Container>
        </div>
    );
}