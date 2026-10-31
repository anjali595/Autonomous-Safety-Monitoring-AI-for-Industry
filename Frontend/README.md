# 🛡️ IndustrialGuard AI

### AI-Powered Proactive Industrial Safety Monitoring & Risk Intelligence Platform

> **Project Status:** 🟡 Pre-Development / Ideation & Design Stage  
> **Type:** B.Tech CSE Mini-Project  
> **Team:** Anjali Kumari & Abhay Singh  
> **Institution:** GLA University, Mathura  
> **Team Number:** 125  
> **Mentor:** Sir Govind Gupta

---

## 📌 Project Overview

**IndustrialGuard AI** is a proposed AI-powered industrial safety monitoring platform designed to help safety teams identify potentially unsafe conditions earlier and manage safety events through a unified digital workflow.

The idea is to combine **environmental sensor data** and **computer-vision events** into a single safety-intelligence pipeline.

Instead of relying on isolated CCTV observations, sensor readings, manual inspections, and incident records, IndustrialGuard AI is designed to connect these signals and produce:

- Real-time safety status
- Risk classification
- Safety alerts
- Incident records
- Incident review and resolution
- Historical safety analytics

### Core idea

**Capture → Validate → Process → Detect → Fuse Signals → Score Risk → Alert / Log Incident → Analyse & Learn**

The project is currently a **planned architecture and development roadmap**. The implementation has **not yet been completed**. This README will be updated as development progresses.

---

# 🎯 Problem We Are Solving

Industrial safety information is often fragmented across:

- CCTV systems
- Environmental sensors
- Manual inspections
- Safety logs
- Incident records

This creates several challenges:

1. **Delayed hazard awareness** — unsafe conditions may develop before a responsible person notices them.
2. **Disconnected safety signals** — camera events and environmental readings may be viewed independently instead of together.
3. **Reactive workflows** — teams may focus on responding to incidents instead of identifying leading indicators early.
4. **Limited historical intelligence** — previously recorded incidents may not be converted into useful trends, hotspots, or preventive insights.

### Our proposed direction

IndustrialGuard AI aims to create an **intelligence layer** that connects these sources and supports human safety decision-making.

---

# 💡 Proposed Solution

IndustrialGuard AI will combine two primary intelligence streams.

### 1. Environmental Intelligence

The prototype is planned to monitor signals such as:

- Temperature
- Humidity
- Gas
- Smoke

These readings can initially come from simulated data and may later be connected to an **ESP32 + low-cost sensors** for a physical demonstration.

### 2. Computer Vision Intelligence

A focused computer-vision MVP is planned for selected PPE scenarios, such as:

- Safety helmet detection
- Safety vest detection

The vision component will analyse representative images/video and convert detections into safety events.

### 3. Risk Fusion

Outputs from sensor analysis and computer vision will be combined by a **Risk Fusion Engine**.

Example:

```text
High Gas Risk
      +
High Temperature Risk
      +
Helmet Missing
      ↓
 Risk Fusion Engine
      ↓
Overall Risk Assessment
      ↓
SAFE / WARNING / CRITICAL
```

The fusion layer is intended to provide a unified view instead of treating every signal as an unrelated alert.

---

# 🧭 Project Scope

## ✅ In Scope for the MVP

- User and site setup
- Role-based access
- Environmental sensor ingestion
- Sensor validation
- Real-time dashboard
- Sensor trend visualisation
- ML-based risk classification
- Selected PPE computer-vision detection
- Multi-signal risk fusion
- Real-time alerts
- Incident creation
- Incident review and resolution
- Incident history
- Basic safety analytics

## ❌ Out of Scope for v1

- Direct PLC control
- Machine emergency-stop control
- Fully autonomous industrial control
- Facial recognition / biometric identification
- Large-scale predictive maintenance
- Native mobile application
- Multi-site enterprise orchestration
- Safety certification
- Autonomous emergency response

