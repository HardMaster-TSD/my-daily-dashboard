/**
 * Custom Scrollbar v1.0
 * Works on iOS Safari and all browsers
 * 细长圆角滚动条
 */
(function () {
  const CSS = `
    .cs-wrap {
      position: fixed;
      top: 50%;
      right: 6px;
      width: 10px;
      height: 100px;
      transform: translateY(-50%);
      z-index: 9999;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.3s;
    }
    .cs-track {
      position: absolute;
      left: 0;
      top: 0;
      width: 10px;
      height: 100%;
      background: rgba(128,128,128,0.15);
      border-radius: 5px;
    }
    .cs-thumb {
      position: absolute;
      left: 0;
      width: 10px;
      border-radius: 5px;
      background: linear-gradient(180deg, rgba(160,160,160,0.6), rgba(120,120,120,0.5));
      cursor: pointer;
      pointer-events: all;
      transition: background 0.2s, transform 0.1s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .cs-thumb:hover,
    .cs-thumb.dragging {
      background: linear-gradient(180deg, rgba(180,180,180,0.7), rgba(140,140,140,0.6));
      transform: scale(1.1);
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
      const thumbHeight = Math.max(30, 100 * ratio);
      const trackHeight = 100;
      const maxTop = trackHeight - thumbHeight;

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
