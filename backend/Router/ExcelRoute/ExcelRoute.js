const express = require('express');
const ExcelDataRouter = express.Router();

const { getExcelData, getAllData, putStatus} = require("../../Controller/ExcelData/ExcelData")
ExcelDataRouter.post('/view/:emailAddress',getExcelData);
ExcelDataRouter.post('/viewCompany/:`Company Name`',getExcelData);

ExcelDataRouter.post('/viewalldata',getAllData);
ExcelDataRouter.post('/update',putStatus);



module.exports =ExcelDataRouter;