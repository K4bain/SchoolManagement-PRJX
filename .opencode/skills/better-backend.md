# Better Backend Skill

## name: better-backend

Expert senior backend engineer focused on code quality.

---

## Adapt to Existing Project

**ALWAYS inspect and respect the current codebase before suggesting changes.**

- Identify the framework, language, and conventions already in use
- Follow existing code style and patterns
- Don't introduce new dependencies without justification
- Suggest improvements that fit naturally into the existing codebase
- Respect the team's decisions and architectural choices

---

## Code Quality Rules

### Clean Code
- Code reads like well-written prose
- No magic numbers or strings (use constants)
- Descriptive variable and function names
- Consistent naming conventions
- Proper indentation and formatting

### Readable Code
- Functions do one thing well
- Logical flow from top to bottom
- Clear control flow (no complex nesting)
- Related code grouped together
- Unrelated code separated

### Reusable Code
- DRY (Don't Repeat Yourself)
- Extract common patterns into utilities
- Create abstractions for repeated logic
- Use composition over inheritance
- Design for extension

### Maintainable Code
- Easy to understand without comments
- Easy to modify without breaking other parts
- Easy to test
- Easy to debug
- Easy to document

### Modular Code
- Single responsibility per module/function
- Clear module boundaries
- Minimal dependencies between modules
- Easy to import and use
- Easy to replace

### Production-Ready Code
- Error handling for all cases
- Input validation
- Logging and monitoring
- Performance considerations
- Security awareness

---

## Functions

### Small and Focused

BAD - Function does too many things:
`
function processUser(user: User) {
  if (!user.email) throw new Error('Email required');
  db.users.save(user);
  emailService.send(user.email, 'Welcome!');
  logger.info('User created');
}
`

GOOD - Each function does one thing:
`
function validateUser(user: User) {
  if (!user.email) throw new Error('Email required');
}

async function createUser(user: User) {
  validateUser(user);
  return db.users.save(user);
}

async function sendWelcomeEmail(user: User) {
  await emailService.send(user.email, 'Welcome!');
}
`

### Single Responsibility

BAD - Function handles multiple concerns:
`
function handleRequest(req: Request) {
  const user = db.users.findById(req.params.id);
  if (!user) return res.status(404).send('Not found');
  const result = calculateSomething(user);
  db.logs.create({ action: 'calculated', userId: user.id });
  return res.json(result);
}
`

GOOD - Separate concerns:
`
async function getUser(id: string) {
  return db.users.findById(id);
}

function calculateResult(user: User) {
  return calculateSomething(user);
}
`

### Clear Input/Output

BAD:
`
function process(data: any) {
  return data.map((d: any) => ({ ...d, processed: true }));
}
`

GOOD:
`
interface ProcessableItem { id: string; value: number; }
interface ProcessedItem extends ProcessableItem { processed: boolean; processedAt: Date; }

function processItems(items: ProcessableItem[]): ProcessedItem[] {
  return items.map(item => ({ ...item, processed: true, processedAt: new Date() }));
}
`

---

## Modern Syntax

### Async/Await

BAD - Callback hell:
`
function getUser(id, callback) {
  db.users.findById(id, (err, user) => {
    if (err) return callback(err);
    db.orders.findByUserId(user.id, (err, orders) => {
      if (err) return callback(err);
      callback(null, { user, orders });
    });
  });
}
`

GOOD - Async/await:
`
async function getUserWithOrders(id: string) {
  const user = await db.users.findById(id);
  const orders = await db.orders.findByUserId(user.id);
  return { user, orders };
}
`

### Optional Chaining

BAD: const street = user && user.address && user.address.street;
GOOD: const street = user?.address?.street;

### Nullish Coalescing

BAD: const name = user.name || 'Anonymous';
GOOD: const name = user.name ?? 'Anonymous';

### Destructuring

BAD:
`
function processUser(user: User) {
  const name = user.name;
  const email = user.email;
}
`

GOOD:
`
function processUser({ name, email }: User) {
  // Use directly
}
`

### Template Literals

BAD: const message = 'Hello, ' + name + '!';
GOOD: ` const message = Hello, !; `

---

## Error Prevention

### Type Safety

BAD:
`
function process(data: any) {
  return data.whatever; // Runtime error
}
`

GOOD:
`
interface UserData { id: string; name: string; email: string; }
function process(data: UserData) {
  return data.name; // Type checked
}
`

### Input Validation

BAD:
`
async function createUser(email: string) {
  return db.users.create({ email });
}
`

GOOD:
`
import { z } from 'zod';
const CreateUserSchema = z.object({ email: z.string().email(), name: z.string().min(1) });
async function createUser(data: unknown) {
  const validated = CreateUserSchema.parse(data);
  return db.users.create(validated);
}
`

### Null Safety

BAD:
`
function getUserName(user: User | null) {
  return user.name; // Crash if null
}
`

GOOD:
`
function getUserName(user: User | null) {
  return user?.name ?? 'Unknown';
}
`

---

## Readability

### Meaningful Names

BAD: unction d(a: any) { return a.filter((x: any) => x.s === 'a'); }
GOOD: unction getActiveUsers(users: User[]) { return users.filter(user => user.status === 'active'); }

### Constants Over Magic Numbers

BAD: if (user.age > 18) { allowAccess(); }
GOOD: const LEGAL_AGE = 18; if (user.age > LEGAL_AGE) { allowAccess(); }

### Early Returns

BAD:
`
function process(user: User) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        return doSomething();
      }
    }
  }
  return null;
}
`

GOOD:
`
function process(user: User) {
  if (!user) return null;
  if (!user.active) return null;
  if (!user.verified) return null;
  return doSomething();
}
`

---

## Reusability

### Composition

BAD - Deep inheritance:
`
class BaseRepository {}
class UserRepository extends BaseRepository {}
class AdminUserRepository extends UserRepository {}
`

GOOD - Composition:
`
class UserRepository {
  constructor(private db: Database, private cache: Cache) {}
}
class AdminUserRepository {
  constructor(private userRepo: UserRepository, private auth: AuthService) {}
}
`

### Higher-Order Functions

GOOD - Composable middleware:
`
function withAuth(handler: Function) {
  return async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).send('Unauthorized');
    return handler(req, res);
  };
}

function withRole(role: string, handler: Function) {
  return withAuth(async (req: Request, res: Response) => {
    if (req.user?.role !== role) return res.status(403).send('Forbidden');
    return handler(req, res);
  });
}
`

---

## Performance

### Avoid Premature Optimization

BAD: const result = arr.reduce((a, b) => a + b.x, 0);
GOOD:
`
let result = 0;
for (const item of arr) {
  result += item.x;
}
`

### Batch Operations

BAD:
`
for (const id of userIds) {
  await db.users.findById(id);
}
`

GOOD:
`
await db.users.findMany({ where: { id: { in: userIds } } });
`

---

## Maintainability

### Separation of Concerns

BAD - Mixed concerns:
`
async function createUser(req: Request) {
  if (!req.body.email) throw new Error('Email required');
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await db.users.create({ email: req.body.email, password: hashedPassword });
  await emailService.send(user.email, 'Welcome!');
  return { user };
}
`

GOOD - Separated concerns:
`
class UserService {
  async create(data: CreateUserDTO) {
    const validated = CreateUserSchema.parse(data);
    const hashedPassword = await this.hashPassword(validated.password);
    const user = await this.userRepo.create({ ...validated, password: hashedPassword });
    await this.emailService.sendWelcome(user.email);
    return user;
  }
}
`

### Dependency Injection

BAD:
`
class UserService {
  private db = new Database();
  private email = new EmailService();
}
`

GOOD:
`
class UserService {
  constructor(private db: Database, private email: EmailService) {}
}
`

---

## Comments

### Explain WHY, Not WHAT

BAD:
`
// Loop through users
for (const user of users) {
  // Check if active
  if (user.active) {
    // Send email
    await sendEmail(user);
  }
}
`

GOOD:
`
// Only send to active users to reduce email costs
// and comply with anti-spam regulations
for (const user of users) {
  if (user.active) {
    await sendEmail(user);
  }
}
`

---

## Security Awareness

### Input Sanitization

BAD: ` const query = SELECT * FROM users WHERE name = ''; `
GOOD:
`
const query = 'SELECT * FROM users WHERE name = ';
const result = await db.query(query, [name]);
`

### Sensitive Data

BAD: logger.info('User login', { password: user.password });
GOOD: logger.info('User login', { userId: user.id, email: user.email });

---

## Final Checklist

### Before Submitting Code
- Code is clean and readable
- Functions are small and focused
- No magic numbers or strings
- Error handling is comprehensive
- Input validation is in place
- Types are properly defined
- No any types
- Comments explain WHY, not WHAT
- No sensitive data exposed
- Performance is acceptable
- Code follows existing patterns
- Tests are included
- Documentation is updated
- Security considerations addressed
