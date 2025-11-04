# Buyer Testing Summary - 32 Queries Complete

**Date:** November 2, 2025  
**Progress:** 32 of 100 queries tested (32%)  
**Method:** Direct API calls to `/query` endpoint with dev bypass email

---

## Executive Summary

### System Performance

**Overall Success Rate:** ~25% (queries that returned actionable data)

**Success by Category:**
- Executive intelligence: 90% ⭐⭐⭐⭐⭐
- Quantitative analysis (when data exists): 85% ⭐⭐⭐⭐
- Genre/trend guidance: 60% ⭐⭐⭐
- Comparative analysis: 20% ⭐
- Regional analysis: 0% ❌
- Talent deals: 0% ❌
- Success metrics: 0% ❌
- Production timelines: 0% ❌

### Critical Discoveries

**1. Attribution Crisis**

Query 24 revealed executives are each credited with only 1 greenlight despite database having hundreds of projects. This proves the data exists but **relationships are broken**.

**Missing Relationships:**
- Projects → Executives (who greenlit it)
- Projects → Production Companies (who produced it)
- Projects → Showrunners (who created it)
- Projects → Talent Agencies (who represented it)

**2. AI-Generated Data Roadmap**

The system's follow-up questions are exceptional and reveal exactly what data structure buyers need. They essentially write our product requirements document.

**3. Consistent Confidence Scoring**

- 0.80 confidence when saying "information not available" (very confident about gaps)
- 0.50-0.70 confidence when partial data exists
- 0.85+ confidence when complete data available

---

## Data Gaps Identified (Prioritized)

### Tier 1 - CRITICAL (Blocks 70%+ of buyer queries)

1. **Executive-to-project attribution** - Projects not linked to executives who greenlit them
2. **Production company attribution** - Projects not linked to producing companies
3. **Showrunner attribution** - Projects not linked to creators
4. **Success metrics** - No viewership, completion rate, renewal data, awards
5. **Greenlight dates** - Cannot filter by time period or calculate trends
6. **Production timeline data** - No greenlight → production → release tracking

### Tier 2 - HIGH (Blocks 40-60% of buyer queries)

7. **Talent deals** - No director/actor/writer first-look or overall deals
8. **Budget information** - No project budgets or platform investment breakdowns
9. **Regional metadata** - No country/region tags on projects
10. **Format specifications** - No episode count, runtime, season structure
11. **Cancellation/renewal data** - No outcome tracking for shows
12. **IP source tracking** - Cannot distinguish adaptations vs original concepts

### Tier 3 - MEDIUM (Blocks 20-40% of buyer queries)

13. **Diversity/demographic data** - No creator demographic tracking
14. **Talent agency attribution** - No representation data
15. **Platform strategy documentation** - Incomplete competitive intelligence
16. **Emerging talent tracking** - No fellowship/festival winner data
17. **Co-production data** - Cannot identify multi-party productions

---

## Relationship Mapping Needed

The follow-up questions reveal these entity relationships are critical but missing:

```
CURRENT STATE (Isolated entities):
- Projects table (no foreign keys)
- Executives table (no project links)
- Production Companies table (no project links)
- Showrunners table (no project links)

NEEDED STATE (Connected graph):
Projects ←→ Executives (greenlit_by)
Projects ←→ Production Companies (produced_by)
Projects ←→ Showrunners (created_by)
Projects ←→ Talent (directed_by, starring, written_by)
Projects ←→ Agencies (represented_by)
Executives ←→ Mandates (strategic_priorities)
Production Companies ←→ Deals (platform_relationships)
Showrunners ←→ Track Records (previous_projects + success_metrics)
```

---

## Sample Queries & Results

### ⭐⭐⭐⭐⭐ EXCELLENT - Executive Intelligence

**Query:** "Who is Carolina Leconte at Netflix and what is her mandate for Mexican content?"

**Result:** Comprehensive profile with:
- Title: Senior Director of Content for Mexico
- $1B Mexico investment (2025-2028)
- ~20 Mexican productions per year target
- Strategic priorities (authentic Mexican storytelling, production hub positioning)
- Reporting structure (reports to Francisco Ramos)

**Why it worked:** Executive data is well-structured with detailed mandates

---

### ⭐⭐⭐⭐⭐ EXCELLENT - Quantitative Trend Analysis

**Query:** "Which genres are growing fastest in greenlights over the past year? Give me quantitative data."

**Result:** Detailed breakdown:
- Drama: +3 (from 1 to 4 projects, 2024→2025)
- Crime: +2 (from 0 to 2, new category)
- Comedy, Thriller, Reality: +1 each
- Listed all 10 supporting projects
- Calculated year-over-year growth

**Why it worked:** Explicit request for "quantitative data" + data available in database

---

### ⭐⭐⭐ MODERATE - Deal Structures

