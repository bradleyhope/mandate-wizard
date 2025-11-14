# Claude Code Agents - Quick Reference

## 🚀 Getting Started

```bash
# Interactive mode (recommended)
cd /path/to/mandate-wizard
claude

# Or use the setup script
./use-agents.sh
```

---

## 📋 Common Tasks by Agent

### Backend Development

**Backend Architect** - API design, database architecture
```
"Design a caching layer for the search API"
"Add rate limiting to API endpoints"
"Refactor the database connection pooling"
```

**AI Engineer** - ML/AI features, embeddings, search
```
"Improve semantic search relevance"
"Optimize Pinecone query performance"
"Add a new embedding model"
```

**DevOps Automator** - Deployment, infrastructure
```
"Update Railway deployment config"
"Add health check endpoints"
"Set up monitoring and alerting"
```

### Frontend Development

**Frontend Developer** - React, TypeScript, UI logic
```
"Create a component for executive profiles"
"Optimize React rendering performance"
"Add TypeScript types to API client"
```

**UI Designer** - Interface design, components
```
"Design a better search results page"
"Create a new component library"
"Improve mobile experience"
```

**UX Researcher** - User experience, usability
```
"Analyze user behavior patterns"
"Suggest UX improvements"
"Design user testing scenarios"
```

### Testing

**Test Writer Fixer** - Unit tests, integration tests
```
"Write tests for authentication system"
"Add integration tests for HybridRAG"
"Fix failing tests"
```

**API Tester** - API testing, validation
```
"Test all API endpoints"
"Create load tests for search API"
"Verify error handling"
```

**Performance Benchmarker** - Performance optimization
```
"Benchmark query performance"
"Optimize slow endpoints"
"Profile memory usage"
```

### Product & Planning

**Sprint Prioritizer** - Sprint planning, backlog
```
"Plan the next 6-day sprint"
"Prioritize the backlog"
"Estimate development time"
```

**Feedback Synthesizer** - User feedback analysis
```
"Analyze user complaints"
"Review latest feedback"
"Prioritize feature requests"
```

**Trend Researcher** - Market research, trends
```
"What's trending in AI search?"
"Research competitor features"
"Identify viral opportunities"
```

### Operations

**Analytics Reporter** - Usage analytics, reporting
```
"Generate a usage report"
"Analyze search query patterns"
"Create performance dashboard"
```

**Infrastructure Maintainer** - Infrastructure optimization
```
"Optimize database performance"
"Scale for more users"
"Reduce infrastructure costs"
```

---

## 🎯 Task Examples for Mandate Wizard

### Add New Feature
```bash
claude
> "Add a new API endpoint for saving user search preferences"
```
**Triggers**: backend-architect, test-writer-fixer

### Fix Bug
```bash
claude
> "Fix the CORS error when calling the API from production frontend"
```
**Triggers**: backend-architect, devops-automator

### Optimize Performance
```bash
claude
> "Reduce search query latency from 2s to under 500ms"
```
**Triggers**: ai-engineer, performance-benchmarker, backend-architect

### Improve UI
```bash
claude
> "Redesign the search results page with better loading states"
```
**Triggers**: ui-designer, frontend-developer, whimsy-injector

### Deploy Changes
```bash
claude
> "Update the Railway deployment to use the new environment variables"
```
**Triggers**: devops-automator

### Add Tests
```bash
claude
> "Write comprehensive tests for the HybridRAG search engine"
```
**Triggers**: test-writer-fixer, api-tester

---

## 💡 Pro Tips

### 1. Be Specific
❌ "Improve the app"
✅ "Optimize HybridRAG query to reduce latency from 2s to 500ms"

### 2. Multi-Agent Tasks
Complex tasks automatically trigger multiple agents:
```
"Design and implement a new analytics dashboard"
```
**Triggers**: ui-designer → frontend-developer → backend-architect → test-writer-fixer

### 3. Use Headless Mode for Automation
```bash
# Generate reports
claude -p "Analyze codebase and create tech debt report" \
  --output-format json > report.json

# CI/CD integration
claude -p "Review PR for security issues" \
  --allowedTools "Read,Grep" \
  --no-interactive
```

### 4. Continue Conversations
```bash
claude
> "Add user authentication"
# Agent implements authentication
> "Now add password reset functionality"
# Agent continues with context
```

### 5. Proactive Agents
Some agents trigger automatically:
- **test-writer-fixer**: After code changes
- **whimsy-injector**: After UI updates
- **studio-coach**: For complex tasks

---

## 🔧 Headless Mode Commands

```bash
# Basic task
claude -p "task description"

# With JSON output
claude -p "task" --output-format json

# Specify tools
claude -p "task" --allowedTools "Bash,Read,Write"

# Auto-accept edits
claude -p "task" --permission-mode acceptEdits

# Continue conversation
claude --continue "next task"

# Resume session
claude --resume SESSION_ID "task"
```

---

## 📊 Agent Categories

| Category | Count | Use For |
|----------|-------|---------|
| Engineering | 7 | Code, APIs, deployment |
| Product | 3 | Planning, feedback, research |
| Marketing | 7 | Content, growth, social |
| Design | 5 | UI/UX, branding, visuals |
| Project Mgmt | 3 | Sprints, shipping, coordination |
| Operations | 5 | Analytics, finance, legal |
| Testing | 5 | Tests, performance, quality |
| Bonus | 2 | Coaching, humor |

---

## 🎨 Mandate Wizard Specific

### Tech Stack Context
Agents understand:
- **Backend**: Python/Flask, Pinecone, Neo4j, OpenAI
- **Frontend**: React/TypeScript, Vite, Radix UI
- **Deploy**: Railway monorepo, Gunicorn, Express

### Key Files
- `backend/hybridrag_engine_pinecone.py` - Core search
- `backend/app.py` - Flask app
- `frontend/client/src/App.tsx` - React app
- `DEPLOYMENT_GUIDE.md` - Deploy docs

### Common Workflows

**Local Development**:
```bash
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend  
cd frontend && pnpm run dev

# Terminal 3: Claude Code
claude
```

**Add Feature**:
1. Describe feature to Claude Code
2. Review generated code
3. Run tests (auto-generated)
4. Commit and push
5. Railway auto-deploys

**Debug Issue**:
```bash
claude
> "The search API is returning 500 errors for queries with special characters"
```

**Optimize**:
```bash
claude
> "Profile the search endpoint and identify bottlenecks"
```

---

## 📚 Resources

- **Full Guide**: `CLAUDE_CODE_AGENTS_GUIDE.md`
- **Setup Script**: `./use-agents.sh`
- **Claude Docs**: https://code.claude.com/docs
- **Agents Repo**: https://github.com/contains-studio/agents

---

## 🆘 Troubleshooting

**Agents not working?**
- Ensure agents are in `agents/` directory
- Or install globally: `cp -r agents/* ~/.claude/agents/`
- Restart Claude Code

**Wrong agent triggered?**
- Be more specific in task description
- Explicitly mention agent: "Use backend-architect to..."

**Permission errors?**
- Use `--permission-mode acceptEdits` in headless mode
- Check file permissions

---

## ⚡ Quick Start Checklist

- [ ] Install Claude Code
- [ ] Clone Mandate Wizard repo
- [ ] Run `./use-agents.sh`
- [ ] Try: `claude` then "What can you help me with?"
- [ ] Start with small task: "Add logging to app.py"
- [ ] Build confidence with bigger tasks
- [ ] Integrate into workflow

**You're ready to code with AI assistance! 🎉**
