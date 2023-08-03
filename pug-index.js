const YAML = require('yaml');
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const createTOC = require('./test-markdown-toc');

const { marked } = require('marked');
const { gfmHeadingId } = require('marked-gfm-heading-id');

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

try {
  const blog_list_template = fs.readFileSync(
    './templates/blogs-list-template.html',
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
    mdToBookmarks();
    createPost(blogs.Articles);
  });
} catch (err) {
  console.error(err);
}

function createPost(blogs) {
  try {
    const blog_list_template = fs.readFileSync(
      './templates/blogs-list-template.html',
      'utf8'
    );

    /* remove markdwon file extension  */
    blogs = blogs.map((blog) => {
      return { ...blog, file: path.parse(blog.file).name };
    });

    const blog_list = compiledFunction(blogs);
    const blog_posts = blog_list_template.replace('$BLOG-POST$', blog_list);
    fs.writeFileSync('./blog.html', blog_posts);
  } catch (err) {
    console.error(err);
  }
}

function markdwownToHtml(blogs) {
  try {
    const blog_post_template = fs.readFileSync(
      './templates/blog-template.html',
      'utf8'
    );

    const blogPath = './blogs/';
    const myBlogsHTML = searchFiles(blogPath, '.html');
    const myBlogsMd = blogs.map((blog) => blog.file);

    for (const file of myBlogsMd) {
      const fileName = path.parse(file).name;
      const temp = `${fileName}.html`;
      if (!myBlogsHTML.includes(temp)) {
        markdownToPost(file, blog_post_template, blogPath);
      } else {
        const mdDate = lastModification(`./md/${file}`);
        const htmlDate = lastModification(`./blogs/${fileName}.html`);
        if (mdDate > htmlDate) {
          markdownToPost(file, blog_post_template, blogPath);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function mdToBookmarks() {
  try {
    const bookmarksTemplate = fs.readFileSync(
      './templates/bookmarks-template.html',
      'utf8'
    );
    const file = 'bookmarks.md';
    const bookmarksPath = './blogs/';

    const mdDate = lastModification(`./md/${file}`);
    const htmlDate = lastModification(`${bookmarksPath}bookmarks.html`);
    if (mdDate > htmlDate) {
      markdownToPost(file, bookmarksTemplate, bookmarksPath);
    }
  } catch (err) {
    console.error(err);
  }
}

/* convert markdwon file to html stored in blogs/ dir*/
function markdownToPost(file, template, dest) {
  const fileName = path.parse(file).name;
  const markdownContent = fs.readFileSync(`./md/${file}`, 'utf8');
  const blogContent = marked(markdownContent);
  const toc = createTOC(markdownContent);
  let blogWithoutToc = template.replace('$body$', blogContent);
  let blogFinal = blogWithoutToc.replace('$TOC$', toc);
  fs.writeFileSync(`${dest}${fileName}.html`, blogFinal);
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
    return new Date(stats.mtime);
  } catch (err) {
    console.error(err);
  }
}
