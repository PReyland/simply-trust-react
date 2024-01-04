import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function AdminCardAssetPhysical({ physicalAssetId, adminProp }) {
  const [editableAsset, setEditableAsset] = useState({});
  const [initialAsset, setInitialAsset] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchBeneficiaryData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/admin/physicalasset/${physicalAssetId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEditableAsset(data);
        setInitialAsset(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeneficiaryData();
  }, [physicalAssetId]);


  console.log(adminProp)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - Name: ${name}, Value: ${value}`);

    setEditableAsset(prev => {
        const nameParts = name.split('.');
        
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

        return { ...prev, [name]: value };
    });
};
  console.log("edit asset!", editableAsset)

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const url = `http://127.0.0.1:5555/admin/physicalasset/${physicalAssetId}`;
    const dataToPatch = {};
  
    // Handle top-level fields
    Object.keys(editableAsset).forEach(key => {
      if (editableAsset[key] !== initialAsset[key] && typeof editableAsset[key] !== 'object') {
        dataToPatch[key] = editableAsset[key];
      }
    });
  
    // Define a list of nested objects
    const nestedObjects = ['jewelry', 'house', 'car', 'art', 'other'];
  
    // Iterate over each nested object
    nestedObjects.forEach(nestedObj => {
      const nestedData = editableAsset[nestedObj];
      const initialNestedData = initialAsset[nestedObj] || {};
  
      if (nestedData) {
        Object.keys(nestedData).forEach(nestedKey => {
          if (nestedData[nestedKey] !== initialNestedData[nestedKey]) {
            // Check if dataToPatch already contains the nested object
            if (!dataToPatch[nestedObj]) {
              dataToPatch[nestedObj] = {}; // Initialize the nested object if it doesn't exist
            }
            dataToPatch[nestedObj][nestedKey] = nestedData[nestedKey]; // Update the nested object
          }
        });
      }
    });
  
    try {
      console.log('Data to patch:', dataToPatch);
  
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
  
      console.log("Physical Asset update successful");
      setIsEditing(false); // Close edit mode after successful update
    } catch (error) {
      console.error("Failed to update Physical Asset:", error);
    }
  };
  

  const renderEditMode = () => {
    switch (editableAsset.pa_type) {
      case 'Jewelry':
        return renderJewelryForm();
      case 'Car':
        return renderCarForm();
      case 'House':
        return renderHouseForm();
      case 'Art':
        return renderArtForm();
      case 'Other':
        return renderOtherForm();
      default:
        return <div>Unknown Beneficiary Type</div>;
    }
  };

const renderHouseForm = () => (
    <Form onSubmit={handleFormSubmit}>
        {/* Fields for the parent object */}
        <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" name="pa_name" value={editableAsset.pa_name || ''} onChange={handleInputChange} placeholder="Name" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Description:</Form.Label>
            <Form.Control as="textarea" name="pa_description" value={editableAsset.pa_description || ''} onChange={handleInputChange} placeholder="Description" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Note:</Form.Label>
            <Form.Control as="textarea" name="pa_note" value={editableAsset.pa_note || ''} onChange={handleInputChange} placeholder="Note" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Type:</Form.Label>
            <Form.Control type="text" name="pa_type" value={editableAsset.pa_type || ''} onChange={handleInputChange} placeholder="Type" disabled/>
        </Form.Group>

        <Form.Group>
            <Form.Label>Estimated Value:</Form.Label>
            <Form.Control type="number" name="pa_value_estimate" value={editableAsset.pa_value_estimate || ''} onChange={handleInputChange} placeholder="Estimated Value" />
        </Form.Group>

        <Form.Group>
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control 
                    type="text" 
                    name="house.pa_addressline1" 
                    value={editableAsset.house?.pa_addressline1 || ''} 
                    onChange={handleInputChange} 
                    placeholder="Address Line 1" 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control 
                    type="text" 
                    name="house.pa_addressline2" 
                    value={editableAsset.house?.pa_addressline2 || ''} 
                    onChange={handleInputChange} 
                    placeholder="Address Line 2" 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control 
                    type="text" 
                    name="house.pa_city" 
                    value={editableAsset.house?.pa_city || ''} 
                    onChange={handleInputChange} 
                    placeholder="City" 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Primary Residence</Form.Label>
                <Form.Check 
                    type="checkbox" 
                    name="house.pa_primary" 
                    checked={editableAsset.house?.pa_primary || false} 
                    onChange={e => handleInputChange({...e, target: {...e.target, value: e.target.checked}})} 
                    label="Is this the primary residence?" 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Year Built</Form.Label>
                <Form.Control 
                    type="number" 
                    name="house.pa_year" 
                    value={editableAsset.house?.pa_year || ''} 
                    onChange={handleInputChange} 
                    placeholder="Year Built" 
                />
            </Form.Group>

            <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control 
                    type="text" 
                    name="house.pa_zipcode" 
                    value={editableAsset.house?.pa_zipcode || ''} 
                    onChange={handleInputChange} 
                    placeholder="Zip Code" 
                />
            </Form.Group>

        <Button type="submit" className="mr-2">Save</Button>
        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
    </Form>
);

