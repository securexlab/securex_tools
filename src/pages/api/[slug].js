import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getAllPostSlugs, getPostData } from '../../lib/posts';

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>{postData.title} | Blog</title>
        <meta name="description" content={postData.excerpt} />
      </Head>
      
      <main className="max-w-3xl mx-auto bg-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-slate-700/50">
        <div className="mb-10">
          <Link href="/blog" className="text-blue-500 hover:text-blue-400 font-medium text-sm flex items-center transition-colors w-fit">
            <span aria-hidden="true" className="mr-2">&larr;</span> Back to Blog
          </Link>
        </div>
        
        <header className="mb-12 border-b border-slate-700 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight mb-6 leading-tight">
            {postData.title}
          </h1>
          <time className="text-slate-400 font-medium tracking-wide">
            {postData.date}
          </time>
        </header>
        
        <article className="prose prose-invert prose-blue prose-lg md:prose-xl max-w-none text-slate-300">
          <ReactMarkdown>{postData.content}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}