These boundaries are intentional so that the academic prototype remains technically achievable and safe.

---

# 🏗️ Planned System Architecture

```text
                    INDUSTRIAL SITE
                          │
             ┌────────────┴────────────┐
             │                         │
        IoT Sensors                CCTV / Video
             │                         │
             ▼                         ▼
      Data Ingestion Layer       Computer Vision Layer
      FastAPI + WebSockets       PPE / Safety Detection
             │                         │
             ▼                         ▼
       Data Validation            Vision Events
             │                         │
             ▼                         │
      Feature Processing               │
             │                         │
             ▼                         │
        ML Risk Engine                 │
       Random Forest                   │
             │                         │
             └────────────┬────────────┘
                          ▼
                 RISK FUSION ENGINE
                          │
                          ▼
                    RISK SCORE
                          │
               SAFE / WARNING / CRITICAL
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        Alert / Response          Incident Service
              │                       │
              └───────────┬───────────┘
                          ▼
                     Operational DB
                          │
                          ▼
                   React Dashboard
                          │
                          ▼
                  Analytics & Reports
```

### Architectural principles

- Modular
- API-driven
- Near-real-time
- Explainable
- Testable
- Scalable in design
- Hardware-independent at the prototype level

---

# 🔄 End-to-End Workflow

```text
Capture
  ↓
Validate
  ↓
Extract Features / Process
  ↓
Detect
  ↓
Fuse Signals
  ↓
Score Risk
  ↓
Alert / Log Incident
  ↓
Analyse & Learn
```

A more complete lifecycle is:

```text
Capture
→ Validate
→ Process
→ Score
→ Alert
→ Incident
→ Review
→ Resolve
→ Retain / Delete
```

### Example

A possible future prototype scenario:

```text
Sensor:
Gas level rises

        +
        
Camera:
Worker without helmet

        ↓

Backend validates incoming data

        ↓

ML + Computer Vision

        ↓

Risk Fusion

        ↓

High / Critical risk

        ↓

Alert generated

        ↓

Incident created

        ↓

Supervisor reviews and records action

        ↓

Incident resolved
```

---

# 🤖 AI / ML Approach

## Sensor Risk Classification

The initial ML approach is a **Random Forest baseline classifier**.

### Planned pipeline

```text
Raw Sensor Data
      ↓
Validation
      ↓
Data Cleaning
      ↓
Feature Engineering
      ↓
Train / Validation / Test Split
      ↓
Baseline Model Comparison
      ↓
Random Forest
      ↓
Risk Classification
```

### Planned input features

Examples include:

- Temperature
- Humidity
- Gas level
- Smoke level
- Sensor changes over time
- Rolling or derived features where useful

### Planned output

```text
SAFE
WARNING
CRITICAL
```

### Evaluation

The model will be evaluated using:

- Precision
- Recall
- F1-score
- Confusion Matrix

Accuracy alone will not be used as the only success measure.

---

# 👁️ Computer Vision Approach

The first computer-vision MVP is intentionally focused on selected PPE scenarios.

### Planned flow

```text
Camera / Sample Video
        ↓
Frame Processing
        ↓
Object Detection
        ↓
Helmet / Vest Event
        ↓
Confidence + Metadata
        ↓
Risk Fusion
```

The CV component will be evaluated separately for detection quality and inference behaviour.

---

# 🧠 Risk Fusion Engine

The Risk Fusion Engine is the **decision layer** that combines multiple safety signals.

It is not necessarily another ML model.

For the MVP, it may use:

- Rules
- Thresholds
- Confidence scores
- Weighted signals

### Example

```text
Sensor Risk       = HIGH
Temperature Risk  = MEDIUM
PPE Risk          = HIGH

             ↓

       Risk Fusion

             ↓

      Overall Risk
          = CRITICAL
```

The exact thresholds and weighting strategy will be validated during development and testing.

---

