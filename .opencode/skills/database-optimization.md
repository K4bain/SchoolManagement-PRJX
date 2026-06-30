# Database Optimization Skill

## name: database-optimization

Expert database architect and performance optimizer.

---

## Critical Safety Rule

**NEVER delete or modify production data without explicit confirmation.**

- Always backup before changes
- Test on staging first
- Get written approval for data modifications
- Provide rollback scripts
- Log all changes for audit

---

## Universal Database Optimization Checklist

### 1. Indexing
- [ ] Primary keys indexed (automatic)
- [ ] Foreign keys indexed
- [ ] Frequently queried fields indexed
- [ ] Composite indexes for multi-column queries
- [ ] Partial indexes for conditional queries
- [ ] Index selectivity analyzed (high cardinality)
- [ ] Unused indexes identified and removed
- [ ] Index maintenance scheduled

### 2. Query Optimization
- [ ] N+1 queries eliminated
- [ ] SELECT * avoided (select specific columns)
- [ ] Joins optimized (proper join order)
- [ ] Subqueries converted to joins when better
- [ ] Batch operations instead of loops
- [ ] Query execution plans analyzed
- [ ] Slow query logging enabled
- [ ] Query timeouts configured

### 3. Pagination
- [ ] Cursor-based pagination for large datasets
- [ ] Offset pagination for small datasets
- [ ] Keyset pagination implemented
- [ ] Page size limits enforced
- [ ] Total count optimized (cached or approximate)

### 4. Data Selection
- [ ] Only required fields selected
- [ ] Lazy loading for relationships
- [ ] Eager loading configured properly
- [ ] Projections used for read-heavy operations
- [ ] Aggregation queries optimized

### 5. Connection Management
- [ ] Connection pooling enabled
- [ ] Pool size configured appropriately
- [ ] Connection timeout set
- [ ] Idle connections cleaned up
- [ ] Connection health checks enabled

### 6. Caching Strategy
- [ ] Redis/Memcached for hot data
- [ ] Query result caching
- [ ] Application-level caching
- [ ] Cache invalidation strategy
- [ ] TTL configured per data type

### 7. Transaction Management
- [ ] Transactions used for multi-step operations
- [ ] Transaction scope minimized
- [ ] Deadlock prevention strategy
- [ ] Isolation levels configured
- [ ] Long-running transactions avoided

### 8. Schema Design
- [ ] Normalization appropriate (3NF or denormalized for reads)
- [ ] Data types optimal (INT vs BIGINT, VARCHAR vs TEXT)
- [ ] Constraints enforced (NOT NULL, UNIQUE, CHECK)
- [ ] Default values set
- [ ] Audit columns (createdAt, updatedAt, deletedAt)

### 9. Migration Safety
- [ ] Migrations are reversible
- [ ] Large migrations batched
- [ ] Zero-downtime migrations
- [ ] Backward compatible changes
- [ ] Rollback scripts tested

### 10. Backup & Recovery
- [ ] Automated backups configured
- [ ] Backup retention policy
- [ ] Point-in-time recovery enabled
- [ ] Restore procedure tested
- [ ] Cross-region backup replication

### 11. Monitoring
- [ ] Query performance metrics
- [ ] Connection pool metrics
- [ ] Slow query alerts
- [ ] Deadlock detection
- [ ] Storage growth monitoring

### 12. Security
- [ ] Encrypted connections (TLS)
- [ ] Least privilege database user
- [ ] SQL injection prevention
- [ ] Audit logging enabled
- [ ] Sensitive data encrypted at rest

### 13. Partitioning
- [ ] Large tables partitioned
- [ ] Partition strategy (range, list, hash)
- [ ] Partition maintenance automated
- [ ] Query routing to correct partitions
- [ ] Archival strategy for old partitions

### 14. Replication
- [ ] Read replicas configured
- [ ] Load balancing for reads
- [ ] Failover strategy defined
- [ ] Replication lag monitored
- [ ] Consistency requirements met

### 15. Sharding (if needed)
- [ ] Shard key selected carefully
- [ ] Cross-shard queries minimized
- [ ] Shard rebalancing strategy
- [ ] Consistent hashing implemented
- [ ] Shard monitoring

### 16. Archival
- [ ] Old data archival strategy
- [ ] Archive storage tier
- [ ] Archive retrieval process
- [ ] Compliance requirements met
- [ ] Archive compression

### 17. Data Integrity
- [ ] Referential integrity enforced
- [ ] Check constraints used
- [ ] Trigger-based validation
- [ ] Application-level validation
- [ ] Data type validation

### 18. Performance Testing
- [ ] Load testing with production data
- [ ] Stress testing
- [ ] Endurance testing
- [ ] Spike testing
- [ ] Baseline metrics established

### 19. Capacity Planning
- [ ] Growth projections
- [ ] Storage scaling strategy
- [ ] Compute scaling strategy
- [ ] Cost optimization
- [ ] Performance SLAs defined

