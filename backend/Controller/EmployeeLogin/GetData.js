const connection = require("../../Model/DbConnect");
const getData = async (req, res)=>{
    let emailAddress = req.params.emailAddress;
    let sqlquery = 'select * from  datafile where  emailAddress = ?';
    await connection.query(sqlquery,emailAddress,(err,result)=>{
        if(err){
            console.log(err.sqlMessage)
        }
        else{
            console.log(result);
            res.send(result)
        }
    })
 }
 module.exports = { getData };