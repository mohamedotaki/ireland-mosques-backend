-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.39 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table ireland_mosques.feedbacks
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `mosque_id` int DEFAULT NULL,
  `name` char(50) NOT NULL DEFAULT '',
  `email` char(50) NOT NULL DEFAULT '',
  `message` text NOT NULL,
  `type` enum('App','Mosque') NOT NULL,
  `statues` enum('Completed','Not Completed') NOT NULL DEFAULT 'Not Completed',
  PRIMARY KEY (`feedback_id`) USING BTREE,
  KEY `FK_feedbacks_mosques` (`mosque_id`),
  CONSTRAINT `FK_feedbacks_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table ireland_mosques.feedbacks: ~5 rows (approximately)
INSERT IGNORE INTO `feedbacks` (`feedback_id`, `mosque_id`, `name`, `email`, `message`, `type`, `statues`) VALUES
	(1, 27, 'Jasem', 'mohotaki@hotmail.com', 'blablabla', 'Mosque', 'Not Completed'),
	(2, 27, 'Jasem', 'mohotaki@hotmail.com', 'blablabla', 'Mosque', 'Not Completed'),
	(3, 27, 'Jasem', 'mohotaki@hotmail.com', 'blablabla', 'Mosque', 'Not Completed'),
	(4, 27, 'Jasem', 'mohotaki@hotmail.com', 'blablabla', 'Mosque', 'Not Completed'),
	(5, 27, 'Jasem', 'mohotaki@hotmail.com', 'blablabla', 'Mosque', 'Not Completed');

-- Dumping structure for table ireland_mosques.mosques
DROP TABLE IF EXISTS `mosques`;
CREATE TABLE IF NOT EXISTS `mosques` (
  `id` int NOT NULL AUTO_INCREMENT,
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
  `last_update` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table ireland_mosques.mosques: ~1 rows (approximately)
INSERT IGNORE INTO `mosques` (`id`, `name`, `address`, `eircode`, `location`, `contact_number`, `mosque_status`, `website`, `latitude`, `longitude`, `iban`, `last_update`) VALUES
	(27, 'Al Kausar', '3 Sherwood Ave, Hazelhill, Ballyhaunis, Co. Mayo', 'F35 DY95', 'Ballyhaunis', '1234567890', 'Active', 'www.seventhbyte.com', 53.7599, -8.77131, 'IE28AIBK93744421240194', '2025-04-14 09:35:35');

-- Dumping structure for table ireland_mosques.posts
DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `mosque_id` int NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int NOT NULL,
  `updated_by` int DEFAULT NULL,
  `header` char(150) NOT NULL,
  `contant` mediumtext NOT NULL,
  `header_image` int DEFAULT NULL,
  PRIMARY KEY (`post_id`) USING BTREE,
  KEY `FK_news_mosques` (`mosque_id`),
  KEY `FK_news_admins` (`created_by`),
  KEY `FK_news_admins_2` (`updated_by`),
  CONSTRAINT `FK_news_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table ireland_mosques.posts: ~0 rows (approximately)

-- Dumping structure for table ireland_mosques.prayer_data
DROP TABLE IF EXISTS `prayer_data`;
CREATE TABLE IF NOT EXISTS `prayer_data` (
  `prayer_id` int NOT NULL AUTO_INCREMENT,
  `mosque_id` int NOT NULL,
  `prayer_name` enum('Fajr','Shurooq','Dhuhr','Asr','Maghrib','Isha','Jummuah') NOT NULL DEFAULT 'Fajr',
  `adhan_time` time DEFAULT NULL,
  `adhan_locked` tinyint(1) NOT NULL DEFAULT '0',
  `adhan_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `iquamh_time` time DEFAULT NULL,
  `iquamh_offset` tinyint DEFAULT NULL,
  `iquamh_modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`prayer_id`) USING BTREE,
  KEY `FK_prayer_data_mosques` (`mosque_id`),
  KEY `FK_prayer_data_users` (`modified_by`),
  CONSTRAINT `FK_prayer_data_mosques` FOREIGN KEY (`mosque_id`) REFERENCES `mosques` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_prayer_data_users` FOREIGN KEY (`modified_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table ireland_mosques.prayer_data: ~7 rows (approximately)
