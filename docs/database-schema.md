# Treescapes MVP Database Schema

## Purpose

This document defines the first version of the data model for the Treescapes multi-tenant evaluation app.

The main rule is:

- management company users can only access records tied to their own `management_company_id`
- Treescapes admins can access records across all management companies

## Foundation Tables

These three tables should be designed first because they define tenant ownership.

### 1. `management_companies`

Represents the client organization that owns sites and employs evaluators using the app.

Suggested columns:

- `id`: integer, primary key
- `name`: string, required, unique
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- each management company can have many users
- each management company can have many sites
- examples: `Frasers`, `Company B`, `Company C`

### 2. `users`

Represents a person who can log into the system.

Suggested columns:

- `id`: integer, primary key
- `email`: string, required, unique
- `hashed_password`: string, required
- `full_name`: string, required
- `role`: string, required
- `management_company_id`: integer, foreign key to `management_companies.id`, nullable for Treescapes admins
- `is_active`: boolean, required, default `true`
- `created_at`: datetime, required
- `updated_at`: datetime, required

Role rules:

- `company_user`: belongs to exactly one management company
- `treescapes_admin`: can have `management_company_id = null`

Notes:

- do not store plain text passwords
- use password hashing in the backend
- if a user is a company user, their `management_company_id` must not be null

### 3. `sites`

Represents a physical landscape site that is evaluated.

Suggested columns:

- `id`: integer, primary key
- `name`: string, required
- `code`: string, optional but recommended, unique within a company
- `address`: string, optional
- `management_company_id`: integer, foreign key to `management_companies.id`, required
- `is_active`: boolean, required, default `true`
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- every site belongs to exactly one management company
- this table is one of the key tenant boundaries in the system
- when filtering evaluations, the backend should use site ownership to enforce tenant access

## Remaining Core Tables

The Frasers Tower checklist PDF shows that the real evaluation form is section-based, not just a flat list of items.

The key structural ideas from the real form are:

- one reusable checklist template
- multiple named sections inside the template, such as `A. Safe & Pleasant Environment`
- multiple checklist items inside each section, such as `A1`, `A2`, `B1`
- per-item `max points`, awarded `score`, and `remarks`
- evaluation-level summary fields such as total score, percentage, benchmark/payment band, and follow-up comments

### 4. `checklist_templates`

Represents a reusable evaluation template.

Suggested columns:

- `id`: integer, primary key
- `name`: string, required
- `description`: string, optional
- `version`: string, optional but recommended
- `is_active`: boolean, required, default `true`
- `created_by_user_id`: integer, foreign key to `users.id`, optional
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- Treescapes admins manage these templates
- for MVP, a site can use one default active template
- example template name: `Treescapes Landscape Performance Checklist`
- versioning will help if the checklist changes in future

### 5. `checklist_sections`

Represents major grouped scoring sections inside a checklist template.

Examples from the Frasers checklist:

- `A. Safe & Pleasant Environment`
- `B. Safety & Property`
- `C. Responsiveness`
- `D. Reports`
- `E. Staff Competency`
- `F. Statutory Compliance`

Suggested columns:

- `id`: integer, primary key
- `template_id`: integer, foreign key to `checklist_templates.id`, required
- `code`: string, required
- `title`: string, required
- `max_points`: numeric, required
- `display_order`: integer, required
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- `code` would hold values like `A`, `B`, `C`
- `max_points` would hold section totals like `19`, `6`, `9`
- the mobile app can use this table to render grouped checklist sections in the same order as the paper form

### 6. `checklist_items`

Represents one inspection row within a checklist section.

Suggested columns:

- `id`: integer, primary key
- `section_id`: integer, foreign key to `checklist_sections.id`, required
- `code`: string, required
- `description`: string, required
- `max_points`: numeric, required
- `display_order`: integer, required
- `is_active`: boolean, required, default `true`
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- `code` would hold values like `A1`, `A2`, `B1`
- this checklist uses explicit `max points`, so `max_points` is a better fit than a generic `weight` field
- the `description` should store the full inspection wording from the real form
- admins should be able to reorder items using `display_order`

### 7. `evaluations`

Represents one submitted evaluation for one site on one date.

Suggested columns:

- `id`: integer, primary key
- `site_id`: integer, foreign key to `sites.id`, required
- `evaluator_id`: integer, foreign key to `users.id`, required
- `template_id`: integer, foreign key to `checklist_templates.id`, required
- `evaluation_date`: date, required
- `submitted_at`: datetime, required
- `total_score`: numeric, required
- `percentage`: numeric, required
- `benchmark_band`: string, optional
- `general_comments`: string, optional
- `site_in_charge_name`: string, optional
- `horticulturist_in_charge_name`: string, optional
- `status`: string, required, default `submitted`
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- tenant access should be enforced through the `site_id`
- the Frasers checklist summary page includes percentage and benchmark/payment interpretation, so those belong at evaluation level
- benchmark examples from the PDF include values like `Bonus Incentive (1%)`, `Full Payment`, `90% payment`
- for MVP, the main status can simply be `submitted`
- later, status values could include `draft`, `submitted`, `reviewed`

