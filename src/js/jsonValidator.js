// jsonValidator.js (обновленный)
class JsonValidator {
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
        this.exportBtn.onclick = () => this.exportJson();

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
            'valid-mini': `{
  "id": 1,
  "name": "Тестовый пользователь",
  "active": true,
  "roles": ["user", "tester"]
}`,
            'valid-large': `{
  "meta": {
    "version": "1.3.5",
    "createdAt": "2026-01-23T14:00:00.000Z",
    "isPublished": true,
    "tags": ["api", "testing", "json", "example"],
    "extra": null
  },

  "users": [
    {
      "id": 1,
      "login": "user123",
      "fullName": "Иван Петров",
      "email": "user123@example.com",
      "age": 28,
      "isVerified": true,
      "balance": 1500.75,
      "countryCode": "RU",
      "permissions": ["read", "write", "admin"],
      "preferences": {
        "theme": "dark",
        "language": "ru",
        "notificationsEnabled": true,
        "maxItemsPerPage": 20
      },
      "createdAt": "2024-03-15T10:30:00.123Z",
      "lastActiveAt": "2026-01-22T18:45:22.345Z",
      "address": {
        "city": "Екатеринбург",
        "street": "Ленина, 34",
        "building": 5,
        "apartment": 12,
        "index": "620000"
      },
      "contacts": [
        {
          "type": "phone",
          "value": "+79001234567",
          "isPrimary": true
        },
        {
          "type": "email",
          "value": "user123@example.com",
          "isPrimary": false
        },
        {
          "type": "telegram",
          "value": "@user123",
          "isPrimary": false
        }
      ],
      "profileImage": "https://example.com/images/user123.png",
      "note": "",
      "archived": false
    },
    {
      "id": 2,
      "login": "test_user",
      "fullName": "Тестовый Пользователь",
      "email": "test@example.com",
      "age": 0,
      "isVerified": false,
      "balance": -100.5,
      "countryCode": "US",
      "permissions": [],
      "preferences": {
        "theme": "light",
        "language": "en",
        "notificationsEnabled": false,
        "maxItemsPerPage": 10
      },
      "createdAt": "2025-12-01T00:00:00.000Z",
      "lastActiveAt": null,
      "address": null,
      "contacts": [],
      "profileImage": null,
      "note": "Этот пользователь используется для автоматических тестов.",
      "archived": true
    },
    {
      "id": 3,
      "login": "empty_fields",
      "fullName": "",
      "email": null,
      "age": null,
      "isVerified": null,
      "balance": null,
      "countryCode": null,
      "permissions": null,
      "preferences": null,
      "createdAt": null,
      "lastActiveAt": null,
      "address": {},
      "contacts": [],
      "profileImage": null,
      "note": "Почти все поля пустые или null.",
      "archived": false
    }
  ],

  "orders": [
    {
      "id": "ORD-0001",
      "userId": 1,
      "items": [
        {
          "productId": "P1001",
          "name": "Смартфон XYZ",
          "quantity": 1,
          "price": 29999.99,
          "discount": 1000.0,
          "total": 28999.99,
          "currency": "RUB",
          "options": {
            "color": "black",
            "storage": "128GB",
            "caseIncluded": true,
            "extraGlasses": false
          }
        },
        {
          "productId": "P1002",
          "name": "Чехол для XYZ",
          "quantity": 2,
          "price": 1990.0,
          "discount": 0.0,
          "total": 3980.0,
          "currency": "RUB",
          "options": {
            "color": "red",
            "material": "silicone"
          }
        }
      ],
      "totalPrice": 32979.99,
      "discountTotal": 1000.0,
      "currency": "RUB",
      "status": "delivered",
      "createdAt": "2025-11-20T12:10:00.000Z",
      "updatedAt": "2025-12-05T15:30:45.111Z",
      "deliveryAddress": {
        "country": "Россия",
        "region": "Свердловская область",
        "city": "Екатеринбург",
        "street": "Ленина, 34",
        "building": 5,
        "index": "620000"
      },
      "comments": [
        {
          "authorId": 1,
          "text": "Пожалуйста, доставьте вечером после 18:00.",
          "createdAt": "2025-11-20T12:11:00.000Z"
        }
      ],
      "metadata": {
        "source": "mobile_app",
        "version": "2.1.0",
        "extra": null
      }
    },
    {
      "id": "ORD-0002",
      "userId": 2,
      "items": [
        {
          "productId": "P1003",
          "name": "Беспроводные наушники",
          "quantity": 1,
          "price": 14990,
          "discount": 0,
          "total": 14990,
          "currency": "RUB",
          "options": {}
        }
      ],
      "totalPrice": 14990,
      "discountTotal": 0,
      "currency": "RUB",
      "status": "processing",
      "createdAt": "2026-01-10T13:05:00.000Z",
      "updatedAt": null,
      "deliveryAddress": null,
      "comments": [],
      "metadata": {}
    }
  ],

  "config": {
    "maxConcurrentRequests": 100,
    "rateLimit": {
      "requestsPerMinute": 60,
      "burst": 120,
      "window": "1m"
    },
    "logging": {
      "level": "INFO",
      "includeStacktrace": false,
      "maskFields": ["password", "token", "secret"]
    },
    "features": {
      "newDesign": true,
      "betaEndpoints": false,
      "experimental": null
    },
    "debug": false,
    "timeouts": [
      {
        "service": "auth",
        "seconds": 10
      },
      {
        "service": "billing",
        "seconds": 30
      }
    ],
    "thirdParty": {
      "analytics": {
        "id": "UA-123456789-1",
        "enabled": true
      },
      "payment": {
        "gateway": "example_gateway",
        "enabled": true,
        "currencyWhitelist": ["RUB", "USD", "EUR"]
      }
    }
  },

  "stats": {
    "totalUsers": 15000,
    "activeUsers": 3200,
    "newUsersLastWeek": 120,
    "totalOrders": 45000,
    "ordersToday": 187,
    "revenueToday": 2845670.88,
    "revenueLastMonth": 78912345.23,
    "averageOrderValue": 1754.49,
    "conversionRate": 0.125,
    "errors": {
      "lastHour": 42,
      "totalLastDay": 127
    }
  },

  "locales": {
    "ru": {
      "greeting": "Добро пожаловать!",
      "thankYou": "Спасибо за покупку"
    },
    "en": {
      "greeting": "Welcome!",
      "thankYou": "Thank you for your purchase"
    }
  },

  "emptyObject": {},
  "emptyArray": [],
  "nullValue": null,
  "numberZero": 0,
  "stringEmpty": "",
  "numberNegative": -1,
  "booleanFalse": false,
  "booleanTrue": true
}
`,
            'invalid': `{
  "id": 1,
  "name": "Тест",
  "status": "active",  // лишняя запятая
}`
        };

        this.editor.value = examples[type];
        this.renderLines();
        this.validate();
    }

    exportJson() {
        const content = this.editor.value;
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `json-export-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('JSON экспортирован!', 'success', true);
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
        this.lines.innerHTML = lines.map((_, i) => 
            `<div class="json-validator__line-num">${i + 1}</div>`
        ).join('');
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
        const json = this.editor.value.trim();
        this.panel.classList.remove('json-validator__panel--error');
        this.clearErrors();

        if (!json) {
            this.hideStatus();
            return;
        }

        try {
            JSON.parse(json);
            this.showStatus('JSON валиден!', 'success', true);
        } catch (e) {
            this.panel.classList.add('json-validator__panel--error');
            const line = this.getErrorLine(e.message);
            this.highlightError(line);
            this.showStatus(`Строка ${line}: ${e.message}`, 'error', false);
        }
    }

    getErrorLine(msg) {
        const match = msg.match(/position (\d+)/);
        if (!match) return 1;
        const pos = parseInt(match[1]);
        return this.editor.value.slice(0, pos).split('\n').length;
    }

    highlightError(line) {
        this.clearErrors();
        const lineEl = this.lines.children[line - 1];
        if (lineEl) {
            lineEl.classList.add('json-validator__line-num--error');
            this.editor.scrollTop = (line - 1) * 20;
        }
    }

    clearErrors() {
        this.lines.querySelectorAll('.json-validator__line-num--error').forEach(el => {
            el.classList.remove('json-validator__line-num--error');
        });
    }

    format() {
        try {
            const obj = JSON.parse(this.editor.value);
            this.editor.value = JSON.stringify(obj, null, 2);
            this.renderLines();
            this.validate();
        } catch {
            if (this.editor.value) {
                this.showStatus('Невалидный JSON!', 'error', true);
            } else {
                this.showStatus('Введите JSON!', 'error', true);
            }
        }
    }

    minify() {
        try {
            const obj = JSON.parse(this.editor.value);
            this.editor.value = JSON.stringify(obj);
            this.renderLines();
            this.validate();
        } catch {
            if (this.editor.value) {
                this.showStatus('Невалидный JSON!', 'error', true);
            } else {
                this.showStatus('Введите JSON!', 'error', true);
            }
        }
    }

    clear() {
        this.editor.value = '';
        this.renderLines();
        this.panel.classList.remove('json-validator__panel--error');
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
            <span class="json-validator__status-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span>${msg}</span>
        `;
        this.status.className = `json-validator__status json-validator__status--${type}`;
        this.status.classList.remove('json-validator__status--hidden');

        if (autoHide) {
            this.statusTimeout = setTimeout(this.hideStatus.bind(this), 3000);
        }
    }

    hideStatus() {
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
            this.statusTimeout = null;
        }
        this.status.classList.add('json-validator__status--hidden');
    }
}

new JsonValidator();
