import * as React from "react"
import { cn } from "../../lib/utils"

// Simple scroll area implementation without Radix UI
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-auto", className)}
    {...props}
  >
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = ({ orientation = "horizontal", ...props }) => (
  <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" {...props} />
)

export { ScrollArea, ScrollBar }