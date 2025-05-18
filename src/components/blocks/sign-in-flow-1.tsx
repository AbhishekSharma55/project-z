"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedAIChat } from "@/components/ui/animated-ai-chat"
import { InitialResponse } from "./InitialResponse";
import { MiniNavbar } from "./MiniNavBar";
import { CanvasRevealEffect } from "./CanvaRevelEffect";

interface SignInPageProps {
  className?: string;
}

export const MainComponent = ({ className }: SignInPageProps) => {
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");
  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleSendMessage = async () => {
    console.log("Sending message...");
    console.log(initialPrompt);

    setIsTyping(true);

    const fetchPromptTitle = async () => {
      const response = await fetch("/api/get-prompt-title?userPrompt=" + initialPrompt);
      const data = await response.json();
      console.log("Prompt title:", data.promptTitle);
      setPromptTitle(data.promptTitle);
    }

    fetchPromptTitle();
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }

  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-black relative", className)}>
      <div className="absolute inset-0 z-0">
        {/* Initial canvas (forward animation) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}

        {/* Reverse canvas (appears when code is complete) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-black"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Content Layer */}
      <div className=" z-10 flex flex-col flex-1">
        {/* Top navigation */}
        <MiniNavbar />

        {/* Main content container */}
        {!promptTitle && (
          <AnimatedAIChat onSubmit={() => handleSendMessage()} initialPrompt={initialPrompt} setInitialPrompt={setInitialPrompt} isTyping={isTyping} setIsTyping={setIsTyping} />
        )}
        {promptTitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <InitialResponse initialResponse={promptTitle} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

