'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import { motion } from "framer-motion";


export default function FAQs() {
  const faqItems = [
    {
      id: 'item-1',
      question: 'How does the AI matching algorithm work?',
      answer: 'Our advanced AI analyzes your personality traits, interests, and behavioral patterns to find highly compatible matches. The algorithm learns from successful relationships to continuously improve match quality and increase your chances of finding true love.',
    },
    {
      id: 'item-2',
      question: 'Is my personal information safe and secure?',
      answer: 'Absolutely. We prioritize your privacy and security with end-to-end encryption, photo verification systems, and optional background checks. Your data is protected with industry-leading security measures and we never share your information with third parties.',
    },
    {
      id: 'item-3',
      question: 'How do I know if someone is verified?',
      answer: 'All profiles undergo our verification process, which includes photo verification and optional background checks. Verified users display a special badge, and you can see their verification status on their profile. This helps ensure you&apos;re connecting with real, genuine people.',
    },
    {
      id: 'item-4',
      question: 'Can I use the app for free?',
      answer: 'Yes! You can create a profile, browse matches, and send limited messages completely free. Our premium features include unlimited messaging, advanced filtering, detailed compatibility reports, and priority customer support to enhance your dating experience.',
    },
    {
      id: 'item-5',
      question: 'What if I\'m not satisfied with my matches?',
      answer: 'We\'re committed to helping you find meaningful connections. If you\'re not satisfied, our support team can help adjust your preferences, provide dating tips, or troubleshoot any issues. We also offer a satisfaction guarantee for premium members.',
    },
  ];


  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-2">
            <h2 className="text-foreground text-4xl font-semibold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mt-4 text-balance text-lg">
              Everything you need to know about finding love on our platform
            </p>
            <p className="text-muted-foreground mt-6 hidden md:block">
              Can’t find what you’re looking for? Reach out to our{' '}
              <Link
                href="#"
                className="text-primary font-medium hover:underline"
              >
                customer support team
              </Link>{' '}
              for assistance.
            </p>
          </div>

          <div className="md:col-span-3">
            <Accordion
              type="single"
              collapsible>
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-gray-200 dark:border-gray-600">
                  <AccordionTrigger className="cursor-pointer text-base font-medium hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <BlurredStagger text={item.answer} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="text-muted-foreground mt-6 md:hidden">
            Can't find what you're looking for? Contact our{' '}
            <Link
              href="#"
              className="text-primary font-medium hover:underline">
              customer support team
            </Link>
          </p>
        </div>
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
        staggerChildren: 0.015,
      },
    },
  };
 
  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };
 
  return (
    <>
      <div className="w-full">
        <motion.p
          variants={container}
          initial="hidden"
          animate="show"
          className="text-base leading-relaxed break-words whitespace-normal"
        >
          {headingText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterAnimation}
              transition={{ duration: 0.3 }}
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