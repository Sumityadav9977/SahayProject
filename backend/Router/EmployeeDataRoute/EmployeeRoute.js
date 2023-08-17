const express = require('express');
const EmpRouter = express.Router();

const { getEmp, postEmp, putEmp, delEmp} = require("../../Controller/EmployeeData/Employee")
EmpRouter.post('/view',getEmp);
EmpRouter.post('/addEmp',postEmp);
EmpRouter.put('/update/:emailAddress',putEmp);
EmpRouter.delete('/delEmployee',delEmp);


module.exports = EmpRouter;