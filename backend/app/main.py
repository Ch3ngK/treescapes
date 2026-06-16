from fastapi import FastAPI

from app.api.routes.companies import router as companies_router
from app.api.routes.sites import router as sites_router
from app.api.routes.users import router as users_router
from app.api.routes.auth import router as auth_router

app = FastAPI(title="Treescapes API")

app.include_router(sites_router)
app.include_router(companies_router)
app.include_router(users_router)
app.include_router(auth_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Treescapes API is running"}