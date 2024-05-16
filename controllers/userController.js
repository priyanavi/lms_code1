// controllers/userController.js
const path = require('path');
const userModel = require('../model/usermodel');

exports.showRegisterForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
};

exports.registerAdmin = async (req, res) => {
    const { username, password, email, phone ,role  } = req.body;
    
    try {
        // Check if the user already exists
        const userExists = await userModel.checkUserExists(phone, email);
        if (userExists) {
            res.redirect('/login');
            return;
        }

        // Insert the new user into the database
        await userModel.insertAdmin(username, password, email, phone,role);

        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error('Error:', error);
        res.send('Error registering user. Please try again.');
    }
};
exports.registerStudent = async (req, res) => {
    const { username, password, email, phone ,role  } = req.body;
    
    try {
        // Check if the user already exists
        const userExists = await userModel.checkUserExists1(phone, email);
        if (userExists) {
            res.redirect('/login');
            return;
        }

        // Insert the new user into the database
        await userModel.insertStudent(username, password, email, phone,role);

        // Redirect to login page after successful registration
        res.redirect('/login');
    } catch (error) {
        console.error('Error:', error);
        res.send('Error registering user. Please try again.');
    }
};
exports.showLoginForm = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
};

exports.redirectToLogin = (req, res) => {
    const userType = req.params.userType;
    if (userType === 'login') {
        res.redirect('/login'); // Redirect to user login page
    } else if (userType === 'admin-login') {
        res.redirect('/admin-login'); // Redirect to admin login page
    } else {
        res.redirect('/login'); // Default to general login page
    }
};
exports.insertHTML = async (req, res) => {
    const { Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV } = req.body;
    
    try {
        // Insert data into the HTML table
        await userModel.insertHTML(Full_Name, Email, Address, City, State, Zip_code, Name_On_Card, Debit_Card, Exp_Month, Exp_Year, CVV);
        
        // Redirect after successful insertion
        res.redirect('/payment_s');
    } catch (error) {
        console.error('Error inserting payment data:', error);
        res.status(500).send('Internal Server Error');
    }
};