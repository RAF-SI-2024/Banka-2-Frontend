import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Logo from "@/assets/Logo.tsx";

const PERSPECTIVE = 400
const CARD_ANIMATION_DURATION = 0.5
const INITIAL_DELAY = 0.2

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 30,
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

interface CreditCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  cardNumber: string
  cardHolder: string
  expiryDate: string
}



const CreditCard = React.forwardRef<HTMLDivElement, CreditCardProps>(
  ({ className, title, cardNumber, cardHolder, expiryDate, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const getMaskedNumber = (number: string) => {
      const lastFour = number.slice(-4);
      const firstFour = number.slice(0, 4);
      return `${firstFour} **** **** ${lastFour}`;
    }

    const gradientVariants = React.useMemo(() => [
      'bg-gradient-to-tr from-primary via-secondary to-background',
      'bg-gradient-to-tr from-primary via-background to-secondary',
      'bg-gradient-to-tr from-primary via-destructive to-background',
      'bg-gradient-to-tr from-primary via-destructive to-secondary',
      'bg-gradient-to-tr from-primary via-secondary to-destructive',
      'bg-gradient-to-tr from-primary via-background to-destructive',

      'bg-gradient-to-tr from-secondary via-primary to-background',
      'bg-gradient-to-tr from-secondary via-background to-primary',
      'bg-gradient-to-tr from-secondary via-destructive to-background',
      'bg-gradient-to-tr from-secondary via-destructive to-primary',
      'bg-gradient-to-tr from-secondary via-primary to-destructive',
      'bg-gradient-to-tr from-secondary via-background to-destructive',

      'bg-gradient-to-tr from-background via-primary to-secondary',
      'bg-gradient-to-tr from-background via-secondary to-primary',
      'bg-gradient-to-tr from-background via-destructive to-secondary',
      'bg-gradient-to-tr from-background via-destructive to-primary',
      'bg-gradient-to-tr from-background via-primary to-destructive',
      'bg-gradient-to-tr from-background via-secondary to-destructive',

      'bg-gradient-to-tr from-destructive via-primary to-secondary',
      'bg-gradient-to-tr from-destructive via-secondary to-primary',
      'bg-gradient-to-tr from-destructive via-background to-secondary',
      'bg-gradient-to-tr from-destructive via-background to-primary',
      'bg-gradient-to-tr from-destructive via-primary to-background',
      'bg-gradient-to-tr from-destructive via-secondary to-background',

    ], [])

    const randomGradient = React.useMemo(() =>
            gradientVariants[Math.floor(Math.random() * gradientVariants.length)]
        , [])



    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
        transition={{ duration: CARD_ANIMATION_DURATION }}
        style={{ perspective: PERSPECTIVE }}
        className={cn("text-paragraph relative touch-none", className)}
        {...props}
      >

        <motion.div
          className={cn(
            "relative h-48 w-80 overflow-hidden rounded-xl p-6 shadow-xl",
              randomGradient
          )}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: CARD_ANIMATION_DURATION }}
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="text-2xl font-bold cursor"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: INITIAL_DELAY, duration: CARD_ANIMATION_DURATION }}
            >
              {title? title :<Logo className="w-30"/>}
            </motion.div>

            <motion.button
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full cursor-pointer",
                "bg-card"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, ...springTransition }}
              onClick={(e) => {
                e.stopPropagation();
                setIsVisible(!isVisible)
              }}
              aria-label={isVisible ? "Hide card details" : "Show card details"}
            >
              {isVisible ? <span className="icon-[ph--eye] h-4 w-4" /> : <span className="icon-[ph--eye-closed] h-4 w-4" />}
            </motion.button>
          </div>

          <motion.div
            className="mt-2 text-xl font-medium tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {isVisible ? cardNumber : getMaskedNumber(cardNumber)}
          </motion.div>

          <div className="mt-6 flex justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: CARD_ANIMATION_DURATION }}
            >
              <div className="text-xs opacity-80">Card Holder</div>
              <div className="font-semibold">{cardHolder}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: CARD_ANIMATION_DURATION }}
            >
              <div className="text-xs opacity-80">Expires</div>
              <div className="font-semibold">{isVisible ? expiryDate : "**/**"}</div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }
)
CreditCard.displayName = "CreditCard"

export { CreditCard }