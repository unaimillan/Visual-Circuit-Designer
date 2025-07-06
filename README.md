# Visual-Circuit-Designer
Visual-Circuit-Designer is web-based platform that could provide students and learners good experience in designing circuits similar to the Block Diagrams (like on Computer Architecture), but without the need to install Quartus Prime or huge Virtual box image. 
## Usage

Follow these steps to launch and explore the MVP v2:

1. **Open the Application**  
  - Navigate to: https://www.visual-circuit-designer.ru

2. **Access**  
  - The service is **completely free** and **open**.  
  - **No registration** or user account is required.

3. **Core Functionality**  
  - **Create & Edit** logical circuits using basic components.  
  - **Configure** various global settings via the **Settings** menu.

4. **Exploration & Testing**  
- Once the page loads, you’ll land directly in the workspace.  
- Use the **Menu** to drag-and-drop components onto the canvas.
- Switch between tools and pick different wire styles (bezier, step and straight) directly from the toolbar to control how connections are drawn.
- Open the **Settings** panel to fine-tune circuit and application options.

## Architecture
### Overview
The system follows a microservice architecture with an API Gateway as the central entry point, serving as a reverse proxy to route requests to appropriate backend services. The architecture includes four main microservices, a frontend component, and supporting data stores.
### Static view
![static-view](./docs/architecture/static-view/staic-view.png)
#### Key components
1) **API Gateway**
    - Acts as the single entry point for all client requests
    - Routes requests to appropriate microservices based on path:
        - `/api/runner` -> Runner Node
        - `/api/profile` -> Profile microservice
        - `/api/auth` -> Auth microservice
        - `/api/library` -> Library microservice
        - Serves static frontend files from the File System
2) **Microservices**
    - **Auth microservice**
        - Manages user authentication and authorization
        - Handles token blacklisting and verification
        - Stores user credentials and authentication data
    - **Profile microservice**
        - Manages user profiles and projects
        - May require token verification for access
    - **Library microservice**
        - Manages public library
        - May require token verification for access
    - **Runner Node**
        - Executes simulators for user projects
3) **Frontend**
    - Staticly built frontend application served directly by the API Gateway
    - Interacts with backend services through the API Gateway
4) **Data stores**
    - **PostgreSQL**:
        - Primary relation database storing:
            - User data
            - Projects data
            - Library content
    - **Redis**
        - Used by Auth service for token blacklist management
        - Provides fast access to temporary authenication data
#### Communication Patterns
- All client requests first hit the API Gateway
- Microservices communicate with their dedicated database components
- Auth services provides centralized token verification used by other services
- Frontend is served as static files with API calls routed through the gateway

### Dynamic view
#### Auth microservice
The **Auth microservice** is responsible for **authentication**, **authorization**, and **token management** in the system.
- **User Registration Flow**\
    **Endpoint:** `/api/auth/register`\
    **Purpose:** Create a new user account.
    ![auth-register](./docs/architecture/dynamic-view/auth-register.png)
- **User Login Flow**\
    **Endpoint:** `/api/auth/login`\
    **Purpose:** Authenticate user and issue access & refresh tokens.
    ![auth-login](./docs/architecture/dynamic-view/auth-login.png)
- **Token Verification Flow**\
    **Endpoint:** `/api/auth/verify`\
    **Purpose:** Validate and access token (used by other services).
    ![auth-verify](./docs/architecture/dynamic-view/auth-verify.png)
- **Token Refresh Flow**\
    **Endpoint:** `/api/auth/refresh`\
    **Purpose:** Renew expired access tokens using a refresh token.
    ![auth-refresh](./docs/architecture/dynamic-view/auth-refresh.png)

### Deployment view
The system is deployed using **Coolify** for container orchestration, with **Nginx** serving as the API Gateway and reverse proxy.
![deployment_view](./docs/architecture/deployment-view/delpoyment-view.png)
#### Key aspects
- **Hosting**:
    - Domain: `visual-circuit-designer.ru` (HTTPS via Coolify's reverse proxy)
    - Static frontend files and `nginx.conf` are stored in **Coolify-managed storage**.
- **Microservices**
    - **Auth**, **Profile**, **Library**, and **Runner** run as **Docker containers** in an isolated network.
    - Services communicate via **internal HTTP** (routed by Nginx).
- **Data Stores**
    - **PostgreSQL** (primary database for users, projects, and library data)
    - **Redis** (used by **Auth** for token blacklisting)

This architecture ensures **secure, scalable, and maintainable** deployment with clear separation of concerns.
## Development
### Kanban board
https://github.com/orgs/IUMusicalFish19/projects/1/views/6

Columns: 
- Sprint
  - Difficulty assessed (story points)
  - Acceptance criteria are specified
  - Addition to the column approved by the customer
  - Someone on the team plans to do this during the sprint
- In progress
  - Someone signed up for this task and started working on it
- Done
  - Task is done(acceptance criteria done)
  - Execution approved by team members
- Paused/Research required
  - A team member started working on this task but was unable to complete it.

### Git workflow
For our project we used GitHub flow.

Rules: 
- For creating issues from the defined templates:
  
  1. 
## Quality assurance

## Build and deployment
