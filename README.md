## IT22 Admin Panel

In the project directory, you can run:

### `npm install`

### `npm start` or `yarn start`

Runs the app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

### How to run Docker file on Local Machine

You can create the build via **Docker** and serve it via **Nginx**

`docker-compose build --no-cache && docker-compose up`

`docker run -p 8052:8052 IMAGE_ID`

`docker run -p 8052:8052 IMAGE_ID`

### `npm run build` or `yarn build`

### Environment Variables:

`REACT_APP_ENVIRONTMENT=PRODUCTION`
`REACT_APP_ENABLE_REDUX_DEV_TOOLS=FALSE`
`REACT_APP_USERS_URL=`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.
