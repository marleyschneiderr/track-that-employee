INSERT INTO department(name)
VALUES ('HR'),
        ('Finance'),
        ('Sales'),
        ('Customer Service');

INSERT INTO role(title, salary, department_id)
VALUES ('Manager', 120000.00, 3),
        ('Analyst', 80000.00, 2),
        ('Help desk agent', 50000.00, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, NULL),
        ('Jane', 'Doe', 3, 1);