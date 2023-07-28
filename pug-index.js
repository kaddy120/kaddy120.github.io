const pug = require('pug');
const YAML = require('yaml');
const fs = require('fs');

const compiledFunction = pug.compileFile('templates/post.pug');

var blog_list_template;

try {
  const blog_list_template = fs.readFileSync(
    './blogs-list-template.html',
    'utf8'
  );
  /* console.log(blog_list_template); */

  fs.readFile('./blog-metadata.yml', 'utf8', (err, data) => {
    if (err) {
      console.error('yml file does not exist');
      return;
    }
    const blogs = YAML.parse(data);

    const blog_list = compiledFunction(blogs.Articles);
    console.log(blog_list_template.replace('$BLOG-POST$', blog_list));
    // write this to a file.
    /* console.log(blog_post_list); */
  });
} catch (err) {
  console.error(err);
}
