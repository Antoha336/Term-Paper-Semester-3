FROM python:3.11

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Europe/Moscow

COPY ./services/event_server/requirements.txt .
COPY ./services/event_server/src .
COPY ./shared ./shared

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5001

CMD ["python", "./server.py"]
