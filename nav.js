(function () {
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.classList.toggle('nav-hamburger-active', isOpen);
  });

  // Close menu when a link is tapped
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('nav-hamburger-active');
    });
  });
})();