# 🖥️ Planned User Experience

IndustrialGuard AI is designed around three main user roles.

### 👷 Safety Officer

Needs:

- Live safety status
- Active alerts
- Incident details
- Follow-up actions
- Safety trends

### 🦺 Shift Supervisor

Needs:

- Fast alerts
- Event context
- Local verification
- Action notes
- Incident closure / escalation

### 🏭 Plant Manager

Needs:

- Safety trends
- Hotspots
- Resolution metrics
- Long-term safety insights

---

# 🔔 Alert vs Incident

These two concepts are intentionally different.

### Alert

A notification that something requires attention.

```text
🚨 HIGH GAS LEVEL DETECTED
```

### Incident

A tracked safety event containing context and workflow information.

```text
Incident ID: INC-001
Severity: CRITICAL
Source: Gas Sensor + CCTV
Location: Zone A
Time: 11:42 AM
Status: Open
```

An incident can then be:

```text
Open → Review → Assign → Resolve
```

---

# 🔧 Planned Technology Stack

### Frontend

- React.js
- Tailwind CSS
- Recharts

### Backend

- Python
- FastAPI
- Uvicorn
- WebSockets

### AI / ML

- Scikit-learn
- Random Forest
- Pandas
- NumPy
- Joblib

### Computer Vision

- OpenCV
- Selected object-detection / CV model

### Database

- SQLite for the prototype
- PostgreSQL-ready relational design for future scale-up

### Optional Hardware

- ESP32
- MQ-series gas/smoke sensors
- DHT22 or equivalent environmental sensor

### Development

- Git
- GitHub
- Python virtual environment

> **Note:** The stack describes the planned implementation. Components may be refined during development based on dataset availability, testing results, and project constraints.

---

# 🔐 Security & Privacy by Design

Because the system may process workplace and camera-related information, privacy and security are part of the architecture.

### Planned controls

- Authentication
- Role-Based Access Control (RBAC)
- Least-privilege access
- Input validation
- Secure secret management
- Audit logging
- Minimal data retention
- Access-controlled incident evidence
- No biometric identification

### Security principle

> **Collect only what is necessary, protect what is collected, and avoid retaining raw data unnecessarily.**

Raw video retention is not required for the core safety workflow and will be minimised where practical.

---

# 🗃️ Planned Data Model

Core entities planned for the MVP:

```text
User
Site
Sensor
SensorReading
VisionEvent
RiskAssessment
Incident
Alert
AuditLog
```

Conceptually:

```text
Site
 ├── Sensors
 │    └── SensorReadings
 │
 ├── Vision Events
 │
 ├── Risk Assessments
 │
 ├── Incidents
 │     └── Alerts / Actions
 │
 └── Audit Logs
```

The exact field-level schema will be finalised during implementation.

---

# 🌐 Planned Backend Communication

The backend will expose APIs for areas such as:

- Sensor ingestion
- Risk prediction
- Vision events
- Incident management
- Analytics

### Communication model

```text
React Dashboard
      │
      ├── REST API ───────────► FastAPI
      │
      └── WebSocket ◄────────── FastAPI
                                │
                      ┌─────────┼─────────┐
                      ▼         ▼         ▼
                     ML        CV      Database
```

### Why WebSockets?

WebSockets are planned for near-real-time updates such as:

- Risk changes
- Sensor status
- New alerts
- Incident events

The exact endpoint structure will be finalised during implementation.

---

# 📊 Planned Dashboard

The planned dashboard will provide a unified safety view.

Potential sections:

### Live Status

- Overall site safety state
- Risk score
- Current sensor values
- Active visual events

### Alerts

- Severity
- Source
- Timestamp
- Location

### Incidents

- Open incidents
- Assigned incidents
- Resolved incidents
- Incident history

### Analytics

- Risk trends
- Hazard frequency
- Hotspots
- Resolution status

The dashboard UI will be implemented after the backend and data flow are validated.

