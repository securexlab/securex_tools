import { Link } from 'react-router-dom';
import { getAllPosts } from '../../lib/posts';

export default function BlogIndex() {
  const allPosts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <main className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-slate-200 dark:border-slate-700/50">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight mb-4">
            SecureX Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Read our latest insights on security, Nepali tech, file conversion, and modern web tools.
          </p>
        </header>

        <section className="space-y-8">
          {allPosts.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400">No blog posts are available yet.</p>
          ) : (
            allPosts.map(({ slug, title, date, excerpt }) => (
              <article key={slug} className="rounded-3xl p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-shadow hover:shadow-xl">
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                      {title}
                    </h2>
                    <time className="text-slate-500 dark:text-slate-400 font-medium">
                      {date}
                    </time>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {excerpt}
                  </p>
                  <Link
                    to={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                  >
                    Read more
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
