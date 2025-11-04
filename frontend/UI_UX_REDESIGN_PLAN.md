# Mandate Wizard UI/UX Redesign Plan
## Pitch Intelligence Tool for Content Creators

**Date:** November 2, 2025  
**Goal:** Transform Mandate Wizard into a streamlined pitch intelligence tool for content creators who need to find the right executives and craft winning pitches

---

## 🎯 Core User Journeys

### Primary Use Cases (From User Examples)

1. **Project-to-Executive Matching**
   - "I'm working on a documentary about police investigating tramadol in Saudi Arabia. Who should I pitch it to?"
   - "Who is the best person to pitch a rom-com TV show at Netflix in Los Angeles right now?"

2. **Pitch Strategy Development**
   - "How do I craft my pitch to her? What do I need to focus on?"
   - "What does [executive] care about most in pitches?"

3. **Executive Intelligence**
   - "What has Dan Lin greenlit this year?"
   - "What is [executive]'s current mandate?"

4. **Trend Research**
   - "What genres is Netflix greenlighting right now?"
   - "What are the hot topics in documentary right now?"

---

## 📱 Simplified App Structure

### REMOVE:
- ❌ Dashboard page
- ❌ Advanced search
- ❌ Filter panels
- ❌ Table view
- ❌ Breaking news section
- ❌ Trending topics section
- ❌ Complex navigation

### KEEP (Simplified):
- ✅ Landing page with recent mandates (browse mode)
- ✅ Query page (conversational interface)
- ✅ Export chat functionality

### NEW FLOW:
```
Login → Landing Page → Query Page → Export
         (browse)      (ask & learn)   (save)
```

---

## 🏠 Landing Page Redesign

### Purpose
Quick browse of recent mandates + clear entry to query mode

### Layout

```
┌─────────────────────────────────────────────────────┐
│  [Logo] Mandate Wizard              [Profile] [Logout]│
├─────────────────────────────────────────────────────┤
│                                                       │
│   Find the Right Executive for Your Project          │
│   Get pitch intelligence in seconds                  │
│                                                       │
│   [Start Query →]  ← Big, prominent CTA              │
│                                                       │
├─────────────────────────────────────────────────────┤
│  Recent Mandates & Greenlights                       │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Card 1   │  │ Card 2   │  │ Card 3   │          │
│  │ Netflix  │  │ Amazon   │  │ Disney+  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Card 4   │  │ Card 5   │  │ Card 6   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  [View More]                                         │
└─────────────────────────────────────────────────────┘
```

### Key Changes

**1. Hero Section - Simplified**
```jsx
<section className="py-20 text-center">
  <h1 className="text-5xl font-bold mb-4">
    Find the Right Executive for Your Project
  </h1>
  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
    Get instant pitch intelligence: who to contact, what they're looking for, 
    and how to craft your pitch
  </p>
  <Button size="lg" className="text-lg px-12 py-6">
    Start Query →
  </Button>
</section>
```

**2. Recent Mandates - Compact Cards**
- Show 6-9 cards maximum
- Simpler card design (no complex metadata)
- Click card → opens query page with pre-filled question about that executive/project

**Card Design:**
```jsx
<Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
  <div className="flex items-start gap-3">
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
      <span className="text-lg">🎬</span>
    </div>
    <div className="flex-1">
      <h3 className="font-semibold mb-1">Kennedy Corrin</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Manager, Drama Series Development • Netflix
      </p>
      <p className="text-xs text-muted-foreground line-clamp-2">
        Seeking diverse, high-quality drama series with global appeal...
      </p>
    </div>
  </div>
</Card>
```

**3. Remove Everything Else**
- No breaking news section
- No trending topics
- No filters
- No advanced search
- No view toggles

---

## 💬 Query Page Redesign

### Purpose
Smooth, conversational interface optimized for pitch intelligence queries

### Layout - Empty State

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Home                        [Export Chat] │
├─────────────────────────────────────────────────────┤
│                                                       │
│                  Mandate Wizard                       │
│         Your Pitch Intelligence Assistant             │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ What I can help you with:                    │   │
│  │                                               │   │
│  │ • Find the right executive for your project  │   │
│  │ • Research executive mandates & priorities   │   │
│  │ • Craft pitch strategies                     │   │
│  │ • Track recent greenlights & trends          │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  Try asking:                                         │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🎬 Who should I pitch a documentary about    │   │
│  │    police investigating tramadol in Saudi    │   │
│  │    Arabia?                                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 💕 Who is the best person to pitch a rom-com │   │
│  │    TV show at Netflix in Los Angeles?        │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📊 What has Dan Lin greenlit this year?      │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Type your question...                        │   │
│  │                                          [→] │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Layout - Conversation State

