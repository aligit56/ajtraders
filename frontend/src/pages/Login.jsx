import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success('Logged in successfully');
      
      const redirect = searchParams.get('redirect');
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect ? `/${redirect}` : '/');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6 text-lightBlue dark:text-aqua text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-lightTextSecondary dark:text-darkTextSecondary mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-field" />
          </div>
          <button type="submit" className="btn-primary w-full mt-4">Login</button>
        </form>
        <p className="mt-4 text-center text-lightTextSecondary dark:text-darkTextSecondary text-sm">
          Don't have an account? <Link to="/register" className="text-darkBlue dark:text-cyan hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
