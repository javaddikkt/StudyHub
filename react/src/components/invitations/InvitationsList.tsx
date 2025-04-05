import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {Invitation} from "./Invitation.tsx";

const CoursesPage: React.FC = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');

    const confirmInvitation = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/invitations/${id}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error enrolling course');
            }

            alert('Confirmed successfully!');
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert('Confirmation failed');
        }
    };


    useEffect(() => {
        fetch(`http://localhost:8080/invitations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    navigate('/courses');
                    throw new Error('Failed to fetch invitations');
                }
                return response.json();
            })
            .then(data => {
                setInvitations(data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [token, navigate]);

    return (
        <div style={{margin: '50px'}}>
            <h2>My Invitations</h2>
            <ul>
                {invitations.map(invitation => (
                    <li key={invitation.id}>
                        <Link to={`/invitations/${invitation.id}`}>{'Invitation to course: ' + invitation.courseId}</Link>
                        <button onClick={() => confirmInvitation(invitation.id)}>
                            Confirm
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CoursesPage;