```
┌─────────────────────────────────────────────────────┐
│  ← Back to Home                        [Export Chat] │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ You                                          │   │
│  │ Who should I pitch a documentary about       │   │
│  │ police investigating tramadol in Saudi       │   │
│  │ Arabia?                                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🎯 Mandate Wizard                            │   │
│  │                                               │   │
│  │ Based on your documentary project, I         │   │
│  │ recommend:                                    │   │
│  │                                               │   │
│  │ 1. Chris Castallo                            │   │
│  │    Director, Amazon Studios                  │   │
│  │    📍 Unscripted Television                  │   │
│  │                                               │   │
│  │    Why: Leads Amazon's unscripted slate      │   │
│  │    with focus on docu-series and true        │   │
│  │    crime content...                          │   │
│  │                                               │   │
│  │ 2. [Executive Name]                          │   │
│  │    [Title]                                   │   │
│  │    ...                                        │   │
│  │                                               │   │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │   │
│  │ Confidence: ████████░░ 85%                   │   │
│  │                                               │   │
│  │ Follow-up questions:                         │   │
│  │ • How do I craft my pitch to Chris Castallo? │   │
│  │ • What has Chris Castallo greenlit recently? │   │
│  │ • Who else at Amazon handles documentaries?  │   │
│  │                                               │   │
│  │ [View 3 sources]                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Type your question...                   [→] │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Key Design Principles

**1. Clean, Focused Layout**
- Maximum width: 800px (readable conversation width)
- Generous white space
- No sidebars or complex UI elements
- Single column, scrollable conversation

**2. Clear Visual Hierarchy**
```
User messages:     Right-aligned, blue background, compact
Assistant messages: Left-aligned, white background, detailed
Follow-ups:        Small chips below assistant message
Sources:           Collapsible panel at bottom of message
```

**3. Smart Empty State**
- Explain what the tool can do
- Show 3-4 example queries (actual user scenarios)
- Make examples clickable (pre-fill input)
- Use emojis to make examples scannable

**4. Optimized Message Cards**

**User Message:**
```jsx
<div className="flex justify-end mb-4">
  <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3">
    <p className="text-sm">{message}</p>
  </div>
</div>
```

**Assistant Message:**
```jsx
<div className="flex justify-start mb-6">
  <div className="max-w-[85%]">
    {/* Avatar */}
    <div className="flex items-start gap-3 mb-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
        MW
      </div>
      <div className="text-xs text-muted-foreground">Mandate Wizard</div>
    </div>
    
    {/* Content */}
    <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border p-4">
      <ReactMarkdown className="prose prose-sm max-w-none">
        {content}
      </ReactMarkdown>
      
      {/* Confidence indicator - compact */}
      {confidence && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Confidence:</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{width: `${confidence * 100}%`}}
              />
            </div>
            <span className="font-medium">{Math.round(confidence * 100)}%</span>
          </div>
        </div>
      )}
      
      {/* Follow-up questions - compact chips */}
      {followups && followups.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Continue with:</p>
          <div className="flex flex-wrap gap-2">
            {followups.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSubmit(q)}
                className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Sources - collapsible */}
      {sources && sources.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => setShowSources(!showSources)}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View {sources.length} sources</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showSources ? 'rotate-180' : ''}`} />
          </button>
          {showSources && (
            <div className="mt-2 space-y-2">
              {sources.map((source, i) => (
                <div key={i} className="text-xs p-2 bg-gray-50 rounded border">
                  <div className="font-medium">{source.title}</div>
                  <div className="text-muted-foreground">{source.platform}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
</div>
```

**5. Input Area - Always Visible**
```jsx
<div className="sticky bottom-0 bg-white border-t p-4 shadow-lg">
  <div className="max-w-3xl mx-auto">
    <div className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(input);
          }
        }}
        placeholder="Ask about executives, mandates, or pitch strategy..."
        className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <Button
        onClick={() => handleSubmit(input)}
        disabled={!input.trim() || loading}
        size="lg"
        className="px-6 rounded-xl"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </div>
  </div>
</div>
```

---

## 🎨 Visual Design System

### Colors
```css
/* Primary - Blue (trust, intelligence) */
--primary: 217 91% 60%;        /* #3B82F6 */
--primary-foreground: 0 0% 100%;

/* Background - Clean white/gray */
--background: 0 0% 100%;        /* #FFFFFF */
--foreground: 222 47% 11%;      /* #0F172A */

/* Muted - Subtle gray */
--muted: 210 40% 96%;           /* #F8FAFC */
--muted-foreground: 215 16% 47%; /* #64748B */

/* Accent - Purple (AI, intelligence) */
--accent: 262 83% 58%;          /* #8B5CF6 */

/* Success - Green (confidence) */
--success: 142 71% 45%;         /* #22C55E */
```

