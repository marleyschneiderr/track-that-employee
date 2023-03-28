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
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const util = require("util");

// connect MySQL to
let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Murphydog1!2023",
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
        changeEmployee();
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
    let query = "SELECT * FROM employee";
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
    let query = "SELECT * FROM department";
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
    let query = "SELECT * FROM role";
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
      connection.query("SELECT * FROM role"),
      connection.query("SELECT * FROM employee"),
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
  // declaring insertRole function that is asyncro and inserts new role into the db
  try {
    console.log("Add Role");

    const departments = await connection.query("SELECT * FROM department"); // uses connection object to query the db for ALL departments, the await term is used to complete the addition before moving on

    const answer = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "Please type the name of your new role.",
      },
      {
        name: "salary",
        type: "input",
        message: "Please insert related salary to this role.",
      },
      {
        name: "department",
        type: "list",
        choices: departments.map((department) => ({
          name: department.department_name,
          value: department.id,
        })),
        message: "List the department ID this role is associated with.",
      },
    ]);

    const department = departments.find(
      (department) => department.id === answer.department
    );

    const result = await connection.query("INSERT INTO role SET ?", {
      title: answer.title,
      salary: answer.salary,
      department_id: answer.department,
    });

    console.log(`${answer.title} role inserted successfully.\n`);
    runProgram();
  } catch (err) {
    console.log(err);
    runProgram();
  }
};

// taking individual employee and updating what they do
const changeEmployee = async () => { // declaring the employee change function to begin update
  try {
    console.log("Update Employee");

    const employees = await connection.query("SELECT * FROM employee"); // updating employee is started in db, selecting specifics here
    if (employees.length === 0) {
      console.log("There are no employees to update.\n");
      return runProgram(); // checking the employees array to see existing employees, if there is none, it says no employees are in there to update 
    }

    const { employee } = await inquirer.prompt([ // telling user to pick specific employee, dropdown menu starts with inquirer prompts/answers
      {
        name: "employee",
        type: "list",
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
        message: "Select an employee to update.",
      },
    ]);

    const roles = await connection.query("SELECT * FROM role");
    if (roles.length === 0) {
      console.log("There are no roles to update the employee with.\n");
      return runProgram();
    }

    const { role } = await inquirer.prompt([
      {
        name: "role",
        type: "list",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
        message: "Select the role to update the employee with.",
      },
    ]);

    await connection.query("UPDATE employee SET ? WHERE ?", [
      { role_id: role },
      { id: employee },
    ]);

    console.log("The role was successfully changed.\n");
    return runProgram();
  } catch (error) {
    console.log("An error occurred while updating the employee:", error);
    return runProgram();
  }
};
