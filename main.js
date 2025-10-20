document.addEventListener('DOMContentLoaded', function() {

    
  
  
  // 푸터 연도를 자동으로 업데이트하는 함수
    document.getElementById('y').textContent = new Date().getFullYear();

    // 헤더의 동작을 관리하는 통합 함수 (모든 페이지 공통)
    (function () {
      const header = document.querySelector('.site-header');
      const panel = document.querySelector('#menuPanel');
      if (!header || !panel) return;

      const btn = header.querySelector('.menu-toggle');
      const items = header.querySelectorAll('.mitem[data-col]');

      // 메뉴 패널 열고 닫기
      const togglePanel = () => {
        const open = header.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
      };
      btn?.addEventListener('click', togglePanel);

      // ESC 키로 메뉴 닫기
      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          header.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          panel.setAttribute('aria-hidden', 'true');
          btn.focus();
        }
      });

      // 메뉴 항목 클릭 시 메뉴 닫기
      panel.addEventListener('click', (e) => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        header.classList.remove('open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      });

      // 드롭다운 메뉴 활성화 및 위치 조정 (데스크톱)
      const grid = panel.querySelector('.panel-grid');
      if (grid) {
        const styles = getComputedStyle(document.documentElement);
        const PAD_TOP = parseInt(styles.getPropertyValue('--panel-pad-top')) || 18;
        const PAD_BOTTOM = parseInt(styles.getPropertyValue('--panel-pad-bottom')) || 22;
        const COL_W = parseInt(styles.getPropertyValue('--col-w')) || 240;

        const setOpenHeight = (key) => {
          const col = panel.querySelector(`.col[data-key="${key}"]`);
          if (!col) return;
          const h = col.scrollHeight + PAD_TOP + PAD_BOTTOM;
          panel.style.setProperty('--open-h', h + 'px');
        };

        const positionUnder = (li) => {
          const cLeft = grid.getBoundingClientRect().left + window.scrollX;
          const r = li.getBoundingClientRect();
          const center = r.left + (r.width / 2) + window.scrollX - cLeft;
          const left = Math.max(0, Math.round(center - (COL_W / 2)));
          panel.style.setProperty('--submenu-left', left + 'px');
        };

        const activate = (li) => {
          const key = li.dataset.col;
          if (!key) return;
          panel.setAttribute('data-col', key);
          positionUnder(li);
          setOpenHeight(key);
        };

        items.forEach(li => {
          li.addEventListener('mouseenter', () => {
            header.classList.add('open');
            activate(li);
          });
          li.addEventListener('focusin', () => {
            header.classList.add('open');
            activate(li);
          });
          li.querySelector('a')?.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('href') || '';
            header.classList.remove('open');
            panel.setAttribute('aria-hidden', 'true');
            if (href.startsWith('#')) {
              e.preventDefault();
              document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });

        header.addEventListener('mouseleave', () => {
          header.classList.remove('open');
          panel.setAttribute('data-col', '1');
        });

        if (items[0]) activate(items[0]);

        let resizeTimer;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            const activeKey = panel.getAttribute('data-col') || '1';
            const li = header.querySelector(`.mitem[data-col="${activeKey}"]`) || items[0];
            if (li) activate(li);
          }, 80);
        });

        // 메가메뉴 기능
        const menuToggleBtn = header.querySelector('.menu-toggle');
        header.addEventListener('mouseenter', () => header.classList.add('mega', 'open'));
        header.addEventListener('mouseleave', () => header.classList.remove('mega', 'open'));
        menuToggleBtn?.addEventListener('click', () => {
          const open = header.classList.toggle('open');
          header.classList.toggle('mega', open);
        });
      }
    })();

    // team.html 페이지 전용: 스크롤에 따라 헤더 스타일 변경
     const teamHeader = document.querySelector('.team-page .site-header');
    if (teamHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                teamHeader.classList.add('scrolled');
            } else {
                teamHeader.classList.remove('scrolled');
            }
        });
    }

 // 히어로(영상/배경) 높이를 기준으로 헤더 상태 전환 (hero-page 전용)
