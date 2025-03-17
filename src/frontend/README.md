# Frontend Application

This is the frontend application for the Serverless Developer Experience project.

## Environment Variables

The application uses several environment variables that need to be set in the `.env` file:

### AWS Configuration
- `REACT_APP_AWS_REGION`: AWS region where the backend resources are deployed
- `REACT_APP_USER_POOL_ID`: Cognito User Pool ID
- `REACT_APP_USER_POOL_CLIENT_ID`: Cognito User Pool Client ID
- `REACT_APP_API_URL`: API Gateway URL

### Alpha Vantage API
The Market Trends dashboard uses the Alpha Vantage API to fetch real-time stock data. 

To use your own API key:
1. Sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Add your API key to the `.env` file:
   ```
   REACT_APP_ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

Note: The free tier of Alpha Vantage has a limit of 5 API calls per minute and 500 calls per day. If you don't provide an API key, the application will use the demo key which has even stricter limitations.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.