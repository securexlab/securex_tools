import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, GraduationCap, Award, BarChart3 } from "lucide-react";
import { cn } from "../lib/utils";
import BackButton from "../components/BackButton";

const gradePoints = {
  "A+": 4.0, "A": 3.6, "B+": 3.2, "B": 2.8, "C+": 2.4, "C": 2.0, "D": 1.6, "NG": 0.0
};

export default function GpaCalculator() {
  const [subjects, setSubjects] = useState([
    { name: "Mathematics", grade: "A", creditHour: 4 },
    { name: "English", grade: "B+", creditHour: 4 },
    { name: "Science", grade: "A+", creditHour: 4 }
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { name: "", grade: "A", creditHour: 4 }]);
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[index][field] = value;
    setSubjects(newSubjects);
  };

  const calculateGPA = () => {
    let totalGradePoints = 0;
    let totalCreditHours = 0;

    subjects.forEach(sub => {
      totalGradePoints += (gradePoints[sub.grade] || 0) * sub.creditHour;
      totalCreditHours += sub.creditHour;
    });

    return totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : "0.00";
  };

  const gpa = calculateGPA();

  return (
    <div className="space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GPA Calculator</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Calculate your SEE or NEB grade point average with weighting.</p>
        </div>
        <button 
          onClick={addSubject}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-4">
           {subjects.map((sub, idx) => (
             <div key={idx} className="glass-card p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex items-center gap-4 animate-in slide-in-from-left-4 duration-300">
                <div className="flex-1">
                  <input 
                    type="text"
                    value={sub.name}
                    onChange={(e) => updateSubject(idx, "name", e.target.value)}
                    placeholder="Subject Name"
                    className="w-full bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-300"
                  />
                </div>
                <div className="w-24">
                  <select 
                    value={sub.grade}
                    onChange={(e) => updateSubject(idx, "grade", e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-2 rounded-lg text-sm font-bold outline-none"
                  >
                    {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="w-20">
                   <input 
                    type="number"
                    value={sub.creditHour}
                    onChange={(e) => updateSubject(idx, "creditHour", parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-2 rounded-lg text-sm font-bold outline-none text-center"
                   />
                </div>
                <button 
                  onClick={() => removeSubject(idx)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>

        <div className="space-y-6 lg:sticky lg:top-24">
           <div className="glass-card bg-slate-950 text-white dark:bg-white dark:text-slate-950 p-10 flex flex-col items-center text-center space-y-4 shadow-2xl relative overflow-hidden group">
              <BarChart3 className="absolute bottom-4 right-4 w-20 h-20 opacity-5 -mb-4 -mr-4 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <div className="p-4 bg-white/10 dark:bg-blue-50 rounded-2xl">
                 <GraduationCap className="w-10 h-10 text-white dark:text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-60">Resultant GPA</p>
                <h4 className="text-7xl font-black tracking-tighter">{gpa}</h4>
              </div>
              <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20">
                Excellent!
              </div>
           </div>

           <div className="glass-card p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-3.5 h-3.5" /> Grade Mapping
              </h5>
              <div className="grid grid-cols-2 gap-2">
                 {Object.entries(gradePoints).map(([g, p]) => (
                   <div key={g} className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950 text-xs font-bold">
                      <span className="text-slate-500">{g}</span>
                      <span className="text-blue-600">{p.toFixed(1)}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* SEO Optimized Publisher Content */}
      <div className="prose prose-slate dark:prose-invert max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800">
        <h2>Calculating Academic Performance and Grade Point Averages</h2>
        <p>Understanding academic standing is critical for students navigating Nepal's modern educational grading structures, such as the SEE and NEB exams. The GPA Calculator provides a structured, dynamic interface to accurately compute the weighted average of letter grades across multiple subjects, translating qualitative academic performance into a standardized numerical metric.</p>
        <h3>The Weighted Average Algorithm</h3>
        <p>The core logic of this calculator relies on a weighted arithmetic mean. Each academic letter grade (from A+ to D) is mathematically mapped to a specific grade point value (ranging from 4.0 to 1.6). When a user inputs their grades and corresponding credit hours, the engine performs a parallel aggregation.</p>
        <p>For every subject, it multiplies the assigned grade point by the credit hours to determine the total weight. It then divides the sum of all weighted points by the sum of all credit hours. This formula ensures that subjects with higher credit hours exert a proportionally larger impact on the final Resultant GPA. The application updates the DOM in real-time, executing these floating-point calculations instantly to provide students with precise, error-free academic forecasting.</p>
        <hr className="my-8 border-slate-200 dark:border-slate-800" />
        <h3>Related Reading</h3>
        <p>Learn more about regional measurement rules and mathematics in our article: <Link to="/blog/nepal-land-measurement-systems-explained" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-200">Understanding Nepal's Mathematical Systems</Link>.</p>
      </div>
    </div>
  );
}
