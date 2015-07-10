var sWordVector = "vector";
var sBinPath = "c:\\bin\\keywords";
var sPathToExiv2 = sBinPath + "\\exiv2.exe";
var sPathToIrfanView = sBinPath + "\\i_view32.exe";
var WshShell = new ActiveXObject("WScript.Shell");

/////////////////////////////////////////////////////////////
function changeKeywords(sFileName) {

	// Регулярное выражение для поиска строки, содержащей ключевые слова
	var re = /^Iptc\.Application2\.Keywords\s+String\s+\d+\s+(.+)$/;
	var arr;

	// Regexp to split keywords separated by comma.
	// Keyword may be a phrase - several words with spaces
	// Thank you Bennor McCarthy!!!
	// http://stackoverflow.com/questions/5001554/regular-expression-for-a-list-of-items-separated-by-comma-or-by-comma-and-a-spac
	var rekeywords = /[^,\s][^\,]*[^,\s]*/g;
	var arrk;

	// Массив для ключевых слов
	var keywordsArray = new Array();

	// Получим IPTC данные файла
	var oExec = WshShell.Exec(sPathToExiv2 + " -p i \"" + sFileName + "\"");
	while (! oExec.StdOut.AtEndOfStream) {
		// Получим следующую строку из вывода команды
		line = oExec.StdOut.ReadLine();
		// Это строка описывает ключевые слова?
		if ((arr = re.exec(line)) != null) {
			// Разбиваем полученный список ключевых слов на отдельные слова
			while ((arrk = rekeywords.exec(arr[1])) != null)
			if (arrk[0] != sWordVector) {
				// Слова, отличные от "vector" записываем в массив
				keywordsArray.push(arrk[0]);
			}
		}
		// переходим к обработке следующей строки. 
		// Ключевые слова могут располагаться в нескольких строках.
	}

	// Ждем завершения команды
	while (oExec.Status != 1) {
		WScript.Sleep(100);
	}

	// Нужно сделать слово "vector" третьим в списке ключевых слов
	// Убираем из массива первое и второе слово
	var first = keywordsArray.shift();
	var second = keywordsArray.shift();

	// Вставляем в начало массива первое, второе и "vector".
	keywordsArray.unshift(first, second, sWordVector);

	// Строка со списком слов
	var keywords = keywordsArray.join(", ");

	// Теперь нужно вставить эти ключевые слова обратно в файл.
	var iRes = WshShell.Run(sPathToExiv2 + " -M\"set Iptc.Application2.Keywords " + keywords + "\" \"" + sFileName + "\"", 7, true);

	return(iRes);
} // function changeKeywords()

/////////////////////////////////////////////////////////////
function makeThumbnail(sFileName, sThumbName) {
	sCmdLine = sPathToIrfanView + " \"" + sFileName + "\" /resize_short=500 /aspectratio /resample /ini=\"" + sBinPath + "\" /convert=\"" + sThumbName + "\"";
	var iRes = WshShell.Run(sCmdLine, 7, true);
	return(iRes);
} // makeThumbnail

/////////////////////////////////////////////////////////////
// Основная программа

var objArgs = WScript.Arguments;
var sEpsName, sJpegName, sThumbnailName, sEpsFolder, sJpegFolder;
var oFso = new ActiveXObject("Scripting.FileSystemObject")

for (i = 0; i < objArgs.length; i++) {
	sEpsName = oFso.GetAbsolutePathName(objArgs(i));
	// Проверим, существует ли EPS
	if (! oFso.FileExists(sEpsName)) {
		WScript.Echo("Файл '" + sEpsName + "' не существует!\n");
		// Перейдем к следующему файлу в списке аргументов
		continue;
	}
	// Находим название папки верхнего уровня
	sEpsFolder = oFso.GetParentFolderName(sEpsName);
	sJpegFolder = oFso.GetParentFolderName(sEpsFolder);
	sJpegName = sJpegFolder + "\\" + oFso.GetBaseName(sEpsName) + ".jpg";
	sThumbnailName = sEpsFolder + "\\" + oFso.GetBaseName(sEpsName) + ".jpg";
	
	// Проверим, существует ли большой JPEG
	if (! oFso.FileExists(sJpegName)) {
		WScript.Echo("Для файла '" + sEpsName + "' не найден файл '" + sJpegName + "'. Проверьте имена файлов!\n");
		continue;
	}
	
	makeThumbnail(sJpegName, sThumbnailName);
	changeKeywords(sThumbnailName);
}

// Конец программы
