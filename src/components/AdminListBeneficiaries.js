import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminTrustSidebar from './AdminSidebar.js';

export default function AdminListBeneficiaries() {
    const [humanBeneficiaries, setHumanBeneficiaries] = useState([]);
    const [organizationBeneficiaries, setOrganizationBeneficiaries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBeneficiaries = async (type) => {
            try {
                const response = await fetch(`http://127.0.0.1:5555/admin/beneficiaries/${type}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (type === 'humans') {
                    setHumanBeneficiaries(data);
                } else {
                    setOrganizationBeneficiaries(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBeneficiaries('humans');
        fetchBeneficiaries('organizations');
        console.log(humanBeneficiaries)
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='trust-container'>
            <Container className='trust-sidebar'>
                <AdminTrustSidebar />
            </Container>

            <Container className='trust-middle'>
            <Tabs>
            <Tab eventKey="humans" title="Humans">
    <ListGroup>
        {humanBeneficiaries.map(dataObject => (
            <Link key={dataObject.id} to={`/admin/beneficiary/${dataObject.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListGroup.Item className="list-group-item-container">
                    <h3>{dataObject.human.ben_firstname} {dataObject.human.ben_lastname}</h3>
                </ListGroup.Item>
            </Link>
        ))}
    </ListGroup>
</Tab>
<Tab eventKey="organizations" title="Organizations">
    <ListGroup>
        {organizationBeneficiaries.map(dataObject => (
            <Link key={dataObject.id} to={`/admin/beneficiary/${dataObject.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListGroup.Item className="list-group-item-container">
                    <h3>{dataObject.organization.ben_org_name}</h3>
                </ListGroup.Item>
            </Link>
        ))}
    </ListGroup>
</Tab>
</Tabs>
            </Container>
        </div>
    );
}
