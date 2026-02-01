import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    status: 'draft'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationMessages, setValidationMessages] = useState({});
  const [originalCourse, setOriginalCourse] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await courseAPI.getCourse(id);
      const course = response.data.data.course;

      // Check if user has permission to edit this course
      const canEdit = user.role === 'admin' ||
        course.createdBy.id === user.id ||
        course.instructors.some(instructor => instructor.id === user.id);

      if (!canEdit) {
        setError('You do not have permission to edit this course.');
        return;
      }

      setOriginalCourse(course);
      setFormData({
        title: course.title || '',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        code: course.code || '',
        credits: course.credits || 3,
        level: course.level || 'beginner',
        durationWeeks: course.durationWeeks || 12,
        isFree: course.isFree || false,
        price: course.price || 0,
        currency: course.currency || 'GHS',
        maxStudents: course.maxStudents || 30,
        status: course.status || 'draft'
      });

    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.message || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
      let newValue;

      // Handle different input types and ensure proper data types
      if (type === 'checkbox') {
        newValue = checked;
      } else if (type === 'number') {
        newValue = value === '' ? 0 : parseInt(value) || parseFloat(value) || 0;
      } else if (name === 'code') {
        // Ensure course code is uppercase and valid format
        newValue = value.toUpperCase().replace(/[^A-Z0-9\\-]/g, '');
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
    setSaving(true);
    setError('');
    setSuccess('');
    setValidationMessages({});

    // Validation checks
    const newValidationMessages = {};

    if (!formData.title || formData.title.trim().length < 5 || formData.title.trim().length > 200) {
      newValidationMessages.title = 'Title must be between 5-200 characters.';
    }

    if (!formData.description || formData.description.trim().length < 10 || formData.description.trim().length > 2000) {
      newValidationMessages.description = 'Description must be between 10-2000 characters.';
    }

    const cleanCode = formData.code.replace(/[^A-Z0-9\\-]/g, '');
    if (!cleanCode || cleanCode.length < 3 || cleanCode.length > 20) {
      newValidationMessages.code = 'Code must be between 3-20 characters.';
    }

    if (formData.shortDescription && formData.shortDescription.trim().length > 500) {
      newValidationMessages.shortDescription = 'Short description cannot exceed 500 characters.';
    }

    if (formData.credits < 0 || formData.credits > 10) {
      newValidationMessages.credits = 'Credits must be between 0-10.';
    }

    if (formData.durationWeeks < 1 || formData.durationWeeks > 52) {
      newValidationMessages.durationWeeks = 'Duration must be between 1-52 weeks.';
    }

    if (formData.maxStudents < 1 || formData.maxStudents > 1000) {
      newValidationMessages.maxStudents = 'Max students must be between 1-1000.';
    }

    if (!formData.isFree && formData.price < 0) {
      newValidationMessages.price = 'Price cannot be negative.';
    }

    if (formData.isFree && formData.price > 0) {
      newValidationMessages.price = 'Price must be 0 for free courses.';
    }

    if (Object.keys(newValidationMessages).length > 0) {
      setValidationMessages(newValidationMessages);
      setSaving(false);
      return;
    }

    try {
      // Prepare the data for submission
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription ? formData.shortDescription.trim() : undefined,
        code: formData.code.toUpperCase().replace(/[^A-Z0-9\\-]/g, ''),
        credits: parseInt(formData.credits) || 3,
        level: formData.level,
        durationWeeks: parseInt(formData.durationWeeks) || 12,
        maxStudents: parseInt(formData.maxStudents) || 30,
        price: formData.isFree ? 0 : parseFloat(formData.price) || 0,
        isFree: Boolean(formData.isFree),
        currency: formData.currency,
        status: formData.status
      };

      console.log('Updating course:', submissionData);

      await courseAPI.updateCourse(id, submissionData);
      setSuccess('Course updated successfully!');

      // Redirect after successful update
      setTimeout(() => {
        navigate(`/courses/${id}`);
      }, 2000);

    } catch (err) {
      console.error('Course update error:', err);
      const errorData = err.response?.data;
      if (errorData?.validationDetails) {
        const validationErrors = errorData.validationDetails.map(error =>
          `${error.field}: ${error.message}`
        ).join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else {
        setError(errorData?.message || 'Failed to update course');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      await courseAPI.deleteCourse(id);
      setSuccess('Course deleted successfully!');

      setTimeout(() => {
        navigate('/courses');
      }, 1500);

    } catch (err) {
      console.error('Course delete error:', err);
      setError('Failed to delete course');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="course-edit-container">
        <div className="loading">Loading course...</div>
      </div>
    );
  }

  if (error && !originalCourse) {
    return (
      <div className="course-edit-container">
        <div className="error-message">
          <p>{error}</p>
          <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-edit-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/courses">Courses</Link>
        <span> / </span>
        <Link to={`/courses/${id}`}>{originalCourse?.title}</Link>
        <span> / </span>
        <span>Edit</span>
      </nav>

      <div className="course-edit-header">
        <h2>Edit Course</h2>
        <div className="header-actions">
          <Link to={`/courses/${id}`} className="btn btn-outline">
            Cancel
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={saving}
          >
            Delete Course
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="course-form">
        {/* Basic Information */}
        <section className="form-section">
          <h3>Basic Information</h3>

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
              <small className="form-help">Letters, numbers, and hyphens only</small>
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
        </section>

        {/* Course Details */}
        <section className="form-section">
          <h3>Course Details</h3>

          <div className="form-row">
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
          </div>
        </section>

        {/* Pricing */}
        <section className="form-section">
          <h3>Pricing</h3>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="GHS">GHS (Ghana Cedis)</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="form-section">
          <h3>Publication Status</h3>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <small className="form-help">
              Published courses are visible to students for enrollment
            </small>
          </div>
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <Link to={`/courses/${id}`} className="btn btn-outline">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEdit;
