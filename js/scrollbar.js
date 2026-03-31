/**
 * Minimal Pill Scrollbar v2.0
 * Inspired by macOS/iOS design language
 * Clean, subtle, native-feeling
 */
(function () {
  const CSS = `
    .mp-wrap {
      position: fixed;
      top: 50%;
      right: 6px;
      transform: translateY(-50%);
      width: 8px;
      height: 70px;
      z-index: 9999;
      pointer-events: none;
    }
    .mp-track {
      position: absolute;
      left: 0;
      top: 0;
      width: 8px;
      height: 100%;
      background: rgba(128, 128, 128, 0.15);
      border-radius: 4px;
    }
    .mp-thumb {
      position: absolute;
      left: 0;
      width: 8px;
      border-radius: 4px;
      background: rgba(100, 100, 100, 0.5);
      cursor: pointer;
      pointer-events: all;
      transition: background 0.2s, transform 0.15s;
    }
    .mp-thumb:hover,
    .mp-thumb.dragging {
      background: rgba(80, 80, 80, 0.7);
      transform: scaleX(1.2);
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
      const scrollRatio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      const trackHeight = 70;
      const thumbHeight = 25;
      const maxTop = trackHeight - thumbHeight;

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
