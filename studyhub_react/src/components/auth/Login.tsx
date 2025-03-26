import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            const token = data.token;
            localStorage.setItem('jwt', token);

            navigate('/courses');

        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div style={{ margin: '50px' }}>
            <h1>Login</h1>
            <div>
                <label>
                    Username:{' '}
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    Password:{' '}
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>
            </div>

            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
