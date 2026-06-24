# Treescapes MVP Build Plan

## Goal

Build a stakeholder-demo-ready MVP for monthly landscape maintenance evaluations.

The MVP should prove this workflow:

1. a company user logs in
2. the user sees only their own sites
3. the user completes an evaluation
4. the user uploads photo evidence
5. the backend calculates score and grade
6. the user views history
7. a Treescapes admin views cross-company performance data

## Recommended Build Order

### Phase 1: Data Model

Define and agree on:

- tenant ownership
- user roles
- site ownership
- checklist structure
- evaluation structure

Output:

- finalized schema document
- SQLAlchemy model plan
- migration order

### Phase 2: Backend Foundation

Set up:

- FastAPI project structure
- database connection
- SQLAlchemy base and session
- Alembic
- environment variables
- password hashing
- JWT token creation and validation

Output:

- backend boots successfully
- health endpoint works
- auth utilities exist

### Phase 3: Auth and Tenant Access

Implement:

- login endpoint
- current user endpoint
- role checks
- tenant filtering helpers

Output:

- company users can only access their own records
- admin users can access all records

### Phase 4: Evaluation Workflow

Implement:

- list sites
- get active checklist template
- get checklist sections and items in display order
- submit evaluation
- save item responses
- save photo metadata
- calculate section totals
- calculate total score
- calculate percentage
- derive benchmark/payment band

Output:

- one complete submission flow works end to end

### Phase 5: History and Admin Analytics

Implement:

- evaluation history list
- evaluation detail view
- admin overview stats
- admin filters by company, site, and month

Output:

- both user-side and admin-side demo workflows are complete

## What To Avoid Early

Do not start with:

- advanced UI polish
- complicated navigation
- offline support
- notifications
- PDF export
- direct Supabase access from mobile

Those can come later. Early success depends on clean backend rules and one complete workflow.

## Folder Intent

Use the current repo structure like this:

- `backend/app/api/routes`: HTTP endpoints
- `backend/app/core`: config and security
- `backend/app/db`: engine, session, base
- `backend/app/models`: SQLAlchemy models
- `backend/app/schemas`: Pydantic request and response schemas
- `backend/app/services`: business logic
- `backend/app/utils`: reusable helpers
- `backend/alembic/versions`: migrations
- `mobile/src/api`: API client functions
- `mobile/src/features/auth`: login and session logic
- `mobile/src/features/dashboard`: dashboard UI
- `mobile/src/features/evaluations`: checklist, submission, history
- `mobile/src/navigation`: app navigation
- `mobile/src/store`: global app state if needed later
- `mobile/src/types`: shared TypeScript types
- `docs`: planning and architecture notes

## Best Next Step

Before writing code, review [database-schema.md](C:/Users/cheng/Desktop/treescapes/docs/database-schema.md) and make sure you agree with:

- the user roles
- whether admins should have `management_company_id = null`
- whether every site belongs to exactly one company
- how grades should be calculated

Once those decisions are stable, you can start the backend with much less confusion.
