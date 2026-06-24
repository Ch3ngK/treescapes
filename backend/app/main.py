from fastapi import FastAPI

from app.api.routes.companies import router as companies_router
from app.api.routes.sites import router as sites_router
from app.api.routes.users import router as users_router
from app.api.routes.auth import router as auth_router
from app.api.routes.checklist_templates import router as checklist_templates_router
from app.api.routes.evaluations import router as evaluation_router

app = FastAPI(title="Treescapes API")

app.include_router(sites_router)
app.include_router(companies_router)
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(checklist_templates_router)
app.include_router(evaluation_router)

@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Treescapes API is running"}