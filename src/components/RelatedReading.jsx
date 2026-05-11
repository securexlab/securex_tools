import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

function RelatedReading({ category }) {
  // This dictionary automatically matches the category prop to the correct blog post
  const contentMap = {
    date: {
      description: "Converting between AD and BS dates involves complex astronomical data because of the variable month lengths in the Bikram Sambat calendar. Learn more about how the official calendar of Nepal works.",
      linkText: "Read: Understanding the Bikram Sambat (BS) Calendar \u2192",
      path: "/blog/understanding-bikram-sambat"
    },
    pdf: {
      description: "Uploading sensitive business documents to random free converters is a massive security risk. Learn how our secure APIs protect your data during conversion.",
      linkText: "Read: Why Secure Document Conversion is Critical \u2192",
      path: "/blog/why-secure-file-conversion-matters"
    },
    text: {
      description: "Discover the technical history of digital Nepali typing, why legacy fonts like Preeti break on modern web browsers, and how transliteration is changing data entry.",
      linkText: "Read: The Evolution of Nepali Typography \u2192",
      path: "/blog/evolution-of-nepali-typography-preeti-to-unicode"
    },
    security: {
      description: "A deep dive into the cryptography that protects modern web applications, the critical differences between hashing and encryption, and how to measure password strength.",
      linkText: "Read: Data Security 101 \u2192",
      path: "/blog/cryptography-basics-hashing-vs-encryption"
    },
    math: {
      description: "Navigating real estate and property transactions in Nepal requires an understanding of unique land measurement standards like Ropani and Bigha. Explore the complete conversion formulas.",
      linkText: "Read: Nepal Land Measurement Explained \u2192",
      path: "/blog/nepal-land-measurement-systems-explained"
    }
  };

  // If someone forgets to pass a category, default to the date blog
  const content = contentMap[category] || contentMap.date;

  return (
    <div className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm mt-12 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-6 h-6 text-blue-600" />
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">Related Reading</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        {content.description}
      </p>
      <Link
        to={content.path}
        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-full"
      >
        {content.linkText}
      </Link>
    </div>
  );
}

export default RelatedReading;
