import { motion } from "framer-motion";
import { Hourglass } from "lucide-react"


const LoadingSpinner = () => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: [0.3, 0.2, 0.8, 0.9] }}
            className="inline-block"
        >
            <Hourglass size={10} />
        </motion.div>
    )
}

export default LoadingSpinner;