// ── The Community Room — AI Chat Agent ──
(function () {

  // ── KNOWLEDGE BASE ──
  const KB = [
    {
      match: /hours|open|close|when|schedule/i,
      answer: "Our hours vary by event and booking. Check the Events page for upcoming public events, or reach out directly to ask about open studio hours!"
    },
    {
      match: /location|address|where|find us|directions/i,
      answer: "We're based in Providence, RI. Exact address details are shared when you book. Feel free to reach out for directions!"
    },
    {
      match: /book|reserve|booking|reservation|rent|rental/i,
      answer: "You can book the studio, café space, or event space right here on our site! Head to the <a href='book.html'>Book an Event</a> page, pick an available date, and fill out the form. We'll be in touch within 24 hours."
    },
    {
      match: /price|cost|pricing|how much|fee|rate/i,
      answer: "Pricing is customized based on your event type, guest count, and services needed. Fill out a booking request on our <a href='book.html'>Book an Event</a> page and we'll put together a quote for you!"
    },
    {
      match: /sweet monday|matcha|coffee|espresso|latte|drink|beverage|café|cafe/i,
      answer: "Sweet Mondays is our in-house café concept serving ceremonial grade matcha, handcrafted espresso drinks, cold brew, and seasonal specialties. It's available daily in the studio and can also be booked for your private event as a mobile cart service!"
    },
    {
      match: /cart|mobile cart|mobile service|offsite|off-site/i,
      answer: "Our mobile cart can come to you! Sweet Mondays offers off-site cart service for private and corporate events. Check out our <a href='cart-services.html'>Cart Services</a> page for details, or book through the <a href='book.html'>Book an Event</a> page."
    },
    {
      match: /event type|birthday|corporate|wedding|bridal|shower|workshop|yoga|pilates|wellness|pop.?up|market|brand|content shoot/i,
      answer: "We host all kinds of events — birthday parties, corporate gatherings, brand activations, content shoots, wellness events, pop-ups, workshops, and more. If you can dream it, we can probably make it happen here!"
    },
    {
      match: /capacity|guest|how many|people|attendees/i,
      answer: "Our space can accommodate a range of group sizes. When you fill out a booking request, include your estimated guest count and we'll confirm whether it's a fit!"
    },
    {
      match: /cancel|refund|policy|policies/i,
      answer: "Our cancellation and refund policy is discussed during the booking process. Reach out to us directly and we'll walk you through everything."
    },
    {
      match: /collab|partner|partnership|brand partnership|sponsor/i,
      answer: "We love collaborating! Whether it's a brand partnership, studio collab, or creative project — head to our <a href='about.html'>About</a> page and use the Book an Event button to start a conversation."
    },
    {
      match: /event|upcoming|what'?s? on|happening/i,
      answer: "Check out our <a href='events.html'>Events page</a> to see what's coming up! We regularly host community events, markets, music nights, and more — all are welcome."
    },
    {
      match: /studio|space|room|facility|amenities/i,
      answer: "The Community Room is a flexible, design-forward studio with café-style seating, lounge areas, and an event-ready layout. It's built to adapt — whether you're hosting 10 people or filling the room."
    },
    {
      match: /contact|email|reach|get in touch|phone|call/i,
      answer: "You can reach us through the booking form on the <a href='book.html'>Book an Event</a> page, or send us a message via email using the icon in the footer. We typically respond within 24 hours!"
    },
    {
      match: /instagram|social|follow|ig/i,
      answer: "Follow us on Instagram for updates, events, and behind-the-scenes content! You can find the link in the footer of any page."
    },
    {
      match: /parking|transit|bus|train|public/i,
      answer: "Parking and transit info is shared when you confirm your booking. Feel free to ask us directly and we'll help you out!"
    },
    {
      match: /hi|hello|hey|what'?s? up|sup|good morning|good afternoon|good evening/i,
      answer: "Hey! 👋 Welcome to The Community Room. I'm here to help — ask me anything about our space, events, bookings, or café services!"
    },
    {
      match: /thank|thanks|appreciate|helpful/i,
      answer: "Of course! Let us know if there's anything else we can help with. We'd love to see you at The Community Room! 🖤"
    },
    {
      match: /who are you|what are you|ai|bot|robot|chatbot|human/i,
      answer: "I'm a virtual assistant for The Community Room! I can answer questions about our space, events, café, and bookings. For anything specific, you can always reach out to us directly."
    },
  ];

  const FALLBACK = "Great question! I don't have that answer on hand, but you can reach out to us directly through the <a href='book.html'>booking form</a> or the email in the footer — we're happy to help!";

  function getAnswer(msg) {
    const m = msg.trim();
    for (const entry of KB) {
      if (entry.match.test(m)) return entry.answer;
    }
    return FALLBACK;
  }

  // ── BUILD UI ──
  const style = document.createElement('style');
  style.textContent = `
    #cr-chat-bubble {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #000;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      z-index: 9000;
      transition: transform 0.2s;
    }
    #cr-chat-bubble:hover { transform: scale(1.08); }
    #cr-chat-bubble svg { display: block; }

    #cr-chat-window {
      position: fixed;
      bottom: 92px;
      right: 28px;
      width: 340px;
      max-height: 500px;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      z-index: 9000;
      overflow: hidden;
      font-family: 'Inter', Helvetica, Arial, sans-serif;
      opacity: 0;
      transform: translateY(12px);
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
    }
    #cr-chat-window.cr-open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }

    #cr-chat-header {
      background: #000;
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    #cr-chat-header-info { display: flex; align-items: center; gap: 10px; }
    #cr-chat-avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
    }
    #cr-chat-title { font-size: 14px; font-weight: 600; }
    #cr-chat-subtitle { font-size: 11px; color: rgba(255,255,255,0.5); }
    #cr-chat-close {
      background: none; border: none; color: rgba(255,255,255,0.6);
      cursor: pointer; font-size: 18px; line-height: 1; padding: 0;
    }
    #cr-chat-close:hover { color: #fff; }

    #cr-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
    }

    .cr-msg {
      max-width: 82%;
      padding: 9px 13px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.5;
    }
    .cr-msg a { color: #3374ff; }
    .cr-msg-bot {
      background: #f2f2f2;
      color: #111;
      align-self: flex-start;
      border-bottom-left-radius: 3px;
    }
    .cr-msg-user {
      background: #000;
      color: #fff;
      align-self: flex-end;
      border-bottom-right-radius: 3px;
    }

    .cr-typing {
      display: flex; gap: 4px; padding: 10px 13px;
      background: #f2f2f2; border-radius: 12px; border-bottom-left-radius: 3px;
      align-self: flex-start;
    }
    .cr-typing span {
      width: 6px; height: 6px; border-radius: 50%; background: #aaa;
      animation: cr-bounce 1.2s infinite;
    }
    .cr-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cr-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cr-bounce {
      0%,60%,100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    #cr-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid #eee;
      flex-shrink: 0;
    }
    #cr-chat-input {
      flex: 1;
      border: 1.5px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px 12px;
      font-family: 'Inter', Helvetica, Arial, sans-serif;
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s;
    }
    #cr-chat-input:focus { border-color: #000; }
    #cr-chat-send {
      background: #000;
      border: none;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    #cr-chat-send:hover { background: #333; }

    .cr-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px;
    }
    .cr-suggestion-btn {
      background: none;
      border: 1.5px solid #e0e0e0;
      border-radius: 999px;
      padding: 5px 12px;
      font-family: 'Inter', Helvetica, Arial, sans-serif;
      font-size: 11px;
      color: #555;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
    }
    .cr-suggestion-btn:hover { border-color: #000; color: #000; }

    @media (max-width: 400px) {
      #cr-chat-window { width: calc(100vw - 32px); right: 16px; bottom: 84px; }
      #cr-chat-bubble { right: 16px; bottom: 16px; }
    }
  `;
  document.head.appendChild(style);

  // Bubble button
  const bubble = document.createElement('button');
  bubble.id = 'cr-chat-bubble';
  bubble.setAttribute('aria-label', 'Open chat');
  bubble.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

  // Chat window
  const win = document.createElement('div');
  win.id = 'cr-chat-window';
  win.innerHTML = `
    <div id="cr-chat-header">
      <div id="cr-chat-header-info">
        <div id="cr-chat-avatar">🖤</div>
        <div>
          <div id="cr-chat-title">The Community Room</div>
          <div id="cr-chat-subtitle">Ask us anything</div>
        </div>
      </div>
      <button id="cr-chat-close" aria-label="Close chat">✕</button>
    </div>
    <div id="cr-chat-messages"></div>
    <div class="cr-suggestions" id="crSuggestions">
      <button class="cr-suggestion-btn">How do I book?</button>
      <button class="cr-suggestion-btn">What's Sweet Mondays?</button>
      <button class="cr-suggestion-btn">Pricing?</button>
      <button class="cr-suggestion-btn">Upcoming events?</button>
    </div>
    <div id="cr-chat-input-row">
      <input id="cr-chat-input" type="text" placeholder="Ask a question…" autocomplete="off" />
      <button id="cr-chat-send" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(win);

  // ── LOGIC ──
  const messages = document.getElementById('cr-chat-messages');
  const input    = document.getElementById('cr-chat-input');

  let opened = false;

  function openChat() {
    win.classList.add('cr-open');
    bubble.setAttribute('aria-label', 'Close chat');
    if (!opened) {
      opened = true;
      addBot("Hi! 👋 I'm here to help with questions about The Community Room — events, bookings, Sweet Mondays, and more. What can I help you with?");
    }
    input.focus();
  }

  function closeChat() {
    win.classList.remove('cr-open');
    bubble.setAttribute('aria-label', 'Open chat');
  }

  bubble.addEventListener('click', () => win.classList.contains('cr-open') ? closeChat() : openChat());
  document.getElementById('cr-chat-close').addEventListener('click', closeChat);

  function addBot(text) {
    const m = document.createElement('div');
    m.className = 'cr-msg cr-msg-bot';
    m.innerHTML = text;
    messages.appendChild(m);
    messages.scrollTop = messages.scrollHeight;
  }

  function addUser(text) {
    const m = document.createElement('div');
    m.className = 'cr-msg cr-msg-user';
    m.textContent = text;
    messages.appendChild(m);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'cr-typing';
    t.id = 'cr-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(t);
    messages.scrollTop = messages.scrollHeight;
    return t;
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    // Hide suggestions after first message
    document.getElementById('crSuggestions').style.display = 'none';
    addUser(text);
    input.value = '';
    const typing = showTyping();
    setTimeout(() => {
      typing.remove();
      addBot(getAnswer(text));
    }, 700 + Math.random() * 400);
  }

  document.getElementById('cr-chat-send').addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  document.querySelectorAll('.cr-suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent));
  });

})();
