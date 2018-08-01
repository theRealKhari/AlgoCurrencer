<?php
/* This is a simple php call to get account information from the account info text file
 * Caleb Anthony
 * Will most likely be changed if things move to database
 */

$pwd = getcwd();
$dataFile = "../test_data/account_data.txt";
$file = fopen($dataFile,'r');
$data = fread($file,filesize($dataFile));
fclose($file);
$jsonData = JSON_encode($data);

echo $data;




?>
