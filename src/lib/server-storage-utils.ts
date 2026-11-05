import fs from 'fs';
import path from 'path';
import os from 'os';

let cachedDataDir: string | null = null;

export function getServerDataDir(): string {
  if (cachedDataDir && fs.existsSync(cachedDataDir)) {
    return cachedDataDir;
  }

  // 1. Explicit environment variable
  if (process.env.PANGGIL_DATA_DIR) {
    try {
      if (!fs.existsSync(process.env.PANGGIL_DATA_DIR)) {
        fs.mkdirSync(process.env.PANGGIL_DATA_DIR, { recursive: true });
      }
      cachedDataDir = process.env.PANGGIL_DATA_DIR;
      return cachedDataDir;
    } catch {}
  }

  // 2. Local Windows scratch workspace path
  const localAppDir = 'C:\\Users\\adham\\.gemini\\antigravity\\scratch\\panggil-app\\data';
  try {
    if (!fs.existsSync(localAppDir)) {
      fs.mkdirSync(localAppDir, { recursive: true });
    }
    cachedDataDir = localAppDir;
    return cachedDataDir;
  } catch {}

  // 3. Look for /data directory relative to current working directory or upward
  let current = process.cwd();
  for (let i = 0; i < 4; i++) {
    const candidate = path.join(current, 'data');
    try {
      if (fs.existsSync(candidate)) {
        cachedDataDir = candidate;
        return cachedDataDir;
      }
    } catch {}
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  // 4. Create in cwd
  try {
    const cwdData = path.join(process.cwd(), 'data');
    if (!fs.existsSync(cwdData)) {
      fs.mkdirSync(cwdData, { recursive: true });
    }
    cachedDataDir = cwdData;
    return cachedDataDir;
  } catch {}

  // 5. Fallback to OS temp directory
  const tmpDir = path.join(os.tmpdir(), 'panggil-data');
  try {
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
  } catch {}
  cachedDataDir = tmpDir;
  return cachedDataDir;
}

export function readServerJson<T>(filename: string, fallback: T): T {
  try {
    const dir = getServerDataDir();
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed !== undefined && parsed !== null) {
        return parsed as T;
      }
    }
  } catch (e) {
    console.error(`[ServerStore] Error reading ${filename}:`, e);
  }
  return fallback;
}

export function writeServerJson<T>(filename: string, data: T): boolean {
  try {
    const dir = getServerDataDir();
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error(`[ServerStore] Error writing ${filename}:`, e);
    return false;
  }
}
