# Claude Code Agent Workflow - Visual Guide

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GETTING STARTED                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Install Claude   │
                    │ Code             │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Authenticate     │
                    │ (Console/Pro)    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Clone Mandate    │
                    │ Wizard Repo      │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    OPERATING CLAUDE CODE                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ cd mandate-      │
                    │ wizard           │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Run: claude      │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TASK EXECUTION FLOW                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Describe Task    │
                    │ in Natural       │
                    │ Language         │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Claude Code      │
                    │ Analyzes Task    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Selects          │
                    │ Appropriate      │
                    │ Agent(s)         │
                    └──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Backend      │ │ Frontend     │ │ Testing      │
    │ Architect    │ │ Developer    │ │ Agent        │
    └──────────────┘ └──────────────┘ └──────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
                    ┌──────────────────┐
                    │ Agent(s)         │
                    │ Execute Task     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Show Changes     │
                    │ to User          │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Reviews     │
                    │ Changes          │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌──────────────┐    ┌──────────────┐
          │ Approve (y)  │    │ Reject or    │
          │              │    │ Modify       │
          └──────────────┘    └──────────────┘
                    │                   │
                    │                   └──────┐
                    ▼                          │
          ┌──────────────┐                     │
          │ Changes      │                     │
          │ Applied      │                     │
          └──────────────┘                     │
                    │                          │
                    ▼                          │
          ┌──────────────┐                     │
          │ Continue or  │◄────────────────────┘
          │ Exit         │
          └──────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐      ┌──────────────┐
│ Continue     │      │ Exit and     │
│ with Next    │      │ Test Changes │
│ Task         │      └──────────────┘
└──────────────┘
        │
        └──────────────────────────┐
                                   │
                                   ▼
                         ┌──────────────────┐
                         │ Return to Task   │
                         │ Description      │
                         └──────────────────┘
```

## Example Task Flow: "Add Logging to Search Endpoint"

```
┌─────────────────────────────────────────────────────────────────┐
│ USER INPUT                                                      │
└─────────────────────────────────────────────────────────────────┘

  "Add logging to the search endpoint in backend/app.py"

                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ CLAUDE CODE ANALYSIS                                            │
└─────────────────────────────────────────────────────────────────┘

  • Identifies file: backend/app.py
  • Identifies task type: Backend modification
  • Identifies feature: Logging
  • Selects agent: backend-architect

                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ AGENT EXECUTION                                                 │
└─────────────────────────────────────────────────────────────────┘

  backend-architect:
  1. Reads backend/app.py
  2. Identifies search endpoint
  3. Analyzes current logging setup
  4. Generates logging statements
  5. Follows Python logging best practices

                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ CHANGES GENERATED                                               │
└─────────────────────────────────────────────────────────────────┘

  backend/app.py:
  + import logging
  + logger = logging.getLogger(__name__)
  
  @app.route('/api/search')
  def search():
  +   logger.info(f"Search request received: {request.args}")
      # ... existing code ...
  +   logger.info(f"Search completed: {len(results)} results")
      return jsonify(results)

                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ USER REVIEW                                                     │
└─────────────────────────────────────────────────────────────────┘

  Claude Code shows diff:
  "I've added logging to the search endpoint. 
   This will log incoming requests and result counts.
   
   Approve these changes? (y/n)"

                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          ┌──────────────┐    ┌──────────────┐
          │ User: y      │    │ User: n or   │
          │              │    │ "Add error   │
          │              │    │  logging too"│
          └──────────────┘    └──────────────┘
                    │                   │
                    ▼                   ▼
          ┌──────────────┐    ┌──────────────┐
          │ Changes      │    │ Agent        │
          │ Applied      │    │ Refines      │
          └──────────────┘    └──────────────┘
                    │                   │
                    │                   └──────┐
                    ▼                          │
          ┌──────────────┐                     │
          │ OPTIONAL:    │◄────────────────────┘
          │ test-writer- │
          │ fixer        │
          │ activates    │
          └──────────────┘
                    │
                    ▼
          ┌──────────────┐
          │ Suggests     │
          │ adding tests │
          │ for logging  │
          └──────────────┘
                    │
                    ▼
          ┌──────────────┐
          │ Task         │
          │ Complete     │
          └──────────────┘
