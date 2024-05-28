# Image Management and Tagging System

## Project Overview

This project is a comprehensive web application designed for managing and tagging images automatically using machine learning and natural language processing. The application is split into three main parts: Backend, Embedding Microservice, and Frontend.

## Prerequisites

- Node.js
- Python
- MongoDB
- Ollama with the LLava model

## Setup Instructions

### Backend Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/idowolf/image-tagging.git
    cd image-tagging/backend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    - Rename `.env.example` to `.env`
    - Update the environment variables in the `.env` file

4. **Set up MongoDB**

    - Ensure MongoDB is installed and running. You can download and install MongoDB from [here](https://www.mongodb.com/try/download/community).
    - Start MongoDB:

        ```bash
        mongod --dbpath <path_to_your_db>
        ```

    - Update the `MONGO_DB_URI` environment variable in the `backend/.env` file with your MongoDB URI. You may adjust other parameters as well if necessary.

5. **Run the application**

    ```bash
    npm run dev
    ```

6. **Run tests**

    ```bash
    npm test
    ```

### Embedding Microservice Setup

1. **Navigate to the embedding microservice directory**

    ```bash
    cd ../embedding-microservice
    ```

2. **Set up a virtual environment**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies**

    ```bash
    pip install -r requirements.txt
    ```

4. **Run the microservice**

    ```bash
    python app.py
    ```

### Frontend Setup

1. **Navigate to the frontend directory**

    ```bash
    cd ../frontend
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Run the application**

    ```bash
    npm start
    ```

### Setting Up Ollama with LLava Model

1. **Install Ollama**

    - Follow the instructions to install Ollama from [here](https://ollama.com/download).

2. **Download and Set Up the LLava Model**

    - Follow the instructions to download the LLava model from [here](https://ollama.com/library/llava).

3. **Run the LLava Model Server**

    ```bash
    ollama run llava
    ```

4. **Configure the Backend to Use the LLava Model**

    - Update the `LLM_SERVER_URL` environment variable in the `.env` file with the URL of your LLava model server.

### Setting Up and Hosting MongoDB on Localhost

    - Visit the MongoDB installation page [here](https://docs.mongodb.com/manual/installation/) and follow the instructions to install MongoDB and host it locally for your specific operating system. Adjust `MONGO_DB_URI` in the `.env` file if necessary.

## Project Structure Details

### Backend

#### Configuration Files
- `config/appConfig.ts`: Sets up the Express app, loads environment variables, and configures middleware.
- `config/dbConfig.ts`: Connects to the MongoDB database.
- `config/passportConfig.ts`: Configures Passport.js for authentication.

#### Controllers
- `authController.ts`: Handles user registration, login, and Google authentication.
- `imageController.ts`: Manages image uploads and searches.
- `tagController.ts`: Converts text to tags and provides tag autocomplete functionality.
- `userController.ts`: Completes user profiles.

#### Middlewares
- `authMiddleware.ts`: Verifies JWT tokens and attaches user information to the request.
- `uploadMiddleware.ts`: Handles file uploads using multer.

#### Models
- `FaissIndex.ts`: Schema for storing Faiss index data.
- `Image.ts`: Schema for storing image metadata.
- `Tag.ts`: Schema for storing tags and their embeddings.
- `User.ts`: Schema for storing user information.

#### Routes
- `authRoutes.ts`: Routes for authentication and user profile management.
- `imageRoutes.ts`: Routes for image upload and search.
- `tagRoutes.ts`: Routes for tag conversion and autocomplete.

#### Services
- `imageService.ts`: Handles image processing and storage.
- `llmService.ts`: Integrates with an LLM server to generate tags from images.
- `nlpService.ts`: Provides NLP functionalities like text embedding and relevant tags extraction.
- `tagService.ts`: Manages tag generation, embedding, and storage.
- `vectorService.ts`: Integrates with Faiss for image similarity searches.

#### Entry Point
- `server.ts`: Main entry point for the backend server. Configures routes, middleware, and starts the server.

### Embedding Microservice

- `app.py`: Main application file for the embedding microservice. Handles requests for generating embeddings.
- `requirements.txt`: Python dependencies.

### Frontend

#### Components
- `Auth`: Components for authentication (login, register, GoogleAuthButton).
- `ImageUpload`: Component for uploading images.
- `Profile`: Components for profile completion and editing.
- `Search`: Component for searching images by tags.

#### Context
- `AuthContext.tsx`: Context provider for managing authentication state.

#### Pages
- `CompleteProfilePage.tsx`: Page for completing user profiles.
- `EditProfilePage.tsx`: Page for editing user profiles.
- `Home.tsx`: Home page.
- `LoginPage.tsx`: Login page.
- `RegisterPage.tsx`: Register page.

#### Services
- `api.ts`: API service for making HTTP requests to the backend.

## Additional Information

For more detailed information on each part of the application, refer to the respective directories and files in the project repository.
