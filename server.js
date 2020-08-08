const mysql = require('mysql');
const inquirer = require('inquirer');
const console_table = require('console.table');
const connection = require('./connection.js');


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
                'exit'
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
                    viewBudget();
                    break;
                case 'exit':
                    quit();
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
                    break;
            }
        })
}
function viewBudget() {
    inquirer
        .prompt({
            type: "confirm",
            name: "deptBudget",
            message: "Would you like to compare Department Budgets?",
            default: true
        }).then(function (answer) {
            console.log('what is it y or n', answer);
            if ({ deptBudget: true }) {
                let query = "SELECT department.name, SUM(role.salary) FROM role INNER JOIN department ON department.id = role.department_id GROUP BY ?";
                connection.query(query, function (err, res) {
                    if (err) throw err;

                    console.table(res);
                });
            }
            startEmpCMS();
        })
}
function quit() {
    connection.end();
}

