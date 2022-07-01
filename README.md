# POI Application Hapi 
This is the backend for the PlaceMark Application. (OTH Regensburg Advanced Full Stack Development assignment).
In this application you can display/add/edit points of interest.

# Web Interface Features
The project includes a web interface for adding/deleting/displaying points of interest (venues in this case). You can also log in or register as a user.
As an admin user you also have access to admin settings and admin analytics.

Display Points of Interest
--------------------------
![image](https://user-images.githubusercontent.com/63292426/176936546-38d7e0bb-5d1e-4c13-8647-3bf9f8544c3b.png)


Edit POI / Add new POI
----------------------
![image](https://user-images.githubusercontent.com/63292426/176937421-b057ff8f-f859-447b-9146-5e8eebf351a0.png)
![image](https://user-images.githubusercontent.com/63292426/176937588-a4d55a03-eaeb-4eba-8953-83ecfd66290b.png)



Admin Settings/ Analytics
-------------------------
![image](https://user-images.githubusercontent.com/63292426/176936807-c04a956d-fc91-46d4-bc5c-aa743f302ebb.png)
![image](https://user-images.githubusercontent.com/63292426/176936923-af2f418a-5093-4ecc-ab46-6fcd9a22932b.png)


# Models
In this project the model data is stored in a mongodb database (see 'src/models'). Specify the connection details in a dotenv file. All data is deleted and the database is reseeded everytime the application starts.
There are 3 types of models: POI, user, POI-Category.
A POI model consists of title, description, lat/lng location, images, categories and creator of POI.
A user model consists of first name, last name, username, email, password and isadmin flag.
A category consists of title and description

**Project also contains unit tests for all models (see 'test/models').**

# API
This project includes a REST interface.
Swagger documentation for the REST API can be accessed via path '/documentation' on webpage. 

Authentication
--------------
Api uses authentication via [JWT](https://de.wikipedia.org/wiki/JSON_Web_Token "JWT Wikipedia").

Authorization
-------------
**User with default pivileges can:**
  * authenticate
  * get own user details
  * delete own user
  * get all POI
  * update own POI
  * delete own POI
  * add a new POI
  * get all categories

**An admin user is authorized to do everything a default user can do. But additionally he can:**
  * get all users details
  * delete all users
  * delete all POI
  * delete all users
  * add a new category
  * update a category
  * delete all categories

Testing
-------
**The project also contains unit tests for the REST api (see 'test/api').**
