const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// creates the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'companyDB',
});

// function which prompts the user for what action they should take
const start = () => {
    console.log('\nWelcome to the employee tracker application! Select an option below to get started.')
    console.log('============================================')
    inquirer
        .prompt({
            name: 'init',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add a department',
                'Add a position',
                'Add an employee',
                'Update employee positions',
                'View departments',
                'View positions',
                'View employees',
                'Exit'
            ],
        })
        .then(function ({ init }) {
            // based on their answer, calling certain functions to run
            switch (init) {
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a position':
                    addPosition();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update employee positions':
                    updateEmployeePositions();
                    break;
                case 'View departments':
                    viewDepartments();
                    break;
                case 'View positions':
                    viewPositions();
                    break;
                case 'View Employees':
                    viewEmployees();
                    break;
                case 'Exit':
                    connection.end();
                    break;
            }
        });
};

// function to add a department to seed.sql
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "addedDepartment",
            message: "What department would you like to add?"
        }
    ]).then(function (res) {
        connection.query('INSERT INTO departments (department) VALUES (?)', [res.addedDepartment], function (err, data) {
            if (err) throw err;
            console.table("Successful insertion");
            start();
        })
    }
    )
};

const addPosition = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "position",
            message: "Enter role:"
        },
        {
            type: "number",
            name: "salary",
            message: "Enter salary:"
        },
        {
            type: "number",
            name: "departmentId",
            message: "Enter department ID number:"
        }
    ]).then(function (res){
        connection.query('INSERT INTO positions (position, salary, departmentId) values (?, ?, ?)', 
        [res.position, res.salary, res.departmentId], function(err, data){
            if (err) throw err;
            console.table(data);
        })
        start();
    })
}
// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});