```

## Multi-Agent Collaboration Example

```
┌─────────────────────────────────────────────────────────────────┐
│ COMPLEX TASK: "Add a user preferences feature"                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Task Analysis    │
                    │ • Database       │
                    │ • API            │
                    │ • UI             │
                    │ • Tests          │
                    └──────────────────┘
                              │
              ┌───────────────┼───────────────┬───────────────┐
              ▼               ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ PHASE 1      │ │ PHASE 2      │ │ PHASE 3      │ │ PHASE 4      │
    │ Database     │ │ API          │ │ UI           │ │ Testing      │
    └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ backend- │      │ backend- │      │ frontend-│      │ test-    │
    │ architect│      │ architect│      │ developer│      │ writer-  │
    │          │      │          │      │          │      │ fixer    │
    │ Creates  │      │ Creates  │      │ Creates  │      │          │
    │ schema   │      │ endpoint │      │ UI       │      │ Writes   │
    └──────────┘      └──────────┘      └──────────┘      │ tests    │
          │                 │                 │            └──────────┘
          │                 │                 │                 │
          └─────────────────┴─────────────────┴─────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Complete         │
                    │ Feature          │
                    │ Delivered        │
                    └──────────────────┘
```

## Agent Selection Logic

```
┌─────────────────────────────────────────────────────────────────┐
│ TASK KEYWORDS → AGENT MAPPING                                   │
└─────────────────────────────────────────────────────────────────┘

"API", "endpoint", "backend", "database"
    └──► backend-architect

"UI", "component", "React", "frontend"
    └──► frontend-developer

"design", "layout", "interface"
    └──► ui-designer

"test", "testing", "coverage"
    └──► test-writer-fixer

"deploy", "Railway", "production", "environment"
    └──► devops-automator

"optimize", "performance", "slow"
    └──► performance-benchmarker

"AI", "search", "embeddings", "Pinecone"
    └──► ai-engineer

"analytics", "metrics", "reporting"
    └──► analytics-reporter

"sprint", "prioritize", "backlog"
    └──► sprint-prioritizer
```

## Headless Mode Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADLESS MODE (Non-Interactive)                                │
└─────────────────────────────────────────────────────────────────┘

  $ claude -p "Add health check endpoint" --output-format json

                              │
                              ▼
                    ┌──────────────────┐
                    │ Execute Task     │
                    │ Automatically    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Return JSON      │
                    │ Result           │
                    └──────────────────┘
                              │
                              ▼
  {
    "type": "result",
    "subtype": "success",
    "total_cost_usd": 0.003,
    "duration_ms": 1234,
    "result": "Added health check endpoint...",
    "session_id": "abc123"
  }
                              │
                              ▼
                    ┌──────────────────┐
                    │ Parse and Use    │
                    │ in Scripts/CI    │
                    └──────────────────┘
```

## Session Management

```
┌─────────────────────────────────────────────────────────────────┐
│ SESSION LIFECYCLE                                               │
└─────────────────────────────────────────────────────────────────┘

  Session Start
      │
      ▼
  ┌──────────────┐
  │ Task 1       │ ──► "Add logging"
  └──────────────┘
      │
      ▼
  ┌──────────────┐
  │ Task 2       │ ──► "Now add error handling"
  └──────────────┘     (has context from Task 1)
      │
      ▼
  ┌──────────────┐
  │ Task 3       │ ──► "Add tests for both"
  └──────────────┘     (has context from Tasks 1 & 2)
      │
      ▼
  Session End
      │
      ▼
  ┌──────────────┐
  │ Session ID   │ ──► Saved for later resume
  │ abc123       │
  └──────────────┘
      │
      ▼
  Later: claude --resume abc123
      │
      ▼
  ┌──────────────┐
  │ Continue     │ ──► Full context restored
  │ from Task 3  │
  └──────────────┘
```

## Decision Tree: Which Mode to Use

```
                    Start Here
                        │
                        ▼
              ┌──────────────────┐
              │ What do you      │
              │ want to do?      │
              └──────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Learn/       │ │ Automate/    │ │ Quick        │
│ Explore      │ │ Script       │ │ One-off      │
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Interactive  │ │ Headless     │ │ Headless     │
│ Mode         │ │ with JSON    │ │ Simple       │
│              │ │              │ │              │
│ $ claude     │ │ $ claude -p  │ │ $ claude -p  │
│              │ │   --output-  │ │   "task"     │
│              │ │   format     │ │              │
│              │ │   json       │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```
