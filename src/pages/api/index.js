import Head from 'next/head';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function BlogIndex({ allPostsData }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-16">
      <Head>
        <title>Blog | Our Premium SaaS</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Latest Updates
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
            Insights, product updates, and industry news.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {allPostsData.map(({ slug, title, date, excerpt }) => (
            <div key={slug} className="flex flex-col bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-700/50 hover:border-blue-500 transition-all duration-300">
              <div className="flex-1">
                <time className="text-sm font-semibold tracking-wide text-blue-500 uppercase">{date}</time>
                <Link href={`/blog/${slug}`} className="block mt-3">
                  <h3 className="text-2xl font-bold text-slate-50 hover:text-blue-400 transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="mt-4 text-base text-slate-400 leading-relaxed">
                    {excerpt}
                  </p>
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <Link href={`/blog/${slug}`} className="text-blue-500 hover:text-blue-400 font-semibold text-sm flex items-center transition-colors">
                  Read Article <span aria-hidden="true" className="ml-1">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}