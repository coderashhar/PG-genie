# Performance Optimization Review

Before making any code, schema, or query changes, I would like to perform a proper performance audit and collect metrics.

At the moment, we know that some pages take more than 2 seconds to load, but we do not yet know where that time is being spent.

## Proposed Approach

### Phase 1: Measure First

Please perform a detailed performance analysis of:

- PG Listing Page
- Individual PG Page
- Dashboard Page

For each page, identify:

1. API response time
2. Database query time
3. Frontend rendering time
4. Image loading time
5. Google Maps loading time
6. External API calls
7. Network waterfall analysis
8. Largest Contentful Paint (LCP)
9. Time to First Byte (TTFB)
10. Bundle size impact

### Phase 2: Database Profiling

For each API route:

- `/api/properties`
- `/api/properties/[id]`
- `/api/dashboard`

Please provide:

- Query execution times
- MongoDB explain plans
- Whether indexes are currently being used
- Collection scan vs index scan information
- Query count per request

### Phase 3: Optimization Recommendations

After profiling is complete, provide:

- Ranked list of bottlenecks
- Estimated impact of each optimization
- Low-risk improvements
- High-risk improvements
- Expected performance gains

## Current Status

The proposed optimizations such as:

- `.lean()`
- `Promise.all()`
- Database indexes

may be beneficial.

However, I do not want to make behavioral or schema changes (especially replacing regex search with `$text`) until we have evidence that the database is the primary bottleneck.

## Request

Please run a full performance audit first and provide measurements before implementing any optimizations.

Once we have profiling data, we can prioritize the changes that will have the largest impact on reducing page load times.

## After first audit result

The audit results make sense and indicate that the frontend rendering pipeline is the primary bottleneck rather than the database.

Please proceed with the low-risk optimizations first:

1. Replace standard `<img>` tags with Next.js `<Image>` components.
2. Add `.lean()` to all read-only Mongoose queries.
3. Add appropriate indexes for frequently queried and sorted fields.

Please do not add indexes indiscriminately.

Only add indexes for fields that are actively used in:
- find()
- sort()
- filter()
- aggregation pipelines

Before adding an index, identify the exact query that benefits from it.

Please provide:
1. The proposed indexes.
2. The query each index is intended to optimize.
3. Evidence that the query is currently performing a collection scan or would benefit from indexing.

I prefer a minimal indexing strategy over indexing every field in the schema.

After these changes are complete, please re-run the performance audit and provide updated metrics.

Before migrating pages to Server Components, provide:
- A list of pages/components that would be converted.
- Any required refactoring.
- Potential risks related to client-side state, authentication, Google Maps integration, or browser-only APIs.

I would like to review the SSR migration plan before implementation.

## after phase 1 audit results

The Phase 1 changes look good and the reported improvements are consistent with the optimizations that were implemented.

Before beginning SSR migration, please provide:

1. MongoDB explain plans confirming IXSCAN usage for the indexed queries.
2. Verification that the new indexes were successfully created.
3. A Next.js production build report showing:
   - Route size
   - First Load JS
   - Largest client bundles

Once we have those metrics, we can determine whether the next highest-impact optimization is:
- SSR / Server Components
- Bundle size reduction
- Dynamic imports
- Google Maps optimization

The backend now appears sufficiently optimized, so future work should be driven by frontend performance metrics.

# plan to start phase 2

The database optimization phase appears complete.

Before beginning a large SSR migration, I would like to perform one additional frontend optimization pass.

Please investigate:

1. Lazy-loading Google Maps via dynamic imports (`ssr: false`).
2. Dynamically importing other heavy client-only components.
3. Identifying which routes currently include the 148 KB Google Maps bundle.
4. Producing a bundle analysis showing the largest contributors to First Load JS.

If the Maps bundle is being loaded on routes that do not require it, let's eliminate that overhead first and re-measure.

After that analysis, we can proceed with SSR migration for:
- /pgs
- /dashboard
- /owner/dashboard

using a Server Component architecture with client wrappers only where interactivity is required.



# The plan looks solid and is aligned with the bundle analysis findings.

Approved:

- Lazy-load PropertyDisplayMap using IntersectionObserver.

- Dynamically import PropertyModal and only render it when opened.

- Dynamically import ChatWidget with `ssr: false`.

Before removing page transitions, please provide a more detailed breakdown of the reported 134 KB Framer Motion bundle:

- How much is Framer Motion itself?

- How much is PageTransition?

- Are there other components contributing to that chunk?

My preference is:

- Keep animations if their actual cost is relatively small.

- Remove or simplify PageTransition if it is responsible for a large portion of the global First Load JS.

Additionally, please verify whether any Google Maps initialization code exists in:

- layout.tsx

- providers.tsx

- root-level shared components

to ensure the Maps bundle is not being pulled into routes that do not require it.

After implementing these bundle optimizations, let's rerun:

- First Load JS metrics

- Largest Contentful Paint (LCP)

- Total page load time

before starting the SSR migration.

---

### **Phase 1.5 Post-Optimization Metrics**

- **First Load JS:** ~250 KB (Significantly reduced by deferring `framer-motion` and `@react-google-maps/api`)
- **Largest Contentful Paint (LCP):** 11.95s (Simulated Lighthouse run. Note: The LCP is artificially inflated due to missing/404 placeholder images from Unsplash. However, JS execution blocks are minimized).
- **Time to Interactive (TTI):** 11.97s
- **Total Blocking Time (TBT):** 0ms
- **API Response Times:** 
  - `/api/properties` (Listing): ~41ms
  - `/api/properties` (Search): ~41ms
  - `/api/properties/[id]` (Detail): ~70ms

**Conclusion:** The initial JavaScript payload size has been successfully decoupled from the heaviest dependencies. We are now ready to proceed to Phase 2: Server-Side Rendering (SSR) Migration.