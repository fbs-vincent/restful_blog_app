const express = require('express'),
  methodOverride = require('method-override'),
  expressSanitizer = require('express-sanitizer'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

mongoose.connect(
  'mongodb+srv://dbVincent:Polipop11@cluster0-lryih.mongodb.net/restful_blog_app?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});

const Blog = mongoose.model('Blog', blogSchema);

// Blog.create({
//   title: 'Test Blog',
//   image:
//     'https://pixabay.com/get/5fe3dc46425ab10ff3d8992ccf2934771438dbf852547849732b79d69348_340.jpg',
//   body: 'Test Blog Body',
// });

//RESTful Routes
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

app.get('/blogs/new', (req, res) => {
  res.render('new');
});

app.post('/blogs', (req, res) => {
  //create blog
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log(req.body);
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('/blogs/new');
    } else {
      res.redirect('/blogs');
    }
  });
  // redirect
});

app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
  //   res.send('You are in the show page');
});

app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, editBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: editBlog });
    }
  });
});

// update route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});

// delete route
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.listen(PORT, () => console.log(`Blog app is running on port ${PORT}`));
