FROM mcr.microsoft.com/devcontainers/python:3.9

WORKDIR /app

RUN apt-get update && \
    apt-get install -y gcc g++ unixodbc-dev libicu-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