const renderCarForm = () => (
    <Form onSubmit={handleFormSubmit}>
    {/* Fields for the parent object */}
    <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control type="text" name="pa_name" value={editableAsset.pa_name || ''} onChange={handleInputChange} placeholder="Name" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control as="textarea" name="pa_description" value={editableAsset.pa_description || ''} onChange={handleInputChange} placeholder="Description" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Note:</Form.Label>
        <Form.Control as="textarea" name="pa_note" value={editableAsset.pa_note || ''} onChange={handleInputChange} placeholder="Note" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Type:</Form.Label>
        <Form.Control type="text" name="pa_type" value={editableAsset.pa_type || ''} onChange={handleInputChange} placeholder="Type" disabled />
    </Form.Group>

    <Form.Group>
        <Form.Label>Estimated Value:</Form.Label>
        <Form.Control type="number" name="pa_value_estimate" value={editableAsset.pa_value_estimate || ''} onChange={handleInputChange} placeholder="Estimated Value" />
    </Form.Group>

    <Form.Group>
                <Form.Label>License Plate</Form.Label>
                <Form.Control type="text" name="car.pa_license" value={editableAsset.car?.pa_license || ''} onChange={handleInputChange} placeholder="License Plate" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Make</Form.Label>
                <Form.Control type="text" name="car.pa_make" value={editableAsset.car?.pa_make || ''} onChange={handleInputChange} placeholder="Make" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Model</Form.Label>
                <Form.Control type="text" name="car.pa_model" value={editableAsset.car?.pa_model || ''} onChange={handleInputChange} placeholder="Model" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control type="number" name="car.pa_year" value={editableAsset.car?.pa_year || ''} onChange={handleInputChange} placeholder="Year" />
            </Form.Group>

    <Button type="submit" className="mr-2">Save</Button>
    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
</Form>

);
  
