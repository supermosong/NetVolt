/* =============================================================
   nav.js
   Purpose: Two jobs —
   1. Mobile hamburger: toggle the mobile menu open/closed.
   2. Active link: add the .active class to whichever nav link
      matches the current page URL so it gets highlighted.
   ============================================================= */

/* Run everything after the HTML has fully loaded */
document.addEventListener('DOMContentLoaded', function () {

  /* -----------------------------------------------------------
     JOB 1 — MOBILE HAMBURGER MENU
     The button (#nav-hamburger) toggles the drawer
     (#nav-mobile-menu) open and closed.
  ----------------------------------------------------------- */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (hamburger && mobileMenu) {

    hamburger.addEventListener('click', function () {
      /* Check if the menu is currently open */
      const isOpen = mobileMenu.classList.contains('is-open');

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    /* Close the menu if the user clicks outside of it */
    document.addEventListener('click', function (event) {
      const clickedInsideNav = hamburger.contains(event.target) ||
                               mobileMenu.contains(event.target);
      if (!clickedInsideNav && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });

    /* Close the menu if the user presses Escape (accessibility) */
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
        hamburger.focus(); /* return focus to the button that opened it */
      }
    });

    /* Close menu when a link inside it is clicked (user navigated) */
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.add('is-open');
    /* aria-expanded tells screen readers the menu is now open */
    hamburger.setAttribute('aria-expanded', 'true');
    /* Prevent the page behind from scrolling while menu is open */
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* -----------------------------------------------------------
     JOB 2 — ACTIVE LINK HIGHLIGHTING
     Compare each nav link's href to the current page path.
     Add .active to the one that matches.
  ----------------------------------------------------------- */

  /* Get the current page path, e.g. "/pages/it-basics.html" */
  const currentPath = window.location.pathname;

  /* Grab all nav links in both the desktop nav and mobile menu */
  const allNavLinks = document.querySelectorAll(
    '.nav-links a, .nav-mobile-menu a'
  );

  allNavLinks.forEach(function (link) {
    /* Get just the path portion of the link's href */
    const linkPath = new URL(link.href, window.location.origin).pathname;

    /* Special case: if we're at the root ("/") or "/index.html",
       only highlight the Home link */
    const isHome = currentPath === '/' || currentPath.endsWith('index.html');
    const linkIsHome = linkPath === '/' || linkPath.endsWith('index.html');

    if (isHome && linkIsHome) {
      link.classList.add('active');
    } else if (!isHome && linkPath !== '/' && !linkPath.endsWith('index.html')) {
      /* For topic pages, check if the paths match */
      if (currentPath.endsWith(linkPath) || linkPath.endsWith(currentPath)) {
        link.classList.add('active');
      }
    }
  });

});
