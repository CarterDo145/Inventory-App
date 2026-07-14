# Inventory Management System

A full-stack inventory management application designed to modernize inventory tracking for small businesses. The application replaces manual inventory management methods with a centralized web platform that provides real-time inventory updates, historical tracking, and analytics to improve operational efficiency.

> 🚧 **Status:** In active development and currently in the process of deployment.

---

## Overview

This project was developed to solve a real-world inventory management problem by replacing handwritten notes and text-message based inventory updates with a digital solution.

The system allows users to manage products, monitor inventory levels, visualize inventory trends, and maintain a complete history of inventory changes through an intuitive web interface.

---

## Features

- 📦 Real-time inventory management
- 📈 Inventory history and analytics
- 📝 Bulk inventory updates
- 🖼️ Product image uploads
- 🏷️ Customizable product categories
- 🔍 Product search functionality
- 📊 Interactive inventory trend graphs
- ⭐ Most frequently updated item reporting
- ⚠️ Low stock monitoring
- 📱 Responsive user interface

---

## Technologies Used

### Frontend

- React
- JavaScript
- Tailwind CSS
- Vite

### Backend

- Python
- Django
- Django REST Framework

### Database

- SQLite

### Development Tools

- Docker
- Git
- GitHub

---

## Architecture

```text
React Frontend
       │
REST API (Django REST Framework)
       │
Business Logic
       │
SQLite Database
```

---

## Key Functionality

### Inventory Management

- Create new inventory items
- Update stock quantities
- Delete inventory items
- Upload and update product images
- Organize inventory using custom categories

### Inventory Ledger

Every inventory adjustment is recorded in a ledger system that provides:

- Historical inventory tracking
- Inventory movement over time
- Accurate audit history
- Data used for reporting and analytics

### Analytics

The application includes reporting tools that help users better understand inventory usage.

Current analytics include:

- Inventory history graphs
- Product trend visualization
- Most frequently updated products
- Low stock indicators

---

## REST API

Example endpoints:

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/items/` | Retrieve inventory items |
| POST | `/api/items/` | Create inventory item |
| PATCH | `/api/items/{id}/` | Update item |
| DELETE | `/api/items/{id}/` | Delete item |
| GET | `/api/ledger/` | Retrieve inventory history |
| POST | `/api/ledger/` | Record inventory changes |

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/Inventory-App.git
cd Inventory-App
```

---

### Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Backend runs on:

```text
http://127.0.0.1:8000
```

---

### Frontend

```bash
cd frontend/frontend-react

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Skills Demonstrated

- Full-Stack Development
- REST API Development
- React
- Django REST Framework
- Python
- SQL
- Docker
- Git
- Responsive Web Design
- Database Design
- Data Visualization
- Problem Solving

---

## Future Enhancements

- Cloud deployment
- User authentication
- Barcode scanning support
- Inventory export functionality
- Automated inventory alerts
- Multi-location inventory support
- Mobile application

---

## Project Goals

- Simplify inventory management
- Improve inventory accuracy
- Reduce manual data entry
- Provide historical inventory visibility
- Support better inventory planning through analytics
