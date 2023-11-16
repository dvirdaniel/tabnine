import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as redis from 'redis';

const app = express();
const port = 3000;

const redisClient = redis.createClient();

// Default timeout - 10 seconds
const DEFAULT_TIMEOUT = 10000;

// In-memory storage for queues
const queues: { [key: string]: string[] } = {};

// Middleware to parse JSON
app.use(bodyParser.json());

// POST endpoint to add a message to the queue
app.post('/api/:queue_name', (req: Request, res: Response) => {
    const { queue_name } = req.params;
    const { message } = req.body;

    if (!queues[queue_name]) {
        queues[queue_name] = [];
    }

    queues[queue_name].push(message);

    res.status(201).send('Message added to the queue');

/*
    // Push the message to Redis list
    redisClient?.rPush(queue_name, message, (err, reply) => {
        if (err) {
            return res.status(500).send('Error adding message to the queue');
        }

        res.status(201).send('Message added to the queue');
    });
    */
});

// GET endpoint to get the next message from the queue
app.get('/api/:queue_name', (req: Request, res: Response) => {
    const { queue_name } = req.params;
    const timeout = Number(req.query.timeout) || DEFAULT_TIMEOUT;

    // If No message in the queue then set timeout
    if (!queues[queue_name] || queues[queue_name].length === 0) {
        setTimeout(() => {
            res.status(204).send('No message in the queue after timeout');
        }, timeout);
    } else {
        // Return the next message
        res.json({ message: queues[queue_name].shift() });
    }

    /*
    // Pop the message from Redis list
    redisClient?.blPop(queue_name, timeout / 1000, (err, reply) => {
        if (err || !reply || !reply[1]) {
            
            // No message in the queue
            return res.status(204).send('No message in the queue after timeout');
        }

        const message = reply[1];
        res.json({ message });
    });
    */
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});