import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import SidebarN from '../components/SidebarN'
import NavbarN from '../components/NavbarN'

function Liabilities() {

    const [liabilities, setLiabilities] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/liability/')
            .then(response => setLiabilities(response.data))
            .catch(error => console.error('Error fetching liabilities:', error));
    }, []);

    const handleInputChange = (e, id) => {
        const { name, value } = e.target;
        setLiabilities(prevState =>
            prevState.map(liability =>
                liability.id === id ? { ...liability, [name]: value } : liability
            )
        );
    };

    const handleSave = (id) => {
        const liability = liabilities.find(l => l.id === id);
        axios.patch(`http://localhost:8000/api/liability/${id}/update/`, {
            total_paid: liability.total_paid,
            total_due: liability.total_due,
        })
            .then(response => {
                console.log('Liability updated successfully:', response.data);
            })
            .catch(error => console.error('Error updating liability:', error));
    };
    return (
        <div className="d-flex">
            <SidebarN />
            <div className="main-content flex-grow-1">
                <NavbarN />
                <div className="responsive" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                
                <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Total Paid</th>
                    <th>Total Due</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {liabilities.map(liability => (
                    <tr key={liability.id}>
                        <td>{liability.id}</td>
                        <td>
                            <Form.Control
                                type="number"
                                name="total_paid"
                                value={liability.total_paid}
                                onChange={(e) => handleInputChange(e, liability.id)}
                            />
                        </td>
                        <td>
                            <Form.Control
                                type="number"
                                name="total_due"
                                value={liability.total_due}
                                onChange={(e) => handleInputChange(e, liability.id)}
                            />
                        </td>
                        <td>
                            <Button onClick={() => handleSave(liability.id)}>Save</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>                
                
                </div>
            </div>
        </div>
    )
}

export default Liabilities;