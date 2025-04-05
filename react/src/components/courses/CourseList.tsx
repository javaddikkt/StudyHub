import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {Course} from "./Course";
import {getEndpoint} from "./ValidateRole";

const CoursesPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const navigate = useNavigate();
    const endpoint = getEndpoint(navigate);
    const token = localStorage.getItem('jwt');

    const goToInvitations = () => {
        navigate("/invitations");
    }

    const goToCourseCreation = () => {
        navigate("/createCourse");
    }

    useEffect(() => {

        fetch(`http://localhost:8080/courses`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                return response.json();
            })
            .then(data => {
                setCourses(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [navigate, endpoint, token]);

    return (
        <div style={{margin: '50px'}}>
            <h2>My Courses</h2>
            {endpoint == 'student' && (
                <button onClick={goToInvitations}>
                    Invitations
                </button>
            )}
            {endpoint == 'teacher' && (
                <button onClick={goToCourseCreation}>
                    Create new course
                </button>
            )}
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <Link to={`/courses/${course.id}`}>{course.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoursesPage;
