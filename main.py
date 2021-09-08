from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel


# class Calc(BaseModel):
#     first = int,
#     second = int,
#     operation = str


app = FastAPI()
templates = Jinja2Templates(directory="templates")


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("kalkulator.html", {"request": request})


@app.post("/api")
async def api(first: str = Form(...), second: str = Form(...), operation: str = Form(...)):
    if operation == 'dodawanie':
        result = int(first)+int(second)
    return {'data': result}
