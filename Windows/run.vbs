' Simple VB script to start the server in the background

Set oShell = CreateObject("Wscript.Shell") 
oShell.CurrentDirectory = ".."
oShell.Run "node server\main.js", 0, false