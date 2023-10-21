/** @type {import('next').NextConfig} */
const createMDX = require('@next/mdx');
// const remarkGfm = require('remark-gfm');

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    // remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // Optionally, add any other Next.js config below
};

module.exports = withMDX(nextConfig);
