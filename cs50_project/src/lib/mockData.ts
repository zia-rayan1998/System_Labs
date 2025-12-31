// Mock data for System Design Learning Platform
// This simulates the Flask API responses

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  dailyStreak: number;
  practiceStreak: number;
  bestDailyStreak: number;
  bestPracticeStreak: number;
  topicsCompleted: number;
  totalQuizzes: number;
  correctAnswers: number;
  lastDailyCompletion: string | null;
  lastPracticeCompletion: string | null;
}

export interface Question {
  id: string;
  topicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // minutes
  questions: Question[];
  createdAt: string;
}

// Get today's date as YYYY-MM-DD
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Calculate which topic is the "daily" topic based on date
export const getDailyTopicIndex = (): number => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % mockTopics.length;
};

// Mock topics with rich content
export const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Load Balancing Fundamentals',
    description: 'Learn how load balancers distribute traffic across servers for high availability and scalability.',
    content: `
# Load Balancing Fundamentals

Load balancing is a critical component in distributed systems that helps distribute incoming network traffic across multiple servers. This ensures no single server bears too much load, improving reliability and performance.

## Why Load Balancing?

When your application grows, a single server can't handle all the traffic. Load balancers solve this by:

- **Distributing traffic** evenly across multiple servers
- **Improving availability** by routing around failed servers
- **Enabling horizontal scaling** by adding more servers easily
- **Reducing latency** by routing to the nearest or fastest server

## Types of Load Balancers

### 1. Layer 4 (Transport Layer)
Operates at the TCP/UDP level. Fast but limited in routing decisions.

### 2. Layer 7 (Application Layer)
Operates at HTTP level. Can make intelligent routing decisions based on URL, headers, cookies.

## Load Balancing Algorithms

**Round Robin**: Requests are distributed sequentially across servers.

**Weighted Round Robin**: Servers with higher capacity get more requests.

**Least Connections**: Routes to the server with fewest active connections.

**IP Hash**: Uses client IP to consistently route to the same server (useful for sessions).

## Health Checks

Load balancers continuously check server health and remove unhealthy servers from the pool. This prevents routing traffic to failed instances.

## Real-World Examples

- **AWS Elastic Load Balancer (ELB)**
- **NGINX**
- **HAProxy**
- **Google Cloud Load Balancing**
    `,
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    category: 'Infrastructure',
    difficulty: 'Beginner',
    estimatedTime: 15,
    questions: [
      {
        id: 'q1-1',
        topicId: '1',
        question: 'What is the primary purpose of a load balancer?',
        options: [
          'To store data redundantly',
          'To distribute traffic across multiple servers',
          'To encrypt network traffic',
          'To compress data before sending'
        ],
        correctIndex: 1,
        explanation: 'Load balancers distribute incoming traffic across multiple servers to prevent any single server from becoming overwhelmed.'
      },
      {
        id: 'q1-2',
        topicId: '1',
        question: 'Which load balancing algorithm routes requests to the server with the fewest active connections?',
        options: [
          'Round Robin',
          'IP Hash',
          'Least Connections',
          'Random'
        ],
        correctIndex: 2,
        explanation: 'Least Connections algorithm routes new requests to the server currently handling the fewest connections.'
      },
      {
        id: 'q1-3',
        topicId: '1',
        question: 'What layer does a Layer 7 load balancer operate at?',
        options: [
          'Physical Layer',
          'Transport Layer',
          'Application Layer',
          'Network Layer'
        ],
        correctIndex: 2,
        explanation: 'Layer 7 load balancers operate at the Application Layer (HTTP), allowing intelligent routing based on content.'
      },
      {
        id: 'q1-4',
        topicId: '1',
        question: 'Why is IP Hash useful as a load balancing algorithm?',
        options: [
          'It provides the fastest response times',
          'It ensures the same client always reaches the same server',
          'It uses the least server resources',
          'It automatically scales servers'
        ],
        correctIndex: 1,
        explanation: 'IP Hash uses the client IP address to consistently route requests to the same server, which is useful for session persistence.'
      },
      {
        id: 'q1-5',
        topicId: '1',
        question: 'What happens when a load balancer detects an unhealthy server?',
        options: [
          'It restarts the server automatically',
          'It removes the server from the pool and stops sending traffic',
          'It sends more traffic to force a restart',
          'It logs an error and continues sending traffic'
        ],
        correctIndex: 1,
        explanation: 'Load balancers remove unhealthy servers from the pool to prevent routing traffic to failed instances.'
      }
    ],
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Caching Strategies',
    description: 'Understand different caching strategies and when to use them for optimal performance.',
    content: `
# Caching Strategies

Caching is one of the most powerful techniques for improving application performance. By storing frequently accessed data closer to where it's needed, we can dramatically reduce latency and database load.

## Cache Hierarchy

From fastest to slowest:
1. **CPU Cache** (L1, L2, L3)
2. **Application Memory Cache**
3. **Distributed Cache** (Redis, Memcached)
4. **CDN Cache**
5. **Database Query Cache**

## Common Caching Patterns

### Cache-Aside (Lazy Loading)
Application checks cache first. On miss, loads from database and populates cache.

**Pros**: Only requested data is cached
**Cons**: Cache miss causes higher latency

### Write-Through
Data is written to cache and database simultaneously.

**Pros**: Cache is always consistent
**Cons**: Higher write latency

### Write-Behind (Write-Back)
Data is written to cache first, then asynchronously to database.

**Pros**: Fast writes
**Cons**: Risk of data loss

## Cache Invalidation

One of the hardest problems in computer science! Common strategies:

- **Time-based (TTL)**: Data expires after a set time
- **Event-based**: Invalidate when data changes
- **Version-based**: Include version in cache key

## Cache Eviction Policies

- **LRU (Least Recently Used)**: Remove least recently accessed items
- **LFU (Least Frequently Used)**: Remove least frequently accessed items
- **FIFO (First In, First Out)**: Remove oldest items first

## Real-World Tools

- **Redis**: In-memory data structure store
- **Memcached**: Simple key-value cache
- **CDNs**: CloudFlare, Fastly, AWS CloudFront
    `,
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop',
    category: 'Performance',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    questions: [
      {
        id: 'q2-1',
        topicId: '2',
        question: 'In the Cache-Aside pattern, what happens on a cache miss?',
        options: [
          'An error is returned to the user',
          'The application loads data from the database and populates the cache',
          'The cache automatically fetches from the database',
          'The request is retried indefinitely'
        ],
        correctIndex: 1,
        explanation: 'In Cache-Aside, the application is responsible for loading data from the database on a cache miss and then populating the cache.'
      },
      {
        id: 'q2-2',
        topicId: '2',
        question: 'What is a major risk of the Write-Behind caching pattern?',
        options: [
          'Slow read performance',
          'Cache inconsistency',
          'Potential data loss if cache fails before database write',
          'High memory usage'
        ],
        correctIndex: 2,
        explanation: 'Write-Behind writes to cache first and database asynchronously, risking data loss if the cache fails before the database is updated.'
      },
      {
        id: 'q2-3',
        topicId: '2',
        question: 'What does TTL stand for in caching?',
        options: [
          'Time To Live',
          'Transfer To Layer',
          'Total Transfer Load',
          'Temporary Token Limit'
        ],
        correctIndex: 0,
        explanation: 'TTL (Time To Live) specifies how long cached data remains valid before it expires.'
      },
      {
        id: 'q2-4',
        topicId: '2',
        question: 'Which eviction policy removes the least recently accessed items?',
        options: [
          'FIFO',
          'LFU',
          'LRU',
          'Random'
        ],
        correctIndex: 2,
        explanation: 'LRU (Least Recently Used) evicts items that haven\'t been accessed for the longest time.'
      },
      {
        id: 'q2-5',
        topicId: '2',
        question: 'Which caching pattern ensures the cache is always consistent with the database?',
        options: [
          'Cache-Aside',
          'Write-Behind',
          'Write-Through',
          'Lazy Loading'
        ],
        correctIndex: 2,
        explanation: 'Write-Through writes data to both cache and database simultaneously, ensuring consistency.'
      }
    ],
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    title: 'Database Sharding',
    description: 'Learn how to horizontally partition databases for massive scale.',
    content: `
# Database Sharding

Sharding is a technique for horizontally partitioning data across multiple databases. Each partition is called a "shard" and contains a subset of the total data.

## Why Shard?

When a single database can't handle:
- **Data volume**: Too much data for one server
- **Write throughput**: Too many writes per second
- **Read throughput**: Too many reads per second

## Sharding Strategies

### 1. Range-Based Sharding
Data is distributed based on ranges of a key (e.g., users A-M on shard 1, N-Z on shard 2).

**Pros**: Simple to implement, range queries work well
**Cons**: Can lead to uneven distribution (hotspots)

### 2. Hash-Based Sharding
A hash function determines which shard stores the data.

**Pros**: Even distribution of data
**Cons**: Range queries require querying all shards

### 3. Directory-Based Sharding
A lookup table maps data to shards.

**Pros**: Flexible, can handle complex sharding logic
**Cons**: Lookup table becomes a single point of failure

## Challenges of Sharding

### Cross-Shard Queries
Queries spanning multiple shards are complex and slow.

### Rebalancing
Adding/removing shards requires moving data.

### Referential Integrity
Foreign keys can't span shards.

### Transactions
Distributed transactions are complex (2PC, Saga pattern).

## When to Shard

Only shard when necessary! Consider first:
- Vertical scaling (bigger server)
- Read replicas
- Caching
- Query optimization

## Real-World Examples

- **MongoDB**: Built-in sharding support
- **Vitess**: MySQL sharding middleware (used by YouTube)
- **CockroachDB**: Automatic sharding
    `,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    category: 'Databases',
    difficulty: 'Advanced',
    estimatedTime: 25,
    questions: [
      {
        id: 'q3-1',
        topicId: '3',
        question: 'What is database sharding?',
        options: [
          'Backing up databases to multiple locations',
          'Horizontally partitioning data across multiple databases',
          'Encrypting database connections',
          'Creating read replicas of a database'
        ],
        correctIndex: 1,
        explanation: 'Sharding horizontally partitions data across multiple databases, with each shard containing a subset of the data.'
      },
      {
        id: 'q3-2',
        topicId: '3',
        question: 'What is a major disadvantage of hash-based sharding?',
        options: [
          'Uneven data distribution',
          'Complex implementation',
          'Range queries require querying all shards',
          'Single point of failure'
        ],
        correctIndex: 2,
        explanation: 'Hash-based sharding distributes data evenly but makes range queries inefficient as they must query all shards.'
      },
      {
        id: 'q3-3',
        topicId: '3',
        question: 'Which sharding strategy uses a lookup table to determine data location?',
        options: [
          'Range-based',
          'Hash-based',
          'Directory-based',
          'Round-robin'
        ],
        correctIndex: 2,
        explanation: 'Directory-based sharding uses a lookup table (directory) to map data to specific shards.'
      },
      {
        id: 'q3-4',
        topicId: '3',
        question: 'What should you consider BEFORE implementing sharding?',
        options: [
          'Hiring more database administrators',
          'Vertical scaling, read replicas, caching, query optimization',
          'Switching to a NoSQL database',
          'Implementing microservices'
        ],
        correctIndex: 1,
        explanation: 'Sharding is complex and should be a last resort. First try simpler solutions like bigger servers, read replicas, caching, and optimization.'
      },
      {
        id: 'q3-5',
        topicId: '3',
        question: 'What is a "hotspot" in the context of sharding?',
        options: [
          'A shard that has failed',
          'A shard receiving disproportionately high traffic',
          'A temporary cache location',
          'A backup shard'
        ],
        correctIndex: 1,
        explanation: 'A hotspot occurs when one shard receives much more traffic than others, often due to uneven data distribution.'
      }
    ],
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    title: 'Message Queues',
    description: 'Understand asynchronous communication patterns with message queues.',
    content: `
# Message Queues

Message queues enable asynchronous communication between services, decoupling producers from consumers and improving system resilience.

## Core Concepts

### Producer
Service that sends messages to the queue.

### Consumer
Service that receives and processes messages from the queue.

### Queue/Topic
Where messages are stored until consumed.

### Broker
The message queue system (RabbitMQ, Kafka, etc.)

## Why Use Message Queues?

### 1. Decoupling
Services don't need to know about each other.

### 2. Async Processing
Handle time-consuming tasks in the background.

### 3. Load Leveling
Smooth out traffic spikes.

### 4. Reliability
Messages persist until processed.

## Messaging Patterns

### Point-to-Point
One producer, one consumer per message.

### Publish-Subscribe
One message delivered to multiple subscribers.

### Request-Reply
Synchronous-style communication over async infrastructure.

## Delivery Guarantees

- **At-most-once**: Message may be lost
- **At-least-once**: Message may be delivered multiple times
- **Exactly-once**: Most difficult to achieve

## Popular Message Queues

### RabbitMQ
Traditional message broker, great for complex routing.

### Apache Kafka
Distributed event streaming, excellent for high throughput.

### Amazon SQS
Fully managed, easy to use.

### Redis Streams
Lightweight, good for simpler use cases.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
    category: 'Architecture',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    questions: [
      {
        id: 'q4-1',
        topicId: '4',
        question: 'What is the main benefit of using message queues for decoupling?',
        options: [
          'Faster message delivery',
          'Services don\'t need to know about each other',
          'Lower memory usage',
          'Simpler code'
        ],
        correctIndex: 1,
        explanation: 'Decoupling through message queues means services communicate via messages without direct dependencies on each other.'
      },
      {
        id: 'q4-2',
        topicId: '4',
        question: 'In the Publish-Subscribe pattern, how many consumers receive each message?',
        options: [
          'Only one consumer',
          'Exactly two consumers',
          'All subscribed consumers',
          'A random consumer'
        ],
        correctIndex: 2,
        explanation: 'In pub-sub, each message is delivered to all consumers that have subscribed to the topic.'
      },
      {
        id: 'q4-3',
        topicId: '4',
        question: 'Which delivery guarantee is the most difficult to achieve?',
        options: [
          'At-most-once',
          'At-least-once',
          'Exactly-once',
          'Best-effort'
        ],
        correctIndex: 2,
        explanation: 'Exactly-once delivery requires complex coordination to ensure messages are neither lost nor duplicated.'
      },
      {
        id: 'q4-4',
        topicId: '4',
        question: 'What is "load leveling" in the context of message queues?',
        options: [
          'Distributing messages equally across consumers',
          'Smoothing out traffic spikes by queuing messages',
          'Balancing CPU usage across servers',
          'Prioritizing important messages'
        ],
        correctIndex: 1,
        explanation: 'Load leveling uses the queue as a buffer to handle traffic spikes, preventing overwhelming downstream services.'
      },
      {
        id: 'q4-5',
        topicId: '4',
        question: 'Which message queue is known for high-throughput distributed event streaming?',
        options: [
          'RabbitMQ',
          'Amazon SQS',
          'Apache Kafka',
          'Redis'
        ],
        correctIndex: 2,
        explanation: 'Apache Kafka is designed for high-throughput, distributed event streaming and log aggregation.'
      }
    ],
    createdAt: '2024-01-04'
  },
  {
    id: '5',
    title: 'CAP Theorem',
    description: 'Understand the fundamental trade-offs in distributed systems.',
    content: `
