# kaddy120.github.io

## using Pandoc

### installing Pandoc

Find pandoc installation manual for different operating system 
on [their website](https://pandoc.org/installing.html#windows).

```bash
 $ pandoc md/keyboard\ remapping.md --template blog-template.html --no-highlight --from gfm -o blogs/output.html
```

I remove `-s` flag, short for `--standalone`, which means that pandoc will create a complete document with html header, meta-data, link. 

### compile bookmarks

```bash
 $ pandoc md/Good\ short\ reads.md --template bookmarks-template.html --no-highlight --from gfm --metadata title="Bookmarks" -o bookmarks.html
```

### The structure for blog 

The blog should be placed in `md/` directory, and they name should follow the following conversion:
