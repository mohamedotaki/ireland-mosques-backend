-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.7.17-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ireland_mosques
DROP DATABASE IF EXISTS `ireland_mosques`;
CREATE DATABASE IF NOT EXISTS `ireland_mosques` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ireland_mosques`;

-- Dumping structure for table ireland_mosques.feedbacks
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mosque_id` int(11) DEFAULT NULL,
  `name` char(50) NOT NULL DEFAULT '',
  `email` char(50) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  `type` enum('App','Mosque') NOT NULL,
  `statues` enum('Completed','Not Completed') NOT NULL DEFAULT 'Not Completed',
  PRIMARY KEY (`id`),
  KEY `FK_feedbacks_mosques` (`mosque_id`),
  CONSTRAINT `FK_feedbacks_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table ireland_mosques.feedbacks: ~0 rows (approximately)

-- Dumping structure for table ireland_mosques.mosques
DROP TABLE IF EXISTS `mosques`;
CREATE TABLE IF NOT EXISTS `mosques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(100) NOT NULL DEFAULT '0',
  `address` tinytext,
  `eircode` char(10) DEFAULT NULL,
  `location` enum('Dublin','Athlone','Ballina','Ballinasloe','Ballyhaunis','Carlow','Castlebar','Cavan','Clonmel','Cork','Drogheda','Dundalk','Ennis','Galway','Kilkenny','Letterkenny','Limerick','Longford','Monaghan','Mullingar','Navan','Portlaoise','Roscommon','Sligo','Tralee','Tullamore','Waterford','Wexford') NOT NULL,
  `contact_number` tinytext NOT NULL,
  `mosque_status` enum('Active','Pending','Blocked','inactive') NOT NULL DEFAULT 'Pending',
  `website` char(150) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `iban` char(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- Dumping data for table ireland_mosques.mosques: ~2 rows (approximately)
INSERT IGNORE INTO `mosques` (`id`, `name`, `address`, `eircode`, `location`, `contact_number`, `mosque_status`, `website`, `latitude`, `longitude`, `iban`) VALUES
	(27, 'Ballyhanins', NULL, 'F35 DF89', 'Ballyhaunis', '1234567890', 'Pending', NULL, 53.7599, -8.77131, NULL),
	(28, 'test mosque', 'hgjhgj', 'hgjhj', 'Carlow', '657657567', 'Pending', 'ghjhg', 53.7663, -8.78225, 'ytjytjyt');

-- Dumping structure for table ireland_mosques.posts
DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mosque_id` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `header` char(150) NOT NULL,
  `contant` mediumtext NOT NULL,
  `header_image` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_news_mosques` (`mosque_id`),
  KEY `FK_news_admins` (`created_by`),
  KEY `FK_news_admins_2` (`updated_by`),
  CONSTRAINT `FK_news_admins` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_news_admins_2` FOREIGN KEY (`updated_by`) REFERENCES `admins` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_news_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table ireland_mosques.posts: ~0 rows (approximately)

-- Dumping structure for table ireland_mosques.prayer_data
DROP TABLE IF EXISTS `prayer_data`;
CREATE TABLE IF NOT EXISTS `prayer_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mosque_id` int(11) NOT NULL,
  `prayer_name` enum('Fajr','Shurooq','Dhuhr','Asr','Maghrib','Isha','Jummuah') NOT NULL DEFAULT 'Fajr',
  `adhan_time` time DEFAULT NULL,
  `adhan_locked` tinyint(1) NOT NULL DEFAULT '0',
  `iquamh_time` time DEFAULT NULL,
  `iquamh_offset` tinyint(4) DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL,
  `last_time_modified` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_prayer_data_mosques` (`mosque_id`),
  KEY `FK_prayer_data_users` (`modified_by`),
  CONSTRAINT `FK_prayer_data_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_prayer_data_users` FOREIGN KEY (`modified_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;

-- Dumping data for table ireland_mosques.prayer_data: ~7 rows (approximately)
INSERT IGNORE INTO `prayer_data` (`id`, `mosque_id`, `prayer_name`, `adhan_time`, `adhan_locked`, `iquamh_time`, `iquamh_offset`, `modified_by`, `last_time_modified`) VALUES
	(90, 27, 'Fajr', NULL, 1, NULL, NULL, NULL, '2025-01-26 20:50:08'),
	(91, 27, 'Shurooq', NULL, 1, NULL, NULL, NULL, '2025-01-26 20:50:08'),
	(92, 27, 'Dhuhr', NULL, 1, NULL, NULL, NULL, '2025-01-26 20:50:08'),
	(93, 27, 'Asr', NULL, 1, NULL, NULL, NULL, '2025-01-26 20:50:08'),
	(94, 27, 'Maghrib', NULL, 1, NULL, NULL, NULL, '2025-01-26 20:50:08'),
	(95, 27, 'Isha', NULL, 0, NULL, NULL, NULL, '2025-01-26 20:50:08'),
	(96, 27, 'Jummuah', NULL, 0, NULL, NULL, NULL, '2025-01-26 20:50:08');

-- Dumping structure for table ireland_mosques.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mosque_id` int(11) NOT NULL DEFAULT '0',
  `name` char(70) NOT NULL,
  `email` char(100) NOT NULL,
  `contact_number` char(100) DEFAULT NULL,
  `password` text NOT NULL,
  `user_type` enum('User','Admin','Owner') NOT NULL DEFAULT 'User',
  `acount_status` enum('Active','Pending','Blocked','inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_signin` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `FK_users_mosques` (`mosque_id`),
  CONSTRAINT `FK_users_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table ireland_mosques.users: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