# CAP Theorem

The CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition Tolerance.

## The Three Properties

### Consistency (C)
Every read receives the most recent write or an error. All nodes see the same data at the same time.

### Availability (A)
Every request receives a response (success or failure). The system remains operational.

### Partition Tolerance (P)
The system continues to operate despite network failures between nodes.

## Why Only Two?

In a distributed system, network partitions will happen. When they do:

- **CP System**: Sacrifices availability. Returns errors rather than stale data.
- **AP System**: Sacrifices consistency. May return stale data but remains available.

CA systems don't exist in practice because network partitions are unavoidable in distributed environments.

## PACELC Extension

A more nuanced view: "If there's a Partition, choose A or C; Else, choose Latency or Consistency."

## Real-World Examples

### CP Systems
- **MongoDB** (with majority write concern)
- **HBase**
- **Redis Cluster** (in certain configurations)

### AP Systems
- **Cassandra**
- **DynamoDB**
- **CouchDB**

## Eventual Consistency

Many AP systems use eventual consistency: given enough time without updates, all replicas converge to the same value.

## Choosing the Right Trade-off

- **Banking/Financial**: Usually CP (accuracy > availability)
- **Social Media**: Often AP (availability > perfect consistency)
- **E-commerce**: Hybrid approaches
    `,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    category: 'Theory',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    questions: [
      {
        id: 'q5-1',
        topicId: '5',
        question: 'What does the CAP theorem state?',
        options: [
          'Systems must have caching, APIs, and persistence',
          'Distributed systems can only guarantee two of: Consistency, Availability, Partition Tolerance',
          'Complexity, Availability, and Performance are always at odds',
          'All distributed systems are eventually consistent'
        ],
        correctIndex: 1,
        explanation: 'The CAP theorem states that a distributed system can provide only two of the three guarantees: Consistency, Availability, and Partition Tolerance.'
      },
      {
        id: 'q5-2',
        topicId: '5',
        question: 'What does a CP system sacrifice during a network partition?',
        options: [
          'Consistency',
          'Availability',
          'Performance',
          'Data storage'
        ],
        correctIndex: 1,
        explanation: 'A CP (Consistency + Partition Tolerance) system sacrifices availability, returning errors rather than potentially stale data.'
      },
      {
        id: 'q5-3',
        topicId: '5',
        question: 'Why don\'t CA (Consistency + Availability) systems exist in practice?',
        options: [
          'They\'re too expensive to build',
          'Network partitions are unavoidable in distributed systems',
          'They require too much memory',
          'No database supports this configuration'
        ],
        correctIndex: 1,
        explanation: 'Network partitions will inevitably occur in distributed systems, so partition tolerance is effectively mandatory.'
      },
      {
        id: 'q5-4',
        topicId: '5',
        question: 'What type of system would be best for a banking application?',
        options: [
          'AP - prioritizing availability',
          'CP - prioritizing consistency',
          'CA - prioritizing both',
          'None - CAP doesn\'t apply to banking'
        ],
        correctIndex: 1,
        explanation: 'Banking applications typically require CP systems because data accuracy is more important than availability during partitions.'
      },
      {
        id: 'q5-5',
        topicId: '5',
        question: 'What is eventual consistency?',
        options: [
          'Data is always immediately consistent',
          'Data will never be consistent',
          'Given enough time without updates, all replicas converge to the same value',
          'Only the primary replica has consistent data'
        ],
        correctIndex: 2,
        explanation: 'Eventual consistency means that if no new updates are made, all replicas will eventually hold the same data.'
      }
    ],
    createdAt: '2024-01-05'
  },
  {
    id: '6',
    title: 'API Design Best Practices',
    description: 'Learn how to design clean, scalable, and maintainable APIs.',
    content: `
