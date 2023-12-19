import React, { useState, useEffect } from 'react';

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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Trusts</h2>
            <ul>
                {trusts.map((trust, index) => (
                    <li key={index}>
                        {/* Display trust data here. Adjust based on trust object structure */}
                        Trust Name: {trust.trust_name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

