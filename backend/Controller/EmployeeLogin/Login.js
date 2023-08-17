const connection = require('../../Model/DbConnect');
//////////////////Employee Login///////////////
const jwt = require("jsonwebtoken")

const getLogin = async (req, res)=>{
    let emailAddress = req.query.emailAddress;
    let password = req.query.password;
    //  let data = res.body;
   
    let sql = "SELECT emailAddress, name FROM adminuser WHERE emailAddress = ? AND password = ? "
    const a = await  connection.query(sql,[emailAddress, password], async function(error, result){
        // console.log("Sql",a.sql)

        const secretKey = 'iamsumityadavjiiiiiiiiiiiiiiiiiiiiiii';
        const options = {
            expiresIn:"1day"
        };

        const token = jwt.sign({emailAddress},secretKey,options);


        const userVer = await jwt.verify(token, "iamsumityadavjiiiiiiiiiiiiiiiiiiiiiii")
        console.log("token",token)
        

        if (error) {
            return res.json({ status: 400, response: error.message })
        }

            if(result.length == 0){
             return res.json({
                    status:404,
                   response: "Invalid User "
                })            
            }
             else {
                  
             return res.send({
                status:200,
                response:result,
                user:token,
                // emailAddress:req.session.emailAddress 
                })
            }

        })
        
}



const AdminLogin = async (req, res)=>{
    let emailAddress = req.query.emailAddress;
    let password = req.query.password;
    //  let data = res.body;
   
    let sql = "SELECT emailAddress, name FROM adminlogin WHERE emailAddress = ? AND password = ?"
    const a = await  connection.query(sql,[emailAddress, password], async function(error, result){
        // console.log("Sql",a.sql)

        const secretKey = 'iamsumityadavjiiiiiiiiiiiiiiiiiiiiiii';
        const options = {
            expiresIn:"1day"
        };

        const token = jwt.sign({emailAddress},secretKey,options);


        const userVer = await jwt.verify(token, "iamsumityadavjiiiiiiiiiiiiiiiiiiiiiii")
        console.log("token",token)
        

        if (error) {
            return res.json({ status: 400, response: error.message })
        }

            if(result.length == 0){
             return res.json({
                    status:404,
                   response: "Invalid User "
                })            
            }
             else {
                  
             return res.send({
                status:200,
                response:result,
                user:token,
                // emailAddress:req.session.emailAddress 
                })
            }

        })
        
}



module.exports = { getLogin, AdminLogin };
