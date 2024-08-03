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
                <Table>
                    <thead>
                        <tr>
                            <th>Instance</th>
                            <th>Total</th>
                        </tr>
                    </thead>
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
                        <tr >
                            <td >Total Amount</td>
                            <td>{adjustedAmount.toFixed(2)}</td>
                        </tr>
                        
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default TotalTable;