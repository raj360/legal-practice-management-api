# Legal Practice Management API

A RESTful API for a legal practice management system built with NestJS, TypeScript, and a simulated Prisma ORM.

## Overview

This application provides core features for legal practice management including:

- **Case Management**: Create and manage legal cases
- **Document Metadata**: Store and retrieve document information
- **Time Tracking**: Record and query billable hours
- **User Management**: Manage user profiles with role-based access

## Technical Stack

- **Framework**: NestJS with TypeScript
- **Authentication**: JWT-based with role-based authorization
- **Data Layer**: Simulated Prisma ORM with in-memory storage
- **Documentation**: Swagger/OpenAPI and Postman collection
- **Testing**: Jest

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd legal-practice-management-api
yarn install
```

3. Start the application:

```bash
yarn start
```

The API will be available at http://localhost:3000

## Testing with Postman

A comprehensive Postman collection is available for testing all API endpoints.

### Postman Collection Setup

1. The Postman collection file is located at:
   ```
   /_docs/Legal Practice Management API.postman_collection.json
   ```

2. Import the collection into Postman:
   - Open Postman
   - Click "Import" in the top-left corner
   - Select the `/_docs/Legal Practice Management API.postman_collection.json` file

3. Set up your environment:
   - Create a new environment in Postman
   - Add the following variables:
     - `baseUrl`: `http://localhost:3000` (or your server URL)
     - The following variables will be auto-populated during testing:
       - `adminToken`
       - `attorneyToken` 
       - `userId`
       - `caseId`
       - `documentId`
       - `timeEntryId`

4. Testing workflow:
   - Start the API server with `yarn start`
   - Begin by running the "Login as Admin" and "Login as Attorney" requests to get authentication tokens
   - The tokens will be automatically set in the environment variables
   - Proceed with other requests in logical order (create, get, update, delete)
   - Most requests include automatic scripts to set IDs as environment variables for subsequent requests

5. Authorization:
   - Admin credentials: `admin@legaltech.com` / `admin123`
   - Attorney credentials: `attorney@legaltech.com` / `attorney123`
   - Some endpoints are restricted by role (see API documentation)
   - **Important**: You must configure Postman to use Bearer Token authentication with your token variables

6. Token Handling:
   - The collection's test scripts store raw JWT tokens in environment variables
   - You need to configure Postman to add the required "Bearer " prefix by:
     - Setting the Authorization type to "Bearer Token" at the collection or request level, OR
     - Manually adding "Bearer " before the token variable in Authorization headers
   - See the [Token Handling Guide](./_docs/postman-token-scripts.md) for detailed instructions

## Authentication

The API uses JWT tokens for authentication. To obtain a token, use the login endpoint:

```
POST /api/auth/login
```

### User Credentials

Two user accounts are available for testing:

- **Admin User**:
  - Email: `admin@legaltech.com`
  - Password: `admin123`
  - Has full access to all endpoints

- **Attorney User**:
  - Email: `attorney@legaltech.com`
  - Password: `attorney123`
  - Has restricted access to certain endpoints

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login to obtain JWT token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Cases
- `GET /api/cases` - Get all cases (paginated)
- `GET /api/cases/:id` - Get case by ID
- `POST /api/cases` - Create new case (Admin & Attorney)
- `PUT /api/cases/:id` - Update case (Admin & Attorney)
- `DELETE /api/cases/:id` - Delete case (Admin only)

### Documents
- `GET /api/documents` - Get all documents (paginated)
- `GET /api/documents/:id` - Get document by ID
- `POST /api/documents` - Create new document (Admin & Attorney)
- `PUT /api/documents/:id` - Update document (Admin & Attorney)
- `DELETE /api/documents/:id` - Delete document (Admin only)

### Time Entries
- `GET /api/time-entries` - Get all time entries (paginated)
- `GET /api/time-entries/:id` - Get time entry by ID
- `POST /api/time-entries` - Create new time entry (Admin & Attorney)
- `PUT /api/time-entries/:id` - Update time entry (Admin & Attorney)
- `DELETE /api/time-entries/:id` - Delete time entry (Admin only)

## Project Implementation Details

This project was implemented as a challenge to create a RESTful API for a legal practice management system with a focus on architecture, security, and API design.

### Core Features Implementation

