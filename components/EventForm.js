'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EventForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: {
      name: '',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    },
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'locationName') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          name: value
        }
      });
    } else if (name === 'latitude' || name === 'longitude') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          coordinates: {
            ...formData.location.coordinates,
            [name]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Selected file must be an image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size must be less than 5MB.');
      return;
    }
    
    setImageFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Combine date and time
    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    // Validation
    if (!formData.title || !formData.date || !formData.time || !formData.location.name || !formData.description) {
      setError('Please fill out all required fields.');
      return;
    }
    
    if (isNaN(dateTime.getTime())) {
      setError('Please provide a valid date and time.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      setUploadProgress(0);
      
      // Create form data object for submission
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('date', dateTime.toISOString());
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('description', formData.description);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      // Submit the form with error handling
      const response = await fetch('/api/events/create', {
        method: 'POST',
        body: submitData,
      });
      
      // Check if the response is ok before trying to parse JSON
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          // Try to parse JSON error message
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
          } catch (jsonError) {
            // If JSON parsing fails, use status text
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        } else {
          // If not JSON response, use status text
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      // Check if there's content before parsing JSON
      const text = await response.text();
      const result = text ? JSON.parse(text) : { id: 'new-event' }; // Fallback ID if empty response
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        location: {
          name: '',
          coordinates: {
            latitude: '',
            longitude: ''
          }
        },
        description: ''
      });
      setImageFile(null);
      setImagePreview(null);
      
      // Redirect to the new event page after a short delay
      setTimeout(() => {
        router.push(`/events/${result.id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 p-4 rounded-lg text-green-700">
          Event created successfully! Redirecting to the event page...
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          required
          placeholder="Enter event title"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="time" className="form-label">
            Time *
          </label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="locationName" className="form-label">
          Location *
        </label>
        <input
          type="text"
          id="locationName"
          name="locationName"
          value={formData.location.name}
          onChange={handleChange}
          className="form-input"
          required
          placeholder="Enter location name"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="latitude" className="form-label">
            Latitude (optional)
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.location.coordinates.latitude}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. 37.7749"
            step="any"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="longitude" className="form-label">
            Longitude (optional)
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.location.coordinates.longitude}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. -122.4194"
            step="any"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          required
          rows="5"
          placeholder="Enter event description"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Event Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="form-input"
        />
        <p className="text-sm text-gray-500 mt-1">
          Maximum file size: 5MB. Recommended dimensions: 1200x630px.
        </p>
      </div>
      
      {imagePreview && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700">Image Preview</h3>
          <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Event image preview"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      )}
      
      {isSubmitting && uploadProgress > 0 && (
        <div className="w-full">
          <div className="text-sm font-medium text-gray-700 mb-1">
            Uploading image: {uploadProgress}%
          </div>
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}