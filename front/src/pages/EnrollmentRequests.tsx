import { useEffect, useState } from "react";
import api from "../api";
import { EnrollmentRequestDto } from "../types";
import { Button, ListGroup, Spinner } from "react-bootstrap";

export const EnrollmentRequests = () => {
    const [requests, setRequests] = useState<EnrollmentRequestDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        const { data } = await api.get<EnrollmentRequestDto[]>("/requests");
        setRequests(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const confirm = async (id: number) => {
        await api.post(`/requests/${id}/confirm`);
        fetchRequests();
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4">Запросы на зачисление</h1>
            {loading && <Spinner animation="border" />}
            <ListGroup>
                {requests.map((req) => (
                    <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                        Пользователь <strong>{req.studentUsername}</strong> просится в курс №{req.courseId}
                        {req.status === "PENDING" ? (
                            <Button size="sm" onClick={() => confirm(req.id)}>Подтвердить</Button>
                        ) : (
                            <span className="text-muted small">{req.status}</span>
                        )}
                    </ListGroup.Item>
                ))}
                {requests.length === 0 && !loading && <div className="text-muted">Нет активных запросов.</div>}
            </ListGroup>
        </div>
    );
};