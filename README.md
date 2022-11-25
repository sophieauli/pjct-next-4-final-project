Diego is a full stack web application to create events, invite guests and monitor rsvps. Users can create an account and their events will be diplayed on their homepage. What's still left to be implemented is an sms API to allow users to send each of their guests an invitation with a custom link to a page where they can rsvp. 


## Technologies

- Next.js
- React
- JavaScript
- Emotion/react
- PostgreSQL
- Typescript
- REST API
- Figma (Design of website, API Flowchart)
- Notion (Timeline, Break down of to do's)
- DrawSQL
- Adobe Illustrator
- Fly.io (once deployed)

## Pages & 

- A login / register page, when logged in, the hosts have certain authorizations for certain pages
- An overview of the specific user's events
- A single event page displaying the event details including a description and list of invited and attending guests
- Individual Rsvp pages for every invited guest

## Functionalities

- login/registration
- generation of a unique token for every created guest that relates to his/her rsvp page

## Wireframes and Database scheme

<img width="1440" alt="Screenshot 2022-11-25 at 12 35 09" src="https://user-images.githubusercontent.com/110776070/203977967-0bf8077a-f209-43af-9c84-270c683947f1.png">

<img width="517" alt="Screenshot 2022-11-25 at 12 48 38" src="https://user-images.githubusercontent.com/110776070/203979562-3ecafe20-f783-4b54-a8b2-5b4e9893b898.png">

<img width="495" alt="Screenshot 2022-11-25 at 12 48 59" src="https://user-images.githubusercontent.com/110776070/203979620-23bc1a06-27b4-400e-ab6a-46624feb97b5.png">

## Setup instructions

- Clone the repository with git clone <repo>
- Setup the database by downloading and installing PostgreSQL
- Create a user and a database
- Create a new file .env
- Copy the environment variables from .env-example into .env
- Replace the placeholders xxxxx with your username, password and name of database
- Install dotenv-cli with yarn add dotenv-cli
- Run yarn install in your command line
- Run the migrations with yarn migrate up
- Start the server by running yarn dev
