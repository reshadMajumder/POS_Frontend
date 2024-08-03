import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchProducts, createBill } from '../services/Api';
import { Table, Button, Form } from 'react-bootstrap';

function Sale() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [customerPhone, setCustomerPhone] = useState('');

    useEffect(() => {
        if (query) {
            searchProducts(query)
                .then((response) => setSuggestions(response.data))
                .catch((error) => console.error('Error fetching suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [query]);

    const handleAddProduct = (product) => {
        setSelectedProducts([...selectedProducts, { ...product, quantity }]);
        setQuery('');
        setQuantity(1);
        setSuggestions([]);
    };

    const handleRemoveProduct = (index) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const handleConfirm = () => {
        const billData = {
            customer: { phone_number: customerPhone },
            total_amount: selectedProducts.reduce((acc, product) => acc + product.quantity * product.selling_price_per_unit, 0),
            sales: selectedProducts.map(product => ({
                product: product.id,
                quantity: product.quantity,
                selling_price_per_unit: product.selling_price_per_unit
            }))
        };

        createBill(billData)
            .then((response) => {
                console.log('Bill created successfully:', response.data);
                setSelectedProducts([]);
                setCustomerPhone('');
            })
            .catch((error) => console.error('Error creating bill:', error));
    };

    return (
        <div>
            <SideBar />
            <div className="main-panel">
                <div className="main-header">
                    <Navbar />
                </div>
                <div className="container-fluid" style={{ height: '100vh', overflow: 'auto' }}>
                    <div className="page-inner">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h3 className="fw-bold">Sell items</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-md-9">
                                <div className="card">
                                    <div className="nav-search d-lg-flex pt-1">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <button type="submit" className="btn btn-search pe-1">
                                                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search ..."
                                                className="form-control"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="p-2">
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                placeholder="Quantity"
                                                value={quantity}
                                                onChange={(e) => setQuantity(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {suggestions.length > 0 && (
                                        <div className="suggestions">
                                            <ul>
                                                {suggestions.map((product) => (
                                                    <li key={product.id} onClick={() => handleAddProduct(product)}>
                                                        {product.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="card mb-5">
                                    <div className="card-header">
                                        <div className="card-title">Products</div>
                                    </div>
                                    <div className="card-body pt-1" style={{ height: '50vh', overflow: 'auto' }}>
                                        <div className="table-responsive">
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Product Name</th>
                                                        <th>Unit</th>
                                                        <th>Qty</th>
                                                        <th>Price</th>
                                                        <th>Total Price</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product.id}</td>
                                                            <td>{product.name}</td>
                                                            <td>{product.unit}</td>
                                                            <td>{product.quantity}</td>
                                                            <td>{product.selling_price_per_unit}</td>
                                                            <td>{(product.quantity * product.selling_price_per_unit).toFixed(2)}</td>
                                                            <td>
                                                                <div className="form-button-action">
                                                                    <Button variant="link" className="btn-danger" onClick={() => handleRemoveProduct(index)}>
                                                                        <FontAwesomeIcon icon={faTimes} />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Total</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>Instance</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Total</td>
                                                        <td>{selectedProducts.reduce((acc, product) => acc + product.quantity * product.selling_price_per_unit, 0).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>VAT</td>
                                                        <td>0.00</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Discount</td>
                                                        <td>0.00</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Subtotal</td>
                                                        <td>{selectedProducts.reduce((acc, product) => acc + product.quantity * product.selling_price_per_unit, 0).toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                        <div className="form-group">
                                            <Form.Control
                                                type="text"
                                                placeholder="Customer Phone Number"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <Button variant="primary" className="btn-border btn-round" onClick={() => setSelectedProducts([])}>
                                                Clear
                                            </Button>
                                            <Button variant="primary" className="btn-border btn-round" onClick={handleConfirm}>
                                                Confirm
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sale;
