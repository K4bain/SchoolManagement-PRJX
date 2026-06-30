# Security Check Skill

## name: security-check

Expert backend security engineer and auditor.

---

## Security Mindset

**NEVER TRUST THE CLIENT.**

Every input from the client is potentially malicious:
- Headers can be spoofed
- Request bodies can be manipulated
- Cookies can be tampered with
- URLs can be crafted to exploit vulnerabilities
- File uploads can contain malware

**Assume breach mentality:** Design systems so that if one part is compromised, the damage is contained.

---

## Global Backend Security Checklist

### 1. Authentication & Authorization
- [ ] Passwords hashed with bcrypt/argon2 (never MD5/SHA1)
- [ ] JWT tokens validated properly (signature, expiry, issuer)
- [ ] Refresh token rotation implemented
- [ ] Session invalidation on logout
- [ ] MFA available for sensitive operations
- [ ] Account lockout after failed attempts

### 2. Input Validation
- [ ] All inputs validated at entry point (DTOs/schemas)
- [ ] SQL injection prevention (parameterized queries)
- [ ] NoSQL injection prevention (sanitized queries)
- [ ] XSS prevention (output encoding)
- [ ] Command injection prevention
- [ ] Path traversal prevention

### 3. Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] TLS enforced in transit
- [ ] No sensitive data in logs
- [ ] PII handled according to regulations
- [ ] API keys rotated regularly
- [ ] Secrets in environment variables, not code

### 4. API Security
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Content-Type validation
- [ ] Request size limits
- [ ] Idempotency keys for payments
- [ ] API versioning

### 5. Error Handling
- [ ] No stack traces in production responses
- [ ] Generic error messages for auth failures
- [ ] Detailed errors logged server-side only
- [ ] Custom error classes with error codes
- [ ] Global error handler catches all

### 6. File Security
- [ ] File type validation (whitelist)
- [ ] File size limits enforced
- [ ] Malware scanning
- [ ] No execution of uploaded files
- [ ] Secure file storage (S3/GCS)
- [ ] Unique file names (UUID)

### 7. Database Security
- [ ] Least privilege database user
- [ ] No direct DB access from internet
- [ ] Encrypted connections
- [ ] Regular backups tested
- [ ] Migration rollback capability
- [ ] Audit logging for sensitive data

### 8. Session & Cookie Security
- [ ] HttpOnly flag on cookies
- [ ] Secure flag for HTTPS
- [ ] SameSite attribute set
- [ ] Reasonable expiration times
- [ ] Session fixation prevention

### 9. Payment Security
- [ ] PCI DSS compliance
- [ ] No card data stored
- [ ] Webhook signature verification
- [ ] Idempotency keys
- [ ] Amount validation server-side
- [ ] Test mode separated

### 10. Infrastructure Security
- [ ] Environment variables not in code
- [ ] Docker images scanned for vulnerabilities
- [ ] Dependencies audited (npm audit)
- [ ] Security headers (Helmet.js)
- [ ] DDoS protection
- [ ] WAF configured

---

## Folder-by-Folder Security Rules

### config/
- [ ] Environment variables validated on startup
- [ ] No default passwords in production
- [ ] Secrets not logged
- [ ] Config files in .gitignore
- [ ] Separate configs per environment

### routes/
- [ ] Auth middleware on protected routes
- [ ] Rate limiting applied
- [ ] Input validation schemas
- [ ] CORS headers set
- [ ] No sensitive data in URLs

### controllers/
- [ ] Input validation before processing
- [ ] Sanitized error responses
- [ ] Proper HTTP status codes
- [ ] No business logic in controllers
- [ ] Request ID tracking

### services/
- [ ] Authorization checks before actions
- [ ] Input sanitization
- [ ] No SQL queries (use repositories)
- [ ] Idempotency for critical operations
- [ ] Audit logging

### repositories/
- [ ] Parameterized queries only
- [ ] No raw SQL with string concatenation
- [ ] Input validation at repository level
- [ ] Connection pooling
- [ ] Query timeout limits

### models/
- [ ] Field-level validation
- [ ] Sensitive fields marked (passwords, tokens)
- [ ] Proper data types
- [ ] Indexes on query fields
- [ ] Soft deletes for important data

### DTOs (Data Transfer Objects)
- [ ] All inputs validated with schemas
- [ ] Optional fields handled
- [ ] Nested objects validated
- [ ] Array bounds checked
- [ ] String length limits

### middleware/
- [ ] Authentication middleware
- [ ] Authorization middleware
- [ ] Rate limiting middleware
- [ ] Request validation middleware
- [ ] Error handling middleware

### auth/
- [ ] Password hashing (bcrypt, 12+ rounds)
- [ ] JWT with short expiry (15min)
- [ ] Refresh token rotation
- [ ] Token revocation capability
- [ ] OAuth2 state parameter

