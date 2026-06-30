# Project Structure Skill

## name: project-structure

Expert backend architecture and project structure specialist.

---

## Core Principle

**ALWAYS inspect and respect the current project structure before suggesting changes.**

- Never impose a new structure on an existing project
- Identify the framework, language, and conventions already in use
- Suggest improvements that fit naturally into the existing codebase
- If the project is new, recommend a clean, scalable structure

---

## Architecture Rules

### Feature-Based Over Type-Based

**GOOD (Feature-based):**
```
modules/
  auth/
    auth.controller.ts
    auth.service.ts
    auth.repository.ts
    auth.routes.ts
    auth.types.ts
    auth.test.ts
  users/
    users.controller.ts
    users.service.ts
    users.repository.ts
    users.routes.ts
    users.types.ts
    users.test.ts
```

**BAD (Type-based):**
```
controllers/
  auth.controller.ts
  users.controller.ts
services/
  auth.service.ts
  users.service.ts
repositories/
  auth.repository.ts
  users.repository.ts
```

---

## Universal Backend Module Pattern

Every feature module MUST follow this structure:

```
modules/{feature}/
  {feature}.controller.ts    # Handle HTTP requests/responses
  {feature}.service.ts       # Business logic
  {feature}.repository.ts   # Database operations
  {feature}.routes.ts        # Route definitions
  {feature}.types.ts         # TypeScript types/interfaces
  {feature}.test.ts          # Unit tests
  {feature}.validation.ts    # Input validation schemas
```

---

## Responsibility Separation

| Layer | Responsibility | NEVER |
|-------|---------------|-------|
| **Controller** | Parse request, call service, return response | Business logic |
| **Service** | Business logic, orchestration | Direct DB queries |
| **Repository** | Database operations only | Business logic |
| **Types** | Interfaces, enums, type definitions | Runtime code |
| **Validation** | Input schemas, sanitization | Business rules |

---

## Recommended Global Folder Structure

```
project-root/
  config/                    # Configuration files, env validation
  common/                    # Shared utilities, helpers, constants
    errors/                  # Custom error classes
    middleware/               # Global middleware
    utils/                   # Utility functions
    constants/               # App-wide constants
  database/                  # Database setup, migrations, seeds
    migrations/              # Migration files
    seeds/                   # Seed data
  modules/                   # Feature modules (see pattern above)
  jobs/                      # Background jobs, queues, cron tasks
  events/                    # Event handlers, pub/sub
  integrations/              # Third-party service integrations
    email/                   # Email service
    payment/                 # Payment providers
    storage/                 # File storage (S3, etc.)
    sms/                     # SMS providers
  observability/             # Logging, monitoring, tracing
  health/                    # Health check endpoints
  tests/                     # Integration and E2E tests
  scripts/                   # Build, deploy, utility scripts
```

---

## Security Rules

1. **Never store secrets in code** - Use environment variables
2. **Validate all input** - At controller/route level with DTOs
3. **Sanitize all output** - Prevent XSS and injection attacks
4. **Use parameterized queries** - Prevent SQL injection
5. **Implement rate limiting** - Protect against brute force
6. **Use HTTPS only** - No exceptions in production
7. **Hash passwords** - bcrypt, argon2, never MD5/SHA1
8. **Implement CORS properly** - Whitelist allowed origins
9. **Use Helmet.js** - Set security headers
10. **Validate JWT signatures** - Never trust client tokens

---

## Scalability Rules

1. **Stateless services** - No in-memory session storage
2. **Database connection pooling** - Never create connections per request
3. **Cache aggressively** - Redis/Memcached for hot data
4. **Use message queues** - For async, heavy operations
5. **Horizontal scaling** - Design for multiple instances
6. **Separate read/write** - Use replicas for read-heavy operations
7. **Implement pagination** - Never return unbounded results
8. **Use CDN** - For static assets and caching
9. **Monitor performance** - APM, slow query logging
10. **Load test regularly** - Know your breaking points

---

## API Design Rules

