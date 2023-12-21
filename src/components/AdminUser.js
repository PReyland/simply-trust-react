import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ListGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AdminUser() {
    const [user, setUser] = useState({});
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrust, setSelectedTrust] = useState(null); 
    const [showConfirmation, setShowConfirmation] = useState(false); 
    let { id } = useParams(); 


    useEffect(() => {
        console.log(`User ID: ${id}`);
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/user/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
                console.log("Updated user state:", user);
    
            } catch (error) {
                setError(error.message);
            
            } finally {
                setIsLoading(false);
            }
        };
    
        if (id) {
            fetchUserDetails();
        }
    }, [id]);
    

    const handleEdit = (trustId, role) => {
        console.log(`Edit trust ${trustId} with role ${role}`);
        // Implement your edit logic here
    };

    const handleRemove = (trustId, role) => {
        setSelectedTrust({ trustId, role });
        setShowConfirmation(true);
    };

    const confirmRemove = async () => {
        const { trustId, role } = selectedTrust;
    
        try {
            const response = await fetch(`http://127.0.0.1:5555/user/${user.id}/remove_from_trust/${trustId}/${role}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                console.log(`User removed as ${role} from trust ${trustId} successfully`);
                updateTrustList(trustId, role); 
            } else {
                const text = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
            }
        } catch (error) {
            console.error(`Error removing user from trust: ${error.message}`);
        } finally {
            setShowConfirmation(false);
        }
    };
    
    const updateTrustList = (trustId, role) => {
        setUser(prevUser => {
            let updatedTrusts;
            switch (role) {
                case 'owner':
                    updatedTrusts = prevUser.owned_trusts.filter(trust => trust.id !== trustId);
                    return { ...prevUser, owned_trusts: updatedTrusts };
                case 'trustee':
                    updatedTrusts = prevUser.trusted_trusts.filter(trust => trust.id !== trustId);
                    return { ...prevUser, trusted_trusts: updatedTrusts };
                case 'counsel':
                    updatedTrusts = prevUser.counseled_trusts.filter(trust => trust.id !== trustId);
                    return { ...prevUser, counseled_trusts: updatedTrusts };
                default:
                    return prevUser;
            }
        });
    };
    

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className='trust-container'>
                <ListGroup>
                    <p><strong>Owned Trusts:</strong></p>
                    {user.owned_trusts.map(trust => (
                        <ListGroup.Item key={trust.id} className="list-group-item-container">
                            <h3>{trust.trust_name}</h3>
                            <Button variant="primary" onClick={() => handleEdit(trust.id, 'owner')}>Edit</Button>
                            <Button variant="danger" onClick={() => handleRemove(trust.id, 'owner')}>Remove</Button>
                        </ListGroup.Item>
                    ))}

                    <p><strong>Trusted Trusts:</strong></p>
                    {user.trusted_trusts.map(trust => (
                        <ListGroup.Item key={trust.id} className="list-group-item-container">
                            <h3>{trust.trust_name}</h3>
                            <Button variant="primary" onClick={() => handleEdit(trust.id, 'trustee')}>Edit</Button>
                            <Button variant="danger" onClick={() => handleRemove(trust.id, 'trustee')}>Remove</Button>
                        </ListGroup.Item>
                    ))}

                    <p><strong>Counseled Trusts:</strong></p>
                    {user.counseled_trusts.map(trust => (
                        <ListGroup.Item key={trust.id} className="list-group-item-container">
                            <h3>{trust.trust_name}</h3>
                            <Button variant="primary" onClick={() => handleEdit(trust.id, 'counsel')}>Edit</Button>
                            <Button variant="danger" onClick={() => handleRemove(trust.id, 'counsel')}>Remove</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to remove the user from this trust?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmRemove}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
