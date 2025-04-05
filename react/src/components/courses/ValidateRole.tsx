import { jwtDecode } from 'jwt-decode';
import { NavigateFunction } from 'react-router-dom';

export interface MyJwtToken {
    sub: string;
    role: string;
}

export function getEndpoint(navigate: NavigateFunction): string | null {
    const token = localStorage.getItem('jwt');

    if (!token) {
        navigate('/login');
        return null;
    }

    let decoded: MyJwtToken;
    try {
        decoded = jwtDecode<MyJwtToken>(token);
    } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('jwt');
        navigate('/login');
        return null;
    }

    if (decoded.role === "STUDENT") {
        return 'student';
    } else if (decoded.role === "TEACHER") {
        return 'teacher';
    } else {
        alert('Unknown role!');
        return null;
    }
}