---

# 🧪 Testing & Evaluation Plan

The project will be evaluated at multiple levels.

## ML Testing

- Train/validation/test split
- Precision
- Recall
- F1-score
- Confusion matrix
- Baseline comparison

## Computer Vision Testing

- Precision
- Recall
- False positives
- False negatives
- Inference behaviour

## Backend Testing

- Unit testing
- Integration testing
- API validation
- Input validation
- Error handling

## Frontend Testing

- Core user journeys
- Dashboard updates
- Alert workflows
- Incident workflows

## End-to-End Testing

The complete path should work:

```text
Data
→ Prediction
→ Risk Fusion
→ Alert
→ Incident
→ Review / Resolution
```

---

# 📈 Proposed MVP Success Metrics

These are **project targets**, not completed results.

| Area | Planned Target |
|---|---|
| Sensor ingestion | ≥95% valid records accepted without manual correction |
| API performance | p95 ≤ 1000 ms for standard requests |
| Event response | ≤3 seconds under prototype conditions |
| Model evaluation | Report precision, recall, F1 and confusion matrix |
| CV evaluation | Report precision, recall and inference behaviour |
| Reliability | No unresolved critical defects before submission |
| Traceability | Incidents contain timestamp, source, severity and resolution state |

These targets will be measured only after implementation.

---

# 🚀 Development Roadmap

## Phase 1 — Requirements & Research

- Finalise scope
- Research datasets
- Study competitor approaches
- Finalise architecture
- Define user workflows

## Phase 2 — Data & Baseline ML

- Prepare representative sensor dataset
- Build preprocessing pipeline
- Train baseline models
- Evaluate Random Forest
- Finalise risk-classification approach

## Phase 3 — Backend Foundation

- Build FastAPI application
- Implement ingestion
- Implement validation
- Connect database
- Create prediction service

## Phase 4 — Computer Vision

- Select PPE dataset/model
- Build detection pipeline
- Generate vision events
- Evaluate selected scenario

## Phase 5 — Risk Fusion & Incidents

- Implement fusion logic
- Implement risk states
- Implement alerts
- Implement incident lifecycle

## Phase 6 — Frontend

- Build React dashboard
- Connect REST APIs
- Add WebSocket updates
- Add alerts and incident views
- Add analytics

## Phase 7 — Integration & Testing

- End-to-end integration
- Performance testing
- Security checks
- Model evaluation
- Bug fixing

## Phase 8 — Demonstration & Documentation

- Controlled prototype demonstration
- Final evaluation
- Documentation
- Presentation
- Future roadmap

---

# 🗓️ Current Project Status

### Current stage: 🟡 Pre-Development

### Completed / Established

- Problem definition
- Project scope
- Market research
- Competitor analysis
- Gap analysis
- Proposed solution
- Architecture design
- User workflows
- MVP boundary
- Technology stack
- Testing strategy
- Security/privacy approach
- Mentor-approved synopsis

### Not yet completed

- Production implementation
- Final ML model
- Final CV model
- Final database implementation
- Final dashboard
- Hardware integration
- Performance results
- Deployment
- Pilot validation

> This README intentionally does **not** claim completed functionality or measured model performance.

---

# 📁 Planned Repository Structure

The repository structure will evolve during implementation. A possible structure is:

```text
IndustrialGuard-AI/
│
├── README.md
│
├── documentation/
│   ├── synopsis/
│   ├── architecture/
│   └── research/
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── services/
│   ├── models/
│   └── tests/
│
├── ml/
│   ├── data/
│   ├── notebooks/
│   ├── preprocessing/
│   ├── training/
│   └── models/
│
├── computer-vision/
│   ├── datasets/
│   ├── inference/
│   └── models/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── hardware/
│   └── esp32/
│
└── tests/
```

This is a **planned structure**, not the current state of the repository.

---

# 🔎 Market Context

