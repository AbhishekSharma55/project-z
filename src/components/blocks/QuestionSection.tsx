import { motion } from "framer-motion";
import { CustomInput } from "../ui/CustomInput";

export const QuestionSection = ({ 
    question, 
    onClickNext, 
    onClickPrevious,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    onAnswerChange,
    currentAnswer
}: { 
    question: string, 
    onClickNext: () => void, 
    onClickPrevious: () => void,
    currentQuestionIndex: number,
    totalQuestions: number,
    isLastQuestion: boolean,
    onAnswerChange: (value: string) => void,
    currentAnswer: string
}) => {
    return (
        <div className="text-white mt-8 text-center">
            <motion.h2 
                className="text-xl mb-4 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {question}
            </motion.h2>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
            >
                <CustomInput 
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={onAnswerChange}
                />
            </motion.div>

            <div className="flex gap-4 justify-center">
                <motion.button 
                    onClick={onClickPrevious}
                    className="mt-4 bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium px-4 py-2 rounded-md hover:brightness-150"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    {currentQuestionIndex === 0 ? '← Previous' : '← Previous'}
                </motion.button>
                <motion.button 
                    onClick={onClickNext}
                    className="mt-4 bg-violet-950 text-violet-400 border border-violet-400 border-b-4 font-medium px-4 py-2 rounded-md hover:brightness-150"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    {isLastQuestion ? 'Finish →' : 'Next →'}
                </motion.button>
            </div>
            {/* <motion.p 
                className="mt-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                Question {currentQuestionIndex + 1} of {totalQuestions}
            </motion.p> */}
        </div>
    )
}