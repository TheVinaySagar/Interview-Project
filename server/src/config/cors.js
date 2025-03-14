import cors from 'cors';

const corsOptions = {
  origin: 'http://localhost:3000', // Allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials
};

export default cors(corsOptions);
