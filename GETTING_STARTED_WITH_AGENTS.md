# Getting Started with Claude Code Agents - Step by Step

This guide will walk you through exactly how to install and operate Claude Code with the AI agents on your Mandate Wizard project.

---

## Step 1: Install Claude Code

### Option A: macOS or Linux (Recommended)

Open your terminal and run:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

This will:
- Download and install Claude Code
- Add it to your PATH
- Make it available system-wide

### Option B: Homebrew (macOS)

```bash
brew install --cask claude-code
```

### Option C: NPM (Any platform with Node.js)

```bash
npm install -g @anthropic-ai/claude-code
```

### Option D: Windows

**PowerShell:**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**CMD:**
```cmd
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### Verify Installation

After installation, verify it worked:

```bash
claude --version
```

You should see the version number (e.g., `2.0.30` or similar).

---

## Step 2: Authenticate Claude Code

When you first run Claude Code, you'll need to authenticate.

```bash
claude
```

You'll see authentication options:

### Option 1: Claude Console (Recommended for API usage)
1. Select "Claude Console" when prompted
2. Your browser will open to complete OAuth
3. Sign in to console.anthropic.com
4. Authorize Claude Code
5. A "Claude Code" workspace will be created for billing

### Option 2: Claude Pro/Max (Subscription)
1. Select "Claude App" when prompted
2. Sign in with your Claude.ai account
3. Requires active Pro ($20/mo) or Max ($200/mo) subscription

### Option 3: Enterprise (AWS Bedrock or Google Vertex AI)
1. Select "Enterprise" when prompted
2. Configure your cloud provider credentials

**Note**: Authentication only needs to be done once. Credentials are stored securely.

---

## Step 3: Clone Your Mandate Wizard Repository

If you haven't already cloned the repository locally:

```bash
# Navigate to where you want the project
cd ~/projects  # or wherever you keep your code

# Clone the repository
git clone https://github.com/bradleyhope/mandate-wizard.git

# Navigate into the project
cd mandate-wizard
```

The agents are already in the repository under the `agents/` directory.

---

## Step 4: Start Using Claude Code

### Interactive Mode (Recommended for Beginners)

From the mandate-wizard directory:

```bash
claude
```

You'll see the Claude Code interface. Now you can start giving it tasks!

### Your First Task

Try something simple to test it out:

```
What can you help me with on this project?
```

Claude Code will analyze your project and tell you what it can do.

### Try a Real Task

```
Add a comment to the top of backend/app.py explaining what the file does
```

Claude Code will:
1. Read the file
2. Understand the code
3. Add an appropriate comment
4. Show you the changes
5. Ask for your approval

Type `y` to approve the changes.

---

## Step 5: Using Agents for Specific Tasks

The agents automatically trigger based on your task description. Here are examples:

### Backend Development

```
Add logging to the search endpoint in backend/app.py
```

**What happens:**
- The `backend-architect` agent activates
- It analyzes the code
- Adds proper logging statements
- Shows you the changes
- The `test-writer-fixer` agent may also activate to add tests

### Frontend Development

```
Create a loading spinner component for the search results
```

**What happens:**
- The `frontend-developer` agent activates
- It creates the component following React best practices
- Uses TypeScript types
- Follows your existing component patterns
- The `ui-designer` may suggest improvements

### Testing

```
Write tests for the authentication system
```

**What happens:**
- The `test-writer-fixer` agent activates
- It analyzes the auth code
- Writes comprehensive tests
- Uses pytest (your existing test framework)

### DevOps

```
Update the Railway deployment configuration to add a new environment variable
```

**What happens:**
- The `devops-automator` agent activates
- It updates the Railway config files
- Updates documentation
- Ensures consistency across environments

---

## Step 6: Advanced Usage

### Headless Mode (Non-Interactive)

For quick tasks without the interactive UI:

```bash
claude -p "Add error handling to the Pinecone connection"
```

This runs the task and shows the results without interactive prompts.

### JSON Output (For Automation)

```bash
claude -p "Analyze the codebase for performance issues" --output-format json > analysis.json
```

This outputs structured JSON you can parse programmatically.

### Continue Conversations

```bash
# Start a task
claude
> "Add user preferences to the database"

# After it's done, continue
> "Now create an API endpoint to retrieve those preferences"

# Keep going
> "Add tests for the new endpoint"
```

Claude Code maintains context throughout the conversation.

### Resume Previous Sessions

```bash
# List recent sessions
claude --list-sessions

# Resume a specific session
claude --resume SESSION_ID
```

---

## Step 7: Using the Setup Script

The repository includes an interactive setup script:

```bash
./use-agents.sh
```

This script will:
1. Check if Claude Code is installed
2. Verify the agents directory
3. Show you available agents
4. Provide example tasks
5. Optionally install agents globally

**Menu options:**
- **[1]** Start interactive Claude Code session
- **[2]** List all available agents
- **[3]** Show example tasks
- **[4]** Install agents globally (for all projects)
- **[5]** Exit

---

## Step 8: Real-World Workflow Example

Here's a complete workflow for adding a new feature:

### Scenario: Add a "Recent Searches" Feature

**Step 1: Start Claude Code**
```bash
cd ~/projects/mandate-wizard
claude
```

**Step 2: Describe the Feature**
```
I want to add a "recent searches" feature that stores the last 10 searches for each user in the database and displays them in the UI
```

**Step 3: Let Agents Work**
Claude Code will:
- Activate `backend-architect` to design the database schema
- Activate `frontend-developer` to create the UI component
- Activate `test-writer-fixer` to add tests
- Activate `ui-designer` to suggest UI improvements

**Step 4: Review Changes**
Claude Code shows you all the changes. Review them carefully.

**Step 5: Approve**
Type `y` to approve, or ask for modifications:
```
Can you also add a "clear history" button?
```

**Step 6: Test Locally**
```bash
# In another terminal
cd backend
python app.py

