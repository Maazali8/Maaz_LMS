const express = require('express');
const mongoose = require('mongoose');
const dns = require('dns');
const { execSync } = require('child_process');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LMS API is running ✅' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

const buildNonSrvMongoUriFromSrv = async (mongoUri) => {
  if (!mongoUri || typeof mongoUri !== 'string') return mongoUri;
  if (!mongoUri.startsWith('mongodb+srv://')) return mongoUri;

  let url;
  try {
    url = new URL(mongoUri);
  } catch {
    return mongoUri;
  }

  const hostname = url.hostname;
  if (!hostname) return mongoUri;

  const srvHost = `_mongodb._tcp.${hostname}`;
  const records = await dns.promises.resolveSrv(srvHost);
  const seeds = records
    .map((r) => `${r.name}:${r.port}`)
    .join(',');

  const username = url.username ? encodeURIComponent(url.username) : '';
  const password = url.password ? encodeURIComponent(url.password) : '';
  const authPart = username ? `${username}${password ? `:${password}` : ''}@` : '';

  // Keep the DB name if present (Atlas URIs often use '/<db>').
  const pathPart = url.pathname && url.pathname !== '/' ? url.pathname : '/';

  const params = new URLSearchParams(url.search);
  // Ensure TLS + recommended write options for Atlas.
  if (!params.has('tls') && !params.has('ssl')) params.set('tls', 'true');
  if (!params.has('retryWrites')) params.set('retryWrites', 'true');
  if (!params.has('w')) params.set('w', 'majority');
  if (!params.has('authSource')) params.set('authSource', 'admin');

  const query = params.toString();
  return `mongodb://${authPart}${seeds}${pathPart}${query ? `?${query}` : ''}`;
};

const maybeFixMongoSrvDns = () => {
  const currentServers = dns.getServers();
  const isLocalOnly =
    currentServers.length > 0 &&
    currentServers.every((s) => s === '127.0.0.1' || s === '::1');

  if (!isLocalOnly) return;

  const envServers = (process.env.DNS_SERVERS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (envServers.length) {
    dns.setServers(envServers);
    console.log('ℹ️  Using DNS servers from DNS_SERVERS for MongoDB SRV lookups');
    return;
  }

  if (process.platform === 'win32') {
    try {
      const output = execSync(
        'powershell -NoProfile -Command "Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.ServerAddresses -and $_.ServerAddresses.Count -gt 0 } | Select-Object -ExpandProperty ServerAddresses"',
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
      );
      const windowsDnsServers = output
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((s) => s !== '127.0.0.1');

      if (windowsDnsServers.length) {
        dns.setServers(windowsDnsServers);
        console.log(
          `ℹ️  Overriding Node DNS resolvers (${currentServers.join(', ')}) -> ${windowsDnsServers.join(', ')} for MongoDB SRV lookups`
        );
        return;
      }
    } catch {
      // fall through
    }
  }

  // Safe fallback for environments where Node's resolver is a local DNS proxy that blocks SRV.
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log(
    `ℹ️  Overriding Node DNS resolvers (${currentServers.join(', ')}) -> 8.8.8.8, 8.8.4.4 for MongoDB SRV lookups`
  );
};

(async () => {
  try {
    maybeFixMongoSrvDns();

    const connectUri = await buildNonSrvMongoUriFromSrv(process.env.MONGO_URI);
    if (process.env.MONGO_URI && process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      console.log('ℹ️  Using non-SRV MongoDB seedlist (avoids TXT DNS lookup timeouts)');
    }

    await mongoose.connect(connectUri);
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
})();
