@echo off

 set FNAME=%~n1
 if "%FNAME%"=="" set FNAME=Lonly Black Square

 7za a -tzip "zip\%FNAME%.zip" "%FNAME%.jpg" ".\EPS+JPG\%FNAME%.eps"