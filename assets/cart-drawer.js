(function () {
  var drawer = document.getElementById('CartDrawer');
  if (!drawer) return;
  var body = drawer.querySelector('[data-cart-body]');

  function open() { drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
  function close() { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }

  function refresh() {
    return fetch('/?section_id=cart-drawer-render', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var fresh = tmp.querySelector('[data-cart-body]');
        if (fresh) body.innerHTML = fresh.innerHTML;
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) { updateCount(cart.item_count); });
  }

  // Fallback refresh using cart.js + manual render if section render unavailable
  function refreshSimple() {
    return fetch('/cart.js').then(function (r) { return r.json(); }).then(function (cart) {
      updateCount(cart.item_count);
      renderItems(cart);
    });
  }

  function money(cents) { return '$' + (cents / 100).toFixed(2); }

  function renderItems(cart) {
    if (cart.item_count === 0) {
      body.innerHTML = '<div class="cart-drawer__empty"><p>Your cart is empty.</p><a href="/collections/all" class="btn btn-primary btn-block" data-cart-close>Shop now</a></div>';
      bind();
      return;
    }
    var rows = cart.items.map(function (item) {
      var img = item.image ? '<img src="' + item.image.replace(/(\.[a-z]+)(\?|$)/i, '_160x$1$2') + '" alt="">' : '';
      var variant = (item.variant_title && item.variant_title !== 'Default Title') ? '<div class="cart-line__variant">' + item.variant_title + '</div>' : '';
      var plan = item.selling_plan_allocation ? '<div class="cart-line__plan">' + item.selling_plan_allocation.selling_plan.name + '</div>' : '';
      return '<li class="cart-line" data-key="' + item.key + '">' +
        '<a href="' + item.url + '" class="cart-line__img">' + img + '</a>' +
        '<div class="cart-line__info"><div class="cart-line__top">' +
        '<span class="cart-line__title">' + item.product_title + '</span>' +
        '<button class="cart-line__remove" data-cart-remove="' + item.key + '" aria-label="Remove"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13"/></svg></button>' +
        '</div>' + variant + plan +
        '<div class="cart-line__bottom"><div class="cart-line__qty">' +
        '<button data-cart-minus="' + item.key + '">-</button><span>' + item.quantity + '</span><button data-cart-plus="' + item.key + '">+</button>' +
        '</div><span class="cart-line__price">' + money(item.final_line_price) + '</span></div></div></li>';
    }).join('');
    body.innerHTML = '<ul class="cart-drawer__items">' + rows + '</ul>' +
      '<div class="cart-drawer__foot"><div class="cart-drawer__sub"><span>Subtotal</span><strong>' + money(cart.total_price) + '</strong></div>' +
      '<p class="cart-drawer__note">Shipping &amp; taxes calculated at checkout</p>' +
      '<a href="/checkout" class="btn btn-primary btn-block btn-lg cart-drawer__checkout">Checkout · ' + money(cart.total_price) + '</a></div>';
    bind();
  }

  function updateCount(n) {
    document.querySelectorAll('[data-cart-count], .cart-count').forEach(function (el) { el.textContent = n; });
  }

  function change(key, qty) {
    return fetch('/cart/change.js', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: qty })
    }).then(function (r) { return r.json(); }).then(function (cart) { updateCount(cart.item_count); renderItems(cart); });
  }

  function bind() {
    drawer.querySelectorAll('[data-cart-close]').forEach(function (el) { el.addEventListener('click', close); });
    drawer.querySelectorAll('[data-cart-plus]').forEach(function (b) {
      b.addEventListener('click', function () { var line = b.closest('.cart-line'); var q = parseInt(line.querySelector('.cart-line__qty span').textContent) + 1; change(b.getAttribute('data-cart-plus'), q); });
    });
    drawer.querySelectorAll('[data-cart-minus]').forEach(function (b) {
      b.addEventListener('click', function () { var line = b.closest('.cart-line'); var q = Math.max(0, parseInt(line.querySelector('.cart-line__qty span').textContent) - 1); change(b.getAttribute('data-cart-minus'), q); });
    });
    drawer.querySelectorAll('[data-cart-remove]').forEach(function (b) {
      b.addEventListener('click', function () { change(b.getAttribute('data-cart-remove'), 0); });
    });
  }

  // Intercept product add-to-cart forms
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[action*="/cart/add"], form[action="/cart"]');
    if (!form) return;
    if (form.querySelector('[name="checkout"]')) return; // let checkout buttons pass
    e.preventDefault();
    var btn = form.querySelector('[type="submit"]');
    if (btn) btn.classList.add('is-loading');
    var data = new FormData(form);
    fetch('/cart/add.js', { method: 'POST', body: data })
      .then(function (r) { return r.json(); })
      .then(function () { return refreshSimple(); })
      .then(function () { open(); if (btn) btn.classList.remove('is-loading'); })
      .catch(function () { if (btn) btn.classList.remove('is-loading'); });
  });

  // Open drawer when header cart icon clicked
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('a[href$="/cart"], a[href="/cart"], [data-cart-toggle]');
    if (trigger) { e.preventDefault(); refreshSimple().then(open); }
  });

  bind();
})();
