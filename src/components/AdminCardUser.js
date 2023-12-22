import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

export default function AdminCardUser({ userId }) {
  const [editableUser, setEditableUser] = useState({});
  const [initialUser, setInitialUser] = useState({}); // To store the initial user data
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered for userId", userId);
    const fetchUserData = async () => {
      try {
        console.log("Fetching data for userId", userId);
        const response = await fetch(`http://127.0.0.1:5555/user/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data fetched successfully", data);
        setEditableUser(data);
        setInitialUser(data); // Save the initial data
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - Name: ${name}, Value: ${value}`);
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = `http://127.0.0.1:5555/user/${editableUser.id}`;

    // Prepare the data to be patched
    const dataToPatch = {};
    for (const key in editableUser) {
      if (editableUser[key] !== initialUser[key]) {
        dataToPatch[key] = editableUser[key];
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
    <Form.Group>
      <Form.Label>First Name</Form.Label>
      <Form.Control
        type="text"
        name="user_firstname"
        value={editableUser.user_firstname || ''}
        onChange={handleInputChange}
        placeholder="First Name"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Last Name</Form.Label>
      <Form.Control
        type="text"
        name="user_lastname"
        value={editableUser.user_lastname || ''}
        onChange={handleInputChange}
        placeholder="Last Name"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Phone</Form.Label>
      <Form.Control
        type="tel"
        name="user_phone1"
        value={editableUser.user_phone1 || ''}
        onChange={handleInputChange}
        placeholder="Phone"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        name="user_email"
        value={editableUser.user_email || ''}
        onChange={handleInputChange}
        placeholder="Email"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Address Line 1</Form.Label>
      <Form.Control
        type="text"
        name="user_addressline1"
        value={editableUser.user_addressline1 || ''}
        onChange={handleInputChange}
        placeholder="Address Line 1"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Address Line 2</Form.Label>
      <Form.Control
        type="text"
        name="user_addressline2"
        value={editableUser.user_addressline2 || ''}
        onChange={handleInputChange}
        placeholder="Address Line 2"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>City</Form.Label>
      <Form.Control
        type="text"
        name="user_city"
        value={editableUser.user_city || ''}
        onChange={handleInputChange}
        placeholder="City"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Zip Code</Form.Label>
      <Form.Control
        type="text"
        name="user_zipcode"
        value={editableUser.user_zipcode || ''}
        onChange={handleInputChange}
        placeholder="Zip Code"
      />
    </Form.Group>

    <Form.Group>
      <Form.Label>Phone 2</Form.Label>
      <Form.Control
        type="tel"
        name="user_phone2"
        value={editableUser.user_phone2 || ''}
        onChange={handleInputChange}
        placeholder="Phone 2"
      />
    </Form.Group>
   
      <Button type="submit" className="mr-2">Save</Button>
      <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
    </Form>
  );

  const renderViewMode = () => (
    <Card>
      <Card.Body>
        <Card.Title>{editableUser.user_firstname} {editableUser.user_lastname}</Card.Title>
        <Card.Text>
          <strong>Phone 1:</strong> {editableUser.user_phone1}<br/>
          <strong>Email:</strong> {editableUser.user_email}<br/>
          <strong>Address Line 1:</strong> {editableUser.user_addressline1}<br/>
          <strong>Address Line 2:</strong> {editableUser.user_addressline2}<br/>
          <strong>City:</strong> {editableUser.user_city}<br/>
          <strong>Zip Code:</strong> {editableUser.user_zipcode}<br/>
          <strong>Phone 2:</strong> {editableUser.user_phone2}
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

