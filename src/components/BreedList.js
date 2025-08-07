import React, { useState, useEffect } from 'react';
import BreedForm from './BreedForm';

const BreedList = () => {
  const [breeds, setBreeds] = useState([]);
  const [editingBreed, setEditingBreed] = useState(null);

  const fetchBreeds = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/breeds`);
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const addBreed = async (breed) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/breeds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(breed),
    });
    fetchBreeds();
  };

  const updateBreed = async (breed) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/breeds/${editingBreed.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(breed),
    });
    setEditingBreed(null);
    fetchBreeds();
  };

  const deleteBreed = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/breeds/${id}`, {
      method: 'DELETE'
    });
    fetchBreeds();
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  return (
    <div>
      <h2>Breeds</h2>
      <BreedForm
        onSubmit={editingBreed ? updateBreed : addBreed}
        initialData={editingBreed || {}}
        buttonLabel={editingBreed ? "Update Breed" : "Add Breed"}
      />
      <ul>
        {breeds.map((breed) => (
          <li key={breed.id}>
            <strong>{breed.name}</strong>: {breed.description}
            <button onClick={() => setEditingBreed(breed)}>Edit</button>
            <button onClick={() => deleteBreed(breed.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BreedList;
