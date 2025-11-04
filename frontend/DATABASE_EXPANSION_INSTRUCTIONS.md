# Database Expansion Instructions for Mandate Wizard
## Detailed Guide for Adding Critical Data & Relationships

**Date:** November 2, 2025  
**Purpose:** Fix the 75% query failure rate by adding missing relationships and metadata  
**Context:** Buyer testing revealed that data exists but relationships are broken, blocking most queries

---

## 🎯 CRITICAL CONTEXT: The Attribution Crisis

**What Testing Revealed:**

When we tested Query 24: *"Which executives have the most greenlights in the past year? Give me a ranked list."*

**Result:** All executives showed only **1 greenlight each** despite the database having hundreds of projects.

**This proves:**
- ✅ Projects exist in Pinecone/Neo4j
- ✅ Executives exist in Neo4j
- ❌ **But they're not connected to each other**

**Impact:** This single issue blocks 50%+ of buyer queries.

**Similar patterns found:**
- Projects exist, production companies exist → not linked
- Projects exist, showrunners exist → not linked
- Projects exist, talent agencies exist → not linked
- Projects exist, but no greenlight dates → cannot filter by time

---

## 📊 Current Database State (What We Have)

### Pinecone Vector DB
**Contains:** Project chunks with embeddings for semantic search

**Current metadata fields:**
- `title` (project name)
- `platform` (Netflix, Prime Video, etc.)
- `type` (greenlight, quote, deal, mandate, etc.)
- `genre` (when available)
- `preview` (text snippet)
- `date` (often "Unknown")

**What's MISSING:**
- `greenlight_date` (specific date, not "Unknown")
- `production_country` / `production_region`
- `episode_count`, `runtime_minutes`, `format_type`
- `executive_id` (who greenlit it)
- `production_company_ids` (who produced it)
- `showrunner_id` (who created it)

### Neo4j Graph DB
**Contains:** Executives with mandates

**Current nodes:**
- `Executive` nodes with properties: name, title, platform, mandate, region
- `Mandate` nodes (sometimes)

**Current relationships:**
- `(Executive)-[:HAS_MANDATE]->(Mandate)` (sometimes)
- `(Executive)-[:WORKS_AT]->(Platform)` (sometimes)

**What's MISSING:**
- `Project` nodes
- `ProductionCompany` nodes
- `Showrunner` nodes
- `TalentAgency` nodes
- Relationships: `(Project)-[:GREENLIT_BY]->(Executive)`
- Relationships: `(Project)-[:PRODUCED_BY]->(ProductionCompany)`
- Relationships: `(Project)-[:CREATED_BY]->(Showrunner)`

---

## 🚀 PHASE 1: CRITICAL FIXES (Do These First)

### Priority 1: Add Greenlight Dates to Existing Projects

**Why:** Enables time-based filtering ("last 6 months", "2024 vs 2023"), trend analysis, recency sorting

**What to do:**

For each project in Pinecone, research and add a specific greenlight date.

**Example - BEFORE (current state):**
```json
{
  "id": "proj_123",
  "title": "Untitled Charlie Brooker Project - Crime Thriller Series",
  "platform": "Netflix",
  "type": "greenlight",
  "genre": "Crime, Thriller",
  "date": "Unknown",
  "metadata": {
    "preview": "Charlie Brooker is developing a new crime thriller series for Netflix..."
  }
}
```

**Example - AFTER (what we need):**
```json
{
  "id": "proj_123",
  "title": "Untitled Charlie Brooker Project - Crime Thriller Series",
  "platform": "Netflix",
  "type": "greenlight",
  "genre": "Crime, Thriller",
  "date": "2024-09-15",  // ← SPECIFIC DATE (YYYY-MM-DD format)
  "metadata": {
    "preview": "Charlie Brooker is developing a new crime thriller series for Netflix...",
    "greenlight_date": "2024-09-15",  // ← ALSO IN METADATA
    "announcement_source": "Deadline Hollywood, Sept 15 2024"  // ← OPTIONAL: source
  }
}
```

**How to find dates:**
1. Search Deadline, Variety, Hollywood Reporter for project announcement
2. Check IMDbPro for production dates
3. Search "[project name] greenlight announcement" on Google
4. If exact date unknown, use first day of month/quarter mentioned
5. If only year known, use January 1 of that year
6. If completely unknown, use "2024-01-01" as placeholder and mark with `"date_confidence": "low"`

**Format rules:**
- Always use ISO 8601 format: `YYYY-MM-DD`
- Use actual announcement date, not production start date
- Add `date_confidence` field: "high" (exact date), "medium" (month known), "low" (year only)

---

### Priority 2: Link Projects to Executives (Attribution)

**Why:** Unlocks executive rankings, track records, specialization analysis

**What to do:**

Create relationships between projects and the executives who greenlit them.

**Step 1: Create Project nodes in Neo4j**

For each project in Pinecone, create a corresponding node in Neo4j:

