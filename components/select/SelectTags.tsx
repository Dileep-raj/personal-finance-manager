"use client"

import * as React from "react"
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/components/ui/input-group"
import { Badge } from "@/components/ui/badge";
import { Collapsible } from "@/components/ui/collapsible";
import { XIcon } from "lucide-react"

interface SelectTagsProps {
  recommendedTags?: string[]
  name?: string
  id?: string
  disabled?: boolean
  defaultValue?: string[]
  onChange?: (updatedTags: string[]) => void
}

const SelectTags = (props: SelectTagsProps) => {
  const [tags, setTags] = React.useState(props.defaultValue ?? new Array<string>())

  React.useEffect(() => {
    props.onChange?.(tags)
  }, [tags, props])

  const getTagComponent = (tag: string) => (
    <Badge key={tag} variant="secondary" className="gap-1 h-5">
      {tag}
      {!props.disabled && (
        <button
          type="button"
          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onKeyDown={e => { if (e.key === "Enter") handleUnselect(tag) }}
          onMouseDown={e => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onClick={() => handleUnselect(tag)}
        >
          <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </Badge>
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Remove last tags on backspace
    if (!e.currentTarget.value && e.key == "Backspace") {
      e.preventDefault()
      tags.pop()
      setTags([...tags])
      return
    }

    // Add new tag on enter or comma
    if (e.key === "Enter" || e.key == ",") {
      e.preventDefault()
      // Trim and remove any commas before adding the tag
      const tag = e.currentTarget.value?.trim().toLocaleLowerCase().replace(",", "")
      e.currentTarget.value = ""
      if (!tag || tags.includes(tag)) return
      setTags(prevTags => [...prevTags, tag])
    }
  }

  const handleUnselect = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  return <InputGroup>
    <InputGroupTextarea
      id={props.id}
      placeholder="Add tags"
      onKeyDown={handleKeyDown}
    />
    <InputGroupAddon align="block-end">
      <Collapsible>
        {/* Hidden inputs so this still works inside a native <form> like a real form control */}
        {props.name && tags.length === 0 && <input type="hidden" name={props.name} value="" />}
        {props.name && [...tags].map(tag => <input key={tag} type="hidden" name={props.name} value={tag} />)}
        {/* TODO: limit visible tags and add collapsible tags list */}
        {[...tags].map(tag => getTagComponent(tag))}
      </Collapsible>
    </InputGroupAddon>
  </InputGroup>
}

export default SelectTags
