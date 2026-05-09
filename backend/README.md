
# Moveo Coding Web Application

## Project Overview
This online coding web application is a full-stack web application developed using **React.js** for the client-side, **Node.js** for the server-side, and **MongoDB** as the database. The backend is deployed on **Railway**, while the frontend is deployed on **Vercel**.

## Application Link
The app's link: [here](https://moveo-coding-web-app-client-ecfgkj5mf-osherelikamels-projects.vercel.app/).

## Project Structure

### Backend
The backend manages server-side logic, database interactions, and API routing. It is structured as follows:
- **`config`**: db.js, socketConfig.js
- **`models`**: codeBlock.js
- **`controllers`**: codeBlocksController.js
- **`routes`**: codeBlocks.js
- **`services`**: socketService.js
- **`socket`**: index.js
- **`server.js`**
- **`app.js`** 

### Client
The client is a React.js application, the components are structured as follows:
- **`LobbyPage`**: LobbyPage.jsx, LobbyPage.css 
- **`CodeBlockPage`**: CodeBlockPage.jsx, CodeBlockPage.css

## How to Run Locally

1. Clone the repositories:
   ```bash
   git clone https://github.com/OsherElikamel/MoveoCodingWebAppClient.git
   git clone https://github.com/OsherElikamel/MoveoCodingWebAppBackend.git
   ```

2. To run the client:
   ```bash
   npm install
   npm start
   ```

3. To run the server:
   ```bash
   npm install
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Deployment

- **Backend**: Deployed on [Railway](https://railway.app/)
- **Frontend**: Deployed on [Vercel](https://vercel.com/)


## Code Example

Here’s an example of the codeBlock object:

```javascript
{
  "_id": {
    "$oid": "673f676bd0e6e8e2e165bcb0"
  },
  "title": "Array Reduce",
  "description": "This task introduces the reduce method. Students need to calculate the sum of an array of numbers.",
  "initialCode": "const numbers = [1, 2, 3, 4];\nconst sum = numbers.reduce(); // Calculate the sum\",",
  "solution": "const numbers = [1, 2, 3, 4];\nconst sum = numbers.reduce((acc, num) => acc + num, 0);",
  "__v": 0
}
```