if (document.body.classList.contains('hero-page')) {
  const header = document.querySelector('.site-header');
  // 다양한 히어로 섹션을 모두 지원
  const heroSection = document.querySelector('.hero-video, .team-hero, .hero-hero');

  if (header && heroSection) {
    const getHeroHeight = () => heroSection.offsetHeight || 0;

    const onScroll = () => {
      const heroH = getHeroHeight();

      // 1) 살짝만 내려도 배경=흰색, 텍스트/로고 전환
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // 2) 히어로 구간을 지나쳤을 때 보조 클래스(옵션)
      if (window.scrollY > heroH - header.offsetHeight) {
        header.classList.add('scrolled-past-hero');
      } else {
        header.classList.remove('scrolled-past-hero');
      }
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll(); // 초기 1회 실행
  }
}


    // 포트폴리오 호버 카드 동작 IIFE
    (function () {
      const card = document.getElementById('partnerCard');
      if (!card) return;
      const stage = document.getElementById('pcStage');
      const title = document.getElementById('pcTitle');
      const sector = document.getElementById('pcSector');
      const sub = document.getElementById('pcSub');
      const desc = document.getElementById('pcDesc');

      function show(el) {
        const r = el.getBoundingClientRect();
        card.style.left = (r.left + r.width / 2) + 'px';
        card.style.top = (r.top - 10 + window.scrollY) + 'px';
        stage.textContent = el.dataset.stage || '';
        title.textContent = el.dataset.title || '';
        sector.textContent = el.dataset.sector || '';
        sub.textContent = el.dataset.subtitle || '';
        desc.textContent = el.dataset.desc || '';
        card.classList.add('show');
      }

      function hide() {
        card.classList.remove('show');
      }

      document.querySelectorAll('.partner').forEach(el => {
        el.addEventListener('mouseenter', () => show(el));
        el.addEventListener('mouseleave', hide);
        el.addEventListener('focusin', () => show(el));
        el.addEventListener('focusout', hide);
      });
    })();

    // 임시 폼 전송 알림
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('폼 예시입니다. 실제 전송 기능은 다음 단계에서 구현합니다.');
    });

    // 포트폴리오 슬라이더 IIFE
    (function () {
      const viewport = document.querySelector('.pf-viewport');
      const track = viewport?.querySelector('.pf-track');
      const prevBtn = document.querySelector('.pf-prev');
      const nextBtn = document.querySelector('.pf-next');
      const dotsWrap = document.querySelector('.pf-dots');

      if (!viewport || !track || !prevBtn || !nextBtn || !dotsWrap) return;

      const PER_PAGE = 3;
      const cards = Array.from(track.querySelectorAll('.pf-card'));

      if (!cards.length) return;

      if (!track.querySelector('.pf-page')) {
        for (let i = 0; i < cards.length; i += PER_PAGE) {
          const page = document.createElement('div');
          page.className = 'pf-page';
          cards.slice(i, i + PER_PAGE).forEach(card => page.appendChild(card));
          track.appendChild(page);
        }
      }

      const pages = Array.from(track.querySelectorAll('.pf-page'));
      let index = 0;

      const buildDots = () => {
        dotsWrap.innerHTML = '';
        pages.forEach((_, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', `${i + 1} 페이지로 이동`);
          b.addEventListener('click', () => go(i));
          dotsWrap.appendChild(b);
        });
      };

      const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
        Array.from(dotsWrap.children).forEach((dot, i) => {
          dot.classList.toggle('on', i === index);
        });
        prevBtn.disabled = (index === 0);
        nextBtn.disabled = (index === pages.length - 1);
      };

      const go = (i) => {
        index = Math.max(0, Math.min(pages.length - 1, i));
        update();
      };

      prevBtn.addEventListener('click', () => go(index - 1));
      nextBtn.addEventListener('click', () => go(index + 1));

      buildDots();
      update();

      track.setAttribute('tabindex', '0');
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') go(index - 1);
        if (e.key === 'ArrowRight') go(index + 1);
      });
    })();
});




/*BUSINESS PAGE START */



