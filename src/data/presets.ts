import { PresetSample } from '../types';

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'python-none-get',
    filename: 'auth_service/login.py',
    language: 'python',
    title: 'Python: AttributeError on NoneType',
    errorCategory: 'Null Reference Exception',
    errorLine: 42,
    severity: 'CRITICAL',
    code: `def process_login(user_id):
    user = db.get_user(user_id)
    # Logic fails here if ID is invalid
    permissions = user.get("scope")
    return permissions`,
    errorLog: `AttributeError: 'NoneType' object has no attribute 'get' at line 42 in process_login(user_id="usr_99812")`,
    precomputedDiagnosis: `The root cause is a **Null Reference Exception** (\`NoneType\` in Python). The variable \`user\` is assigned the result of \`db.get_user(user_id)\`, which returns \`None\` when the user ID is not found in the database.

Attempting to call the \`.get()\` method on a \`None\` object on **Line 42** triggers the runtime failure. This typically occurs when incoming request data isn't validated against existing records before querying attributes.`,
    precomputedFix: `def process_login(user_id):
    user = db.get_user(user_id)

    # Add guard clause for NoneType safety
    if user is None:
        raise ValueError(f"User {user_id} not found")

    return user.get("scope", [])`
  },
  {
    id: 'react-typeerror-null',
    filename: 'components/UserProfile.tsx',
    language: 'typescript',
    title: 'React/TS: Cannot read properties of null',
    errorCategory: 'Uncaught TypeError',
    errorLine: 12,
    severity: 'HIGH',
    code: `import { useState, useEffect } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(user => setData(user.profile));
  }, [userId]);

  return (
    <div className="user-card">
      <h2>{data.name.toUpperCase()}</h2>
      <p>{data.email}</p>
    </div>
  );
}`,
    errorLog: `TypeError: Cannot read properties of null (reading 'name')
    at UserProfile (UserProfile.tsx:12:17)
    at renderWithHooks (react-dom.development.js:16305)`,
    precomputedDiagnosis: `The root cause is an **Uncaught TypeError** due to rendering state before asynchronous data fetching completes. Initial state \`data\` is initialized to \`null\`.

When the component mounts, React evaluates **Line 12** before the \`fetch\` promise resolves. Attempting to access \`data.name\` on a \`null\` reference throws an unhandled runtime exception.`,
    precomputedFix: `import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
}

export function UserProfile({ userId }: { userId: string }) {
  const [data, setData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(\`/api/users/\${userId}\`)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP error! status: \${res.status}\`);
        return res.json();
      })
      .then(user => {
        if (isMounted) {
          setData(user.profile);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (isLoading) return <div className="loading">Loading profile...</div>;
  if (!data) return <div className="error">Profile not found.</div>;

  return (
    <div className="user-card">
      <h2>{data.name.toUpperCase()}</h2>
      <p>{data.email}</p>
    </div>
  );
}`
  },
  {
    id: 'node-connection-leak',
    filename: 'services/orderService.js',
    language: 'javascript',
    title: 'Node.js: Database Connection Leak',
    errorCategory: 'Resource Exhaustion',
    errorLine: 5,
    severity: 'CRITICAL',
    code: `const mysql = require('mysql2/promise');

async function getUserOrders(userId) {
  const connection = await mysql.createConnection({
    host: 'localhost', user: 'root', database: 'shop'
  });
  const [rows] = await connection.execute(
    'SELECT * FROM orders WHERE user_id = ?', [userId]
  );
  return rows;
}`,
    errorLog: `Error: Too many connections
    at Protocol.Sequence._packetToError (Protocol.js:140)
    at Protocol.Sequence.end (Protocol.js:83)
    at Connection.query (Connection.js:180)`,
    precomputedDiagnosis: `The root cause is an **Unclosed Database Connection Leak**. Each function invocation creates a new TCP database socket with \`mysql.createConnection()\`, but never calls \`connection.end()\` or uses a connection pool.

Under moderate traffic, active socket handles accumulate rapidly until the server exceeds \`max_connections\`, causing all subsequent database queries to crash.`,
    precomputedFix: `const mysql = require('mysql2/promise');

// Use a connection pool rather than opening fresh single connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'shop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getUserOrders(userId) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM orders WHERE user_id = ?',
      [userId]
    );
    return rows;
  } finally {
    if (connection) {
      connection.release(); // Safely return connection back to pool
    }
  }
}`
  },
  {
    id: 'go-concurrent-map',
    filename: 'telemetry/stats.go',
    language: 'go',
    title: 'Go: Concurrent Map Writes',
    errorCategory: 'Concurrency Data Race',
    errorLine: 10,
    severity: 'CRITICAL',
    code: `package main

import "sync"

type SafeStats struct {
    counters map[string]int
}

func (s *SafeStats) Increment(key string) {
    s.counters[key]++
}

func main() {
    stats := &SafeStats{counters: make(map[string]int)}
    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            stats.Increment("requests")
        }()
    }
    wg.Wait()
}`,
    errorLog: `fatal error: concurrent map writes

goroutine 18 [running]:
main.(*SafeStats).Increment(...)
	/telemetry/stats.go:10 +0x44`,
    precomputedDiagnosis: `The root cause is a **Concurrent Map Read/Write Data Race**. Go standard library maps are not thread-safe for concurrent writes across multiple goroutines.

On **Line 10**, multiple goroutines spawned in the \`for\` loop attempt to mutate \`s.counters["requests"]\` simultaneously without synchronization, triggering Go's runtime panic detector.`,
    precomputedFix: `package main

import (
    "sync"
)

type SafeStats struct {
    mu       sync.Mutex
    counters map[string]int
}

func (s *SafeStats) Increment(key string) {
    s.mu.Lock()
    defer s.mu.Unlock()
    s.counters[key]++
}

func main() {
    stats := &SafeStats{counters: make(map[string]int)}
    var wg sync.WaitGroup
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            stats.Increment("requests")
        }()
    }
    wg.Wait()
}`
  },
  {
    id: 'cpp-dangling-pointer',
    filename: 'core/allocator.cpp',
    language: 'cpp',
    title: 'C++: Dangling Pointer Return',
    errorCategory: 'Memory Corruption',
    errorLine: 5,
    severity: 'HIGH',
    code: `#include <iostream>

int* create_counter() {
    int count = 100;
    return &count;
}

int main() {
    int* ptr = create_counter();
    std::cout << "Value: " << *ptr << std::endl;
    return 0;
}`,
    errorLog: `warning: address of local variable 'count' returned [-Wreturn-local-addr]
Segmentation fault (core dumped)`,
    precomputedDiagnosis: `The root cause is returning the address of a local stack frame variable, leading to a **Dangling Pointer**. The local variable \`count\` allocated in \`create_counter()\` is deallocated when the function frame pops off the call stack.

Dereferencing \`*ptr\` inside \`main()\` accesses invalidated memory, triggering undefined behavior or a Segmentation Fault.`,
    precomputedFix: `#include <iostream>
#include <memory>

// Solution 1: Pass by value or use smart pointers for dynamic allocation
std::unique_ptr<int> create_counter() {
    return std::make_unique<int>(100);
}

int main() {
    auto ptr = create_counter();
    if (ptr) {
        std::cout << "Value: " << *ptr << std::endl;
    }
    return 0;
}`
  }
];