```cypher
CREATE (p:Project {
  id: "proj_123",
  title: "Untitled Charlie Brooker Project - Crime Thriller Series",
  platform: "Netflix",
  genre: "Crime, Thriller",
  greenlight_date: date("2024-09-15"),
  type: "series",
  status: "development"
})
```

**Step 2: Link to Executives**

Research which executive greenlit each project, then create relationship:

```cypher
MATCH (p:Project {id: "proj_123"})
MATCH (e:Executive {name: "Kennedy Corrin"})
CREATE (p)-[:GREENLIT_BY {
  date: date("2024-09-15"),
  confidence: "high"
}]->(e)
```

**How to find which executive greenlit a project:**

1. **Check trade publication announcements** - Often mention executive names
   - Example: "Kennedy Corrin, Netflix's Manager of Drama Series Development, has greenlit..."
   
2. **Match by executive mandate and project genre**
   - Kennedy Corrin = Drama Series → Drama projects
   - Amanda Barclay = Comedy Series → Comedy projects
   - Chris Castallo = Unscripted → Reality/documentary projects

3. **Use regional matching**
   - Carolina Leconte (Mexico) → Mexican productions
   - Francisco Ramos (LATAM) → Latin American content

4. **When uncertain:**
   - Add relationship with `confidence: "medium"` or `"low"`
   - Link to most senior executive in that genre/region
   - Add note: `inferred_from: "mandate_match"`

**Example - Full attribution flow:**

```cypher
// 1. Create project node
CREATE (p:Project {
  id: "proj_charlie_brooker_crime",
  title: "Untitled Charlie Brooker Project - Crime Thriller Series",
  platform: "Netflix",
  genre: "Crime, Thriller",
  greenlight_date: date("2024-09-15"),
  format_type: "series",
  status: "development"
})

// 2. Link to executive (Kennedy Corrin handles drama/thriller)
MATCH (p:Project {id: "proj_charlie_brooker_crime"})
MATCH (e:Executive {name: "Kennedy Corrin", platform: "Netflix"})
CREATE (p)-[:GREENLIT_BY {
  date: date("2024-09-15"),
  confidence: "high",
  source: "Mandate match - Kennedy handles drama/thriller series"
}]->(e)

// 3. Also link to senior executive if known
MATCH (p:Project {id: "proj_charlie_brooker_crime"})
MATCH (e:Executive {name: "Bela Bajaria", title: "Chief Content Officer"})
CREATE (p)-[:APPROVED_BY {
  level: "executive_approval",
  confidence: "medium"
}]->(e)
```

**Batch approach for efficiency:**

If you have 100+ projects to attribute:

1. **Group by genre:**
   - All drama projects → Kennedy Corrin
   - All comedy projects → Amanda Barclay
   - All unscripted → Chris Castallo

2. **Group by region:**
   - All Mexican projects → Carolina Leconte
   - All LATAM projects → Francisco Ramos

3. **Create relationships in batches:**

```cypher
// Batch: All drama series to Kennedy Corrin
MATCH (p:Project)
WHERE p.genre CONTAINS "Drama" AND p.platform = "Netflix" AND p.type = "series"
MATCH (e:Executive {name: "Kennedy Corrin"})
CREATE (p)-[:GREENLIT_BY {
  confidence: "medium",
  inferred_from: "genre_mandate_match"
}]->(e)
```

---

### Priority 3: Add Production Company Attribution

**Why:** Unlocks production company rankings, track records, partnership analysis

**What to do:**

**Step 1: Create ProductionCompany nodes**

```cypher
CREATE (pc:ProductionCompany {
  id: "pc_shondaland",
  name: "Shondaland",
  founded: 2005,
  founder: "Shonda Rhimes",
  headquarters: "Los Angeles, CA"
})
```

**Step 2: Link to platforms via deals**

```cypher
MATCH (pc:ProductionCompany {name: "Shondaland"})
MATCH (platform:Platform {name: "Netflix"})
CREATE (pc)-[:HAS_DEAL_WITH {
  deal_type: "overall",
  start_date: date("2017-08-01"),
  term_length_years: 8,
  exclusivity: "exclusive",
  value_millions: 300,
  status: "active"
}]->(platform)
```

**Step 3: Link projects to production companies**

```cypher
MATCH (p:Project {title: "Bridgerton"})
MATCH (pc:ProductionCompany {name: "Shondaland"})
CREATE (p)-[:PRODUCED_BY {
  role: "primary_producer",
  confidence: "high"
}]->(pc)
```

**How to find production company info:**

1. **Check IMDbPro** - Lists production companies for each project
2. **Check end credits** - Production company logos
3. **Trade publications** - Often mention production companies in announcements
4. **Platform press releases** - List production partners

**Common Netflix production companies to add:**

- Shondaland (Shonda Rhimes) - Drama, overall deal
- Higher Ground (Barack & Michelle Obama) - Documentary, overall deal
- Archewell Productions (Harry & Meghan) - Documentary, overall deal
- Red Notice Productions (Dwayne Johnson) - Action, first-look deal
- Plan B Entertainment (Brad Pitt) - Drama/film, first-look deal
- 21 Laps (Shawn Levy) - Sci-fi/adventure, overall deal
- Makeready (Brad Weston) - Drama/film, first-look deal
- Viacom18 Tipping Point - Indian content partner

