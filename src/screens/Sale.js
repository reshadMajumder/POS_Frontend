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
                .then((response) => {
                    const filteredSuggestions = response.data.filter(
                        (stock) => !selectedProducts.some((product) => product.id === stock.product.id)
                    );
                    setSuggestions(filteredSuggestions);
                })
                .catch((error) => console.error('Error fetching suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [query, selectedProducts]);

    const handleAddProduct = (stock) => {
        if (quantity > stock.quantity) {
            alert('Quantity exceeds available stock.');
            return;
        }
        
        const updatedProducts = [...selectedProducts, { ...stock.product, quantity: quantity, stock_id: stock.id, supplier: stock.supplier.name, available_stock: stock.quantity }];
        setSelectedProducts(updatedProducts);
        setQuery('');
        setQuantity(1);
        setSuggestions([]);
        console.log('Products in the sale table:', updatedProducts);
    };

    const handleRemoveProduct = (index) => {
        const updatedProducts = selectedProducts.filter((_, i) => i !== index);
        setSelectedProducts(updatedProducts);
        console.log('Products in the sale table after removal:', updatedProducts);
    };

    const handleQuantityChange = (index, newQuantity) => {
        const product = selectedProducts[index];
        if (newQuantity > product.available_stock) {
            alert('Quantity exceeds available stock.');
            return;
        }
        
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].quantity = newQuantity;
        setSelectedProducts(updatedProducts);
        console.log('Products in the sale table after quantity change:', updatedProducts);
    };

    const handleConfirm = () => {
        if (!customerPhone || selectedProducts.length === 0) {
            alert('Please provide customer phone number and add at least one product.');
            return;
        }

        const billData = {
            customer_phone: customerPhone,
            total_amount: selectedProducts.reduce((acc, product) => acc + product.quantity * product.selling_price_per_unit, 0),
            items: selectedProducts.map(product => ({
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
                console.log('Products in the sale table after bill creation: []');
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
                <div className="container-fluid pt-3" style={{ height: '100vh', overflow: 'auto' }}>
                    <div className="page-inner">
                        <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row">
                            <div>
                                <h3 className="fw-bold">Sell items</h3>
                                                           </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-md-9">
                                <div className="card">
                                    <div className="nav-search d-lg-flex pt-1 m-2">
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
                                                {Object.values(suggestions.reduce((acc, stock) => {
                                                    if (!acc[stock.product.id]) {
                                                        acc[stock.product.id] = { ...stock, quantity: 0 }
                                                    }
                                                    acc[stock.product.id].quantity += stock.quantity
                                                    return acc
                                                }, {})).map((stock) => (
                                                    <li key={stock.product.id} onClick={() => handleAddProduct(stock)}>
                                                        {stock.product.name} -- {"Qty :" + stock.quantity} 
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
                                                            <td>
                                                                <Form.Control
                                                                    type="number"
                                                                    min="1"
                                                                    max={product.available_stock}
                                                                    value={product.quantity}
                                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                                                    style={{ width: '80px' }}
                                                                />
                                                            </td>
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
                                                        <td>Adjusted amount</td>
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
                                            <Button variant="primary" className="btn-border btn-round" onClick={() => {
                                                setSelectedProducts([]);
                                                console.log('Products in the sale table after clearing: []');
                                            }}>
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
