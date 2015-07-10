@echo off
 set FNAME=%~n1

 if "%FNAME%"=="" set FNAME=Lonly Black Square

 if exist "%FNAME%.jpg" del "%FNAME%.jpg"
 cscript //nologo ..\..\..\bin\keywords\keywords.js "%FNAME%.eps"
 ..\..\..\bin\keywords\exiv2.exe -p i "%FNAME%.jpg"
 pause