### 8. `evaluation_responses`

Represents one answer to one checklist item inside an evaluation.

Suggested columns:

- `id`: integer, primary key
- `evaluation_id`: integer, foreign key to `evaluations.id`, required
- `checklist_item_id`: integer, foreign key to `checklist_items.id`, required
- `score`: numeric, required
- `remarks`: string, optional
- `created_at`: datetime, required
- `updated_at`: datetime, required

Notes:

- each evaluation will usually have many response rows
- one row per checklist item is the cleanest structure for analytics and auditing
- this maps directly to the form columns `Score` and `Remarks`

### 9. `uploaded_photos`

Represents supporting photo evidence tied to a response.

Suggested columns:

- `id`: integer, primary key
- `evaluation_response_id`: integer, foreign key to `evaluation_responses.id`, required
- `storage_path`: string, required
- `file_name`: string, optional
- `content_type`: string, optional
- `uploaded_at`: datetime, required

Notes:

- `storage_path` should point to the file in Supabase Storage
- the mobile app should upload through FastAPI, not directly to Supabase

## Relationships Summary

- one `management_company` has many `users`
- one `management_company` has many `sites`
- one `checklist_template` has many `checklist_sections`
- one `checklist_section` has many `checklist_items`
- one `site` has many `evaluations`
- one `user` can submit many `evaluations`
- one `evaluation` has many `evaluation_responses`
- one `evaluation_response` can have many `uploaded_photos`

## Tenant Access Rules

These rules should guide backend design from day one.

### Company User

A `company_user` can:

- view their own profile
- view only sites where `sites.management_company_id = current_user.management_company_id`
- view only evaluations belonging to those sites
- create evaluations only for those sites

A `company_user` cannot:

- view another company's sites
- view another company's evaluations
- manage templates globally

### Treescapes Admin

A `treescapes_admin` can:

- view all companies
- view all sites
- view all evaluations
- manage checklist templates and items
- access analytics across companies

## Recommended Indexes

Add indexes to fields used often in auth, filtering, and joins.

Recommended indexes:

- `users.email`
- `users.management_company_id`
- `sites.management_company_id`
- `checklist_sections.template_id`
- `checklist_items.section_id`
- `evaluations.site_id`
- `evaluations.evaluator_id`
- `evaluations.evaluation_date`
- `evaluation_responses.evaluation_id`
- `evaluation_responses.checklist_item_id`
- `uploaded_photos.evaluation_response_id`

## Suggested Constraints

- `users.email` should be unique
- `management_companies.name` should be unique
- a `company_user` should not have a null `management_company_id`
- a `treescapes_admin` may have a null `management_company_id`
- `checklist_sections.code` should be unique within a template
- `checklist_items.code` should be unique within a section or template
- `score` should be validated so it does not exceed the checklist item's `max_points`
- `max_points` should be greater than zero

## First Implementation Recommendation

When you start coding, implement these tables first:

1. `management_companies`
2. `users`
3. `sites`

Then add:

4. `checklist_templates`
5. `checklist_sections`
6. `checklist_items`
7. `evaluations`
8. `evaluation_responses`
9. `uploaded_photos`

## Frasers Checklist Mapping

This is how the referenced Frasers Tower PDF maps into the revised schema.

### Template

- template name: `Treescapes Landscape Performance Checklist`
- example version: `2026-05`

### Sections

- `A` -> `Safe & Pleasant Environment` -> `19`
- `B` -> `Safety & Property` -> `6`
- `C` -> `Responsiveness` -> `9`
- `D` -> `Reports` -> `2`
- `E` -> `Staff Competency` -> `11`
- `F` -> `Statutory Compliance` -> `10`

### Items

Examples:

- `A1` -> `Length of grass is no longer than 5cm at all times.` -> `1`
- `A2` -> `Tree branches / shrubs are not blocking any important signage or passageways at all times.` -> `3`
- `B1` -> `Total number of non-compliance incidents relating to operational & safety procedures each month not more than 1 occasion monthly.` -> `2`
- `F1` -> `Complying with the statutory regulations (MOM, NParks, NEA etc.)` -> `10`

### Evaluation Summary Fields

The last page of the PDF shows why the evaluation table needs summary fields:

- section totals
- `total_score`
- `percentage`
- `benchmark_band`
- `general_comments`
- `site_in_charge_name`
- `horticulturist_in_charge_name`
