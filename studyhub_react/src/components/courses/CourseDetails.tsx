import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {Course} from "./Course.tsx";
import {getEndpoint} from "./ValidateRole.tsx";

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const endpoint = getEndpoint(navigate);


    const inviteStudent = async (id: bigint) => {
        try {
            const response = await fetch(`http://localhost:8080/courses/${id}/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: username
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            alert(username + ' invited!')
            window.location.reload();
        } catch (error) {
            alert('Something went wrong!')
            console.log(error);
        }
    }

    useEffect(() => {
        fetch(`http://localhost:8080/courses/id/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setCourse(data))
            .catch(err => console.error(err));
    }, [id, navigate, token, endpoint]);

    if (!course) return <div>Загрузка...</div>;

    return (
        <div style={{ margin: '50px' }}>
            <h2>{course.name}</h2>
            {endpoint == 'teacher' && (
                <><label>
                    Invite student:{' '}
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}/>
                </label>
                    <button onClick={() => inviteStudent(course?.id)}>
                        Invite
                    </button>
                </>
                )}
        </div>
    );
};

export default CourseDetailsPage;

