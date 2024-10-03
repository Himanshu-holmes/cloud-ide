
import React from 'react'




 const FileTreeNodes = ({fileNames,nodes}) => {
  console.log(fileNames,nodes)
  return (
    <div className='ml-3'>{fileNames}{
        nodes && <ul>
            {Object.keys(nodes).map(item =>(
              <li key={item}>
                <FileTreeNodes fileNames={item} nodes={nodes[item]}/>
              </li>
            ))}
        </ul>
    }</div>
                )
}


 const  FileTree = ({tree}) => {
  console.log("from tree ",tree)
  return (
    <div>
      <FileTreeNodes fileNames={"/"} nodes={tree}/>
    </div>
  )
}

export default FileTree


