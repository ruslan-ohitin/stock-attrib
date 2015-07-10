
var sWordVector = "vector";
var sBinPath = "c:\\bin\\keywords";
var sPathToExiv2 = sBinPath + "\\exiv2.exe";
var sPathToIrfanView = sBinPath + "\\i_view32.exe";
var WshShell = new ActiveXObject("WScript.Shell");

/////////////////////////////////////////////////////////////
function changeKeywords(sFileName) {

	// ���������� ��������� ��� ������ ������, ���������� �������� �����
	var re = /^Iptc\.Application2\.Keywords\s+String\s+\d+\s+(.+)$/;
	var arr;

	// ���������� ��������� ��� ������� ������ �������� ���� �� ��������� �����
	var rekeywords = /\w+/g;
	var arrk;

	// ������ ��� �������� ����
	var keywordsArray = new Array();

	// ������� IPTC ������ �����
	var oExec = WshShell.Exec(sPathToExiv2 + " -p i \"" + sFileName + "\"");
	while (! oExec.StdOut.AtEndOfStream) {
		// ������� ��������� ������ �� ������ �������
		line = oExec.StdOut.ReadLine();
		// ��� ������ ��������� �������� �����?
		if ((arr = re.exec(line)) != null) {
			// ��������� ���������� ������ �������� ���� �� ��������� �����
			while ((arrk = rekeywords.exec(arr[1])) != null)
			if (arrk[0] != sWordVector) {
				// �����, �������� �� "vector" ���������� � ������
				keywordsArray.push(arrk[0]);
			}
		}
		// ��������� � ��������� ��������� ������. 
		// �������� ����� ����� ������������� � ���������� �������.
	}

	// ���� ���������� �������
	while (oExec.Status != 1) {
		WScript.Sleep(100);
	}

	// ����� ������� ����� "vector" ������� � ������ �������� ����
	// ������� �� ������� ������ � ������ �����
	var first = keywordsArray.shift();
	var second = keywordsArray.shift();

	// ��������� � ������ ������� ������, ������ � "vector".
	keywordsArray.unshift(first, second, sWordVector);

	// ������ �� ������� ����
	var keywords = keywordsArray.join(", ");

	// ������ ����� �������� ��� �������� ����� ������� � ����.
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
// �������� ���������

var objArgs = WScript.Arguments;
var sEpsName, sJpegName, sThumbnailName, sEpsFolder, sJpegFolder;
var oFso = new ActiveXObject("Scripting.FileSystemObject")

for (i = 0; i < objArgs.length; i++) {
	sEpsName = oFso.GetAbsolutePathName(objArgs(i));
	// ��������, ���������� �� EPS
	if (! oFso.FileExists(sEpsName)) {
		WScript.Echo("���� '" + sEpsName + "' �� ����������!\n");
		// �������� � ���������� ����� � ������ ����������
		continue;
	}
	// ������� �������� ����� �������� ������
	sEpsFolder = oFso.GetParentFolderName(sEpsName);
	sJpegFolder = oFso.GetParentFolderName(sEpsFolder);
	sJpegName = sJpegFolder + "\\" + oFso.GetBaseName(sEpsName) + ".jpg";
	sThumbnailName = sEpsFolder + "\\" + oFso.GetBaseName(sEpsName) + ".jpg";
	
	// ��������, ���������� �� ������� JPEG
	if (! oFso.FileExists(sJpegName)) {
		WScript.Echo("��� ����� '" + sEpsName + "' �� ������ ���� '" + sJpegName + "'. ��������� ����� ������!\n");
		continue;
	}
	
	makeThumbnail(sJpegName, sThumbnailName);
	changeKeywords(sThumbnailName);
}

// ����� ���������
