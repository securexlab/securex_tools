import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages";
import ScrollToTop from "./components/ScrollToTop";
import { ThemeProvider } from "./context/ThemeContext";


// Category 1 Tools
import PreetiToUnicode from "./pages/PreetiToUnicode";
import RomanToNepali from "./pages/RomanToNepali";
import WordCounter from "./pages/WordCounter";
import NpDomainLetter from "./pages/NpDomainLetter";

// Category 2 Tools
import NepaliPatro from "./pages/NepaliPatro";
import DateConverter from "./pages/DateConverter";
import AgeCalculator from "./pages/AgeCalculator";

// Category 3 Tools
import TaxCalculator from "./pages/TaxCalculator";
import EmiCalculator from "./pages/EmiCalculator";
import LandConverter from "./pages/LandConverter";
import GpaCalculator from "./pages/GpaCalculator";

// Category 4 Tools
import PasswordGenerator from "./pages/PasswordGenerator";
import HashEncoder from "./pages/HashEncoder";
import JsonFormatter from "./pages/JsonFormatter";

// Category 5 Tools
import YoutubeTags from "./pages/YoutubeTags";
import BioFormatter from "./pages/BioFormatter";

// Category 6 Tools
import PhotoResizer from "./pages/PhotoResizer";
import LokSewaAge from "./pages/LokSewaAge";
import NeaCalculator from "./pages/NeaCalculator";

// New Category: Document Converters
import PdfToWord from "./pages/PdfToWord";
import WordToPdf from "./pages/WordToPdf";
import ExcelToPdf from "./pages/ExcelToPdf";
import PptToPdf from "./pages/PptToPdf";
import FileMerger from "./pages/file-merger";

// Legal Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";

// Blog Pages
import BlogIndex from "./pages/blog";
import BlogPost from "./pages/blog/[slug].jsx";

// Landing Page & Navigation Components
export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Category 1: Text & Documents */}
          <Route path="/preeti-unicode" element={<PreetiToUnicode />} />
          <Route path="/roman-to-nepali" element={<RomanToNepali />} />
          <Route path="/word-counter" element={<WordCounter />} />
          <Route path="/np-domain-letter" element={<NpDomainLetter />} />
          
          {/* Category 2: Date & Time */}
          <Route path="/nepali-patro" element={<NepaliPatro />} />
          <Route path="/date-converter" element={<DateConverter />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          
          {/* Category 3: Finance & Math */}
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/land-converter" element={<LandConverter />} />
          <Route path="/gpa-calculator" element={<GpaCalculator />} />
          
          {/* Category 4: Tech & Security */}
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/hash-encoder" element={<HashEncoder />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          
          {/* Category 5: Creators & Social */}
          <Route path="/youtube-tags" element={<YoutubeTags />} />
          <Route path="/bio-formatter" element={<BioFormatter />} />
          
          {/* Category 6: Everyday Utilities */}
          <Route path="/photo-resizer" element={<PhotoResizer />} />
          <Route path="/lok-sewa-age" element={<LokSewaAge />} />
          <Route path="/nea-calculator" element={<NeaCalculator />} />

          {/* New Category: Document Converters */}
          <Route path="/pdf-to-word" element={<PdfToWord />} />
          <Route path="/word-to-pdf" element={<WordToPdf />} />
          <Route path="/excel-to-pdf" element={<ExcelToPdf />} />
          <Route path="/ppt-to-pdf" element={<PptToPdf />} />
          <Route path="/file-merger" element={<FileMerger />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />

          {/* Blog Pages */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
  
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}
