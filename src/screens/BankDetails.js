import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Navbar from './Navbar';
import SideBar from './SideBar';
import { fetchBanks, createBank } from '../services/Api';

function BankDetails() {
    const [banks, setBanks] = useState([]);
    const [newBank, setNewBank] = useState({
        name: '',
        account_number: '',
        balance: '',
    });

    useEffect(() => {
        fetchBanks().then((response) => {
            setBanks(response.data);
        });
    }, []);

    const handleInputChange = (e) => {
        setNewBank({ ...newBank, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createBank(newBank).then((response) => {
            setBanks([...banks, response.data]);
            setNewBank({ name: '', account_number: '', balance: '' });
        });
    };

    return (
        <div className="wrapper">
            <SideBar/>
            <div class="main-panel">
                <div class="main-header">
                    <Navbar/>
                </div>

                
<Container className="content mt-4">
                    <Row>
                        <Col md={4}>
                            <h2>Add New Bank</h2>
                            <Card className="p-3">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="name">
                                        <Form.Label>Bank Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={newBank.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter bank name"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="account_number" className="mt-3">
                                        <Form.Label>Account Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="account_number"
                                            value={newBank.account_number}
                                            onChange={handleInputChange}
                                            placeholder="Enter account number"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="balance" className="mt-3">
                                        <Form.Label>Balance</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="balance"
                                            value={newBank.balance}
                                            onChange={handleInputChange}
                                            placeholder="Enter balance"
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" className="mt-4">
                                        Add Bank
                                    </Button>
                                </Form>
                            </Card>
                        </Col>

                        <Col md={8}>
                            <h2>Available Banks</h2>
                            <Row className="mt-4">
                                {banks.map((bank) => (
                                    <Col md={6} key={bank.id} className="mb-4">
                                        <Card className="shadow-sm">
                                            <Card.Body>
                                                <Card.Title>{bank.name}</Card.Title>
                                                <Card.Text>
                                                    <strong>Account Number:</strong> {bank.account_number}
                                                </Card.Text>
                                                <Card.Text>
                                                    <strong>Balance:</strong> ${parseFloat(bank.balance).toFixed(2)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Container>
                
            </div>     
        </div>
    );
}

export default BankDetails;



