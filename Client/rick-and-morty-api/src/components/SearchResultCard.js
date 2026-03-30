import React from 'react';

const SearchResultCard = ({ character }) => {
  const { name, status, species, gender, location, image } = character;

  return (
    <div className="rm-character-card">
      <img src={image} alt={name} className="rm-character-image" />
      <div className="rm-character-meta">
        <div className="rm-character-title">{name}</div>
        <p>Status: {status}</p>
        <p>Species: {species}</p>
        <p>Gender: {gender}</p>
        <p>Location: {location?.name || "Unknown"}</p>
      </div>
    </div>
  );
};

export default SearchResultCard;