const renderJewelryForm = () => (
    <Form onSubmit={handleFormSubmit}>
        {/* Fields for the parent object */}
        <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" name="pa_name" value={editableAsset.pa_name || ''} onChange={handleInputChange} placeholder="Name" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Description:</Form.Label>
            <Form.Control as="textarea" name="pa_description" value={editableAsset.pa_description || ''} onChange={handleInputChange} placeholder="Description" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Note:</Form.Label>
            <Form.Control as="textarea" name="pa_note" value={editableAsset.pa_note || ''} onChange={handleInputChange} placeholder="Note" />
        </Form.Group>
       
        <Form.Group>
        <Form.Label>Type:</Form.Label>
        <Form.Control type="text" name="pa_type" value={editableAsset.pa_type || ''} onChange={handleInputChange} placeholder="Type" disabled />
    </Form.Group>

        <Form.Group>
            <Form.Label>Estimated Value:</Form.Label>
            <Form.Control type="number" name="pa_value_estimate" value={editableAsset.pa_value_estimate || ''} onChange={handleInputChange} placeholder="Estimated Value" />
        </Form.Group>

        {/* Fields for the 'jewelry' sub-object */}
        <Form.Group>
            <Form.Label>Certification:</Form.Label>
            <Form.Control type="text" name="jewelry.pa_certification" value={editableAsset.jewelry?.pa_certification || ''} onChange={handleInputChange} placeholder="Certification" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Gemstone:</Form.Label>
            <Form.Control type="text" name="jewelry.pa_gemstone" value={editableAsset.jewelry?.pa_gemstone || ''} onChange={handleInputChange} placeholder="Gemstone" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Make:</Form.Label>
            <Form.Control type="text" name="jewelry.pa_make" value={editableAsset.jewelry?.pa_make || ''} onChange={handleInputChange} placeholder="Make" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Metal:</Form.Label>
            <Form.Control type="text" name="jewelry.pa_metal" value={editableAsset.jewelry?.pa_metal || ''} onChange={handleInputChange} placeholder="Metal" />
        </Form.Group>

        <Form.Group>
            <Form.Label>Year:</Form.Label>
            <Form.Control type="number" name="jewelry.pa_year" value={editableAsset.jewelry?.pa_year || ''} onChange={handleInputChange} placeholder="Year" />
        </Form.Group>

        <Button type="submit" className="mr-2">Save</Button>
        <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
    </Form>
);

const renderArtForm = () => (

    <Form onSubmit={handleFormSubmit}>
    {/* Fields for the parent object */}
    <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control type="text" name="pa_name" value={editableAsset.pa_name || ''} onChange={handleInputChange} placeholder="Name" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control as="textarea" name="pa_description" value={editableAsset.pa_description || ''} onChange={handleInputChange} placeholder="Description" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Note:</Form.Label>
        <Form.Control as="textarea" name="pa_note" value={editableAsset.pa_note || ''} onChange={handleInputChange} placeholder="Note" />
    </Form.Group>
   
    <Form.Group>
        <Form.Label>Type:</Form.Label>
        <Form.Control type="text" name="pa_type" value={editableAsset.pa_type || ''} onChange={handleInputChange} placeholder="Type" disabled />
    </Form.Group>

    <Form.Group>
        <Form.Label>Estimated Value:</Form.Label>
        <Form.Control type="number" name="pa_value_estimate" value={editableAsset.pa_value_estimate || ''} onChange={handleInputChange} placeholder="Estimated Value" />
    </Form.Group>

    <Form.Group>
                <Form.Label>Certification</Form.Label>
                <Form.Control type="text" name="art.pa_certification" value={editableAsset.art?.pa_certification || ''} onChange={handleInputChange} placeholder="Certification" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Depth</Form.Label>
                <Form.Control type="number" name="art.pa_depth" value={editableAsset.art?.pa_depth || ''} onChange={handleInputChange} placeholder="Depth (in cm)" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Height</Form.Label>
                <Form.Control type="number" name="art.pa_height" value={editableAsset.art?.pa_height || ''} onChange={handleInputChange} placeholder="Height (in cm)" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Make</Form.Label>
                <Form.Control type="text" name="art.pa_make" value={editableAsset.art?.pa_make || ''} onChange={handleInputChange} placeholder="Make" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Medium</Form.Label>
                <Form.Control type="text" name="art.pa_medium" value={editableAsset.art?.pa_medium || ''} onChange={handleInputChange} placeholder="Medium" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Width</Form.Label>
                <Form.Control type="number" name="art.pa_width" value={editableAsset.art?.pa_width || ''} onChange={handleInputChange} placeholder="Width (in cm)" />
            </Form.Group>

            <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Control type="number" name="art.pa_year" value={editableAsset.art?.pa_year || ''} onChange={handleInputChange} placeholder="Year" />
            </Form.Group>

    <Button type="submit" className="mr-2">Save</Button>
    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
</Form>

);

   const renderOtherForm = () => (

    <Form onSubmit={handleFormSubmit}>
    {/* Fields for the parent object */}
    <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control type="text" name="pa_name" value={editableAsset.pa_name || ''} onChange={handleInputChange} placeholder="Name" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control as="textarea" name="pa_description" value={editableAsset.pa_description || ''} onChange={handleInputChange} placeholder="Description" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Note:</Form.Label>
        <Form.Control as="textarea" name="pa_note" value={editableAsset.pa_note || ''} onChange={handleInputChange} placeholder="Note" />
    </Form.Group>

    <Form.Group>
        <Form.Label>Type:</Form.Label>
        <Form.Control type="text" name="pa_type" value={editableAsset.pa_type || ''} onChange={handleInputChange} placeholder="Type" disabled />
    </Form.Group>

    <Form.Group>
        <Form.Label>Estimated Value:</Form.Label>
        <Form.Control type="number" name="pa_value_estimate" value={editableAsset.pa_value_estimate || ''} onChange={handleInputChange} placeholder="Estimated Value" />
    </Form.Group>

    <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="other.pa_description" value={editableAsset.other?.pa_description || ''} onChange={handleInputChange} placeholder="Description" />
        </Form.Group>

    <Button type="submit" className="mr-2">Save</Button>
    <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
</Form>

);

