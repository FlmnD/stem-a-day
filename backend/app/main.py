from contextlib import asynccontextmanager

import app.schemas
import app.models
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from app.database import bootstrap_database
from app.seed_plants import seed_plants
from app.routes.daily import router as daily_router
from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.plants import router as plants_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    bootstrap_database()
    seed_plants()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(plants_router)
app.include_router(daily_router)


@app.get("/")
def root():
    return {"message": "Hello World"}