1. **RESTful conventions** - Proper HTTP methods and status codes
2. **Versioning** - `/api/v1/resource`
3. **Consistent naming** - Plural nouns, lowercase, hyphens
4. **HATEOAS links** - For complex relationships
5. **Filtering/sorting** - Query parameters for collection endpoints
6. **Pagination** - Cursor or offset-based
7. **Field selection** - Allow clients to request specific fields
8. **Batch operations** - `/api/v1/resource/batch`
9. **Idempotency keys** - For payment and critical operations
10. **OpenAPI/Swagger** - Always document APIs

---

## Error Handling Rules

1. **Custom error classes** - Extend base AppError
2. **Error codes** - Machine-readable error identifiers
3. **Consistent format** - Always return `{ error: { code, message, details } }`
4. **HTTP status codes** - Use correct codes (400, 401, 403, 404, 409, 422, 500)
5. **Error logging** - Log full errors, return sanitized versions
6. **Graceful degradation** - Fail safely, don't crash
7. **Validation errors** - Include field-specific details
8. **Async error handling** - Always catch promise rejections
9. **Global error handler** - Centralized error middleware
10. **Error monitoring** - Sentry, Datadog, etc.

---

## Response Rules

1. **Consistent structure** - `{ success: true, data: {} }`
2. **HTTP status codes** - Always correct codes
3. **Metadata** - Include pagination, counts when relevant
4. **No sensitive data** - Never expose passwords, tokens
5. **Timestamps** - Include `createdAt`, `updatedAt`
6. **Localization** - Support i18n for messages
7. **Compression** - Use gzip/brotli for responses

---

## Database Rules

1. **Use migrations** - Never manually alter production DB
2. **Index frequently queried fields** - Especially foreign keys
3. **Use transactions** - For multi-step operations
4. **Soft deletes** - Prefer `deletedAt` over hard deletes
5. **Audit trail** - Track who changed what
6. **Connection pooling** - Reuse connections
7. **Query optimization** - Use EXPLAIN, avoid N+1
8. **Backup regularly** - Test restore procedures
9. **Environment isolation** - Separate dev/staging/prod databases
10. **Data validation** - At both app and DB level

---

## Authentication Rules

1. **JWT for APIs** - Stateless, scalable
2. **Refresh tokens** - Long-lived, stored securely
3. **Token rotation** - Refresh on each use
4. **Secure storage** - HttpOnly cookies for web, secure storage for mobile
5. **MFA support** - TOTP, SMS, email
6. **Session invalidation** - Logout should revoke tokens
7. **Password policy** - Minimum length, complexity requirements
8. **Brute force protection** - Rate limiting, account lockout
9. **OAuth2/OIDC** - For third-party auth
10. **Audit login attempts** - Log success and failure

---

## Payment Rules

1. **Idempotency keys** - Prevent duplicate charges
2. **Webhook verification** - Validate signatures
3. **PCI compliance** - Never store card numbers
4. **Test mode** - Separate test and production keys
5. **Reconciliation** - Regular payment audit
6. **Refund handling** - Clear refund policies
7. **Currency handling** - Use smallest unit (cents)
8. **Tax calculation** - Separate concern
9. **Invoice generation** - Automated, PDF support
10. **Dispute handling** - Stripe/PayPal dispute management

---

## File Upload Rules

1. **Validate file types** - Whitelist allowed extensions
2. **Limit file size** - Prevent abuse
3. **Scan for malware** - Use virus scanning
4. **Store securely** - S3, GCS, not local filesystem
5. **Generate unique names** - UUID, not user-provided names
6. **CDN delivery** - Serve via CDN
7. **Thumbnails** - Generate for images
8. **Cleanup orphaned files** - Regular garbage collection
9. **Access control** - Private files, signed URLs
10. **Upload progress** - For large files

---

## AI/API Credit System Rules

1. **Credit deduction** - Atomic operations
2. **Usage tracking** - Log all API calls
3. **Rate limiting** - Per-user, per-API limits
4. **Quota management** - Monthly, daily limits
5. **Overage handling** - Graceful degradation
6. **Billing integration** - Auto-purchase credits
7. **Usage dashboard** - User-facing analytics
8. **Cost optimization** - Cache AI responses
9. **Model selection** - Cost vs quality tradeoff
10. **Monitoring** - Alert on unusual usage

