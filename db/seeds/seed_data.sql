INSERT INTO roles (id, name) VALUES
  (1, 'Admin'),
  (2, 'Manager'),
  (3, 'Employee');

INSERT INTO users (id, role_id, email, password_hash, name, created_at) VALUES
  (1, 1, 'admin@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'Admin User', NOW()),
  (2, 2, 'manager@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'Manager User', NOW()),
  (3, 3, 'employee@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'Employee User', NOW());

INSERT INTO departments (id, name) VALUES
  (1, 'Sales'),
  (2, 'Engineering'),
  (3, 'Human Resources');

INSERT INTO clients (id, name, email, phone, address) VALUES
  (1, 'Acme Corporation', 'contact@acme.com', '+1234567890', '123 Acme St, Metropolis'),
  (2, 'Globex Inc.', 'info@globex.com', '+1987654321', '456 Globex Ave, Gotham');

INSERT INTO employees (id, user_id, department_id, name, position, email, phone) VALUES
  (1, 3, 1, 'John Doe', 'Sales Representative', 'john.doe@example.com', '+1122334455'),
  (2, 2, 2, 'Jane Smith', 'Engineering Lead', 'jane.smith@example.com', '+1222333444');

INSERT INTO products (id, name, description, price, stock) VALUES
  (1, 'Widget A', 'High quality widget', 19.99, 100),
  (2, 'Widget B', 'Standard widget', 9.99, 200),
  (3, 'Gadget X', 'Advanced gadget', 49.99, 50);

INSERT INTO orders (id, client_id, employee_id, product_id, quantity, total_price, status, created_at) VALUES
  (1, 1, 1, 1, 5, 99.95, 'Processing', NOW()),
  (2, 2, 2, 3, 2, 99.98, 'Shipped', NOW()),
  (3, 1, 1, 2, 10, 99.90, 'Delivered', NOW());