# API Design Best Practices

Well-designed APIs are crucial for building scalable and maintainable systems. Let's explore the key principles.

## REST API Principles

### Use Nouns, Not Verbs
\`\`\`
✅ GET /users/123
❌ GET /getUser/123
\`\`\`

### Use HTTP Methods Correctly
- **GET**: Retrieve resources
- **POST**: Create new resources
- **PUT**: Update entire resources
- **PATCH**: Partial updates
- **DELETE**: Remove resources

### Use Proper Status Codes
- **2xx**: Success
- **4xx**: Client errors
- **5xx**: Server errors

## Versioning Strategies

### URL Path Versioning
\`/api/v1/users\`

### Header Versioning
\`Accept: application/vnd.api.v1+json\`

### Query Parameter
\`/api/users?version=1\`

## Pagination

Always paginate list endpoints:
\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
\`\`\`

## Rate Limiting

Protect your API from abuse:
- Return \`429 Too Many Requests\`
- Include rate limit headers
- Consider different limits per tier

## Error Handling

Return consistent error responses:
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "field": "email"
  }
}
\`\`\`

## Documentation

- Use OpenAPI/Swagger
- Provide examples
- Keep it updated
    `,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    category: 'APIs',
    difficulty: 'Beginner',
    estimatedTime: 20,
    questions: [
      {
        id: 'q6-1',
        topicId: '6',
        question: 'Which HTTP method should be used to create a new resource?',
        options: [
          'GET',
          'POST',
          'PUT',
          'PATCH'
        ],
        correctIndex: 1,
        explanation: 'POST is used to create new resources in RESTful APIs.'
      },
      {
        id: 'q6-2',
        topicId: '6',
        question: 'What status code should be returned when rate limiting kicks in?',
        options: [
          '401 Unauthorized',
          '403 Forbidden',
          '429 Too Many Requests',
          '503 Service Unavailable'
        ],
        correctIndex: 2,
        explanation: '429 Too Many Requests indicates the user has exceeded their rate limit.'
      },
      {
        id: 'q6-3',
        topicId: '6',
        question: 'What\'s the difference between PUT and PATCH?',
        options: [
          'PUT is faster than PATCH',
          'PUT updates entire resources, PATCH updates partial resources',
          'PUT is for creating, PATCH is for deleting',
          'There is no difference'
        ],
        correctIndex: 1,
        explanation: 'PUT replaces the entire resource while PATCH only updates the specified fields.'
      },
      {
        id: 'q6-4',
        topicId: '6',
        question: 'Which is the recommended RESTful endpoint design?',
        options: [
          'GET /getUser/123',
          'GET /users/123',
          'GET /user?id=123',
          'GET /fetchUserById/123'
        ],
        correctIndex: 1,
        explanation: 'REST APIs should use nouns (users) with the HTTP method (GET) indicating the action.'
      },
      {
        id: 'q6-5',
        topicId: '6',
        question: 'Why is pagination important for list endpoints?',
        options: [
          'It makes the API faster to develop',
          'It prevents returning too much data at once, improving performance',
          'It\'s required by HTTP standards',
          'It simplifies authentication'
        ],
        correctIndex: 1,
        explanation: 'Pagination prevents overwhelming clients with large data sets and reduces server load.'
      }
    ],
    createdAt: '2024-01-06'
  }
];

