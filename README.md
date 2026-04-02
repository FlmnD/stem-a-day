# STEM A Day

- Gamified learning done right
- Learn chemistry concepts through games and an engaging reward system
- Game problems rotate daily
- More STEM subjects are planned

## Install
- Node.js LTS
- Docker
- Python 3.12 for the backend
- Optional for real email delivery: SMTP credentials

- After downloading the project, move into the frontend folder with `cd frontend`
- Type and enter `npm install` in the terminal to install the required Node dependencies
- You may have to type and enter `npm install lucide-react` to install our icon library if it is not installed via `npm install` or if you see errors after runnning the website
- Go back to the parent folder with `cd ..`
- Install the Python dependencies by first moving into the backend folder with `cd backend`
- Then type `pip install requirements.txt` into the terminal
- Go back to the parent folder with `cd ..`
- Next, open the Docker Desktop app to start the Docker Engine
- Type `docker compose up --build` into the terminal to build and run the docker images
- Wait for Docker to finish building
- In a new terminal window type `docker exec -it stem-a-day-api python -m app.seed_plants` to populate the shop with plant data (one time thing and will make this automatic in the future)
- Ctrl+Click the localhost link that is present in the terminal to open in in the browser or copy and paste the link into your browser to use the website