**Example - Full production company entry:**

```cypher
// 1. Create production company
CREATE (pc:ProductionCompany {
  id: "pc_21laps",
  name: "21 Laps Entertainment",
  founded: 2008,
  founder: "Shawn Levy",
  headquarters: "Los Angeles, CA",
  specialization: "Sci-fi, Adventure, Family"
})

// 2. Add Netflix deal
MATCH (pc:ProductionCompany {id: "pc_21laps"})
CREATE (platform:Platform {name: "Netflix"})
CREATE (pc)-[:HAS_DEAL_WITH {
  deal_type: "overall",
  start_date: date("2017-07-01"),
  term_length_years: 5,
  exclusivity: "exclusive",
  status: "active",
  announced_in: "Variety, July 2017"
}]->(platform)

// 3. Link to projects
MATCH (p:Project {title: "Stranger Things"})
MATCH (pc:ProductionCompany {id: "pc_21laps"})
CREATE (p)-[:PRODUCED_BY {
  role: "primary_producer",
  confidence: "high"
}]->(pc)

MATCH (p:Project {title: "Shadow and Bone"})
MATCH (pc:ProductionCompany {id: "pc_21laps"})
CREATE (p)-[:PRODUCED_BY {
  role: "primary_producer",
  confidence: "high"
}]->(pc)
```

---

### Priority 4: Add Showrunner Attribution

**Why:** Unlocks showrunner track records, multi-project analysis, talent identification

**What to do:**

**Step 1: Create Showrunner/Talent nodes**

```cypher
CREATE (t:Talent {
  id: "talent_shonda_rhimes",
  name: "Shonda Rhimes",
  role: "showrunner",
  also_roles: ["writer", "producer", "director"],
  career_stage: "a_list",
  specialization: ["drama", "medical", "political"],
  production_company: "Shondaland"
})
```

**Step 2: Link projects to showrunners**

```cypher
MATCH (p:Project {title: "Bridgerton"})
MATCH (t:Talent {name: "Shonda Rhimes"})
CREATE (p)-[:CREATED_BY {
  role: "showrunner",
  confidence: "high"
}]->(t)

// Also link as executive producer
CREATE (p)-[:EXECUTIVE_PRODUCED_BY]->(t)
```

**Step 3: Add showrunner deals**

```cypher
MATCH (t:Talent {name: "Shonda Rhimes"})
MATCH (platform:Platform {name: "Netflix"})
CREATE (t)-[:HAS_DEAL_WITH {
  deal_type: "overall",
  start_date: date("2017-08-01"),
  term_length_years: 8,
  value_millions: 300,
  exclusivity: "exclusive",
  status: "active",
  announced_in: "New York Times, August 2017"
}]->(platform)
```

**Key showrunners to add (Netflix examples):**

- Shonda Rhimes - Drama (Bridgerton, Inventing Anna, etc.)
- Ryan Murphy - Drama/anthology (The Watcher, Monster, etc.)
- Mara Brock Akil - Drama (Forever - already in DB)
- Charlie Brooker - Sci-fi/thriller (Black Mirror, etc.)
- Noah Baumbach - Film (Marriage Story, White Noise, etc.)
- The Duffer Brothers - Sci-fi (Stranger Things)
- Lauren Schmidt Hissrich - Fantasy (The Witcher)
- Jenji Kohan - Comedy/drama (Orange is the New Black)

**Example - Full showrunner entry:**

```cypher
// 1. Create talent node
CREATE (t:Talent {
  id: "talent_duffer_brothers",
  name: "The Duffer Brothers",
  full_names: "Matt Duffer and Ross Duffer",
  role: "showrunner",
  also_roles: ["writer", "director", "producer"],
  career_stage: "a_list",
  specialization: ["sci-fi", "horror", "thriller", "nostalgia"],
  breakthrough_project: "Stranger Things",
  representation_agency: "CAA"
})

// 2. Add Netflix overall deal
MATCH (t:Talent {id: "talent_duffer_brothers"})
CREATE (platform:Platform {name: "Netflix"})
CREATE (t)-[:HAS_DEAL_WITH {
  deal_type: "overall",
  start_date: date("2019-02-01"),
  term_length_years: 5,
  value_millions: 150,
  exclusivity: "exclusive",
  status: "active",
  announced_in: "Hollywood Reporter, February 2019"
}]->(platform)

// 3. Link to Stranger Things
MATCH (p:Project {title: "Stranger Things"})
MATCH (t:Talent {id: "talent_duffer_brothers"})
CREATE (p)-[:CREATED_BY {role: "showrunner", confidence: "high"}]->(t)
CREATE (p)-[:WRITTEN_BY]->(t)
CREATE (p)-[:DIRECTED_BY {episodes: "multiple"}]->(t)

// 4. Link to other projects
MATCH (p:Project {title: "Death Note"})  // If they have other projects
MATCH (t:Talent {id: "talent_duffer_brothers"})
CREATE (p)-[:PRODUCED_BY]->(t)
```

