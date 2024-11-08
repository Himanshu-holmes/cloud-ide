import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const FileTreeNodes = ({ fileNames, nodes, onSelect, path }) => {
  console.log(fileNames, nodes);
  const isDir = !!nodes;

  // Collect all node names for default open
  const allNodeNames = isDir ? Object.keys(nodes.toString()) : [];

  return (
    <>
      {isDir ? (
        <Accordion type="multiple" collapsible defaultValue={allNodeNames}>
          <AccordionItem value={fileNames.toString()}>
            <AccordionTrigger>
              📁 {fileNames} {/* Folder icon */}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-3">
                {Object.keys(nodes).map((item) => (
                  <li key={item}>
                    <FileTreeNodes
                      path={`${path}/${item}`}
                      onSelect={onSelect}
                      fileNames={item}
                      nodes={nodes[item]}
                    />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(path);
          }}
          className=" cursor-pointer flex justify-start items-start "
        >📄 {fileNames} {/* File icon */}
        </div>
      )}
    </>
  );
};

const FileTree = ({ tree, setSelectedFile }) => {
  console.log("from tree ", tree);
  const getAllFolders = (nodes) => {
    return Object.keys(nodes).flatMap((key) => {
      const childNodes = nodes[key];
      return childNodes ? [key.toString(), ...getAllFolders(childNodes).toString()] : [key.toString()];
    });
  };

  const allOpenFolders = getAllFolders(tree);

  return (
    <div>
      <Accordion type="multiple" collapsible defaultValue={allOpenFolders} className={cn("bg-slate-700")}>
        <FileTreeNodes
          fileNames="/"
          nodes={tree}
          path=""
          onSelect={(path) => {
            console.log("select", path);
            setSelectedFile(path);
            console.log("path set");
          }}
        />
      </Accordion>
    </div>
  );
};

export default FileTree;
