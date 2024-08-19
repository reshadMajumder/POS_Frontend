import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const fetchSuppliers = () => axios.get(`${API_URL}suppliers/`);
export const createSupplier = (data) => axios.post(`${API_URL}suppliers/`, data);

export const fetchProducts = () => axios.get(`${API_URL}products/`);
export const createProduct = (productData) => axios.post(`${API_URL}products/`, productData);



export const searchProductsStock = (query) => axios.get(`${API_URL}stocks/search/`, { params: { query } });

export const createProductStock = (data) => axios.post(`${API_URL}stock-bill/`, data);

export const createStock = (data) => axios.post(`${API_URL}stocks/`, data);



export const fetchStocks = () => {
    return axios.get(`${API_URL}stocks/`);
};

export const createBill = (billData) => {
    return axios.post(`${API_URL}bills/`, billData);
};

export const searchProducts = (query) => {
    return axios.get(`http://localhost:8000/api/search-products/?search=${query}`);
};

export const fetchBanks = () => axios.get(`${API_URL}banks/`);
export const createBank = (data) => axios.post(`${API_URL}banks/`, data);

export const fetchUnit = () => axios.get(`${API_URL}units/`);
export const createUnit = (data) => axios.post(`${API_URL}units/`, data);

export const fetchSummaryDashboard = () => axios.get(`${API_URL}dashboard/`);

export const fetchPosBills = () => axios.get(`${API_URL}bills-recipt/`);



export const fetchAssets = () => {
    return axios.get(`${API_URL}assets/`);
};

export const addAsset = (asset) => {
    return axios.post(`${API_URL}assets/add/`, asset);
};

export const updateAsset = (id, asset) => {
    return axios.put(`${API_URL}assets/${id}/update/`, asset);
};

export const deleteAsset = (id) => {
    return axios.delete(`${API_URL}assets/${id}/delete/`);
};
export const fetchTransactions = (id) => {
    return axios.get(`${API_URL}transactions/`);
};


export const addTransaction = async (transactionData) => {
    try {
        const response = await axios.post(`${API_URL}transactions/`, transactionData);
        return response;
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
};
export const deleteTransaction = async (id) => {
    return await axios.delete(`${API_URL}transactions/${id}/`);
};

// export const ProductStock = () => axios.get(`${API_URL}supplier-products/`);
// export const AddToStock = (data) => axios.post(`${API_URL}supplier-products/`, data);

// export const fetchCustomers = () => axios.get(`${API_URL}customers/`);
// export const createCustomer = (data) => axios.post(`${API_URL}customers/`, data);

// export const fetchSales = () => axios.get(`${API_URL}sales/`);
// export const createSale = (data) => axios.post(`${API_URL}sales/`, data);



// export const fetchSupplierProducts = () => axios.get(`${API_URL}supplier-products/`);
// export const createSupplierProduct = (data) => axios.post(`${API_URL}supplier-products/`, data);

// export const ProductStock = () => axios.get(`${API_URL}product-stock/`);
// export const AddToStock = (data) => axios.post(`${API_URL}product-stock/`, data);
// export const productSearch = (query) => axios.get(`${API_URL}product-search/`, { params: { q: query } });
