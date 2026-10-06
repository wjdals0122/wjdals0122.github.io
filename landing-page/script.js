// 당근밭 노즈워크 랜딩: FAQ 토글, 앵커 이동, 등장 효과, 이미지 대체
(function () {
  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2) FAQ 아코디언: 항목별 독립 토글, 열 때 답변 이미지 지연 로딩
  function setFaq(button, open) {
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) {
      panel.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
    }
  }
  document.querySelectorAll('.faq-q').forEach(function (button) {
    button.addEventListener('click', function () {
      setFaq(button, button.getAttribute('aria-expanded') !== 'true');
    });
  });

  // 구조 카드의 "FAQ에서 확인" 링크는 Q2를 열고 이동
  document.querySelectorAll('[data-faq-open]').forEach(function (link) {
    link.addEventListener('click', function () {
      var item = document.getElementById(link.getAttribute('data-faq-open'));
      if (item) setFaq(item.querySelector('.faq-q'), true);
    });
  });

  // 3) 앵커 이동: CSS scroll-padding으로 헤더 높이만큼 띄우고, 감속 설정 시 즉시 이동
  document.querySelectorAll('a[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  // 4) 상품 사진이 없으면 '이미지 준비 중' 상자로 교체
  function toFallback(img) {
    var box = document.createElement('div');
    box.className = 'img-fallback';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', '이미지 준비 중');
    box.textContent = '이미지 준비 중';
    img.replaceWith(box);
  }
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () { toFallback(img); });
  });

  // 5) 스크롤 등장: IntersectionObserver만 사용
  var items = document.querySelectorAll('.reveal');
  document.querySelectorAll('.hero .reveal').forEach(function (el, i) { el.style.setProperty('--i', i); });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
