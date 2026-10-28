import { useState } from 'react';
import './App.css';

// Must match the backend endpoint: POST http://localhost:5000/api/signup
const API_URL = 'http://localhost:5000/api/signup';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setIsError(true);
        setMessage(data.message || 'Sign up failed.');
      } else {
        setIsError(false);
        setMessage('Sign Up Successful');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setIsError(true);
      setMessage('Cannot reach the server. Is the backend running on port 5000?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Sign Up</h1>
        <p className="subtitle">
          Already a member? <a href="#login">Log In</a>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign Up'}
          </button>
        </form>

        {message && <p className={isError ? 'error' : 'success'}>{message}</p>}
      </div>
    </div>
  );
}
