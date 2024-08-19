import React, { useState, useEffect } from 'react';
import { fetchSuppliers, createSupplier } from '../services/Api';
import { Form, Button, Container, Table } from 'react-bootstrap';

import NavbarN from '../components/NavbarN';
import SidebarN from '../components/SidebarN';

function Supplier() {
    const [suppliers, setSuppliers] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contactInfo, setContactInfo] = useState('');

    useEffect(() => {
        fetchSuppliers().then((response) => setSuppliers(response.data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        createSupplier({ name, phone, contact_info: contactInfo }).then((response) => {
            setSuppliers([...suppliers, response.data]);
            setName('');
            setPhone('');
            setContactInfo('');
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    };

    return (
        <div className="wrapper d-flex">
        <SidebarN />
        <div className="main-content">
            <NavbarN />
            <div className="p-3">
                {/* Add your main content here */}


                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Suppliers</div>
                        </div>
                        <Container>
                            <h2>Suppliers</h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formSupplierName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhone">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formContactInfo">
                                    <Form.Label>Contact Info</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter contact info"
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Add Supplier
                                </Button>
                            </Form>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Contact Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suppliers.map((supplier, index) => (
                                        <tr key={supplier.id}>
                                            <td>{index + 1}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.phone}</td>
                                            <td>{supplier.contact_info}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Container>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Supplier;


