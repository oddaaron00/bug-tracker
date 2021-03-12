# bug-tracker
 Bug tracker web app built using the MERN stack with added authentication using JWT

# Demo

![demo on desktop](https://media0.giphy.com/media/9cB3IPh1b3XATOWIbi/giphy.gif)
![demo on mobile](https://media2.giphy.com/media/EIDomzWhjKEikm63J2/giphy.gif)

# Get started
To start, create a .env file under /api with variables SECRET_KEY and URI:
- SECRET_KEY: The secret key used for JWT signing
- URI: The URI of the Mongo database
- PORT: The port the API will listen on (optional - default 3006)

Next, edit `setupEnvironment.bat` and change the file paths so they are accurate for your setup.
Then run the .bat file to start both the client and the API.
Alternatively, navigate to the /API and /client folders and run `npm start` separately.
