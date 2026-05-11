import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../../lib/posts';

export default function BlogPost() {
  const { slug } = useParams();
  const postData = getPostBySlug(slug);

  if (!postData) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <main className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-slate-200 dark:border-slate-700/50">
        <div className="mb-10">
          <Link to="/blog" className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium text-sm flex items-center transition-colors w-fit">
            <span aria-hidden="true" className="mr-2">&larr;</span> Back to Blog
          </Link>
        </div>

        <header className="mb-12 border-b border-slate-200 dark:border-slate-700 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-6 leading-tight">
            {postData.title}
          </h1>
          <time className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            {postData.date}
          </time>
        </header>

        <article className="prose dark:prose-invert prose-blue prose-lg md:prose-xl max-w-none text-slate-700 dark:text-slate-300">
          <ReactMarkdown>{postData.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
