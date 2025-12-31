"""
Database seeding script to populate initial topics, questions, and demo users
Run this after creating the database to add the initial learning content
"""
try:
    from backend.app import create_app
    from backend.models import db, Topic, Question, User
except ModuleNotFoundError:
    from app import create_app
    from models import db, Topic, Question, User
from datetime import date

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("Seeding database...")
        
        # Create single admin user with credentials provided by the developer
        admin_email = 'ziauddinrayan97@gmail.com'
        admin_password = 'Ziarayan$1998'

        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            admin_user = User(
                id='admin-1',
                email=admin_email,
                username='Admin',
                role='admin'
            )
            admin_user.set_password(admin_password)
            db.session.add(admin_user)
            print(f"Created admin user: {admin_email} / {admin_password}")
        else:
            print("Admin user already exists")
        
        db.session.commit()

        # Instead of skipping seeding entirely when some topics exist,
        # insert only topics/questions that are missing. This allows adding
        # new topics without wiping or requiring an empty DB.
        print("Seeding topics and questions (adding missing entries)...")
        
        # Topic 1: Load Balancing Fundamentals
        topic1 = Topic(
            id='1',
            title='Load Balancing Fundamentals',
            description='Learn how load balancers distribute traffic across servers for high availability and scalability.',
            content='''# Load Balancing Fundamentals

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
- **Google Cloud Load Balancing**''',
            image_url='https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
            category='Infrastructure',
            difficulty='Beginner',
            estimated_time=15,
            created_at=date(2024, 1, 1)
        )
        
        questions1 = [
            Question(
                id='q1-1',
                topic_id='1',
                question='What is the primary purpose of a load balancer?',
                options=[
                    'To store data redundantly',
                    'To distribute traffic across multiple servers',
                    'To encrypt network traffic',
                    'To compress data before sending'
                ],
                correct_index=1,
                explanation='Load balancers distribute incoming traffic across multiple servers to prevent any single server from becoming overwhelmed.'
            ),
            Question(
                id='q1-2',
                topic_id='1',
                question='Which load balancing algorithm routes requests to the server with the fewest active connections?',
                options=['Round Robin', 'IP Hash', 'Least Connections', 'Random'],
                correct_index=2,
                explanation='Least Connections algorithm routes new requests to the server currently handling the fewest connections.'
            ),
            Question(
                id='q1-3',
                topic_id='1',
                question='What layer does a Layer 7 load balancer operate at?',
                options=['Physical Layer', 'Transport Layer', 'Application Layer', 'Network Layer'],
                correct_index=2,
                explanation='Layer 7 load balancers operate at the Application Layer (HTTP), allowing intelligent routing based on content.'
            ),
            Question(
                id='q1-4',
                topic_id='1',
                question='Why is IP Hash useful as a load balancing algorithm?',
                options=[
                    'It provides the fastest response times',
                    'It ensures the same client always reaches the same server',
                    'It uses the least server resources',
                    'It automatically scales servers'
                ],
                correct_index=1,
                explanation='IP Hash uses the client IP address to consistently route requests to the same server, which is useful for session persistence.'
            ),
            Question(
                id='q1-5',
                topic_id='1',
                question='What happens when a load balancer detects an unhealthy server?',
                options=[
                    'It restarts the server automatically',
                    'It removes the server from the pool and stops sending traffic',
                    'It sends more traffic to force a restart',
                    'It logs an error and continues sending traffic'
                ],
                correct_index=1,
                explanation='Load balancers remove unhealthy servers from the pool to prevent routing traffic to failed instances.'
            )
        ]
        
        # Topic 2: Caching Strategies
        topic2 = Topic(
            id='2',
            title='Caching Strategies',
            description='Understand different caching strategies and when to use them for optimal performance.',
            content='''# Caching Strategies

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
- **CDNs**: CloudFlare, Fastly, AWS CloudFront''',
            image_url='https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop',
            category='Performance',
            difficulty='Intermediate',
            estimated_time=20,
            created_at=date(2024, 1, 2)
        )
        
        questions2 = [
            Question(
                id='q2-1',
                topic_id='2',
                question='In the Cache-Aside pattern, what happens on a cache miss?',
                options=[
                    'An error is returned to the user',
                    'The application loads data from the database and populates the cache',
                    'The cache automatically fetches from the database',
                    'The request is retried indefinitely'
                ],
                correct_index=1,
                explanation='In Cache-Aside, the application is responsible for loading data from the database on a cache miss and then populating the cache.'
            ),
            Question(
                id='q2-2',
                topic_id='2',
                question='What is a major risk of the Write-Behind caching pattern?',
                options=[
                    'Slow read performance',
                    'Cache inconsistency',
                    'Potential data loss if cache fails before database write',
                    'High memory usage'
                ],
                correct_index=2,
                explanation='Write-Behind writes to cache first and database asynchronously, risking data loss if the cache fails before the database is updated.'
            ),
            Question(
                id='q2-3',
                topic_id='2',
                question='What does TTL stand for in caching?',
                options=['Time To Live', 'Transfer To Layer', 'Total Transfer Load', 'Temporary Token Limit'],
                correct_index=0,
                explanation='TTL (Time To Live) specifies how long cached data remains valid before it expires.'
            ),
            Question(
                id='q2-4',
                topic_id='2',
                question='Which eviction policy removes the least recently accessed items?',
                options=['FIFO', 'LFU', 'LRU', 'Random'],
                correct_index=2,
                explanation='LRU (Least Recently Used) evicts items that haven\'t been accessed for the longest time.'
            ),
            Question(
                id='q2-5',
                topic_id='2',
                question='Which caching pattern ensures the cache is always consistent with the database?',
                options=['Cache-Aside', 'Write-Behind', 'Write-Through', 'Lazy Loading'],
                correct_index=2,
                explanation='Write-Through writes data to both cache and database simultaneously, ensuring consistency.'
            )
        ]
        
        # Topic 3: Scalability Patterns
        topic3 = Topic(
            id='3',
            title='Scalability Patterns',
            description='Common patterns to scale services and handle increased load.',
            content='''# Scalability Patterns

Scalability patterns help systems grow to handle more traffic and data. Examples include horizontal scaling, partitioning, and async processing.

## Key Patterns

- Horizontal scaling (add more instances)
- Partitioning / Sharding (split data)
- CQRS and Command queues (separate reads/writes)
- Backpressure and rate limiting
''',
            image_url='https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
            category='Architecture',
            difficulty='Intermediate',
            estimated_time=25,
            created_at=date(2024, 1, 3)
        )

        questions3 = [
            Question(
                id='q3-1',
                topic_id='3',
                question='What is horizontal scaling?',
                options=['Adding more CPU per machine', 'Adding more instances of the service', 'Using a faster disk', 'Caching responses'],
                correct_index=1,
                explanation='Horizontal scaling means adding more instances/servers to distribute load.'
            ),
            Question(
                id='q3-2',
                topic_id='3',
                question='What problem does sharding solve?',
                options=['Reduces latency by caching', 'Improves write throughput by partitioning data', 'Encrypts data at rest', 'Simplifies deploys'],
                correct_index=1,
                explanation='Sharding partitions data to distribute load and improve throughput.'
            ),
        ]

        # Topic 4: Database Sharding
        topic4 = Topic(
            id='4',
            title='Database Sharding',
            description='Techniques and trade-offs for splitting databases to scale.',
            content='''# Database Sharding

Sharding splits a large dataset across multiple database instances by key, range, or hash to improve write/read capacity.

## Considerations

- Choosing a shard key
- Rebalancing shards
- Cross-shard joins are expensive
''',
            image_url='https://images.unsplash.com/photo-1542223616-9f8e0b1f6d8d?w=800&h=400&fit=crop',
            category='Databases',
            difficulty='Advanced',
            estimated_time=30,
            created_at=date(2024, 1, 4)
        )

        questions4 = [
            Question(
                id='q4-1',
                topic_id='4',
                question='Which is a common shard key choice?',
                options=['Random GUID', 'Monotonically increasing ID', 'User ID', 'Password hash'],
                correct_index=2,
                explanation='User ID or another high-cardinality attribute is commonly used as a shard key.'
            ),
            Question(
                id='q4-2',
                topic_id='4',
                question='What is a downside of sharding?',
                options=['Simpler backups', 'Cross-shard joins become harder', 'Lower read throughput', 'Eliminates need for replication'],
                correct_index=1,
                explanation='Cross-shard joins are complex and can hurt performance.'
            ),
        ]

        # Topic 5: Observability & Monitoring
        topic5 = Topic(
            id='5',
            title='Observability & Monitoring',
            description='Principles for making systems observable and monitoring them in production.',
            content='''# Observability & Monitoring

Observability helps you understand system behavior through logs, metrics, and traces. Monitoring alerts you to issues in production.

## Pillars
- Metrics
- Logs
- Distributed Tracing
''',
            image_url='https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&h=400&fit=crop',
            category='Reliability',
            difficulty='Intermediate',
            estimated_time=20,
            created_at=date(2024, 1, 5)
        )

        questions5 = [
            Question(
                id='q5-1',
                topic_id='5',
                question='Which of the following is NOT one of the three pillars of observability?',
                options=['Metrics', 'Logs', 'Distributed Traces', 'Backups'],
                correct_index=3,
                explanation='Backups are important but not one of the observability pillars.'
            ),
            Question(
                id='q5-2',
                topic_id='5',
                question='What is distributed tracing useful for?',
                options=['Encrypting traffic', 'Profiling CPU usage', 'Following a request across services', 'Storing logs long-term'],
                correct_index=2,
                explanation='Distributed tracing helps follow a request across microservices to diagnose latency.'
            ),
        ]

        # Helper to add a topic and its questions only if they don't already exist
        def add_topic_and_questions(topic_obj, questions_list):
            existing = Topic.query.get(topic_obj.id)
            if existing:
                print(f"Topic already exists: {topic_obj.id} - {topic_obj.title}")
            else:
                db.session.add(topic_obj)
                print(f"Adding topic: {topic_obj.id} - {topic_obj.title}")

            for q in questions_list:
                if Question.query.get(q.id):
                    print(f" Question exists: {q.id}")
                else:
                    db.session.add(q)
                    print(f" Adding question: {q.id}")

        add_topic_and_questions(topic1, questions1)
        add_topic_and_questions(topic2, questions2)
        add_topic_and_questions(topic3, questions3)
        add_topic_and_questions(topic4, questions4)
        add_topic_and_questions(topic5, questions5)

        db.session.commit()
        print(f"Seeding complete. Now {Topic.query.count()} topics and {Question.query.count()} questions exist in the DB.")

if __name__ == '__main__':
    seed_database()

