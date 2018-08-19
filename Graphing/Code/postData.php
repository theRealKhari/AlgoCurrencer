<?php
$pwd = getcwd();
$newData = $_POST['data'];
$dataFile = "../test_data/eurusdh1_WithBuySellSignal.txt";
$file = fopen($dataFile,'w');
$result = fwrite($file,newData);
fclose($file);
echo "Wrote Data? $result";




?>
