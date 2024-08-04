import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchProducts, fetchSuppliers, createProductStock } from '../services/Api';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';

function AddproductsT() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [datePurchased, setDatePurchased] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);

    useEffect(() => {
        fetchSuppliers()
            .then((response) => setSuppliers(response.data))
            .catch((error) => console.error('Error fetching suppliers:', error));
    }, []);

    useEffect(() => {
        if (query) {
            searchProducts(query)
                .then((response) => {
                    const filteredSuggestions = response.data.filter(product => 
                        !selectedProducts.some(selected => selected.id === product.id)
                    );
                    setSuggestions(filteredSuggestions);
                })
                .catch((error) => console.error('Error fetching suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [query, selectedProducts]);

    const handleAddProduct = (product) => {
        const updatedProducts = [...selectedProducts, { ...product, quantity: 1, supplier_price_per_unit: 0 }];
        setSelectedProducts(updatedProducts);
        setQuery('');
        setSuggestions([]);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);
    };

    const handleQuantityChange = (index, newQuantity) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].quantity = newQuantity;
        setSelectedProducts(updatedProducts);
    };

    const handlePriceChange = (index, newPrice) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].supplier_price_per_unit = newPrice;
        setSelectedProducts(updatedProducts);
    };

    const handleSupplierChange = (e) => {
        setSelectedSupplier(e.target.value);
    };

    const handleDatePurchasedChange = (e) => {
        setDatePurchased(e.target.value);
    };

    const handleAddProductsSubmit = () => {
        if (!selectedSupplier || !datePurchased || selectedProducts.length === 0) {
            alert('Please fill in all required fields');
            return;
        }

        const data = selectedProducts.map(product => ({
            product: product.id,
            supplier: selectedSupplier,
            quantity: product.quantity,
            supplier_price_per_unit: product.supplier_price_per_unit,
            date_purchased: datePurchased
        }));

        createProductStock(data)
            .then(response => {
                console.log('Products added successfully:', response);
                // Reset form or show success message
                setSelectedProducts([]);
                setSelectedSupplier('');
                setDatePurchased('');
            })
            .catch(error => {
                console.error('Error adding products:', error);
                if (error.response && error.response.data) {
                    let errorMessage = 'Error: ';
                    for (let field in error.response.data) {
                        errorMessage += `${field}: ${error.response.data[field].join(', ')}; `;
                    }
                    alert(errorMessage);
                } else {
                    alert('An error occurred while adding products. Please try again.');
                }
            });
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => {
            return total + (product.quantity * product.supplier_price_per_unit);
        }, 0);
    };

    const handleClear = () => {
        setSelectedProducts([]);
        setSelectedSupplier('');
        setDatePurchased('');
        setQuery('');
        setDiscount(0);
        setTotalPaid(0);
    };

    return (
        <div>
            <SideBar />
            <div className="main-panel">
                <div className="main-header">
                    <Navbar />
                </div>
                <div className="container-fluid pt-1" style={{ height: '100vh', overflow: 'auto' }}>
                    <div className="page-inner">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h3 className="fw-bold">Add Products</h3>
                            </div>
                        </div>
                        <Row>
                            <Col md={8}>
                                <div className="card">
                                    <div className="nav-search d-lg-flex  m-1">
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <button type="submit" className="btn btn-search pe-1">
                                                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                className="form-control"
                                                value={query}
                                                onChange={(e) => setQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {suggestions.length > 0 && (
                                        <div className="suggestions" style={{position:'absolute', top: '100%', left: 0, backgroundColor: 'white', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                {suggestions.map((product) => (
                                                    <li key={product.id} onClick={() => handleAddProduct(product)} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                                                        {product.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="card mb-0">
                                    <div className="card-header">
                                        <div className="card-title">Products to Add</div>
                                    </div>
                                    <div className="card-body pt-1" style={{ height: '65vh', overflow: 'auto' }}>
                                        <Form.Group className="mb-1">
                                            <Form.Label>Select Supplier <span className="text-danger">*</span></Form.Label>
                                            <Form.Control as="select" value={selectedSupplier} onChange={handleSupplierChange} required>
                                                <option value="">Choose a supplier</option>
                                                {suppliers.map((supplier) => (
                                                    <option key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <Form.Group className="mb-1">
                                            <Form.Label>Date Purchased <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={datePurchased}
                                                onChange={handleDatePurchasedChange}
                                                required
                                            />
                                        </Form.Group>
                                        <div className="table-responsive">
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Product Name</th>
                                                        <th>QTY <span className="text-danger">*</span></th>
                                                        <th>Supplier Price/u<span className="text-danger">*</span></th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts.map((product, index) => (
                                                        <tr key={index}>
                                                            <td>{product.id}</td>
                                                            <td>{product.name}</td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="1"
                                                                    value={product.quantity}
                                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                                                    style={{ width: '80px' }}
                                                                    required
                                                                />
                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={product.supplier_price_per_unit}
                                                                    onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
                                                                    style={{ width: '100px' }}
                                                                    required
                                                                />
                                                            </td>
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
                            </Col>
                            <Col md={4}>
                            <div className="card-body">
                                        <Table size="sm" className="table-condensed">
                                            <tbody>
                                                <tr>
                                                    <td>Subtotal</td>
                                                    <td>{selectedProducts.reduce((total, product) => total + (product.quantity * product.supplier_price_per_unit), 0).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>Discount</td>
                                                    <td><input type="number" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value) )} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Total paid</td>
                                                    <td><input type="number"min='0' value={totalPaid} onChange={(e) => setTotalPaid(parseFloat(e.target.value) )} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Due</td>
                                                    <td>{(calculateTotal() - totalPaid).toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ fontWeight: 'bold', color: 'green' }}>Total</td>
                                                    <td style={{ fontWeight: 'bold', color: 'green' }}>{calculateTotal().toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button variant="secondary" className="btn-border btn-round me-2" onClick={handleClear}>
                                        Clear
                                    </Button>
                                    <Button variant="primary" className="btn-border btn-round" onClick={handleAddProductsSubmit}>
                                        Add Products
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddproductsT;