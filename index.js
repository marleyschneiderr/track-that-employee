const inquirer = require("inquirer");

const nextChoice = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "userSelection",
    choices: [
      "View all employees",
      "View all departments",
      "View all roles",
      "Add an employee",
      "Add a department",
      "Add a role",
      "Delete an employee",
      "Delete a department",
      "Delete a role",
    ],
  },
];



inquirer.prompt(nextChoice).then((response) => {
  console.log("response looks like", response);
  // what shall we have happen now that we know what the user wants to do?

  // response.confirm === response.password
  //   ? console.log("Success!")
  //   : console.log("You forgot your password already?!")
});
