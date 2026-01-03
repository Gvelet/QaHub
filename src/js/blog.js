class Blog {
  constructor() {
    this.articles = [];
    this.currentPage = 1;
    this.itemsPerPage = 9;
    this.currentCategory = 'all';
  }

  async init() {
    await this.loadArticles();

    // Главная (3 карточки)
    if (document.getElementById('homeBlogCards')) {
      this.renderHome();
    }

    // Страница блога
    if (document.getElementById('blogCards')) {
      const params = new URLSearchParams(window.location.search);
      const pageFromUrl = parseInt(params.get('page') || '1', 10);
      this.currentPage = isNaN(pageFromUrl) ? 1 : pageFromUrl;

      this.createCategoryFilters(); // генерируем кнопки по категориям
      this.setupFilters();
      this.renderPage(this.currentPage, this.currentCategory, { scroll: false });
    }
  }

  // ----- Загрузка статей из JSON -----
  async loadArticles() {
    try {
      const res = await fetch('../files/articles.json');
      if (!res.ok) throw new Error('articles.json not found');
      const json = await res.json();

      this.articles = (json || []).map(a => ({
        slug: a.slug,
        title: a.title,
        description: a.description,
        image: a.image || '/images/bg.webp',
        category: a.category || '',
        date: a.date || '',
        url: `./${a.slug}`,
        showOnHome: Boolean(a.showOnHome)
      }));

      // новые сверху
      this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (e) {
      console.error('Не удалось загрузить articles.json', e);
      this.articles = [];
    }
  }


  // ----- Разметка одной карточки -----
createCardHTML(article) {
  return `
    <a href="${article.url}" class="blog__card">
      <img src="${article.image}" alt="${article.title}" class="blog__card-img" loading="lazy">

      <div class="blog__card-content">
        <span class="blog__card-category blog__card-category--top">${article.category}</span>

        <h3 class="blog__card-title">${article.title}</h3>
        <p class="blog__card-desc">${article.description}</p>

        <div class="blog__card-meta">
          <span class="blog__card-date">${this.formatDate(article.date)}</span>
        </div>
      </div>
    </a>
  `;
}

// Разметка карточки на главной
createHomeCardHTML(article) {
  return `
    <div class="swiper-slide blog__card" id='blog__cards'>
        <a href="blog/${article.url}" class="blog__card ">
        <img src="${article.image}" alt="${article.title}" class="blog__card-img" loading="lazy">

        <div class="blog__card-content">
            <span class="blog__card-category blog__card-category--top">${article.category}</span>

            <h3 class="blog__card-title">${article.title}</h3>
            <p class="blog__card-desc">${article.description}</p>

            <div class="blog__card-meta">
            <span class="blog__card-date">${this.formatDate(article.date)}</span>
            </div>
        </div>
        </a>
    </div>
  `;
}

formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const day = d.getDate().toString().padStart(2, '0');
  const monthNames = [
    'января','февраля','марта','апреля','мая','июня',
    'июля','августа','сентября','октября','ноября','декабря'
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
}

  // ----- Главная: первые 3 статьи -----
  renderHome() {
    const container = document.getElementById('homeBlogCards');
    if (!container) return;

    container.innerHTML = '';

    let homeArticles = this.articles.filter(a => a.showOnHome);

    if (homeArticles.length < 3) {
      const rest = this.articles.filter(a => !a.showOnHome);
      homeArticles = homeArticles.concat(rest).slice(0, 3);
    } else {
      homeArticles = homeArticles
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    }

    homeArticles.forEach(article => {
      container.insertAdjacentHTML('beforeend', this.createHomeCardHTML(article));
    });
  }

  // ----- Генерация фильтров категорий -----
  createCategoryFilters() {
    const filterContainer = document.getElementById('blogFilter');
    if (!filterContainer) return;

    // Оставляем только кнопку "Все"
    const allBtn = filterContainer.querySelector('[data-category="all"]');
    filterContainer.innerHTML = '';
    if (allBtn) {
      allBtn.classList.add('active');
      filterContainer.appendChild(allBtn);
    }

    const categories = new Set();

    this.articles.forEach(a => {
      if (!a.category) return;
      const raw = a.category.toString().trim();
      if (!raw) return;

      const key = raw.toLowerCase();
      const label = raw.charAt(0).toUpperCase() + raw.slice(1);

      categories.add(JSON.stringify({ key, label }));
    });

    Array.from(categories)
      .map(str => JSON.parse(str))
      .sort((a, b) => a.label.localeCompare(b.label, 'ru'))
      .forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'blog-filter-btn';
        btn.dataset.category = cat.key;
        btn.textContent = cat.label;
        filterContainer.appendChild(btn);
      });
  }

  updatePageParam(page) {
    const url = new URL(window.location.href);

    if (page === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', page);
    }

    window.history.replaceState(null, '', url.toString());
  }

  // ----- Блог: фильтры + пагинация -----
  renderPage(page, category, { scroll = false } = {}) {
    const cardsContainer = document.getElementById('blogCards');
    const pagination = document.getElementById('blogPagination');
    const empty = document.getElementById('blogEmpty');
    if (!cardsContainer) return;

    // фильтрация
    let list = this.articles;
    if (category && category !== 'all') {
      const cat = category.toLowerCase();
      list = list.filter(a => (a.category || '').toLowerCase().includes(cat));
    }

    // пагинация
    const totalPages = Math.ceil(list.length / this.itemsPerPage) || 1;
    const current = Math.min(Math.max(page, 1), totalPages);
    const start = (current - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageArticles = list.slice(start, end);

    // карточки
    cardsContainer.innerHTML = '';
    pageArticles.forEach(a => {
      cardsContainer.insertAdjacentHTML('beforeend', this.createCardHTML(a));
    });

    // пусто
    if (empty) {
      empty.style.display = pageArticles.length ? 'none' : 'block';
    }

    // пагинация
    if (pagination) {
      pagination.innerHTML = '';
      if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
          const btn = document.createElement('button');
          btn.className = `blog-pagination-btn ${i === current ? 'active' : ''}`;
          btn.textContent = i;
          btn.addEventListener('click', () => {
            this.currentPage = i;
            this.renderPage(i, this.currentCategory || 'all', { scroll: true });
          });
          pagination.appendChild(btn);
        }
      }
    }

    this.currentPage = current;
    this.updatePageParam(current);

    if (scroll) {
      const top = cardsContainer.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  setupFilters() {
    const buttons = document.querySelectorAll('.blog-filter-btn');
    if (!buttons.length) return;

    this.currentCategory = 'all';

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category || 'all';
        this.currentCategory = cat;
        this.renderPage(1, cat, { scroll: false });
      });
    });
  }
}

// инициализация
document.addEventListener('DOMContentLoaded', () => {
  const blog = new Blog();
  blog.init();
});
