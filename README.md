# LUT University Fullstack - Project 
## Student: Sami Seppälä
<p>To run this project on your own machine locally, open a terminal and navigate to the project root folder (assuming you have the downloaded it). From there, run 
    
    npm install      
and

    node app.js
or (if you have nodemon installed)

    npm install
and

    nodemon app.js
This starts the server.
You need to have Node.js and npm installed on your machine. Node.js version should be at least v20.6.1, and npm version 9.8.1.

The server requires a .env file to be present in order to run correctly. The file should contain a SECRET, a string used for hashing the password. Also, the file can also contain PORT and NODE_ENV; in the case of trying this application, they can be defined as PORT=3000 and NODE_ENV=development. 

If you do not have Npm and Node installed, [nodejs.org](https://nodejs.org) will help you along.
</p>

<p>
Open another terminal, and navigate to the client folder in the project root folder and run:

      npm install
and when the above command is complete, run:

      ng serve
 
That's it! You should have the project now running in your browser.
</p>



