# Messaging Platform

A distributed messaging platform built using a microservices architecture.

The project demonstrates:

- API Gateway pattern
- Service decomposition
- JWT authentication
- Containerized deployment
- Kubernetes orchestration
- Reverse proxy configuration
- Inter-service communication

---

## Architecture Overview

```
                        ┌─────────────────────────────────────────────────────┐
                        │                      Nginx                          │
                        │               (Reverse Proxy — Port 80)             │
                        └───────────────┬─────────────────┬───────────────────┘
                                        │                 │
                              ┌─────────▼──────┐  ┌──────▼──────┐
                              │   Client (React)│  │  Middleware  │
                              │    Port 3000    │  │  Port 4000   │
                              └─────────────────┘  └──────┬──────┘
                                                          │
                         ┌────────────────────────────────┼──────────────────────┐
                         │                                │                      │
               ┌─────────▼──────┐              ┌─────────▼──────┐  ┌────────────▼───┐
               │  Auth Service  │              │  Users Service │  │  Chat Service  │
               │   Port 4001    │              │   Port 4002    │  │   Port 4003    │
               └─────────┬──────┘              └────────┬───────┘  └────────┬───────┘
                         │                              │                    │
                         └──────────────────────────────┼────────────────────┘
                                                        │
                                              ┌─────────▼──────┐
                                              │    MongoDB      │
                                              │   Port 27017   │
                                              └────────────────┘
```

### Services

| Service | Description | Port |
|---|---|---|
| `client` | React frontend | 3000 |
| `middleware` | API gateway, routes requests to internal services | 4000 |
| `auth_service` | Handles registration, login and JWT issuance | 4001 |
| `users_service` | Manages user data and profiles | 4002 |
| `chat_service` | Handles real-time messaging | 4003 |
| `nginx` | Reverse proxy for the client and middleware | 80 |
| `mongo` | Primary database (MongoDB) | 27017 |

---

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js (microservices)
- **Database:** MongoDB
- **Gateway:** Custom middleware service
- **Reverse Proxy:** Nginx
- **Containerization:** Docker / Docker Compose
- **Orchestration:** Kubernetes (Minikube)

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose, **or**
- [Minikube](https://minikube.sigs.k8s.io/) and [kubectl](https://kubernetes.io/docs/tasks/tools/)

---

## Deployment

### Option 1 — Docker Compose

#### 1. Configure environment variables

For each of the following services (`auth_service`, `users_service`, `chat_service`), create a `.env` file inside the corresponding folder.

**auth_service/.env**
```env
PORT=4001
MONGO_HOST=mongo
JWT_SECRET=your_secret_key_here
```

**users_service/.env**
```env
PORT=4002
MONGO_HOST=mongo
```

**chat_service/.env**
```env
PORT=4003
MONGO_HOST=mongo
```

**middleware/.env**
```env
PORT=4000
AUTH_BASE_URL='http://auth:4001/'
USERS_BASE_URL='http://users:4002/'
CHAT_BASE_URL='http://chat:4003/'
```

#### 2. Build and run

From the root directory (where `docker-compose.yml` lives):

```bash
docker-compose up --build
```

#### 3. Open the app

Navigate to [http://localhost](http://localhost) in your browser.

---

### Option 2 — Minikube (Kubernetes)

#### 1. Navigate to the k8s folder

```bash
cd k8s
```

#### 2. Apply all manifests

```bash
kubectl apply -f database-persistent-volume-claim.yml
kubectl apply -f persistent-volume.yml
kubectl apply -f mongo-deployment.yml
kubectl apply -f mongo-service.yml
kubectl apply -f nginx-configMap.yml
kubectl apply -f client-deployment.yml
kubectl apply -f client-service.yml
kubectl apply -f middleware-deployment.yml
kubectl apply -f middleware-service.yml
kubectl apply -f auth-deployment.yml
kubectl apply -f auth-service.yml
kubectl apply -f chat-deployment.yml
kubectl apply -f chat-service.yml
kubectl apply -f users-deployment.yml
kubectl apply -f users-service.yml
```

#### 3. Verify the cluster

```bash
kubectl get all
```

Wait until all pods show a `Running` status.

#### 4. Expose the service

```bash
minikube service nginx
```

---

## Project Structure

```
ChatApp/
├── auth_service/        # Authentication microservice
├── chat_service/        # Chat / messaging microservice
├── client/              # React frontend
├── k8s/                 # Kubernetes manifests
├── middleware/          # API gateway
├── nginx/               # Nginx reverse proxy config
├── users_service/       # User management microservice
├── docker-compose.yml   # Local multi-container setup
└── .gitignore
```

---

## License

This project is open source. Feel free to use it as a reference or starting point for your own projects.
