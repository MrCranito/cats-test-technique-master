# syntax = docker/dockerfile:1

FROM python:3.12-slim
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev gcc python3-dev \
  && apt-get install -y python3 \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /code/

