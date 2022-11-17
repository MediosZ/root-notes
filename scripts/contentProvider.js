const fs = require('fs');
const path = require('path');
const util = require('./utils');

function getPath(){
  const file_paths = fs.readdirSync(
    path.resolve(__dirname, '..', 'src', 'contents')
  );
  return file_paths;
}

function parseLinks(link){
  let unwrappedLink = link.slice(2, link.length - 2);
  //console.log(unwrappedLink);
  const [filename, text] = unwrappedLink.split(':');
  let hashedFilename = util.getHash(filename)
  return [hashedFilename, text];
}

function getLinks(content){
  const regexp = /\[\[([a-z_]+)\:([A-Za-z_\u4e00-\u9fa5\s]+)\]\]/g;
  const matchRes = content.match(regexp);
  if(matchRes){
    return matchRes.map(res => {
      const [filename, text] = parseLinks(res);
      return [filename, text, res];
    })
  }
  else{
    return null
  }
}

function writeFile(content, name){
  const filePath = path.resolve(__dirname, '..', 'public', 'contents', name);
  fs.writeFileSync(filePath, content);
}

function replaceContent(content, links){
  for(let link of links){
    let [filename, text] = link.slice(2, link.length-2).split(':');
    content = content.replace(`${link}`, `<Link src="${text}" dest="${filename}"/>`)
  }
  return content
}

function getContent(){
  let contentJson = {}
  const dirPath = path.resolve(__dirname, '..', 'public', 'contents');
  fs.rmdirSync(dirPath, {recursive:true});
  fs.mkdirSync(dirPath);

  for(let file of getPath()){
    const hash = util.getHash(file.split('.')[0])
    contentJson[hash] = {
      containedLinks: [],
      backLinks: []
    }

    let fileContent = fs.readFileSync(
      path.resolve(__dirname, '..', 'src', 'contents', file)
    ).toString();


    let links = getLinks(fileContent);
    let rawlinks = []
    if(links){
      for(let link of links){
        let [filename, text, raw] = link;
        rawlinks.push(raw);
        if(contentJson[filename]){
          contentJson[hash].containedLinks.push([filename, text]);
          contentJson[filename].backLinks.push(hash);
        }
      }
    }

    fileContent = replaceContent(fileContent, rawlinks);

    writeFile(fileContent, hash+".md");
  }
  writeFile(JSON.stringify(contentJson), 'content.json');
  return contentJson;
}

module.exports = {
  getContent
}
