FROM python:3.12-alpine

ARG BACKEND_PORT
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
RUN pip install "uvicorn[standard]"
COPY . /app/
EXPOSE $BACKEND_PORT
RUN echo "uvicorn app.main:app --host 0.0.0.0 --port ${BACKEND_PORT}" > /app/start.sh
RUN chmod +x /app/start.sh
ENTRYPOINT ["sh", "/app/start.sh"]