# In another terminal
cd frontend
pnpm run dev
```

**Step 7: Commit and Deploy**
```bash
git add .
git commit -m "Add recent searches feature"
git push
```

Railway will automatically deploy your changes.

---

## Common Commands Reference

### Starting Claude Code
```bash
# Interactive mode
claude

# Quick task
claude -p "task description"

# With JSON output
claude -p "task" --output-format json

# Continue previous conversation
claude --continue
```

### Managing Sessions
```bash
# List sessions
claude --list-sessions

# Resume session
claude --resume SESSION_ID

# Clear session history
claude --clear-sessions
```

### Configuration
```bash
# Check installation
claude doctor

# Update Claude Code
claude update

# View configuration
claude config
```

---

## Troubleshooting

### "claude: command not found"

**Solution**: Claude Code isn't in your PATH. Try:

```bash
# Restart your terminal, or
source ~/.bashrc  # or ~/.zshrc

# Or reinstall
curl -fsSL https://claude.ai/install.sh | bash
```

### "Authentication failed"

**Solution**: Re-authenticate:

```bash
claude logout
claude
# Follow authentication prompts again
```

### "Agents not triggering"

**Solution**: Ensure agents are in the right location:

```bash
# Check agents directory exists
ls agents/

# Should show: engineering, product, marketing, design, etc.

# If not, pull latest from GitHub
git pull origin master
```

### "Permission denied" errors

**Solution**: Claude Code needs permission to modify files:

In interactive mode, approve changes when prompted.

In headless mode, use:
```bash
claude -p "task" --permission-mode acceptEdits
```

### "Rate limit exceeded"

**Solution**: You've hit API rate limits. Wait a few minutes, or:

- Upgrade to Claude Pro/Max for higher limits
- Use a different authentication method
- Break large tasks into smaller chunks

---

## Tips for Success

### 1. Start Small
Begin with simple tasks to build confidence:
- "Add a comment to this file"
- "Fix this typo in the README"
- "Add logging to this function"

### 2. Be Specific
The more specific your request, the better the result:

❌ "Improve the app"
✅ "Optimize the search query in hybridrag_engine_pinecone.py to reduce latency"

### 3. Iterate
Don't try to do everything at once:
```
> "Add user authentication"
# Review and approve
> "Now add password reset"
# Review and approve
> "Add tests for authentication"
```

### 4. Review Everything
Always review changes before approving. Claude Code is powerful but not perfect.

### 5. Use Version Control
Commit frequently so you can easily revert if needed:
```bash
git add .
git commit -m "Add feature X"
```

### 6. Leverage Multiple Agents
Complex tasks benefit from multiple agents:
```
"Design and implement a new analytics dashboard with charts and filters"
```
This will trigger: ui-designer → frontend-developer → backend-architect → test-writer-fixer

---

## Next Steps

### Practice Tasks

Try these to get comfortable:

**Easy:**
1. "Add a comment explaining the HybridRAG engine"
2. "Fix any typos in the README"
3. "Add logging to the authentication endpoint"

**Medium:**
1. "Create a health check endpoint for the backend"
2. "Add a loading state to the search component"
3. "Write tests for the search API"

**Advanced:**
1. "Optimize the Pinecone query performance"
2. "Add caching to reduce database calls"
3. "Implement rate limiting for the API"

### Learn More

- Read `CLAUDE_CODE_AGENTS_GUIDE.md` for comprehensive documentation
- Check `AGENTS_QUICK_REFERENCE.md` for quick task examples
- Visit https://code.claude.com/docs for official documentation

---

## Quick Start Checklist

- [ ] Install Claude Code
- [ ] Authenticate (Claude Console, Pro, or Enterprise)
- [ ] Clone mandate-wizard repository
- [ ] Navigate to project directory
- [ ] Run `claude` to start interactive mode
- [ ] Try: "What can you help me with on this project?"
- [ ] Try a simple task: "Add logging to app.py"
- [ ] Review and approve changes
- [ ] Test the changes locally
- [ ] Commit and push to GitHub

**You're ready to code with AI! 🚀**

---

## Getting Help

**Claude Code Issues:**
- Run `claude doctor` to diagnose problems
- Check https://code.claude.com/docs
- Visit https://discord.gg/anthropic

**Mandate Wizard Issues:**
- Review `DEPLOYMENT_GUIDE.md`
- Check GitHub Issues
- Review application logs in Railway

**Agent Issues:**
- Ensure agents are in `agents/` directory
- Try `./use-agents.sh` for interactive setup
- Review `CLAUDE_CODE_AGENTS_GUIDE.md`
