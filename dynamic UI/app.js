//Core Module
const path = require('path');
//External Module
const express = require('express');

//Local Module
const userRouter = require('./routes/userRouter');
const {hostRouter} = require('./routes/hostrouter');
const rootDir = require('./utils/pathUtil');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());
app.use(userRouter);
app.use(hostRouter);
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next) => {
  res.status(404).render('404', {pageTitle: 'Page not Found'});
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});