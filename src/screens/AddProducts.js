import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchSuppliers, createStock } from '../services/Api';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import SideBar from './SideBar';
import Navbar from './Navbar';

function AddProducts() {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [productId, setProductId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [supplierPricePerUnit, setSupplierPricePerUnit] = useState('');
    const [datePurchased, setDatePurchased] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productsResponse = await fetchProducts();
                setProducts(productsResponse.data);

                const suppliersResponse = await fetchSuppliers();
                setSuppliers(suppliersResponse.data);
            } catch (error) {
                setError('Failed to load data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await createStock({ 
                product: productId, 
                supplier: supplierId,
                quantity, 
                supplier_price_per_unit: supplierPricePerUnit, 
                date_purchased: datePurchased 
            });
            alert('Stock added successfully!');
            setProductId('');
            setSupplierId('');
            setQuantity('');
            setSupplierPricePerUnit('');
            setDatePurchased('');
        } catch (error) {
            setError('Error adding stock. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wrapper">
            <SideBar />
            <div className="main-panel">
                <div className="main-header">
                    <Navbar />
                </div>
                <div className="row">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Add Product Stock</div>
                            <Container>
                                {error && <Alert variant="danger">{error}</Alert>}
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group controlId="formProduct">
                                        <Form.Label>Product</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        >
                                            <option value="">Select a product</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>{product.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formSupplier">
                                        <Form.Label>Supplier</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={supplierId}
                                            onChange={(e) => setSupplierId(e.target.value)}
                                        >
                                            <option value="">Select a supplier</option>
                                            {suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formQuantity">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formSupplierPricePerUnit">
                                        <Form.Label>Supplier Price per Unit</Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter supplier price per unit"
                                            value={supplierPricePerUnit}
                                            onChange={(e) => setSupplierPricePerUnit(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formDatePurchased">
                                        <Form.Label>Date Purchased</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={datePurchased}
                                            onChange={(e) => setDatePurchased(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Add Stock
                                    </Button>
                                </Form>
                            </Container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddProducts;
