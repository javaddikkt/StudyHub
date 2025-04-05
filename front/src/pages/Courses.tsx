import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { CourseDto } from "../types";
import { Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";

export const Courses = () => {
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        const { data } = await api.get<Set<CourseDto>>("/courses");
        setCourses(Array.from(data));
        setLoading(false);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const createCourse = async () => {
        if (!title) return;
        await api.post("/courses/create", { title, description });
        setTitle("");
        setDescription("");
        fetchCourses();
    };

    return (
        <div className="container py-4">
            <h1 className="mb-4">Мои курсы</h1>

            <Card className="mb-4">
                <Card.Body>
                    <Form as={Row} className="g-2 align-items-end">
                        <Col md={4}>
                            <Form.Label>Название курса</Form.Label>
                            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Col>
                        <Col md={5}>
                            <Form.Label>Описание</Form.Label>
                            <Form.Control value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Col>
                        <Col md="auto">
                            <Button onClick={createCourse}>Создать</Button>
                        </Col>
                    </Form>
                </Card.Body>
            </Card>

            {loading && <Spinner animation="border" />}
            <Row xs={1} md={2} lg={3} className="g-4">
                {courses.map((course) => (
                    <Col key={course.id}>
                        <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {course.description || "Без описания"}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};