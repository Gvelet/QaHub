document.addEventListener('DOMContentLoaded', () => {
    console.log('Инициализация БЛОГА кА')
  // 1) Заголовок статьи и хлебные крошки
  const h1 = document.querySelector('h1');
  const crumbSpan = document.querySelector('.breadcrumbs span:last-child');

  if (h1 && crumbSpan) {
    crumbSpan.textContent = h1.textContent.trim();
  }

// 2) Канонический URL по текущему адресу
const url = new URL(window.location.href);

// убираем index.html и .html в конце
let cleanPath = url.pathname
  .replace(/index\.html$/i, '')  
  .replace(/\.html$/i, '');       

// гарантируем ведущий слэш
if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

const canonicalHref = `https://qaspace.ru${cleanPath}`;

let link = document.querySelector('link[rel="canonical"]');
if (!link) {
  link = document.createElement('link');
  link.rel = 'canonical';
  document.head.appendChild(link);
}

const currentCanonical = link.getAttribute('href');
if (!currentCanonical) {
  link.setAttribute('href', canonicalHref);
}

if (!h1) return;

const articleTitle = h1.textContent.trim();

  // 3) TITLE: если не задан – подставляем h1
  if (!document.title || document.title.trim() === '') {
    document.title = articleTitle;
  }

  // 4) META DESCRIPTION: шаблон, только если пусто
  const defaultDesc =
    `Статья на тему «${articleTitle}» - Quality Space`;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  if (!metaDesc.getAttribute('content')) {
    metaDesc.setAttribute('content', defaultDesc);
  }
  const finalDesc = metaDesc.getAttribute('content') || defaultDesc;

  // 5) Главное изображение (берём первую картинку в статье)
  const firstImg = document.querySelector('.post-content img');
  const defaultImage = 'https://qaspace.ru/img/bg.png';
  const ogImage = firstImg
    ? new URL(firstImg.getAttribute('src'), canonicalHref).href
    : defaultImage;

  // 6) Вспомогательные функции для OG / Twitter
  function ensureOg(name, value) {
    let tag = document.querySelector(`meta[property="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', name);
      document.head.appendChild(tag);
    }
    if (!tag.getAttribute('content')) {
      tag.setAttribute('content', value);
    }
  }

  function ensureTw(name, value) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    if (!tag.getAttribute('content')) {
      tag.setAttribute('content', value);
    }
  }


  // 8) Twitter Cards
  ensureTw('twitter:title', articleTitle);
  ensureTw('twitter:description', finalDesc);
  ensureTw('twitter:card', 'summary_large_image');
  ensureTw('twitter:image', ogImage);

  // 9) Дата статьи (можно задать в body: data-article-date="2025-11-12")
  const dateFromAttr = document.body.getAttribute('data-article-date');
  const isoDate = dateFromAttr || new Date().toISOString().slice(0, 10);

  // 10) JSON‑LD BlogPosting
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": articleTitle,
    "description": finalDesc,
    "author": {
      "@type": "Person",
      "name": "Михаил Лемешев"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Тестировщик Михаил Лемешев",
      "logo": {
        "@type": "ImageObject",
        "url": "https://psylemesheva.ru/images/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalHref
    },
    "image": ogImage,
    "datePublished": isoDate,
    "dateModified": isoDate
  };

  let ldScript = document.querySelector('script[type="application/ld+json"][data-type="article"]');
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.type = 'application/ld+json';
    ldScript.setAttribute('data-type', 'article');
    document.head.appendChild(ldScript);
  }
  ldScript.textContent = JSON.stringify(blogPosting);
});
