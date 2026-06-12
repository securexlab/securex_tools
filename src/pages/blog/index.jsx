import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export default function BlogIndex({ posts }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">SecureX Blog</h1>
        <p className="text-slate-500 mt-2">Insights on cybersecurity, tools, and tech.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
            <p className="text-xs font-black text-blue-600 tracking-widest uppercase mb-4">{post.date}</p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{post.title}</h2>
            <p className="text-slate-500 text-sm mb-8 flex-grow">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600">
              Read Article &rarr;
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

// Next.js Magic: This reads the markdown files securely on the server
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'src/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map(filename => {
    const slug = filename.replace('.md', '');
    const markdown = fs.readFileSync(path.join(postsDirectory, filename), 'utf-8');
    
    // Very basic frontmatter parser
    const match = /---\s*([\s\S]*?)\s*---/.exec(markdown);
    const frontMatter = match ? match[1] : '';
    const data = {};
    
    frontMatter.split('\n').forEach(line => {
      const [key, ...value] = line.split(':');
      if (key && value.length) {
        data[key.trim()] = value.join(':').trim().replace(/^["']|["']$/g, '');
      }
    });

    return { slug, title: data.title || '', date: data.date || '', excerpt: data.excerpt || '' };
  });

  return {
    props: {
      posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  };
}