### tokens/
- [ ] Tokens not logged
- [ ] Tokens stored securely
- [ ] Token expiry enforced
- [ ] Token blacklisting
- [ ] Unique token generation

### cookies/
- [ ] HttpOnly flag
- [ ] Secure flag
- [ ] SameSite=Strict/Lax
- [ ] Domain restrictions
- [ ] Path restrictions

### payments/
- [ ] Server-side amount validation
- [ ] Idempotency keys
- [ ] Webhook verification
- [ ] No card data logging
- [ ] Test mode isolation

### credits/
- [ ] Atomic credit operations
- [ ] Balance validation
- [ ] Transaction logging
- [ ] Race condition prevention
- [ ] Refund handling

### files/
- [ ] Type validation (whitelist)
- [ ] Size limits enforced
- [ ] Malware scanning
- [ ] Secure storage
- [ ] Access control

### integrations/
- [ ] API keys in env vars
- [ ] Request signing
- [ ] Timeout handling
- [ ] Retry logic with backoff
- [ ] Error handling

### admin/
- [ ] IP whitelist
- [ ] MFA required
- [ ] Audit logging
- [ ] Separate admin credentials
- [ ] Limited access hours

### jobs/
- [ ] Job data validated
- [ ] Error handling
- [ ] Retry limits
- [ ] Dead letter queue
- [ ] Progress tracking

### events/
- [ ] Event data validation
- [ ] Listener error handling
- [ ] Event sourcing for audit
- [ ] Idempotent handlers
- [ ] Event logging

### error handling/
- [ ] Custom error classes
- [ ] Error codes (not messages)
- [ ] No stack traces in responses
- [ ] Error monitoring (Sentry)
- [ ] Error rate alerting

### logging/
- [ ] No sensitive data logged
- [ ] Structured logging (JSON)
- [ ] Log levels configured
- [ ] Log rotation
- [ ] Centralized logging

### response/mapper/
- [ ] No sensitive data exposed
- [ ] Consistent response format
- [ ] Field filtering
- [ ] Pagination metadata
- [ ] Error response format

### CORS/
- [ ] Whitelist origins
- [ ] Allow specific methods
- [ ] Allow specific headers
- [ ] Credentials handling
- [ ] Preflight caching

### database/
- [ ] Encrypted connections
- [ ] Least privilege user
- [ ] Connection pooling
- [ ] Query timeouts
- [ ] Audit triggers

### API abuse protection/
- [ ] Rate limiting (per user/IP)
- [ ] Request throttling
- [ ] CAPTCHA for suspicious activity
- [ ] IP blocking
- [ ] User agent validation

### authorization/
- [ ] Role-based access control
- [ ] Resource-level permissions
- [ ] Ownership verification
- [ ] Least privilege principle
- [ ] Permission caching

---

## Security Review Output Format

```markdown
## Security Review: [Feature/Module]

### Critical Issues (Fix Immediately)
- [ ] Issue 1: Description + file:line
- [ ] Issue 2: Description + file:line

### High Priority (Fix Before Release)
- [ ] Issue 1: Description + file:line
- [ ] Issue 2: Description + file:line

### Medium Priority (Fix Soon)
- [ ] Issue 1: Description + file:line
- [ ] Issue 2: Description + file:line

### Low Priority (Improvements)
- [ ] Issue 1: Description + file:line
- [ ] Issue 2: Description + file:line

### Compliance Status
- [ ] OWASP Top 10 addressed
- [ ] PCI DSS (if payments)
- [ ] GDPR (if EU users)
- [ ] SOC 2 (if required)

### Recommendations
1. Recommendation 1
2. Recommendation 2
3. Recommendation 3
```

---

## Common Vulnerabilities to Check

### OWASP Top 10 (2021)
1. **Broken Access Control** - Can users access unauthorized resources?
2. **Cryptographic Failures** - Are secrets properly protected?
3. **Injection** - SQL, NoSQL, OS command injection?
4. **Insecure Design** - Architecture-level security flaws?
5. **Security Misconfiguration** - Default configs, unnecessary features?
6. **Vulnerable Components** - Outdated dependencies?
7. **Auth Failures** - Weak passwords, session issues?
8. **Data Integrity Failures** - Deserialization, CI/CD pipeline?
9. **Logging Failures** - Insufficient monitoring?
10. **SSRF** - Can attackers make server-side requests?

---

## Quick Security Commands

```bash
# Check for vulnerable dependencies
npm audit
yarn audit
pnpm audit

# Check for secrets in code
git secrets --scan
trufflehog filesystem .

# Check Docker images
docker scan <image>
trivy image <image>

# Check for OWASP issues
npm install -g @owasp/dependency-check
dependency-check --project "My App" --scan ./src
```
