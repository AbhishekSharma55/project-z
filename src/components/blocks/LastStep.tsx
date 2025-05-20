"use client"
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export const LastStep = ({userPrompt}: {userPrompt: string}) => {
    const [timer, setTimer] = useState(10);
    const router = useRouter();
    //after the timer , navigate user to /builder
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);
    useEffect(() => {
        if (timer === 0) {
            router.push(`/builder?prompt=${userPrompt}`);
        }
    }, [timer]);
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center"
        >
            <h1 className="text-3xl font-bold mb-4">We are loading your project...</h1>
            <p className="text-violet-400 max-w-3xl mx-auto mb-4">Your project will be ready in a few seconds , please wait...</p>
            <p className="text-violet-400 max-w-3xl mx-auto mb-4">Timer: {timer}</p>
            <Link href="https://drive.google.com/file/d/1fu5DkK5VhNHt40OnZDa4wj6mcupswkgu/view?usp=sharing" className="pt-4 underline" target="_blank">See project Notes for more details</Link>
        </motion.div>
    )
}