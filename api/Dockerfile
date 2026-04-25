# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PORT 8080

# Set work directory
WORKDIR /app

# Install system dependencies
# We need build-essential for compiling C extensions
# We need libcairo2-dev (headers) for PDF generation
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libcairo2-dev \
    libmagic1 \
    pkg-config \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Make start script executable
RUN chmod +x scripts/start.sh

# Command to run the application
CMD ["./scripts/start.sh"]