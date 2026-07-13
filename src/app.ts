import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send('Auth service is working');
});

export default app;
