# Claude Code Agents Setup Guide - Mandate Wizard

## Overview

This guide explains how to use the **Contains Studio AI Agents** with your Mandate Wizard project using Claude Code. These agents provide specialized expertise across engineering, product, marketing, design, operations, and testing.

---

## What Are These Agents?

The `agents/` directory contains **35+ specialized AI agents** organized by department:

- **Engineering** (7 agents): Backend architecture, frontend development, AI integration, DevOps, testing
- **Product** (3 agents): Feedback synthesis, sprint prioritization, trend research
- **Marketing** (7 agents): Content creation, growth hacking, social media strategy
- **Design** (5 agents): UI/UX design, brand consistency, visual storytelling
- **Project Management** (3 agents): Experiment tracking, project shipping, team coordination
- **Studio Operations** (5 agents): Analytics, finance, infrastructure, legal, support
- **Testing** (5 agents): API testing, performance benchmarking, workflow optimization
- **Bonus** (2 agents): Studio coach, joker

Each agent automatically triggers based on your task description when using Claude Code.

---

## Installation & Setup

### Option 1: Use Agents Directly in This Repository

The agents are already set up in the `agents/` directory. When you run Claude Code from this project directory, they'll be available automatically.

```bash
cd /path/to/mandate-wizard
claude
```

### Option 2: Install Globally for All Projects

To use these agents across all your projects:

```bash
# Copy agents to Claude Code's global agents directory
cp -r agents/* ~/.claude/agents/

# Restart Claude Code (if already running)
```

---

## How to Use Claude Code with Mandate Wizard

### Interactive Mode (Recommended)

```bash
cd /path/to/mandate-wizard
claude
```

Then describe your task in natural language:

**Backend Development:**
- "Add a new API endpoint for user preferences"
- "Optimize the HybridRAG query performance"
- "Fix the CORS configuration for production"
- "Add error handling to the Pinecone integration"

**Frontend Development:**
- "Create a new component for displaying executive profiles"
- "Improve the search results UI with better loading states"
- "Add dark mode support to the application"
- "Refactor the authentication flow"

**Testing:**
- "Write comprehensive tests for the authentication system"
- "Create integration tests for the HybridRAG engine"
- "Add performance benchmarks for the search API"

**DevOps:**
- "Update the Railway deployment configuration"
- "Add health check endpoints"
- "Optimize the Gunicorn configuration for production"

**Product & Design:**
- "Analyze user feedback and suggest improvements"
- "Design a better onboarding flow"
- "Create a roadmap for the next sprint"

### Headless/API Mode

For automation and CI/CD:

```bash
# Run a specific task
claude -p "Add tests for the authentication module" \
  --output-format json \
  --allowedTools "Bash,Read,Write,MultiEdit"

# Continue from previous session
claude --continue "Now add integration tests"

# Generate a report
claude -p "Analyze the codebase and generate a technical debt report" \
  --output-format json > tech-debt-report.json
```

---

## Agent Examples for Mandate Wizard

### Engineering Agents

**Backend Architect** - Triggered by:
- "Design a caching layer for the search API"
- "Refactor the database connection pooling"
- "Add rate limiting to the API endpoints"

**Frontend Developer** - Triggered by:
- "Build a new dashboard for analytics"
- "Optimize React component rendering"
- "Add TypeScript types to the API client"

**AI Engineer** - Triggered by:
- "Improve the semantic search relevance"
- "Add a new embedding model to the pipeline"
- "Optimize the Pinecone query performance"

**DevOps Automator** - Triggered by:
- "Set up automated deployment to Railway"
- "Add monitoring and alerting"
- "Create a backup strategy for Neo4j"

**Test Writer Fixer** - Automatically triggers after:
- Implementing new features
- Fixing bugs
- Modifying existing code

### Product Agents

**Feedback Synthesizer** - Triggered by:
- "Analyze user complaints and suggest features"
- "Review the latest user feedback"
- "Prioritize feature requests"

**Sprint Prioritizer** - Triggered by:
- "Plan the next 6-day sprint"
- "Prioritize the backlog"
- "Estimate development time for features"

**Trend Researcher** - Triggered by:
- "What's trending in AI search applications?"
- "Research competitor features"
- "Identify viral opportunities"

### Marketing Agents

**Content Creator** - Triggered by:
- "Write a blog post about our AI search technology"
- "Create social media content"
- "Draft a product announcement"

**Growth Hacker** - Triggered by:
- "Find viral growth opportunities"
- "Design a referral program"
- "Optimize our conversion funnel"

### Design Agents

**UI Designer** - Triggered by:
- "Design a better search results page"
- "Create a new component library"
- "Improve the mobile experience"

**UX Researcher** - Triggered by:
- "Analyze user behavior patterns"
- "Suggest UX improvements"
- "Design user testing scenarios"

**Whimsy Injector** - Automatically triggers after:
- UI/UX changes to add delightful interactions

### Operations Agents

**Analytics Reporter** - Triggered by:
- "Generate a usage report"
- "Analyze search query patterns"
- "Create a performance dashboard"

**Infrastructure Maintainer** - Triggered by:
- "Optimize database performance"
- "Scale the application for more users"
- "Reduce infrastructure costs"

**Legal Compliance Checker** - Triggered by:
- "Review GDPR compliance"
- "Check data privacy policies"
- "Audit security practices"

### Testing Agents

**API Tester** - Triggered by:
- "Test all API endpoints"
- "Create load tests for the search API"
- "Verify error handling"

**Performance Benchmarker** - Triggered by:
- "Benchmark query performance"
- "Optimize slow endpoints"
- "Profile memory usage"

---

