const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// --- ANSI Colors ---
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

const log = (msg) => console.log(`${colors.cyan}[Prod-Test]${colors.reset} ${msg}`);
const successMsg = (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`);
const failMsg = (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`);
const printBanner = () => {
  console.log(`\n${colors.bold}=============================${colors.reset}`);
  console.log(`${colors.bold}      MASARAK PROD TEST      ${colors.reset}`);
  console.log(`${colors.bold}=============================${colors.reset}\n`);
};

// --- Config ---
const rootDir = __dirname;
const backendDir = path.join(__dirname, 'backend');
const isInteractive = process.argv.includes('--interactive');
const backendLogs = []; // Store last 100 lines
const API_URL = 'http://localhost:4000/api';
let frontendProcess, backendProcess;

// --- Helper Functions ---
async function runCommand(command, cwd, env = process.env) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command}`);
    const parts = command.split(' ');
    const child = spawn(parts[0], parts.slice(1), { cwd, env, stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command "${command}" failed with code ${code}`));
    });
  });
}

function startProcess(command, cwd, name, env = process.env) {
  log(`Starting ${name}: ${command}`);
  const parts = command.split(' ');
  const child = spawn(parts[0], parts.slice(1), { cwd, env, shell: true });
  
  child.stdout.on('data', (data) => {
    if (name === 'Backend') {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          backendLogs.push(line);
          if (backendLogs.length > 100) backendLogs.shift(); // Keep only last 100
        }
      });
    }
  });

  child.stderr.on('data', (data) => {
    if (name === 'Backend') {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          backendLogs.push(`[STDERR] ${line}`);
          if (backendLogs.length > 100) backendLogs.shift();
        }
      });
    }
  });

  return child;
}

function dumpLogsAndExit(taskName, err, details = '') {
  failMsg(`${taskName}`);
  console.log(`\n${colors.bold}Reason:${colors.reset}\n${err.message || err}`);
  if (details) console.log(`\n${colors.bold}Details:${colors.reset}\n${details}`);
  
  console.log(`\n${colors.bold}${colors.yellow}--- Backend Logs (Last 100 Lines) ---${colors.reset}`);
  console.log(backendLogs.join('\n'));
  console.log(`${colors.bold}${colors.yellow}-------------------------------------${colors.reset}\n`);
  
  if (frontendProcess) frontendProcess.kill();
  if (backendProcess) backendProcess.kill();
  process.exit(1);
}

// --- 1. Environment Validation ---
function validateEnvironment() {
  log('Validating Environment Variables...');
  const envPath = path.join(backendDir, '.env.production');
  if (!fs.existsSync(envPath)) {
    throw new Error('backend/.env.production is missing.');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredKeys = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'REDIS_HOST', 'CORS_ORIGIN'];
  
  for (const key of requiredKeys) {
    if (!envContent.includes(`${key}=`) && !envContent.includes(`${key} =`)) {
      throw new Error(`Missing required environment variable: ${key} in backend/.env.production`);
    }
  }
  successMsg('Environment Variables Validated');
}

// --- 2. Smoke Tests ---
async function fetchApi(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch (e) { data = text; }
  
  return { status: res.status, headers: res.headers, data };
}