Existing commercial platforms already demonstrate that AI-based industrial safety monitoring is a real market category.

Our research includes platforms such as:

- Intenseye
- Protex AI
- Voxel
- viAct
- Visionify

These platforms demonstrate capabilities around areas such as computer vision, PPE monitoring, safety events, operational intelligence, alerts and safety workflows.

### Our positioning

IndustrialGuard AI is **not claiming to outperform mature enterprise platforms**.

Our proposed focus is:

> **A simpler, modular, explainable safety-intelligence prototype designed around accessibility for smaller industrial facilities.**

---

# 💼 Potential Product Direction

The long-term product model could follow a B2B approach.

Possible future components:

- Safety monitoring subscription
- Edge/IoT deployment package
- Advanced analytics
- Additional computer-vision scenarios
- Multi-site support
- Enterprise integrations

No commercial pricing is being claimed at the current stage.

---

# 🧩 Project Principles

We will follow these principles throughout development:

### 1. Build the MVP first

Do not add advanced features before the core safety loop works.

### 2. Measure instead of guessing

Model and system claims should be supported by test results.

### 3. Human-in-the-loop

The system supports safety decisions; it does not autonomously control industrial machinery.

### 4. Privacy by design

Avoid unnecessary personal or video-data retention.

### 5. Modular architecture

Components should be replaceable without rebuilding the entire platform.

### 6. Transparent documentation

Clearly distinguish:

- Proposed features
- Implemented features
- Measured results
- Future scope

---

# 👥 Team

| Member | Role |
|---|---|
| **Anjali Kumari** | Tech Lead & ML/CV / Backend |
| **Abhay Singh** | Product / Frontend / QA & Documentation |

### Institution

GLA University, Mathura

---

# 📚 Documentation

The repository is intended to contain project documentation as development progresses, including:

- Project synopsis
- System architecture
- Data-flow diagrams
- ERD
- Technical design
- ML evaluation
- Testing reports
- Presentation materials
- Final documentation

---

# ⚠️ Important Disclaimer

IndustrialGuard AI is an **academic prototype**.

It is not currently a certified industrial safety system and should not be used as a substitute for legally required safety procedures, qualified safety personnel, industrial controls, or certified safety equipment.

The prototype will avoid autonomous machine-control decisions and will use controlled or representative data for development and evaluation.

---

# 🤝 Contribution Workflow

During development, the team plans to use:

```text
Issue / Task
     ↓
Development Branch
     ↓
Implementation
     ↓
Testing
     ↓
Review
     ↓
Merge
```

Recommended commit categories:

```text
feat:      new feature
fix:       bug fix
ml:        model/data changes
cv:        computer vision changes
docs:      documentation
test:      testing
refactor:  code restructuring
```

---

# 🏁 What Success Looks Like

The MVP will be considered successful when this complete workflow works reliably:

```text
Sensor / Camera Input
        ↓
      Backend
        ↓
    Validation
        ↓
   ML / Computer Vision
        ↓
   Risk Fusion Engine
        ↓
   SAFE / WARNING / CRITICAL
        ↓
     Alert / Incident
        ↓
   Human Review & Action
        ↓
       Storage
        ↓
   Analytics & Learning
```

The goal is not to build the biggest safety platform.

The goal is to demonstrate a **clear, technically sound, measurable and extensible safety-intelligence system**.

---

# 📌 Repository Status

**🟡 Pre-Development**

This README represents the **planned project direction at the ideation/design stage**.

As implementation progresses, we will update:

- Architecture
- Installation instructions
- Environment variables
- API documentation
- Dataset sources
- Model details
- Screenshots
- Benchmarks
- Test results
- Deployment instructions
- Completed features

---

## ⭐ Project Vision

> **Detect risk early. Combine intelligence. Alert the right person. Learn from every event.**

**IndustrialGuard AI — from reactive safety monitoring to proactive safety intelligence.**
