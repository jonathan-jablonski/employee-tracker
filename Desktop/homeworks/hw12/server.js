const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// creates the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employeesDb',
});

// function which prompts the user for what action they should take
const start = () => {
  inquirer
    .prompt({
      name: 'init',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
          'Add a department', 
          'Add a role', 
          'Add an employee', 
          'Update employee roles',
          'View departments', 
          'View roles',
          'View employees'
        ],
    })
    .then((answer) => {
      // based on their answer, switch statement to display certain 
        switch (task) {
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update employee roles':
                updateEmployeeRoles();
                break;
            case 'View departments':
                viewDepartments();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View Employees':
                viewEmployees();
                break;
        }   
    });
};
// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});