// ===== Business Page Hero Animation Trigger =====
document.addEventListener('DOMContentLoaded', function() {
    // business-page 클래스가 있는 페이지에서만 실행
    if (document.body.classList.contains('business-page')) {
        // 짧은 지연 후 loaded 클래스를 추가하여 애니메이션 시작
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
});








// ===== Index Page Hero Text Animation Trigger =====
document.addEventListener('DOMContentLoaded', function() {
    // hero-video 클래스가 있는 페이지에서만 실행
    if (document.querySelector('.hero-video')) {
        // 짧은 지연 후 loaded 클래스를 body에 추가하여 애니메이션 시작
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    }
});





// ===== 최종 모달 스크립트 (다중 페이지, 자동 열림) =====

document.addEventListener('DOMContentLoaded', function () {
    // 필요한 모든 HTML 요소를 변수로 지정
    const overlay = document.getElementById('kdpModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeTodayBtn = document.getElementById('closeTodayBtn');

    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageNumEl = document.getElementById('currentPageNum');
    const totalPagesNumEl = document.getElementById('totalPagesNum');
    const pages = document.querySelectorAll('.kdp-page');

    if (!overlay || pages.length === 0) return;

    let currentPage = 0;
    const totalPages = pages.length;

    function updatePage(pageIndex) {
        pages.forEach(page => page.classList.remove('active'));
        pages[pageIndex].classList.add('active');
        if (currentPageNumEl) currentPageNumEl.textContent = pageIndex + 1;
        if (prevPageBtn) prevPageBtn.disabled = pageIndex === 0;
        if (nextPageBtn) nextPageBtn.disabled = pageIndex === totalPages - 1;
    }
    
    function openModal() {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        updatePage(currentPage);
    }

    function closeModal() {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    function closeForToday() {
        const expiryDate = new Date();
        expiryDate.setHours(23, 59, 59, 999);
        document.cookie = `hideKdpModal=true; expires=${expiryDate.toUTCString()}; path=/`;
        closeModal();
    }

    // 페이지 로드 시 쿠키를 확인하여 모달을 자동으로 엽니다.
    if (!document.cookie.includes('hideKdpModal=true')) {
        openModal(); 
    }

    // 클릭 이벤트 설정
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (closeTodayBtn) closeTodayBtn.addEventListener('click', closeForToday);
    
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) closeModal();
    });

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updatePage(currentPage);
            }
        });
    }
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                updatePage(currentPage);
            }
        });
    }
    
    if (totalPagesNumEl) totalPagesNumEl.textContent = totalPages;
    updatePage(0);
});
+




// ===== INDEX HERO COMPANY KPIs: in-view 시 숫자 카운트   START =====
// ===== INDEX HERO COMPANY KPIs: in-view 시 숫자 카운트   START =====
// ===== INDEX HERO COMPANY KPIs: in-view 시 숫자 카운트 +  START =====

// ===== KPI Count-up (text only) =====
(function(){
  const wrap = document.querySelector('.c1 .kdp-kpis');
  if (!wrap) return;

  const nums = wrap.querySelectorAll('.kpi-num');
  if (!nums.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el){
    const target = Number(el.getAttribute('data-target') || el.textContent.replace(/[^\d]/g,'')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) { el.textContent = target.toLocaleString() + suffix; return; }

    // 크기에 따라 살짝 가변 (최소 900ms ~ 최대 1600ms)
    const dur = Math.min(1600, Math.max(900, target * 0.3 + 900));
    const start = performance.now();
    const from = 0;

    function tick(now){
      const t = Math.min(1, (now - start) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(from + (target - from) * eased);
      el.textContent = val.toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // 보일 때 1회만 실행
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting){
        nums.forEach(n => countUp(n));
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });

  io.observe(wrap);
})();

// ===== INDEX HERO COMPANY KPIs: in-view 시 숫자 카운트 END =====
// ===== INDEX HERO COMPANY KPIs: in-view 시 숫자 카운트 END =====
// ===== INDEX HERO COMPANY KPIs: in-view 시 숫자 카운트 END =====





// company hero animation trigger
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.kdp-hero.hero-anim')) {
    setTimeout(() => document.body.classList.add('loaded'), 120);
  }
});
