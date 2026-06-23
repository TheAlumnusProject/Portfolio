# TAP - Project Plan

## Project INFO
This is the draft project.
We aim to use this project to quickly develop and try things.
If things break, no harm done. But this does not excuse skipping the details.
Once we have a viable project, we can migrate to a new repo, keep what works and throw away what doesn't.

## Vision

A portfolio project created by three recent graduates to:
- Learn new technologies
- Practice collaboration
- Experiment with new ideas
- Showcase our skills to potential employers

---
# Separation Of Concerns

## Frontend
- React/Vue application
- TypeScript code
- UI/UX implementation
- Three.js visualizations
- GraphQL client integration
- Form validatioa
- Frontend testing

## Backend
Owns:
- .NET backend code (or other)
- GraphQL schema
- Business logic
- EF Core (or dapper for more performance)
- PostgreSQL access 
- Authentication and Authorization
- Redis integration in code (But not running and starting Redis)
- Database Migrations

## Infrastructure (Dev Ops)
Owns:
- Running PostgreSQL
- Running Redis
- Rate limiting
- Docker setup and Docker Compose (One click run environment)
- Monitoring and logging
- CI/CD (Build, test and host on pushing to main)

---
# Tech Stack

## Frontend
- [ ] React or Vue
- [ ] TypeScript
- [ ] Three.js

## Backend
- [ ] .NET (or try something new like laravel)
- [ ] GraphQL
- [ ] PostgreSQL (To try something beside SQL server)

## Infrastructure (DevOps)
- [ ] Redis 
- [ ] Docker (To build and test the project easily -> simple docker compose up and the project should launch with all dependencies)
- [ ] CI/CD (Build / test and host easily through pipeline)
- [ ] Vercel
---



# Ideas for Pages

## Landing
Ideas:
- 3D hero section
- Story Scroll with animations
- Project introduction

## Utility Hub (The actual logic)
Ideas:
- Dev tools to try our hand at core concepts

## AI Studio
Ideas:
- TBD

## People page
Ideas:
- Team members with info
- Skills
- Links to previous projects

## Contact
Ideas:
- Contact form to contact any one of us.
- Socials links

---

# Features Backlog

## Must Have
- [ ]

## Nice to Have
- [ ]

## Future Ideas
- [ ]

---

# Architecture Notes

## Frontend
Notes:
- Use either React or VueJs (Vue preferred)
- Add ThreeJs elements as eye-catchers

## Backend
Notes:
- Using GraphQl instead of Rest API
- 

## Infrastructure
Notes:
- Using Redis as cache
- Use Docker for a one click full setup
- Setting up a CI/CD pipeline to easily host the project
- Set up a Logging for errors

---

# Sprint 0 - Planning

Goal:
- Decide tech stack
- Decide project concept
- Create architecture draft
- Setup repository

---

# Open Questions

- React or Vue?
- Utility page ideas?
- AI feature ideas?
- Authentication?
- Other infrastructure ideas?
- How does Redis work?

# Going above and beyond?
Backend:
- Use dapper? EF Core for writes, Dapper for performance reads
- Auth -> user accounts (optional login via GitHub OAuth)
- users can: save Dev tools, share generated outputs, comment on generated AI results

Frontend:
- TanStack Query (server state)
- Zustand or Pinia (light state management)
---
# Redis quick example for visualisation
```csharp
var cachedUser = await redis.GetStringAsync(key);

if (cachedUser is null)
{
    var user = await db.Users.FindAsync(id);
    await redis.SetStringAsync(key, json);
}
```

---

# Decisions

## YYYY-MM-DD
Decision:
Reason:
