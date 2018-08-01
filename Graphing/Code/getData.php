<?php
$pwd = getcwd();
$dataFile = "../test_data/eurusdh1_WithBuySellSignal.txt";
$file = fopen($dataFile,'r');
$data = fread($file,filesize($dataFile));
fclose($file);
$jsonData = JSON_encode($data);

echo $data;




?>
