import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

export default function AdminCardBeneficiary({ beneficiaryId }) {
  const [editableBeneficiary, setEditableBeneficiary] = useState({});
  const [initialBeneficiary, setInitialBeneficiary] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeneficiaryData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/beneficiary/${beneficiaryId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEditableBeneficiary(data);
        setInitialBeneficiary(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeneficiaryData();
  }, [beneficiaryId]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - Name: ${name}, Value: ${value}`);

    setEditableBeneficiary(prev => {
        const nameParts = name.split('.');
        
        // Check if the name attribute contains a dot, indicating nested data
        if (nameParts.length === 2) {
            const [parent, child] = nameParts;
            return {
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            };
        }

        // For non-nested fields, update normally
        return { ...prev, [name]: value };
    });
};
  console.log("editben!", editableBeneficiary)

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    let url;
    const dataToPatch = {};
  
    // Handling for 'Human' type
    if (editableBeneficiary.ben_type === 'Human') {
      url = `http://127.0.0.1:5555/beneficiaries/human/${beneficiaryId}`;
      const humanData = editableBeneficiary.human;
  
      for (const nestedKey in humanData) {
        if (humanData[nestedKey] !== initialBeneficiary.human[nestedKey]) {
          dataToPatch[nestedKey] = humanData[nestedKey];
        }
      }
    } 

    else if (editableBeneficiary.ben_type === 'Organization') {
        url = `http://127.0.0.1:5555/beneficiaries/organization/${beneficiaryId}`;
        const organizationData = editableBeneficiary.organization;
      
        for (const nestedKey in organizationData) {
          if (organizationData[nestedKey] !== initialBeneficiary.organization[nestedKey]) {
            dataToPatch[nestedKey] = organizationData[nestedKey];
          }
        }
      }

    const topLevelKeys = ['ben_addressline1', 'ben_addressline2', 'ben_city', 'ben_state', 'ben_zipcode', 'ben_phone1', 'ben_phone2'];
    topLevelKeys.forEach(key => {
      if (editableBeneficiary[key] !== initialBeneficiary[key]) {
        dataToPatch[key] = editableBeneficiary[key];
      }
    });
  
    try {
        console.log('data patch array', dataToPatch)
       
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToPatch),
       
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log("Beneficiary update successful");
      setIsEditing(false); // Close edit mode after successful update
    } catch (error) {
      console.error("Failed to update beneficiary:", error);
    }
  };
  
  
const renderEditMode = () => {
    // Check the beneficiary type and render the corresponding form
    if (editableBeneficiary.ben_type === 'Human') {
      return renderHumanForm();
    } else if (editableBeneficiary.ben_type === 'Organization') {
      return renderOrganizationForm();
    } else {
      return <div>Unknown Beneficiary Type</div>;
    }
  };

  
  const renderHumanForm = () => (
  <Form onSubmit={handleFormSubmit}>
  {/* First Name */}
  <Form.Group>
    <Form.Label>First Name</Form.Label>
    <Form.Control
      type="text"
      name="human.ben_firstname"
      value={editableBeneficiary.human?.ben_firstname || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Last Name */}
  <Form.Group>
    <Form.Label>Last Name</Form.Label>
    <Form.Control
      type="text"
      name="human.ben_lastname"
      value={editableBeneficiary.human?.ben_lastname || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Email */}
  <Form.Group>
    <Form.Label>Email</Form.Label>
    <Form.Control
      type="email"
      name="human.ben_email"
      value={editableBeneficiary.human?.ben_email || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Address Line 1 */}
  <Form.Group>
    <Form.Label>Address Line 1</Form.Label>
    <Form.Control
      type="text"
      name="ben_addressline1"
      value={editableBeneficiary.ben_addressline1 || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Address Line 2 */}
  <Form.Group>
    <Form.Label>Address Line 2</Form.Label>
    <Form.Control
      type="text"
      name="ben_addressline2"
      value={editableBeneficiary.ben_addressline2 || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* City */}
  <Form.Group>
    <Form.Label>City</Form.Label>
    <Form.Control
      type="text"
      name="ben_city"
      value={editableBeneficiary.ben_city || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* State */}
  <Form.Group>
    <Form.Label>State</Form.Label>
    <Form.Control
      type="text"
      name="ben_state"
      value={editableBeneficiary.ben_state || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Zip Code */}
  <Form.Group>
    <Form.Label>Zip Code</Form.Label>
    <Form.Control
      type="text"
      name="ben_zipcode"
      value={editableBeneficiary.ben_zipcode || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Phone 1 */}
  <Form.Group>
    <Form.Label>Phone 1</Form.Label>
    <Form.Control
      type="tel"
      name="ben_phone1"
      value={editableBeneficiary.ben_phone1 || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Phone 2 */}
  <Form.Group>
    <Form.Label>Phone 2</Form.Label>
    <Form.Control
      type="tel"
      name="ben_phone2"
      value={editableBeneficiary.ben_phone2 || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Relationship */}
  <Form.Group>
    <Form.Label>Relationship</Form.Label>
    <Form.Control
      type="text"
      name="human.ben_relationship"
      value={editableBeneficiary.human?.ben_relationship || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Birthdate */}
  <Form.Group>
    <Form.Label>Birthdate</Form.Label>
    <Form.Control
      type="date"
      name="human.ben_birthdate"
      value={editableBeneficiary.human?.ben_birthdate || ''}
      onChange={handleInputChange}
    />
  </Form.Group>

  {/* Buttons */}
  <Button type="submit" className="mr-2">Save</Button>
  <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
</Form>
);

