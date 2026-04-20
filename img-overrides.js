// Apply any admin-uploaded image overrides stored in localStorage
(function() {
  const MAP = {
    'img_theSPACEphoto':    'theSPACEphoto.png',
    'img_sweetmondays':     'sweetmondays.png',
    'img_meettheowner':     'meettheowner.png',
    'img_makeyourevent':    'makeyourevent.png',
    'img_includedinrental': 'includedinrental.png',
    'img_beveragedropoff':  'beveragedropoff.jpg',
    'img_logo':             'logo.PNG',
  };
  Object.entries(MAP).forEach(([key, filename]) => {
    const stored = localStorage.getItem(key);
    if (!stored) return;
    document.querySelectorAll(`img[src="${filename}"]`).forEach(img => {
      img.src = stored;
    });
  });
})();