### Typography
```css
/* Headings - Bold, clear */
h1: 'Inter', 48px, 700, -0.02em
h2: 'Inter', 32px, 700, -0.01em
h3: 'Inter', 24px, 600, -0.01em

/* Body - Readable */
body: 'Inter', 16px, 400, 0em
small: 'Inter', 14px, 400, 0em
xs: 'Inter', 12px, 400, 0em

/* Message content - Slightly larger */
.message-content: 'Inter', 15px, 400, 0.01em
```

### Spacing
```css
/* Consistent spacing scale */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;

/* Message spacing */
--message-gap: 24px;      /* Between messages */
--message-padding: 16px;  /* Inside message cards */
--section-gap: 12px;      /* Between sections in message */
```

### Shadows
```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);

/* Message cards */
.message-card: shadow-sm border
.message-card:hover: shadow-md
```

### Border Radius
```css
/* Rounded, friendly */
--radius-sm: 8px;   /* Small elements */
--radius-md: 12px;  /* Cards */
--radius-lg: 16px;  /* Messages */
--radius-xl: 20px;  /* Input field */
--radius-full: 9999px; /* Pills, avatars */
```

---

## 📤 Export Chat Feature

### Placement
- Top-right corner of query page
- Always visible (sticky header)
- Clear icon + text

### Button Design
```jsx
<Button 
  variant="outline" 
  onClick={handleExport}
  className="flex items-center gap-2"
>
  <Download className="w-4 h-4" />
  Export Chat
</Button>
```

### Export Options Modal
```jsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Export Conversation</DialogTitle>
      <DialogDescription>
        Save this conversation for your records
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-3">
      <Button 
        onClick={() => exportAs('pdf')}
        className="w-full justify-start"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export as PDF
      </Button>
      
      <Button 
        onClick={() => exportAs('markdown')}
        variant="outline"
        className="w-full justify-start"
      >
        <FileCode className="w-4 h-4 mr-2" />
        Export as Markdown
      </Button>
      
      <Button 
        onClick={() => exportAs('text')}
        variant="outline"
        className="w-full justify-start"
      >
        <FileText className="w-4 h-4 mr-2" />
        Export as Text
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

### Export Format (PDF/Markdown)

**Header:**
```
Mandate Wizard - Pitch Intelligence
Conversation Export
Date: November 2, 2025
```

**Content:**
```
Q: Who should I pitch a documentary about police investigating tramadol in Saudi Arabia?

A: Based on your documentary project, I recommend:

1. Chris Castallo
   Director, Amazon Studios
   Focus: Unscripted Television
   
   Why: Leads Amazon's unscripted slate with focus on docu-series and true crime content...

Confidence: 85%

Sources:
- Chris Castallo profile (Amazon Studios)
- Recent unscripted greenlights (Amazon)

---

Q: How do I craft my pitch to Chris Castallo?

A: [Response content]

...
```

---

## 🎯 Example Query Suggestions (Empty State)

### Category: Project Matching
```
🎬 "Who should I pitch a documentary about police investigating tramadol in Saudi Arabia?"

💕 "Who is the best person to pitch a rom-com TV show at Netflix in Los Angeles?"

🎭 "I have a limited series about a female detective in Tokyo. Who should I contact?"

🎸 "Who handles music documentaries at Prime Video?"
```

### Category: Executive Intelligence
```
📊 "What has Dan Lin greenlit this year?"

🎯 "What is Kennedy Corrin's current mandate at Netflix?"

📈 "What genres is Chris Castallo prioritizing right now?"

🌍 "Who handles international content at Disney+?"
```

### Category: Pitch Strategy
```
💡 "How do I craft my pitch to [executive]? What should I focus on?"

📝 "What does [executive] look for in pitches?"

🎪 "What are the key elements of a successful pitch to Netflix drama executives?"
```

### Category: Trends
```
🔥 "What genres are hot at Netflix right now?"

📺 "What types of limited series are getting greenlit?"

