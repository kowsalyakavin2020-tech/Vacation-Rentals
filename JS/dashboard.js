/* ==========================================================================
   STACKLY — VACATION RENTALS
   Role dashboards script  ·  dashboard.js
   Shared by HTML/client.html and HTML/admin.html
   --------------------------------------------------------------------------
   The page declares its role on <html data-dash-role="...">. This script:
     · guards the session (falls back to a demo user when opened directly)
     · renders the sidebar, topbar and role-specific views
     · drives the fullscreen mobile menu, search, logout and toasts
   Icons: Font Awesome only. No SVG, no emoji.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var win = window;
  var root = doc.documentElement;
  var pageRole = root.getAttribute('data-dash-role') || 'client';

  /* ---------------------------------------------------------------- config */
  var USER_KEY = 'stackly_user';

  var DASH = {
    client: 'client.html',
    admin: 'admin.html'
  };

  var DEMO = {
    client: { name: 'Avery Stone', email: 'avery.stone@stackly.com' },
    admin: { name: 'Jordan Blake', email: 'jordan.blake@stackly.com' }
  };

  var ROLE_LABEL = {
    client: 'Client · Villa guest',
    admin: 'Admin · Management'
  };

  var LOGIN_PAGE = 'login.html';
  var HOME_PAGE = '../index.html';

  /* every placeholder action on both dashboards resolves to the 404 page,
     exactly as the reference dashboards behave */
  var DEAD = '404.html';

  /* ------------------------------------------------------------- auth gate */
  function readUser() {
    try { return JSON.parse(win.localStorage.getItem(USER_KEY) || 'null'); }
    catch (e) { return null; }
  }

  var user = readUser();

  if (user && user.role && DASH[user.role] && user.role !== pageRole) {
    win.location.href = DASH[user.role];
    return;
  }
  if (!user) {
    user = { name: DEMO[pageRole].name, email: DEMO[pageRole].email, role: pageRole };
  }

  /* ============================================================== helpers */
  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var PILL = {
    Confirmed: 'ok', Reviewed: 'ok', Delivered: 'ok', Paid: 'ok', Active: 'ok', Complete: 'ok',
    Scheduled: 'ok', Completed: 'ok', Saved: 'ok', Available: 'ok',
    Pending: 'warn', 'In progress': 'warn', 'Low stock': 'warn', 'Awaiting review': 'warn',
    'Due': 'warn', 'Draft': 'warn', 'Partial': 'warn', Reserved: 'warn',
    Cancelled: 'bad', Overdue: 'bad', Refunded: 'bad', 'No-show': 'bad', Referral: 'bad',
    'Out of stock': 'mute', Inactive: 'mute'
  };
  function pill(status) {
    return '<span class="pill pill--' + (PILL[status] || 'mute') + '">' + esc(status) + '</span>';
  }

  function hero(tag, icon, title, sub, action) {
    return '<section class="d-hero">' +
      '<div>' +
        '<p class="d-hero__tag"><i class="fa-solid ' + icon + '" aria-hidden="true"></i>' + esc(tag) + '</p>' +
        '<h3 class="d-hero__title">' + esc(title) + '</h3>' +
        '<p class="d-hero__sub">' + esc(sub) + '</p>' +
      '</div>' +
      (action ? '<a class="d-hero__act" href="' + DEAD + '"><i class="fa-solid ' + action.icon + '" aria-hidden="true"></i>' + esc(action.label) + '</a>' : '') +
    '</section>';
  }

  function stats(key) {
    var items = D.stats[key] || [];
    return '<div class="d-stats">' + items.map(function (it) {
      return '<div class="d-stat">' +
        '<span class="d-stat__ico"><i class="fa-solid ' + it.icon + '" aria-hidden="true"></i></span>' +
        '<div><strong class="d-stat__val">' + esc(it.val) + '</strong><span class="d-stat__lab">' + esc(it.lab) + '</span></div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function panel(title, inner, action) {
    return '<section class="d-panel">' +
      '<div class="d-panel__head"><h3>' + esc(title) + '</h3>' +
        (action ? '<a class="d-panel__act" href="' + DEAD + '">' + esc(action.label) + '</a>' : '') +
      '</div>' + inner + '</section>';
  }

  function grid2(a, b) { return '<div class="d-grid d-grid--2">' + a + b + '</div>'; }
  function grid3(a, b, c) { return '<div class="d-grid d-grid--3">' + a + b + c + '</div>'; }

  function table(headers, rows) {
    return '<div class="d-table-wrap"><table class="d-table"><thead><tr>' +
      headers.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
      '</tr></thead><tbody>' +
      rows.map(function (cells) {
        return '<tr>' + cells.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  function prodCell(img, title, sub) {
    return '<div class="d-prod"><img src="' + esc(img) + '" alt="" />' +
      '<div><strong>' + esc(title) + '</strong><span>' + esc(sub) + '</span></div></div>';
  }

  function imgList(items) {
    return items.map(function (it) {
      return '<div class="d-row"><span class="d-row__ico d-row__ico--img"><img src="' + esc(it.img) + '" alt="" /></span>' +
        '<div><strong>' + esc(it.name) + '</strong><span>' + esc(it.sub) + '</span></div></div>';
    }).join('');
  }

  function feed(items) {
    return items.map(function (it) {
      return '<div class="d-row"><span class="d-row__ico"><i class="fa-solid ' + it.icon + '" aria-hidden="true"></i></span>' +
        '<div><strong>' + esc(it.text) + '</strong><span>' + esc(it.time) + '</span></div></div>';
    }).join('');
  }

  function todos(items) {
    return items.map(function (it) {
      return '<div class="d-todo' + (it.done ? ' is-done' : '') + '">' +
        '<i class="fa-solid ' + (it.done ? 'fa-circle-check' : 'fa-circle') + '" aria-hidden="true"></i>' +
        '<div><strong>' + esc(it.l) + '</strong><span>' + esc(it.s) + '</span></div></div>';
    }).join('');
  }

  function progress(rows) {
    return rows.map(function (r) {
      return '<div class="d-prog"><div class="d-prog__top"><span>' + esc(r.l) + '</span><span>' + r.v + '%</span></div>' +
        '<div class="d-track"><span class="d-fill" data-w="' + r.v + '"></span></div></div>';
    }).join('');
  }

  function chart(rows) {
    var max = rows.reduce(function (a, r) { return Math.max(a, r.v); }, 1);
    return '<div class="d-chart">' + rows.map(function (r) {
      return '<div class="d-chart__col"><span class="d-bar" data-h="' + Math.round(r.v / max * 150) + '"></span><span>' + esc(r.l) + '</span></div>';
    }).join('') + '</div>';
  }

  function quick(items) {
    return '<div class="d-quick">' + items.map(function (it) {
      return '<a href="' + DEAD + '"><i class="fa-solid ' + it.icon + '" aria-hidden="true"></i>' + esc(it.label) + '</a>';
    }).join('') + '</div>';
  }

  function tiles(items) {
    return '<div class="d-tiles">' + items.map(function (it) {
      return '<div class="d-tile"><span class="d-tile__top"><i class="fa-solid ' + it.icon + '" aria-hidden="true"></i>' + esc(it.k) + '</span>' +
        '<strong>' + esc(it.v) + '</strong><span>' + esc(it.n) + '</span></div>';
    }).join('') + '</div>';
  }

  function kv(rows) {
    return '<div class="d-kv">' + rows.map(function (r) {
      return '<div class="d-kv__row"><span>' + esc(r[0]) + '</span><strong>' + esc(r[1]) + '</strong></div>';
    }).join('') + '</div>';
  }

  function timeline(items) {
    return '<div class="d-timeline">' + items.map(function (it) {
      return '<div class="tl' + (it.done ? ' tl--done' : '') + '">' +
        '<span class="tl__dot"><i class="fa-solid ' + it.icon + '" aria-hidden="true"></i></span>' +
        '<div><strong>' + esc(it.l) + '</strong><span>' + esc(it.s) + '</span>' + (it.p ? '<p>' + esc(it.p) + '</p>' : '') + '</div></div>';
    }).join('') + '</div>';
  }

  function steps(items) {
    return '<div class="d-steps">' + items.map(function (it, i) {
      return '<div class="d-step"><span class="d-step__n">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
        '<strong>' + esc(it.l) + '</strong><p>' + esc(it.p) + '</p></div>';
    }).join('') + '</div>';
  }

  function note(text, icon, tone) {
    return '<div class="d-note' + (tone ? ' d-note--' + tone : '') + '">' +
      '<i class="fa-solid ' + (icon || 'fa-circle-info') + '" aria-hidden="true"></i><span>' + esc(text) + '</span></div>';
  }

  function hbars(rows) {
    var max = rows.reduce(function (a, r) { return Math.max(a, r.v); }, 1);
    return '<div class="d-hbars">' + rows.map(function (r) {
      return '<div class="hbar"><div class="hbar__top"><span>' + esc(r.l) + '</span><strong>' + esc(r.s || (r.v + '%')) + '</strong></div>' +
        '<div class="hbar__track"><span class="hbar__fill" data-w="' + Math.round(r.v / max * 100) + '"></span></div></div>';
    }).join('') + '</div>';
  }

  /* ============================================================== menu ==== */
  var MENU = {
    client: [
      { key: 'overview', label: 'Overview', icon: 'fa-gauge-high' },
      { key: 'bookings', label: 'My bookings', icon: 'fa-calendar-check' },
      { key: 'villas', label: 'Saved villas', icon: 'fa-heart' },
      { key: 'experiences', label: 'Experiences', icon: 'fa-compass' },
      { key: 'payments', label: 'Payments', icon: 'fa-file-invoice-dollar' },
      { key: 'messages', label: 'Messages', icon: 'fa-envelope' }
    ],
    admin: [
      { key: 'overview', label: 'Overview', icon: 'fa-gauge-high' },
      { key: 'bookings', label: 'Bookings', icon: 'fa-calendar-check' },
      { key: 'properties', label: 'Villas', icon: 'fa-house' },
      { key: 'guests', label: 'Guests', icon: 'fa-users' },
      { key: 'billing', label: 'Billing', icon: 'fa-file-invoice-dollar' },
      { key: 'messages', label: 'Messages', icon: 'fa-envelope' }
    ]
  };

  /* ============================================================== data ==== */
  var A = '../images/';
  var DATA = {
    /* -------------------------------------------------------------- CLIENT */
    client: {
      stats: {
        overview: [
          { icon: 'fa-calendar-check', val: '2', lab: 'Upcoming stays' },
          { icon: 'fa-moon', val: '14', lab: 'Nights booked' },
          { icon: 'fa-heart', val: '8', lab: 'Saved villas' },
          { icon: 'fa-star', val: 'Gold', lab: 'Loyalty tier' }
        ],
        bookings: [
          { icon: 'fa-calendar-day', val: '2', lab: 'Upcoming stays' },
          { icon: 'fa-circle-check', val: '1', lab: 'Confirmed' },
          { icon: 'fa-hourglass-half', val: '1', lab: 'Awaiting confirm' },
          { icon: 'fa-clock-rotate-left', val: '12', lab: 'Past stays' }
        ],
        villas: [
          { icon: 'fa-heart', val: '8', lab: 'Saved villas' },
          { icon: 'fa-house', val: '62', lab: 'In the collection' },
          { icon: 'fa-location-dot', val: '18', lab: 'Destinations' },
          { icon: 'fa-compass', val: '4', lab: 'New this week' }
        ],
        experiences: [
          { icon: 'fa-utensils', val: '6', lab: 'Chef bookings' },
          { icon: 'fa-ship', val: '3', lab: 'Yacht days' },
          { icon: 'fa-wine-glass-alt', val: '4', lab: 'Wine tours' },
          { icon: 'fa-spa', val: '2', lab: 'Wellness sessions' }
        ],
        payments: [
          { icon: 'fa-file-invoice-dollar', val: '$47,300', lab: 'Paid this year' },
          { icon: 'fa-clock', val: '$16,200', lab: 'Due soon' },
          { icon: 'fa-circle-check', val: '4', lab: 'Invoices settled' },
          { icon: 'fa-rotate-left', val: '$11,400', lab: 'Refunded' }
        ]
      },

      appointments: [
        { time: '12 Mar', name: 'Casa Marevento', img: A + 'r4.webp', type: 'Amalfi Coast · 7 nights', status: 'Confirmed' },
        { time: '28 Apr', name: 'Quinta do Mar', img: A + 'r6.webp', type: 'Algarve · 5 nights', status: 'Confirmed' },
        { time: '06 Jun', name: 'Podere Bellavista', img: A + 'r5.webp', type: 'Tuscany · 6 nights', status: 'Pending' },
        { time: '18 Aug', name: 'Château Lavande', img: A + 'r7.webp', type: 'Provence · 7 nights', status: 'Confirmed' },
        { time: '02 Oct', name: 'Aegean Cliff House', img: A + 'r11.webp', type: 'Santorini · 4 nights', status: 'Pending' },
        { time: '20 Dec', name: 'Chalet Aurora', img: A + 'r34.webp', type: 'Alpine · 5 nights', status: 'Cancelled' }
      ],

      saved: [
        { name: 'Casa Marevento', img: A + 'r4.webp', loc: 'Amalfi Coast', guests: '8 guests', price: '$18,500 / wk', status: 'Saved' },
        { name: 'Podere Bellavista', img: A + 'r5.webp', loc: 'Tuscany', guests: '6 guests', price: '$12,800 / wk', status: 'Saved' },
        { name: 'Quinta do Mar', img: A + 'r6.webp', loc: 'Algarve', guests: '10 guests', price: '$16,200 / wk', status: 'Saved' },
        { name: 'Château Lavande', img: A + 'r7.webp', loc: 'Provence', guests: '8 guests', price: '$14,900 / wk', status: 'Saved' },
        { name: 'Aegean Cliff House', img: A + 'r11.webp', loc: 'Santorini', guests: '6 guests', price: '$11,400 / wk', status: 'Saved' }
      ],

      experiences: [
        { name: 'Private Chef', img: A + 'r13.webp', villa: 'Casa Marevento', guests: '8 guests', when: '12 Mar · 19:30', status: 'Confirmed' },
        { name: 'Yacht Charter', img: A + 'r14.webp', villa: 'Casa Marevento', guests: '8 guests', when: '14 Mar · 10:00', status: 'Confirmed' },
        { name: 'Wine Tour', img: A + 'r15.webp', villa: 'Podere Bellavista', guests: '6 guests', when: '29 Apr · 15:00', status: 'Pending' },
        { name: 'Wellness Retreat', img: A + 'r16.webp', villa: 'Quinta do Mar', guests: '2 guests', when: '01 May · 09:00', status: 'Confirmed' }
      ],

      invoices: [
        { id: '#STK-2041', name: 'Casa Marevento', img: A + 'r4.webp', amount: '$18,500.00', due: '02 Mar 2026', status: 'Paid' },
        { id: '#STK-2042', name: 'Quinta do Mar', img: A + 'r6.webp', amount: '$16,200.00', due: '09 Mar 2026', status: 'Pending' },
        { id: '#STK-2043', name: 'Podere Bellavista', img: A + 'r5.webp', amount: '$12,800.00', due: '21 Feb 2026', status: 'Overdue' },
        { id: '#STK-2044', name: 'Château Lavande', img: A + 'r7.webp', amount: '$14,900.00', due: '14 Mar 2026', status: 'Partial' },
        { id: '#STK-2045', name: 'Aegean Cliff House', img: A + 'r11.webp', amount: '$11,400.00', due: '28 Feb 2026', status: 'Refunded' }
      ],

      activity: [
        { icon: 'fa-calendar-check', text: 'Booked Casa Marevento for March', time: '15 minutes ago' },
        { icon: 'fa-file-invoice-dollar', text: 'Payment received for booking #STK-2041', time: '1 hour ago' },
        { icon: 'fa-heart', text: 'Saved Quinta do Mar to your collection', time: 'Today' },
        { icon: 'fa-car', text: 'Concierge confirmed your airport transfer', time: 'Yesterday' }
      ],

      tasks: [
        { l: 'Confirm guest details for the Amalfi stay', s: 'Due before 05 March', done: false },
        { l: 'Download travel documents', s: 'All bookings in one file', done: true },
        { l: 'Book a private chef for the first evening', s: 'Amalfi · 7 guests', done: false }
      ],

      readiness: [
        { l: 'Stays confirmed', v: 78 },
        { l: 'Travel documents ready', v: 64 },
        { l: 'Concierge requests handled', v: 91 }
      ],

      threads: [
        { img: A + 'r4.webp', name: 'Casa Marevento host', sub: 'Welcome notes for your arrival' },
        { img: A + 'r9.webp', name: 'Stackly concierge', sub: 'Your airport transfer is confirmed' },
        { img: A + 'r15.webp', name: 'Amalfi experiences', sub: 'Private chef availability for March' }
      ],

      chart: [
        { l: 'Jan', v: 2 }, { l: 'Feb', v: 3 }, { l: 'Mar', v: 4 },
        { l: 'Apr', v: 6 }, { l: 'May', v: 5 }, { l: 'Jun', v: 8 }, { l: 'Jul', v: 7 }
      ]
    },

    /* --------------------------------------------------------------- ADMIN */
    admin: {
      stats: {
        overview: [
          { icon: 'fa-calendar-check', val: '18', lab: "Today's bookings" },
          { icon: 'fa-users', val: '6', lab: 'Guests in residence' },
          { icon: 'fa-file-invoice-dollar', val: '4', lab: 'Invoices due' },
          { icon: 'fa-headset', val: '2', lab: 'Open queries' }
        ],
        bookings: [
          { icon: 'fa-calendar-day', val: '18', lab: 'Booked today' },
          { icon: 'fa-circle-check', val: '14', lab: 'Confirmed' },
          { icon: 'fa-hourglass-half', val: '3', lab: 'Pending' },
          { icon: 'fa-user-xmark', val: '1', lab: 'No-show' }
        ],
        properties: [
          { icon: 'fa-house', val: '62', lab: 'Active villas' },
          { icon: 'fa-location-dot', val: '18', lab: 'Destinations' },
          { icon: 'fa-hourglass-half', val: '5', lab: 'Awaiting review' },
          { icon: 'fa-eye-slash', val: '2', lab: 'Off-market' }
        ],
        guests: [
          { icon: 'fa-id-card', val: '4,912', lab: 'Registered guests' },
          { icon: 'fa-user-plus', val: '38', lab: 'New this week' },
          { icon: 'fa-shield-halved', val: '12', lab: 'Verification pending' },
          { icon: 'fa-star', val: '9', lab: 'VIP arrivals' }
        ],
        billing: [
          { icon: 'fa-file-invoice', val: '$184,200', lab: 'Invoiced this month' },
          { icon: 'fa-circle-check', val: '$159,800', lab: 'Collected' },
          { icon: 'fa-clock', val: '$24,400', lab: 'Outstanding' },
          { icon: 'fa-rotate-left', val: '$3,600', lab: 'Refunded' }
        ]
      },

      appointments: [
        { time: '08:45', name: 'Grace Mensah', img: A + 'r4.webp', type: 'Casa Marevento · 7 nights', status: 'Confirmed' },
        { time: '09:15', name: 'Noah Fischer', img: A + 'r5.webp', type: 'Podere Bellavista · 6 nights', status: 'Confirmed' },
        { time: '10:00', name: 'Lena Torres', img: A + 'r6.webp', type: 'Quinta do Mar · 5 nights', status: 'Pending' },
        { time: '10:45', name: 'Omar Haddad', img: A + 'r7.webp', type: 'Château Lavande · 7 nights', status: 'Confirmed' },
        { time: '11:30', name: 'Keira Doyle', img: A + 'r11.webp', type: 'Aegean Cliff House · 4 nights', status: 'Confirmed' },
        { time: '12:15', name: 'Ben Carter', img: A + 'r21.webp', type: 'Casa Marevento · 3 nights', status: 'Cancelled' }
      ],

      properties: [
        { name: 'Casa Marevento', img: A + 'r4.webp', ref: 'VIL-AMA-01', guests: 8, price: '$18,500', status: 'Active' },
        { name: 'Podere Bellavista', img: A + 'r5.webp', ref: 'VIL-TUS-02', guests: 6, price: '$12,800', status: 'Active' },
        { name: 'Quinta do Mar', img: A + 'r6.webp', ref: 'VIL-ALG-03', guests: 10, price: '$16,200', status: 'Awaiting review' },
        { name: 'Château Lavande', img: A + 'r7.webp', ref: 'VIL-PRO-04', guests: 8, price: '$14,900', status: 'Active' },
        { name: 'Aegean Cliff House', img: A + 'r11.webp', ref: 'VIL-AEG-05', guests: 6, price: '$11,400', status: 'Inactive' }
      ],

      registry: [
        { name: 'Grace Mensah', img: A + 'r28.webp', id: 'G-10482', phone: '+31 6 2210 8841', status: 'Active' },
        { name: 'Noah Fischer', img: A + 'r29.webp', id: 'G-10483', phone: '+31 6 3391 2207', status: 'Active' },
        { name: 'Lena Torres', img: A + 'r30.webp', id: 'G-10484', phone: '+31 6 7742 1190', status: 'Active' },
        { name: 'Omar Haddad', img: A + 'r31.webp', id: 'G-10485', phone: '+31 6 1180 6632', status: 'Pending' },
        { name: 'Keira Doyle', img: A + 'r32.webp', id: 'G-10486', phone: '+31 6 9920 4471', status: 'Inactive' }
      ],

      invoices: [
        { id: '#STK-2041', name: 'Grace Mensah', img: A + 'r4.webp', amount: '$18,500.00', due: '02 Mar 2026', status: 'Paid' },
        { id: '#STK-2042', name: 'Noah Fischer', img: A + 'r5.webp', amount: '$12,800.00', due: '09 Mar 2026', status: 'Pending' },
        { id: '#STK-2043', name: 'Lena Torres', img: A + 'r6.webp', amount: '$16,200.00', due: '21 Feb 2026', status: 'Overdue' },
        { id: '#STK-2044', name: 'Omar Haddad', img: A + 'r7.webp', amount: '$14,900.00', due: '14 Mar 2026', status: 'Partial' },
        { id: '#STK-2045', name: 'Keira Doyle', img: A + 'r11.webp', amount: '$11,400.00', due: '28 Feb 2026', status: 'Refunded' }
      ],

      activity: [
        { icon: 'fa-calendar-check', text: 'Booked Grace Mensah into Casa Marevento', time: '15 minutes ago' },
        { icon: 'fa-file-invoice-dollar', text: 'Payment received for invoice #STK-2041', time: '1 hour ago' },
        { icon: 'fa-user-plus', text: 'Registered 6 new guests at the front desk', time: 'Today' },
        { icon: 'fa-triangle-exclamation', text: 'Quinta do Mar availability dropped to 12 nights', time: 'Yesterday' }
      ],

      tasks: [
        { l: 'Chase 3 overdue invoices', s: 'Oldest is 8 days late', done: false },
        { l: "Confirm tomorrow's bookings", s: '4 guests still unconfirmed', done: false },
        { l: 'Reconcile the card terminal', s: 'Morning takings balanced', done: true }
      ],

      deskHealth: [
        { l: 'Bookings confirmed', v: 78 },
        { l: 'Invoices collected', v: 87 },
        { l: 'Calls answered in 1 min', v: 69 }
      ],

      threads: [
        { img: A + 'r28.webp', name: 'Grace Mensah', sub: 'Could I move my stay to Friday?' },
        { img: A + 'r29.webp', name: 'Noah Fischer', sub: 'Which villas welcome pets?' },
        { img: A + 'r30.webp', name: 'Lena Torres', sub: 'Asking for a copy of my invoice' }
      ],

      chart: [
        { l: 'Mon', v: 22 }, { l: 'Tue', v: 27 }, { l: 'Wed', v: 19 },
        { l: 'Thu', v: 31 }, { l: 'Fri', v: 34 }, { l: 'Sat', v: 18 }, { l: 'Sun', v: 6 }
      ]
    }
  };

  var D = DATA[pageRole];

  /* ============================================================== views === */
  function clientViews() {
    return {
      overview: function () {
        return hero('Guest portal', 'fa-suitcase-rolling', 'Good to see you, ' + user.name,
          'Two escapes are confirmed and your next stay on the Amalfi Coast begins in twelve days.',
          { icon: 'fa-calendar-plus', label: 'Plan a stay' }) +
          stats('overview') +
          grid2(
            panel('Upcoming stays', table(['Date', 'Villa', 'Destination', 'Status'],
              D.appointments.slice(0, 5).map(function (r) {
                return [esc(r.time), prodCell(r.img, r.name, r.type), esc(r.type), pill(r.status)];
              })), { label: 'View all' }),
            panel('Recent activity', feed(D.activity))
          ) +
          grid3(
            panel('Stay readiness', progress(D.readiness)),
            panel('Your checklist', todos(D.tasks)),
            panel('Membership at a glance', kv([
              ['Loyalty tier', 'Gold'],
              ['Stays this year', '4'],
              ['Nights travelled', '31'],
              ['Concierge minutes', '180']
            ]))
          ) +
          panel('Getaways this year', chart(D.chart)) +
          panel('Quick actions', quick([
            { icon: 'fa-calendar-plus', label: 'Plan a stay' },
            { icon: 'fa-heart', label: 'Browse villas' },
            { icon: 'fa-compass', label: 'Book an experience' },
            { icon: 'fa-file-invoice-dollar', label: 'View invoices' }
          ]));
      },

      bookings: function () {
        return stats('bookings') +
          panel('All bookings',
            table(['Date', 'Villa', 'Destination', 'Status'], D.appointments.map(function (r) {
              return [esc(r.time), prodCell(r.img, r.name, r.type), esc(r.type), pill(r.status)];
            }))) +
          grid2(
            panel('Booking progress', progress([
              { l: 'Stays confirmed', v: 78 },
              { l: 'Travel documents ready', v: 64 },
              { l: 'Concierge requests handled', v: 91 }
            ])),
            panel('Stay notes', timeline([
              { icon: 'fa-key', l: 'Casa Marevento', s: 'Check-in 12 March · 15:00', p: 'Self check-in details arrive 48 hours before arrival.' },
              { icon: 'fa-car', l: 'Private transfer', s: 'Naples airport · 13:20', p: 'Driver details shared with your arrival note.' },
              { icon: 'fa-circle-check', l: 'Quinta do Mar', s: 'Balance settled', p: 'Final payment received on 09 March.', done: true }
            ]))
          ) +
          panel('How a stay comes together', steps([
            { l: 'Choose', p: 'Browse the collection and save the villas you love.' },
            { l: 'Reserve', p: 'Confirm your dates with your dedicated host.' },
            { l: 'Personalise', p: 'Add a chef, a yacht day or a wellness session.' },
            { l: 'Arrive', p: 'Check in, settle in and let the concierge handle the rest.' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-calendar-plus', label: 'Add a stay' },
            { icon: 'fa-clock-rotate-left', label: 'Change dates' },
            { icon: 'fa-bell', label: 'Set reminders' },
            { icon: 'fa-file-export', label: 'Export itinerary' }
          ]));
      },

      villas: function () {
        return stats('villas') +
          panel('Saved villas',
            table(['Villa', 'Location', 'Guests', 'From', 'Status'], D.saved.map(function (v) {
              return [prodCell(v.img, v.name, v.loc), esc(v.loc), esc(v.guests), esc(v.price), pill(v.status)];
            }))) +
          grid2(
            panel('Wishlist progress', progress([
              { l: 'Villas shortlisted', v: 82 },
              { l: 'Dates compared', v: 64 },
              { l: 'Enquiries sent', v: 41 }
            ])),
            panel('Travel preferences', kv([
              ['Preferred style', 'Coastal'],
              ['Party size', '2–8 guests'],
              ['Favourite region', 'Mediterranean'],
              ['Dietary notes', 'One vegetarian']
            ]))
          ) +
          panel('Collection highlights', tiles([
            { icon: 'fa-water', k: 'By the sea', v: '28', n: 'Coastal villas' },
            { icon: 'fa-wheat-awn', k: 'Into the country', v: '16', n: 'Rural retreats' },
            { icon: 'fa-mountain-sun', k: 'Above the clouds', v: '12', n: 'Mountain homes' },
            { icon: 'fa-city', k: 'In the city', v: '6', n: 'Urban residences' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-heart', label: 'Save a villa' },
            { icon: 'fa-calendar-check', label: 'Check dates' },
            { icon: 'fa-paper-plane', label: 'Send enquiry' },
            { icon: 'fa-map-location-dot', label: 'Explore destinations' }
          ]));
      },

      experiences: function () {
        return stats('experiences') +
          panel('Booked experiences',
            table(['Experience', 'Villa', 'Guests', 'When', 'Status'], D.experiences.map(function (e) {
              return [prodCell(e.img, e.name, e.villa), esc(e.villa), esc(e.guests), esc(e.when), pill(e.status)];
            }))) +
          grid2(
            panel('Experience budget', progress([
              { icon: 'fa-utensils', l: 'Dining', v: 72 },
              { l: 'Excursions', v: 58 },
              { l: 'Wellness', v: 46 }
            ])),
            panel('Your concierge', imgList(D.threads))
          ) +
          panel('Popular this season', tiles([
            { icon: 'fa-utensils', k: 'Private chef', v: '6', n: 'Dinners arranged' },
            { icon: 'fa-ship', k: 'Yacht charter', v: '3', n: 'Days on the water' },
            { icon: 'fa-wine-glass-alt', k: 'Wine tours', v: '4', n: 'Cellar visits' },
            { icon: 'fa-spa', k: 'Wellness', v: '2', n: 'In-villa treatments' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-utensils', label: 'Book a chef' },
            { icon: 'fa-ship', label: 'Charter a yacht' },
            { icon: 'fa-wine-glass-alt', label: 'Plan a tasting' },
            { icon: 'fa-spa', label: 'Book wellness' }
          ]));
      },

      payments: function () {
        return stats('payments') +
          panel('Invoices',
            table(['Invoice', 'Villa', 'Amount', 'Due', 'Status'], D.invoices.map(function (inv) {
              return [esc(inv.id), prodCell(inv.img, inv.name, inv.id), esc(inv.amount), esc(inv.due), pill(inv.status)];
            }))) +
          grid2(
            panel('Payment progress', progress([
              { l: 'Invoices settled', v: 87 },
              { l: 'Upcoming balances', v: 64 },
              { l: 'Refunds completed', v: 12 }
            ])),
            panel('Money at a glance', kv([
              ['Paid this year', '$47,300'],
              ['Due soon', '$16,200'],
              ['Deposits held', '$8,400'],
              ['Refunded', '$11,400']
            ]))
          ) +
          panel('Payment activity', timeline([
            { icon: 'fa-circle-check', l: '#STK-2041 · Casa Marevento', s: '$18,500.00 received', p: 'Card payment confirmed at booking.', done: true },
            { icon: 'fa-clock', l: '#STK-2042 · Quinta do Mar', s: '$16,200.00 due soon', p: 'Balance due 09 March 2026.' },
            { icon: 'fa-rotate-left', l: '#STK-2045 · Aegean Cliff House', s: '$11,400.00 refunded', p: 'Stay cancelled and refunded in full.' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-file-invoice-dollar', label: 'View invoices' },
            { icon: 'fa-money-bill-wave', label: 'Make a payment' },
            { icon: 'fa-receipt', label: 'Download receipts' },
            { icon: 'fa-chart-line', label: 'Spending report' }
          ]));
      },

      messages: function () {
        return stats('overview') +
          grid2(
            panel('Your conversations', imgList(D.threads)),
            panel('Guest tools', quick([
              { icon: 'fa-pen', label: 'New message' },
              { icon: 'fa-concierge-bell', label: 'Ask the concierge' },
              { icon: 'fa-bell-slash', label: 'Mute thread' },
              { icon: 'fa-inbox', label: 'Archived' }
            ]))
          ) +
          panel('Reply queue', timeline([
            { icon: 'fa-envelope', l: 'Casa Marevento host', s: 'Welcome notes for your arrival', p: 'Waiting 40 minutes' },
            { icon: 'fa-envelope', l: 'Stackly concierge', s: 'Your airport transfer is confirmed', p: 'Waiting 2 hours' },
            { icon: 'fa-circle-check', l: 'Amalfi experiences', s: 'Private chef availability shared', p: 'Answered today', done: true }
          ])) +
          note('Your host and concierge reply inside Stackly. Never share card details over a message thread — use the payments screen instead.', 'fa-shield-heart');
      }
    };
  }

  function adminViews() {
    return {
      overview: function () {
        return hero('Management desk', 'fa-bell-concierge', 'Good to see you, ' + user.name,
          'Eighteen bookings today, six guests in residence and four invoices still need chasing.',
          { icon: 'fa-calendar-plus', label: 'New booking' }) +
          stats('overview') +
          grid2(
            panel("Today's bookings", table(['Time', 'Guest', 'Villa', 'Status'],
              D.appointments.slice(0, 5).map(function (r) {
                return [esc(r.time), prodCell(r.img, r.name, r.type), esc(r.type), pill(r.status)];
              })), { label: 'View all' }),
            panel('Recent activity', feed(D.activity))
          ) +
          grid3(
            panel('Front-desk health', progress(D.deskHealth)),
            panel('Your checklist', todos(D.tasks)),
            panel('Collection at a glance', kv([
              ['Bookings today', '18'],
              ['Collected today', '$31,200'],
              ['Villas available', '62'],
              ['Open queries', '2']
            ]))
          ) +
          panel('Bookings this week', chart(D.chart)) +
          panel('Quick actions', quick([
            { icon: 'fa-calendar-plus', label: 'New booking' },
            { icon: 'fa-user-plus', label: 'Register guest' },
            { icon: 'fa-file-invoice-dollar', label: 'New invoice' },
            { icon: 'fa-chart-simple', label: 'Daily report' }
          ]));
      },

      bookings: function () {
        return stats('bookings') +
          panel('All bookings',
            table(['Time', 'Guest', 'Villa', 'Status'], D.appointments.map(function (r) {
              return [esc(r.time), prodCell(r.img, r.name, r.type), esc(r.type), pill(r.status)];
            }))) +
          grid2(
            panel('Confirmation progress', progress([
              { l: 'Bookings confirmed', v: 78 },
              { l: 'Reminders sent', v: 92 },
              { l: 'Guest details returned', v: 65 }
            ])),
            panel('Desk notes', timeline([
              { icon: 'fa-clock', l: 'Lena Torres', s: 'Awaiting confirmation call', p: 'Left a voicemail this morning.' },
              { icon: 'fa-circle-check', l: 'Omar Haddad', s: 'Château Lavande stay confirmed', p: 'Reminder sent by SMS.', done: true },
              { icon: 'fa-user-xmark', l: 'Ben Carter', s: 'Cancelled a March booking', p: 'Holding the villa for a rebook.' }
            ]))
          ) +
          panel('Booking flow', steps([
            { l: 'Enquiry', p: 'Guest calls or requests dates online.' },
            { l: 'Villa held', p: 'The front desk reserves the dates.' },
            { l: 'Confirmed', p: 'Reminder sent and guest details shared.' },
            { l: 'Checked in', p: 'Guest arrives and the host takes over.' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-calendar-plus', label: 'Add booking' },
            { icon: 'fa-bell', label: 'Send reminders' },
            { icon: 'fa-clock-rotate-left', label: 'Reschedule' },
            { icon: 'fa-file-export', label: 'Export diary' }
          ]));
      },

      properties: function () {
        return stats('properties') +
          panel('Villas & residences',
            table(['Villa', 'Reference', 'Guests', 'From', 'Status'], D.properties.map(function (p) {
              return [prodCell(p.img, p.name, p.ref), esc(p.ref), esc(String(p.guests)), esc(p.price), pill(p.status)];
            }))) +
          grid2(
            panel('Portfolio health', progress([
              { l: 'Listings complete', v: 82 },
              { l: 'Photos up to date', v: 74 },
              { l: 'Reviews responded to', v: 91 }
            ])),
            panel('Availability alerts', timeline([
              { icon: 'fa-triangle-exclamation', l: 'Quinta do Mar', s: 'Only 12 nights open', p: 'Peak season demand is rising — review the rate.' },
              { icon: 'fa-eye-slash', l: 'Aegean Cliff House', s: 'Off-market', p: 'Refurbishment runs until early June.' },
              { icon: 'fa-circle-check', l: 'Château Lavande', s: 'Fully bookable', p: 'Calendar and photography approved.', done: true }
            ]))
          ) +
          panel('Guests by residence', hbars([
            { l: 'Casa Marevento', v: 8, s: '8 guests' },
            { l: 'Quinta do Mar', v: 10, s: '10 guests' },
            { l: 'Podere Bellavista', v: 6, s: '6 guests' },
            { l: 'Château Lavande', v: 8, s: '8 guests' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-house-circle-check', label: 'Add villa' },
            { icon: 'fa-file-import', label: 'Bulk import' },
            { icon: 'fa-tags', label: 'Edit rates' },
            { icon: 'fa-calendar-days', label: 'Open calendar' }
          ]));
      },

      guests: function () {
        return stats('guests') +
          panel('Registered guests',
            table(['Guest', 'File ID', 'Phone', 'Status'], D.registry.map(function (p) {
              return [prodCell(p.img, p.name, p.id), esc(p.id), esc(p.phone), pill(p.status)];
            }))) +
          grid2(
            panel('Registration quality', progress([
              { l: 'Contact details complete', v: 96 },
              { l: 'Identity verified', v: 71 },
              { l: 'Consent forms signed', v: 88 }
            ])),
            panel('Front-desk overview', kv([
              ['Registered today', '6'],
              ['Verification pending', '12'],
              ['VIP arrivals', '9'],
              ['Returning guests', '24']
            ]))
          ) +
          panel('Quick actions', quick([
            { icon: 'fa-user-plus', label: 'Register guest' },
            { icon: 'fa-id-card', label: 'Update details' },
            { icon: 'fa-shield-halved', label: 'Verify identity' },
            { icon: 'fa-print', label: 'Print file' }
          ]));
      },

      billing: function () {
        return stats('billing') +
          panel('Invoices',
            table(['Invoice', 'Guest', 'Amount', 'Due', 'Status'], D.invoices.map(function (inv) {
              return [esc(inv.id), prodCell(inv.img, inv.name, inv.id), esc(inv.amount), esc(inv.due), pill(inv.status)];
            }))) +
          grid2(
            panel('Collection progress', progress([
              { l: 'Invoices paid', v: 87 },
              { l: 'Reminders sent', v: 64 },
              { l: 'Payment plans active', v: 12 }
            ])),
            panel('Money at a glance', kv([
              ['Invoiced this month', '$184,200'],
              ['Collected', '$159,800'],
              ['Outstanding', '$24,400'],
              ['Refunded', '$3,600']
            ]))
          ) +
          panel('Payment activity', timeline([
            { icon: 'fa-circle-check', l: '#STK-2041 · Grace Mensah', s: '$18,500.00 received', p: 'Card payment confirmed at the desk.', done: true },
            { icon: 'fa-clock', l: '#STK-2043 · Lena Torres', s: '$16,200.00 overdue', p: 'Second reminder going out today.' },
            { icon: 'fa-rotate-left', l: '#STK-2045 · Keira Doyle', s: '$11,400.00 refunded', p: 'Stay cancelled and refunded in full.' }
          ])) +
          panel('Quick actions', quick([
            { icon: 'fa-file-invoice-dollar', label: 'New invoice' },
            { icon: 'fa-money-bill-wave', label: 'Record payment' },
            { icon: 'fa-receipt', label: 'Print receipt' },
            { icon: 'fa-chart-line', label: 'Revenue report' }
          ]));
      },

      messages: function () {
        return stats('overview') +
          grid2(
            panel('Guest threads', imgList(D.threads)),
            panel('Desk tools', quick([
              { icon: 'fa-pen', label: 'New message' },
              { icon: 'fa-headset', label: 'Log a call' },
              { icon: 'fa-bell-slash', label: 'Mute thread' },
              { icon: 'fa-inbox', label: 'Archived' }
            ]))
          ) +
          panel('Reply queue', timeline([
            { icon: 'fa-envelope', l: 'Grace Mensah', s: 'Could I move my stay to Friday?', p: 'Waiting 20 minutes' },
            { icon: 'fa-envelope', l: 'Noah Fischer', s: 'Which villas welcome pets?', p: 'Waiting 1 hour' },
            { icon: 'fa-circle-check', l: 'Lena Torres', s: 'Asking for a copy of my invoice', p: 'Answered this morning', done: true }
          ])) +
          note('Never ask for card details in a message thread — take payment only through the billing screen.', 'fa-shield-halved');
      }
    };
  }

  var VIEWS = (pageRole === 'admin') ? adminViews() : clientViews();
  var menu = MENU[pageRole];

  /* =============================================================== shell == */
  var side = doc.getElementById('dashSide');
  var scrim = doc.getElementById('dashScrim');
  var burger = doc.getElementById('dashBurger');
  var sideClose = doc.getElementById('dashSideClose');
  var nav = doc.getElementById('dashNav');
  var view = doc.getElementById('dashView');
  var titleEl = doc.getElementById('dashTitle');
  var welcomeEl = doc.getElementById('dashWelcome');
  var searchBox = doc.getElementById('dashSearchBox');
  var searchInput = doc.getElementById('dashSearch');
  var avatarA = doc.getElementById('dashAvatar');
  var avatarB = doc.getElementById('dashAvatarB');
  var nameA = doc.getElementById('dashName');
  var nameB = doc.getElementById('dashNameB');
  var emailA = doc.getElementById('dashEmail');
  var emailB = doc.getElementById('dashEmailB');
  var roleEl = doc.getElementById('dashRole');

  function initial(name) {
    var n = (name || 'S').trim();
    return n.charAt(0).toUpperCase();
  }
  var ini = initial(user.name);

  if (roleEl) roleEl.textContent = ROLE_LABEL[pageRole];
  [avatarA, avatarB].forEach(function (el) { if (el) el.textContent = ini; });
  [nameA, nameB].forEach(function (el) { if (el) el.textContent = user.name; });
  [emailA, emailB].forEach(function (el) { if (el) el.textContent = user.email; });

  /* build sidebar nav */
  menu.forEach(function (item, i) {
    var btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'side-link' + (i === 0 ? ' is-on' : '');
    btn.setAttribute('data-view', item.key);
    if (i === 0) btn.setAttribute('aria-current', 'page');
    btn.innerHTML = '<i class="fa-solid ' + item.icon + '" aria-hidden="true"></i><span>' + esc(item.label) + '</span>';
    btn.addEventListener('click', function () { show(item.key, item.label); });
    nav.appendChild(btn);
  });

  /* router */
  function animate() {
    win.requestAnimationFrame(function () {
      view.querySelectorAll('.d-bar[data-h]').forEach(function (el) { el.style.height = el.getAttribute('data-h') + 'px'; });
      view.querySelectorAll('.d-fill[data-w], .hbar__fill[data-w]').forEach(function (el) { el.style.width = el.getAttribute('data-w') + '%'; });
    });
  }

  function show(key, label) {
    var render = VIEWS[key];
    show.currentKey = key;
    nav.querySelectorAll('.side-link').forEach(function (btn) {
      var on = btn.getAttribute('data-view') === key;
      btn.classList.toggle('is-on', on);
      if (on) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
    });
    if (titleEl) titleEl.textContent = label;
    if (welcomeEl) {
      welcomeEl.textContent = (key === 'overview') ? ('Signed in as ' + user.email) : '';
      welcomeEl.hidden = (key !== 'overview');
    }
    view.innerHTML = render ? ('<div class="view">' + render() + '</div>') : '';
    animate();
    if (searchInput) searchInput.value = '';
    win.scrollTo(0, 0);
    closeMenu();
  }

  /* fullscreen menu */
  function menuOpen() { return side && side.classList.contains('is-open'); }
  function openMenu() {
    if (!side) return;
    side.classList.add('is-open');
    side.setAttribute('aria-hidden', 'false');
    if (scrim) scrim.classList.add('is-on');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    doc.body.classList.add('is-locked');
  }
  function closeMenu() {
    if (!side) return;
    side.classList.remove('is-open');
    var mobile = win.innerWidth <= 980;
    side.setAttribute('aria-hidden', mobile ? 'true' : 'false');
    if (scrim) scrim.classList.remove('is-on');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    doc.body.classList.remove('is-locked');
  }

  if (burger) burger.addEventListener('click', openMenu);
  if (sideClose) sideClose.addEventListener('click', closeMenu);
  if (scrim) scrim.addEventListener('click', closeMenu);
  win.addEventListener('resize', function () { if (win.innerWidth > 980) closeMenu(); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen()) closeMenu(); });

  /* search */
  if (searchInput) {
    var placeholder = searchInput.getAttribute('placeholder') || '';
    searchInput.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      var term = searchInput.value.trim();
      if (!term) {
        if (searchBox) {
          searchBox.classList.add('is-bad');
          searchInput.setAttribute('placeholder', 'Type something to search');
          win.setTimeout(function () {
            searchBox.classList.remove('is-bad');
            searchInput.setAttribute('placeholder', placeholder || 'Search bookings, villas, invoices…');
          }, 1600);
        }
        toast('Type something to search', true);
        return;
      }
      win.location.href = DEAD;
    });
  }

  /* logout */
  var logout = doc.getElementById('dashLogout');
  if (logout) {
    logout.addEventListener('click', function () {
      try { win.localStorage.removeItem(USER_KEY); } catch (e) {}
      win.location.href = LOGIN_PAGE;
    });
  }

  /* demo actions + toasts */
  var toasts = doc.getElementById('dashToasts');
  function toast(message, isBad) {
    if (!toasts) return;
    var el = doc.createElement('div');
    el.className = 'toast' + (isBad ? ' is-bad' : '');
    el.innerHTML = '<i class="fa-solid ' + (isBad ? 'fa-circle-exclamation' : 'fa-circle-check') + '" aria-hidden="true"></i><span>' + esc(message) + '</span>';
    toasts.appendChild(el);
    win.setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      win.setTimeout(function () { el.remove(); }, 320);
    }, 2800);
  }

  /* placeholder actions navigate to the 404 page (see DEAD) */

  /* boot */
  show(menu[0].key, menu[0].label);

  win.addEventListener('pageshow', function (e) { if (e.persisted) closeMenu(); });
})();