// Mock current user - stored in memory (would come from Flask backend)
let currentUser: User | null = null;

// Mock user database
const mockUsers: Map<string, User & { password: string }> = new Map([
  ['admin@example.com', {
    id: 'admin-1',
    email: 'admin@example.com',
    username: 'Admin',
    role: 'admin',
    password: 'admin123',
    dailyStreak: 15,
    practiceStreak: 8,
    bestDailyStreak: 30,
    bestPracticeStreak: 12,
    topicsCompleted: 25,
    totalQuizzes: 50,
    correctAnswers: 42,
    lastDailyCompletion: getTodayDate(),
    lastPracticeCompletion: getTodayDate()
  }],
  ['user@example.com', {
    id: 'user-1',
    email: 'user@example.com',
    username: 'TestUser',
    role: 'user',
    password: 'user123',
    dailyStreak: 5,
    practiceStreak: 3,
    bestDailyStreak: 10,
    bestPracticeStreak: 5,
    topicsCompleted: 8,
    totalQuizzes: 15,
    correctAnswers: 11,
    lastDailyCompletion: null,
    lastPracticeCompletion: null
  }]
]);

// Completed topics tracking (userId -> Set of topicIds)
const completedTopics: Map<string, Set<string>> = new Map([
  ['admin-1', new Set(['1', '2', '3'])],
  ['user-1', new Set(['1'])]
]);

