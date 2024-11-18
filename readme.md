# GPTbot Backend

This repository contains the backend server for GPTbot, a third-party client for OpenAI's ChatGPT model. It works together with the frontend repository, which you can find here: [GPTbot Frontend Repository](https://github.com/Aquabet/GPTbot_frontend). It provides the necessary APIs and infrastructure to support frontend interactions, manage chat sessions, handle user authentication, and customize the chatbot behavior.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure user authentication and session management.
- **Chat API**: Provide endpoints to interact with OpenAI's GPT models.
- **Session Management**: APIs for creating, renaming, and deleting chat sessions.
- **Model Customization**: Ability to customize the model used for generating responses.

## Technologies Used

- **Node.js**: Server-side runtime for building scalable network applications.
- **Express.js**: Fast and minimalist web framework for Node.js to create APIs.
- **MongoDB**: NoSQL database for storing user and session data.
- **JWT**: JSON Web Tokens for secure user authentication.
- **OpenAI API**: Integration with OpenAI's ChatGPT for generating conversational responses.

## Getting Started

Follow these instructions to set up the project locally for development and testing purposes.

### Prerequisites

- **Node.js** (v14 or above)
- **npm** (v6 or above)
- **MongoDB**: A running MongoDB instance (local or cloud).
- **OpenAI API Key**: You need an API key from OpenAI to interact with the ChatGPT model.

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Aquabet/GPTbot_backend.git
   cd GPTbot_backend
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and set up the following environment variables:

```env
NODE_ENV=development # or production

PORT=5000 # Port on which the server will run

MONGODB_URI= # MongoDB connection string, replace with your MongoDB URI

OPENAI_API_KEY= # Your OpenAI API key for accessing ChatGPT, replace with your key

JWT_SECRET= # Secret key for generating JWT tokens, replace with a secure secret key

CORS_ORIGIN_DEVELOP=http://localhost:5173 # Allowed origin for development environment

CORS_ORIGIN_PRODUCTION=https://yourdomain.com # Allowed origin for production environment
```

- `NODE_ENV`: Specifies the environment. Set to `development` for local development or `production` for production deployment.
- `PORT`: The port number on which the backend server will run.
- `MONGODB_URI`: The MongoDB connection URI used to connect to your MongoDB instance.
- `OPENAI_API_KEY`: Your API key from OpenAI for accessing the ChatGPT model.
- `JWT_SECRET`: Secret key used for signing JSON Web Tokens for secure user authentication.
- `CORS_ORIGIN_DEVELOP`: The allowed origin for the development environment. Typically, this should match your frontend's development URL.
- `CORS_ORIGIN_PRODUCTION`: The allowed origin for the production environment. Set this to match your deployed frontend URL.

### Running the Server

To start the backend server, run:

```sh
npm start
```

The server will be available at `http://localhost:5000` (or the specified port).

## API Documentation

The backend provides the following key endpoints:

- **Authentication**:
  - `POST /auth/login`: Log in a user.
  - `POST /auth/register`: Register a new user.
  - `POST /auth/logout`: Log out a user.
  - `GET /auth/validate`: Validate a user's authentication token.

- **Chat**:
  - `POST /chat/session`: Create a new chat session.
  - `GET /chat/sessions`: Get all chat sessions for a user.
  - `DELETE /chat/session/:id`: Delete a specific chat session.
  - `PATCH /chat/session/:id`: Rename a specific chat session.
  - `POST /chat/message`: Send a message and receive a response from the model.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for review.

### Steps to Contribute

1. **Fork the repository**.
2. **Create a new branch** for your feature (`git checkout -b feature/your-feature-name`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a Pull Request**.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
