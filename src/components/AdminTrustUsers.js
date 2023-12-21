import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, ListGroup, Form, Button } from 'react-bootstrap';

export default function AdminTrustUsers() {
  const [users, setUsers] = useState({ owners: [], trustees: [], counsel: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  let { id } = useParams();

  useEffect(() => {
    const fetchTrustDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/trusts/${id}/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTrustDetails();
    }
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setEditableUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = `http://127.0.0.1:5555/user/${editableUser.id}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Include other headers like authorization if needed
        },
        body: JSON.stringify(editableUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUsers = { ...users };
      const userType = ['owners', 'trustees', 'counsel'].find(type => updatedUsers[type].some(u => u.id === editableUser.id));
      const userIndex = updatedUsers[userType].findIndex(u => u.id === editableUser.id);
      updatedUsers[userType][userIndex] = { ...editableUser };
      setUsers(updatedUsers);
      setEditingId(null); // Exit edit mode after updating

    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const url = `http://127.0.0.1:5555/user/${userId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        // Include headers like authorization if needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUsers = { ...users };
      Object.keys(updatedUsers).forEach(type => {
        updatedUsers[type] = updatedUsers[type].filter(user => user.id !== userId);
      });
      setUsers(updatedUsers);

    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const renderUserItem = (user, userType) => (
    <ListGroup.Item key={user.id} className="list-group-item-container">
      {editingId === user.id ? (
        <Form onSubmit={handleFormSubmit}>
          <Form.Control
            type="text"
            name="user_firstname"
            value={editableUser.user_firstname}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          <Form.Control
            type="text"
            name="user_lastname"
            value={editableUser.user_lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          <Form.Control
            type="tel"
            name="user_phone1"
            value={editableUser.user_phone1}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <Form.Control
            type="email"
            name="user_email"
            value={editableUser.user_email}
            onChange={handleInputChange}
            placeholder="Email"
          />
        <Form.Control
          type="text"
          name="user_addressline1"
          value={editableUser.user_addressline1 || ''}
          onChange={handleInputChange}
          placeholder="Address Line 1"
        />
        <Form.Control
          type="text"
          name="user_addressline2"
          value={editableUser.user_addressline2 || ''}
          onChange={handleInputChange}
          placeholder="Address Line 2"
        />
        <Form.Control
          type="text"
          name="user_city"
          value={editableUser.user_city || ''}
          onChange={handleInputChange}
          placeholder="City"
        />
        <Form.Control
          type="text"
          name="user_zipcode"
          value={editableUser.user_zipcode || ''}
          onChange={handleInputChange}
          placeholder="Zip Code"
        />
        <Form.Control
          type="tel"
          name="user_phone2"
          value={editableUser.user_phone2 || ''}
          onChange={handleInputChange}
          placeholder="Phone 2"
        />

          <Button type="submit">Save</Button>
          <Button variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
        </Form>
      ) : (
        <>
           <h3>{user.user_firstname} {user.user_lastname}</h3>
        <p>Email: {user.user_email}</p>
        <p>Phone 1: {user.user_phone1}</p>
        <p>Phone 2: {user.user_phone2}</p>
        <p>Address 1: {user.user_addressline1}</p>
        <p>Address 2: {user.user_addressline2}</p>
        <p>City: {user.user_city}</p>
        <p>Zip Code: {user.user_zipcode}</p>
        <Button onClick={() => handleEditClick(user)}>Edit</Button>
        <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
        </>
      )}
    </ListGroup.Item>
  );

  return (
    <Container className='trust-middle'>
      <h2>Users:</h2>
      <h3>Owners</h3>
      <ListGroup>
        {users.owners.map(user => renderUserItem(user, 'owners'))}
      </ListGroup>
      <h3>Trustees</h3>
      <ListGroup>
        {users.trustees.map(user => renderUserItem(user, 'trustees'))}
      </ListGroup>
      <h3>Counsel</h3>
      <ListGroup>
        {users.counsel.map(user => renderUserItem(user, 'counsel'))}
      </ListGroup>
    </Container>
  );
}