---

## Testing Rules

1. **Unit tests** - For services, repositories, utils
2. **Integration tests** - For API endpoints
3. **E2E tests** - For critical user flows
4. **Test isolation** - Each test independent
5. **Mock external services** - Never hit real APIs in tests
6. **Test data factories** - Reusable test data
7. **Coverage targets** - 80%+ for critical paths
8. **Performance tests** - Load, stress, soak tests
9. **Security tests** - OWASP Top 10 checks
10. **CI/CD integration** - Tests block deployment

---

## Code Style Rules

1. **Consistent formatting** - Prettier, ESLint
2. **TypeScript strict mode** - No `any` types
3. **Functional over imperative** - When cleaner
4. **DRY** - Don't Repeat Yourself
5. **SOLID principles** - Single responsibility, etc.
6. **Small functions** - Under 30 lines
7. **Descriptive names** - `getUserById` not `getUser`
8. **No magic numbers** - Use constants
9. **Early returns** - Avoid deeply nested code
10. **Consistent imports** - Organized, sorted

---

## Refactoring Rules

1. **Boy Scout Rule** - Leave code better than you found it
2. **Small steps** - Refactor incrementally
3. **Test first** - Ensure tests pass before/after
4. **Feature flags** - For large changes
5. **Backward compatibility** - Don't break existing code
6. **Documentation** - Update docs with changes
7. **Code review** - Peer review for refactors
8. **Performance profiling** - Measure before/after
9. **Rollback plan** - Always have one
10. **Deprecation warnings** - For breaking changes

---

## New Feature Workflow

1. **Understand requirements** - Business and technical
2. **Design API contract** - OpenAPI spec first
3. **Create module structure** - Follow module pattern
4. **Implement repository** - Database layer first
5. **Implement service** - Business logic
6. **Implement controller** - HTTP layer
7. **Add validation** - Input validation schemas
8. **Write tests** - Unit and integration
9. **Document API** - Swagger/OpenAPI
10. **Deploy to staging** - Test thoroughly
11. **Performance test** - Load test new endpoint
12. **Deploy to production** - Gradual rollout
13. **Monitor** - Watch metrics and logs
14. **Iterate** - Gather feedback, improve

---

## Review Workflow

1. **Code style** - Formatting, linting
2. **Architecture** - Follows module pattern
3. **Security** - No vulnerabilities
4. **Performance** - No N+1, proper indexing
5. **Error handling** - All cases covered
6. **Testing** - Adequate coverage
7. **Documentation** - API docs updated
8. **Database** - Migrations are reversible
9. **Dependencies** - No new dependencies without approval
10. **Breaking changes** - Versioning handled

---

## Output Style

- Always provide file paths and line numbers
- Show before/after code examples
- Explain the "why" behind changes
- Suggest incremental improvements
- Respect existing conventions
- Provide migration steps for breaking changes

---

## Default Architecture Recommendation

For new Node.js/TypeScript backends:

```
src/
  config/              # Environment, app configuration
  common/              # Shared utilities
    errors/            # Custom error classes
    middleware/         # Global middleware
    utils/             # Helper functions
    constants/         # App constants
  database/            # DB setup, migrations
  modules/             # Feature modules
    auth/              # Authentication
    users/             # User management
    {feature}/         # Each feature gets its own module
  integrations/        # Third-party services
  observability/       # Logging, monitoring
  health/              # Health checks
  jobs/                # Background jobs
  events/              # Event handling
tests/                 # Test files
```

**Tech Stack:**
- Runtime: Node.js + TypeScript
- Framework: Express.js or Fastify
- Database: PostgreSQL + Redis
- ORM: Prisma or TypeORM
- Validation: Zod or Joi
- Auth: JWT + Refresh Tokens
- Testing: Jest + Supertest
- Monitoring: Winston + Sentry
