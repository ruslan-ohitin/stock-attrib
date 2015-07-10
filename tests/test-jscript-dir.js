var strPath   = WScript.ScriptFullName;
var objFSO    = new ActiveXObject("Scripting.FileSystemObject");
var objFile   = objFSO.GetFile(strPath);
var strFolder = objFSO.GetParentFolderName(objFile);

WScript.Echo(strFolder);