**Query:** "What are the most common deal structures for production companies with Netflix?"

**Result:** Identified 2 types (Overall Deal, First-Look Deal) with definitions, but:
- No specific examples despite having 19 production company deals in database
- No financial terms
- No term lengths
- Generic answer

**Why partial:** Data exists but not properly tagged/searchable

---

### ⭐⭐ POOR - Platform Investment Comparison

**Query:** "Compare total content investment across Netflix, Amazon Prime Video, and Disney+ for 2024."

**Result:**
- Netflix: $17B ✅
- Amazon: Not available ❌
- Disney+: Not available ❌

**Why failed:** Only 1 of 3 data points available, cannot complete comparison

---

### ⭐ POOR - Regional Trends

**Query:** "Which regions or countries are seeing increased greenlight activity? Show me quantitative trends."

**Result:** "Quantitative trends by region/country: information not available"

Provided workaround: Listed executives with regional mandates as proxy for strategic focus

**Why failed:** No regional/country metadata on projects

---

### ❌ FAILED - Talent Deals

**Query:** "Which A-list directors have first-look or overall deals with streamers?"

**Result:** "Information not available. The provided context does not list any A-list directors with first-look or overall deals."

**Why failed:** Zero talent deal data in database

---

### ❌ FAILED - Showrunner Track Records

**Query:** "What are the track records of top showrunners? Who has the most successful shows on Netflix and Amazon?"

**Result:** Found only 1 project (Forever - Mara Brock Akil). Mentioned Shondaland and Noah Baumbach but no project lists or success metrics.

**Why failed:** No showrunner-to-project attribution, no success metrics

---

## Follow-Up Questions Analysis

The AI's follow-up questions are exceptional and reveal exactly what data buyers need. Examples:

**From Deal Structure Query:**
- "What are the typical term lengths and exclusivity requirements?"
- "How are development funds, overhead, and staffing support structured?"
- "What performance milestones trigger greenlights, bonuses, or renewal options?"

**From Investment Comparison Query:**
- "How do budgets split between originals vs. licensed content?"
- "What portion is allocated to international markets vs. U.S.?"
- "How does investment break down between series, films, and sports rights?"

**From Emerging Talent Query:**
- "Do you want formal deals or also fellowship cohorts (Sundance/Black List/Nicholl)?"
- "Should I include UK/EU/India/LatAm talent?"
- "Any specific genres you care about?"

**Strategic Value:** These questions could serve as a **data schema specification** - the AI is telling us exactly what fields and relationships to build.

---

## Recommendations

### Immediate (Week 1)

**1. Fix Attribution Relationships**
- Link projects to executives who greenlit them
- Link projects to production companies
- Link projects to showrunners
- This alone would unlock 50%+ of blocked queries

**2. Add Greenlight Dates**
- Enable time-based filtering ("last 6 months")
- Enable trend analysis (year-over-year growth)
- Support recency sorting

**3. Add Basic Format Metadata**
- Episode count
- Runtime
- Season structure (limited vs ongoing)
- Format type (series, film, special)

### Short-term (Week 2-3)

**4. Add Success Metrics**
- Viewership hours
- Completion rate
- Renewal status
- Awards won
- Critical scores

**5. Add Regional Metadata**
- Production country
- Production region (LATAM, EMEA, APAC, etc.)
- Target markets
- Language

**6. Add Budget Data**
- Platform investment amounts (all major streamers)
- Project budget ranges
- Regional allocation breakdowns

### Medium-term (Week 4-6)

**7. Add Talent Deal Data**
- Director first-look/overall deals
- Actor deals
- Writer/showrunner deals
- Deal terms and announcement dates

**8. Add Production Timeline Data**
- Production status (development → release)
- Greenlight date
- Production start date
- Release date
- Milestone tracking

**9. Add IP Source Tracking**
- Original vs adaptation
- Source material (book, true story, remake, etc.)
- IP owner/licensor

---

## Testing Methodology Notes

**What Works:**
- Direct API calls with curl
- Parallel batch testing (10 queries simultaneously)
- Dev bypass email (bradley@projectbrazen.com)
- 30-min query cache (need to account for in testing)

**What Doesn't Work:**
- Browser automation (URL mismatch issues)
- Sequential testing (too slow for 100 queries)

**Response Times:**
- Average: 40-60 seconds per query
- Batch processing: ~3 minutes for 10 queries (with staggering)

---

## Next Steps

**Remaining Testing:**
- 68 queries left (queries 33-100)
- Estimated time: 4-5 hours at current pace
- Expected to identify 30-40 additional data gaps

**After Testing:**
1. Compile complete data gap analysis
2. Create prioritized implementation roadmap
3. Extract all follow-up questions as data schema spec
4. Provide recommendations for database expansion

---

*Testing continues...*

