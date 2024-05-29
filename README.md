# Image Management and Tagging System

## Project Overview

This project is a comprehensive web application designed for managing and tagging images automatically using machine learning and natural language processing. The application is split into three main parts: Backend, Embedding Microservice, and Frontend.

## Prerequisites

- Node.js
- Python
- MongoDB
- Ollama with the LLava model

## Setup Instructions

1. **Setup Ollama and LLava Model**

    - Follow the instructions to install Ollama from [here](https://ollama.com/download).
    - Follow the instructions to download the LLava model from [here](https://ollama.com/library/llava).
    - Run the LLava Model Server:

        ```bash
        ollama run llava
        ```

2. **Set up MongoDB**

    - Ensure MongoDB is installed and running. You can download and install MongoDB from [here](https://www.mongodb.com/try/download/community).
    - Start MongoDB:

        ```bash
        mongod --dbpath <path_to_your_db>
        ```
3. **Set up Redis**

    - Install Redis by following the instructions [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/).

4. **Set up the embedding microservice**

    - Set up a virtual environment and install the requirements:

        ```bash
        cd ./embedding-microservice
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        ```

    - Run the microservice:

        ```bash
        python app.py
        ```
5. **Configure environment variables**

    - Rename `backend/.env.example` to `backend/.env`
    - Update the environment variables in the `.env` file based on the ports of the various services that have been set up.

6. **Set up the backend**
    
    - Install dependencies: 

        ```bash
        cd ./backend
        npm install
        ```
    
    - Run the backend:

        ```bash
        npm run dev
        ```

    - Or run tests instead:

        ```bash
        npm test
        ```

7. **Set up the frontend**
    
    - Install dependencies:

        ```bash
        cd ./frontend
        npm install
        ```

    - Run:

        ```bash
        npm start
        ```
    
    - Or run tests instead:

        ```bash
        npm test
        ```

    - Remember to update `backend/.env` if you do not use port 3000 or localhost.

8. **Remember to set .env files**

    - Adjust both `frontend/.env` and `backend/.env` so that all communications are performed correctly.

## Notes

    - Google sign-in will not work for you as the project on Google Cloud Console only has one test user, which is mine. Either contact me to add your email as a test user, or create a new Google Cloud project and create OAuth 2.0 Client ID for it, then update the .env files appropriately, or ignore the feature for now.

    - Additional improvements for scalability: Setup the remote server with sharding on MongoDB (you may find sample config files in the `mongo_conf` directory), load balancing using NGINX.

## Additional Information

For more detailed information on each part of the application, refer to the respective directories and files in the project repository.
