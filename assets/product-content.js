document.addEventListener('DOMContentLoaded', function () {
    // 防止重复初始化
    let isInitialized = false;

    // 处理折叠功能
    function initCollapsible() {
        if (isInitialized) return;

        const collapsibleButtons = document.querySelectorAll('[data-action="toggle-collapsible"]');

        // 如果没有找到按钮，直接返回
        if (collapsibleButtons.length === 0) return;

        collapsibleButtons.forEach(button => {
            // 移除可能存在的旧事件监听器
            button.removeEventListener('click', handleCollapsibleClick);
            // 添加新的事件监听器
            button.addEventListener('click', handleCollapsibleClick);
        });

        // 初始化高度
        initializeCollapsibleHeights();

        isInitialized = true;
    }

    // 处理点击事件
    function handleCollapsibleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const button = this;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        const targetId = button.getAttribute('aria-controls');
        const target = document.getElementById(targetId);

        if (!target) return;

        // 如果需要关闭其他项
        if (button.dataset.closeSiblings === 'true') {
            const parentElement = button.closest('.card');
            if (parentElement) {
                const siblings = parentElement.querySelectorAll('[data-action="toggle-collapsible"]');
                siblings.forEach(sibling => {
                    if (sibling !== button) {
                        closeCollapsible(sibling);
                    }
                });
            }
        }

        // 切换当前项
        if (expanded) {
            closeCollapsible(button);
        } else {
            openCollapsible(button);
        }
    }

    // 打开手风琴
    function openCollapsible(button) {
        const targetId = button.getAttribute('aria-controls');
        const target = document.getElementById(targetId);
        const content = target.querySelector('.card__collapsible-content');

        if (!target || !content) return;

        button.setAttribute('aria-expanded', 'true');

        // 隐藏竖线
        const vLine = button.querySelector('.disclosure__toggle .icon .v-line');
        if (vLine) {
            vLine.style.opacity = '0';
        }

        // 确保内容可见以计算高度
        target.style.height = 'auto';
        const contentHeight = content.offsetHeight;

        // 设置过渡高度
        target.style.height = '0';
        // 强制重绘
        target.offsetHeight;

        // 设置最终高度
        target.style.height = contentHeight + 'px';

        // 过渡结束后设置为auto
        setTimeout(() => {
            if (target.style.height !== '0') {
                target.style.height = 'auto';
            }
        }, 300);
    }

    // 关闭手风琴
    function closeCollapsible(button) {
        const targetId = button.getAttribute('aria-controls');
        const target = document.getElementById(targetId);
        const content = target.querySelector('.card__collapsible-content');

        if (!target || !content) return;

        button.setAttribute('aria-expanded', 'false');

        // 显示竖线
        const vLine = button.querySelector('.disclosure__toggle .icon .v-line');
        if (vLine) {
            vLine.style.opacity = '1';
        }

        // 获取当前高度
        const currentHeight = content.offsetHeight;
        target.style.height = currentHeight + 'px';

        // 强制重绘
        target.offsetHeight;

        // 设置为0触发过渡
        target.style.height = '0';
    }

    // 初始化高度
    function initializeCollapsibleHeights() {
        const collapsibleButtons = document.querySelectorAll('[data-action="toggle-collapsible"]');

        collapsibleButtons.forEach(button => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            const targetId = button.getAttribute('aria-controls');
            const target = document.getElementById(targetId);

            if (!target) return;

            if (!expanded) {
                target.style.height = '0';
                // 确保竖线显示
                const vLine = button.querySelector('.disclosure__toggle .icon .v-line');
                if (vLine) {
                    vLine.style.opacity = '1';
                }
            } else {
                // 确保竖线隐藏
                const vLine = button.querySelector('.disclosure__toggle .icon .v-line');
                if (vLine) {
                    vLine.style.opacity = '0';
                }
                const content = target.querySelector('.card__collapsible-content');
                if (content) {
                    // 使用更长的延迟确保内容完全渲染
                    setTimeout(() => {
                        const contentHeight = content.offsetHeight;
                        if (contentHeight > 0) {
                            target.style.height = contentHeight + 'px';
                        } else {
                            target.style.height = 'auto';
                        }
                    }, 100);
                } else {
                    target.style.height = 'auto';
                }
            }
        });
    }

    // 处理视频播放
    function initVideoPlayer() {
        const videoButtons = document.querySelectorAll('.js-play-video');

        videoButtons.forEach(button => {
            button.addEventListener('click', function () {
                const videoUrl = this.dataset.videoUrl;
                if (!videoUrl) return;

                // 创建模态框
                const modal = document.createElement('div');
                modal.className = 'video-modal';
                modal.innerHTML = `
                    <div class="video-modal__overlay"></div>
                    <div class="video-modal__content">
                        <button class="video-modal__close" aria-label="Close">×</button>
                        <div class="video-modal__iframe-wrapper">
                            <iframe 
                                width="560" 
                                height="315" 
                                src="${videoUrl}"
                                title="Product Video" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                `;

                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    .video-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .video-modal__overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                    }
                    .video-modal__content {
                        position: relative;
                        width: 90%;
                        max-width: 800px;
                        background: #fff;
                        border-radius: 8px;
                        padding: 20px;
                        z-index: 1;
                    }
                    .video-modal__close {
                        position: absolute;
                        top: -40px;
                        right: -40px;
                        width: 30px;
                        height: 30px;
                        border: none;
                        background: none;
                        color: #fff;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .video-modal__iframe-wrapper {
                        position: relative;
                        padding-bottom: 56.25%;
                        height: 0;
                        overflow: hidden;
                    }
                    .video-modal__iframe-wrapper iframe {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                    @media (max-width: 767px) {
                        .video-modal__content {
                            width: 95%;
                            padding: 15px;
                        }
                        .video-modal__close {
                            top: -30px;
                            right: 0;
                        }
                    }
                `;

                document.head.appendChild(style);
                document.body.appendChild(modal);

                // 处理关闭事件
                const closeModal = () => {
                    document.body.removeChild(modal);
                    document.head.removeChild(style);
                };

                modal.querySelector('.video-modal__close').addEventListener('click', closeModal);
                modal.querySelector('.video-modal__overlay').addEventListener('click', closeModal);
            });
        });
    }

    // 初始化
    initCollapsible();
    initVideoPlayer();

    // 监听动态内容变化 - 优化版本
    const observer = new MutationObserver((mutations) => {
        let shouldReinit = false;

        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                // 检查是否添加了手风琴相关元素
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.querySelector && (
                            node.querySelector('[data-action="toggle-collapsible"]') ||
                            node.matches('[data-action="toggle-collapsible"]')
                        )) {
                            shouldReinit = true;
                        }
                    }
                });
            }
        });

        if (shouldReinit) {
            // 重置初始化状态
            isInitialized = false;
            initCollapsible();
            initVideoPlayer();
        }
    });

    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听窗口大小变化，重新计算高度 - 使用防抖
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const expandedButtons = document.querySelectorAll('[data-action="toggle-collapsible"][aria-expanded="true"]');
            expandedButtons.forEach(button => {
                const targetId = button.getAttribute('aria-controls');
                const target = document.getElementById(targetId);
                if (target) {
                    const content = target.querySelector('.card__collapsible-content');
                    if (content) {
                        const newHeight = content.offsetHeight;
                        if (newHeight > 0) {
                            target.style.height = newHeight + 'px';
                        }
                    }
                }
            });
        }, 150);
    });
});

// 视频弹窗功能
document.addEventListener('DOMContentLoaded', function () {
    // 打开视频弹窗
    document.querySelectorAll('.js-open-iframe-pop').forEach(function (button) {
        button.addEventListener('click', function () {
            const iframeUrl = this.getAttribute('data-iframe');
            if (iframeUrl) {
                const iframe = `<iframe width="560" height="315" src="${iframeUrl}" 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin" 
          allowfullscreen></iframe>`;

                document.querySelector('.popshow_bigImg_iframe').innerHTML = iframe;
                document.querySelector('.popshow_bigImg_iframe').style.display = 'block';
                document.querySelector('.popshow_bigImgBox').style.display = 'flex';
                document.body.classList.add('popshow');
                document.documentElement.classList.add('popshow');
            }
        });
    });

    // 关闭视频弹窗
    document.querySelector('.popshow_bigImgBox').addEventListener('click', function (e) {
        if (e.target === this) {
            document.querySelector('.popshow_bigImg_iframe').innerHTML = '';
            document.querySelector('.popshow_bigImg_iframe').style.display = 'none';
            document.querySelector('.popshow_bigImgBox').style.display = 'none';
            document.body.classList.remove('popshow');
            document.documentElement.classList.remove('popshow');
        }
    });
}); 