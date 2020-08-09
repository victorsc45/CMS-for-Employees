//dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require("./config/connection.js");
const { printTable } = require('console-table-printer');
const dotenv = require("dotenv").config();
//arrays

let employeeRolesNames = [];
let employeeFullName = [];
let roleDepartment = [];

let rolesArray = [];
let employeesArray = [];
let departmentsArray = [];
//initialize CMS application
CMS();

function CMS() {
    inquirer
        .prompt({
            name: 'options',
            type: 'list',
            message: 'Please select ONE of the following FUNCTIONS : ',
            choices: ['View Current Employees?', 'View Employees by Manager?', 'View Employees by Role?', new inquirer.Separator(),
                'View Departments?', 'View Roles?', new inquirer.Separator(),
                'Add Employee?', 'Add Departments?', 'Add Role?', new inquirer.Separator(),
                'Update Employee Information?', new inquirer.Separator(),
                'Remove Employee?', new inquirer.Separator(),
                'View Budget?', new inquirer.Separator(),
                'End Application Now?', new inquirer.Separator()],
        }).then(async function (answers) {
            switch (answers.options) {
                case 'View Current Employees?':
                    viewEmps();
                    break;
                case 'View Employees by Manager?':
                    employeesJSON();
                    setTimeout(viewEmpWMngr, 500);
                    break;
                case 'View Employees by Role?':
                    rolesJSON();
                    setTimeout(viewEmpWRole, 500);
                    break;
                case 'View Departments?':
                    viewDepts();
                    break;
                case 'View Roles?':
                    viewRoles();
                    break;
                case 'Add Employee?':
                    rolesJSON();
                    employeesJSON();
                    addEmp();
                    break;
                case 'Add Departments?':
                    addDept();
                    break;
                case 'Add Role?':
                    addRole();
                    departmentsJSON();
                    break;
                case 'Update Employee Information?':
                    employeesJSON();
                    rolesJSON();
                    setTimeout(updateEmp, 500);
                    break;
                case 'Remove Employee?':
                    employeesJSON();
                    setTimeout(deleteEmp, 500);
                    break;
                case 'View Budget?':
                    viewBudget();
                    break;
                case 'End Application Now?':
                    connection.end();
                    process.exit();

            }
        });
}

// join tables to show all employee's information 

function viewEmps() {
    let query = `SELECT e.id AS "ID", e.first_name AS "FIRST NAME", e.last_name AS "LAST NAME", 
r.title AS "ROLE", d.name AS "DEPARTMENT", r.salary AS "SALARY", 
(select concat(emp.first_name,' ',emp.last_name) from employee as emp where e.manager_id = emp.id) AS "MANAGER"
FROM employee e 
LEFT JOIN role r ON e.role_id=r.id
LEFT JOIN department d ON r.department_id = d.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        printTable(res);
        CMS();
    });
}
// Function to view all Employees working under a Manager
function viewEmpWMngr() {
    inquirer.prompt({
        name: "managerName",
        type: "list",
        message: "Choose the Manager you want to see all employees :",
        choices: employeeFullName
    })

        .then(async function (answers) {
            let mngrId = getManagerID(answers.managerName, employeesArray);

            let query = `SELECT id AS ID, first_name as 'FIRST NAME', last_name as 'LAST NAME' FROM employee WHERE manager_id=${mngrId};`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("No Employees under that manager.");
                }
                else {
                    printTable(res);
                }
                CMS();
            });
        })
}
// function to to view employee by role viewEmpWRole

function viewEmpWRole() {
    inquirer.prompt({
        name: "roleTitle",
        type: "list",
        message: "Choose the ROLE you want to see all employees for:",
        choices: employeeRolesNames
    })

        .then(async function (answers) {
            let roleId = getRoleID(answers.roleTitle, rolesArray);

            let query = `SELECT id AS ID, first_name as 'FIRST NAME', last_name as 'LAST NAME' FROM employee WHERE role_id=${roleId};`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                if (res.length === 0) {
                    console.log("No Employees working under this ROLE !!!");
                }
                else {
                    printTable(res);
                }
                CMS();
            });
        })
}
// Function to view departments and id
function viewDepts() {
    let query = `SELECT id as ID, name as "DEPARTMENT NAME" FROM department;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        printTable(res);
        CMS();
    });
}
// Function view all the roles and Ids
function viewRoles() {
    let query = "SELECT id AS ID, title as ROLE, salary as SALARY FROM role;";
    connection.query(query, (err, res) => {
        if (err) throw err;
        printTable(res);
        CMS();
    });
}
//   add employee functions

