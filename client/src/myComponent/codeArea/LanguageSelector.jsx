import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

export const LanguageSelector = ({language,onSelect}) => {
  return (
    <div>
       <Select defaultValue={language} onValueChange={onSelect}>
        <SelectTrigger className="w-[175px] overflow-hidden">
          <SelectValue placeholder="Language"/>
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="javascript">Javascript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="c">C</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
        </SelectContent>
        </Select> 
    </div>
  )
}
