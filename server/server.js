const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const config = {
    server: 'sqlserver',
    database: 'Northwind',
    user: 'sa',
    password: 'YourStrong@Password123',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

let pool;

(async () => {
    try {
        pool = await sql.connect(config);
        console.log('[backend]: ✅ Successfully connected to the database!');
    } catch (error) {
        console.error('[backend]: ❌ Failed to connect to the database:', error.message);
        process.exit(1);
    }
})();

app.get('/customers', async (req, res) => {
    console.log("[backend]: received request for customers");

    const { companyName, contactName, phone, companyMatch = 'Equal', contactMatch = 'Equal' } = req.query;
    console.log("[backend]: received Query Parameters:", { companyName, companyMatch, contactName, contactMatch, phone });

    try {
        let query = `
            SELECT c.CompanyName, c.ContactName, c.Phone, c.Address, COUNT(o.OrderID) AS TotalOrders
            FROM Customers c
            LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
        `;

        const conditions = [];
        const request = pool.request();

        if (companyName) {
            if (companyMatch === 'Equal') {
                conditions.push(`c.CompanyName = @companyName`);
                request.input('companyName', sql.NVarChar, companyName);
            } else if (companyMatch === 'Startwith') {
                conditions.push(`c.CompanyName LIKE @companyName`);
                request.input('companyName', sql.NVarChar, `${companyName}%`);
            } else if (companyMatch === 'Endwith') {
                conditions.push(`c.CompanyName LIKE @companyName`);
                request.input('companyName', sql.NVarChar, `%${companyName}`);
            } else if (companyMatch === 'Middle') {
                conditions.push(`c.CompanyName LIKE @companyName`);
                request.input('companyName', sql.NVarChar, `%${companyName}%`);
            }
        }

        if (contactName) {
            if (contactMatch === 'Equal') {
                conditions.push(`c.ContactName = @contactName`);
                request.input('contactName', sql.NVarChar, contactName);
            } else if (contactMatch === 'Startwith') {
                conditions.push(`c.ContactName LIKE @contactName`);
                request.input('contactName', sql.NVarChar, `${contactName}%`);
            } else if (contactMatch === 'Endwith') {
                conditions.push(`c.ContactName LIKE @contactName`);
                request.input('contactName', sql.NVarChar, `%${contactName}`);
            } else if (contactMatch === 'Middle') {
                conditions.push(`c.ContactName LIKE @contactName`);
                request.input('contactName', sql.NVarChar, `%${contactName}%`);
            }
        }

        if (phone) {
            conditions.push(`c.Phone = @phone`);
            request.input('phone', sql.NVarChar, phone);
        }

        if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;


        query += ` GROUP BY c.CompanyName, c.ContactName, c.Phone, c.Address`;

        console.log("[backend]: final Executing Query:", query);

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).send('Error retrieving data');
    }
});

app.listen(port, () => console.log(`[backend]: Server running on http://localhost:${port}`));
