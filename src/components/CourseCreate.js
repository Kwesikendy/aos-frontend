import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseAPI, adminAPI } from '../services/api';

const CourseCreate = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    code: '',
    credits: 3,
    level: 'beginner',
    durationWeeks: 12,
    isFree: false,
    price: 0,
    currency: 'GHS',
    maxStudents: 30,
    instructorIds: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationMessages, setValidationMessages] = useState({});
  const [availableInstructors, setAvailableInstructors] = useState([]);

  React.useEffect(() => {
    const fetchInstructors = async () => {
      if (user?.role === 'admin') {
        try {
          const response = await adminAPI.getUsers({ role: 'teacher', limit: 100 });
          if (response.data.success) {
            setAvailableInstructors(response.data.data.users);
          }
        } catch (error) {
          console.error('Failed to fetch instructors:', error);
        }
      }
    };
    fetchInstructors();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      let newValue;

      // Handle different input types and ensure proper data types
      if (type === 'checkbox') {
        newValue = checked;
      } else if (type === 'number') {
        // Convert to number for numeric fields
        newValue = value === '' ? 0 : parseInt(value) || parseFloat(value) || 0;
      } else if (name === 'code') {
        // Ensure course code is uppercase and valid format
        newValue = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
      } else {
        newValue = value;
      }

      const newFormData = {
        ...prev,
        [name]: newValue
      };

      // If "Free Course" is checked, automatically set price to 0
      if (name === 'isFree' && checked) {
        newFormData.price = 0;
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationMessages({}); // Reset validation messages

    console.log('Submitting course data:', formData); // Log form data

    // Validation checks
    const newValidationMessages = {};

    // Title validation
    if (!formData.title || formData.title.trim().length < 5 || formData.title.trim().length > 200) {
      newValidationMessages.title = 'Title must be between 5-200 characters.';
    }

    // Description validation
    if (!formData.description || formData.description.trim().length < 10 || formData.description.trim().length > 2000) {
      newValidationMessages.description = 'Description must be between 10-2000 characters.';
    }

    // Course code validation - clean the code first
    const cleanCode = formData.code.replace(/[^A-Z0-9-]/g, '');
    if (!cleanCode || cleanCode.length < 3 || cleanCode.length > 20) {
      newValidationMessages.code = 'Code must be between 3-20 characters (spaces will be removed).';
    }

    // Short description validation (if provided)
    if (formData.shortDescription && formData.shortDescription.trim().length > 500) {
      newValidationMessages.shortDescription = 'Short description cannot exceed 500 characters.';
    }

    // Credits validation
    if (formData.credits < 0 || formData.credits > 10) {
      newValidationMessages.credits = 'Credits must be between 0-10.';
    }

    // Duration validation
    if (formData.durationWeeks < 1 || formData.durationWeeks > 52) {
      newValidationMessages.durationWeeks = 'Duration must be between 1-52 weeks.';
    }

    // Max students validation
    if (formData.maxStudents < 1 || formData.maxStudents > 1000) {
      newValidationMessages.maxStudents = 'Max students must be between 1-1000.';
    }

    // Price validation
    if (!formData.isFree && formData.price < 0) {
      newValidationMessages.price = 'Price cannot be negative.';
    }

    // Free course price validation
    if (formData.isFree && formData.price > 0) {
      newValidationMessages.price = 'Price must be 0 for free courses.';
    }

    if (Object.keys(newValidationMessages).length > 0) {
      setValidationMessages(newValidationMessages);
      setLoading(false);
      return; // Stop submission if there are validation errors
    }

    try {
      // Prepare the data with proper types for submission
      const submissionData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription ? formData.shortDescription.trim() : undefined,
        code: formData.code.toUpperCase().replace(/[^A-Z0-9-]/g, ''),
        credits: parseInt(formData.credits) || 3,
        durationWeeks: parseInt(formData.durationWeeks) || 12,
        maxStudents: parseInt(formData.maxStudents) || 30,
        price: formData.isFree ? 0 : parseFloat(formData.price) || 0,
        price: formData.isFree ? 0 : parseFloat(formData.price) || 0,
        isFree: Boolean(formData.isFree),
        instructorIds: formData.instructorIds
      };

      console.log('Submitting course data:', submissionData); // Debug log

      const response = await courseAPI.createCourse(submissionData);
      console.log('✅ API Response:', response);
      console.log('✅ Response status:', response.status);
      console.log('✅ Response data:', response.data);

      // Clear any existing errors
      setError('');
      setValidationMessages({});

      // Show success message
      setSuccess(`Course "${submissionData.title}" created successfully!`);
      console.log('✅ Success message set!');

      // Reset form after a short delay so user can see the success message
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          shortDescription: '',
          code: '',
          credits: 3,
          level: 'beginner',
          durationWeeks: 12,
          isFree: false,
          price: 0,
          currency: 'GHS',
          maxStudents: 30
        });
        console.log('✅ Form reset!');
      }, 2000);
    } catch (err) {
      console.error('❌ Course creation error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error status:', err.response?.status);
      console.error('❌ Error data:', err.response?.data);

      // Clear success message on error
      setSuccess('');

      const errorData = err.response?.data;
      if (errorData?.validationDetails) {
        // Show detailed validation errors
        const validationErrors = errorData.validationDetails.map(error =>
          `${error.field}: ${error.message}`
        ).join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else if (err.response?.status === 0 || err.code === 'ERR_NETWORK') {
        setError('Network error: Cannot connect to server. Please check if the backend is running.');
      } else {
        setError(errorData?.message || err.message || 'Failed to create course');
      }

      console.error('❌ Error message set:', errorData?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only teachers and admins can create courses
  console.log('Current user in CourseCreate:', user);
  console.log('User role:', user?.role);
  console.log('Is admin:', user?.role === 'admin');
  console.log('Is teacher:', user?.role === 'teacher');

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    console.log('Access denied - user role check failed');
    return (
      <div className="error">
        <p>You are not authorized to create courses.</p>
      </div>
    );
  }

  console.log('Access granted - user has appropriate role');

  return (
    <div className="course-create-container">
      <h2>Create New Course</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              minLength="5"
              maxLength="200"
            />
            {validationMessages.title && <div className="warning">{validationMessages.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="code">Course Code *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              minLength="3"
              maxLength="20"
              placeholder="e.g., CS101"
            />
            {validationMessages.code && <div className="warning">{validationMessages.code}</div>}
            <small className="form-help">Letters, numbers, and hyphens only - spaces will be automatically removed (e.g., CS101, MATH-200)</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="2000"
            rows="4"
          />
          {validationMessages.description && <div className="warning">{validationMessages.description}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="shortDescription">Short Description</label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            maxLength="500"
            rows="2"
          />
          {validationMessages.shortDescription && <div className="warning">{validationMessages.shortDescription}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="credits">Credits</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              min="0"
              max="10"
            />
            {validationMessages.credits && <div className="warning">{validationMessages.credits}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="level">Level</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="durationWeeks">Duration (Weeks)</label>
            <input
              type="number"
              id="durationWeeks"
              name="durationWeeks"
              value={formData.durationWeeks}
              onChange={handleChange}
              min="1"
              max="52"
            />
            {validationMessages.durationWeeks && <div className="warning">{validationMessages.durationWeeks}</div>}
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="form-group">
            <label>Assign Instructors</label>
            <div className="instructors-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
              {availableInstructors.map(instructor => (
                <label key={instructor.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.instructorIds?.includes(instructor.id)}
                    onChange={(e) => {
                      const id = instructor.id;
                      setFormData(prev => ({
                        ...prev,
                        instructorIds: e.target.checked
                          ? [...(prev.instructorIds || []), id]
                          : (prev.instructorIds || []).filter(i => i !== id)
                      }));
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {instructor.avatar && <img src={instructor.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />}
                    <span>{instructor.firstName} {instructor.lastName}</span>
                  </div>
                </label>
              ))}
              {availableInstructors.length === 0 && <p className="text-muted">No instructors found.</p>}
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="maxStudents">Max Students</label>
            <input
              type="number"
              id="maxStudents"
              name="maxStudents"
              value={formData.maxStudents}
              onChange={handleChange}
              min="1"
              max="1000"
            />
            {validationMessages.maxStudents && <div className="warning">{validationMessages.maxStudents}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="isFree">
              <input
                type="checkbox"
                id="isFree"
                name="isFree"
                checked={formData.isFree}
                onChange={handleChange}
              />
              Free Course
            </label>
          </div>

          {!formData.isFree && (
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
              {validationMessages.price && <div className="warning">{validationMessages.price}</div>}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
    </div>
  );
};

export default CourseCreate;
