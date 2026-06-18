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