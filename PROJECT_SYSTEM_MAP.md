# EBITDA Calculator System Map

## Overview
The EBITDA Calculator is a comprehensive financial modeling system with role-based access control, approval workflows, and real-time alerting. This document provides a complete technical overview of the system architecture.

## System Architecture

### Frontend (Client-Side)
- **Technology Stack**: Vanilla JavaScript, HTML5, CSS3
- **Entry Point**: `index.html`
- **Main Dashboard**: `src/ui/dashboard/dashboard.html`

### Backend (Server-Side)
- **Technology Stack**: Node.js, Express.js, PostgreSQL
- **API Server**: `backend/server.js`
- **Database**: PostgreSQL with connection pooling
- **Environment**: Configured via `.env` file

## Module Structure

### 1. Core Modules (`src/core/`)

#### Finance Engine (`finance-engine.js`)
- **Purpose**: Core financial calculations and EBITDA computations
- **Key Functions**:
  - `calculateEBITDA(data)`: Main EBITDA calculation
  - `calculateRevenue(data)`: Revenue calculations
  - `calculateExpenses(data)`: Expense calculations
  - `calculateDepreciation(data)`: Depreciation calculations

#### Validation Engine (`validation.js`)
- **Purpose**: Input validation and business rule enforcement
- **Key Functions**:
  - `validateFinancialData(data)`: Validates financial inputs
  - `validateScenario(data)`: Scenario validation rules
  - `sanitizeInput(input)`: Input sanitization

#### Variance Engine (`variance-engine.js`)
- **Purpose**: Variance analysis and comparison calculations
- **Key Functions**:
  - `calculateVariance(actual, forecast)`: Variance calculation
  - `generateVarianceReport(scenarios)`: Variance reporting

### 2. Controllers (`src/controllers/`)

#### Calculator Controller (`calculator.js`)
- **Purpose**: Main calculation orchestration
- **Key Functions**:
  - `calculate(data)`: Main calculation entry point
  - `toggleLock()`: Formula lock/unlock (admin only)
  - `calculateAll(data, isForecastMode)`: Comprehensive calculations

#### Import Controller (`import-controller.js`)
- **Purpose**: Data import and file processing
- **Key Functions**:
  - `importFromFile(file)`: File import handling
  - `validateImport(data)`: Import validation
  - `processImportData(data)`: Data processing

#### Scenario Controller (`scenario-controller.js`)
- **Purpose**: Scenario management and lifecycle
- **Key Functions**:
  - `createScenario(data)`: Scenario creation
  - `updateScenario(id, data)`: Scenario updates
  - `submitScenario(id)`: Scenario submission for approval
  - `approveScenario(id, userId, comment)`: Scenario approval
  - `rejectScenario(id, userId, comment)`: Scenario rejection

### 3. Services (`src/services/`)

#### Alert Service (`alert-service.js`)
- **Purpose**: Real-time alerting and notifications
- **Key Functions**:
  - `checkAlerts(data)`: Alert condition checking
  - `sendAlert(alert)`: Alert delivery
  - `getAlertHistory()`: Alert history retrieval

#### Approval Service (`approval-service.js`)
- **Purpose**: Approval workflow management
- **Key Functions**:
  - `getPendingCount()`: Pending approval count
  - `getPendingApprovals()`: Pending approval list
  - `submit(id)`: Submit for approval
  - `approve(id, userId, comment)`: Approve scenario
  - `reject(id, userId, comment)`: Reject scenario

#### Role Service (`role-service.js`)
- **Purpose**: Role-based access control
- **Roles**: ADMIN, ANALYST, VIEWER
- **Key Functions**:
  - `isAdmin()`: Admin role check
  - `isAnalyst()`: Analyst role check
  - `isViewer()`: Viewer role check
  - `canRunWhatIf()`: What-if analysis permission

#### Formula Lock Service (`formula-lock.js`)
- **Purpose**: Formula modification control
- **Security**: Admin-only unlock capability
- **Key Functions**:
  - `toggle()`: Toggle formula lock (admin only)
  - `isLocked()`: Check lock status
  - `canUnlock()`: Check unlock permission

#### Storage Service (`storage.js`)
- **Purpose**: Local data persistence and caching
- **Key Functions**:
  - `save(key, data)`: Save data
  - `load(key)`: Load data
  - `clear()`: Clear storage

#### Forecast Service (`forecast-service.js`)
- **Purpose**: Financial forecasting and projections
- **Key Functions**:
  - `generateForecast(data)`: Generate forecasts
  - `validateForecast(data)`: Forecast validation

#### Portfolio Service (`portfolio.js`)
- **Purpose**: Portfolio management and aggregation
- **Key Functions**:
  - `aggregatePortfolios(data)`: Portfolio aggregation
  - `calculatePortfolioMetrics(data)`: Portfolio metrics

### 4. UI Components (`src/ui/`)

#### Dashboard UI (`dashboard/`)
- **dashboard.html**: Main dashboard interface
- **dashboard.js**: Dashboard functionality and interactions
- **dashboard.css**: Dashboard styling

#### Alert Styling (`alert-styling.js`)
- **Purpose**: Alert visual presentation and animations

#### Dashboard UI (`dashboard-ui.js`)
- **Purpose**: Dashboard component management and rendering

#### Audit UI (`audit-ui.js`)
- **Purpose**: Audit trail interface and reporting

### 5. Backend Routes (`backend/routes/`)

