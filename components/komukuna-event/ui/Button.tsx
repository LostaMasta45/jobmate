import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-komukuna-pink text-white hover:bg-komukuna-pink/90 hover:shadow-[0_0_20px_rgba(232,92,144,0.3)]",
                secondary: "bg-komukuna-purple text-white hover:bg-komukuna-purple/90 hover:shadow-[0_0_20px_rgba(93,46,142,0.3)]",
                outline: "border border-komukuna-pink text-komukuna-pink hover:bg-komukuna-pink hover:text-white",
                ghost: "text-white hover:bg-white/10",
                link: "text-primary underline-offset-4 hover:underline",
                gradient: "bg-gradient-to-r from-komukuna-pink to-komukuna-purple text-white hover:opacity-90 hover:shadow-[0_0_30px_rgba(232,92,144,0.4)] border-none",
            },
            size: {
                default: "h-11 px-8 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-14 rounded-full px-10 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