const renderOrganizationForm = () => (
        <Form onSubmit={handleFormSubmit}>
          {/* Organization Name */}
          <Form.Group>
            <Form.Label>Organization Name</Form.Label>
            <Form.Control
              type="text"
              name="organization.ben_org_name"
              value={editableBeneficiary.organization?.ben_org_name || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Organization Type */}
          <Form.Group>
            <Form.Label>Organization Type</Form.Label>
            <Form.Control
              type="text"
              name="organization.ben_org_type"
              value={editableBeneficiary.organization?.ben_org_type || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Address Line 1 */}
          <Form.Group>
            <Form.Label>Address Line 1</Form.Label>
            <Form.Control
              type="text"
              name="ben_addressline1"
              value={editableBeneficiary.ben_addressline1 || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Address Line 2 */}
          <Form.Group>
            <Form.Label>Address Line 2</Form.Label>
            <Form.Control
              type="text"
              name="ben_addressline2"
              value={editableBeneficiary.ben_addressline2 || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* City */}
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="ben_city"
              value={editableBeneficiary.ben_city || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* State */}
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="ben_state"
              value={editableBeneficiary.ben_state || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Zip Code */}
          <Form.Group>
            <Form.Label>Zip Code</Form.Label>
            <Form.Control
              type="text"
              name="ben_zipcode"
              value={editableBeneficiary.ben_zipcode || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Phone 1 */}
          <Form.Group>
            <Form.Label>Phone 1</Form.Label>
            <Form.Control
              type="tel"
              name="ben_phone1"
              value={editableBeneficiary.ben_phone1 || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Phone 2 */}
          <Form.Group>
            <Form.Label>Phone 2</Form.Label>
            <Form.Control
              type="tel"
              name="ben_phone2"
              value={editableBeneficiary.ben_phone2 || ''}
              onChange={handleInputChange}
            />
          </Form.Group>
      
          {/* Buttons */}
          <Button type="submit" className="mr-2">Save</Button>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
        </Form>
      );
      


      const renderViewMode = () => {
        // Check the beneficiary type and render the corresponding view
        if (editableBeneficiary.ben_type === 'Human') {
          return renderHumanView();
        } else if (editableBeneficiary.ben_type === 'Organization') {
          return renderOrganizationView();
        } else {
          return <div>Unknown Beneficiary Type</div>;
        }
      };      

      const renderHumanView = () => (
            <Card>
            <Card.Body>
                <Card.Title>{editableBeneficiary.human?.ben_firstname} {editableBeneficiary.human?.ben_lastname}</Card.Title>
                <Card.Text>
                <strong>Email:</strong> {editableBeneficiary.human?.ben_email}<br />
                <strong>Address Line 1:</strong> {editableBeneficiary.ben_addressline1}<br />
                <strong>Address Line 2:</strong> {editableBeneficiary.ben_addressline2}<br />
                <strong>City:</strong> {editableBeneficiary.ben_city}<br />
                <strong>State:</strong> {editableBeneficiary.ben_state}<br />
                <strong>Zip Code:</strong> {editableBeneficiary.ben_zipcode}<br />
                <strong>Phone 1:</strong> {editableBeneficiary.ben_phone1}<br />
                <strong>Phone 2:</strong> {editableBeneficiary.ben_phone2}<br />
                <strong>Relationship:</strong> {editableBeneficiary.human?.ben_relationship}<br />
                <strong>Birthdate:</strong> {editableBeneficiary.human?.ben_birthdate ? new Date(editableBeneficiary.human.ben_birthdate).toLocaleDateString() : ''}
                </Card.Text>
                <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
            </Card.Body>
            </Card>
  );

  const renderOrganizationView = () => (
    <Card>
      <Card.Body>
        <Card.Title>{editableBeneficiary.organization?.ben_org_name}</Card.Title>
        <Card.Text>
          <strong>Organization Type:</strong> {editableBeneficiary.organization?.ben_org_type}<br />
          <strong>Address Line 1:</strong> {editableBeneficiary.ben_addressline1}<br />
          <strong>Address Line 2:</strong> {editableBeneficiary.ben_addressline2}<br />
          <strong>City:</strong> {editableBeneficiary.ben_city}<br />
          <strong>State:</strong> {editableBeneficiary.ben_state}<br />
          <strong>Zip Code:</strong> {editableBeneficiary.ben_zipcode}<br />
          <strong>Phone 1:</strong> {editableBeneficiary.ben_phone1}<br />
          <strong>Phone 2:</strong> {editableBeneficiary.ben_phone2}<br />
        </Card.Text>
        <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
      </Card.Body>
    </Card>
  );


  if (isLoading) {
    console.log("Loading data...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("Displaying error:", error);
    return <div>Error: {error}</div>;
  }

  console.log("Rendering component, isEditing:", isEditing);
  return isEditing ? renderEditMode() : renderViewMode();
};