#### Scenario Routes (`scenario.js`)
- **Endpoints**:
  - `POST /api/scenario/create`: Create new scenario
  - `PUT /api/scenario/update`: Update scenario
  - `POST /api/scenario/submit`: Submit for approval
  - `POST /api/scenario/approve`: Approve scenario
  - `POST /api/scenario/reject`: Reject scenario
  - `GET /api/scenario/all`: Get all scenarios
  - `GET /api/scenario/:id`: Get specific scenario

#### User Routes (`user.js`)
- **Endpoints**:
  - `POST /api/user/login`: User authentication
  - `GET /api/user/profile`: User profile
  - `PUT /api/user/profile`: Update profile

### 6. Database Schema (`backend/db/`)

#### Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

**scenarios**
```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY,
  name TEXT,
  property TEXT,
  owner_id UUID,
  status TEXT DEFAULT 'DRAFT',
  approved_by UUID,
  approved_at TIMESTAMP,
  approval_comment TEXT,
  scenario_type TEXT DEFAULT 'ACTUAL',
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

**scenario_versions**
```sql
CREATE TABLE scenario_versions (
  id UUID PRIMARY KEY,
  scenario_id UUID,
  version_no INT,
  inputs JSONB,
  results JSONB,
  audit JSONB,
  created_at TIMESTAMP DEFAULT now()
);
```

## Role Model

### ADMIN
- **Permissions**: Full system access
- **Capabilities**:
  - Approve/reject scenarios
  - Unlock/lock formulas
  - Override alerts
  - Access system health
  - Export MIS reports
  - Manage users

### ANALYST
- **Permissions**: Financial analysis and scenario management
- **Capabilities**:
  - Create and edit scenarios
  - Run what-if analysis
  - Submit scenarios for approval
  - View reports and dashboards
  - Receive alerts

### VIEWER
- **Permissions**: Read-only access
- **Capabilities**:
  - View approved scenarios
  - Access dashboards and reports
  - Receive alerts
  - No editing capabilities

## Approval Flow

1. **Scenario Creation**: Analyst creates scenario
2. **Scenario Validation**: System validates data and rules
3. **Scenario Submission**: Analyst submits for approval
4. **Approval Queue**: Scenario enters pending approval queue
5. **Admin Review**: Admin reviews scenario details
6. **Decision**: Admin approves or rejects with comments
7. **Notification**: System notifies analyst of decision
8. **Audit Trail**: All actions logged for audit purposes

## Alert Flow

1. **Data Monitoring**: System continuously monitors financial data
2. **Rule Evaluation**: Alert rules evaluated in real-time
3. **Alert Generation**: Alerts generated when thresholds breached
4. **Severity Classification**: Alerts classified by severity (Low, Medium, High, Critical)
5. **Notification Delivery**: Alerts sent to relevant users
6. **Alert Acknowledgment**: Users can acknowledge and resolve alerts
7. **Historical Tracking**: All alerts logged for analysis

## Configuration

### Environment Variables (`.env`)
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ebitda_calculator
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# Server Configuration
PORT=4001
NODE_ENV=development
API_URL=http://localhost:4001

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Alert Rules (`config/alert-rules.js`)
- **Revenue Variance**: ±10% threshold
- **Expense Variance**: ±15% threshold
- **EBITDA Margin**: Below 20% warning
- **Custom Rules**: Configurable per business needs

## Security Features

### Production Safety Switches
1. **Environment Variables**: No hardcoded credentials
2. **CORS Restrictions**: Limited to allowed origins only
3. **Role-Based Access**: Strict permission enforcement
4. **Formula Lock**: Admin-only formula modification
5. **Approval Required**: Mandatory approval for scenario changes
6. **Audit Trail**: Complete action logging

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure password handling
- Encrypted data transmission

## API Endpoints

### Health Check
- `GET /health`: System health status

### Scenario Management
- `POST /api/scenario/create`: Create scenario
- `PUT /api/scenario/update`: Update scenario
- `POST /api/scenario/submit`: Submit for approval
- `POST /api/scenario/approve`: Approve scenario
- `POST /api/scenario/reject`: Reject scenario
- `GET /api/scenario/all`: List all scenarios
- `GET /api/scenario/:id`: Get scenario details

### User Management
- `POST /api/user/login`: User authentication
- `GET /api/user/profile`: User profile
- `PUT /api/user/profile`: Update profile

## Testing

### Unit Tests (`tests/unit/`)
- Dashboard tests
- Diff analysis tests
- Executive reporting tests
- Financial calculation tests

### Integration Tests (`tests/integration/`)
- API endpoint tests
- Database integration tests
- Workflow tests

### E2E Tests (`tests/e2e/`)
- Complete user journey tests
- Cross-browser compatibility tests

## Deployment

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Modern web browser

### Setup Steps
1. Install dependencies: `npm install`
2. Configure environment: Update `.env` file
3. Setup database: Run `schema.sql`
4. Start server: `npm start`
5. Access application: Open `index.html`

### Production Considerations
- Use HTTPS in production
- Configure proper database credentials
- Set up backup and recovery
- Monitor system health
- Regular security updates

## Monitoring and Maintenance

### System Health
- Database connection monitoring
- API response time tracking
- Error rate monitoring
- Resource usage tracking

### Backup Strategy
- Daily database backups
- Configuration backups
- Log rotation and archival

### Performance Optimization
- Database query optimization
- Frontend asset optimization
- Caching strategies
- Load balancing (if needed)

---

**Document Version**: 1.0  
**Last Updated**: 2025-02-05  
**Maintainer**: Development Team
