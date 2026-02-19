// xmlValidator.js
class XmlValidator {
  constructor() {
    this.editor = document.getElementById('editor');
    this.panel = document.getElementById('editorPanel');
    this.lines = document.getElementById('lines');
    this.status = document.getElementById('status');
    this.examplesSelect = document.getElementById('examples');
    this.copyBtn = document.getElementById('copyBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.buttons = {
      check: document.getElementById('check'),
      format: document.getElementById('format'),
      minify: document.getElementById('minify'),
      clear: document.getElementById('clear')
    };
    this.statusTimeout = null;
    this.init();
  }

  init() {
    // Основные кнопки
    Object.values(this.buttons).forEach(btn => {
      btn.onclick = () => this.handleBtn(btn.id);
    });

    // Новая кнопка копировать в углу
    this.copyBtn.onclick = () => this.copy();

    // Новая кнопка экспорт
    this.exportBtn.onclick = () => this.exportXml();

    // Селект примеров
    this.examplesSelect.onchange = (e) => {
      if (e.target.value) {
        this.loadExample(e.target.value);
        e.target.value = '';
      }
    };

    this.editor.oninput = this.onInput.bind(this);
    this.editor.onscroll = this.syncScroll.bind(this);
    document.onkeydown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        this.validate();
      }
    };

    this.renderLines();
  }

  loadExample(type) {
    const examples = {
      'valid-mini': `<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>1</id>
  <name>Тестовый пользователь</name>
  <active>true</active>
  <roles>
    <role>user</role>
    <role>tester</role>
  </roles>
</user>`,

      'valid-large': `<?xml version="1.0" encoding="UTF-8"?>
<apiResponse>
  <meta>
    <version>1.3.5</version>
    <createdAt>2026-01-23T14:00:00.000Z</createdAt>
    <isPublished>true</isPublished>
    <tags>
      <tag>api</tag>
      <tag>testing</tag>
      <tag>xml</tag>
      <tag>example</tag>
    </tags>
  </meta>
  <users>
    <user id="1">
      <login>user123</login>
      <fullName>Иван Петров</fullName>
      <email>user123@example.com</email>
      <age>28</age>
      <isVerified>true</isVerified>
      <balance>1500.75</balance>
      <countryCode>RU</countryCode>
      <permissions>
        <permission>read</permission>
        <permission>write</permission>
        <permission>admin</permission>
      </permissions>
      <preferences>
        <theme>dark</theme>
        <language>ru</language>
        <notificationsEnabled>true</notificationsEnabled>
        <maxItemsPerPage>20</maxItemsPerPage>
      </preferences>
      <createdAt>2024-03-15T10:30:00.123Z</createdAt>
      <address>
        <city>Екатеринбург</city>
        <street>Ленина, 34</street>
        <building>5</building>
        <apartment>12</apartment>
        <index>620000</index>
      </address>
    </user>
    <user id="2">
      <login>test_user</login>
      <fullName>Тестовый Пользователь</fullName>
      <email>test@example.com</email>
      <age>0</age>
      <isVerified>false</isVerified>
      <balance>-100.5</balance>
      <countryCode>US</countryCode>
      <permissions/>
      <preferences>
        <theme>light</theme>
        <language>en</language>
        <notificationsEnabled>false</notificationsEnabled>
        <maxItemsPerPage>10</maxItemsPerPage>
      </preferences>
      <createdAt>2025-12-01T00:00:00.000Z</createdAt>
      <note>Этот пользователь используется для автоматических тестов.</note>
      <archived>true</archived>
    </user>
  </users>
  <orders>
    <order id="ORD-0001">
      <userId>1</userId>
      <items>
        <item>
          <productId>P1001</productId>
          <name>Смартфон XYZ</name>
          <quantity>1</quantity>
          <price>29999.99</price>
          <discount>1000.0</discount>
          <total>28999.99</total>
          <currency>RUB</currency>
        </item>
      </items>
      <totalPrice>32979.99</totalPrice>
      <status>delivered</status>
    </order>
  </orders>
  <config>
    <maxConcurrentRequests>100</maxConcurrentRequests>
    <rateLimit>
      <requestsPerMinute>60</requestsPerMinute>
      <burst>120</burst>
    </rateLimit>
  </config>
  <stats>
    <totalUsers>15000</totalUsers>
    <activeUsers>3200</activeUsers>
  </stats>
</apiResponse>`,

      'invalid': `<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>1</id>
  <name>Тест</name>
  <status>active</status>
</user`
    };

    this.editor.value = examples[type];
    this.renderLines();
    this.validate();
  }

  exportXml() {
    const content = this.editor.value;
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xml-export-${new Date().toISOString().slice(0,10)}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showStatus('XML экспортирован!', 'success', true);
  }

  onInput() {
    const wasEmpty = !this.editor.value.trim();
    this.renderLines();
    this.debounce(this.validate, 400)();
    if (wasEmpty && !this.editor.value.trim()) {
      this.hideStatus();
    }
  }

  debounce(fn, ms) {
    let t;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn.bind(this), ms);
    };
  }

  syncScroll() {
    this.lines.scrollTop = this.editor.scrollTop;
  }

  renderLines() {
    const lines = this.editor.value.split('\n');
    this.lines.innerHTML = lines.map((_, i) => `<div class="xml-validator__line-num">${i + 1}</div>`).join('');
  }

  handleBtn(id) {
    const actions = {
      check: () => this.validate(),
      format: () => this.format(),
      minify: () => this.minify(),
      clear: () => this.clear()
    };
    actions[id]?.();
  }

  validate() {
    const xml = this.editor.value.trim();
    this.panel.classList.remove('xml-validator__panel--error');
    this.clearErrors();

    if (!xml) {
      this.hideStatus();
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Проверяем наличие ошибок парсинга
    const parseError = doc.querySelector('parsererror');
    if (parseError || doc.getElementsByTagName('parsererror').length > 0) {
      this.panel.classList.add('xml-validator__panel--error');
      const errorMsg = parseError ? parseError.textContent : 'Ошибка парсинга XML';
      const line = this.getErrorLine(errorMsg);
      this.highlightError(line);
      this.showStatus(`Строка ${line}: ${errorMsg}`, 'error', false);
      return;
    }

    // Проверяем наличие корневого элемента
    if (!doc.documentElement) {
      this.panel.classList.add('xml-validator__panel--error');
      this.highlightError(1);
      this.showStatus('Отсутствует корневой элемент XML', 'error', false);
      return;
    }

    this.showStatus('XML валиден!', 'success', true);
  }

  getErrorLine(msg) {
    // Пытаемся извлечь номер строки из сообщения об ошибке
    const lineMatch = msg.match(/line (\d+)/i);
    if (lineMatch) {
      return parseInt(lineMatch[1]);
    }
    
    // Fallback - первая строка
    return 1;
  }

  highlightError(line) {
    this.clearErrors();
    const lineEl = this.lines.children[line - 1];
    if (lineEl) {
      lineEl.classList.add('xml-validator__line-num--error');
      this.editor.scrollTop = (line - 1) * 20;
    }
  }

  clearErrors() {
    this.lines.querySelectorAll('.xml-validator__line-num--error').forEach(el => {
      el.classList.remove('xml-validator__line-num--error');
    });
  }

  format() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.editor.value, 'text/xml');
      
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Невалидный XML');
      }

      const serializer = new XMLSerializer();
      let formatted = serializer.serializeToString(doc);
      
      // Добавляем декларацию XML если её нет
      if (!formatted.startsWith('<?xml')) {
        formatted = '<?xml version="1.0" encoding="UTF-8"?>\n' + formatted;
      }
      
      // Форматирование с отступами
      formatted = formatted.replace(/></g, '>\n<');
      formatted = formatted.replace(/\n\s*\n/g, '\n'); // Удаляем пустые строки
      
      this.editor.value = formatted;
      this.renderLines();
      this.validate();
    } catch (e) {
      if (this.editor.value) {
        this.showStatus('Невалидный XML!', 'error', true);
      } else {
        this.showStatus('Введите XML!', 'error', true);
      }
    }
  }

  minify() {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.editor.value, 'text/xml');
      
      const parseError = doc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Невалидный XML');
      }

      const serializer = new XMLSerializer();
      let minified = serializer.serializeToString(doc);
      
      // Удаляем все пробелы между тегами
      minified = minified.replace(/\s+/g, ' ').replace(/> </g, '><');
      
      // Добавляем декларацию если её нет
      if (!minified.startsWith('<?xml')) {
        minified = '<?xml version="1.0" encoding="UTF-8"?>' + minified;
      }
      
      this.editor.value = minified;
      this.renderLines();
      this.validate();
    } catch (e) {
      if (this.editor.value) {
        this.showStatus('Невалидный XML!', 'error', true);
      } else {
        this.showStatus('Введите XML!', 'error', true);
      }
    }
  }

  clear() {
    this.editor.value = '';
    this.renderLines();
    this.panel.classList.remove('xml-validator__panel--error');
    this.hideStatus();
  }

  copy() {
    navigator.clipboard.writeText(this.editor.value).then(() => {
      this.showStatus('Скопировано!', 'success', true);
    }).catch(() => {
      this.showStatus('Ошибка копирования', 'error', true);
    });
  }

  showStatus(msg, type, autoHide = false) {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
      this.statusTimeout = null;
    }

    this.status.innerHTML = `
      <span class="xml-validator__status-icon">${type === 'success' ? '✅' : '❌'}</span>
      <span>${msg}</span>
    `;
    this.status.className = `xml-validator__status xml-validator__status--${type}`;
    this.status.style.display = 'block';

    if (autoHide) {
      this.statusTimeout = setTimeout(this.hideStatus.bind(this), 3000);
    }
  }

  hideStatus() {
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
      this.statusTimeout = null;
    }
    this.status.style.display = 'none';
  }
}

new XmlValidator();
