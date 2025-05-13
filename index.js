const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

let clickQueue = [];

app.use(cors());
app.use(bodyParser.json());

app.post('/click', (req, res) => {
  const { instancePath } = req.body;
  if (!instancePath || typeof instancePath !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing "instancePath"' });
  }

  clickQueue.push({ instancePath, timestamp: Date.now() });
  return res.status(200).json({ success: true });
});

app.get('/clicks', (req, res) => {
  const events = clickQueue.slice(); 
  clickQueue = []; 
  res.json({ events });
});

//
// GET /trigger?instancePath=Workspace.Script1
//
app.get('/trigger', (req, res) => {
  const instancePath = req.query.instancePath;
  if (!instancePath) {
    return res.status(400).send('Missing instancePath');
  }

  clickQueue.push({ instancePath, timestamp: Date.now() });
  
  res.send(`
    <html><body>
      <p>✅ Click triggered for <code>${instancePath}</code></p>
    </body></html>
  `);
});


app.listen(PORT, () => {
  console.log(`Clicker server listening on port ${PORT}`);
});
