// lorem-generator.js
class LoremGenerator {
    constructor() {
        this.LATIN_WORDS = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
            'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
            'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
            'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
            'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit',
            'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'proident', 'culpa', 'officia',
            'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
        ];

        this.CYRILLIC_WORDS = [
            'преимущество', 'возможность', 'решение', 'система', 'процесс', 'уровень', 'показатель',
            'результат', 'клиент', 'проект', 'команда', 'анализ', 'разработка', 'реализация',
            'контроль', 'качество', 'оптимизация', 'интеграция', 'платформа', 'интерфейс',
            'функционал', 'настройка', 'автоматизация', 'тестирование', 'отчётность', 'безопасность',
            'масштабируемость', 'производительность', 'надежность', 'доступность', 'инновация',
            'персонализация', 'локализация', 'модернизация', 'стандартизация', 'сервис'
        ];

        this.CLASSIC_LOREM = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry';
        this.init();
    }

    init() {
        this.elements = {
            type: document.getElementById('lorem-type'),
            count: document.getElementById('lorem-count'),
            language: document.getElementById('lorem-language'),
            sentenceLength: document.getElementById('lorem-sentenceLength'),
            sentenceLengthValue: document.getElementById('lorem-sentenceLengthValue'),
            classicStart: document.getElementById('lorem-classicStart'),
            htmlWrap: document.getElementById('lorem-htmlWrap'),
            lists: document.getElementById('lorem-lists'),
            generateBtn: document.getElementById('lorem-generateBtn'),
            clearBtn: document.getElementById('lorem-clearBtn'),
            copyBtn: document.getElementById('lorem-copyBtn'),
            result: document.getElementById('lorem-result'),
            resultContainer: document.getElementById('lorem-resultContainer'),
            stats: document.getElementById('lorem-stats'),
            copySuccess: document.getElementById('lorem-copySuccess'),
            previewMode: document.getElementById('lorem-previewMode')
        };

        this.bindEvents();
        this.toggleSentenceLength();
        this.toggleClassicStart(); 
        setTimeout(() => this.generateLorem(), 500);
    }

    bindEvents() {
        this.elements.sentenceLength.addEventListener('input', (e) => {
            this.elements.sentenceLengthValue.textContent = `${e.target.value} слов`;
        });

        // ✅ ВЗАИМОИСКЛЮЧАЮЩИЕ ЧЕКБОКСЫ
        // HTML Wrap (параграфы) → отключает списки
        this.elements.htmlWrap.addEventListener('change', () => {
            if (this.elements.htmlWrap.checked) {
                this.elements.lists.checked = false;
                this.elements.lists.disabled = true;
                const listItem = this.elements.lists.closest('.lorem-checkbox-item');
                if (listItem) listItem.classList.add('disabled');
            } else {
                this.elements.lists.disabled = false;
                const listItem = this.elements.lists.closest('.lorem-checkbox-item');
                if (listItem) listItem.classList.remove('disabled');
            }
        });
        
        // Lists (списки) → отключает HTML Wrap
        this.elements.lists.addEventListener('change', () => {
            if (this.elements.lists.checked) {
                this.elements.htmlWrap.checked = false;
                this.elements.htmlWrap.disabled = true;
                const htmlItem = this.elements.htmlWrap.closest('.lorem-checkbox-item');
                if (htmlItem) htmlItem.classList.add('disabled');
            } else {
                this.elements.htmlWrap.disabled = false;
                const htmlItem = this.elements.htmlWrap.closest('.lorem-checkbox-item');
                if (htmlItem) htmlItem.classList.remove('disabled');
            }
        });

        this.elements.generateBtn.addEventListener('click', () => this.generateLorem());
        this.elements.clearBtn.addEventListener('click', () => this.clearResult());
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.type.addEventListener('change', () =>  {
            this.toggleSentenceLength();
            this.toggleClassicStart();
        });
        this.elements.count.addEventListener('input', () => {
            this.toggleClassicStart();
        });

        this.elements.resultContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.resultContainer.classList.add('dragover');
        });

        this.elements.resultContainer.addEventListener('dragleave', () => {
            this.elements.resultContainer.classList.remove('dragover');
        });

        this.elements.resultContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.resultContainer.classList.remove('dragover');
        });
    }

    toggleSentenceLength() {
        const isWordsType = this.elements.type.value === 'words';
        const formGroup = this.elements.sentenceLength.closest('.lorem-form-group');

        if (isWordsType) {
            this.elements.sentenceLength.disabled = true;
            formGroup.classList.add('sentence-length-disabled');
            this.elements.sentenceLengthValue.style.opacity = '0.5';
        } else {
            this.elements.sentenceLength.disabled = false;
            formGroup.classList.remove('sentence-length-disabled');
            this.elements.sentenceLengthValue.style.opacity = '1';
        }
    }

    toggleClassicStart() {
        const isWordsType = this.elements.type.value === 'words';
        const count = parseInt(this.elements.count.value);
        
        if (isWordsType && count < 12) {
            this.elements.classicStart.checked = false;
            this.elements.classicStart.disabled = true;
        } else {
            this.elements.classicStart.disabled = false;
        }
    }

    generateLorem() {
        const settings = {
            type: this.elements.type.value,
            count: parseInt(this.elements.count.value),
            language: this.elements.language.value,
            sentenceLength: parseInt(this.elements.sentenceLength.value),
            classicStart: this.elements.classicStart.checked,
            htmlWrap: this.elements.htmlWrap.checked,
            lists: this.elements.lists.checked
        };

        let result = '';

        switch (settings.type) {
            case 'words':
                result = this.generateWords(settings.count, settings);
                break;
            case 'sentences':
                result = this.generateSentences(settings.count, settings);
                break;
            case 'paragraphs':
            default:
                result = this.generateParagraphs(settings.count, settings);
                break;
        }

        this.elements.result.value = result;
        this.updateStats(result);
        this.elements.previewMode.textContent = settings.htmlWrap || settings.lists ? 'HTML' : 'Текст';
    }

    generateWords(count, settings) {
        let words = this.getWordPool(settings.language, count);

        if (settings.classicStart && count >= 5) {
            const classicWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
            const remaining = words.slice(0, count - classicWords.length);
            words = classicWords.concat(remaining);
        }

        const result = words.slice(0, count).join(' ');
        return this.wrapHtml(result, settings);
    }

    generateSentences(count, settings) {
        const sentences = [];

        for (let i = 0; i < count; i++) {
            if (i === 0 && settings.classicStart) {
                sentences.push(this.CLASSIC_LOREM);
            } else {
                sentences.push(this.generateSentence(settings));
            }
        }

        const result = sentences.join('. ');
        return this.wrapHtml(result, settings);
    }

    generateParagraphs(count, settings) {
        const paragraphs = [];
        
        for (let i = 0; i < count; i++) {
            let paragraph;
            
            if (i === 0 && settings.classicStart) {
                paragraph = this.CLASSIC_LOREM + ' ' + this.generateParagraphContent(settings);
            } else {
                paragraph = this.generateParagraphContent(settings);
            }
            
            paragraphs.push(paragraph);
        }
        
        return this.wrapHtml(paragraphs.join('\n\n'), settings);
    }

    generateSentence(settings) {
        const wordCount = settings.sentenceLength;
        const words = this.getWordPool(settings.language, wordCount);
        let sentence = words.slice(0, wordCount).join(' ');
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        return sentence;
    }

    generateParagraphContent(settings) {
        const sentenceCount = Math.floor(Math.random() * 4) + 3;
        const sentences = [];
        
        for (let i = 0; i < sentenceCount; i++) {
            sentences.push(this.generateSentence(settings));
        }
        
        return sentences.join('. ');
    }

    getWordPool(language, neededCount) {
        let pool;
        
        switch (language) {
            case 'latin':
                pool = [...this.LATIN_WORDS];
                break;
            case 'cyrillic':
                pool = [...this.CYRILLIC_WORDS];
                break;
            case 'mixed':
            default:
                pool = [...this.LATIN_WORDS, ...this.CYRILLIC_WORDS];
                break;
        }
        
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        
        while (pool.length < neededCount) {
            pool = pool.concat(pool);
        }
        
        return pool;
    }

    wrapHtml(text, settings) {
        if (!settings.htmlWrap && !settings.lists) {
            return text;
        }
        
        const paragraphs = text.split('\n\n');
        
        if (settings.lists) {
            const items = paragraphs.slice(0, 10).map(p => `<li>${p.trim()}</li>`);
            return `<ul>\n${items.join('\n')}\n</ul>`;
        }
        
        // HTML-обертка (параграфы)
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('\n');
    }

    updateStats(text) {
        const cleanText = text.replace(/<[^>]*>/g, '').trim();
        const words = cleanText.split(/\s+/).filter(word => word.length > 0);
        const chars = cleanText.length;
        
        this.elements.stats.textContent = `${chars} символов | ${words.length} слов`;
    }

    clearResult() {
        this.elements.result.value = '';
        this.elements.stats.textContent = '0 символов | 0 слов';
        this.elements.previewMode.textContent = 'Предпросмотр';
    }

    async copyToClipboard() {
        const text = this.elements.result.value;
        if (!text) return;
        
        try {
            await navigator.clipboard.writeText(text);
            this.showCopySuccess();
        } catch (err) {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    showCopySuccess() {
        const success = this.elements.copySuccess;
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 2000);
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            this.showCopySuccess();
        } catch (err) {
            console.error('Fallback: Oops, unable to copy');
        }
        document.body.removeChild(textArea);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new LoremGenerator();
});
