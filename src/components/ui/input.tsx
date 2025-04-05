
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <motion.div
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.99 }}
        className="relative"
      >
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded"
            layoutId="input-highlight"
          />
        )}
      </motion.div>
    )
  }
)
Input.displayName = "Input"

export { Input }
