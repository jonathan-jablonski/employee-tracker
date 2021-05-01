DROP DATABASE IF EXISTS companyDB;

CREATE DATABASE companyDB;

USE companyDB;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  department VARCHAR(45) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE positions (
  id INT NOT NULL AUTO_INCREMENT,
  position VARCHAR(45) NULL,
  salary DECIMAL(10, 2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NULL,
  last_name VARCHAR(45) NULL,
  position_id INT NULL,
  manager_status BOOLEAN, 
  manager_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE managers (
  id INT NOT NULL AUTO_INCREMENT,
  manager_title VARCHAR(50) NOT NULL,
  primary key (id)
);