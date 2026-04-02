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

- Move into `frontend` and run `npm install`
- Move into `backend` and run `pip install -r requirements.txt`
- Return to the repo root and start Docker Desktop
- Run `docker compose up --build`
- In a new terminal, run `docker exec -it stem-a-day-api python -m app.seed_plants`
- Open the local app URL shown in the terminal

## Email Verification
- New signups must verify their email before they can log in
- Set `APP_BASE_URL` to the frontend URL users should land on from the email link
- Set `EMAIL_FROM` and the `SMTP_*` variables in `.env` to send real emails
- If `SMTP_HOST` is empty during local development, the backend logs a working verification link instead
