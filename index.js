// const inquirer = require("inquirer");

// const nextChoice = [
//   {
//     type: "list",
//     message: "What would you like to do?",
//     name: "userSelection",
//     choices: [
//       "View all employees",
//       "View all departments",
//       "View all roles",
//       "Add an employee",
//       "Add a department",
//       "Add a role",
//       "Delete an employee",
//       "Delete a department",
//       "Delete a role",
//     ],
//   },
// ];



// inquirer.prompt(nextChoice).then((response) => {
 // console.log("response looks like", response);
  // what shall we have happen now that we know what the user wants to do?

  // response.confirm === response.password
  //   ? console.log("Success!")
  //   : console.log("You forgot your password already?!")
// });


// all dependices used for this code
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

// connect MySQL to 
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

// Using util function to convert the query() function into a promise-based function. 
// Instead of passing a callback function to query(), I can now use async/await or .then/ catch to get query results.
connection.query = util.promisify(connection.query);

// start the application once connected
function connectToDatabase() {
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  connectToDatabase()
    .then(() => {
      initialAction();
    })
    .catch((err) => {
      console.error(err);
    });

// welcome message in the terminal 
console.table(
    "\n------------ WELCOME TO THE EMPLOYEE TRACKER ------------\n"
)

// first question "what would you like to search?"
const initialAction = async () => {
    try {
        let answer = await inquirer.prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to view?',
            choices: [
                'See Employees',
                'See Departments',
                'See Roles',
                'Add Employees',
                'Add Departments',
                'Add Roles',
                'Update Employee Role',
                'Exit'
            ]
        });

        switch (answer.action) {
            case 'See Employees':
                seeEmployee();
                break;
            
            case 'See Departments':
                seeDepartment();
                break;

            case 'See Roles':
                seeRole();
                break;

            case 'Add Employees':
                newEmployee();
                break;

            case 'Add Departments':
                departmentAdd();
                break;

            case 'Add Roles':
                roleAdd();
                break;

            case 'Update Employee Role':
                employeeUpdate();
                break;

            case 'Exit':
                connection.end();
                break;
        };

    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// viewing all employees when prompt is selected
const seeEmployee = async () => {
    console.log('Employee View');
    try {
        let query = 'Select * From employee';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let employeeFunc = [];
            res.forEach(employee => employeeFunc.push(employee));
            console.table(employeeFunc);
            initialAction();
        });
    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// the selection that allows the user to view all of the departments
const seeDepartment = async () => {
    console.log('Department View');
    try {
        let query = 'Select * From department';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let departmentFunc = [];
            res.forEach(department => departmentFunc.push(department));
            console.table(departmentFunc);
            initialAction();
        });
    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// the selection that allows the user to look through/view through all the roles of the employees
const seeRole = async () => {
    console.log('Role View');
    try {
        let query = 'Select * From role';
        connection.query(query, function (err, res) {
            if (err) throw err;
            let roleFunc = [];
            res.forEach(role => roleFunc.push(role));
            console.table(roleFunc);
            initialAction();
        });
    } catch (err) {
        console.log(err);
        initialAction();
    };
}

// adding new employees to the database
const newEmployee = async () =>
