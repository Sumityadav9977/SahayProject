const connection = require("../../Model/DbConnect");

const getProfile = async (req, res)=>{
    let emailAddress = req.params.emailAddress;
    let sqlquery = 'select * from  adminuser where  emailAddress = ?';
    await connection.query(sqlquery,emailAddress,(error,result)=>{
        if(error){
            console.log(error.sqlMessage);
        }
           
            res.send(result);
        
     });
};

const putEmployeestatus= (req, res)=>{

    let id = req.query.emailAddress;
    let status = req.query.status; 
    let sql = `UPDATE profile SET status = ? WHERE emailAddress = ?`;
    console.log(sql, status, id)
    connection.query(sql, [status, id], function(error, result){
        if(error){
            console.log(error.sqlMessage);
        }
        else{
            res.send(result);
        }

        
    });
  };

module.exports = {  getProfile , putEmployeestatus};