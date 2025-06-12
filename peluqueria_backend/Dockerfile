FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias necesarias para compilar pyodbc y para mssql extension
RUN apt-get update && \
    apt-get install -y docker.io gcc g++ unixodbc-dev libicu-dev libicu72 && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]