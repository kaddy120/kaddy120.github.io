const YAML = require('yaml');
const pug = require('pug');
const path = require('path');
const fs = require('fs');

const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');
const { create } = require('domain');

marked.use(gfmHeadingId());

marked.setOptions({
  gfm: true,
  mangle: false,
  headerIds: true,
  /* tables: true, */
  breaks: true,
  /* pedantic: false, */
  /* smartLists: true, */
  /* langPrefix: 'language-', */
  /* highlight: function(code, lang) { */
  /*   if (lang === 'js') { */
  /*     return highlighter.javascript(code); */
  /*   } */
  /*   return code; */
  /* } */
});

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
    /* console.log(data); */
    const blogs = YAML.parse(data);
    markdwownToHtml(blogs.Articles);
    createPost(blogs.Articles);
  });
} catch (err) {
  console.error(err);
}

function createPost(blogs) {
  try {
    const blog_list_template = fs.readFileSync(
      './blogs-list-template.html',
      'utf8'
    );

    /* remove markdwon file extension  */
    blogs = blogs.map((blog) => {
      return { ...blog, file: path.parse(blog.file).name };
    });
    
    const blog_list = compiledFunction(blogs);
    const blog_posts = blog_list_template.replace('$BLOG-POST$', blog_list);
    fs.writeFileSync('./test.html', blog_posts);
  } catch (err) {
    console.error(err);
  }
}

function markdwownToHtml(blogs) {
  try {
    const blog_post_template = fs.readFileSync('./blog-template.html', 'utf8');

    const direcotryPathHTML = './blogs';

    const myBlogsHTML = searchFiles(direcotryPathHTML, '.html');
    const myBlogsMd = blogs.map((blog) => blog.file);

    for (const file of myBlogsMd) {
      const fileName = path.parse(file).name;
      const temp = `${fileName}.html`;
      if (!myBlogsHTML.includes(temp)) {
        const markdownContent = fs.readFileSync(`./md/${file}`, 'utf8');
        const blogContent = marked(markdownContent);
        const blogFinal = blog_post_template.replace('$body$', blogContent);
        /* console.log(html); */
        fs.writeFileSync(`./blogs/${fileName}.html`, blogFinal);
      } else {
        console.log(
          'check if the blog has been updated ever since the last compilation'
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function searchFiles(directotryPath, desiredExtension) {
  try {
    var files = fs.readdirSync(directotryPath);
    return files.filter((file) => path.extname(file) == desiredExtension);
  } catch (err) {
    console.log(err);
  }
}

function lastModification(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return stats.mtime;
  } catch (err) {
    console.error(err);
  }
}
