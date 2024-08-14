import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchProductsStock, createBill } from '../services/Api';
import { Table, Button, Form } from 'react-bootstrap';
import TotalTable from '../components/TotalTable';
import SidebarN from '../components/SidebarN';
import NavbarN from '../components/NavbarN';

function Sale() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [customerPhone, setCustomerPhone] = useState('');
    const [vat, setVat] = useState(15);
    const [discount, setDiscount] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [selectedBank, setSelectedBank] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        const savedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        setSelectedProducts(savedProducts);
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

    useEffect(() => {
        if (query) {
            searchProductsStock(query)
                .then((response) => {
                    const filteredSuggestions = response.data.filter(stock => 
                        !selectedProducts.some(selected => selected.id === stock.product.id)
                    );
                    setSuggestions(filteredSuggestions);
                })
                .catch((error) => console.error('Error fetching suggestions:', error));
        } else {
            setSuggestions([]);
        }
    }, [query, selectedProducts]);

    const handleAddProduct = (stock) => {
        const existingProduct = selectedProducts.find(p => p.id === stock.product.id);
        const totalQuantity = existingProduct ? existingProduct.quantity + quantity : quantity;

        if (totalQuantity > stock.quantity) {
            alert(`Cannot add more than ${stock.quantity} units of ${stock.product.name}.`);
            return;
        }

        const updatedProducts = [...selectedProducts, { ...stock.product, quantity: quantity, stock_id: stock.id, supplier: stock.supplier.name, maxQuantity: stock.quantity, supplier_price_per_unit: stock.supplier_price_per_unit }];
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
        const updatedProducts = [...selectedProducts];
        const product = updatedProducts[index];
        
        if (newQuantity > product.maxQuantity) {
            alert(`Cannot add more than ${product.maxQuantity} units of ${product.name}.`);
            return;
        }
        
        product.quantity = newQuantity;
        setSelectedProducts(updatedProducts);
        console.log('Products in the sale table after quantity change:', updatedProducts);
    };

    const handleConfirm = () => {
        if (!customerPhone || selectedProducts.length === 0) {
            alert('Please provide customer phone number and add at least one product.');
            return;
        }
    
        const totalAmount = selectedProducts.reduce((acc, product) => acc + product.quantity * parseFloat(product.selling_price_per_unit), 0);
        const totalCost = selectedProducts.reduce((acc, product) => acc + product.quantity * parseFloat(product.supplier_price_per_unit), 0);
        const vatAmount = (vat / 100) * totalAmount;
        const totalProfitOrLoss = totalAmount - totalCost - discount;
        const total_bill = totalAmount+vatAmount;
    
        const billData = {
            customer_phone: customerPhone,
            total_amount: totalAmount.toFixed(2),
            vat_amount: vatAmount.toFixed(2),
            discount: discount.toFixed(2),
            total_cost: Number(totalCost.toFixed(2)),
            total_profit_or_loss: Number(totalProfitOrLoss.toFixed(2)),
            total_Bill:total_bill,
            items: selectedProducts.map(product => ({
                product: product.id,
                quantity: product.quantity,
                selling_price_per_unit: product.selling_price_per_unit
            })),
            created_at: new Date().toISOString().split('T')[0],
            total_paid: totalPaid,
            total_due: (total_bill - discount - totalPaid).toFixed(2),
            payment_method: selectedBank
        };
    
        createBill(billData)
            .then((response) => {
                console.log('Bill created successfully:', response.data);
                setSelectedProducts([]);
                setCustomerPhone('');
                setDiscount(0);
                setVat(15);
                setTotalPaid(0);
                
                setPaymentMethod('');
                
                localStorage.removeItem('selectedProducts');
                console.log('Products in the sale table after bill creation: []');
            })
            .catch((error) => console.error('Error creating bill:', error));
    };

    const handleClear = () => {
        setSelectedProducts([]);
        localStorage.removeItem('selectedProducts');
        console.log('Products in the sale table after clearing: []');
    };

    return (
        <div className="wrapper d-flex">
            <SidebarN />
            <div className="main-content" style={{overflow: 'hidden'}}>
                <NavbarN />
                <div className="p-3">
                    {/* Add your main content here */}
                <div className="container-fluid pt-1" style={{overflow: 'auto'}}>
                    <div className="page-inner" >
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
                                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    {suggestions.length > 0 && (
                                        <div className="suggestions" style={{position:'absolute', top: '100%', left: 0, backgroundColor: 'white', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: 1000 }}>
                                            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                {Object.values(suggestions.reduce((acc, stock) => {
                                                    if (!acc[stock.product.id]) {
                                                        acc[stock.product.id] = { ...stock, quantity: 0 }
                                                    }
                                                    acc[stock.product.id].quantity += stock.quantity
                                                    return acc
                                                }, {})).map((stock) => (
                                                    <li key={stock.product.id} onClick={() => handleAddProduct(stock)}style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
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
                                                                    max={product.maxQuantity}
                                                                    value={product.quantity}
                                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                                                    style={{ width: '80px' }}
                                                                />
                                                            </td>
                                                            
                                                            <td>{product.selling_price_per_unit}</td>
                                                            <td>{(product.quantity * parseFloat(product.selling_price_per_unit)).toFixed(2)}</td>
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
                                <TotalTable 
                                    products={selectedProducts} 
                                    vat={vat} 
                                    discount={discount} 
                                    setVat={setVat} 
                                    setDiscount={setDiscount} 
                                    totalPaid={totalPaid}
                                    setTotalPaid={setTotalPaid}
                                    setSelectedBank={setSelectedBank}
                                />
                                <div className="form-group pt-0">
                                    <Form.Control
                                        type="text"
                                        placeholder="Customer Phone Number"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                    />
                                </div>
                                
                                <div className="d-flex justify-content-between">
                                    <Button variant="primary" className="btn-border btn-round" onClick={handleClear}>
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
    );
}

export default Sale;