## Project-Specific Agent Configuration

### Mandate Wizard Context

When using agents with this project, they'll have access to:

**Backend Stack:**
- Python 3.x with Flask
- Pinecone (vector database)
- Neo4j (graph database)
- OpenAI API for embeddings
- Gunicorn + Gevent for production

**Frontend Stack:**
- React 18+ with TypeScript
- Vite for build tooling
- Radix UI components
- TanStack Query for data fetching
- Express server for production

**Deployment:**
- Railway (monorepo with separate services)
- Environment variables for configuration
- Automated CI/CD from GitHub

### Custom Agent Instructions

You can customize agent behavior by adding project-specific context:

```bash
claude -p "Add a new feature to the search API" \
  --append-system-prompt "This project uses Pinecone for vector search and Neo4j for graph relationships. Follow the existing patterns in hybridrag_engine_pinecone.py"
```

---

## Best Practices

### 1. Be Specific with Tasks
Instead of: "Improve the app"
Use: "Optimize the HybridRAG query to reduce latency from 2s to under 500ms"

### 2. Let Agents Collaborate
Complex tasks benefit from multiple agents:
- "Design and implement a new analytics dashboard" → triggers UI Designer, Frontend Developer, Backend Architect

### 3. Use Proactive Agents
Some agents trigger automatically:
- **test-writer-fixer**: After code changes
- **whimsy-injector**: After UI updates
- **studio-coach**: For complex multi-agent tasks

### 4. Iterate Quickly
Agents support the 6-day sprint philosophy:
- Break large tasks into smaller iterations
- Ship frequently
- Get feedback and adjust

### 5. Trust the Expertise
Each agent is specialized for their domain:
- Let the backend-architect design APIs
- Let the ui-designer handle interfaces
- Let the devops-automator handle deployment

---

## Integration with Your Workflow

### Local Development

```bash
# Start backend
cd backend
python app.py

# In another terminal, use Claude Code
cd /path/to/mandate-wizard
claude
> "Add logging to the search endpoint"
```

### CI/CD Integration

Add Claude Code to your GitHub Actions:

```yaml
# .github/workflows/claude-code-review.yml
name: Claude Code Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Claude Code
        run: curl -fsSL https://claude.ai/install.sh | bash
      - name: Run Code Review
        run: |
          claude -p "Review this PR for security issues and code quality" \
            --output-format json > review.json
```

### Pre-commit Hooks

```bash
# .git/hooks/pre-commit
#!/bin/bash
claude -p "Check for common issues in staged files" \
  --allowedTools "Read,Grep" \
  --no-interactive
```

---

## Troubleshooting

### Agents Not Triggering

**Issue**: Agents don't seem to activate
**Solution**: 
- Ensure agents are in the `agents/` directory in your project root
- Or install globally to `~/.claude/agents/`
- Restart Claude Code if needed

### Wrong Agent Activating

**Issue**: Unexpected agent responds to your task
**Solution**:
- Be more specific in your task description
- Explicitly mention the agent name: "Use the backend-architect to design a new API"

### Permission Issues

**Issue**: Claude Code can't modify files
**Solution**:
- Check file permissions
- Use `--permission-mode acceptEdits` in headless mode
- Review the `--allowedTools` parameter

---

## Advanced Usage

### Multi-turn Conversations

```bash
# Start a conversation
claude
> "I want to add a recommendation engine"

# Continue the conversation
> "Now add caching for the recommendations"

# Get a summary
> "Summarize what we've built"
```

### Session Management

```bash
# Save session ID for later
session_id=$(claude -p "Start new feature" --output-format json | jq -r '.session_id')

# Resume later
claude --resume $session_id "Continue the feature implementation"
```

### Custom Agents

You can create your own agents for Mandate Wizard:

```markdown
---
name: mandate-wizard-specialist
description: Expert in the Mandate Wizard codebase and architecture
color: purple
tools: Read, Write, MultiEdit, Bash
---

You are a specialist in the Mandate Wizard application. You understand:
- The HybridRAG architecture combining Pinecone and Neo4j
- The Flask backend with Gunicorn deployment
- The React frontend with TypeScript
- Railway deployment patterns

Your goal is to maintain code quality and architectural consistency.
```

Save to `agents/custom/mandate-wizard-specialist.md`

---

## Resources

- **Claude Code Docs**: https://code.claude.com/docs
- **Contains Studio Agents**: https://github.com/contains-studio/agents
- **Mandate Wizard Repo**: https://github.com/bradleyhope/mandate-wizard

---

## Quick Reference

### Common Commands

```bash
# Start interactive mode
claude

# Run headless with JSON output
claude -p "task description" --output-format json

# Continue previous conversation
claude --continue "next task"

# Resume specific session
claude --resume SESSION_ID "task"

# List available agents
ls agents/*/
```

### Relevant Agents for Common Tasks

| Task | Agent |
|------|-------|
| API development | backend-architect |
| UI components | frontend-developer, ui-designer |
| Database queries | backend-architect |
| Testing | test-writer-fixer, api-tester |
| Deployment | devops-automator |
| Performance | performance-benchmarker |
| Features | rapid-prototyper |
| Analytics | analytics-reporter |
| Documentation | technical-writer (if added) |

---

## Next Steps

1. **Try it out**: Run `claude` in the project directory
2. **Start small**: Ask for simple tasks like "Add logging to app.py"
3. **Iterate**: Build confidence with increasingly complex tasks
4. **Customize**: Create project-specific agents as needed
5. **Automate**: Integrate into CI/CD pipelines

The agents are ready to help you build, test, deploy, and scale Mandate Wizard faster than ever before!
