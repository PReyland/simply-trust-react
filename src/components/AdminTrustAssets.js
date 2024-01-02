import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdminTrustSidebar from './AdminSidebar';
import AdminCardAssetPhysical from './AdminCardAssetPhysical';

export default function AdminTrustAssets({}) {
    const [assets, setAssets] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); // Get the ID from the URL

    useEffect(() => {
        const fetchTrustDetails = async () => {
            try {
                // Use the ID in the URL for fetching specific trust details
                const response = await fetch(`http://127.0.0.1:5555/trust/${id}/physicalassets`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAssets(data);
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


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    <div>

    <h2>Physical Assets:</h2>

    <ListGroup>
                {assets.map(dataObject => (
                    <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                        <h3>{dataObject.pa_name} </h3>
                        <p> Estimate Value: {dataObject.pa_value_estimate}</p>
                    </ListGroup.Item>
                ))}
        </ListGroup>

        </div>
    );
}

