import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { fetchBanks, searchProductsStock } from '../services/Api';

const EditBillModal = ({ showModal, selectedBill, handleCloseModal, handleSaveChanges }) => {
    const [productQuery, setProductQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [cash, setCash] = useState(0);
    const [selectedBank, setSelectedBank] = useState('');
    const [banks, setBanks] = useState([]);
    const [localBill, setLocalBill] = useState({ ...selectedBill, items: [...selectedBill.items] });

    useEffect(() => {
        const fetchBanksData = async () => {
            try {
                const response = await fetchBanks();
                setBanks(response.data);
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };

        fetchBanksData();
    }, []);

    useEffect(() => {
        const searchProducts = async () => {
            if (productQuery) {
                try {
                    const response = await searchProductsStock(productQuery);
                    setSearchResults(response.data);
                } catch (error) {
                    console.error('Error searching products:', error);
                }
            } else {
                setSearchResults([]);
            }
        };

        searchProducts();
    }, [productQuery]);

    useEffect(() => {
        setLocalBill({ ...selectedBill, items: [...selectedBill.items] });
    }, [selectedBill]);

    const handleAddProduct = (stock) => {
        const updatedItems = [...localBill.items];
        const existingItemIndex = updatedItems.findIndex(item => item.product.id === stock.product.id);

        if (existingItemIndex !== -1) {
            updatedItems[existingItemIndex].quantity += 1;
        } else {
            updatedItems.push({
                id: stock.id,  // New items might not have an ID yet
                product: stock.product,
                quantity: 1,  // Start with a quantity of 1
                selling_price_per_unit: stock.product.selling_price_per_unit,
                bill: { id: localBill.id, ...localBill }  // Associate the new item with the current bill
            });
        }

        updateBillCalculations(updatedItems);
        setProductQuery('');
        setSearchResults([]);
    };

    const handleQuantityChange = (index, newQuantity) => {
        const updatedItems = [...localBill.items];
        updatedItems[index].quantity = newQuantity;

        updateBillCalculations(updatedItems);
    };

    const handleRemoveProduct = (index) => {
        const updatedItems = localBill.items.filter((_, i) => i !== index);

        updateBillCalculations(updatedItems);
    };

    const updateBillCalculations = (updatedItems) => {
        const newTotalAmount = updatedItems.reduce((acc, item) => acc + item.quantity * item.selling_price_per_unit, 0);
        const vatAmount = Math.floor(newTotalAmount * (localBill.vat_rate / 100));

        setLocalBill({
            ...localBill,
            items: updatedItems,
            total_amount: newTotalAmount.toFixed(2),
            vat_amount: vatAmount.toFixed(2),
            total_Bill: (newTotalAmount + vatAmount).toFixed(2)
        });
    };

    const handleCashChange = (e) => {
        const newCash = parseFloat(e.target.value);
        setCash(newCash);
        setLocalBill({
            ...localBill,
            total_paid: (localBill.total_paid + newCash).toFixed(2),
            total_due: Math.max(0, localBill.total_Bill - (localBill.total_paid + newCash)).toFixed(2)
        });
    };

    const handleBankSelection = (e) => {
        setSelectedBank(e.target.value);
        setLocalBill({ ...localBill, payment_method: e.target.value });
    };

    const handleSave = () => {
        handleSaveChanges(localBill);
    };

    return (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Bill</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Customer Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={localBill.customer_phone}
                                    onChange={(e) => setLocalBill({ ...localBill, customer_phone: e.target.value })}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>VAT Rate (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={localBill.vat_rate}
                                    onChange={(e) => {
                                        const newVatRate = parseFloat(e.target.value);
                                        setLocalBill({ ...localBill, vat_rate: newVatRate });
                                        updateBillCalculations(localBill.items);
                                    }}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Add Product</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Search product by name"
                                    value={productQuery}
                                    onChange={(e) => setProductQuery(e.target.value)}
                                />
                                <div className="search-results">
                                    <ul>
                                        {searchResults.map(stock => (
                                            <li key={stock.id} onClick={() => handleAddProduct(stock)}>
                                                {stock.product.name} - {stock.product.selling_price_per_unit} per unit
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Add Cash</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={cash}
                                    onChange={handleCashChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localBill.items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{item.product.name}</td>
                                    <td>
                                        <Form.Control
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td>{item.selling_price_per_unit}</td>
                                    <td>{(item.quantity * item.selling_price_per_unit).toFixed(2)}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleRemoveProduct(index)}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Row>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Bank</Form.Label>
                                <Form.Control as="select" value={selectedBank} onChange={handleBankSelection}>
                                    <option value="">Select Bank</option>
                                    {banks.map(bank => (
                                        <option key={bank.id} value={bank.id}>{bank.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>

                <hr />

                <h5>Summary</h5>
                <p>Total Amount: {localBill.total_amount}</p>
                <p>VAT Amount: {localBill.vat_amount}</p>
                <p>Total Bill: {localBill.total_Bill}</p>
                <p>Total Paid: {localBill.total_paid}</p>
                <p>Total Due: {localBill.total_due}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditBillModal;
