const postModules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontMatter(rawText) {
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = rawText.match(frontMatterRegex);
  const metadata = {};
  let content = rawText;

  if (match) {
    const rawMeta = match[1];
    content = rawText.slice(match[0].length).trim();
    rawMeta.split(/\r?\n/).forEach((line) => {
      const [key, ...rest] = line.split(':');
      if (!key) return;
      let value = rest.join(':').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      metadata[key.trim()] = value;
    });
  }

  return { metadata, content };
}

const posts = Object.entries(postModules)
  .map(([filePath, raw]) => {
    const slug = filePath
      .split('/')
      .pop()
      .replace(/\.md$/, '');
    const { metadata, content } = parseFrontMatter(raw.default ?? raw);
    return {
      slug,
      content,
      ...metadata,
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}
