'use client';

import RightBottomCorner from "./icons/RightBottomCorner";
import ReasonAccordionComponent from "./ReasonAccordionComponent";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const WhyFormationSection = ({ title, subtitle, description }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="why-formation" className="relative bg-white border-t overflow-hidden pb-[120px]">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="relative w-full z-10 container mx-auto max-w-[1280px] border-l border-r h-full border-black border-opacity-[0.05] flex flex-col items-center justify-center text-center px-[32px] pt-[120px] pb-[64px] gap-[24px]"
        >
          <motion.div
            variants={itemVariants}
            className="relative inline-block group"
          >
            <span className="inline-block border border-formation-blue px-4 py-1 text-sm font-medium uppercase tracking-wider text-formation-blue font-geistMono transition-all duration-300 group-hover:bg-formation-blue group-hover:text-white">
              {subtitle}
            </span>
            <div className="absolute -inset-0.5 bg-formation-blue opacity-0 group-hover:opacity-20 transition duration-300 blur"></div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-[32px] md:text-[56px] max-w-[676px] font-hauora tracking-[-0.05em] font-[500] text-gray-900 leading-[40px] md:leading-[64px] relative"
          >
            <span className="relative inline-block">
              {title}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-formation-blue transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </span>
          </motion.h2>

          <motion.span
            variants={itemVariants}
            className="font-inter max-w-md text-gray-500 tracking-[-0.01em] font-[400] relative"
          >
            <span className="relative inline-block">
              {description}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-formation-blue/20"></div>
            </span>
          </motion.span>

          <RightBottomCorner className="absolute bottom-0 right-0 transition-transform duration-300 hover:scale-110" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-formation-blue/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-formation-blue/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ReasonAccordionComponent />
        </motion.div>
      </div>
    </section>
  );
};

export default WhyFormationSection;
