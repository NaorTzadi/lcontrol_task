import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
//docker-compose down
//docker-compose up --build
function App() {
    const [customers, setCustomers] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const [companyMatch, setCompanyMatch] = useState('Equal');
    const [contactMatch, setContactMatch] = useState('Equal');

    const fetchCustomers = async () => {
        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

            const response = await axios.get(`${API_URL}/customers`, {
                params: { companyName, companyMatch, contactName, contactMatch, phone },
            });
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    return (
        <div className="container">
            <h1>Customer Search</h1>
            <div className="form">

                <div className="input-group">
                    <label>Company Name</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <div>
                        <label><input type="radio" name="companyMatch" value="Equal" checked={companyMatch === 'Equal'} onChange={() => setCompanyMatch('Equal')} /> Equal</label>
                        <label><input type="radio" name="companyMatch" value="Startwith" checked={companyMatch === 'Startwith'} onChange={() => setCompanyMatch('Startwith')} /> Startwith</label>
                        <label><input type="radio" name="companyMatch" value="Endwith" checked={companyMatch === 'Endwith'} onChange={() => setCompanyMatch('Endwith')} /> Endwith</label>
                        <label><input type="radio" name="companyMatch" value="Middle" checked={companyMatch === 'Middle'} onChange={() => setCompanyMatch('Middle')} /> Middle</label>
                    </div>
                </div>

                <div className="input-group">
                    <label>Contact Name</label>
                    <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                    />
                    <div>
                        <label><input type="radio" name="contactMatch" value="Equal" checked={contactMatch === 'Equal'} onChange={() => setContactMatch('Equal')} /> Equal</label>
                        <label><input type="radio" name="contactMatch" value="Startwith" checked={contactMatch === 'Startwith'} onChange={() => setContactMatch('Startwith')} /> Startwith</label>
                        <label><input type="radio" name="contactMatch" value="Endwith" checked={contactMatch === 'Endwith'} onChange={() => setContactMatch('Endwith')} /> Endwith</label>
                        <label><input type="radio" name="contactMatch" value="Middle" checked={contactMatch === 'Middle'} onChange={() => setContactMatch('Middle')} /> Middle</label>
                    </div>
                </div>

                <div className="input-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        placeholder="nnn-nnnnnnn"
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,3}(-\d{0,7})?$/.test(value)) {
                                setPhone(value);
                            }
                        }}
                    />
                </div>

                <button name='search_button' onClick={fetchCustomers}>Search</button>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Contact Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Total Orders</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer, index) => (
                    <tr key={index}>
                        <td>{customer.CompanyName}</td>
                        <td>{customer.ContactName}</td>
                        <td>{customer.Phone}</td>
                        <td>{customer.Address}</td>
                        <td>{customer.TotalOrders}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