async function addEmp() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "What is the FIRST NAME of the Employee ? ",
            validate: function (value) {
                var string = value.match(/^\s*\S+.*/);
                if (string) {
                    return true;
                } else {
                    return "Please enter the Employees FIRST NAME ";
                }
            }
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the LAST NAME of the Employee ? ",
            validate: function (value) {
                var string = value.match(/^\s*\S+.*/);
                if (string) {
                    return true;
                } else {
                    return "Please enter the Employees LAST NAME ";
                }
            }
        },
        {
            name: "role",
            type: "list",
            message: "What is the ROLE of the Employee ? ",
            choices: employeeRolesNames,
        },
        {
            name: "manager",
            type: "list",
            message: "Who is the MANAGER for the new employee ? ",
            choices: employeeFullName,
        }])
        .then(async function (answers) {
            //ids to arrays for inserting correct role and manager when adding employee
            let roleId = getRoleID(answers.role, rolesArray);
            let mngrId = getManagerID(answers.manager, employeesArray);

            // Function insert into DB name role and manager of employee
            function addNewEmp(answers, roleId, mngrId) {
                let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('${answers.first_name}','${answers.last_name}',${roleId},${mngrId});`
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.log(res.affectedRows + " new employee added...");
                    CMS();
                });
            }

            addNewEmp(answers, roleId, mngrId);

        })


}
// add a whole new dept
async function addDept() {
    inquirer
        .prompt({
            name: "newDept",
            type: "input",
            message: "What is the name of the Department you would like to add? ",
            validate: function (value) {
                var string = value.match(/^\s*\S+.*/);
                if (string) {
                    return true;
                } else {
                    return "Something went wrong backspace and add new department";
                }
            }
        }
        )
        .then(function (answers) {
            let query = `INSERT INTO department (name) VALUES('${answers.newDept}');`
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " New Department added");
                CMS();
            });

        })
}
//add a new role function
async function addRole() {
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "Enter the name of the new Role you would like to add? ",
            validate: function (value) {
                var string = value.match(/^\s*\S+.*/);
                if (string) {
                    return true;
                } else {
                    return "something went wrong backspace and add new Role please";
                }
            }
        },
        {
            name: "salary",
            type: "input",
            message: "What is the compensation for the role? ",
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || "Please enter the SALARY ";
            },
        },
        {
            name: "department",
            type: "list",
            message: "Select the Department the employee is in? ",
            choices: roleDepartment,
        }])
        .then(function (answers) {

            let depId = getDeptID(answers.department, departmentsArray);
            var query = `INSERT INTO role(title, salary, department_id) VALUES(?,?,${depId})`;

            connection.query(query, [answers.title, answers.salary], (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " Role has been added");

                CMS();
            });
        });
}
// Function to UPDATE a specific EMPLOYEE
async function updateEmp() {
    inquirer
        .prompt([{
            name: "empFullName",
            type: "list",
            message: "Select the name of the employee to Update? ",
            choices: employeeFullName,
        }
        ])

        .then(function (answers) {
            // Split name choosen to match with values in database 
            let splitName = answers.empFullName.split(" ");

            // IF choosen NONE ... do nothing 
            if (answers.empFullName === "NONE") {
                CMS();
            }

            // ELSE prompt the options WHAT to update for the employee
            else {

                inquirer.prompt([
                    {
                        name: "updateOption",
                        type: "list",
                        message: "Select what you want to update for the employee? ",
                        choices: ['Update First Name', 'Update Last Name', 'Update Employee Role', 'Update Employee Manager'],
                    }
                ])

                    .then(function (answers) {
                        // Update First Name of choosen Employee
                        if (answers.updateOption === "Update First Name") {
                            inquirer.prompt({
                                name: "newFirstName",
                                message: `What is the NEW FIRST name for employee ? `,
                                type: "input",
                                validate: function (value) {
                                    var string = value.match(/^\s*\S+.*/);
                                    if (string) {
                                        return true;
                                    } else {
                                        return "Please enter the new FIRST NAME for the employee";
                                    }
                                }
                            })
                                .then(function (answerfirst) {
                                    let query = `UPDATE employee SET first_name='${answerfirst.newFirstName}' WHERE first_name='${splitName[0]}' and last_name='${splitName[1]}';`
                                    connection.query(query, (err, res) => {
                                        if (err) throw err;
                                        console.log(res.affectedRows + " first name updated");
                                        CMS();
                                    });
                                })
                        }
                        // Update Last Name of choosen Employee
                        if (answers.updateOption === "Update Last Name") {
                            inquirer.prompt({
                                name: "newLastName",
                                message: `What is the NEW LAST name for employee ? `,
                                type: "input",
                                validate: function (value) {
                                    var string = value.match(/^\s*\S+.*/);
                                    if (string) {
                                        return true;
                                    } else {
                                        return "Please enter the new LAST NAME";
                                    }
                                }
                            })
                                .then(function (answersLast) {
                                    let query = `UPDATE employee SET last_name='${answersLast.newLastName}' WHERE first_name='${splitName[0]}' and last_name='${splitName[1]}';`
                                    connection.query(query, (err, res) => {
                                        if (err) throw err;
                                        console.log(res.affectedRows + " last name updated");
                                        cli();
                                    });
                                })
                        }
                        // Update the role or employee
                        if (answers.updateOption === "Update Employee Role") {
                            inquirer.prompt({
                                name: "updateRole",
                                message: `Choose the NEW ROLE for employee ? `,
                                type: "list",
                                choices: employeeRolesNames
                            })
                                .then(function (newRole) {
                                    let roleId = getRoleID(newRole.updateRole, rolesArray);
                                    let query = `UPDATE employee SET role_id='${roleId}' WHERE first_name='${splitName[0]}' and last_name='${splitName[1]}';`
                                    connection.query(query, (err, res) => {
                                        if (err) throw err;
                                        console.log(res.affectedRows + " employee role updated");
                                        CMS();
                                    });
                                })
                        }
                        // Update Employee Manager of employee
                        if (answers.updateOption === "Update Employee Manager") {
                            inquirer.prompt({
                                name: "newManager",
                                message: `Select the new Manager? `,
                                type: "list",
                                choices: employeeFullName
                            })
                                .then(function (answers2) {
                                    let mngrId = getManagerID(answers2.newManager, employeesArray);
                                    let query = `UPDATE employee SET manager_id='${mngrId}' WHERE first_name='${splitName[0]}' and last_name='${splitName[1]}';`
                                    connection.query(query, (err, res) => {
                                        if (err) throw err;
                                        console.log(res.affectedRows + " employee's manager updated");
                                        CMS();
                                    });
                                })

                        }

                    })

            }

        })
}
// Function to delete an employee
async function deleteEmp() {
    inquirer
        .prompt([{
            name: "empName",
            type: "list",
            message: "Select the Employee to Offboard? ",
            choices: employeeFullName
        }
        ])
        .then(function (answers) {
            // Split the name to give in the where clause as in table its two different columns
            var splitName = answers.empName.split(" ");
            let query = `DELETE FROM employee WHERE first_name='${splitName[0]}' and last_name='${splitName[1]}';`
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " Employee Offboarded");
                CMS();
            });
        })
}
//view budgets by department name and total budget per department
async function viewBudget() {
    let query = `SELECT department.name AS Department, SUM(role.salary) As Budget FROM role INNER JOIN department ON department.id = role.department_id GROUP BY department.name;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        printTable(res);
        CMS();
    });

}

