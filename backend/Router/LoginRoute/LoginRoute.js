const express = require('express');
const LoginRouter = express.Router();

const { getLogin, AdminLogin } = require("../../Controller/EmployeeLogin/Login")
LoginRouter.post('/login',getLogin);
LoginRouter.post('/admin',AdminLogin);


module.exports = LoginRouter;