🌎 "What international markets are streamers focusing on?"
```

---

## 🚀 Implementation Priority

### Phase 1: Core Conversational UI (Week 1)
- [ ] Simplify landing page (remove dashboard, filters, etc.)
- [ ] Redesign query page with clean conversation layout
- [ ] Implement optimized message cards (user + assistant)
- [ ] Add smart empty state with example queries
- [ ] Make follow-up chips clickable and natural
- [ ] Improve confidence indicator (compact bar)
- [ ] Make sources collapsible (not prominent)

### Phase 2: Polish & Export (Week 1)
- [ ] Add export chat button
- [ ] Implement PDF export
- [ ] Implement Markdown export
- [ ] Implement Text export
- [ ] Add sticky input at bottom
- [ ] Improve loading states
- [ ] Add smooth scroll to new messages

### Phase 3: Smart Features (Week 2)
- [ ] Context-aware follow-up suggestions
- [ ] Quick actions (e.g., "Email this executive")
- [ ] Save conversation to account
- [ ] Share conversation link
- [ ] Keyboard shortcuts (Enter to send, Cmd+K for quick actions)

---

## 📐 Responsive Design

### Desktop (1024px+)
- Max content width: 800px (centered)
- Generous side margins
- Sticky input at bottom
- Export button in top-right

### Tablet (768px - 1023px)
- Max content width: 700px
- Reduced margins
- Same layout as desktop

### Mobile (< 768px)
- Full width (with padding)
- Larger touch targets (48px minimum)
- Simplified message cards
- Sticky input with larger buttons
- Export in menu (hamburger)

---

## ⚡ Performance Optimizations

### Loading States
```jsx
// Typing indicator while AI is thinking
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <div className="flex gap-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
  </div>
  <span>Searching mandates...</span>
</div>
```

### Optimistic UI
- Show user message immediately
- Show typing indicator while waiting
- Stream assistant response if possible
- Smooth scroll to new messages

### Caching
- Cache recent conversations in localStorage
- Cache example queries
- Prefetch common executive profiles

---

## 🎨 Micro-interactions

### Message Appearance
- Fade in + slide up animation
- Stagger follow-up chips (cascade effect)
- Smooth expand/collapse for sources

### Input Focus
- Subtle glow on focus
- Auto-focus after sending message
- Clear button appears on input

### Button States
- Hover: Slight scale (1.02)
- Active: Scale down (0.98)
- Loading: Spin animation
- Disabled: Opacity 0.5

### Scroll Behavior
- Auto-scroll to new messages
- Smooth scroll (not instant)
- Show "scroll to bottom" button if user scrolls up

---

## 📱 Mobile-Specific Optimizations

### Input Handling
- Auto-resize textarea as user types
- Show character count if approaching limit
- Prevent zoom on input focus (font-size: 16px minimum)

### Touch Targets
- Minimum 48px × 48px for all buttons
- Larger follow-up chips (easier to tap)
- Swipe to delete message (optional)

### Keyboard
- Hide keyboard after sending message
- Show keyboard shortcuts hint on desktop

---

## 🧪 A/B Testing Ideas

### Variation 1: Guided Onboarding
- Show 3-step tutorial on first visit
- "Tell me about your project" → "I'll find the right executive" → "Get pitch strategy"

### Variation 2: Project Type Selector
- Instead of free-form input, start with:
  - "What type of project do you have?"
  - [Documentary] [Series] [Film] [Unscripted]
- Then ask follow-up questions

### Variation 3: Executive Directory
- Add "Browse Executives" tab
- List all executives with search/filter
- Click executive → pre-fill query about them

---

## ✅ Success Metrics

### User Engagement
- Time to first query (should be < 30 seconds)
- Queries per session (target: 3-5)
- Follow-up click rate (target: > 40%)
- Export rate (target: > 20% of sessions)

### User Satisfaction
- Query success rate (user gets actionable answer)
- Repeat usage rate (come back within 7 days)
- Referral rate (share with colleagues)

### Performance
- Time to first response (target: < 5 seconds)
- Page load time (target: < 2 seconds)
- Input lag (target: < 100ms)

---

## 🎯 Key Takeaways

**DO:**
- ✅ Focus on conversation flow
- ✅ Make follow-ups natural and clickable
- ✅ Keep UI minimal and clean
- ✅ Use real user examples in empty state
- ✅ Make export prominent and easy
- ✅ Show confidence clearly but subtly
- ✅ Optimize for pitch intelligence use case

**DON'T:**
- ❌ Overwhelm with features
- ❌ Show complex filters/options
- ❌ Make sources too prominent
- ❌ Use technical jargon
- ❌ Require multiple steps to ask question
- ❌ Hide the input field
- ❌ Make follow-ups hard to click

---

**This redesign transforms Mandate Wizard from a complex intelligence platform into a focused, conversational pitch intelligence tool that content creators can use naturally and efficiently.**

