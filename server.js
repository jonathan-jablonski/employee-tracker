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
// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
// function which prompts the user for what action they should take
const start = () => {
    console.log('Employee Tracker\n \nMain Menu');
    console.log('=============================================');
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
                'View budget',
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
                case 'View employees':
                    viewEmployees();
                    break;
                case 'View budget':
                    viewBudget();
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
    ]).then(function (res) {
        connection.query('INSERT INTO positions (position, salary, department_id) values (?, ?, ?)',
            [res.position, res.salary, res.departmentId], function (err, data) {
                if (err) throw err;
                console.table(data);
                start();
            })

    })
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        }
    ]).then(function (res) {
        connection.query('INSERT INTO employees (first_name, last_name) values (?, ?)',
            [res.firstName, res.lastName], function (err, data) {
                if (err) throw err;
                console.table(data);
                start();
            })
    })
}

async function updateEmployeePositions() {
    await connection.query(
        "SELECT * FROM POSITIONS",
        function (err, data) {
            data.forEach((position) => {
                console.table(data);
            })
        }
    );
    inquirer
        .prompt([
            {
                type: "input",
                name: "positionToUpdate",
                message: "What position would you like to change? (Enter an ID)"
            },
            {
                type: "list",
                name: "changeChoice",
                message: "What would you like to change?",
                choices: ["Position", "Salary", "Department"],
            },
            {
                when: (answers) => answers.changeChoice === "Position",
                type: "input",
                name: "position",
                message: "What is their new position?",
            },
            {
                when: (answers) => answers.changeChoice === "Salary",
                type: "input",
                name: "salary",
                message: "What is their new salary?",
            },
            {
                when: (answers) => answers.changeChoice === "Department",
                type: "input",
                name: "department",
                message: "What is their new department?",
            },
        ])
        .then(function (res) {
            console.table(res)
            let queryString = ``;
            let queryValues = [];
            if (res.changeChoice === 'Position') {
                queryString = `UPDATE positions SET position=? WHERE id = ?`;
                queryValues = [res.position, res.positionToUpdate]
            } else if (res.changeChoice === 'Salary') {
                queryString = `UPDATE positions SET salary=? WHERE id = ?`;
                queryValues = [res.salary, res.positionToUpdate]
            } else if (res.changeChoice === 'Department') {
                queryString = `UPDATE positions SET deparment_id=? WHERE id = ?`;
                queryValues = [res.department_id, res.positionToUpdate]
            }
            connection.query(
                queryString,
                queryValues,
                function (err, data) {
                    if (err) throw err;
                    console.table(data);
                    start();
                }
            );
        });
}
// Return a list of stored departments
const viewDepartments = () => {
    connection.query("SELECT * FROM departments", function (err, data) {
        if (err) throw err;
        console.log('\n Departments \n');
        console.table(data);
        console.log('\n =============================================\n')
        start();
    });
};
// Return a list of positions
const viewPositions = () => {
    connection.query("SELECT * FROM positions", function (err, data) {
        if (err) throw err;
        console.log('\n Positions \n');
        console.table(data);
        console.log('\n =============================================\n')
        start();;
    });
};

// Return a list of employees
const viewEmployees = () => {
    connection.query("SELECT employees.first_name, employees.last_name, departments.department, positions.position, positions.salary FROM employees INNER JOIN departments ON employees.role_id = departments.id INNER JOIN positions ON employees.role_id = positions.id;", 
 /*
SELECT employees.first_name, employees.last_name, departments.department, positions.position, positions.salary 
FROM employees 
INNER JOIN departments 
ON employees.role_id = departments.id 
INNER JOIN positions 
ON employees.role_id = positions.id;
*/
    function (err, data) {
        if (err) throw err;
        console.log('\n Employees \n');
        console.table(data);
        console.log('\n =============================================\n')
        start();
    });
};
// Return a sum of all salaries
const viewBudget = () => {
    connection.query("SELECT SUM(salary) FROM positions;", function (err, data) {
        if (err) throw err;
        console.log('\n Current sum of all salaries in USD: \n');
        console.table(data);
        console.log('\n =============================================\n')
        start();
    });
};