// middleware/cache.js
import NodeCache from 'node-cache';

const cache = new NodeCache({ 
 stdTTL: 300,
 checkperiod: 60
});

export const cacheMiddleware = (req, res, next) => {
 if (process.env.NODE_ENV !== 'production') {
  return next();
 }

 if (req.method !== 'POST') {
  return next();
 }

 const key = `${req.path}:${JSON.stringify(req.body)}`;
 const cached = cache.get(key);
 
 if (cached) {
  
  return res.json(cached);
 }

 const originalSend = res.json;
 res.json = function(data) {
  cache.set(key, data);
  originalSend.call(this, data);
 };
 
 next();
};