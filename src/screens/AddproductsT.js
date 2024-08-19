import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchProducts, fetchSuppliers, createProductStock, fetchBanks } from '../services/Api';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';
import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';

function AddproductsT() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [datePurchased, setDatePurchased] = useState('');
    const [discount, setDiscount] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [selectedBank, setSelectedBank] = useState('');
    const [banks, setBanks] = useState([]);

    useEffect(() => {
        fetchSuppliers()
            .then((response) => setSuppliers(response.data))
            .catch((error) => console.error('Error fetching suppliers:', error));

        fetchBanks()
            .then((response) => setBanks(response.data))
            .catch((error) => console.error('Error fetching banks:', error));
        
        // Retrieve items from local storage on mount
        const storedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        setSelectedProducts(storedProducts);
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

    useEffect(() => {
        // Save selected products to local storage
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

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
        updatedProducts[index].supplier_price_per_unit = newPrice || 0;
        setSelectedProducts(updatedProducts);
    };

    const handleSupplierChange = (e) => {
        setSelectedSupplier(e.target.value);
    };

    const handleDatePurchasedChange = (e) => {
        setDatePurchased(e.target.value);
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
        setSelectedBank('');
        
        // Clear local storage
        localStorage.removeItem('selectedProducts');
    };

    const handleAddProductsSubmit = () => {
        if (!selectedSupplier || !datePurchased || selectedProducts.length === 0) {
            alert('Please fill in all required fields');
            return;
        }
    
        // Preparing items for submission
        const items = selectedProducts.map(product => {
            if (!product.quantity || !product.supplier_price_per_unit) {
                throw new Error('Quantity and Price per unit are required for all products');
            }
            return {
                product: product.id,  // Product ID
                quantity: product.quantity,  // Quantity
                supplier_price_per_unit: product.supplier_price_per_unit.toFixed(2),  // Price per unit
                date_purchased: datePurchased,  // Date Purchased
                supplier: selectedSupplier  // Supplier ID
            };
        });
    
        // Data to be sent to the backend
        const data = {
            stock_bill: 18, // Assuming this is a reference to the bill ID
            items,  // Array of items to be added
            total_amount: calculateTotal().toFixed(2),  // Total amount calculated
            total_paid: totalPaid.toFixed(2),  // Total amount paid
            total_due: (calculateTotal() - totalPaid - discount).toFixed(2),  // Total due after discount
            payment_method: selectedBank,  // Payment method (bank ID)
            discount: discount.toFixed(2),  // Discount applied


            updated_at: new Date().toISOString().split('T')[0],  // Date updated
            created_at: new Date().toISOString().split('T')[0]  // Date created
        };
    
        // Sending data to backend
        createProductStock(data)
            .then(response => {
                console.log('Products added successfully:', response);
                handleClear();
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

    return (
        <div className="wrapper d-flex">
            <SidebarN />
            <div className="main-content">
                <NavbarN />
                <div className="p-3">
                    {/* Add your main content here */}

                        <Row>
                            <Col md={8}>
                                <div className="card">
                                    <div className="nav-search d-lg-flex m-1">
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
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label>Select Supplier <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control 
                                                        as="select" 
                                                        value={selectedSupplier} 
                                                        onChange={handleSupplierChange} 
                                                        required>
                                                        <option value="">Choose a supplier</option>
                                                        {suppliers.map((supplier) => (
                                                            <option key={supplier.id} value={supplier.id}>
                                                                {supplier.name}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-1">
                                                    <Form.Label>Date Purchased <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={datePurchased}
                                                        onChange={handleDatePurchasedChange}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>                                        <div className="table-responsive">
                                            <Table striped bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Product Name</th>
                                                        <th>QTY <span className="text-danger">*</span></th>
                                                        <th>Price/u <span className="text-danger">*</span></th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts.map((product, index) => (
                                                        <tr key={product.id}>
                                                            <td>{product.id}</td>
                                                            <td>{product.name}</td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="0"
                                                                    value={product.quantity||''}
                                                                    onChange={(e) => handleQuantityChange(index, e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                                    required
                                                                    className="text-center"
                                                                />


                                                            </td>
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="1"
                                                                    value={product.supplier_price_per_unit || ''}
                                                                    onChange={(e) => handlePriceChange(index, e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                                    required
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button variant="danger" size="sm" onClick={() => handleRemoveProduct(index)}>
                                                                    <FontAwesomeIcon icon={faTimes} />
                                                                </Button>
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
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Summary</div>
                                    </div>
                                    <div className="card-body pt-1">
                                        <Form.Group className="mb-1">
                                            <Form.Label>Discount</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={discount}
                                                onChange={(e) => setDiscount(parseFloat(e.target.value))}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-1">
                                            <Form.Label>Total Paid</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                value={totalPaid}
                                                onChange={(e) => setTotalPaid(parseFloat(e.target.value))}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-1">
                                            <Form.Label>Payment Method</Form.Label>
                                            <Form.Control 
                                                as="select" 
                                                value={selectedBank} 
                                                onChange={(e) => setSelectedBank(e.target.value)} 
                                                required>
                                                <option value="">Choose a bank</option>
                                                {banks.map((bank) => (
                                                    <option key={bank.id} value={bank.id}>
                                                        {bank.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                        <div className="d-flex justify-content-between">
                                            <h6>Total:</h6>
                                            <h6>{calculateTotal().toFixed(2)}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h6>Discount:</h6>
                                            <h6>{discount.toFixed(2)}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h6>Total Paid:</h6>
                                            <h6>{totalPaid.toFixed(2)}</h6>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <h6>Total Due:</h6>
                                            <h6>{(calculateTotal() - totalPaid - discount).toFixed(2)}</h6>
                                        </div>
                                        <Button 
                                            variant="primary" 
                                            className="btn-block" 
                                            onClick={handleAddProductsSubmit}>
                                            Add Products
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
    );
}


export default AddproductsT;