// Daily completions tracking (userId -> date string)
const dailyCompletions: Map<string, string> = new Map();

// Auth functions (mock Flask API)
export const mockAuth = {
  login: (email: string, password: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.get(email);
        if (user && user.password === password) {
          const { password: _, ...userWithoutPassword } = user;
          currentUser = userWithoutPassword;
          localStorage.setItem('mockUser', JSON.stringify(currentUser));
          resolve(currentUser);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  signup: (email: string, password: string, username: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (mockUsers.has(email)) {
          reject(new Error('Email already registered'));
          return;
        }
        const newUser: User & { password: string } = {
          id: `user-${Date.now()}`,
          email,
          username,
          role: 'user',
          password,
          dailyStreak: 0,
          practiceStreak: 0,
          bestDailyStreak: 0,
          bestPracticeStreak: 0,
          topicsCompleted: 0,
          totalQuizzes: 0,
          correctAnswers: 0,
          lastDailyCompletion: null,
          lastPracticeCompletion: null
        };
        mockUsers.set(email, newUser);
        completedTopics.set(newUser.id, new Set());
        const { password: _, ...userWithoutPassword } = newUser;
        currentUser = userWithoutPassword;
        localStorage.setItem('mockUser', JSON.stringify(currentUser));
        resolve(currentUser);
      }, 500);
    });
  },

  logout: (): void => {
    currentUser = null;
    localStorage.removeItem('mockUser');
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },

  updateUser: (updates: Partial<User>): void => {
    if (currentUser) {
      currentUser = { ...currentUser, ...updates };
      localStorage.setItem('mockUser', JSON.stringify(currentUser));
      const fullUser = mockUsers.get(currentUser.email);
      if (fullUser) {
        mockUsers.set(currentUser.email, { ...fullUser, ...updates });
      }
    }
  }
};

