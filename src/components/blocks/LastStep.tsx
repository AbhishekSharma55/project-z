import { motion } from "framer-motion";
import Link from "next/link";

export const LastStep = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center"
        >
            <h1 className="text-3xl font-bold mb-4">Hey Stop , this part is still under construction!</h1>
            <p className="text-violet-400 max-w-3xl mx-auto mb-4">After This , you will be redirected to an editor page like bolt.new and your project will be start creating with the prompt you provided.</p>
            <Link href="https://drive.google.com/file/d/1fu5DkK5VhNHt40OnZDa4wj6mcupswkgu/view?usp=sharing" className="pt-4 underline" target="_blank">See project Notes for more details</Link>
        </motion.div>
    )
}