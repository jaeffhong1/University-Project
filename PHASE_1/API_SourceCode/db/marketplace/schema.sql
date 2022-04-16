
CREATE DATABASE if not exists `marketplace`;

USE `marketplace`;

CREATE TABLE IF NOT EXISTS `apis` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` text NOT NULL,
    `root` text NOT NULL,
    `url`  text NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `types` (
    `name` varchar(32) NOT NULL,
    PRIMARY KEY(`name`)
);

CREATE TABLE IF NOT EXISTS `parameters` (
    `id` int NOT NULL AUTO_INCREMENT,
    `api` int NOT NULL,
    `param_type` enum('param', 'field') NOT NULL,
    `name` text NOT NULL,
    `description` text NOT NULL,
    `type` varchar(32) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`api`) REFERENCES apis(`id`),
    FOREIGN KEY (`type`) REFERENCES types(`name`)
);

CREATE TABLE IF NOT EXISTS `cookies` (
    `id` int NOT NULL AUTO_INCREMENT,
    `cookie` text NOT NULL,
    PRIMARY KEY(`id`)
);
