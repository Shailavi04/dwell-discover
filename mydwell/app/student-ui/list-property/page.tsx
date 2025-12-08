'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../MyComponents/Footer';
import HiddenNav from '../MyComponents/HiddenNav';

const ListProperty = () => {
  const [ownerName, setOwnerName] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [rent, setRent] = useState('');
  const [amenities, setAmenities] = useState('');
  const [propertyImage, setPropertyImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPropertyListed, setIsPropertyListed] = useState(false);
  const [isAlreadyListed, setIsAlreadyListed] = useState(false);

  const router = useRouter();

  const handleOwnerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnerName(e.target.value);
  };

  const handlePropertyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyName(e.target.value);
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRent(e.target.value);
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmenities(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPropertyImage(e.target.files[0]);
    }
  };

  const handleListProperty = async () => {
    if (!ownerName || !propertyName || !rent || !amenities || !propertyImage) {
      alert('Please fill in all the details and upload an image!');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('ownerName', ownerName);
    formData.append('propertyName', propertyName);
    formData.append('rent', rent);
    formData.append('amenities', amenities);
    formData.append('image', propertyImage);

    try {
      const response = await fetch('/api/list-property', {

        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsPropertyListed(true);
        alert('Property Listed Successfully!');
        setIsLoading(false);
        router.push('/list-property'); // Redirect to property listings page
      } else {
        alert('Failed to list property');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error listing property:', error);
      alert('An error occurred while listing the property.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative"
      style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
    >
      <div className="w-full flex justify-between items-center px-6 pt-4">
        <HiddenNav />
      </div>

      <div className="w-full flex justify-center lg:justify-end px-4 mb-8">
        <div className="bg-[rgba(0,0,0,0.3)] p-8 rounded-lg shadow-md w-full max-w-md lg:absolute lg:right-40 lg:top-1/2 lg:transform lg:-translate-y-1/2 mb-20">
          <h2 className="text-4xl font-bold mb-2 text-center text-teal-500">Dwell Discover</h2>
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-950">List Your Property</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleListProperty();
            }}
          >
            <div className="mb-4">
              <label className="block text-sm text-black font-medium">Owner's Name</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={ownerName}
                onChange={handleOwnerNameChange}
                placeholder="Enter owner's name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-black font-medium">Property Name</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={propertyName}
                onChange={handlePropertyNameChange}
                placeholder="Enter property name"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-black font-medium">Monthly Rent</label>
              <input
                type="number"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={rent}
                onChange={handleRentChange}
                placeholder="Enter rent amount"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-black font-medium">Amenities</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={amenities}
                onChange={handleAmenitiesChange}
                placeholder="Enter amenities (comma separated)"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-black font-medium">Property Image</label>
              <input
                type="file"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </div>

            {isAlreadyListed && (
              <div className="mt-2">
                <p className="text-red-500 text-sm">This property is already listed!</p>
              </div>
            )}

            <button
              type="submit"
              className={`w-full mt-4 py-3 rounded-md ${
                isLoading ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-400'
              } text-white font-semibold`}
              disabled={isLoading}
            >
              {isLoading ? 'Listing Property...' : 'List Property'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ListProperty;
 