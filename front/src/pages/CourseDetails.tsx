import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { CourseDto, MaterialDto } from "../types";
import { Card, Button, Form, Row, Col, ListGroup, Spinner } from "react-bootstrap";

export const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<CourseDto | null>(null);
    const [materials, setMaterials] = useState<MaterialDto[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchCourse = async () => {
        const { data } = await api.get<CourseDto>(`/courses/${id}`);
        setCourse(data);
    };

    const fetchMaterials = async () => {
        const { data } = await api.get<MaterialDto[]>(`/materials/${id}`);
        setMaterials(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCourse();
        fetchMaterials();
    }, [id]);

    const uploadMaterial = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("title", title || file.name);
        formData.append("type", "FILE");
        formData.append("file", file);
        await api.post(`/materials/${id}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setFile(null);
        setTitle("");
        fetchMaterials();
    };

    return (
        <div className="container py-4">
            {course && (
                <>
                    <h1 className="mb-3">{course.title}</h1>
                    {course.description && <p className="text-muted">{course.description}</p>}
                </>
            )}

            <Card className="mb-4">
                <Card.Body>
                    <h5 className="mb-3">Загрузить материал</h5>
                    <Form as={Row} className="g-2 align-items-end">
                        <Col md={4}>
                            <Form.Label>Название</Form.Label>
                            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Col>
                        <Col md={4}>
                            <Form.Label>Файл</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFile(e.target.files?.[0] ?? null)}
                            />
                        </Col>
                        <Col md="auto">
                            <Button onClick={uploadMaterial} disabled={!file}>Загрузить</Button>
                        </Col>
                    </Form>
                </Card.Body>
            </Card>

            <h4 className="mb-3">Материалы</h4>
            {loading && <Spinner animation="border" />}
            <ListGroup>
                {materials.map((m) => (
                    <ListGroup.Item key={m.id} className="d-flex justify-content-between align-items-center">
                        {m.title}
                        {m.filename && (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => window.open(`/api/materials/${id}/download/${m.filename}`, "_blank")}
                            >
                                Скачать
                            </Button>
                        )}
                    </ListGroup.Item>
                ))}
                {materials.length === 0 && !loading && <div className="text-muted">Материалы отсутствуют.</div>}
            </ListGroup>
        </div>
    );
};