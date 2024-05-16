const sql = require('mssql');
const dbConfig = require('../db/dbconfig');

// SQL Connection Pool
const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

pool.on('error', err => {
    console.error('SQL Pool Error:', err);
});

// Function to execute SQL queries
async function executeQuery(query) {
    try {
        await poolConnect;
        const request = pool.request();
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL Error:', err);
        throw err;
    }
}

// Function to check if user already exists
async function checkUserExists(phone, email) {
    try {
        const existingUser = await executeQuery(`SELECT * FROM Admin WHERE Phone='${phone}' OR Email='${email}'`);
        return existingUser.length > 0;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}



// Function to insert new user into the database
async function insertAdmin(username, password, email, phone) {
    try {
        await executeQuery(`INSERT INTO Admin (Username, Password, Email, Phone) VALUES ('${username}', '${password}', '${email}', '${phone}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function checkUserExists1(phone, email) {
    try {
        const existingUser = await executeQuery(`SELECT * FROM Student WHERE Phone='${phone}' OR Email='${email}'`);
        return existingUser.length > 0;
    } catch (error) {
        console.error('Error checking user existence:', error);
        throw error;
    }
}

// userModel.js

// Function to insert new user into the database
async function insertStudent(username, password, email, phone) {
    try {
        await executeQuery(`INSERT INTO Student(Username, Password, Email, Phone) VALUES ('${username}', '${password}', '${email}', '${phone}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}

async function getStudentCount() {
    try {
        const result = await executeQuery("SELECT COUNT(*) AS studentCount FROM Student");
        return result[0].studentCount;
    } catch (error) {
        console.error('Error getting student count:', error);
        throw error;
    }
}

// Function to insert OTP into the database
async function insertOTP(username,email, OTP) {
    try {
        await executeQuery(`INSERT INTO OTP (username,email, OTP) VALUES ('${username}','${email}', '${OTP}')`);
    } catch (error) {
        console.error('Error inserting OTP:', error);
        throw error;
    }
}
async function getStoredOTP(username, email) {
    try {
        const query = `SELECT OTP FROM OTP WHERE username=username AND email=email`;
        const result = await executeQuery(query, [username, email]);
        // console.log('Result:', result); // Log the result to check what data is returned
        if (result && result.length > 0) {
            // Extract and return the OTP value
            return result[result.length - 1].OTP;
        } else {
            // If no OTP is found, return null
            return null;
        }
    } catch (error) {
        console.error('Error retrieving stored OTP:', error);
        throw error;
    }
}


async function insertHTML(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) {
    try {
        await executeQuery(`INSERT INTO HTML(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) VALUES ('${Full_Name}', '${Email}', '${Address}', '${City}', '${State}', ${Zip_code}, '${Name_On_Card}', '${Debit_Card}', '${Exp_Month}', '${Exp_Year}', '${CVV}')`);
    } catch (error) {
        console.error('Error inserting user details:', error);
        throw error;
    }
}




async function insertCSS(Full_Name,Email ,Address ,City ,State ,Zip_code ,Name_On_Card ,Debit_Card ,Exp_Month ,Exp_Year ,CVV) {
    try {
        await executeQuery(`INSERT INTO CSS(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) VALUES ('${Full_Name}', '${Email}', '${Address}', '${City}', '${State}', ${Zip_code}, '${Name_On_Card}', '${Debit_Card}', '${Exp_Month}', '${Exp_Year}', '${CVV}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
async function insertJavaScript(Full_Name,Email ,Address ,City ,State ,Zip_code ,Name_On_Card ,Debit_Card ,Exp_Month ,Exp_Year ,CVV) {
    try {
        await executeQuery(`INSERT INTO JavaScript (Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) VALUES ('${Full_Name}', '${Email}', '${Address}', '${City}', '${State}', ${Zip_code}, '${Name_On_Card}', '${Debit_Card}', '${Exp_Month}', '${Exp_Year}', '${CVV}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
async function insertPython(Full_Name,Email ,Address ,City ,State ,Zip_code ,Name_On_Card ,Debit_Card ,Exp_Month ,Exp_Year ,CVV) {
    try {
        await executeQuery(`INSERT INTO Python (Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) VALUES ('${Full_Name}', '${Email}', '${Address}', '${City}', '${State}', ${Zip_code}, '${Name_On_Card}', '${Debit_Card}', '${Exp_Month}', '${Exp_Year}', '${CVV}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
async function insertC(Full_Name,Email ,Address ,City ,State ,Zip_code ,Name_On_Card ,Debit_Card ,Exp_Month ,Exp_Year ,CVV) {
    try {
        await executeQuery(`INSERT INTO C(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) VALUES ('${Full_Name}', '${Email}', '${Address}', '${City}', '${State}', ${Zip_code}, '${Name_On_Card}', '${Debit_Card}', '${Exp_Month}', '${Exp_Year}', '${CVV}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}
async function insertJava(Full_Name,Email ,Address ,City ,State ,Zip_code ,Name_On_Card ,Debit_Card ,Exp_Month ,Exp_Year ,CVV) {
    try {
        await executeQuery(`INSERT INTO Java (Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV) VALUES ('${Full_Name}', '${Email}', '${Address}', '${City}', '${State}', ${Zip_code}, '${Name_On_Card}', '${Debit_Card}', '${Exp_Month}', '${Exp_Year}', '${CVV}')`);
    } catch (error) {
        console.error('Error inserting user:', error);
        throw error;
    }
}



async function isAdminRegistered(email) {
    try {
        // Prepare the SQL query with parameterized values to avoid SQL injection
        const query = 'SELECT COUNT(*) AS count FROM Admin WHERE email = @email';

        // Create a new request with parameters
        const request = pool.request();
        request.input('email', sql.VarChar, email);

        // Execute the query and retrieve the result
        const result = await request.query(query);

        // Extract the count from the result
        const count = result.recordset[0].count;

        // Return true if count > 0, indicating that the admin is registered
        return count > 0;
    } catch (error) {
        console.error('Error checking admin registration:', error);
        throw error; // Handle the error appropriately
    }
}

async function isStudentRegistered(email) {
    try {
        // Prepare the SQL query with parameterized values to avoid SQL injection
        const query = 'SELECT COUNT(*) AS count FROM Student WHERE email = @email';

        // Create a new request with parameters
        const request = pool.request();
        request.input('email', sql.VarChar, email);

        // Execute the query and retrieve the result
        const result = await request.query(query);

        // Extract the count from the result
        const count = result.recordset[0].count;

        // Return true if count > 0, indicating that the student is registered
        return count > 0;
    } catch (error) {
        console.error('Error checking student registration:', error);
        throw error; // Handle the error appropriately
    }
}
async function getMemberCount(course) {
    try {
        // Define the SQL query to count the number of members in the specified course table
        const query = `SELECT COUNT(*) AS memberCount FROM ${course}`;

        // Execute the SQL query using the executeQuery function
        const result = await executeQuery(query);

        // Extract the member count from the query result
        const memberCount = result[0].memberCount;

        // Return the member count
        return memberCount;
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error('Error fetching member count:', error);
        throw error;
    }
}


   



module.exports = {
    executeQuery,
    checkUserExists,
    insertAdmin,
    getStoredOTP,
    insertOTP,
    insertStudent,
    checkUserExists1,
    getStudentCount,
    insertHTML,
    insertCSS,
    insertJavaScript,
    insertPython,
    insertC,
    insertJava,
    isAdminRegistered,
    isStudentRegistered,
    getMemberCount
    
};
