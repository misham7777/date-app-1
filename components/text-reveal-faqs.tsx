'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function FAQs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const faqItems = [
    {
      id: 'item-1',
      question: 'How does the AI facial recognition search work?',
      answer: 'Our AI analyzes uploaded photos and scans 50+ dating platforms to identify matching profiles based on facial recognition technology, even when different names or ages are used.',
    },
    {
      id: 'item-2',
      question: 'Is my personal information safe and secure?',
      answer: 'Absolutely. We prioritize your privacy and security with end-to-end encryption, photo verification systems, and optional background checks. Your data is protected with industry-leading security measures and we never share your information with third parties.',
    },
    {
      id: 'item-3',
      question: 'How accurate is the profile search?',
      answer: 'Our AI achieves a 94% accuracy rate through advanced facial recognition technology. We verify results through multiple data points including profile matching, location verification, and activity confirmation.',
    },
    {
      id: 'item-4',
      question: 'How long does it take to find profiles?',
      answer: 'Most searches are completed within 5 minutes. Our AI-powered system processes searches instantly, providing immediate results and detailed profile information across all platforms.',
    },
    {
      id: 'item-5',
      question: 'Will the person know they\'re being searched?',
      answer: 'No, all searches are completely anonymous and discreet. The target profile will never know they\'ve been searched, and your search history remains private.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section with Animation */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <Badge variant="secondary" className="mb-4">
            Got Questions?
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about discovering relationship truth
          </p>
        </motion.div>

        {/* FAQ Content */}
        <motion.div 
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <AccordionItem value={item.id} className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <span className="text-left font-semibold text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="pt-2">
                        <BlurredStagger text={item.answer} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>


        </motion.div>
      </div>
    </section>
  )
}

export const BlurredStagger = ({
  text = "built by ruixen.com",
}: {
  text: string;
}) => {
  const headingText = text;
 
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };
 
  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(8px)",
      y: 10,
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
    },
  };
 
  return (
    <>
      <div className="w-full">
        <motion.p
          variants={container}
          initial="hidden"
          animate="show"
          className="text-lg md:text-xl leading-relaxed break-words whitespace-normal text-gray-700 dark:text-gray-200 font-semibold"
        >
          {headingText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterAnimation}
              transition={{ duration: 0.4, ease: "easeOut" as const }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.p>
      </div>
    </>
  );
};