// Topic/Quiz functions
export const mockTopicService = {
  getDailyTopic: (): Topic => {
    const index = getDailyTopicIndex();
    return mockTopics[index];
  },

  getAllTopics: (): Topic[] => {
    return mockTopics;
  },

  getTopicById: (id: string): Topic | undefined => {
    return mockTopics.find(t => t.id === id);
  },

  hasCompletedDaily: (userId: string): boolean => {
    const lastCompletion = dailyCompletions.get(userId);
    return lastCompletion === getTodayDate();
  },

  hasCompletedTopic: (userId: string, topicId: string): boolean => {
    const userCompleted = completedTopics.get(userId);
    return userCompleted?.has(topicId) || false;
  },

  submitDailyQuiz: (userId: string, correctCount: number, totalQuestions: number): { newStreak: number; streakIncreased: boolean } => {
    const user = mockAuth.getCurrentUser();
    if (!user) return { newStreak: 0, streakIncreased: false };

    const today = getTodayDate();
    const alreadyCompleted = dailyCompletions.get(userId) === today;

    if (alreadyCompleted) {
      return { newStreak: user.dailyStreak, streakIncreased: false };
    }

    // Check if yesterday was completed for streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const lastCompletion = dailyCompletions.get(userId);

    let newStreak: number;
    if (lastCompletion === yesterdayStr) {
      newStreak = user.dailyStreak + 1;
    } else if (!lastCompletion) {
      newStreak = 1;
    } else {
      newStreak = 1; // Streak broken
    }

    dailyCompletions.set(userId, today);
    
    const dailyTopic = mockTopicService.getDailyTopic();
    const userCompleted = completedTopics.get(userId) || new Set();
    userCompleted.add(dailyTopic.id);
    completedTopics.set(userId, userCompleted);

    mockAuth.updateUser({
      dailyStreak: newStreak,
      bestDailyStreak: Math.max(newStreak, user.bestDailyStreak),
      topicsCompleted: userCompleted.size,
      totalQuizzes: user.totalQuizzes + 1,
      correctAnswers: user.correctAnswers + correctCount,
      lastDailyCompletion: today
    });

    return { newStreak, streakIncreased: true };
  },

  submitLibraryQuiz: (userId: string, topicId: string, correctCount: number): { newStreak: number } => {
    const user = mockAuth.getCurrentUser();
    if (!user) return { newStreak: 0 };

    const userCompleted = completedTopics.get(userId) || new Set();
    userCompleted.add(topicId);
    completedTopics.set(userId, userCompleted);

    const newStreak = user.practiceStreak + 1;

    mockAuth.updateUser({
      practiceStreak: newStreak,
      bestPracticeStreak: Math.max(newStreak, user.bestPracticeStreak),
      topicsCompleted: userCompleted.size,
      totalQuizzes: user.totalQuizzes + 1,
      correctAnswers: user.correctAnswers + correctCount,
      lastPracticeCompletion: getTodayDate()
    });

    return { newStreak };
  }
};
