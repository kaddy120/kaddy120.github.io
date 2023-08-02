const toc = require('markdown-toc');
const pug = require('pug');

function createTOC(markdown)
{
  const mocs = toc(markdown).json;
  // First transform the data...
  let index_lvl2 = 0;
  let prev_lv3 = 0;
  const myLevel3 = new Array();

  for (let i = 0; i < mocs.length; i++) {
    let lvl = mocs[i].lvl;
    if (lvl === 2) {
      prev_lv3 = index_lvl2;
      index_lvl2 = i;
      mocs[prev_lv3].entry = [...myLevel3];
      myLevel3.length = 0;
    } else if (lvl == 3) {
      myLevel3.push(mocs[i]);
    }
  }
  mocs[index_lvl2].entry = myLevel3;

  const transformedToc = mocs.filter((moc) => moc.lvl === 2);

  const compiledFunction = pug.compileFile('./templates/toc.pug');
  return compiledFunction(transformedToc);
}

module.exports = createTOC
