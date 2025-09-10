# 🚂 Train Ticket Graph API

A Node.js/Express API for analyzing service dependencies and paths in microservice architectures. This application provides graph-based analysis of service relationships, path finding, and filtering capabilities for the Train Ticket microservices system.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Frontend Visualization](#frontend-visualization)
- [Development](#development)
- [Project Structure](#project-structure)

## ✨ Features

- **Graph Analysis**: Load and analyze service dependency graphs
- **Path Finding**: Find all possible paths between services
- **Filtering**: Apply filters to paths (public services, vulnerabilities, sinks)
- **Visualization**: Interactive web-based graph visualization
- **Environment Configuration**: Configurable via environment variables
- **TypeScript**: Full TypeScript support with type safety
- **Validation**: Input validation and error handling

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd train-graph-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` by default.

## ⚙️ Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Graph Data Configuration
GRAPH_FILE_PATH=./src/data/train-ticket-be.json

# API Configuration
API_PREFIX=/api

# Logging Configuration
LOG_LEVEL=info
```

### Available Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment mode |
| `GRAPH_FILE_PATH` | ./src/data/train-ticket-be.json | Path to graph data file |
| `API_PREFIX` | /api | API route prefix |
| `LOG_LEVEL` | info | Logging level |

## 🔗 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Find Paths Between Services

**GET** `/paths`

Find all paths between two services with optional filtering.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `start` | string | Yes | Starting service name |
| `end` | string | Yes | Ending service name |
| `filters` | string | No | Comma-separated filter names |

#### Available Filters

- `public` - Routes starting at public-exposed services
- `sink` - Routes ending in database sinks
- `vulnerability` - Routes touching vulnerable services

#### Example Requests

```bash
# Basic path finding
GET /api/paths?frontend&end=prod-postgresdb

# With filters
GET /api/paths?frontend&end=prod-postgresdb&filters=public,sink

# Find vulnerable paths
GET /api/paths?frontend&end=prod-postgresdb&filters=vulnerability
```

#### Response Format

```json
{
  "nodes": [
    {
      "name": "frontend",
      "kind": "service",
      "language": "java",
      "path": "train-ticket/frontend",
      "publicExposed": true,
      "vulnerabilities": []
    }
  ],
  "edges": [
    {
      "from": "frontend",
      "to": "gateway-service"
    }
  ]
}
```

### 2. Get Available Filters

**GET** `/filters`

Get list of available filters with descriptions.

#### Response Format

```json
{
  "filters": [
    {
      "id": "public",
      "description": "Routes starting at a public-exposed service"
    },
    {
      "id": "sink", 
      "description": "Routes ending in a sink (rds/sql/db)"
    },
    {
      "id": "vulnerability",
      "description": "Routes touching a node with known vulnerabilities"
    }
  ]
}
```

## 💡 Usage Examples

### 1. Find All Paths from Frontend to Database

```bash
curl "http://localhost:3000/api/paths?start=frontend&end=prod-postgresdb"
```

### 2. Find Only Public Routes to Vulnerable Services

```bash
curl "http://localhost:3000/api/paths?start=frontend&end=prod-postgresdb&filters=public,vulnerability"
```

### 3. Get Available Filters

```bash
curl "http://localhost:3000/api/filters"
```

### 4. JavaScript/Node.js Example

```javascript
const fetch = require('node-fetch');

async function findPaths(start, end, filters = []) {
  const filterParam = filters.length > 0 ? `&filters=${filters.join(',')}` : '';
  const url = `http://localhost:3000/api/paths?start=${start}&end=${end}${filterParam}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  console.log(`Found ${data.nodes.length} nodes and ${data.edges.length} edges`);
  return data;
}

// Usage
findPaths('frontend', 'database', ['public', 'sink'])
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));
```

## 🎨 Frontend Visualization

The application includes a web-based visualization interface accessible at:

```
http://localhost:3000/
```

### Features

- **Interactive Graph**: Zoom, pan, and explore the service graph
- **Dynamic Parameters**: Pass query parameters via URL
- **Color Coding**: 
  - 🔵 Blue: Public services
  - 🔴 Red: Vulnerable services  
  - 🟢 Green: Database services
  - 🟠 Orange: Other services
- **Comprehensive Node Info**: Hover to see detailed service information

### URL Parameters

- `start` - Starting service name
- `end` - Ending service name  
- `filters` - Comma-separated filter names

#### Example URLs

```
# Basic visualization
http://localhost:3000/?start=frontend&end=prod-postgresdb

# With filters
http://localhost:3000/?start=frontend&end=prod-postgresdb&filters=public,sink

# Find vulnerable paths
http://localhost:3000/?start=frontend&end=prod-postgresdb&filters=vulnerability
```

### Using the Graph Visualization

The `index.html` file provides an interactive graph visualization that automatically reads query parameters from the URL and displays the corresponding service paths.

#### How it works:

1. **URL Parameter Reading**: The page reads `start`, `end`, and `filters` from the URL query string
2. **API Call**: Makes a request to `/api/paths` with the extracted parameters
3. **Graph Rendering**: Uses Cytoscape.js to render an interactive graph
4. **Dynamic Updates**: Change URL parameters to see different graph views

#### Example Usage:

```html
<!-- Open in browser with these URLs -->

<!-- Basic path visualization -->
http://localhost:3000/?start=frontend&end=prod-postgresdb

<!-- Public routes only -->
http://localhost:3000/?start=frontend&end=prod-postgresdb&filters=public

<!-- Vulnerable paths -->
http://localhost:3000/?start=frontend&end=prod-postgresdb&filters=vulnerability

<!-- Multiple filters -->
http://localhost:3000/?start=frontend&end=prod-postgresdb&filters=public,sink
```

#### Node Information Display:

Each node in the graph shows:
- **Service Name** (prominently displayed)
- **Kind**: Service type (service, rds, etc.)
- **Language**: Programming language
- **Path**: File path (filename only)
- **Public**: Whether publicly exposed
- **Vulnerabilities**: Count of security issues
- **Metadata**: Engine, version, cloud provider info

#### Color Legend:

- 🔵 **Light Blue**: Public services (`publicExposed: true`)
- 🔴 **Red**: Services with vulnerabilities
- 🟢 **Green**: Database services (rds/database)
- 🟠 **Orange**: Other services

#### Interactive Features:

- **Zoom**: Mouse wheel or pinch to zoom
- **Pan**: Click and drag to move around
- **Node Details**: Hover over nodes for detailed information
- **Layout**: Automatic breadth-first layout with directed edges

## 🛠️ Development

### Available Scripts

```bash
# Build TypeScript
npm run build

# Start production server
npm start

# Development with auto-reload
npm run dev

# Debug compiled JavaScript
npm run debug

# Debug TypeScript directly
npm run debug:ts
```

### Debugging

The application supports VS Code debugging with configurations in `.vscode/launch.json`:

- **Debug API Server** - Debug compiled JavaScript
- **Debug API Server (TypeScript)** - Debug TypeScript directly
- **Attach to Running Server** - Attach to running process

### Project Structure

```
src/
├── config/           # Configuration management
│   └── index.ts
├── data/            # Graph data files
│   └── train-ticket-be.json
├── filters/         # Path filtering logic
│   └── index.ts
├── routes/          # API route handlers
│   └── graph.route.ts
├── services/        # Business logic
│   └── graph.service.ts
├── types/           # TypeScript type definitions
│   ├── error.types.ts
│   └── graph.types.ts
├── validation/      # Input validation
│   └── graph.validation.ts
└── index.ts         # Application entry point

public/
└── index.html       # Frontend visualization

.vscode/
├── launch.json      # Debug configurations
└── tasks.json       # Build tasks
```

### Key Components

- **GraphService**: Handles graph loading, path finding, and filtering
- **Validation**: Input validation and sanitization
- **Filters**: Path filtering logic (public, sink, vulnerability)
- **Configuration**: Environment-based configuration management

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in .env file
   PORT=3001
   ```

2. **Graph file not found**
   ```bash
   # Check GRAPH_FILE_PATH in .env
   GRAPH_FILE_PATH=./src/data/train-ticket-be.json
   ```

3. **No paths found**
   - Verify service names exist in the graph data
   - Check if there are actual connections between services

### Error Responses

```json
{
  "error": "No paths found from frontend to invalid-service"
}
```

```json
{
  "errors": [
    {
      "msg": "Start node must be a non-empty string",
      "param": "start",
      "location": "query"
    }
  ]
}
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions, please create an issue in the repository.