const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(cors())

app.use('/users',require('./src/routes/user'))
app.use('/projects',require('./src/routes/project'))
app.use('/agreements',require('./src/routes/agreement'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});