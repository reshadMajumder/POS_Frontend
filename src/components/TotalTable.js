import React, { useState, useEffect } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { fetchBanks } from '../services/Api';

function TotalTable({ products, vat, discount, setVat, setDiscount, totalPaid, setTotalPaid, setSelectedBank, adjustment_amount }) {
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        fetchBanks()
            .then((response) => {
                setBanks(response.data);
            })
            .catch((error) => {
                console.error('Error fetching banks:', error);
            });
    }, []);

    const subtotal = products.reduce((acc, product) => acc + product.quantity * product.selling_price_per_unit, 0);
    const vatAmount = (subtotal * vat) / 100;
    const totalAmount = subtotal + vatAmount - discount;
    const adjustedAmount = Math.floor(totalAmount);
    const adjustment = totalAmount - adjustedAmount;

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <div className="card-title">Total</div>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-settings">
                        <i className="fas fa-cog"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as="button" onClick={(e) => e.stopPropagation()}>
                            <Form.Group>
                                <Form.Label>VAT (%)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="VAT (%)"
                                    value={vat}
                                    onChange={(e) => setVat(parseFloat(e.target.value))}
                                />
                            </Form.Group>
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={(e) => e.stopPropagation()}>
                            <Form.Group>
                                <Form.Label>Discount</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    placeholder="Discount"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                                />
                            </Form.Group>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h6>Subtotal</h6>
                    <h6>{subtotal.toFixed(2)}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <h6>VAT ({vat}%)</h6>
                    <h6>{vatAmount.toFixed(2)}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <h6>Discount</h6>
                    <h6>{discount.toFixed(2)}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <h6>Adjustment</h6>
                    <h6>{adjustment.toFixed(2)}</h6>
                </div>
                <div className="d-flex justify-content-between">
                    <h6 style={{ fontWeight: 'bold', color: 'green' }}>Total</h6>
                    <h6 style={{ fontWeight: 'bold', color: 'green' }}>{adjustedAmount.toFixed(2)}</h6>
                </div>
                <div className="mt-3">
                    <Form.Group className="d-flex align-items-center">
                        <Form.Label className="me-2 mb-0">Payment Method:</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={(e) => setSelectedBank(e.target.value)}
                            size="sm"
                            className="flex-grow-1"
                        >
                            <option value="">Select</option>
                            {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mt-2 d-flex align-items-center">
                        <Form.Label className="me-2 mb-0">Total Paid:</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Total Paid"
                            value={totalPaid}
                            onChange={(e) => setTotalPaid(e.target.value)}
                            style={{ fontSize: '0.9em', padding: '1px', width: '40px' }}
                            required
                            className="flex-grow-1"
                        />
                    </Form.Group>
                </div>
            </div>
        </div>
    );
}

export default TotalTable;