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
    'img_collab1':          'collab1.png',
    'img_collab2':          'collab2.png',
    'img_collab3':          'collab3.png',
    'img_collab4':          'collab4.png',
    'img_collab5':          'collab5.png',
  };
  Object.entries(MAP).forEach(([key, filename]) => {
    const stored = localStorage.getItem(key);
    if (!stored) return;
    document.querySelectorAll(`img[src="${filename}"]`).forEach(img => {
      img.src = stored;
    });
  });
})();
