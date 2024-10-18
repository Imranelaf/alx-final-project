import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/card.css'; // Updated file name for the new styles

export default function ListingCard() {
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; 

        const fetchListings = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/properties`);
                if (isMounted) {
                    setListings(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchListings();

        return () => {
            isMounted = false; 
        };
    }, []);

    const handleClick = (id) => {
        navigate(`/listing/${id}`);
    };

    return (
        <div className="listing-container">
            {listings.map((listing) => (
                <div key={listing._id} className="listing-card" onClick={() => handleClick(listing._id)}>
                    <img 
                        className={`listing-image ${listing.images.length > 0 ? '' : 'default-image'}`} 
                        src={listing.images[0] || 'defaultImageUrl'} 
                        alt={listing.title} 
                        loading="lazy"
                    />
                    {listing.offerType === 'Rent' ? (
                        <p className='badge rent-badge'>Rent</p>
                    ) : (
                        <p className='badge sale-badge'>Sale</p>
                    )}
                    <div className="listing-info">
                        <h3 className="listing-title">{listing.title}</h3>
                        <p className="listing-address">{listing.address.street}, {listing.address.city}, {listing.address.country}</p>
                        <h2 className="listing-price">${listing.price.toLocaleString()}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
}
