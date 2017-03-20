CREATE TABLE `state` (
  `id` int(11) NOT NULL,
  `state` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `state`
  ROW_FORMAT = Compressed ;
INSERT INTO `state` (`state`) VALUES ('{}');

   SELECT
     table_schema as `Database`,
     table_name AS `Table`,
     round(((data_length + index_length) / 1024 / 1024), 2) `Size in MB`
FROM information_schema.TABLES
ORDER BY (data_length + index_length) DESC;
