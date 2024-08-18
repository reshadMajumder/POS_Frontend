import React, { useState, useEffect } from 'react';
import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';
import { Form, Button, Alert, Container, Row, Col, Card, Table } from 'react-bootstrap';
import { fetchBanks, addTransaction, fetchTransactions, deleteTransaction } from '../services/Api';

function CashTransaction() {
    const [banks, setBanks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [formData, setFormData] = useState({
        transaction_type: '',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
        bank: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBankData = async () => {
            try {
                const response = await fetchBanks();
                setBanks(response.data);
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };

        const fetchTransactionData = async () => {
            try {
                const response = await fetchTransactions();
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchBankData();
        fetchTransactionData();
    }, []);

    const handleDeleteTransaction = async (id) => {
        try {
            await deleteTransaction(id);
            setTransactions(transactions.filter(transaction => transaction.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError('An error occurred while deleting the transaction.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await addTransaction(formData);
            setSuccess(true);
            setError(null);
            setFormData({
                transaction_type: '',
                amount: '',
                note: '',
                date: new Date().toISOString().split('T')[0],
                bank: '',
            });
            // Refresh transactions after successful addition
            const updatedTransactions = await fetchTransactions();
            setTransactions(updatedTransactions.data);
        } catch (error) {
            if (error.response && error.response.data.error) {
                setError(error.response.data.error);  // Display the custom error message from the backend
            } else {
                setError('An error occurred while adding the transaction.');
            }
            setSuccess(false);
        }
    };

    return (
        <div className="d-flex">
            <SidebarN />
            <div className="main-content flex-grow-1">
                <NavbarN />
                <Container className="py-4">
                    <Row>
                        <Col md={4}>
                            <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Add Cash Transaction</h4>
                                </Card.Header>
                                <Card.Body>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {success && <Alert variant="success">Transaction added successfully!</Alert>}
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="transaction_type">
                                            <Form.Label>Transaction Type</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="transaction_type"
                                                value={formData.transaction_type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Transaction Type</option>
                                                <option value="ADD">Add Money</option>
                                                <option value="WITHDRAW">Withdraw Money</option>
                                                <option value="EXPENSE">Expense</option>
                                                <option value="SALARY">Salary</option>
                                                <option value="BILLS">Other Bills</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group controlId="amount">
                                                    <Form.Label>Amount</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        name="amount"
                                                        value={formData.amount}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group controlId="date">
                                                    <Form.Label>Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group controlId="note">
                                            <Form.Label>Note</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="note"
                                                value={formData.note}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="bank">
                                            <Form.Label>Select Bank</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="bank"
                                                value={formData.bank}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Bank</option>
                                                {banks.map((bank) => (
                                                    <option key={bank.id} value={bank.id}>
                                                        {bank.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>

                                        <Button variant="primary" type="submit" className="mt-3">
                                            Submit Transaction
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={8}>
                            <Card>
                                <Card.Header>
                                    <h4 className="mb-0">Transaction History</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                                <th>Note</th>
                                                <th>Date</th>
                                                <th>Bank</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td>{transaction.id}</td>
                                                    <td>{transaction.transaction_type}</td>
                                                    <td>{transaction.amount}</td>
                                                    <td>
                                                        {transaction.note.split(' ').slice(0, 2).join(' ')}
                                                        {transaction.note.split(' ').length > 2 && (
                                                            <span
                                                                style={{ cursor: 'pointer', color: 'blue' }}
                                                                onClick={() => alert(transaction.note)}
                                                            >
                                                                ...
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                    <td>{transaction.bank.name}</td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default CashTransaction;
