const connection = require("../../Model/DbConnect");
const getExcelData = async (req, res)=>{
    let emailAddress = req.params.emailAddress;

    let sqlquery = 'select * from  employeedata where  emailAddress = ?';
    await connection.query(sqlquery,emailAddress,(error,result)=>{
        if(error){
            console.log(error.sqlMessage);
        }
           
            res.send(result);
        
     });
};

const getCompanyDetails = async (req, res)=>{
    let CompanyName = req.params['Company Name'];

    let sqlquery = 'select * from  employeedata where  `Company Name` = ?';
    await connection.query(sqlquery,CompanyName,(error,result)=>{
        if(error){
            console.log(error.sqlMessage);
        }
           
            res.send(result);
        
     });
};

const getAllData = (req, res)=>{
    let sqlQuery = "SELECT * FROM employeedata";
    let userData = req.body;
     connection.query(sqlQuery, userData, function(error, result){
        if(error){
            console.log(error.sqlMessage);
        }
           
            res.send(result);
        
     });
};

const putStatus = (req, res)=>{
    
    let id = [req.body.Status,req.body.CompanyName];
    // let id = ["pending","sumityadav5232@gmail.com"];
    let sqlQuery = 'UPDATE employeedata SET Status = ? where `Company Name` = ? ';
    connection.query(sqlQuery,id, function(error, result){
        if(error){
            console.log(error.sqlMessage);
        }
        else{
            res.send(result);
        }
    });
  };

module.exports = { getExcelData, getAllData, putStatus, getCompanyDetails }
