FROM python:3.11

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Europe/Moscow

COPY ./services/event_service/requirements.txt .
COPY ./services/event_service/src .
COPY ./shared ./shared

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

EXPOSE 5002

CMD ["python", "./server.py"]
