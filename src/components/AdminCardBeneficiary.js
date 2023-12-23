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
        const response = await fetch(`http://127.0.0.1:5555/beneficiaries/human/${beneficiaryId}`);
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
        // Check if the name attribute contains a dot, indicating nested data
        if (name.includes('.')) {
            // Split the name into its parts (e.g., "human.ben_firstname" becomes ["human", "ben_firstname"])
            const [parent, child] = name.split('.');

            // Update the nested property
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
    const url = `http://127.0.0.1:5555/beneficiaries/human/${beneficiaryId}`;

    // Prepare the data to be patched
    const dataToPatch = {};
    for (const key in editableBeneficiary) {
        if (key === 'human') {
            // Handle nested human object
            const humanData = editableBeneficiary[key];
            for (const nestedKey in humanData) {
                if (humanData[nestedKey] !== initialBeneficiary[key][nestedKey]) {
                    dataToPatch[nestedKey] = humanData[nestedKey];
                }
            }
        } else if (editableBeneficiary[key] !== initialBeneficiary[key]) {
            // Handle top-level properties
            dataToPatch[key] = editableBeneficiary[key];
        }
    }

    try {
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

        console.log("User update successful");
        setIsEditing(false); // Close edit mode after successful update
    } catch (error) {
        console.error("Failed to update user:", error);
    }
};


  const renderEditMode = () => (
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
  
  const renderViewMode = () => (
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

