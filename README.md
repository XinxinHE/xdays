# XDays is an online progress tracking website

### Folder structure

frontend: reactjs
- folder: /client

backend: express  
- file: /server

### Reference tutorial

Build a blog using expressjs and react <https://scotch.io/tutorials/build-a-blog-using-expressjs-and-react-in-30-minutes>

Create a react app from scratch <https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658>

## Okta service is used to handle the user registration, login, logout, etc. It is a free service used to manage user identities

<https://developer.okta.com/>

## SQLite is the database for storage

## Sequelize is ORM

Object-Relational Mapping (ORM) is a technique that lets you query and manipulate data from a database using an object-oriented paradigm.

## Epilogue is used to generate REST endpoints

## Kill process

lsof -i tcp:3000
kill -9 PID

## Error: listen EADDRINUSE :::8080

killall -9 node

------

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