// json array of roles
async function rolesJSON() {
    connection.query("SELECT id, title FROM role;", (err, res) => {
        res.forEach(function (row) {
            rolesArray.push({ id: row.id, title: row.title });
            employeeRolesNames.push(row.title);
        })
        if (err) throw err;
    });
}

// json array of employees
async function employeesJSON() {
    employeeFullName.push("NONE");

    connection.query("SELECT id, first_name, last_name FROM employee;", (err, res) => {
        res.forEach(function (row) {
            employeesArray.push({ id: row.id, first_name: row.first_name, last_name: row.last_name });
            employeeFullName.push(row.first_name + " " + row.last_name);
        })
        if (err) throw err;
    });
}

// json array of departments
async function departmentsJSON() {
    connection.query("SELECT id, name FROM department;", (err, res) => {
        res.forEach(function (row) {
            roleDepartment.push(row.name);
            departmentsArray.push({ id: row.id, name: row.name });
        })
        if (err) throw err;
    });
}

// create arrays to hold the Role id, manager id and dept id from selected names
function getRoleID(employeeRole, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].title === employeeRole) {
            return array[i].id;
        }
    }
}

// manager ids array
function getManagerID(managerName, array) {
    if (managerName === "NONE") {
        return array.id = null;
    }
    else {
        var splitName = managerName.split(" ");
        for (var i = 0; i < array.length; i++) {
            if (array[i].first_name === splitName[0]) {
                return array[i].id;
            }
        }
    }

}

// department ids array
function getDeptID(departmentName, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name === departmentName) {
            return array[i].id;
        }
    }
}



module.exports = CMS;