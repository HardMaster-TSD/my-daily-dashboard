/**
 * Custom Scrollbar v1.0
 * Works on iOS Safari and all browsers
 * 细长圆角滚动条
 */
(function () {
  const CSS = `
    .cs-wrap {
      position: fixed;
      top: 0;
      right: 0;
      width: 6px;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
    }
    .cs-track {
      position: absolute;
      right: 0;
      top: 0;
      width: 6px;
      height: 100%;
      background: rgba(128,128,128,0.08);
      border-radius: 10px;
    }
    .cs-thumb {
      position: absolute;
      right: 0;
      width: 6px;
      border-radius: 10px;
      background: rgba(128,128,128,0.35);
      cursor: pointer;
      pointer-events: all;
      transition: background 0.2s;
    }
    .cs-thumb:hover,
    .cs-thumb.dragging {
      background: rgba(128,128,128,0.55);
    }
    .cs-hidden { opacity: 0 !important; }
  `;

  function init() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Create DOM
    const wrap = document.createElement('div');
    wrap.className = 'cs-wrap';
    wrap.innerHTML = '<div class="cs-track"><div class="cs-thumb"></div></div>';
    document.body.appendChild(wrap);

    const thumb = wrap.querySelector('.cs-thumb');
    const doc = document.documentElement;

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    function update() {
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight;
      const clientHeight = doc.clientHeight;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(40, clientHeight * ratio);
      const maxTop = clientHeight - thumbHeight;

      thumb.style.height = thumbHeight + 'px';
      thumb.style.top = (scrollTop / (scrollHeight - clientHeight)) * maxTop + 'px';

      // Hide if not scrollable
      if (scrollHeight <= clientHeight) {
        wrap.classList.add('cs-hidden');
      } else {
        wrap.classList.remove('cs-hidden');
      }
    }

    // Scroll & resize
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    // Drag thumb
    thumb.addEventListener('mousedown', function (e) {
      isDragging = true;
      startY = e.clientY;
      startScrollTop = doc.scrollTop;
      thumb.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const scrollTop = startScrollTop + deltaY * (doc.scrollHeight / doc.clientHeight);
      doc.scrollTop = Math.max(0, Math.min(scrollTop, doc.scrollHeight - doc.clientHeight));
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      thumb.classList.remove('dragging');
    });

    // Touch drag for iOS
    thumb.addEventListener('touchstart', function (e) {
      isDragging = true;
      startY = e.touches[0].clientY;
      startScrollTop = doc.scrollTop;
      thumb.classList.add('dragging');
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      const deltaY = e.touches[0].clientY - startY;
      const scrollTop = startScrollTop + deltaY * (doc.scrollHeight / doc.clientHeight);
      doc.scrollTop = Math.max(0, Math.min(scrollTop, doc.scrollHeight - doc.clientHeight));
    }, { passive: true });

    document.addEventListener('touchend', function () {
      isDragging = false;
      thumb.classList.remove('dragging');
    });

    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
