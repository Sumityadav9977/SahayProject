const connection = require("./Model/DbConnect");
const express = require('express');
const cors = require('cors')
const xlsx = require('xlsx');
const multer = require('multer');
const mysql = require('mysql');
const moment = require('moment');
const fs = require('fs');
const path = require('path')
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

///////////////////////////////////////////////////
const upload = multer({ dest: 'uploads/' });

app.post('/upload/:emailAddress', upload.single('file'), async (req, res) => {
  try {

      // Get the file path from the request object
      const filePath = req.file.path;

      // Read the Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert Excel data to an array of objects
      const data = xlsx.utils.sheet_to_json(worksheet);


      const emailAddress = req.params.emailAddress;
      // Convert dates to proper format before inserting

      function convertExcelDate(excelDate) {
        const baseDate = new Date('1900-01-01');
        const date = new Date(baseDate.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return new Date(year, month - 1, day); // Create a new Date object with only the date components
      }
      const values = data.map((row) => {
 
        const companyIncorporationDate = row['Company Incorporation Date  ']; 
        const formattedDate = convertExcelDate(companyIncorporationDate);
       
          return [
              emailAddress,
              row['Sr. No'],
              row['Company Name'],
              row['Company Number'],
              row['Company Email'],
              formattedDate,
              row['City'],
              row['State'],
          ];
      });

      // Insert data into the table
      const insertQuery = `INSERT INTO 	employeedata (emailAddress, \`Sr. No\`, \`Company Name\`, \`Company Number\`, \`Company Email\`, \`Company Incorporation Date\`, \`City\`, \`State\`) VALUES ?`;

      await connection.query(insertQuery, [values]);

      res.status(200).send('Upload successful.');
  } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).send('An error occurred.');
  }
});

///////////////////////////////////////////////////


const EmpRouter = require('./Router/EmployeeDataRoute/EmployeeRoute');

const LoginRouter = require('./Router/LoginRoute/LoginRoute')

const ProfileRouter = require('./Router/ProfileRoute/Profile')

const DataRouter = require('./Router/LoginRoute/DataRoute')

const ExcelDataRouter = require('./Router/ExcelRoute/ExcelRoute')

app.use('/photo', express.static(path.join(__dirname, 'photo')));

app.use('/admin_emp',EmpRouter);

app.use('/employee',LoginRouter);

app.use('/exceldata',ExcelDataRouter);

app.use('/emp',ProfileRouter);

app.use('/getdata',DataRouter);

// 
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

app.post('/assigndata', upload.single('excelFile'), async (req, res) => {
  const excelFilePath = req.file.path; // Path of the uploaded Excel file

  // Read the uploaded Excel file
  const workbook = xlsx.readFile(excelFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const excelData = xlsx.utils.sheet_to_json(sheet);

  // Fetch employees from the database
  let employees;
  try {
    employees = await fetchEmployeesFromDatabase();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).send('Error fetching employees');
  }

  // Shuffle the data rows randomly
  const shuffledData = shuffleArray(excelData);

  // Distribute data equally among employees
  const totalEmployees = employees.length;
  const dataPerEmployee = Math.floor(shuffledData.length / totalEmployees);


  let dataIndex = 0;

  employees.forEach(async (employee, index) => {
    const startDataIndex = index * dataPerEmployee;
    const endDataIndex = startDataIndex + dataPerEmployee;
    const employeeData = shuffledData.slice(startDataIndex, endDataIndex);

    try {
     
      for (const dataRow of employeeData) {
        function convertAllExcelDate(excelDate) {
          const baseDate = new Date('1900-01-01');
          const date = new Date(baseDate.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return new Date(year, month - 1, day); // Create a new Date object with only the date components
        }
        const companyIncorporationDate = dataRow['Company Incorporation Date'];
        console.log(companyIncorporationDate);
        const formattedDate = (companyIncorporationDate !== null) ? convertAllExcelDate(companyIncorporationDate) : null;
        console.log(formattedDate)
        const insertQuery = 'INSERT INTO employeedata (`emailAddress`, `Sr. No`, `Company Name`, `Company Number`, `Company Email`, `Company Incorporation Date`, `City`, `State`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [
          employee.emailAddress,
          dataRow['Sr. No'],
          dataRow['Company Name'],
          dataRow['Company Number'],
          dataRow['Company Email'],
          formattedDate,
          dataRow['City'],
          dataRow['State']
        ];
        await executeQuery(insertQuery, insertValues);
        console.log(`Data added for Employee ${employee.emailAddress}`);
      }
    } catch (error) {
      console.error('Error adding data:', error);
    }
  });

  res.send('File uploaded and data shared successfully');
});


function fetchEmployeesFromDatabase() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM adminuser';
    connection.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}
const port = 4000;
app.listen(port,()=>{
    console.log(`server runnig on port ${port}`);
})