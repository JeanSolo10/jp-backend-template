import express, { Router } from 'express';

export default function userRoutes(): Router {
  const router = express.Router();

  router.get('/welcome', (req, res) => {
    res.status(200).json({ msg: `Hello ${process.env.HELLO}!!` });
  });

  return router;
}
