
var rekeywords = /[^,\s][^\,]*[^,\s]*/g;
var arrk;

var keywordsArray = new Array();

var sResult = "";

line = "one,two,three  and a half,four with a   quoter,five";
while ((arrk = rekeywords.exec(line)) != null) {
	sResult += arrk[0] + "\n";
}
WScript.Echo(sResult);
	