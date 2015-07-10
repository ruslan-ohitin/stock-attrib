@echo off
 if exist "Lonly Black Square.jpg" del "Lonly Black Square.jpg"
 cscript //nologo ..\..\..\bin\keywords\keywords.js "Lonly Black Square.eps"
 ..\..\..\bin\keywords\exiv2.exe -p i "Lonly Black Square.jpg"