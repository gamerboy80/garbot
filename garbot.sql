-- Adminer 4.8.0 MySQL 5.5.5-10.3.25-MariaDB-0ubuntu0.20.04.1 dump

-- SET NAMES utf8;
-- SET time_zone = '+00:00';
-- SET foreign_key_checks = 0;
-- SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `aliases` (
  `id` text NOT NULL,
  `alias` text NOT NULL,
  `command` text NOT NULL,
  UNIQUE KEY `alias` (`alias`(20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `blacklist` (
  `blacklisted` tinyint(1) NOT NULL DEFAULT 0,
  `id` text NOT NULL,
  PRIMARY KEY (`id`(20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exit_channel` (
  `id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `last_images` (
  `id` text NOT NULL,
  `link` text NOT NULL,
  PRIMARY KEY (`id`(20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `scopes` (
  `id` text NOT NULL,
  `scope` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`(20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `server_settings` (
  `id` text NOT NULL,
  `prefix` text NOT NULL DEFAULT ';',
  `eval` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`(20))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2021-05-05 17:26:30