### 20. Documentation
- [ ] Schema documentation
- [ ] Query optimization notes
- [ ] Index strategy documented
- [ ] Backup procedures documented
- [ ] Runbook for common issues

---

## Index Rules

### When to Create Indexes
```sql
-- High cardinality columns (many unique values)
CREATE INDEX idx_users_email ON users(email);

-- Foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Frequently filtered columns
CREATE INDEX idx_products_category ON products(category);

-- Sort columns
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

### Composite Index Order
```sql
-- Column order matters: most selective first, or match query pattern
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Covers this query (index-only scan)
SELECT * FROM orders WHERE user_id = ? AND created_at > ?;
```

### Partial Indexes (PostgreSQL)
```sql
-- Index only active records
CREATE INDEX idx_users_active ON users(email) WHERE deleted_at IS NULL;
```

### Index Anti-Patterns
```sql
-- DON'T: Index every column
-- DON'T: Over-index (slows writes)
-- DON'T: Index low cardinality columns (boolean, status)
-- DON'T: Duplicate indexes
```

---

## Query Optimization

### N+1 Query Problem
```typescript
// BAD: N+1 queries
const users = await db.user.findMany();
for (const user of users) {
  user.orders = await db.order.findMany({ where: { userId: user.id } });
}

// GOOD: Single query with join
const users = await db.user.findMany({
  include: { orders: true }
});

// GOOD: Batch query
const userIds = users.map(u => u.id);
const orders = await db.order.findMany({ where: { userId: { in: userIds } } });
```

### SELECT * Anti-Pattern
```sql
-- BAD
SELECT * FROM users WHERE id = 1;

-- GOOD
SELECT id, name, email FROM users WHERE id = 1;
```

### Join Optimization
```sql
-- Ensure join columns are indexed
SELECT u.*, o.*
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active';
```

---

## Pagination Rules

### Cursor-Based (Recommended for Large Datasets)
```typescript
// First page
const firstPage = await db.posts.findMany({
  take: 20,
  orderBy: { id: 'desc' }
});

// Next page
const nextPage = await db.posts.findMany({
  take: 20,
  skip: 1, // Skip the cursor
  cursor: { id: lastId },
  orderBy: { id: 'desc' }
});
```

### Offset-Based (Small Datasets Only)
```typescript
const page = await db.posts.findMany({
  take: 20,
  skip: (pageNumber - 1) * 20,
  orderBy: { createdAt: 'desc' }
});
```

---

## Data Selection Rules

### Projections
```typescript
// Select only needed fields
const users = await db.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
    // Don't include password, token, etc.
  }
});
```

### Lazy vs Eager Loading
```typescript
// Lazy loading (when relationship needed)
const user = await db.user.findUnique({ where: { id } });
const orders = await db.order.findMany({ where: { userId: id } });

// Eager loading (when relationship always needed)
const user = await db.user.findUnique({
  where: { id },
  include: { orders: true }
});
```

---

## MongoDB Optimization

### Indexing
```javascript
// Single field
db.users.createIndex({ email: 1 }, { unique: true });

// Compound
db.orders.createIndex({ userId: 1, createdAt: -1 });

// Text search
db.products.createIndex({ name: 'text', description: 'text' });
```

### Query Optimization
```javascript
// Use projection
db.users.find({ status: 'active' }, { name: 1, email: 1 });

// Use limit
db.users.find().limit(100);

// Use aggregate for complex queries
db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { _id: '$userId', total: { $sum: '$amount' } } }
]);
```

### Aggregation Pipeline Optimization
```javascript
// Put $match early
db.orders.aggregate([
  { $match: { createdAt: { $gte: startDate } } }, // Filter first
  { $group: { _id: '$userId', total: { $sum: '$amount' } } }
]);
```

---

## PostgreSQL Optimization

### Configuration
```sql
-- Connection pooling
max_connections = 100
shared_buffers = 25% of RAM
effective_cache_size = 75% of RAM
work_mem = 4MB to 64MB
maintenance_work_mem = 10% of RAM
```

### Query Analysis
```sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### Partitioning
```sql
-- Range partitioning by date
CREATE TABLE orders (
  id SERIAL,
  created_at TIMESTAMP,
  amount DECIMAL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## MySQL Optimization

### Configuration
```ini
# InnoDB settings
innodb_buffer_pool_size = 70% of RAM
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT

# Query cache
query_cache_type = 1
query_cache_size = 64M
```

### Index Optimization
```sql
-- Use EXPLAIN
EXPLAIN SELECT * FROM users WHERE status = 'active';

-- Force index when needed
SELECT * FROM orders FORCE INDEX (idx_user_date) WHERE user_id = ?;
```

---

## Redis Optimization

### Memory Management
```bash
# Set max memory
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Data Structures
```bash
# Use hashes for objects
HSET user:1 name "John" email "john@example.com"

# Use sorted sets for rankings
ZADD leaderboard 100 "user:1"

# Use sets for tags
SADD post:1:tags "javascript" "nodejs"
```

