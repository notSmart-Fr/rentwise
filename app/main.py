from fastapi import FastAPI

app = FastAPI(title="RentWise API")

@app.get("/health")
def health():
    return {"status": "ok"}
@app.get("/")
def root():
    return {"message": "RentWise API is running. Go to /docs"}