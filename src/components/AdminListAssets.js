import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminTrustSidebar from './AdminSidebar.js';


export default function AdminListAssets({}) {
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/admin/physicalassets');
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

        fetchAssets();
    }, []);
    console.log(assets)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (

        <div className='trust-container'>
    
    <Container className='trust-sidebar'>
    <AdminTrustSidebar />
    </Container>    
    <Container className='trust-middle'>
    <Tabs>
            <Tab eventKey="humans" title="Physical Assets">
            <ListGroup>
                    {assets.map(dataObject => (
                          <Link to={`/admin/asset/${dataObject.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListGroup.Item key={dataObject.id} className="list-group-item-container">
                            <p>{dataObject.pa_type}</p>
                            <h3>{dataObject.pa_name}</h3>
                            <p>${dataObject.pa_value_estimate}</p>
                        </ListGroup.Item>
                        </Link>
                    ))}
                </ListGroup>
</Tab>
<Tab eventKey="organizations" title="Financial Assets">
    <ListGroup>
    </ListGroup>
</Tab>
</Tabs>
          </Container>
          </div>
    );
}
