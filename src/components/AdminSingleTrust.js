import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Tooltip, OverlayTrigger, Button, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AdminTrustSidebar from './AdminSidebar';
import AdminTrustBeneficiaries from './AdminTrustBeneficiaries';
import AdminTrustAssets from './AdminTrustAssets';
import AdminListTrusts from './AdminListTrusts';
import AdminTrustUsers from './AdminTrustUsers';
import AdminTrustOverview from './AdminTrustOverview';
import AdminNavbar from './AdminNavbar';

export default function AdminSingleTrust({}) {
    const [trust, setTrust] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    let { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();


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


    const location = useLocation();


    const navigateToTrust = (change) => {
        const newId = parseInt(id) + change;
        const newPath = location.pathname.replace(`/trust/${id}`, `/trust/${newId}`);
        navigate(newPath);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    <div>

        <h1>{trust ? trust.trust_name : 'Loading Trust...'}</h1>
        <p>Created: {trust ? trust.created_at : 'Loading...'}</p>
        <p>Updated: {trust ? trust.updated_at : 'Loading...'}</p>
       
        <Button onClick={() => navigateToTrust(-1)} disabled={parseInt(id) <= 1}>Previous</Button>
                <Button onClick={() => navigateToTrust(1)}>Next</Button>
      <div className='trust-container'>
    
    <Container className='trust-sidebar'>
    <AdminTrustSidebar />
    </Container>    
   
    <Container className='trust-middle'>
    <Routes>
        <Route path="/" element={<AdminTrustOverview />} />
            <Route path="beneficiaries" element={<AdminTrustBeneficiaries />} />
            <Route path="assets" element={<AdminTrustAssets />} />
            <Route path="users" element={<AdminTrustUsers />} />
          </Routes>
    </Container>

        </div>
        </div>
    );
}

