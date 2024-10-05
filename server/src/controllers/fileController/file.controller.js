const fs = require("fs").promises;
const path = require("path")
async function generateFileTree(directory){
  const tree = {};      
  
  async function buildTree(currentDir,currentTree){
        const files = await fs.readdir(currentDir);
        for(const file of files){
            let filePath = path.join(currentDir,file);
            let stat = fs.stat(filePath);
            if((await stat).isDirectory()){
                currentTree[file] = {}
                await buildTree(filePath,currentTree[file])
            }else{
                currentTree[file] = null;       
            }
        }
  }
  await buildTree(directory,tree)
  return tree;
}

module.exports = {  
    generateFileTree,
}