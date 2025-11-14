#!/bin/bash
# Mandate Wizard - Claude Code Agents Quick Start
# This script helps you get started with Claude Code agents

set -e

echo "🧙 Mandate Wizard - Claude Code Agents Setup"
echo "=============================================="
echo ""

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code is not installed"
    echo ""
    echo "Install Claude Code:"
    echo "  macOS/Linux: curl -fsSL https://claude.ai/install.sh | bash"
    echo "  Homebrew:    brew install --cask claude-code"
    echo "  NPM:         npm install -g @anthropic-ai/claude-code"
    echo ""
    exit 1
fi

echo "✅ Claude Code is installed"
echo ""

# Check if agents directory exists
if [ ! -d "agents" ]; then
    echo "❌ Agents directory not found"
    echo "Run this script from the mandate-wizard project root"
    exit 1
fi

echo "✅ Agents directory found ($(find agents -name "*.md" | wc -l) agents available)"
echo ""

# Show available agent categories
echo "📁 Available Agent Categories:"
echo "  • Engineering (7 agents)"
echo "  • Product (3 agents)"
echo "  • Marketing (7 agents)"
echo "  • Design (5 agents)"
echo "  • Project Management (3 agents)"
echo "  • Studio Operations (5 agents)"
echo "  • Testing (5 agents)"
echo "  • Bonus (2 agents)"
echo ""

# Provide usage options
echo "🚀 How to Use:"
echo ""
echo "1. Interactive Mode (Recommended):"
echo "   $ claude"
echo "   Then describe your task in natural language"
echo ""
echo "2. Quick Task:"
echo "   $ claude -p \"Add logging to the search endpoint\""
echo ""
echo "3. With JSON Output:"
echo "   $ claude -p \"Review code quality\" --output-format json"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "  [1] Start interactive Claude Code session"
echo "  [2] List all available agents"
echo "  [3] Show example tasks"
echo "  [4] Install agents globally (for all projects)"
echo "  [5] Exit"
echo ""
read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo ""
        echo "Starting Claude Code..."
        echo "Tip: Try asking 'What can you help me with on this project?'"
        echo ""
        claude
        ;;
    2)
        echo ""
        echo "📋 Available Agents:"
        echo ""
        for dir in agents/*/; do
            category=$(basename "$dir")
            echo "━━━ $(echo $category | tr '[:lower:]' '[:upper:]' | tr '-' ' ') ━━━"
            for agent in "$dir"*.md; do
                if [ -f "$agent" ]; then
                    name=$(basename "$agent" .md)
                    # Extract description from YAML frontmatter
                    desc=$(grep "^description:" "$agent" | head -1 | sed 's/description: //' | cut -c1-60)
                    echo "  • $name"
                    if [ ! -z "$desc" ]; then
                        echo "    $desc..."
                    fi
                fi
            done
            echo ""
        done
        ;;
    3)
        echo ""
        echo "💡 Example Tasks for Mandate Wizard:"
        echo ""
        echo "Backend Development:"
        echo "  • 'Add a new API endpoint for user preferences'"
        echo "  • 'Optimize the HybridRAG query performance'"
        echo "  • 'Fix the CORS configuration for production'"
        echo ""
        echo "Frontend Development:"
        echo "  • 'Create a component for displaying executive profiles'"
        echo "  • 'Add dark mode support'"
        echo "  • 'Improve the search results UI'"
        echo ""
        echo "Testing:"
        echo "  • 'Write tests for the authentication system'"
        echo "  • 'Add performance benchmarks for the search API'"
        echo "  • 'Create integration tests for HybridRAG'"
        echo ""
        echo "DevOps:"
        echo "  • 'Update the Railway deployment configuration'"
        echo "  • 'Add health check endpoints'"
        echo "  • 'Optimize Gunicorn for production'"
        echo ""
        echo "Product & Design:"
        echo "  • 'Analyze user feedback and suggest improvements'"
        echo "  • 'Design a better onboarding flow'"
        echo "  • 'Create a roadmap for the next sprint'"
        echo ""
        ;;
    4)
        echo ""
        echo "Installing agents globally to ~/.claude/agents/..."
        mkdir -p ~/.claude/agents
        cp -r agents/* ~/.claude/agents/
        echo "✅ Agents installed globally"
        echo "You can now use these agents in any project!"
        echo ""
        ;;
    5)
        echo ""
        echo "👋 See you later! Read CLAUDE_CODE_AGENTS_GUIDE.md for more info."
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac
