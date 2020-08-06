const mysql = require('mysql');
const inquirer = require('inquirer');
const console_table = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    // port local is 3306
    port: 3306,

    user: 'root',

    password: 'iC4]mY5*pZ4<uD7&rP8(',
    database: 'employees'
});

connection.connect(function (err) {
    if (err) throw err;
    startEmpCMS();
});

function startEmpCMS() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                'View, add, remove, and update Employees?',
                'View, add, and remove Roles?',
                'View, add, and remove, Departments?',
                'View Departments Labor Budgets',

            ]
        }).then(function (answer) {
            switch (answer.action) {
                case 'View, add, remove, and update Employees?':
                    getEmpData();
                    break;
                case 'View, add, and remove Roles?':
                    getRole();
                    break;

                case 'View, add, and remove, Departments?':
                    getDept();
                    break;
                case 'View Departments Labor Budgets':
                    getBudget();
                    break;
            }
        });
}

function getEmpData() {
    inquirer
        .prompt({
            name: "empData",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                'View All Employees?',
                'Add an Employee?',
                'View all Employess by Department?',
                'View all Employees by Manager?',
                'Update an Employee?',
                'Remove an Employee?',

            ]
        }).then(function (answer) {
            switch (answer.empData) {
                case "View all Employees?":
                    viewEmps();
                    break;

                case "Add an Employee?":
                    addEmp();
                    break;

                case "View all Employess by Department?":
                    EmpByDept();
                    break;

                case "View all Employees by Manager?":
                    EmpByMngr();
                    break;
                case "Update Employee?":
                    updateEmp();
                    break;

                case "Remove an Employee?":
                    deleteEmp();
                    break;
            }
        });
}

function getRole() {
    inquirer
        .prompt({
            name: "roleInfo",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                'View All Roles?',
                'Add a Role?',
                'Remove a Role?',

            ]
        }).then(function (answer) {
            switch (answer.roleInfo) {
                case "View All Roles?":
                    viewRoles();
                    break;
                case "Add a Role?":
                    addRole();
                    break;
                case "Remove a Role?":
                    deleteRole();
                    break;
            }
        })
}


function getDept() {
    inquirer
        .prompt({
            name: "deptInfo",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                'View All Departments?',
                'Add a Department?',
                'Remove a Department?',
                'View Departments Labor Budgets',

            ]
        }).then(function (answer) {
            switch (answer.deptInfo) {
                case "View All Departments?":
                    viewDepts();
                    break;
                case "Add a Department?":
                    addDept();
                    break;
                case "Remove a Department?":
                    deleteDept();
                case "View Department's Labor Budget":
                    viewBudget();
                    break;
            }
        })
}