const renderViewMode = () => {
    switch (editableAsset.pa_type) {
      case 'Jewelry':
        return renderJewelryView();
      case 'Car':
        return renderCarView();
      case 'House':
        return renderHouseView();
      case 'Art':
        return renderArtView();
      case 'Other':
        return renderOtherView();
      default:
        return <div>Unknown Physical Asset Type</div>;
    }
};
  
     
const renderCarView = () => (
  <Card>
    <Card.Body>
      <Link to={`/admin/asset/p/${physicalAssetId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Title>{editableAsset.pa_name}</Card.Title>
      </Link>
      <Card.Text>
        <strong>Description:</strong> {editableAsset.pa_description}<br />
        <strong>Note:</strong> {editableAsset.pa_note}<br />
        <strong>Type:</strong> {editableAsset.pa_type}<br />
        <strong>Estimated Value:</strong> {editableAsset.pa_value_estimate}<br />
        <strong>License Plate:</strong> {editableAsset.car?.pa_license}<br />
        <strong>Make:</strong> {editableAsset.car?.pa_make}<br />
        <strong>Model:</strong> {editableAsset.car?.pa_model}<br />
        <strong>Year:</strong> {editableAsset.car?.pa_year}<br />
        <br></br>
        {adminProp === true && (
          <>
            <strong>Associated Trust</strong>
            <Link to={`/admin/trust/${editableAsset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{editableAsset.trust.trust_name}</h3>
            </Link>
          </>
        )}
      </Card.Text>
      <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
    </Card.Body>
  </Card>
);


        const renderHouseView = () => (
            <Card>
            <Card.Body>
            <Link to={`/admin/asset/p/${physicalAssetId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card.Title>{editableAsset.pa_name}</Card.Title>
              </Link>
              <Card.Text>
                <strong>Description:</strong> {editableAsset.pa_description}<br />
                <strong>Note:</strong> {editableAsset.pa_note}<br />
                <strong>Type:</strong> {editableAsset.pa_type}<br />
                <strong>Estimated Value:</strong> {editableAsset.pa_value_estimate}<br />
                <strong>Address Line 1:</strong> {editableAsset.house?.pa_addressline1}<br />
                <strong>Address Line 2:</strong> {editableAsset.house?.pa_addressline2}<br />
                <strong>City:</strong> {editableAsset.house?.pa_city}<br />
                <strong>Primary Residence:</strong> {editableAsset.house?.pa_primary ? 'Yes' : 'No'}<br />
                <strong>Year Built:</strong> {editableAsset.house?.pa_year}<br />
                <strong>Zip Code:</strong> {editableAsset.house?.pa_zipcode}<br />
                {adminProp === true && (
          <>
            <strong>Associated Trust</strong>
            <Link to={`/admin/trust/${editableAsset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{editableAsset.trust.trust_name}</h3>
            </Link>
          </>
        )}

              </Card.Text>
              <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
            </Card.Body>
          </Card>
        );

        const renderJewelryView = () => (
            <Card>
              <Card.Body>
              <Link to={`/admin/asset/p/${physicalAssetId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Title>{editableAsset.pa_name}</Card.Title>
                </Link>
                <Card.Text>
                  <strong>Description:</strong> {editableAsset.pa_description}<br />
                  <strong>Note:</strong> {editableAsset.pa_note}<br />
                  <strong>Type:</strong> {editableAsset.pa_type}<br />
                  <strong>Estimated Value:</strong> {editableAsset.pa_value_estimate}<br />
                  <strong>Certification:</strong> {editableAsset.jewelry?.pa_certification}<br />
                  <strong>Gemstone:</strong> {editableAsset.jewelry?.pa_gemstone}<br />
                  <strong>Make:</strong> {editableAsset.jewelry?.pa_make}<br />
                  <strong>Metal:</strong> {editableAsset.jewelry?.pa_metal}<br />
                  <strong>Year:</strong> {editableAsset.jewelry?.pa_year}<br />
                  {adminProp === true && (
          <>
            <strong>Associated Trust</strong>
            <Link to={`/admin/trust/${editableAsset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{editableAsset.trust.trust_name}</h3>
            </Link>
          </>
        )}
                </Card.Text>
                <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
              </Card.Body>
            </Card>
        );
        
        const renderArtView = () => (
            <Card>
              <Card.Body>
              <Link to={`/admin/asset/p/${physicalAssetId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Title>{editableAsset.pa_name}</Card.Title>
                </Link>
                <Card.Text>
                  <strong>Description:</strong> {editableAsset.pa_description}<br />
                  <strong>Note:</strong> {editableAsset.pa_note}<br />
                  <strong>Type:</strong> {editableAsset.pa_type}<br />
                  <strong>Estimated Value:</strong> {editableAsset.pa_value_estimate}<br />
                  <strong>Certification:</strong> {editableAsset.art?.pa_certification}<br />
                  <strong>Depth:</strong> {editableAsset.art?.pa_depth}<br />
                  <strong>Height:</strong> {editableAsset.art?.pa_height}<br />
                  <strong>Make:</strong> {editableAsset.art?.pa_make}<br />
                  <strong>Medium:</strong> {editableAsset.art?.pa_medium}<br />
                  <strong>Width:</strong> {editableAsset.art?.pa_width}<br />
                  <strong>Year:</strong> {editableAsset.art?.pa_year}<br />

                  {adminProp === true && (
          <>
            <strong>Associated Trust</strong>
            <Link to={`/admin/trust/${editableAsset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{editableAsset.trust.trust_name}</h3>
            </Link>
          </>
        )}
                </Card.Text>
                <Button variant="primary" onClick={() => setIsEditing(true)}>Edit</Button>
              </Card.Body>
            </Card>
        );
        

        const renderOtherView = () => (
            <Card>
              <Card.Body>
              <Link to={`/admin/asset/p/${physicalAssetId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Title>{editableAsset.pa_name}</Card.Title>
                </Link>
                <Card.Text>
                  <strong>Description:</strong> {editableAsset.pa_description}<br />
                  <strong>Note:</strong> {editableAsset.pa_note}<br />
                  <strong>Type:</strong> {editableAsset.pa_type}<br />
                  <strong>Estimated Value:</strong> {editableAsset.pa_value_estimate}<br />
                  <strong>Additional Description:</strong> {editableAsset.other?.pa_description}<br />

                  {adminProp === true && (
          <>
            <strong>Associated Trust</strong>
            <Link to={`/admin/trust/${editableAsset.trust.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3>{editableAsset.trust.trust_name}</h3>
            </Link>
          </>
        )}
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

