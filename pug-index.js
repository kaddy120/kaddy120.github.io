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
    const blog_post_template = fs.readFileSync('./templates/blog-template.html', 'utf8');

    const direcotryPathHTML = './blogs';

    const myBlogsHTML = searchFiles(direcotryPathHTML, '.html');
    const myBlogsMd = blogs.map((blog) => blog.file);

    for (const file of myBlogsMd) {
      const fileName = path.parse(file).name;
      const temp = `${fileName}.html`;
      if (!myBlogsHTML.includes(temp)) {
        // Okay i have repeated myself here, I will have to refacor this code. 
        const markdownContent = fs.readFileSync(`./md/${file}`, 'utf8');
        const blogContent = marked(markdownContent);
        const toc = createTOC(markdownContent);
        let blogWithoutToc = blog_post_template.replace('$body$', blogContent);
        let blogFinal = blogWithoutToc.replace('$TOC$', toc);
        fs.writeFileSync(`./blogs/${fileName}.html`, blogFinal);
      } else {
        const mdTimeStamp = lastModification(`./md/${file}`);
        const htmlTimeStamp = lastModification(`./blogs/${fileName}.html`);
        const date1 = new Date(mdTimeStamp);
        const date2 = new Date(htmlTimeStamp);
        if (date1 > date2) {
          // You have repeated yourself, refactor this part later
          const markdownContent = fs.readFileSync(`./md/${file}`, 'utf8');
          const blogContent = marked(markdownContent);
          const toc = createTOC(markdownContent);
          let blogWithoutToc = blog_post_template.replace(
            '$body$',
            blogContent
          );
          let blogFinal = blogWithoutToc.replace('$TOC$', toc);
          fs.writeFileSync(`./blogs/${fileName}.html`, blogFinal);

          console.log(`I have recompiled ${file} because it's modified`);
        }
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
