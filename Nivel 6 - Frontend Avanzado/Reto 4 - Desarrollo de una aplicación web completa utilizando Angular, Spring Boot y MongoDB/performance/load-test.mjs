const apiUrl = process.env.API_URL ?? 'http://localhost:8080/api';
const requestCount = Number(process.env.REQUESTS ?? 100);
const concurrency = Number(process.env.CONCURRENCY ?? 10);

async function registerTemporaryUser() {
  const email = `load-${Date.now()}@example.com`;
  const response = await fetch(`${apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Load Test', email, password: 'password123' }),
  });
  if (!response.ok) throw new Error(`No se pudo crear el usuario temporal: HTTP ${response.status}`);
  return (await response.json()).token;
}

function percentile(values, value) {
  const index = Math.min(values.length - 1, Math.ceil(value * values.length) - 1);
  return values[index];
}

const token = await registerTemporaryUser();
const durations = [];
let errors = 0;
let completed = 0;
const startedAt = performance.now();

async function requestEvents() {
  const requestStartedAt = performance.now();
  try {
    const response = await fetch(`${apiUrl}/events`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) errors += 1;
    await response.arrayBuffer();
  } catch {
    errors += 1;
  } finally {
    durations.push(performance.now() - requestStartedAt);
    completed += 1;
  }
}

while (completed < requestCount) {
  const batchSize = Math.min(concurrency, requestCount - completed);
  await Promise.all(Array.from({ length: batchSize }, requestEvents));
}

durations.sort((a, b) => a - b);
const elapsedSeconds = (performance.now() - startedAt) / 1000;
console.log(JSON.stringify({
  apiUrl,
  requests: requestCount,
  concurrency,
  errors,
  errorRate: `${((errors / requestCount) * 100).toFixed(2)}%`,
  p50Ms: Number(percentile(durations, 0.5).toFixed(2)),
  p95Ms: Number(percentile(durations, 0.95).toFixed(2)),
  maxMs: Number(Math.max(...durations).toFixed(2)),
  throughputRequestsPerSecond: Number((requestCount / elapsedSeconds).toFixed(2)),
}, null, 2));

if (errors > 0) process.exitCode = 1;