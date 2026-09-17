import uvicorn
from fastapi import FastAPI
from sqlalchemy import text

from app.api.services import router as services_router
from app.api.auth import router as auth_router
from app.api.admin_services import router as admin_services_router
from app.api.appointments import router as appointments_router
from app.api.availability import router as availability_router

from app.db.database import engine


app = FastAPI(
    title="Salon API",
    version="1.0.0",
)

app.include_router(services_router)
app.include_router(auth_router)
app.include_router(admin_services_router)
app.include_router(appointments_router)
app.include_router(availability_router)

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