const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const config = {
    server: 'localhost',
    database: 'Northwind',
    user: 'sa',
    password: '',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

(async () => {
    try {
        console.log('Attempting to connect to the database...');
        const pool = await sql.connect(config);
        console.log('✅ Successfully connected to the database!');
        pool.close();
    } catch (error) {
        console.error('❌ Failed to connect to the database:', error.message);
        process.exit(1);
    }
})();

app.get('/customers', async (req, res) => {
    try {
        const { companyName, contactName, phone, matchType } = req.query;
        console.log('Incoming request:', { companyName, contactName, phone, matchType });

        const pool = await sql.connect(config);
        console.log('Connected to SQL Server');

        // Base query
        let query = `
            SELECT c.CompanyName, c.ContactName, c.Phone, c.Address, COUNT(o.OrderID) AS TotalOrders
            FROM Customers c
            LEFT JOIN Orders o ON c.CustomerID = o.CustomerID
        `;

        const conditions = [];

        if (companyName) {
            conditions.push(
                matchType === 'Equal'
                    ? `c.CompanyName = '${companyName}'`
                    : matchType === 'Startwith'
                        ? `c.CompanyName LIKE '${companyName}%'`
                        : matchType === 'Endwith'
                            ? `c.CompanyName LIKE '%${companyName}'`
                            : `c.CompanyName LIKE '%${companyName}%'`
            );
        }

        if (contactName) {
            conditions.push(
                matchType === 'Equal'
                    ? `c.ContactName = '${contactName}'`
                    : matchType === 'Startwith'
                        ? `c.ContactName LIKE '${contactName}%'`
                        : matchType === 'Endwith'
                            ? `c.ContactName LIKE '%${contactName}'`
                            : `c.ContactName LIKE '%${contactName}%'`
            );
        }

        if (phone) {
            conditions.push(`c.Phone = '${phone}'`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` GROUP BY c.CompanyName, c.ContactName, c.Phone, c.Address`;

        console.log('Executing Query:', query);

        const result = await pool.request().query(query);
        console.log('Query executed successfully. Rows returned:', result.recordset.length);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error retrieving customers:', error.message);
        res.status(500).send('Error retrieving data');
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
