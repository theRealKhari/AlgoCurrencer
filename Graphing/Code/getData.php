<?php
$pwd = getcwd();
$dataFile = "../test_data/eurusd1h.txt";
$file = fopen($dataFile,'r');
$data = fread($file,filesize($dataFile));
fclose($file);
$jsonData = JSON_encode($data);

echo $data;




?>
