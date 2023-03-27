INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Marley', 'Schneider', 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jaspreet', 'Basra', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jasleen', 'Smith', 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Miryka', 'Rygg', 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mark', 'Allen', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Mary', 'Rygg', 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Josh', 'Peck', 4, 2);

INSERT INTO department (department_name)
VALUES ('Finance');
INSERT INTO department (department_name)
VALUES ('Marketing');
INSERT INTO department (department_name)
VALUES ('IT');
INSERT INTO department (department_name)
VALUES ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES ('Supervisor', 150000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('Developer', 80000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Administrator', 60000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 90000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ('Examiner', 75000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ('CEO', 300000, null);