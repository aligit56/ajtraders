import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful. Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Full Name</label>
            <input type="text" name="name" onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Email</label>
            <input type="email" name="email" onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Phone</label>
            <input type="text" name="phone" onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Address</label>
            <input type="text" name="address" onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Password</label>
            <input type="password" name="password" onChange={handleChange} required className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">Register</button>
        </form>
        <p className="mt-4 text-center text-lightTextSecondary dark:text-darkTextSecondary text-sm">
          Already have an account? <Link to="/login" className="text-darkBlue dark:text-cyan hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
