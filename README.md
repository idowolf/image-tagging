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

## Additional Information

For more detailed information on each part of the application, refer to the respective directories and files in the project repository.
