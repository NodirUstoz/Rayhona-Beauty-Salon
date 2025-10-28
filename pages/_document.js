import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="uz" className="light">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Rayhona Go'zallik Saloni - Salon hisoboti" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        
        {/* Google Fonts with Cyrillic support */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100;300;400;500;700;900&family=Open+Sans:wght@300;400;500;600;700;800&display=swap&subset=cyrillic,latin" 
          rel="stylesheet" 
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                console.log('Document script running...');
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                console.log('Saved theme:', savedTheme, 'Prefers dark:', prefersDark);
                
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  console.log('Applied dark theme');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                  console.log('Applied light theme');
                }
                console.log('Final classes:', document.documentElement.className);
              } catch (e) {
                console.error('Theme script error:', e);
                document.documentElement.classList.add('light');
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}