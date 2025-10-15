from fastapi import FastAPI

app = FastAPI(title="STEM-a-Day API")

@app.get("/health")
def health():
    return {"ok": True}
