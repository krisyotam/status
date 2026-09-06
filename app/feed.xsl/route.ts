const stylesheet = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="rss/channel/title" /> · RSS Feed</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          :root { color-scheme: light dark; font-family: Arial, Helvetica, sans-serif; }
          * { box-sizing: border-box; }
          body { max-width: 760px; margin: 0 auto; padding: 56px 24px 96px; background: #121313; color: #efefeb; }
          header { margin-bottom: 42px; }
          h1 { margin: 0 0 8px; font-size: 28px; }
          p { color: #9a9c97; line-height: 1.55; }
          .note { padding: 14px 16px; border: 1px solid #2a2c2a; border-radius: 12px; font-size: 13px; }
          .feed { display: grid; gap: 14px; }
          article { padding: 20px; border: 1px solid #2a2c2a; border-radius: 14px; background: #181918; }
          h2 { margin: 0 0 8px; font-size: 15px; }
          a { color: inherit; text-decoration: none; }
          a:hover { text-decoration: underline; text-underline-offset: 3px; }
          time, article p { margin: 0; color: #9a9c97; font-size: 13px; }
          time { display: block; margin-bottom: 9px; }
          @media (prefers-color-scheme: light) {
            body { background: #fbfbfa; color: #272624; }
            article { border-color: #e4e4e0; background: #fff; }
            .note { border-color: #e4e4e0; }
            p, time, article p { color: #74736f; }
          }
        </style>
      </head>
      <body>
        <header>
          <h1><xsl:value-of select="rss/channel/title" /></h1>
          <p><xsl:value-of select="rss/channel/description" /></p>
          <p class="note">This is an RSS feed. Subscribe with your preferred feed reader to receive incident updates.</p>
        </header>
        <main class="feed">
          <xsl:for-each select="rss/channel/item">
            <article>
              <time><xsl:value-of select="pubDate" /></time>
              <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
              <p><xsl:value-of select="description" /></p>
            </article>
          </xsl:for-each>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;

export function GET() {
  return new Response(stylesheet, {
    headers: {
      'Content-Type': 'application/xslt+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
