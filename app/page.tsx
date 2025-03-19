"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SearchBox } from "@/components/searchBox"; // Updated import path
import { TrendingInterviews } from "@/components/trending-interviews";
import { CompanyLogos } from "@/components/company-logos";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Page() {  // Changed from Home to Page for Next.js 13+ convention
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 lg:py-40 xl:py-48 bg-gradient-to-b from-background to-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center space-y-6 text-center"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Share Your Interview Experience
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Help others prepare for their interviews by sharing your experience. Learn from others who have been there.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <SearchBox />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button asChild size="lg" className="mt-6 hover:shadow-lg transition-shadow">
                <Link href="/submit" className="flex items-center">
                  Share Your Experience
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-6 text-center"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Trusted by Candidates from Top Companies
              </h2>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Join thousands of candidates who have shared their interview experiences.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <CompanyLogos />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trending Interviews Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center space-y-6 text-center"
          >
            <motion.div variants={fadeInUp} className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Trending Interview Experiences
              </h2>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Discover the latest interview experiences shared by the community.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <TrendingInterviews />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button asChild variant="outline" size="lg" className="mt-8 hover:shadow-lg transition-shadow">
                <Link href="/interviews" className="flex items-center">
                  View All Interviews
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
