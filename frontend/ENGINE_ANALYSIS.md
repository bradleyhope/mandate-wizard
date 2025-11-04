# Mandate Wizard - Query Engine Architecture Analysis

## Current State (October 29, 2025)

### ❌ **LangChain is NOT being used**

Despite being installed (`langchain 1.0.2`), **no Python files in the backend reference LangChain**. The system has been rebuilt with custom components.

---

## Current Architecture

### **Core Engine: HybridRAG (Custom Implementation)**
File: `hybridrag_engine_pinecone.py`

**Key Components:**

1. **Vector Search** - Pinecone
   - 2,723 vectors indexed
   - SentenceTransformers for embeddings (`sentence-transformers`)
   - Semantic search across greenlights, quotes, deals

2. **Graph Search** - Neo4j
   - 618 executives
   - 100 projects (greenlights)
   - Relationship queries for executive-project connections

3. **LLM** - OpenAI GPT-4 Turbo
   - Direct API calls (no LangChain wrapper)
   - Custom prompt templates in `answer_templates.py`
   - Response generation with context fusion

4. **Custom Modules:**
   - `intelligent_search.py` - Search strategy and confidence scoring
   - `answer_enhancer.py` - Post-processing and guidance
   - `smart_followups.py` - Follow-up question generation
   - `comparison_engine.py` - Comparative analysis
   - `data_integration.py` - Data loading (100 projects, 19 execs, 147 quotes)
   - `local_reranker.py` - Result reranking
   - `cache_manager.py` - Response caching

---

## Query Flow

```
User Question
    ↓
Intent Classification (ROUTING/HYBRID/FACTUAL_QUERY/STRATEGIC)
    ↓
Parallel Search:
├── Vector Search (Pinecone) → Semantic matches
├── Graph Search (Neo4j) → Relationship queries
└── Direct Neo4j Greenlights (if genre detected)
    ↓
Context Fusion (combine all results)
    ↓
GPT-4 Turbo Generation (with custom templates)
    ↓
Answer Enhancement
    ↓
Follow-up Generation
    ↓
Response + Logging
```

---

## What's Working Well

✅ **Hybrid search** - Combines vector + graph effectively  
✅ **Custom templates** - Tailored for mandate intelligence  
✅ **Direct Neo4j fallback** - Returns actual greenlights for genre queries  
✅ **Caching** - Improves response times  
✅ **Comprehensive logging** - All queries tracked  

---

## What's NOT Working / Missing

❌ **LangChain integration** - Installed but unused  
❌ **Answer quality inconsistent** - Sometimes returns routing advice instead of factual data  
❌ **Template selection logic** - Doesn't always pick the right template  
❌ **Vector search relevance** - Low scores (0.5-0.53) for some queries  
❌ **Data freshness** - Pinecone might have stale data vs Neo4j  

---

## Recommendations

### **Option 1: Keep Custom System (Current)**
**Pros:**
- Full control over logic
- Already working
- No LangChain overhead

**Cons:**
- Maintenance burden
- Reinventing wheels
- Missing LangChain's advanced features

**Action Items:**
1. Improve template selection logic
2. Re-index Pinecone with latest Neo4j data
3. Add more intent patterns for better classification
4. Tune vector search parameters

### **Option 2: Integrate LangChain**
**Pros:**
- Industry-standard framework
- Advanced RAG patterns built-in
- Better chain-of-thought reasoning
- Easier to maintain

**Cons:**
- Requires refactoring
- Learning curve
- Potential performance overhead

**Action Items:**
1. Create LangChain chains for each intent type
2. Use LangChain's vector store abstractions
3. Implement LangChain's RetrievalQA
4. Add LangChain's memory for conversation tracking

### **Option 3: Hybrid Approach (Recommended)**
Keep the custom HybridRAG core but use LangChain for:
- **Prompt management** - LangChain's PromptTemplate
- **Output parsing** - Structured outputs
- **Memory** - Conversation history
- **Chains** - Complex multi-step reasoning

**Action Items:**
1. Wrap existing search in LangChain retrievers
2. Use LangChain prompts instead of custom templates
3. Add LangChain memory for session tracking
4. Keep custom Neo4j/Pinecone logic

---

## Technical Debt

1. **No LangChain usage** despite installation
2. **Duplicate logic** - Custom implementations of LangChain features
3. **Template proliferation** - Multiple similar templates
4. **Intent classification** - Simple keyword matching (could use LLM)
5. **Data sync** - Pinecone vs Neo4j inconsistency

---

## Performance Metrics

- **Avg Response Time:** 14 seconds (GPT-4 Turbo processing)
- **Vector Search:** 2,723 vectors, ~500ms
- **Graph Search:** 618 nodes, ~200ms
- **Cache Hit Rate:** Unknown (not tracked)

---

## Next Steps

1. **Immediate:** Fix template selection to prefer factual lists over routing
2. **Short-term:** Re-index Pinecone with latest Neo4j data
3. **Medium-term:** Integrate LangChain for prompt/memory management
4. **Long-term:** Migrate to full LangChain RAG architecture

---

**Generated:** October 29, 2025  
**System Version:** Custom HybridRAG v1.0 (No LangChain)

