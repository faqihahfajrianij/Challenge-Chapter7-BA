require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const Sentry = require('@sentry/node');
const authRoutes = require('./routes/auth.routes');
const passwordRoutes = require('./routes/password.routes');
const { PORT = 3000, SENTRY_DSN, ENV} = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Sentry.init({
    dsn:SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
      ],
        // Performance Monitoring
  tracesSampleRate: 1.0,
  environment: ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Define Routes
app.use('/auth', authRoutes);
app.use('/password', passwordRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
  
app.listen(PORT, () => console.log('listening on port', PORT));
