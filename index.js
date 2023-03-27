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
            message: 'What would you like to view?'
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
            
        }
    }
}