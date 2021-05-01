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

const managerChoices = [];
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
                'Update employee managers',
                'View departments',
                'View positions',
                'View employees',
                'View employees by manager',
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
                case 'Update employee managers':
                    updateEmployeeManagers();
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
                case 'View employees by manager':
                    viewEmployeesByManager();
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
        },
        {
            type: "confirm",
            name: "managerStatus",
            message: "Is this employee a manager?"
        },
        {
            when: (answers) => answers.managerStatus === true,
            type: "input",
            name: "managerId",
            message: "What is this manager's ID number?",
        },
        {
            when: (answers) => answers.managerStatus === false,
            type: "list",
            name: "employeeManagerId",
            message: "Who is this employee's manager?",
            choices: ["1 - Jim", "2 - Dwight", "3 - Michael", "4 - Andy"]
        }
    ]).then(function (res) {
        connection.query('INSERT INTO employees (first_name, last_name, position_id, manager_status, manager_id) values (?, ?, ?, ?, ?)',
            [res.firstName, res.lastName, 2, res.managerStatus, res.employeeManagerId.split('-')[0]], function (err, data) {
                if (err) throw err;
                console.log(data);
                console.table(data)
                if (res.managerStatus === true) {
                    addManager();
                };
                start();
            });
    });
};
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
    connection.query("SELECT employees.first_name, employees.last_name, departments.department, positions.position, positions.salary FROM employees INNER JOIN departments ON employees.position_id = departments.id INNER JOIN positions ON employees.position_id = positions.id;",
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

const addManager = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "managerIdNum",
            message: "What is this manager's ID?"
        },
    ]).then(function (res) {
        connection.query('INSERT INTO employees (manager_id) values (?)',
            [res.managerIdNum], function (err, data) {
                if (err) throw err;
                console.table(data);
                start();
            })
    })
};

async function updateEmployeeManagers() {
    await connection.query(
        "SELECT * FROM employees",
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
                name: "managerToUpdate",
                message: "Which employee's manager would you like to change? (Enter an ID)"
            },
            {
                type: "input",
                name: "updatedManagerId",
                message: "What would you like to change their manager ID to?",
            },
            {
                type: "confirm",
                name: "updateManagerStatus",
                message: "Would you like to change the status of this manager?"
            },
            {
                when: (answers) => answers.updateManagerStatus === true,
                type: "confirm",
                name: "managerStatus",
                message: "Is this person still a manager?",
            },
            {
                type: "confirm",
                name: "addAnotherManager",
                message: "Would you like to add another manager?"
            }
        ])
        .then(function (res) {
            console.table(res)
            let queryString = ``;
            let queryValues = [];
            if (res.updateManagerStatus === true) {
                queryString = `UPDATE employees SET manager_id=? WHERE id = ?`;
                queryValues = [res.updatedManagerId, res.managerToUpdate];
            } else if (res.updateManagerStatus === false) {
                start();
            } else if (res.addAnotherManager === true) {
                addManager();
                return addManager();
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
};

const viewEmployeesByManager = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "managerId",
            message: "Which manager's employees would you like to view?",
            choices: ["1 - Jim", "2 - Dwight", "3 - Michael", "4 - Andy"]
        },
    ]).then(function (res) {
        connection.query('SELECT * FROM employees WHERE manager_id=?',
            [res.managerId], function (err, data) {
                if (err) throw err;
                console.table(data);
                start();
            })
    })
};