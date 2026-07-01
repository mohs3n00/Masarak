import * as React from "react"
import { SearchInput } from "../atoms/Input"
import { Button } from "../atoms/Button"
import { cn } from "@/lib/utils"

export function SearchBar({ className, onSearch, placeholder = "Search..." }: { className?: string, onSearch?: (val: string) => void, placeholder?: string }) {
  const [val, setVal] = React.useState("")
  return (
    <form className={cn("flex w-full max-w-sm items-center gap-2", className)} onSubmit={(e) => { e.preventDefault(); onSearch?.(val); }}>
      <SearchInput placeholder={placeholder} value={val} onChange={e => setVal(e.target.value)} className="flex-1" />
      <Button type="submit" variant="secondary">Search</Button>
    </form>
  )
}