// 产品页面粘性效果控制器

function initProductSticky() {
    console.log('ProductSticky: 初始化开始');

    // 只在桌面端和产品页面运行
    if (window.innerWidth <= 768) {
        console.log('ProductSticky: 移动端，跳过');
        return;
    }

    if (!document.querySelector('.product-main')) {
        console.log('ProductSticky: 未找到.product-main，跳过');
        return;
    }

    const productMain = document.querySelector('.product-main');
    const productMedia = document.querySelector('.product-media');
    const productInfo = document.querySelector('.product-info');

    console.log('ProductSticky: 找到元素', {
        productMain: !!productMain,
        productMedia: !!productMedia,
        productInfo: !!productInfo
    });

    // 检查必要元素
    if (!productMain || !productMedia || !productInfo) {
        console.log('ProductSticky: 缺少必要元素，退出');
        return;
    }

    // 计算高度
    const productInfoHeight = productInfo.scrollHeight;
    const productMediaHeight = productMedia.offsetHeight;
    const productMainOffsetTop = productMain.offsetTop;

    console.log('ProductSticky: 高度计算:', {
        productInfoHeight: productInfoHeight,
        productMediaHeight: productMediaHeight,
        productMainOffsetTop: productMainOffsetTop,
        heightDifference: productInfoHeight - productMediaHeight
    });

    // 只有当product-info高度大于product-media高度时才启用
    if (productInfoHeight <= productMediaHeight) {
        console.log('ProductSticky: Product Info高度不大于Product Media高度，退出');
        return;
    }

    // 计算阶段边界
    const stage1End = productMainOffsetTop - 5; // 第一阶段结束：Product Media上边缘到达导航栏下方5px
    const stage2End = productMainOffsetTop + (productInfoHeight - productMediaHeight); // 第二阶段结束：Product Info底部与Product Media底部对齐

    console.log('ProductSticky: 阶段边界:', {
        stage1End: stage1End,
        stage2End: stage2End,
        stage2Duration: stage2End - stage1End // 第二阶段的持续时间
    });

    // 检查并更新状态
    function checkStickyState() {
        const scrollY = window.pageYOffset;

        console.log('ProductSticky: 滚动检查', {
            scrollY: scrollY,
            stage1End: stage1End,
            stage2End: stage2End,
            currentStage: scrollY < stage1End ? 'Stage 1' : scrollY < stage2End ? 'Stage 2' : 'Stage 3'
        });

        // 移除所有状态类
        productMedia.classList.remove('product-media--sticky', 'product-media--released');

        // 确定当前阶段并应用状态
        if (scrollY < stage1End) {
            // 第一阶段：自然滚动
            console.log('ProductSticky: Stage 1 - 自然滚动');
        } else if (scrollY < stage2End) {
            // 第二阶段：粘性固定
            productMedia.classList.add('product-media--sticky');
            console.log('ProductSticky: Stage 2 - 粘性固定');
        } else {
            // 第三阶段：释放固定
            productMedia.classList.add('product-media--released');
            console.log('ProductSticky: Stage 3 - 释放固定');
        }
    }

    // 绑定事件
    window.addEventListener('scroll', checkStickyState, { passive: true });

    // 立即检查一次初始状态
    checkStickyState();

    console.log('ProductSticky: 初始化完成');
}

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductSticky);
} else {
    initProductSticky();
} 