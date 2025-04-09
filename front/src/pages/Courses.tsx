import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { CourseDto } from "../types";
import { Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";

export const Courses = () => {
    const [courses, setCourses] = useState<CourseDto[]>([]);
    const [title, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [isTeacher, setIsTeacher] = useState(false);
    const navigate = useNavigate();

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

    const fetchCourses = async () => {
        const { data } = await api.get<Set<CourseDto>>("/courses");
        setCourses(Array.from(data));
        setLoading(false);
    };

    useEffect(() => {
        setIsTeacher(getUserRole() === "TEACHER");
        fetchCourses();
    }, []);

    const createCourse = async () => {
        if (!title) return;
        await api.post("/courses/create", { title, description });
        setName("");
        setDescription("");
        fetchCourses();
    };


    return (
        <div className="container py-4">
            <h1 className="mb-4">Мои курсы</h1>

            {isTeacher &&
            <Card className="mb-4">
                <Card.Body>
                    <Form as={Row} className="g-2 align-items-end">
                        <Col md={4}>
                            <Form.Label>Название курса</Form.Label>
                            <Form.Control value={title} onChange={(e) => setName(e.target.value)} />
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
            }

            {!isTeacher &&
                <Button className="mb-3" onClick={() => navigate("/requests")}>
                    Посмотреть заявки
                </Button>
            }

            {loading && <Spinner animation="border" />}
            <Row xs={1} md={2} lg={3} className="g-4">
                {courses.map((course) => (
                    <Col key={course.id}>
                        <Link to={`/courses/${course.id}`} className="text-decoration-none text-dark">
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{course.title}</Card.Title>
                                    <Card.Text className="text-muted">
                                        {"Без описания"}
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