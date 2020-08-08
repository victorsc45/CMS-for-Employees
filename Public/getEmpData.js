
const inquirer = require('inquirer');
const getEmpData = require('./server.js');


function getEmpData() {
    inquirer
        .prompt({
            name: "empData",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                'View All Employees?',
                'Update an Employee?',
                'Add an Employee?',
                'Remove an Employee?',

            ]
        }).then(function (answer) {
            switch (answer.empData) {
                case "View all Employees?":
                    viewEmps();
                    break;
                case "Update Employee?":
                    updateEmp();
                    break;
                case "Add an Employee?":
                    addEmp();
                    break;

                case "Remove an Employee?":
                    deleteEmp();
                    break;
            }
        });
}
function viewEmps() {
    let query = 'SELECT employee.first_name, employee.last_name, role.title FROM employee INNER JOIN role ON employee.id = role.id;'
    connection.query(query, function (err, res) {
        console.table(res);
    })
    startEmpCMS();
}
module.exports = getEmpData;