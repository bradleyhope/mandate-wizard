# Performance Optimization Plan for Mandate Wizard

## Current Issues

### 1. Slow Query Response Time
- Queries take 5-10 seconds to return results
- No caching layer for repeated queries
- Suggested example queries are not pre-warmed

### 2. Data Attribution Crisis
- Dan Lin query returned "Information not available" despite 20 sources
- Executives exist in database but projects aren't linked to them
- This blocks 50%+ of buyer queries (confirmed from testing)

## Speed Optimization Solutions

### Option 1: Backend Query Caching (Recommended)
**Implementation:** Add Redis or in-memory caching to Flask backend

**Benefits:**
- Cache query results for 30 minutes
- Pre-warm cache with suggested queries on startup
- Reduce Pinecone/Neo4j query load
- Instant responses for cached queries

### Option 2: Frontend Optimistic Loading
**Implementation:** Show loading states faster, stream results

**Benefits:**
- Better perceived performance
- Progressive result display

### Option 3: Query Debouncing
**Implementation:** Wait 500ms before executing query

**Benefits:**
- Reduces unnecessary queries while user is typing

## Data Quality Fixes (CRITICAL)

### Issue: Dan Lin Attribution Gap

**Problem:**
- Query: "What has Dan Lin greenlit this year?"
- Backend found 20 sources mentioning Dan Lin
- But couldn't attribute any greenlights to him

**Root Cause:**
- Dan Lin exists as Executive entity in Neo4j
- Greenlight projects exist in Pinecone
- But no relationship connecting them

**Solution:**
Backend needs to add relationships in Neo4j linking executives to their greenlights.

## Implementation Priority

### Phase 1 (Week 1): Quick Wins
1. Add in-memory query caching to backend
2. Pre-warm cache with 4 suggested queries
3. Add cache warming on server restart

**Expected Impact:** 5-10 second queries → <1 second for cached queries

### Phase 2 (Week 2): Data Quality
4. Fix Dan Lin attribution (requires database team)
5. Audit top 20 executives for attribution gaps
6. Add GREENLIT relationships for verified projects

**Expected Impact:** 25% query success rate → 75% query success rate

