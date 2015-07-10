@echo off

 set FNAME=%~1
  
 if "%FNAME%"=="" set FNAME=Lonly Black Square.jpg
 start ..\..\bin\keywords\put-iptc.hta "%FNAME%"
 