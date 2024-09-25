FROM python:3.12.3

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libhdf5-dev \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip3 install --no-cache-dir -r requirements.txt

COPY models/ /app/models/
COPY main.py image_processing.py google_drive.py /app/

CMD ["python3", "main.py"]