#### 1. Case Management
- **Data Model**: Cases include title, description, status (OPEN, CLOSED, PENDING), and relationship to a user
- **Advanced Features**:
  - Filter cases by status and user
  - Pagination support with customizable page size
  - Sorting capabilities
  - Role-based access control (attorneys can only create/update, admin can also delete)

#### 2. Time Tracking
- **Data Model**: Time entries with description, start/end times, billable flag, hourly rate, and relationships to both user and case
- **Advanced Features**:
  - Filter by date ranges, billable status, user, and case
  - Automatic calculation of duration when both start and end times are provided
  - Comprehensive querying options for reporting needs

#### 3. Document Metadata
- **Data Model**: Document records with title, description, file type, file size, and relationship to a case
- **Advanced Features**:
  - Filter by file type and associated case
  - Metadata-only storage with proper indexing for efficient retrieval
  - CRUD operations with proper validation

#### 4. User Management
- **Data Model**: Users with email, password (hashed), name, and role (ADMIN, ATTORNEY)
- **Advanced Features**:
  - Secure password handling with bcrypt
  - Role-based access control throughout the application
  - Email uniqueness validation

### Technical Implementation Highlights

#### Data Layer Simulation
- Created Prisma schema files to demonstrate database modeling knowledge
- Implemented an in-memory data store that simulates Prisma ORM behavior
- Built a service layer that provides Prisma-like query methods:
  - Support for filtering with `where` conditions
  - Pagination with `skip` and `take` parameters
  - Data selection with `select` parameters
  - Relationship inclusion with `include` parameters

#### Authentication & Authorization
- JWT-based authentication with token generation and validation
- Role-based authorization using custom guards and decorators
- Protected routes based on user roles
- Pre-seeded users with different permission levels

#### API Design
- RESTful endpoints following best practices
- Proper HTTP status codes for different scenarios
- Comprehensive request validation
- Structured error responses
- Pagination headers for list endpoints

#### Testing
- Unit tests for core services and controllers
- Mock repositories for testing service layer in isolation
- Authentication and authorization testing
- Shared mock data across tests for consistency

### Key Technical Challenges Solved

1. **In-Memory Database with Relationships**: Implemented a sophisticated in-memory data layer that maintains entity relationships similar to a real database
2. **Role-Based Authorization**: Created a flexible permissions system that restricts access based on user roles
3. **Query Parameter Handling**: Built robust parsing and validation of query parameters for filtering, pagination, and sorting
4. **Error Handling**: Implemented consistent error responses with appropriate HTTP status codes
5. **Data Validation**: Created comprehensive validation rules for all input data

## Technical Decisions & Architecture

### Data Layer Simulation

Since the challenge required simulating a database with in-memory storage, the project uses a `PrismaService` that mimics the Prisma Client API. This service:

- Maintains in-memory arrays for each entity (users, cases, documents, time entries)
- Implements repository pattern methods (findMany, findUnique, create, update, delete)
- Supports simulated Prisma features like filtering, pagination, and relationships

### Authentication & Authorization

- JWT tokens are used for authentication
- Role-based authorization is implemented via guards
- Two roles (ADMIN, ATTORNEY) with different permissions

### Code Organization

- **Modular structure**: Each feature has its own module
- **Clean separation of concerns**: Controllers, services, interfaces
- **Repository pattern**: Services interact with the data layer through the simulated Prisma service
- **Decorator-based permissions**: Uses custom decorators for role-based access control

### Testing

- Unit tests cover core functionality
- Mocking used for dependencies like Prisma service

## Running Tests

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:cov
```

## Data Model Research

The data models in this application were developed based on industry research and best practices for legal practice management systems. For detailed information on the research process, references, and justification for field selection, please see the [Data Model Research & References](./_docs/data-model-research.md) document.

## CI/CD Pipeline

This project includes a GitHub Actions CI/CD pipeline that automatically:

1. Installs dependencies
2. Verifies TypeScript compilation
3. Checks for linting issues
4. Validates code formatting with Prettier
5. Builds the project
6. Runs tests with coverage reporting

The pipeline runs on every push to the main branch and on all pull requests.

To view the pipeline configuration, see the [GitHub Actions workflow file](./.github/workflows/ci.yml).

## License

This project is [MIT licensed](LICENSE).
