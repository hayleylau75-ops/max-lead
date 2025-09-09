document.addEventListener('DOMContentLoaded', function () {
    // 处理折叠功能
    function initCollapsible() {
        const collapsibleButtons = document.querySelectorAll('[data-action="toggle-collapsible"]');

        collapsibleButtons.forEach(button => {
            button.addEventListener('click', function () {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                const targetId = this.getAttribute('aria-controls');
                const target = document.getElementById(targetId);

                // 如果需要关闭其他项
                if (this.dataset.closeSiblings === 'true') {
                    const parentElement = this.closest('.card');
                    if (parentElement) {
                        const siblings = parentElement.querySelectorAll('[data-action="toggle-collapsible"]');
                        siblings.forEach(sibling => {
                            if (sibling !== this) {
                                sibling.setAttribute('aria-expanded', 'false');
                                // 显示竖线
                                const vLine = sibling.querySelector('.disclosure__toggle .icon .v-line');
                                if (vLine) {
                                    vLine.style.opacity = '1';
                                }
                                const siblingTargetId = sibling.getAttribute('aria-controls');
                                const siblingTarget = document.getElementById(siblingTargetId);
                                if (siblingTarget) {
                                    siblingTarget.style.height = '0';
                                }
                            }
                        });
                    }
                }

                // 切换当前项
                if (expanded) {
                    this.setAttribute('aria-expanded', 'false');
                    // 显示竖线
                    const vLine = this.querySelector('.disclosure__toggle .icon .v-line');
                    if (vLine) {
                        vLine.style.opacity = '1';
                    }
                    target.style.height = '0';
                } else {
                    this.setAttribute('aria-expanded', 'true');
                    // 隐藏竖线
                    const vLine = this.querySelector('.disclosure__toggle .icon .v-line');
                    if (vLine) {
                        vLine.style.opacity = '0';
                    }
                    const content = target.querySelector('.card__collapsible-content');
                    if (content) {
                        target.style.height = content.offsetHeight + 'px';
                    } else {
                        target.style.height = 'auto';
                    }
                }
            });
        });

        // 初始化高度
        collapsibleButtons.forEach(button => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            const targetId = button.getAttribute('aria-controls');
            const target = document.getElementById(targetId);

            if (!expanded && target) {
                target.style.height = '0';
                // 确保竖线显示
                const vLine = button.querySelector('.disclosure__toggle .icon .v-line');
                if (vLine) {
                    vLine.style.opacity = '1';
                }
            } else if (expanded && target) {
                // 确保竖线隐藏
                const vLine = button.querySelector('.disclosure__toggle .icon .v-line');
                if (vLine) {
                    vLine.style.opacity = '0';
                }
                const content = target.querySelector('.card__collapsible-content');
                if (content) {
                    // 延迟设置高度，确保内容已经渲染
                    setTimeout(() => {
                        target.style.height = content.offsetHeight + 'px';
                    }, 10);
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

    // 监听动态内容变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                initCollapsible();
                initVideoPlayer();
            }
        });
    });

    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 监听窗口大小变化，重新计算高度
    window.addEventListener('resize', () => {
        const expandedButtons = document.querySelectorAll('[data-action="toggle-collapsible"][aria-expanded="true"]');
        expandedButtons.forEach(button => {
            const targetId = button.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            if (target) {
                const content = target.querySelector('.card__collapsible-content');
                if (content) {
                    target.style.height = content.offsetHeight + 'px';
                }
            }
        });
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