import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default Dashboard;
