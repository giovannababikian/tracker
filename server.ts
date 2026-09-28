import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data folder exists
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface UserRecord {
  id: string;
  username: string;
  password: string;
  name: string;
  email?: string;
  createdAt: string;
  data: {
    activities: any[];
    workouts: Record<string, any>;
    completions: Record<string, boolean>;
    workoutLogs: Record<string, any>;
    activityNotes: Record<string, string>;
  };
}

interface DatabaseSchema {
  users: Record<string, UserRecord>;
  sessions: Record<string, string>; // token -> userId
}

function loadDb(): DatabaseSchema {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse db.json, creating initial', e);
    }
  }

  // Pre-seed default user for gbcosta
  const defaultDb: DatabaseSchema = {
    users: {
      user_gbcosta: {
        id: 'user_gbcosta',
        username: 'gbcosta',
        password: '123',
        name: 'GB Costa',
        email: 'gbcosta.ct@gmail.com',
        createdAt: new Date().toISOString(),
        data: {
          activities: [],
          workouts: {},
          completions: {},
          workoutLogs: {},
          activityNotes: {},
        },
      },
    },
    sessions: {},
  };
  saveDb(defaultDb);
  return defaultDb;
}

function saveDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json', err);
  }
}

let db = loadDb();

// Auth helper
function getUserIdFromAuth(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  return db.sessions[token] || null;
}

// API Routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, password, name, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios' });
  }

  const cleanUser = username.trim().toLowerCase();
  const existing = Object.values(db.users).find(
    (u) => u.username.toLowerCase() === cleanUser
  );

  if (existing) {
    return res.status(409).json({ error: 'Usuário já existe. Escolha outro nome.' });
  }

  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: UserRecord = {
    id: userId,
    username: cleanUser,
    password,
    name: (name || cleanUser).trim(),
    email: (email || '').trim(),
    createdAt: new Date().toISOString(),
    data: {
      activities: [],
      workouts: {},
      completions: {},
      workoutLogs: {},
      activityNotes: {},
    },
  };

  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  db.users[userId] = newUser;
  db.sessions[token] = userId;
  saveDb(db);

  return res.json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Credenciais incompletas' });
  }

  const cleanUser = username.trim().toLowerCase();
  const user = Object.values(db.users).find(
    (u) => u.username.toLowerCase() === cleanUser && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }

  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  db.sessions[token] = user.id;
  saveDb(db);

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getUserIdFromAuth(req);
  if (!userId || !db.users[userId]) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const user = db.users[userId];
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token && db.sessions[token]) {
      delete db.sessions[token];
      saveDb(db);
    }
  }
  return res.json({ success: true });
});

// User Data Sync
app.get('/api/user/data', (req: Request, res: Response) => {
  const userId = getUserIdFromAuth(req);
  if (!userId || !db.users[userId]) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  const user = db.users[userId];
  return res.json({ data: user.data || {} });
});

app.post('/api/user/data', (req: Request, res: Response) => {
  const userId = getUserIdFromAuth(req);
  if (!userId || !db.users[userId]) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { activities, workouts, completions, workoutLogs, activityNotes } = req.body;
  const user = db.users[userId];

  user.data = {
    activities: activities !== undefined ? activities : user.data.activities,
    workouts: workouts !== undefined ? workouts : user.data.workouts,
    completions: completions !== undefined ? completions : user.data.completions,
    workoutLogs: workoutLogs !== undefined ? workoutLogs : user.data.workoutLogs,
    activityNotes: activityNotes !== undefined ? activityNotes : user.data.activityNotes,
  };

  saveDb(db);
  return res.json({ success: true, updatedAt: new Date().toISOString() });
});

// Vite / Static Serving
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // In dev mode or fallback if dist is building
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
