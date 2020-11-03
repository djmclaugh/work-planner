# Work Planner
Simple web app to help organize your day and week.

Note: This is work in progress with limited support.

# How to use

## Option 1 - `.exe` on Windows:
1. Download `Windows` folder.
2. Double click the `.exe`.
3. Use your favourite browser and navigate to `localhost:8080`.

## Option 2 - Command line:

1. Make sure you have npm installed.
2. cd into the repository and run `npm install` followed by `npm start`.
3. Use your favourite browser and navigate to `localhost:8080`.

Miscellaneous:
* You can change the host, port number, and database location by updating `server/confing_default.json` (you'll also have to update `client/config_default` if you change the port number)
* By default, your data is stored in a SQLite database file called `workplanner.db`. This file contains all of your user data. You can backup your data by simply making a copy of this file and saving it somewhere else.
