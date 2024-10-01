import React, { useEffect, useRef, useState } from 'react';
import { Editor, useMonaco } from '@monaco-editor/react';
import { LanguageSelector } from './LanguageSelector';
import { ACTIONS, CODE_SNIPPETS } from '@/constants';

const CodeEditor = ({ socketRef, roomId,onCodeChange }) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();

  const [code, setCode] = useState('// some comment');
  const [language, setLanguage] = useState('javascript');

  const onMount = (editor) => {
    editorRef.current = editor;
    editorRef.current.focus();

    // onCodeChange(editorRef.current.getValue());
    


    editor.onDidChangeModelContent((event) => {
      const updatedCode = editor.getValue();
      console.log('editor', updatedCode);
      onCodeChange(updatedCode)
 
      // Emit code change to all users in the room
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        codes: updatedCode,
        changes: event.changes,
      });
    });
  };

  const onSelect = (lang) => {
    setLanguage(lang);
    setCode(CODE_SNIPPETS[lang]);
  };

  useEffect(() => {
    console.log('socketRef inside code editor', socketRef);
    if (socketRef.current === null) return;

    // Listen for code change events from the server
    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ codes,changes }) => {
      
      console.log("from server",codes)
      if (codes !== null ) {
        console.log('changes',changes);
        console.log('code change from socket', codes);
        setCode(codes);
        // editorRef.current.setValue(codes);
      }
    });

    // Cleanup listener when component unmounts
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div>
      <LanguageSelector language={language} onSelect={onSelect} />
      <Editor
        height={'88vh'}
        theme="vs-dark"
        language={language}
        value={code}  // Use the code from the state
        onChange={(value) => {
          setCode(value);  // Update local state when editor content changes
        }}
        onMount={onMount}
      />
    </div>
  );
};

export default CodeEditor;
