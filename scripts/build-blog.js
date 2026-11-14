const fs = require('node:fs');
const path = require('node:path');
const articles = require('./blog-articles.json');

function escapeText(text) {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

module.exports = function buildBlog({ root, site, head, header, footer }) {
  const blog = site + '/blog/';
  const name = "Mango's Photo Booth & Entertainment";
  const indexTitle = 'Event planning guides';
  const description = 'Southwest Florida photo booth guides for hotel planners, couples and hosts. Compare prices, plan your timeline and choose guest favors.';
  const imagePath = post => 'assets/blog/' + post.slug + '.jpg';
  const permalink = post => blog + post.slug + '/';

  function page(post, content) {
    const prefix = post ? '../../' : '../';
    const image = post || articles[0];
    const title = post ? post.title : indexTitle;
    const url = post ? permalink(post) : blog;
    const type = post ? 'BlogPosting' : 'Blog';
    const schema = {
      '@context': 'https://schema.org', '@type': type, url, name: title,
      description: post ? post.summary : description,
      image: site + '/' + imagePath(image),
      publisher: { '@type': 'Organization', name, '@id': site + '/#business' }
    };
    if (post) Object.assign(schema, {
      headline: title, datePublished: post.published, articleSection: post.category, author: schema.publisher, mainEntityOfPage: url,
      isPartOf: { '@type': 'Blog', url: blog }
    });
    else schema.blogPost = articles.map(item => ({ '@type': 'BlogPosting', headline: item.title, url: permalink(item) }));
    const markup = head({
      title: escapeText(title) + ' | Mango’s Photo Booth', ogTitle: escapeText(title),
      description: escapeText(schema.description), slug: post ? 'blog/' + post.slug : 'blog',
      socialImage: schema.image, socialAlt: escapeText(image.alt), article: Boolean(post), blog: true
    }, prefix) + header(prefix) + '<main id="main" class="journal">' + content +
      '</main>\n<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') +
      '</script>\n' + footer(prefix);
    const directory = path.join(root, 'blog', post ? post.slug : '');
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'index.html'), markup);
  }

  function card(post, featured = false) {
    return `<a class="journal-card${featured ? ' journal-feature' : ''}" href="${post.slug}/">
      <img src="../${imagePath(post)}" width="1200" height="630" alt="${escapeText(post.alt)}" ${featured ? 'fetchpriority="high"' : 'loading="lazy"'}>
      <div><span class="journal-category">${escapeText(post.category)}</span><h2>${escapeText(post.title)}</h2>${featured ? '<p>' + escapeText(post.summary) + '</p>' : ''}
      <span class="journal-read">Read guide <span aria-hidden="true">→</span></span></div></a>`;
  }
  page(null, `<div class="journal-wrap"><p class="crumb"><a href="../">Home</a> / Blog</p>
    <h1>Event planning guides</h1><p class="journal-intro">Photo booth advice for hosts and event planners in Southwest Florida.</p>
    ${card(articles[0], true)}<div class="journal-grid">${articles.slice(1).map(p => card(p)).join('')}</div></div>`);
  for (const post of articles) {
    const service = '../../' + post.service + (post.service.includes('#') ? '' : '/');
    const sections = post.sections.map(([heading, ...paragraphs]) =>
      '<section><h2>' + escapeText(heading) + '</h2>' +
      paragraphs.map(p => '<p>' + escapeText(p) + '</p>').join('') + '</section>').join('\n');
    const sourceLinks = (post.sources || []).map(({ label, url }) => {
      if (new URL(url).protocol !== 'https:') throw new Error('Expected an HTTPS source for ' + post.slug);
      return '<a href="' + escapeText(url) + '">' + escapeText(label) + '</a>';
    });
    const sources = sourceLinks.length ? '<aside aria-label="Sources"><h2>Sources</h2><p>' + sourceLinks.join(' · ') + '</p></aside>' : '';
    page(post, `<article class="journal-wrap"><p class="crumb"><a href="../../">Home</a> / <a href="../">Blog</a></p>
      <header class="journal-heading"><span class="journal-category">${escapeText(post.category)}</span>
      <h1>${escapeText(post.title)}</h1><p class="journal-intro">${escapeText(post.summary)}</p>
      <p class="journal-byline">By Mango’s Photo Booth &amp; Entertainment · <time datetime="${escapeText(post.published)}">${new Date(post.published + 'T12:00:00Z').toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'UTC' })}</time></p></header>
      <img class="journal-cover" src="../../${imagePath(post)}" width="1200" height="630" alt="${escapeText(post.alt)}">
      <div class="journal-copy">${sections}${sources}
      <p class="journal-actions"><a class="btn btn-gold" href="${service}">${escapeText(post.cta)}</a>
      <a href="../">All planning guides</a></p></div></article>`);
  }
};
