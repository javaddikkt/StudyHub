import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import api from "../api";
import {CourseDetailsDto, MaterialDto} from "../types";
import {Card, Button, Form, Row, Col, ListGroup, Spinner} from "react-bootstrap";

export const CourseDetails = () => {
    const {id} = useParams();
    const [course, setCourse] = useState<CourseDetailsDto>();
    const [materials, setMaterials] = useState<MaterialDto[]>([]);
    const [data, setData] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(true);
    const [isTeacher, setIsTeacher] = useState(false);
    const [materialType, setMaterialType] = useState("TEXT");

    function getUserRole(): string | null {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.role || null;
        } catch {
            return null;
        }
    }

    const fetchCourse = async () => {
        const {data} = await api.get<CourseDetailsDto>(`/courses/${id}`);
        setCourse(data);
    };

    const fetchMaterials = async () => {
        const {data} = await api.get<MaterialDto[]>(`/materials/${id}`);
        setMaterials(data);
        setLoading(false);
    };

    useEffect(() => {
        setIsTeacher(getUserRole() === "TEACHER");
        fetchCourse();
        fetchMaterials();
    }, [id]);

    const inviteStudent = async () => {
        if (!course) return;
        await api.post(`/requests/${course.id}/invite`, username, {
            headers: {
                "Content-Type": "text/plain",
            }
        })
        setUsername("");
        fetchCourse();
    };


    const uploadFile = async () => {
        if (!file && !data) return;
        const formData = new FormData();
        if (file) {
            formData.append("title", title || file.name);
            formData.append("type", materialType);
            formData.append("file", file);
            await api.post(`/materials/${id}/upload`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
        } else {
            formData.append("title", title);
            formData.append("type", materialType);
            formData.append("data", data);
            await api.post(`/materials/${id}/upload`, formData);
        }
        setFile(null);
        setTitle("");
        setData("");
        fetchMaterials();
    };

    const downloadMaterial = async (courseID: number, filename: string) => {
        try {
            const response = await api.get(
                `/materials/${courseID}/download/${filename}`,
                {responseType: 'blob'}
            );

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Ошибка при скачивании файла:", error);
        }
    };

    return (
        <div className="container py-4">
            {course && (
                <>
                    <h1 className="mb-3">{course.title}</h1>
                    {course.teacherUsername && <p className="text-muted">{course.teacherUsername}</p>}
                </>
            )}

            {isTeacher && course &&
                <Card className="mb-4">
                    <Card.Body>
                        <h5 className="mb-3">Загрузить материал</h5>
                        <Form as={Row} className="g-2 align-items-end">
                            <Col md={4}>
                                <Form.Label>Название</Form.Label>
                                <Form.Control value={title} onChange={(e) => setTitle(e.target.value)}/>
                            </Col>
                            <Col>
                                <Form.Label>Тип материала</Form.Label>
                                <Form.Select value={materialType} onChange={(e) => setMaterialType(e.target.value)}>
                                    <option value="TEXT">Текст</option>
                                    <option value="LINK">Ссылка</option>
                                    <option value="FILE">Файл</option>
                                </Form.Select>
                            </Col>
                            {materialType === "FILE" &&
                                <Col md={4}>
                                    <Form.Label>Файл</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setFile(e.target.files?.[0] ?? null)}
                                    />
                                </Col>
                            }
                            {materialType !== "FILE" &&
                                <Col md={4}>
                                    <Form.Label>Текст или ссылка</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={1}
                                        value={data}
                                        onChange={(e) => setData(e.target.value)}
                                    />
                                </Col>
                            }
                            <Col md="auto">
                                <Button onClick={uploadFile} disabled={!file && !data}>Загрузить</Button>
                            </Col>
                        </Form>
                    </Card.Body>

                    <Card.Body>
                        <h5 className="mb-3">Пригласить ученика</h5>
                        <Form as={Row} className="g-2 align-items-end">
                            <Col md={4}>
                                <Form.Label>Ник ученика</Form.Label>
                                <Form.Control value={username} onChange={(e) => setUsername(e.target.value)}/>
                            </Col>
                            <Col md="auto">
                                <Button onClick={inviteStudent} disabled={!username}>Отправить приглашение</Button>
                            </Col>
                        </Form>
                    </Card.Body>
                </Card>
            }

            <h4 className="mb-3">Материалы</h4>
            {loading && <Spinner animation="border"/>}
            {course &&
                <ListGroup>
                    {materials.map((m) => (
                        <ListGroup.Item key={m.title} className="d-flex justify-content-between align-items-center">
                            {m.title}
                            {m.type === "FILE" && (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => downloadMaterial(course.id, m.data)}
                                >
                                    Скачать
                                </Button>
                            )}
                            {m.type === "LINK" && (
                                <a href={m.data} target="_blank" rel="noopener noreferrer">
                                    {m.data}
                                </a>
                            )}
                            {m.type === "TEXT" && (
                                m.data
                            )}
                        </ListGroup.Item>
                    ))}
                    {materials.length === 0 && !loading && <div className="text-muted">Материалы отсутствуют.</div>}
                </ListGroup>
            }
        </div>
    );
};