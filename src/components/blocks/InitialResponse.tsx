"use client"
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import { QuestionSection } from "./QuestionSection";
import { CustomInput } from "../ui/CustomInput";
import { LastStep } from "./LastStep";

export function InitialResponse({ initialResponse }: { initialResponse: string | null }) {
    const [buffer, setBuffer] = useState<string>("");
    const [isComplete, setIsComplete] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [showingDescription, setShowingDescription] = useState(true);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [showLastStep, setShowLastStep] = useState(false);
    //initial response 
    // "This project involves developing a todo application that allows users to create, manage, and track their tasks efficiently. The application should provide a user-friendly interface for adding new tasks, marking tasks as complete, and organizing tasks based on priority or due date.

    {/* <questionsection> <question>What specific features beyond basic task creation and completion do you envision for your todo application (e.g., recurring tasks, collaborative lists, subtasks, priority levels)?</question> <question>What platform(s) are you targeting for your todo application (e.g., web, iOS, Android, desktop), and how will this influence your technology choices?</question> <question>How do you plan to handle data persistence and storage for your todo application, and will it support offline access or synchronization across multiple devices?</question> </questionsection>" */ }

    // we want to map the questions to the question array


    useEffect(() => {
        if (!initialResponse) return;

        // Split the response into description and questions
        const questionSection = initialResponse.match(/<questionsection>([^]*?)<\/questionsection>/);
        const description = initialResponse.split('<questionsection>')[0];

        // Parse questions
        if (questionSection) {
            const questionMatches = questionSection[1].match(/<question>(.*?)<\/question>/g);
            if (questionMatches) {
                const cleanedQuestions = questionMatches.map(q =>
                    q.replace(/<question>|<\/question>/g, '').trim()
                );
                setQuestions(cleanedQuestions);
            }
        }

        // Show description with typing effect
        let index = 0;
        const interval = setInterval(() => {
            if (index <= description.length) {
                setBuffer(description.slice(0, index));
                index++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [initialResponse]);

    const showPreviousQuestion = () => {
        if (currentQuestionIndex === 0) {
            // Go back to description
            setShowingDescription(true);
            setCurrentQuestion("");
        } else {
            setCurrentQuestionIndex(prev => prev - 1);
            setCurrentQuestion(questions[currentQuestionIndex - 1]);
        }
    };

    const handleNext = () => {
        if (showingDescription) {
            // Transition from description to first question
            setShowingDescription(false);
            setCurrentQuestionIndex(0);
            setCurrentQuestion(questions[0]);
        }
    };

    const handleAnswerChange = (value: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: value
        }));
    };

    const showNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentQuestion(questions[currentQuestionIndex + 1]);
        } else {
            // Show LastStep component
            setShowLastStep(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-screen flex-col items-center justify-center"
        >
            {showingDescription && (
                <>
                    <div className="text-white text-center text-sm max-w-3xl mx-auto px-4 whitespace-normal break-words">
                        <div className="text-xl">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{buffer}</ReactMarkdown>
                        </div>
                    </div>
                    {isComplete && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            onClick={handleNext}
                            className="mt-10 w-[200px] bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group text-xl"
                        >
                            <span className="bg-violet-400 shadow-violet-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                            Next →
                        </motion.button>
                    )}
                </>
            )}

            {!showingDescription && !showLastStep && questions.length > 0 && (
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <QuestionSection
                        question={currentQuestion}
                        onClickNext={showNextQuestion}
                        onClickPrevious={showPreviousQuestion}
                        currentQuestionIndex={currentQuestionIndex}
                        totalQuestions={questions.length}
                        isLastQuestion={currentQuestionIndex === questions.length - 1}
                        onAnswerChange={handleAnswerChange}
                        currentAnswer={answers[currentQuestionIndex] || ''}
                    />
                </motion.div>
            )}

            {showLastStep && (
                <LastStep />
            )}

            {!showingDescription && questions.length === 0 && (
                <div className="text-white">
                    No questions loaded. Please check the question parsing.
                </div>
            )}
        </motion.div>
    );
}
