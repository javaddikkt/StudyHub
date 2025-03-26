import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch('http://localhost:8080/registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    confirmPassword,
                    role
                })
            });

            const message = await response.text();

            if (response.status === 201) {
                alert('Пользователь успешно зарегистрирован');
                navigate('/login');
            } else {
                alert(`Ошибка: ${message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка при регистрации');
        }
    };

    return (
        <div style={{ margin: '50px' }}>
            <h2>Регистрация</h2>
            <div>
                <label>
                    Имя пользователя:
                    <input value={username} onChange={e => setUsername(e.target.value)} />
                </label>
            </div>
            <div>
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Повтор пароля:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Роль:
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="STUDENT">Ученик</option>
                        <option value="TEACHER">Учитель</option>
                    </select>
                </label>
            </div>
            <button onClick={handleRegister}>Зарегистрироваться</button>
        </div>
    );
};

export default RegisterPage;