### Pipeline for Batch Operations
```javascript
const pipeline = redis.pipeline();
users.forEach(user => pipeline.set(`user:${user.id}`, JSON.stringify(user)));
await pipeline.exec();
```

---

## ORM-Specific Rules

### Prisma
```typescript
// Use select for specific fields
const users = await prisma.user.findMany({
  select: { id: true, name: true }
});

// Use include for relations
const users = await prisma.user.findMany({
  include: { posts: true }
});

// Use findMany with take for pagination
const posts = await prisma.post.findMany({
  take: 20,
  skip: 0,
  orderBy: { createdAt: 'desc' }
});
```

### Mongoose
```typescript
// Use select
const users = await User.find().select('name email');

// Use populate for relations
const users = await User.find().populate('posts');

// Use lean for read-only queries
const users = await User.find().lean();
```

### TypeORM
```typescript
// Use select
const users = await userRepository.find({
  select: ['id', 'name', 'email']
});

// Use relations
const users = await userRepository.find({
  relations: ['posts']
});

// Use query builder for complex queries
const users = await userRepository
  .createQueryBuilder('user')
  .where('user.status = :status', { status: 'active' })
  .getMany();
```

### Sequelize
```typescript
// Use attributes
const users = await User.findAll({
  attributes: ['id', 'name', 'email']
});

// Use include
const users = await User.findAll({
  include: [{ model: Post }]
});
```

### Drizzle
```typescript
// Select specific fields
const users = await db.select({
  id: usersTable.id,
  name: usersTable.name
}).from(usersTable);

// With joins
const posts = await db
  .select()
  .from(postsTable)
  .innerJoin(usersTable, eq(postsTable.userId, usersTable.id));
```

---

## Connection Pooling

### Configuration
```typescript
// PostgreSQL
const pool = new Pool({
  max: 20,           // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// MySQL
const pool = mysql.createPool({
  connectionLimit: 20,
  connectTimeout: 5000,
});
```

### Best Practices
- Don't create new connections per request
- Reuse connections from pool
- Handle connection errors
- Monitor pool metrics
- Set appropriate timeouts

---

## Caching Strategy

### Cache Layers
```
Request → CDN → API Gateway → App Cache (Memory) → Redis → Database
```

### Cache Patterns
```typescript
// Cache-aside
async function getUser(id: string) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.user.findUnique({ where: { id } });
  await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  return user;
}

// Write-through
async function updateUser(id: string, data: any) {
  await db.user.update({ where: { id }, data });
  await redis.set(`user:${id}`, JSON.stringify({ ...data, id }));
}
```

### Cache Invalidation
```typescript
// Invalidate on update
async function updateUser(id: string, data: any) {
  await db.user.update({ where: { id }, data });
  await redis.del(`user:${id}`);
}
```

---

## Migration Safety

### Zero-Downtime Migrations
```sql
-- 1. Add column as nullable
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- 2. Backfill data
UPDATE users SET phone = 'unknown' WHERE phone IS NULL;

-- 3. Add NOT NULL constraint
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
```

### Batch Large Migrations
```typescript
// Process in batches
const batchSize = 1000;
let offset = 0;
while (true) {
  const batch = await db.query(`SELECT * FROM users LIMIT $1 OFFSET $2`, [batchSize, offset]);
  if (batch.length === 0) break;
  
  // Process batch
  for (const user of batch) {
    await processUser(user);
  }
  
  offset += batchSize;
}
```

---

## Database Deletion Safety

### Soft Deletes
```typescript
// Prefer soft deletes
await db.user.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// Query only non-deleted
const users = await db.user.findMany({
  where: { deletedAt: null }
});
```

### Hard Delete Requirements
```typescript
// 1. Backup data first
const backup = await db.user.findUnique({ where: { id } });
await db.userBackup.create({ data: backup });

// 2. Delete
await db.user.delete({ where: { id } });

// 3. Log deletion
await auditLog.log('user_deleted', { userId: id, backup });
```

---

## Review Output Format

```markdown
## Database Optimization Review: [Feature/Module]

### Current Performance
- Query count per request: X
- Average response time: Xms
- Database connections: X

### Issues Found

#### Critical (Fix Immediately)
1. **N+1 Query** - File:line
   - Current: X queries
   - Fix: Use JOIN/include
   - Impact: 80% reduction

#### High Priority
1. **Missing Index** - File:line
   - Current: Full table scan
   - Fix: Add index on column
   - Impact: 10x faster

#### Medium Priority
1. **SELECT * Usage** - File:line
   - Current: Fetching all columns
   - Fix: Select specific fields
   - Impact: 30% less data

### Recommendations
1. Add composite index for common query
2. Implement caching for hot data
3. Partition large tables by date

### Expected Improvements
- Query time: 200ms → 20ms
- Connections: 50 → 20
- Memory: 2GB → 1GB
```
