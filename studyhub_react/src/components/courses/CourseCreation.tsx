import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import {getEndpoint} from "./ValidateRole";

const CourseCreation : React.FC = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();
    // const endpoint = getEndpoint(navigate);
    const token = localStorage.getItem('jwt');
    const id = 0;

    const createCourse = async () => {
        try {
            const response = await fetch(`http://localhost:8080/courses/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id,  name})
            });

            if (!response.ok) {
                throw new Error('Error creating course');
            }

            alert('Created successfully!');
            navigate('/courses')

        } catch (error) {
            console.error(error);
            alert('Creating new course failed');
        }
    }

    return (
        <div style={{ margin: '50px' }}>
            <h1>Create new course</h1>
            <div>
                <label>
                    Name of course:{' '}
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </label>
            </div>

            <button onClick={createCourse}>Submit</button>
        </div>
    );
};

export default CourseCreation;
