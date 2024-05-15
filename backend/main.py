# -*- coding: utf-8 -*-
# -*- Python Version: 3.11 -*-

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rich import print

try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception as e:
    print(e)

from backend.routes import fake_database, github, three_js
from backend.storage.db import db

# ----------------------------------------------------------------------------------------------------------------------
# -- Setup the FastAPI app and routes

app = FastAPI()
app.include_router(three_js.router)
app.include_router(github.router)
app.include_router(fake_database.router)


# ----------------------------------------------------------------------------------------------------------------------
# -- Setup the FastAPI Configurations

origins = [
    "http://localhost:3000",
    "localhost:3000",
    "http://localhost:8000",
    "localhost:8000",
    "https://ph-tools.github.io",
    "https://bldgtyp.github.io",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
