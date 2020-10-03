# Work Planner
Simple web app to help organize your day and week.

# Intallation

How to install:
1. Make sure that Node.js is installed on your computer. You can find it here: https://nodejs.org.
2. Download this repository on your computer. You can either use Git or use the green "Code" button on the top right to download a .zip file (don't forget to extract the .zip file after you download it).
3. If you are on Linux or Mac, open the terminal, cd into the repository and run `npm install`. If you are on Windows, got to the `Windows` folder and run `install.bat`.

How to use:
1. If you are on Linux or Mac, open the terminal, cd into the repository and run `npm start`. If you are on Windows, got to the `Windows` folder and run `run.vbs`.
2. Use your favourite browser and navigate to `localhost:8080`.

Note: On Windows, the server is run as a background process. If you want to stop it, you'll have to do it via the task manager. The process will be called `Node.js: Server-side JavaScript`.

Miscellaneous:
* You can change the port number and database by updating `server/confing_default.json` (you'll also have to update `client/config_default` if you change the port number)
* By default, your data is stored in a SQLite database file called `workplanner.db`. This file contains all of your user data. You can backup your data by simply making a copy of this file and saving it somewhere else.
