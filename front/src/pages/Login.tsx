import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import axios from "axios";
import { JwtResponse } from "../types";
import { Card, Button, Form, Alert } from "react-bootstrap";

export const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const { data } = await api.post<JwtResponse>("/auth", { username, password });
            localStorage.setItem("token", data.token);
            navigate("/courses");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const msg =
                    (typeof err.response?.data === "string" && err.response.data) ||
                    "Ошибка авторизации";
                setError(msg);
            } else {
                setError("Ошибка авторизации");
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Card style={{ width: 380 }} className="shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">Вход</Card.Title>
                    {error && <Alert variant="danger">{error}</Alert>}
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
                        <Button type="submit" className="w-100">
                            Войти
                        </Button>
                    </Form>
                    <div className="text-center mt-3">
                        Нет аккаунта? <Link to="/register">Регистрация</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};