---

### Priority 5: Add Format Metadata to Projects

**Why:** Enables format filtering, episode count analysis, runtime pattern identification

**What to add to each project:**

**In Pinecone metadata:**
```json
{
  "title": "Stranger Things",
  "platform": "Netflix",
  "format_type": "ongoing_series",  // ← NEW
  "episode_count": 42,               // ← NEW (total across all seasons)
  "season_count": 4,                 // ← NEW
  "episodes_per_season": [8, 9, 8, 9],  // ← NEW (optional, detailed)
  "runtime_minutes": 50,             // ← NEW (average episode length)
  "total_runtime_hours": 35,         // ← NEW (calculated)
  "genre": "Sci-fi, Horror, Thriller"
}
```

**In Neo4j Project nodes:**
```cypher
MATCH (p:Project {title: "Stranger Things"})
SET p.format_type = "ongoing_series",
    p.episode_count = 42,
    p.season_count = 4,
    p.runtime_minutes = 50,
    p.total_runtime_hours = 35
```

**Format type options:**
- `"limited_series"` - Single season, complete story (e.g., The Queen's Gambit)
- `"ongoing_series"` - Multiple seasons planned (e.g., Stranger Things)
- `"anthology_series"` - New story each season (e.g., Black Mirror)
- `"film"` - Feature film
- `"documentary_series"` - Multi-episode documentary
- `"documentary_film"` - Single documentary
- `"special"` - One-off special (comedy special, holiday special)
- `"reality_series"` - Unscripted/reality show
- `"competition_series"` - Competition/game show

**How to find this info:**
1. **Wikipedia** - Episode lists with counts and runtimes
2. **IMDb** - Technical specs section
3. **Platform pages** - Netflix/Prime show pages list episode counts
4. **Press releases** - Often mention "8-episode limited series" etc.

**Example entries:**

```json
// Limited series example
{
  "title": "The Queen's Gambit",
  "format_type": "limited_series",
  "episode_count": 7,
  "season_count": 1,
  "runtime_minutes": 60,
  "total_runtime_hours": 7
}

// Film example
{
  "title": "The Irishman",
  "format_type": "film",
  "episode_count": 1,
  "runtime_minutes": 209,
  "total_runtime_hours": 3.5
}

// Anthology series example
{
  "title": "Black Mirror",
  "format_type": "anthology_series",
  "episode_count": 27,
  "season_count": 6,
  "runtime_minutes": 60,
  "episodes_per_season": [3, 4, 6, 6, 3, 5]
}
```

---

## 🎯 PHASE 2: HIGH-VALUE ADDITIONS

### Priority 6: Add Regional Metadata

**Why:** Enables geographic trend analysis, regional filtering, international content tracking

**What to add:**

**In Pinecone metadata:**
```json
{
  "title": "La Casa de Papel (Money Heist)",
  "platform": "Netflix",
  "production_country": "ES",           // ← NEW (ISO 3166-1 alpha-2 code)
  "production_region": "EMEA",          // ← NEW
  "production_city": "Madrid",          // ← NEW (optional)
  "language": "es",                     // ← NEW (ISO 639-1 code)
  "target_markets": ["ES", "LATAM", "US"],  // ← NEW
  "dubbed_languages": ["en", "fr", "de", "pt"],  // ← NEW (optional)
  "subtitled_languages": ["en", "fr", "de", "pt", "ja", "ko"]  // ← NEW (optional)
}
```

**Regional classification:**
- `"US"` - United States
- `"CANADA"` - Canada
- `"LATAM"` - Latin America (Mexico, Brazil, Argentina, Colombia, etc.)
- `"EMEA"` - Europe, Middle East, Africa
- `"APAC"` - Asia-Pacific (India, Korea, Japan, Australia, etc.)
- `"MENA"` - Middle East & North Africa (subset of EMEA)

**Country codes (ISO 3166-1 alpha-2):**
- US = United States
- MX = Mexico
- BR = Brazil
- GB = United Kingdom
- KR = South Korea
- IN = India
- JP = Japan
- ES = Spain
- FR = France
- DE = Germany

**Language codes (ISO 639-1):**
- en = English
- es = Spanish
- pt = Portuguese
- fr = French
- de = German
- ja = Japanese
- ko = Korean
- hi = Hindi
- ar = Arabic

**How to find regional info:**
1. **IMDb** - Lists country of origin
2. **Wikipedia** - Production details section
3. **Credits** - Filming locations
4. **Executive mandates** - If Carolina Leconte is involved → Mexico
5. **Language** - Primary dialogue language indicates region

**Example entries:**

```json
// Mexican production
{
  "title": "Nuevo Rico, Nuevo Pobre",
  "production_country": "MX",
  "production_region": "LATAM",
  "production_city": "Mexico City",
  "language": "es",
  "target_markets": ["MX", "LATAM", "US"],
  "executive": "Carolina Leconte"
}

// Korean production
{
  "title": "Squid Game",
  "production_country": "KR",
  "production_region": "APAC",
  "production_city": "Seoul",
  "language": "ko",
  "target_markets": ["KR", "APAC", "US", "GLOBAL"],
  "dubbed_languages": ["en", "es", "pt", "fr", "de", "ja"],
  "global_phenomenon": true
}

// UK production
{
  "title": "The Crown",
  "production_country": "GB",
  "production_region": "EMEA",
  "production_city": "London",
  "language": "en",
  "target_markets": ["GB", "US", "EMEA", "GLOBAL"]
}

// US production
{
  "title": "Stranger Things",
  "production_country": "US",
  "production_region": "US",
  "production_city": "Atlanta, GA",
  "language": "en",
  "target_markets": ["US", "GLOBAL"]
}
```

---

### Priority 7: Add Success Metrics & Performance Data

**Why:** Enables track record analysis, success rankings, renewal rate calculations

**What to add:**

**Create new performance entries in Pinecone:**

```json
{
  "id": "perf_stranger_things_s4",
  "type": "performance",
  "project_id": "proj_stranger_things",
  "project_title": "Stranger Things Season 4",
  "platform": "Netflix",
  "release_date": "2022-05-27",
  
  // Viewership metrics
  "hours_viewed": 1352000000,  // 1.352 billion hours (Netflix Top 10)
  "views_count": 27040000,     // Calculated: hours / avg runtime
  "completion_rate_percent": 78.5,  // % who finished season
  "top_10_weeks": 8,           // Weeks in Netflix Top 10
  "peak_ranking": 1,           // Highest ranking achieved
  
  // Renewal/cancellation
  "renewal_status": "renewed",
  "renewal_date": "2022-07-01",
  "renewal_season_count": 1,   // Renewed for 1 more season (S5)
  "final_season_announced": true,
  
  // Awards
  "awards_won": [
    "Emmy 2022 - Outstanding Sound Editing",
    "SAG 2023 - Outstanding Performance by an Ensemble"
  ],
  "awards_nominated": [
    "Emmy 2022 - Outstanding Drama Series",
    "Emmy 2022 - Outstanding Writing"
  ],
  
  // Critical reception
  "rotten_tomatoes_critics": 89,
  "rotten_tomatoes_audience": 91,
  "metacritic_score": 76,
  "imdb_rating": 8.7,
  
  // Social/cultural impact
  "social_media_mentions": 45000000,  // Optional
  "trending_weeks": 6,                // Optional
  "cultural_impact": "high"           // Optional: high/medium/low
}
```

**How to find performance data:**

**Viewership:**
1. **Netflix Top 10** - Weekly viewership hours (https://top10.netflix.com)
2. **Platform announcements** - Press releases with viewership milestones
3. **Third-party tracking** - Nielsen, Parrot Analytics, Samba TV
4. **Trade publications** - Deadline/Variety report major viewership numbers

**Renewal/Cancellation:**
1. **Platform announcements** - Official renewal/cancellation press releases
2. **Trade publications** - Deadline/Variety break renewal news
3. **Showrunner social media** - Often announce renewals
4. **Wikipedia** - Usually has renewal status

**Awards:**
1. **Emmy database** - https://www.emmys.com
2. **Golden Globes** - https://www.goldenglobes.com
3. **SAG Awards** - https://www.sagawards.org
4. **Critics Choice** - https://www.criticschoice.com
5. **Wikipedia** - Usually has comprehensive awards sections

**Critical scores:**
1. **Rotten Tomatoes** - https://www.rottentomatoes.com
2. **Metacritic** - https://www.metacritic.com
3. **IMDb** - https://www.imdb.com

**Example performance entries:**

```json
// Successful show - renewed
{
  "id": "perf_bridgerton_s1",
  "type": "performance",
  "project_title": "Bridgerton Season 1",
  "platform": "Netflix",
  "release_date": "2020-12-25",
  "hours_viewed": 625000000,
  "completion_rate_percent": 82,
  "renewal_status": "renewed",
  "renewal_date": "2021-01-21",
  "renewal_season_count": 3,  // Renewed for S2, S3, S4
  "awards_won": ["SAG 2021 - Outstanding Performance"],
  "rotten_tomatoes_critics": 82,
  "rotten_tomatoes_audience": 78,
  "cultural_impact": "high"
}

// Cancelled show
{
  "id": "perf_cowboy_bebop",
  "type": "performance",
  "project_title": "Cowboy Bebop",
  "platform": "Netflix",
  "release_date": "2021-11-19",
  "hours_viewed": 74000000,
  "completion_rate_percent": 45,
  "renewal_status": "cancelled",
  "cancellation_date": "2021-12-09",
  "cancellation_reason": "Low viewership and completion rate",
  "rotten_tomatoes_critics": 46,
  "rotten_tomatoes_audience": 61,
  "cultural_impact": "low"
}

// Limited series (no renewal)
{
  "id": "perf_queens_gambit",
  "type": "performance",
  "project_title": "The Queen's Gambit",
  "platform": "Netflix",
  "release_date": "2020-10-23",
  "hours_viewed": 625000000,
  "completion_rate_percent": 87,
  "renewal_status": "limited_series",  // Not applicable
  "awards_won": [
    "Emmy 2021 - Outstanding Limited Series",
    "Golden Globe 2021 - Best Limited Series"
  ],
  "rotten_tomatoes_critics": 92,
  "rotten_tomatoes_audience": 96,
  "cultural_impact": "high"
}
```

---

### Priority 8: Add Platform Investment Data

**Why:** Enables investment comparisons, budget trend analysis, strategic priority identification

**What to add:**

**Create platform budget entries in Pinecone:**

```json
{
  "id": "budget_netflix_2024",
  "type": "platform_budget",
  "platform": "Netflix",
  "year": 2024,
  
  // Total investment
  "total_budget_millions": 17000,  // $17 billion
  "currency": "USD",
  
  // Content type breakdown
  "originals_budget_millions": 14000,
  "licensed_content_budget_millions": 3000,
  
  // Format breakdown
  "series_budget_millions": 10000,
  "films_budget_millions": 5000,
  "unscripted_budget_millions": 1500,
  "animation_budget_millions": 500,
  
  // Regional breakdown
  "us_budget_millions": 8000,
  "emea_budget_millions": 3500,
  "latam_budget_millions": 2000,
  "apac_budget_millions": 3000,
  "canada_budget_millions": 500,
  
  // Year-over-year change
  "yoy_change_percent": 5.9,  // vs 2023
  "previous_year_budget_millions": 16000,
  
  // Strategic notes
  "strategic_priorities": [
    "International expansion",
    "Local language originals",
    "Premium limited series",
    "Unscripted growth"
  ],
  
  // Source
  "source": "Netflix Q4 2023 Earnings Call",
  "source_date": "2024-01-23",
  "source_url": "https://ir.netflix.net/..."
}
```

**How to find platform budget data:**

1. **Investor earnings calls** - Quarterly calls mention content spend
   - Netflix: https://ir.netflix.net
   - Disney: https://thewaltdisneycompany.com/investor-relations
   - Amazon: Search "Amazon Prime Video content spend" in earnings transcripts

2. **Trade publications** - Report on content budgets
   - Variety, Hollywood Reporter, Deadline
   - Search "[platform] content budget 2024"

3. **Industry reports** - Analyst reports estimate budgets
   - MoffettNathanson, Ampere Analysis, Parrot Analytics

4. **Public statements** - Executives mention investment levels
   - Carolina Leconte: "$1B Mexico investment 2025-2028"

**Example platform budget entries:**

```json
// Netflix 2024
{
  "platform": "Netflix",
  "year": 2024,
  "total_budget_millions": 17000,
  "originals_budget_millions": 14000,
  "licensed_content_budget_millions": 3000,
  "series_budget_millions": 10000,
  "films_budget_millions": 5000,
  "us_budget_millions": 8000,
  "international_budget_millions": 9000,
  "source": "Netflix Q4 2023 Earnings Call"
}

// Netflix Mexico (regional detail)
{
  "platform": "Netflix",
  "region": "Mexico",
  "year_range": "2025-2028",
  "total_budget_millions": 1000,
  "annual_budget_millions": 250,
  "projects_per_year": 20,
  "executive": "Carolina Leconte",
  "source": "Carolina Leconte interview, 2024"
}

// Amazon Prime Video 2024 (if available)
{
  "platform": "Prime Video",
  "year": 2024,
  "total_budget_millions": 13000,  // Estimated
  "originals_budget_millions": 10000,
  "licensed_content_budget_millions": 3000,
  "sports_rights_millions": 5000,  // NFL, Premier League, etc.
  "source": "Variety estimate, March 2024",
  "confidence": "medium"
}

// Disney+ 2024 (if available)
{
  "platform": "Disney+",
  "year": 2024,
  "total_budget_millions": 25000,  // Includes all Disney content
  "originals_budget_millions": 15000,
  "licensed_content_millions": 10000,
  "marvel_budget_millions": 5000,
  "star_wars_budget_millions": 3000,
  "source": "Disney Q1 2024 Earnings Call"
}
```

---

## 📝 DATA ENTRY TEMPLATES

### Template 1: New Project with Full Attribution

```cypher
// 1. Create project node in Neo4j
CREATE (p:Project {
  id: "proj_[unique_id]",
  title: "[Project Title]",
  platform: "[Platform Name]",
  genre: "[Genre1, Genre2]",
  greenlight_date: date("YYYY-MM-DD"),
  format_type: "[limited_series|ongoing_series|film|etc]",
  episode_count: [number],
  season_count: [number],
  runtime_minutes: [number],
  production_country: "[ISO code]",
  production_region: "[US|LATAM|EMEA|APAC]",
  language: "[ISO code]",
  status: "[development|production|post|released]"
})

// 2. Link to executive
MATCH (p:Project {id: "proj_[unique_id]"})
MATCH (e:Executive {name: "[Executive Name]"})
CREATE (p)-[:GREENLIT_BY {
  date: date("YYYY-MM-DD"),
  confidence: "[high|medium|low]"
}]->(e)

// 3. Link to production company
MATCH (p:Project {id: "proj_[unique_id]"})
MATCH (pc:ProductionCompany {name: "[Company Name]"})
CREATE (p)-[:PRODUCED_BY {
  role: "primary_producer",
  confidence: "high"
}]->(pc)

// 4. Link to showrunner
MATCH (p:Project {id: "proj_[unique_id]"})
MATCH (t:Talent {name: "[Showrunner Name]"})
CREATE (p)-[:CREATED_BY {
  role: "showrunner",
  confidence: "high"
}]->(t)

// 5. Add to Pinecone with full metadata
// (Use Pinecone upsert API with this JSON)
```

```json
{
  "id": "proj_[unique_id]",
  "title": "[Project Title]",
  "platform": "[Platform]",
  "type": "greenlight",
  "genre": "[Genre1, Genre2]",
  "date": "YYYY-MM-DD",
  "metadata": {
    "preview": "[Description of the project...]",
    "greenlight_date": "YYYY-MM-DD",
    "format_type": "[format]",
    "episode_count": [number],
    "runtime_minutes": [number],
    "production_country": "[ISO code]",
    "production_region": "[region]",
    "language": "[ISO code]",
    "executive_id": "[executive_id]",
    "executive_name": "[Executive Name]",
    "production_company_ids": ["[company_id]"],
    "showrunner_id": "[talent_id]",
    "showrunner_name": "[Showrunner Name]",
    "announcement_source": "[Source, Date]"
  }
}
```

### Template 2: New Executive with Mandate

```cypher
CREATE (e:Executive {
  id: "exec_[unique_id]",
  name: "[Full Name]",
  title: "[Job Title]",
  platform: "[Platform]",
  region: "[US|LATAM|EMEA|APAC|Global]",
  genre_focus: "[Genre1, Genre2]",
  hire_date: date("YYYY-MM-DD"),
  reports_to: "[Senior Executive Name]",
  email: "[email if known]",
  linkedin: "[LinkedIn URL if known]"
})

// Add mandate
CREATE (m:Mandate {
  id: "mandate_[unique_id]",
  executive_id: "exec_[unique_id]",
  description: "[Full mandate description]",
  strategic_priorities: [
    "[Priority 1]",
    "[Priority 2]",
    "[Priority 3]"
  ],
  budget_millions: [number if known],
  projects_per_year: [number if known],
  effective_date: date("YYYY-MM-DD")
})

// Link executive to mandate
MATCH (e:Executive {id: "exec_[unique_id]"})
MATCH (m:Mandate {id: "mandate_[unique_id]"})
CREATE (e)-[:HAS_MANDATE]->(m)

// Link to platform
MATCH (e:Executive {id: "exec_[unique_id]"})
MERGE (platform:Platform {name: "[Platform]"})
CREATE (e)-[:WORKS_AT]->(platform)
```

### Template 3: New Production Company with Deal

```cypher
CREATE (pc:ProductionCompany {
  id: "pc_[unique_id]",
  name: "[Company Name]",
  founded: [year],
  founder: "[Founder Name]",
  headquarters: "[City, State/Country]",
  specialization: "[Genre1, Genre2]",
  notable_projects: ["[Project 1]", "[Project 2]"]
})

// Add platform deal
MATCH (pc:ProductionCompany {id: "pc_[unique_id]"})
MERGE (platform:Platform {name: "[Platform]"})
CREATE (pc)-[:HAS_DEAL_WITH {
  deal_type: "[overall|first_look|project_based]",
  start_date: date("YYYY-MM-DD"),
  term_length_years: [number],
  exclusivity: "[exclusive|non_exclusive]",
  value_millions: [number if known],
  status: "[active|expired]",
  announced_in: "[Source, Date]"
}]->(platform)
```

### Template 4: Performance Data for Existing Project

```json
{
  "id": "perf_[project_id]_[season_or_year]",
  "type": "performance",
  "project_id": "[project_id]",
  "project_title": "[Project Title]",
  "platform": "[Platform]",
  "release_date": "YYYY-MM-DD",
  "hours_viewed": [number],
  "completion_rate_percent": [number],
  "top_10_weeks": [number],
  "renewal_status": "[renewed|cancelled|limited_series]",
  "renewal_date": "YYYY-MM-DD",
  "awards_won": ["[Award 1]", "[Award 2]"],
  "rotten_tomatoes_critics": [number],
  "rotten_tomatoes_audience": [number],
  "metacritic_score": [number],
  "source": "[Where you got this data]"
}
```

---

## 🔍 QUALITY CONTROL CHECKLIST

Before adding any new data, verify:

### For Projects:
- [ ] Greenlight date is specific (YYYY-MM-DD), not "Unknown"
- [ ] Genre is accurate and specific
- [ ] Format type is correctly classified
- [ ] Episode/runtime data is accurate (check Wikipedia/IMDb)
- [ ] Production country/region is correct
- [ ] Executive attribution matches mandate (drama exec → drama project)
- [ ] Production company is verified (check IMDbPro/credits)
- [ ] Showrunner is correct (check credits/press releases)
- [ ] All IDs are unique and follow naming convention

### For Executives:
- [ ] Title is current and accurate
- [ ] Platform is correct
- [ ] Mandate description is detailed (not generic)
- [ ] Strategic priorities are specific
- [ ] Region/genre focus matches actual projects
- [ ] Reporting structure is accurate

### For Production Companies:
- [ ] Company name is official (not abbreviated)
- [ ] Deal type is correct (overall vs first-look)
- [ ] Deal dates are accurate
- [ ] Exclusivity status is verified
- [ ] Projects are correctly attributed

### For Performance Data:
- [ ] Viewership numbers are from official sources
- [ ] Renewal/cancellation status is confirmed
- [ ] Awards are correctly listed (winner vs nominee)
- [ ] Critical scores are current
- [ ] Source is cited

---

## 🚨 COMMON MISTAKES TO AVOID

### 1. Vague Dates
❌ **Wrong:** `"date": "2024"` or `"date": "Unknown"`  
✅ **Right:** `"date": "2024-09-15"` (specific date)

### 2. Missing Attribution
❌ **Wrong:** Creating project without linking to executive  
✅ **Right:** Always create `(Project)-[:GREENLIT_BY]->(Executive)` relationship

### 3. Inconsistent IDs
❌ **Wrong:** Using different ID formats (proj123, project_456, prj-789)  
✅ **Right:** Consistent format: `proj_[descriptive_name]`

### 4. Duplicate Nodes
❌ **Wrong:** Creating "Netflix" platform node multiple times  
✅ **Right:** Use `MERGE` instead of `CREATE` for platforms, companies

### 5. Low Confidence Without Marking
❌ **Wrong:** Guessing attribution without marking confidence  
✅ **Right:** Add `confidence: "low"` or `"medium"` when inferring

### 6. Generic Mandates
❌ **Wrong:** "Responsible for content development"  
✅ **Right:** "Lead and expand unscripted television slate with focus on male 25-54 demographic, docu-series, and entertainment-forward content"

### 7. Missing Sources
❌ **Wrong:** Adding data without noting where it came from  
✅ **Right:** Always include `source: "Deadline, Sept 15 2024"` or similar

---

## 📊 PROGRESS TRACKING

As you add data, track your progress:

### Projects Enhanced:
- [ ] 0-50 projects with greenlight dates
- [ ] 0-50 projects with executive attribution
- [ ] 0-50 projects with production company attribution
- [ ] 0-50 projects with showrunner attribution
- [ ] 0-50 projects with format metadata
- [ ] 0-50 projects with regional metadata

### New Entities Created:
- [ ] 0-10 production company nodes with deals
- [ ] 0-10 showrunner/talent nodes with deals
- [ ] 0-20 performance data entries
- [ ] 0-5 platform budget entries

### Target for Phase 1:
- **100+ projects** with complete attribution (executive, company, showrunner)
- **50+ projects** with greenlight dates
- **50+ projects** with format metadata
- **20+ production companies** with platform deals
- **20+ showrunners** with track records

This should increase query success rate from 25% → 60-70%.

---

## 🎯 TESTING YOUR ADDITIONS

After adding data, test with these queries:

```
"Which executives have the most greenlights in the past year?"
→ Should now show ranked list with counts > 1

"What are the most common episode counts for limited series?"
→ Should now return actual episode count data

"Which production companies are most active in greenlighting projects?"
→ Should now show ranked list with project counts

"Show me thriller series greenlit in the last 6 months"
→ Should now filter by date and genre

"What's Kennedy Corrin's track record? List her greenlit projects."
→ Should now show multiple projects with details
```

If these queries still fail, the attribution relationships aren't properly created.

---

## 📞 QUESTIONS?

If you're unsure about:
- **Which executive greenlit a project** → Match by genre/region mandate
- **Greenlight date** → Use announcement date from trade publications
- **Production company** → Check IMDbPro or end credits
- **Format classification** → Limited series = 1 season, Ongoing = multiple seasons planned
- **Regional classification** → Use production country, not target market
- **Confidence level** → High = confirmed, Medium = inferred from reliable source, Low = best guess

---

**Remember:** The goal is to create a connected graph where buyers can traverse relationships:

```
Executive → Projects → Performance → Success Rate
Production Company → Projects → Genres → Specialization
Showrunner → Projects → Awards → Track Record
Platform → Budget → Regional Allocation → Strategic Priorities
```

Every relationship you add unlocks new query capabilities!

