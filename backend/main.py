from fastapi import FastAPI
from auth import router as auth_router
from effort import router as effort_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(effort_router, prefix="/api", tags=["Effort Estimation"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Backend is running!"}
