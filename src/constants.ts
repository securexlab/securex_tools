import { 
  Type, 
  Calendar, 
  Calculator, 
  ShieldCheck, 
  Share2 as Social, 
  Wrench as Utils,
  FileText,
  Merge
} from "lucide-react";

export const TOOLS = [
  {
    category: "Document Converters",
    color: "violet",
    icon: FileText,
    items: [
      { name: "PDF to Word", path: "/pdf-to-word", desc: "Convert PDF to editable .docx" },
      { name: "Word to PDF", path: "/word-to-pdf", desc: "Convert .doc/.docx to PDF" },
      { name: "Excel to PDF", path: "/excel-to-pdf", desc: "Convert .xlsx/.xls to PDF" },
      { name: "PPT to PDF", path: "/ppt-to-pdf", desc: "Convert .pptx/.ppt to PDF" },
      { name: "Document Merger", path: "/file-merger", desc: "Combine PDF, Word & PowerPoint" }
    ]
  },
  {
    category: "Text & Documents",
    color: "blue",
    icon: Type,
    items: [
      { name: "Preeti Unicode", path: "/preeti-unicode", desc: "Convert legacy Preeti font to Unicode" },
      { name: "Roman to Nepali", path: "/roman-to-nepali", desc: "Phonetic English to Devanagari" },
      { name: "Word Counter", path: "/word-counter", desc: "Calculate words and reading time" },
      { name: ".np Domain Letter", path: "/np-domain-letter", desc: "Generate registration cover letter" }
    ]
  },
  {
    category: "Date & Time",
    color: "emerald",
    icon: Calendar,
    items: [
      { name: "Nepali Patro", path: "/nepali-patro", desc: "Monthly B.S. calendar viewer" },
      { name: "Date Converter", path: "/date-converter", desc: "B.S. to A.D. and vice versa" },
      { name: "Age Calculator", path: "/age-calculator", desc: "Exact age in Y/M/D format" }
    ]
  },
  {
    category: "Finance & Math",
    color: "amber",
    icon: Calculator,
    items: [
      { name: "Tax Calculator", path: "/tax-calculator", desc: "Nepal salary TDS/tax brackets" },
      { name: "EMI & Sikada", path: "/emi-calculator", desc: "Bank and village interest calc" },
      { name: "Land Converter", path: "/land-converter", desc: "Ropani/Bigha to Sq. Ft." },
      { name: "GPA Calculator", path: "/gpa-calculator", desc: "SEE/NEB grade point calculator" }
    ]
  },
  {
    category: "Tech & Security",
    color: "indigo",
    icon: ShieldCheck,
    items: [
      { name: "Pass Generator", path: "/password-generator", desc: "Secure passwords & Wi-Fi keys" },
      { name: "Hash Encoder", path: "/hash-encoder", desc: "MD5, Base64 encode/decode" },
      { name: "JSON Formatter", path: "/json-formatter", desc: "Prettify and validate JSON" }
    ]
  },
  {
    category: "Creators & Social",
    color: "pink",
    icon: Social,
    items: [
      { name: "YouTube Tags", path: "/youtube-tags", desc: "Trending Nepali niche tags" },
      { name: "Bio Formatter", path: "/bio-formatter", desc: "Social media char limits" }
    ]
  },
  {
    category: "Everyday Utilities",
    color: "cyan",
    icon: Utils,
    items: [
      { name: "Photo Resizer", path: "/photo-resizer", desc: "Lok Sewa Aayog requirements" },
      { name: "Lok Sewa Age", path: "/lok-sewa-age", desc: "Check exam eligibility" },
      { name: "NEA Calculator", path: "/nea-calculator", desc: "Electricity bill estimator" }
    ]
  }
];
