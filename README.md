# Cheers!
Cheers! is a web application that utilizes a database and user interface that allows users to share and explore a plethora of different cocktails and drinks that they enjoy. Of course, the users will only have access to the application as long as they are of the minimum legal drinking age of 21 years old. As a user of Cheers!, the user will have the ability to post his/her favorite or original drink recipe, picture, and instructions for others to view and rate - which will be displayed anonymously. The user will also be able to edit and delete an existing post that he/she posted previously. All of the posts from each user will be displayed on the main page, filtered based on the user’s preference, and can scroll through the application to view these posts. Aside from general users, the application will require an administrator who will oversee the user posts that are being displayed. The admin will be responsible for managing inappropriate or invalid posts and users that disobey the community guidelines.

#Production
**Warning - Cheers! utilizes https://cors-anywhere.herokuapp.com, which is an API that enables cross-origin requests to anywhere. This is a getaround for CORS with Netlify and Heroku (MySQL db). This may cause 429 (Too Many Requests), as traffic is limited.

# How to start the Cheers Application
To start the Cheers Application, you will have to start 2 separate npm projects - one for the React front end and one for the Node back end that connects to the local MYSQL Database.

First, make sure you import the SQL file that was submitted with the project files into your local MYSQL server - as a result, you should have the entire cheers_db schema with sample data - a database in your MYSQL Server named `cheers_db` with tables `drink_category, ingredients, messages, posts, recipes, users, uses`. Also, ensure your local MYSQL Server is running.

### Running the user interface:
In the same directory as this README file, run the following commands:
1. `npm install`
2. `npm start`


### Running the server:
In a separate terminal from the one that is running the user interface (React front end), Perform the following tasks:
1. `cd server/`
2. `npm install`
3. Edit config/default.json so that the "password" field in the "mysql" object contains the password to the local MYSQL user specified in "user". If you do not wish to log in as your local machine's root user, you will have to change the "user" field as well - make sure the password corresponds to whichever user you specify. 
4. `npm run dev`

<!-- Ensure you have all dependencies by running npm install while in the server/ directory

Then, go to server/config/default.json and in the "mysql" object, insert the hostname, user, and password in order for the server to have the credentials to connect to your local mysql instance of cheers_db.

Finally, run npm run dev. The server should start up and print "Listening on port 5000" as well as "SQL Connected!". It should also print a test SQL statement found in server.js on line 7, which is SELECT user_name FROM users. -->

If trouble with permissions when using root user, in a new terminal, go into the MYSQL Command-Line Client and run the following commands:

ALTER USER 'root'@'localhost' IDENTIFIED BY 'your new password'; ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your new password';

![image](https://user-images.githubusercontent.com/48611641/170758437-4827743f-9c4a-4d47-8752-93e3adac9be6.png)

![image](https://user-images.githubusercontent.com/48611641/170759709-93d5bc8f-d218-447a-857d-45a1cb27b43c.png)

![image](https://user-images.githubusercontent.com/48611641/170760093-aae051d8-eae8-44ca-b599-4d8a1358fca8.png)

###Developers:

James Kim & Bryant Nguyen


