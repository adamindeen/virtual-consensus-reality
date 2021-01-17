# Virtual Consensus Reality
Course project for module Web II at Erasmushogeschool Brussel. A user-generated newspaper using Twitter trends as headlines.

## Notes
This project was an exploration of full-stack web development: both back- and front-ends were developed by me from scratch.

Some of the key skills I employed and learned during the project were:
- The ECMAScript 6 standard, including object-oriented JavaScript with `class`es
- Writing a back-end server using node.js
- CRUD interactions with a database (my own mongoDB Atlas cluster)
- Data schemas for a user account system and 'articles' 
- Parsing JSON data into interpretable information
- Authentication and interaction with the Twitter API
- JQuery
- Responsive front-end design
## Setup
1. Clone the repo. Install dependencies with `npm i`
2. Launch the back-end server with `npm start`
3. Open the front end (using an HTTP server, or simply by launching index.html in a web browser)
## Use
The home page shows the top 5 Twitter trends for the area specified in `twitter.js`, alongside their associated articles. A trend's article can be viewed by clicking its headline. If a trend has no associated article, placeholder text will be displayed.

While viewing a trend, you can edit its associated article, or add one if it doesn't exist, by clicking *Edit This Article*. An edit can only be submitted if you have a user account.

Create a user account on the site by clicking *Register*. One user already exists (*adam* with password *123*). Once you are registered, articles can be edited and submitted using your user details.
