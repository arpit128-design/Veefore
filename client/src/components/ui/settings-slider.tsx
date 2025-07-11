import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const SettingsSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className="relative h-2 w-full grow overflow-hidden rounded-full"
      style={{
        background: '#e5e7eb',
        backgroundColor: '#e5e7eb'
      }}
    >
      <SliderPrimitive.Range 
        className="absolute h-full"
        style={{
          background: '#111827',
          backgroundColor: '#111827'
        }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className="block h-5 w-5 rounded-full border-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      style={{
        background: '#111827',
        backgroundColor: '#111827',
        borderColor: '#111827'
      }}
    />
  </SliderPrimitive.Root>
))
SettingsSlider.displayName = SliderPrimitive.Root.displayName

export { SettingsSlider }