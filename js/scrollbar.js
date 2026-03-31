/**
 * Minimal Pill Scrollbar v2.0
 * Inspired by macOS/iOS design language
 * Clean, subtle, native-feeling
 */
(function () {
  const CSS = `
    .mp-wrap {
      position: fixed;
      top: 0;
      right: 0;
      width: 6px;
      height: 100vh;
      z-index: 9999;
      pointer-events: none;
    }
    .mp-track {
      position: absolute;
      right: 0;
      top: 0;
      width: 6px;
      height: 100%;
      background: transparent;
    }
    .mp-thumb {
      position: absolute;
      right: 0;
      width: 6px;
      border-radius: 3px;
      background: rgba(128, 128, 128, 0.4);
      cursor: pointer;
      pointer-events: all;
      transition: background 0.2s, width 0.2s, right 0.2s;
    }
    .mp-thumb:hover,
    .mp-thumb.dragging {
      background: rgba(128, 128, 128, 0.6);
      width: 8px;
      right: -1px;
    }
    .mp-hidden { opacity: 0 !important; pointer-events: none; }
  `;

  function init() {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const wrap = document.createElement('div');
    wrap.className = 'mp-wrap';
    wrap.innerHTML = '<div class="mp-track"><div class="mp-thumb"></div></div>';
    document.body.appendChild(wrap);

    const thumb = wrap.querySelector('.mp-thumb');
    const doc = document.documentElement;

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    function update() {
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight;
      const clientHeight = doc.clientHeight;
      const ratio = clientHeight / scrollHeight;
      const thumbHeight = Math.max(30, clientHeight * ratio * 0.8);
      const maxTop = clientHeight - thumbHeight;
      const scrollRatio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;

      thumb.style.height = thumbHeight + 'px';
      thumb.style.top = scrollRatio * maxTop + 'px';
      wrap.style.opacity = scrollHeight > clientHeight ? '1' : '0';
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

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
