'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  theme?: 'light' | 'dark';
  defaultOpenIndexes?: number[];
}

export default function FAQAccordion({
  items,
  theme = 'dark',
  defaultOpenIndexes = []
}: FAQAccordionProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>(defaultOpenIndexes);
  const prefersReducedMotion = useReducedMotion();

  const toggleAccordion = (index: number) => {
    setOpenIndexes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const textColor = theme === 'dark' ? 'text-cream' : 'text-brand-blue';
  const borderColor = theme === 'dark' ? 'border-cream/30' : 'border-brand-blue';

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div
            key={index}
            className={`border-b ${borderColor}`}
          >
            {/* Question Button */}
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full text-left py-6 flex items-center justify-between gap-4 ${textColor} hover:opacity-70 transition-opacity duration-300 active:opacity-70`}
              aria-expanded={isOpen}
            >
              <h3 className="text-[20px] sm:text-[24px] md:text-[28px] lg:text-[33px] font-bold leading-tight tracking-[-0.03em] pr-8">
                {item.question}
              </h3>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-shrink-0"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </motion.div>
            </button>

            {/* Answer */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key={`answer-${index}`}
                  initial={!prefersReducedMotion ? { height: 0 } : { height: "auto" }}
                  animate={{
                    height: "auto",
                    transition: {
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  exit={{
                    height: 0,
                    transition: {
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={!prefersReducedMotion ? { opacity: 0 } : { opacity: 1 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: 0.2,
                        delay: 0.1
                      }
                    }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: 0.15
                      }
                    }}
                    className={`pb-6 ${textColor} whitespace-pre-line`}
                  >
                    <p className="text-[16px] sm:text-[18px] md:text-[24px] lg:text-[33px] leading-[1.55] tracking-[-0.01em]">
                      {item.answer}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
