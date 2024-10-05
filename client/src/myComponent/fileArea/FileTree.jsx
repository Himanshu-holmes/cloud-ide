
import React from 'react'




 const FileTreeNodes = ({fileNames,nodes, onSelect,path}) => {
  console.log(fileNames,nodes)
  const isDir = !!nodes
  

  return (
    <div onClick={(e)=>{
      if(isDir) return
      e.stopPropagation();
      onSelect(path)
      
      if(isDir) return
    }} className='ml-3'>{fileNames}{
        nodes && <ul>
            {Object.keys(nodes).map(item =>(
              <li key={item}>
                <FileTreeNodes path={path+ "/"+item} onSelect={onSelect} fileNames={item} nodes={nodes[item]}/>
              </li>
            ))}
        </ul>
    }</div>
                )
}


 const  FileTree = ({tree, setSelectedFile}) => {
  console.log("from tree ",tree)
  return (
    <div>
      <FileTreeNodes fileNames={"/"} nodes={tree} path="" onSelect={(path)=>{console.log("select",path )
        setSelectedFile(path)
        console.log("path setted")
      }} />
    </div>
  )
}

export default FileTree


