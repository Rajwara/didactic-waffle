/* =========================================================
   DRESSUP.GE checkout – shared cart logic
   Pricing: qty × price + delivery + gift wrap − promo
   Hooks are plain data-attributes so the markup stays clean.
   Demo promo codes: DRESSUP10 (−10%), WELCOME20 (−20 ₾)
   ========================================================= */
const Cart = (() => {
  const state = {
    price: 149,
    qty: 1,
    delivery: 0,
    gift: false,
    giftPrice: 5,
    promo: null,
  };
  const PROMOS = {
    DRESSUP10: { label: "DRESSUP10 · −10%", calc: (s) => Math.round(s * 0.1) },
    WELCOME20: { label: "WELCOME20 · −20 ₾", calc: () => 20 },
  };
  const listeners = [];
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const gel = (n) => `${n.toLocaleString("en-US")} ₾`;

  function totals() {
    const subtotal = state.price * state.qty;
    const gift = state.gift ? state.giftPrice : 0;
    const discount = state.promo ? PROMOS[state.promo].calc(subtotal) : 0;
    const total = Math.max(0, subtotal + state.delivery + gift - discount);
    return { subtotal, gift, discount, total, delivery: state.delivery, qty: state.qty };
  }

  function render() {
    const t = totals();
    $$("[data-qty]").forEach((el) => (el.textContent = t.qty));
    $$('[data-out="count"]').forEach((el) => (el.textContent = t.qty));
    $$('[data-out="subtotal"]').forEach((el) => (el.textContent = gel(t.subtotal)));
    $$('[data-out="total"]').forEach((el) => (el.textContent = gel(t.total)));
    $$('[data-out="delivery"]').forEach((el) => {
      el.textContent = t.delivery ? gel(t.delivery) : "Free";
      el.classList.toggle("is-free", !t.delivery);
    });
    $$('[data-out="gift"]').forEach((el) => (el.textContent = gel(t.gift)));
    $$('[data-row="gift"]').forEach((el) => (el.hidden = !t.gift));
    $$('[data-out="discount"]').forEach((el) => (el.textContent = `−${gel(t.discount)}`));
    $$('[data-row="discount"]').forEach((el) => (el.hidden = !t.discount));
    $$('[data-qty-dec]').forEach((el) => (el.disabled = t.qty <= 1));
    listeners.forEach((fn) => fn(t));
  }

  function bind() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-qty-inc]")) { state.qty = Math.min(10, state.qty + 1); render(); }
      if (e.target.closest("[data-qty-dec]")) { state.qty = Math.max(1, state.qty - 1); render(); }
      const apply = e.target.closest("[data-promo-apply]");
      if (apply) {
        const box = apply.closest("[data-promo]");
        applyPromo(box);
      }
      const remove = e.target.closest("[data-promo-remove]");
      if (remove) {
        state.promo = null;
        const box = remove.closest("[data-promo]");
        const msg = box && box.querySelector("[data-promo-msg]");
        if (msg) { msg.textContent = ""; msg.className = "promo-msg"; }
        render();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.matches("[data-promo-input]")) {
        e.preventDefault();
        applyPromo(e.target.closest("[data-promo]"));
      }
    });
    document.addEventListener("change", (e) => {
      if (e.target.matches("[data-gift]")) {
        state.gift = e.target.checked;
        $$("[data-gift]").forEach((c) => (c.checked = state.gift));
        render();
      }
      if (e.target.matches('input[name="delivery"]')) {
        state.delivery = Number(e.target.dataset.fee || 0);
        render();
      }
    });
  }

  function applyPromo(box) {
    if (!box) return;
    const input = box.querySelector("[data-promo-input]");
    const msg = box.querySelector("[data-promo-msg]");
    const code = (input.value || "").trim().toUpperCase();
    if (PROMOS[code]) {
      state.promo = code;
      msg.innerHTML = `Applied <b>${PROMOS[code].label}</b> <button type="button" class="link" data-promo-remove>Remove</button>`;
      msg.className = "promo-msg ok";
      input.value = "";
    } else {
      msg.textContent = code ? "That code isn't valid. Try DRESSUP10." : "Enter a code first.";
      msg.className = "promo-msg err";
    }
    render();
  }

  /* --- Georgian phone formatting: 5XX XX XX XX --- */
  function bindPhone() {
    document.addEventListener("input", (e) => {
      if (!e.target.matches("[data-phone]")) return;
      const d = e.target.value.replace(/\D/g, "").slice(0, 9);
      const parts = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
      e.target.value = parts.join(" ");
    });
  }

  /* --- Card number / expiry formatting --- */
  function bindCard() {
    document.addEventListener("input", (e) => {
      if (e.target.matches("[data-cardnum]")) {
        const d = e.target.value.replace(/\D/g, "").slice(0, 16);
        e.target.value = d.replace(/(.{4})/g, "$1 ").trim();
      }
      if (e.target.matches("[data-expiry]")) {
        const d = e.target.value.replace(/\D/g, "").slice(0, 4);
        e.target.value = d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
      }
      if (e.target.matches("[data-cvc]")) {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3);
      }
    });
  }

  function init() { bind(); bindPhone(); bindCard(); render(); }
  return { init, render, totals, state, gel, onChange: (fn) => listeners.push(fn) };
})();

