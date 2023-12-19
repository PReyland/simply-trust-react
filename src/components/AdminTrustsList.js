import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import AdminCard from './AdminCard';

export default function AdminTrustsList({}) {
    const [trusts, setTrusts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrusts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/trusts/');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setTrusts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrusts();
    }, []);
    console.log(trusts)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    <div className="card-grid-container">
    <Masonry
        breakpointCols={1}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">
        {trusts.map(dataObject => (
          <div key={dataObject.id} className="masonry-item">
            <AdminCard dataObject={dataObject} />
          </div>
        ))}
      </Masonry>
        </div>
    );
}

