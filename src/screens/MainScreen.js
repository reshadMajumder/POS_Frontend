import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';
import React, { useState, useEffect } from 'react';
import {  fetchPosBills, fetchSummaryDashboard } from '../services/Api';
import { Card, Row, Col, Table, Container } from 'react-bootstrap';

const MainScreen = () => {
    const [summary, setSummary] = useState({});
    const [posBills, setPosBills] = useState([]);

    useEffect(() => {
        fetchSummaryDashboard().then((response) => setSummary(response.data));
        fetchPosBills().then((response) => setPosBills(response.data));
    }, []);

    return (
        <div className="d-flex">
            <SidebarN />
            <div className="main-content flex-grow-1">
                <NavbarN />
                <div className="responsive" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

                <Container fluid className="p-3" >
                    <h2 className="mb-4">Dashboard Summary</h2>
                    <Row>
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Today</Card.Title>
                                    <Card.Text>Total Sold: ${summary.total_sold_today}</Card.Text>
                                    <Card.Text>Total Profit: ${summary.total_profit_today}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>This Month</Card.Title>
                                    <Card.Text>Total Sold: ${summary.total_sold_month}</Card.Text>
                                    <Card.Text>Total Profit: ${summary.total_profit_month}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>This Year</Card.Title>
                                    <Card.Text>Total Sold: ${summary.total_sold_year}</Card.Text>
                                    <Card.Text>Total Profit: ${summary.total_profit_year}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Overall</Card.Title>
                                    <Card.Text>Total Sold: ${summary.total_sold_total}</Card.Text>
                                    <Card.Text>Total Profit: ${summary.total_profit_total}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Current Stock</Card.Title>
                                    <Card.Text>Total Stock Amount: ${summary.total_stock_amount}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <h3 className="mt-4">Bill History</h3>

                    <Row>
                        <Col md={6}>
                            <div className="table-responsive" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Customer Phone</th>
                                            <th>Total Bill</th>
                                            <th>Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(posBills) && posBills.map((bill,index) => (
                                            <tr key={index}>
                                                <td>{bill.id}</td>
                                                <td>{bill.updated_at}</td>
                                                <td>{bill.customer_phone}</td>
                                                <td>${bill.total_Bill}</td>
                                                <td>{bill.total_paid >= bill.total_Bill ? 'Paid' : 'Unpaid'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="table-responsive" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                <Table striped bordered hover responsive >
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Customer Phone</th>
                                            <th>Total Bill</th>
                                            <th>Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(posBills) && posBills.map((bill,index) => (
                                            <tr key={index}>
                                                <td>{bill.id}</td>
                                                <td>{bill.updated_at}</td>
                                                <td>{bill.customer_phone}</td>
                                                <td>${bill.total_Bill}</td>
                                                <td>{bill.total_paid >= bill.total_Bill ? 'Paid' : 'Unpaid'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>                
                </Container>
            </div>
            </div>
        </div>
    );
};

export default MainScreen;