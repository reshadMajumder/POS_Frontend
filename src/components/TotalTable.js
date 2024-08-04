import React from 'react';
import { Table, Form, Dropdown } from 'react-bootstrap';

function TotalTable({ products, vat, discount, setVat, setDiscount }) {
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
                <Table size="sm">
                    <tbody>
                        <tr>
                            <td>Subtotal</td>
                            <td>{subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>VAT ({vat}%)</td>
                            <td>{vatAmount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td>{discount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Adjustment</td>
                            <td>{adjustment.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 'bold', color: 'green' }}>Total Amount</td>
                            <td style={{ fontWeight: 'bold', color: 'green' }}>{adjustedAmount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </Table>
                <Table size="sm" className="mt-3">
                    <tbody>
                        <tr>
                            <td>Payment Method</td>
                            <td>
                                <Form.Control as="select" size="sm">
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>Mobile Payment</option>
                                </Form.Control>
                            </td>
                        </tr>
                        <tr>
                            <td>Paid Amount</td>
                            <td>
                                <Form.Control type="number" size="sm" placeholder="Enter paid amount" />
                            </td>
                        </tr>
                        <tr>
                            <td>Due Amount</td>
                            <td>0.00</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default TotalTable;