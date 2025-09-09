class JotformPopup {
    constructor() {
        this.modal = document.getElementById('jotform-popup');
        this.iframe = document.getElementById('jotform-iframe');
        this.closeBtn = document.querySelector('.jotform-close');
        this.formUrl = 'https://form.jotform.com/251882013449458';

        this.init();
    }

    init() {
        // 初始化所有带有jotform-trigger类的按钮
        document.querySelectorAll('.jotform-trigger').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal();
            });
        });

        // 关闭按钮事件
        this.closeBtn.addEventListener('click', () => this.closeModal());

        // 点击modal背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.iframe.src = this.formUrl;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.iframe.src = '';
        document.body.style.overflow = ''; // 恢复背景滚动
    }
}

// 当DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new JotformPopup();
}); 