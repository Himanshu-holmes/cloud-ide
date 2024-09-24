import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { LanguageSelector } from './LanguageSelector'
import { CODE_SNIPPETS } from '@/constants'

const CodeEditor = () => {

const editorRef = useRef(null)

const [code, setCode] = useState('// some comment')
const [language, setLanguage] = useState('javascript')


const onMount = (editor) =>{
    editorRef.current = editor
    editorRef.current.focus()
}

const onSelect = (lang)=>{
  setLanguage(lang)
setCode(CODE_SNIPPETS[lang])
}
console.log(language)
  return (
    <div>
      <LanguageSelector language={language} onSelect={onSelect} />
        <Editor height={"88vh"}
        theme='vs-dark'
        defaultLanguage='javascript'
        defaultValue='// some comment'
        value={CODE_SNIPPETS[language]}
        language={language}
        onChange={(value,event)=>setCode(value)}
        onMount={onMount}
        />
    </div>
  )
}

export default CodeEditor