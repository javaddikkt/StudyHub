import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import axios from "axios";
import { Card, Button, Form, Alert } from "react-bootstrap";

export const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await api.post("/auth/registration", { username, password, confirmPassword });
            setSuccess("Регистрация прошла успешно! Войдите в систему.");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const msg =
                    (typeof err.response?.data === "string" && err.response.data) ||
                    "Ошибка регистрации";
                setError(msg);
            } else {
                setError("Ошибка регистрации");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card style={{ width: 380 }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Регистрация</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Повторите пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" className="w-100">
                            Зарегистрироваться
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};
