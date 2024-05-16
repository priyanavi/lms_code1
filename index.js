const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userModel = require('./model/usermodel');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/',require('./router/userRoutes'))

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
