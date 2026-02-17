import CryptoJS from 'crypto-js';

class Tests {
  constructor() {
    this.tests = [];
    this.currentPage = 1;
    this.itemsPerPage = 8;
    this.currentCategory = 'all';
    this.secretKey = "My$ecretK3y!2023";
  }

  async init() {
    await this.loadTests();
    this.createCategoryFilters();
    this.setupFilters();
    this.setupSearch();
    
    const params = new URLSearchParams(window.location.search);
    const pageFromUrl = parseInt(params.get('page') || '1', 10);
    this.currentPage = isNaN(pageFromUrl) ? 1 : pageFromUrl;
    this.renderPage(this.currentPage, this.currentCategory);
  }

  async loadTests() {
    try {
      const response = await fetch('../files/encrypted/encrypted_tests.json');
      const encryptedData = await response.text();
      const decryptedData = this.decryptData(encryptedData);
      const data = JSON.parse(decryptedData);
      
      this.tests = data.map(test => ({
        key: test.key,
        title: test.title,
        briefDescription: test.briefDescription,
        icon: test.icon,
        categories: test.categories || [],
        time: test.time,
        pinned: test.pinned || false // ✅ НОВОЕ: закреплённые тесты
      }));
    } catch (error) {
      console.error('Ошибка загрузки тестов:', error);
      this.tests = [];
    }
  }

  decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // ✅ ФИЧА 1: Обрезка текста
  truncateDescription(text, maxLength = 120) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  }

  createCardHTML(test) {
    const shortDesc = this.truncateDescription(test.briefDescription);
    return `
      <div class="tests__column">
        <a class="tests-item test-link-${test.key}" href="${test.key}">
          <div class="tests__item-icon">
            <img src="../../img/${test.icon}" alt="${test.title}">
          </div>
          <div class="tests__item-content">
            <h3 class="tests__item-title">${test.title}</h3>
            <div class="tests__item-description" title="${test.briefDescription}">${shortDesc}</div>
          </div>
        </a>
      </div>
    `;
  }

  createCategoryFilters() {
    const select = document.getElementById('testsCategory');
    if (!select) return;
    
    const categories = new Set(['all']);
    this.tests.forEach(test => {
      test.categories.forEach(cat => categories.add(cat));
    });

    select.innerHTML = '<option value="all">Все тесты</option>';
    Array.from(categories)
      .slice(1)
      .sort((a, b) => a.localeCompare(b, 'ru'))
      .forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
      });
  }

  // ✅ ФИЧА 3: Сортировка с закреплёнными первыми
  sortTests(tests, category) {
    const pinned = tests.filter(t => t.pinned);
    const regular = tests.filter(t => !t.pinned);
    
    // В категории: pinned из этой категории + обычные из категории
    if (category !== 'all') {
      const categoryPinned = pinned.filter(t => t.categories.some(c => c.toLowerCase() === category.toLowerCase()));
      const categoryRegular = regular.filter(t => t.categories.some(c => c.toLowerCase() === category.toLowerCase()));
      return [...categoryPinned, ...categoryRegular];
    }
    
    // Все тесты: pinned + обычные
    return [...pinned, ...regular];
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

  renderPage(page, category) {
    const wrapper = document.getElementById('testsWrapper');
    const pagination = document.getElementById('testsPagination');
    const empty = document.getElementById('testsEmpty');

    if (!wrapper) return;

    // ✅ ФИЧА 2: Поиск + фильтр категорий
    let filteredTests = this.tests;
    
    // Категория
    if (category !== 'all') {
      filteredTests = filteredTests.filter(test => 
        test.categories.some(c => c.toLowerCase() === category.toLowerCase())
      );
    }

    // Поиск по title + description
    const searchValue = document.getElementById('testsSearch')?.value.toLowerCase() || '';
    filteredTests = filteredTests.filter(test => {
      return test.title.toLowerCase().includes(searchValue) || 
             test.briefDescription.toLowerCase().includes(searchValue);
    });

    // ✅ Сортировка: pinned первыми
    filteredTests = this.sortTests(filteredTests, category);

    const totalPages = Math.ceil(filteredTests.length / this.itemsPerPage) || 1;
    const current = Math.min(Math.max(page, 1), totalPages);
    const start = (current - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageTests = filteredTests.slice(start, end);

    wrapper.innerHTML = '';
    pageTests.forEach(test => {
      wrapper.insertAdjacentHTML('beforeend', this.createCardHTML(test));
    });

    if (empty) {
      empty.style.display = pageTests.length ? 'none' : 'block';
    }

    if (pagination && totalPages > 1) {
      pagination.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `tests-pagination-btn ${i === current ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
          this.currentPage = i;
          this.renderPage(i, this.currentCategory);
          window.scrollTo({ 
            top: wrapper.getBoundingClientRect().top + window.scrollY - 80, 
            behavior: 'smooth' 
          });
        });
        pagination.appendChild(btn);
      }
    } else if (pagination) {
      pagination.innerHTML = '';
    }

    this.currentPage = current;
    this.updatePageParam(current);
  }

  setupFilters() {
    const select = document.getElementById('testsCategory');
    if (select) {
      select.addEventListener('change', (e) => {
        this.currentCategory = e.target.value;
        this.currentPage = 1;
        this.renderPage(1, this.currentCategory);
      });
    }
  }

  // ✅ ФИЧА 2: Улучшенный поиск
  setupSearch() {
    const searchInput = document.getElementById('testsSearch');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          this.currentPage = 1;
          this.renderPage(1, this.currentCategory);
        }, 300);
      });
      
      // Очистка при удалении текста
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          searchInput.value = '';
          this.currentPage = 1;
          this.renderPage(1, this.currentCategory);
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tests = new Tests();
  tests.init();
});
