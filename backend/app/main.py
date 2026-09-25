import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.services import router as services_router
from app.api.auth import router as auth_router
from app.api.admin_services import router as admin_services_router
from app.api.appointments import router as appointments_router
from app.api.availability import router as availability_router
from app.api.admin_appointments import router as admin_appointments_router

from app.db.database import engine


app = FastAPI(
    title="Salon API",
    version="1.0.0",
)

origins = [
    "http://localhost",
    "http://localhost:8081",     # Default Metro Bundler port for Expo web
    "http://127.0.0.1:8081",
    "http://192.168.31.134"
]

production_frontend_url = os.getenv("FRONTEND_URL")
if production_frontend_url:
    origins.append(production_frontend_url)

if os.getenv("ENVIRONMENT") == "development":
    origins = ["*"]

# 4. Add the CORS middleware to your application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers (Authorization, Content-Type, etc.)
)

app.include_router(services_router)
app.include_router(auth_router)
app.include_router(admin_services_router)
app.include_router(appointments_router)
app.include_router(availability_router)
app.include_router(admin_appointments_router)

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/health/db")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "database": "ok"
    }

if __name__ == "__main__":
    # Use the import string format "app.main:app" so --reload works correctly
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)