/* Simple field validation helper shared by every variant */
function isFilled(el) {
  if (!el) return false;
  if (el.matches("[data-phone]")) return el.value.replace(/\D/g, "").length === 9;
  return el.value.trim().length > 0;
}

/* Order confirmation dialog */
function showSuccess() {
  const dlg = document.getElementById("success");
  if (!dlg) return;
  const t = Cart.totals();
  const out = dlg.querySelector("[data-success-total]");
  if (out) out.textContent = Cart.gel(t.total);
  const num = dlg.querySelector("[data-order-no]");
  if (num) num.textContent = "#DU-" + Math.floor(100000 + Math.random() * 899999);
  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open", "");
}

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-close-dialog]")) {
    const dlg = e.target.closest("dialog");
    if (dlg) dlg.close();
  }
});


/* =========================================================
   Variant 1 — Single page behaviour
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Show the "new address" form when that card is picked
  $$('input[name="address"]').forEach((r) =>
    r.addEventListener("change", () => {
      $("#newAddress").hidden = r.value !== "new" || !r.checked;
      validate();
    })
  );

  // Show new card fields
  $$('input[name="pay-cards"]').forEach((r) =>
    r.addEventListener("change", () => {
      $("#newCard").hidden = $('input[name="pay-cards"]:checked').value !== "new";
      validate();
    })
  );

  // Payment tabs
  let activeTab = "cards";
  $$("[data-tab]").forEach((btn) =>
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      $$("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b === btn));
      $$("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== activeTab));
      validate();
    })
  );

  // Installment hints on pay-later tiles
  Cart.onChange((t) => {
    $$("[data-installment]").forEach((el) => {
      const n = Number(el.dataset.installment);
      el.textContent = `${n} × ${(t.total / n).toFixed(2)} ₾`;
    });
  });

  function addressOk() {
    const picked = $('input[name="address"]:checked');
    if (!picked) return false;
    if (picked.value !== "new") return true;
    return $$("#newAddress [data-req]").every(isFilled);
  }
  function paymentOk() {
    if (activeTab === "cards") {
      const v = $('input[name="pay-cards"]:checked')?.value;
      if (v === "saved") return true;
      return $("#c-num").value.replace(/\D/g, "").length === 16 && $("#c-exp").value.length >= 7 && $("#c-cvc").value.length === 3;
    }
    if (activeTab === "bank") return !!$('input[name="pay-bank"]:checked');
    return !!$('input[name="pay-later"]:checked');
  }

  function validate() {
    const a = addressOk(), d = !!$('input[name="delivery"]:checked'), p = paymentOk();
    $("#step-address").classList.toggle("is-done", a);
    $("#step-delivery").classList.toggle("is-done", d);
    $("#step-payment").classList.toggle("is-done", p);
    const ok = a && d && p;
    $$("[data-buy]").forEach((b) => (b.disabled = !ok));
    $("#buyHint").textContent = ok
      ? "By placing your order you agree to our Terms & Returns policy"
      : !a ? "Add a delivery address to continue" : "Choose a payment method to continue";
  }

  document.addEventListener("input", validate);
  document.addEventListener("change", validate);
  $$("[data-buy]").forEach((b) => b.addEventListener("click", showSuccess));

  Cart.init();
  validate();
})();