INSERT IGNORE INTO `prayer_data` (`prayer_id`, `mosque_id`, `prayer_name`, `adhan_time`, `adhan_locked`, `adhan_modified_on`, `iquamh_time`, `iquamh_offset`, `iquamh_modified_on`, `modified_by`) VALUES
	(90, 27, 'Fajr', NULL, 0, '2025-04-12 20:50:17', '05:30:00', NULL, '2025-04-13 06:20:55', NULL),
	(91, 27, 'Shurooq', NULL, 0, '2025-01-26 20:50:08', '06:50:00', NULL, '2025-04-13 06:04:38', NULL),
	(92, 27, 'Dhuhr', NULL, 0, '2025-04-10 02:35:34', '13:47:00', NULL, '2025-04-13 18:01:15', NULL),
	(93, 27, 'Asr', '19:15:00', 0, '2025-04-13 19:14:05', NULL, NULL, '2025-04-10 00:18:18', NULL),
	(94, 27, 'Maghrib', NULL, 0, '2025-04-10 19:01:21', NULL, NULL, '2025-04-10 00:18:18', NULL),
	(95, 27, 'Isha', '23:49:00', 0, '2025-04-14 09:35:35', NULL, NULL, '2025-04-10 00:18:18', NULL),
	(96, 27, 'Jummuah', NULL, 0, '2025-04-10 02:35:38', NULL, NULL, '2025-04-10 00:18:18', NULL);

-- Dumping structure for table ireland_mosques.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` char(70) NOT NULL,
  `email` char(100) NOT NULL,
  `contact_number` char(100) DEFAULT NULL,
  `password` text NOT NULL,
  `user_type` enum('User','Admin','Owner') NOT NULL DEFAULT 'User',
  `account_status` enum('Active','Pending','Blocked','inactive') NOT NULL DEFAULT 'Pending',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_signin` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_on` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mosqueID` int DEFAULT NULL,
  `UUID` tinytext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `FK_users_mosques` (`mosqueID`),
  CONSTRAINT `FK_users_mosques` FOREIGN KEY (`mosqueID`) REFERENCES `mosques` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3;

-- Dumping data for table ireland_mosques.users: ~1 rows (approximately)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `contact_number`, `password`, `user_type`, `account_status`, `created_at`, `last_signin`, `modified_on`, `mosqueID`, `UUID`) VALUES
	(42, 'Mohamed Otaki', 'mohotaki@hotmail.com', '08922015267', '$2a$10$5.xrj.8S3XuYaO1jJzciWuFbsDB.o/Kz1lWMwyS6KMmXKJI886P2u', 'Admin', 'Active', '2025-04-12 06:47:09', '2025-04-12 06:47:09', '2025-04-13 17:58:12', 27, '400062f3-09c0-4207-be87-dfa1f0f3bd29');

-- Dumping structure for trigger ireland_mosques.update_mosques_modified_on
DROP TRIGGER IF EXISTS `update_mosques_modified_on`;
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `update_mosques_modified_on` AFTER UPDATE ON `prayer_data` FOR EACH ROW BEGIN
  IF NOT (OLD.adhan_time <=> NEW.adhan_time)
     OR NOT (OLD.iquamh_time <=> NEW.iquamh_time) 
     OR NOT (OLD.iquamh_offset <=> NEW.iquamh_offset) THEN

    UPDATE mosques
    SET last_update = COALESCE(NEW.adhan_modified_on, NEW.iquamh_modified_on)
    WHERE mosques.id = NEW.mosque_id;

  END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
