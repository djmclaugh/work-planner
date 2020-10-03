# Windows
This directory contains simple scripts to instal and run this project on a Windows machine.

Note, these scripts assume that Node.js is already installed on your computer and will fail if that's not the case.
You can download Node.js here: https://nodejs.org/

## install.bat
This simply runs `npm install` to download the dependencies for this project and compiles/bundles the typescript files into usuable javascript files. This only has to be run once.

## run.vbs
Starts the server as a background process. To stop the server, open the Task Manager and end the `Node.js: Server-side JavaScript` task.
