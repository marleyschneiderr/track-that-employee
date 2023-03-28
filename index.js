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
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");

// connect MySQL to
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db",
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
    runProgram();
  })
  .catch((err) => {
    console.error(err);
  });

// welcome message in the terminal
console.table("\n------------ WELCOME TO THE EMPLOYEE TRACKER ------------\n");

// first question "what would you like to search?"
const runProgram = async () => {
  try {
    let answer = await inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to view?",
      choices: [
        "See Employees",
        "See Departments",
        "See Roles",
        "Add Employees",
        "Add Departments",
        "Add Roles",
        "Update Employee Role",
        "Exit",
      ],
    });

    switch (answer.action) {
      case "See Employees":
        seeEmployee();
        break;

      case "See Departments":
        seeDepartment();
        break;

      case "See Roles":
        seeRole();
        break;

      case "Add Employees":
        newEmployee();
        break;

      case "Add Departments":
        newDepartment();
        break;

      case "Add Roles":
        insertRole();
        break;

      case "Update Employee Role":
        employeeUpdate();
        break;

      case "Exit":
        connection.end();
        break;
    }
  } catch (err) {
    console.log(err);
    runProgram();
  }
};

// viewing all employees when prompt is selected
const seeEmployee = async () => {
  console.log("Employee View");
  try {
    let query = "Select * From employee";
    connection.query(query, function (err, res) {
      if (err) throw err;
      let employeeFunc = [];
      res.forEach((employee) => employeeFunc.push(employee));
      console.table(employeeFunc);
      runProgram();
    });
  } catch (err) {
    console.log(err);
    runProgram();
  }
};

// the selection that allows the user to view all of the departments
const seeDepartment = async () => {
  console.log("Department View");
  try {
    let query = "Select * From department";
    connection.query(query, function (err, res) {
      if (err) throw err;
      let departmentFunc = [];
      res.forEach((department) => departmentFunc.push(department));
      console.table(departmentFunc);
      runProgram();
    });
  } catch (err) {
    console.log(err);
    runProgram();
  }
};

// the selection that allows the user to look through/view through all the roles of the employees
const seeRole = async () => {
  console.log("Role View");
  try {
    let query = "Select * From role";
    connection.query(query, function (err, res) {
      if (err) throw err;
      let roleFunc = [];
      res.forEach((role) => roleFunc.push(role));
      console.table(roleFunc);
      runProgram();
    });
  } catch (err) {
    console.log(err);
    runProgram();
  }
};

// adding new employees to the database
const newEmployee = async () => {
  try {
    console.log("Add Employee");
    const [roles, managers] = await Promise.all([
      connection.query("Select * From role"),
      connection.query("Select * From employee"),
    ]);
    const answers = await inquirer.prompt([
      {
        name: "nameFirst",
        type: "input",
        message: "Please type the first name of the Employee.",
      },
      {
        name: "nameLast",
        type: "input",
        message: "Please type the last name of the Employee.",
      },
      {
        name: "idEmployeeRole",
        type: "list",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
        message: "Please type the Employee role ID.",
      },
      {
        name: "idManagerEmployee",
        type: "list",
        choices: managers.map((manager) => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        })),
        message: "Please type the Employee's Manager's ID.",
      },
    ]);

    await connection.query("INSERT INTO employee SET ?", {
      first_name: answers.nameFirst,
      last_name: answers.nameLast,
      role_id: answers.idEmployeeRole,
      manager_id: answers.idManagerEmployee,
    });

    console.log(
      `${answers.nameFirst} ${answers.nameLast} inserted successfully.\n`
    );
    runProgram();
  } catch (error) {
    console.log(error);
    runProgram();
  }
};

// adding a new department into the database
const newDepartment = async () => {
  console.log("Add Department"); // displaying the message inside the console confirming that we are adding a department to the database

  // asking the user to name the new department they are inputting using inquirer
  let answer = await inquirer.prompt([
    {
      name: "nameDepartment",
      type: "input",
      message: "Please type the name of your new department.",
      validate: (input) => input.trim().length > 0,
    },
  ]);

  try {
    let result = await connection.query("INSERT INTO department SET ?", {
      department_name: answer.nameDepartment,
    });
    console.log(
      `${answer.nameDepartment} inserted successfully to departments.\n`
    );
  } catch (err) {
    console.log(err); // logs any errors that occur when running the SQL query to the console
  }

  runProgram(); // continue the main program loop onto the next function
};

// time to add a new role into the db
const insertRole = async () => {
    try {
        console.log('Add Role');

        let departments = await connection.query("Select * From department")

        let answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Please type the name of your new role.'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Please insert related salary to this role.'
            },
            {
                name: 'idDepartment',
                type: 'list',
                choices: departments.map((idDepartment) => {
                    return {
                        name: idDepartment.department_name,
                        value: idDepartment.id
                    }
                }),
                message: 'List the department ID this role is associated with.',
            }
        ]);

            let selectedDepartment;
            for (i = 0; i < departments.length; i++) {
                if(departments[i].department_id === answer.choice) {
                    selectedDepartment = departments[i];
                };
            }
            let result = await connection.query("Insert INTO role SET ?, {
                title: answer.title,
                salary: answer.salary
            })
        
    }
}
