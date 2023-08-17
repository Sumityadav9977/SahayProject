const express = require('express');
const DataRouter = express.Router();

const { getData } = require("../../Controller/EmployeeLogin/GetData")
DataRouter.post('/view/:emailAddress',getData);


module.exports = DataRouter;