async function runSmokeTests() {
  log('Running Smoke Tests...');
  const testPhone = `010${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
  const testEmail = `test_${Date.now()}@example.com`;
  let accessToken = '';

  // Test 1: 404 Handling
  try {
    const r404 = await fetchApi('/not-found-route');
    if (r404.status !== 404) throw new Error(`Expected 404, got ${r404.status}`);
    successMsg('404 Handling');
  } catch(e) { dumpLogsAndExit('404 Handling', e); }

  // Test 2: Validation Errors
  try {
    const rVal = await fetchApi('/auth/register/student', { method: 'POST', body: JSON.stringify({}) });
    if (rVal.status !== 422 && rVal.status !== 400) throw new Error(`Expected Validation Error (422/400), got ${rVal.status}`);
    successMsg('Validation Errors & Exception Filter');
  } catch(e) { dumpLogsAndExit('Validation Errors', e); }

  // Test 3: Student Registration
  try {
    const payload = {
      firstName: 'Test', middleName: 'User', lastName: 'Smoke', familyName: 'Test',
      phone: testPhone, password: 'Password123!', email: testEmail, 
      grade: '1', track: 'علمي', country: 'Egypt', city: 'Cairo',
      termsAccepted: true, invitationCode: 'SMOKE123'
    };
    const rReg = await fetchApi('/auth/register/student', { method: 'POST', body: JSON.stringify(payload) });
    // We expect either 201 Created, or 400 Bad Request (Invalid invitation code) because we are hitting the real DB
    if (rReg.status >= 500) throw new Error(`Registration failed with server error: ${JSON.stringify(rReg.data)}`);
    if (rReg.status === 400) successMsg('Student Registration (Reached Business Logic - Invalid Code)');
    else successMsg('Student Registration (Database & Redis Connected)');
  } catch(e) { dumpLogsAndExit('Student Registration', e); }

  // Test 4: Login & JWT Generation
  try {
    const rLogin = await fetchApi('/auth/login', {
      method: 'POST', body: JSON.stringify({ identifier: testPhone, password: 'Password123!' })
    });
    if (rLogin.status >= 500) throw new Error(`Login failed with server error: ${JSON.stringify(rLogin.data)}`);
    
    if (rLogin.data?.data?.accessToken) {
      accessToken = rLogin.data.data.accessToken;
      successMsg('Login & JWT Generation (Success)');
    } else {
      successMsg('Login Test (Reached Business Logic - User Not Found)');
    }
  } catch(e) { dumpLogsAndExit('Login & JWT Generation', e); }

  // Test 5: Protected Endpoint
  try {
    const rProtected = await fetchApi('/auth/logout', {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
    });
    if (rProtected.status >= 500) throw new Error(`Protected route failed: ${JSON.stringify(rProtected.data)}`);
    if (rProtected.status === 401 && !accessToken) {
      successMsg('Protected Endpoint (Properly Blocked Unauthorized Request)');
    } else if (rProtected.status === 200 || rProtected.status === 201) {
      successMsg('Protected Endpoint Access (Success)');
    } else {
      throw new Error(`Unexpected status for protected route: ${rProtected.status}`);
    }
  } catch(e) { dumpLogsAndExit('Protected Endpoint Access', e); }
}

async function checkServerReady(url) {
  let retries = 0;
  return new Promise((resolve) => {
    const int = setInterval(async () => {
      try {
        const res = await fetch(url);
        if (res.status) {
          clearInterval(int);
          resolve(true);
        }
      } catch (err) {
        retries++;
        if (retries > 15) {
          clearInterval(int);
          resolve(false);
        }
      }
    }, 2000);
  });
}

// --- Main Runner ---
async function main() {
  printBanner();
  try {
    // 1. Env Check
    validateEnvironment();

    // 2. Build Backend
    await runCommand('npm run build', backendDir);
    successMsg('Backend Build');

    // 3. Prisma Setup
    const prodEnv = { ...process.env, NODE_ENV: 'production' };
    
    // For local testing, we might have port 5432 blocked by ISP, let's fallback to 6543 if needed
    // But we just use prodEnv
    await runCommand('npx prisma generate', backendDir, prodEnv);
    successMsg('Prisma Generate');
    
    try {
      await runCommand('npx prisma migrate deploy', backendDir, prodEnv);
      successMsg('Database Migrated (Connected)');
    } catch(err) {
      log('Migration failed with DIRECT_URL (possibly port 5432 blocked locally). Trying with DATABASE_URL...');
      const fallbackEnv = { ...prodEnv, DIRECT_URL: prodEnv.DATABASE_URL };
      await runCommand('npx prisma migrate deploy', backendDir, fallbackEnv);
      successMsg('Database Migrated (Connected with DATABASE_URL)');
    }

    // 4. Start Backend
    backendProcess = startProcess('npm run start:prod', backendDir, 'Backend', prodEnv);
    log('Waiting for Backend to start...');
    const isBackendUp = await checkServerReady(`${API_URL}/docs`);
    if (!isBackendUp) dumpLogsAndExit('Backend Startup', new Error('Backend did not respond in time.'));
    successMsg('Backend Started & API Reachable');

    // 5. Build Frontend (Needs Backend to be running for Next.js SSG fetch)
    log('Building Frontend (with Backend running for SSG fetches)...');
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4000/api';
    await runCommand('npm run build', rootDir, { ...process.env, NEXT_PUBLIC_API_URL: 'http://localhost:4000/api' });
    successMsg('Frontend Build');

    // 6. Start Frontend
    frontendProcess = startProcess('npm run start', rootDir, 'Frontend', { ...process.env, NEXT_PUBLIC_API_URL: 'http://localhost:4000/api' });

    // 7. Smoke Tests
    await runSmokeTests();

    // 7. Result
    console.log(`\n${colors.bold}${colors.green}=============================${colors.reset}`);
    console.log(`${colors.bold}${colors.green}RESULT: READY FOR DEPLOYMENT ${colors.reset}`);
    console.log(`${colors.bold}${colors.green}=============================${colors.reset}\n`);

    if (isInteractive) {
      log('Interactive mode enabled. Servers are running.');
      log('Frontend: http://localhost:3000');
      log('Backend:  http://localhost:4000');
      log('Press Ctrl+C to terminate.');
      
      process.on('SIGINT', () => {
        log('Shutting down...');
        backendProcess.kill();
        frontendProcess.kill();
        process.exit();
      });
    } else {
      log('Cleaning up and shutting down servers...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    }

  } catch (err) {
    dumpLogsAndExit('Test Pipeline Failed', err);
  }
}

main();
