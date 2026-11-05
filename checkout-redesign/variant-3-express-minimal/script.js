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
   Variant 3 — Express minimal behaviour
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Saved address dropdown fills / clears the fields
  const SAVED = {
    home: { street: "45 Vazha-Pshavela Ave", apt: "Apt 12", city: "Tbilisi", region: "Tbilisi" },
    work: { street: "12 Rustaveli Ave", apt: "Floor 3", city: "Tbilisi", region: "Tbilisi" },
    new: { street: "", apt: "", city: "", region: "Tbilisi" },
  };
  $("#saved").addEventListener("change", (e) => {
    const a = SAVED[e.target.value];
    Object.entries(a).forEach(([k, v]) => ($("#" + k).value = v));
    if (e.target.value === "new") $("#street").focus();
  });

  // Payment accordion
  $$('input[name="pay"]').forEach((r) =>
    r.addEventListener("change", () => $$("[data-sub]").forEach((s) => (s.hidden = s.dataset.sub !== r.value)))
  );

  // Instalment amounts
  Cart.onChange((t) => {
    $$("[data-installment]").forEach((el) => (el.textContent = `${(t.total / Number(el.dataset.installment)).toFixed(2)} ₾`));
    $$("[data-plan]").forEach((el) => {
      const n = Number(el.dataset.plan);
      el.textContent = `${n} monthly payments of ${(t.total / n).toFixed(2)} ₾ · 0% interest`;
    });
  });

  // Voucher list
  $("#vouchers").addEventListener("click", () => ($("#vlist").hidden = !$("#vlist").hidden));
  $$("[data-code]").forEach((b) =>
    b.addEventListener("click", () => {
      $("#code").value = b.dataset.code;
      $("[data-promo-apply]").click();
      $("#vlist").hidden = true;
    })
  );

  // Mobile summary toggle — moves the summary under the toggle bar
  const side = $("#side"), split = $(".split"), toggle = $("#mtoggle");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", open);
    toggle.querySelector("span").firstChild.textContent = open ? "🛍 Hide order summary " : "🛍 Show order summary ";
    if (open) toggle.after(side);
    side.classList.toggle("open", open);
  });
  matchMedia("(min-width: 1001px)").addEventListener("change", (m) => {
    if (m.matches) { split.append(side); side.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });

  // Express buttons skip straight to confirmation (demo)
  $$("[data-express]").forEach((b) => b.addEventListener("click", showSuccess));

  // Submit with inline validation
  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();
    let firstBad = null;
    $$("#form [data-req]").forEach((el) => {
      const ok = el.type === "email" ? /\S+@\S+\.\S+/.test(el.value) : isFilled(el);
      el.closest(".f")?.classList.toggle("invalid", !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    const pay = $('input[name="pay"]:checked').value;
    if (pay === "card") {
      [["#cnum", (v) => v.replace(/\D/g, "").length === 16], ["#cexp", (v) => v.length >= 7], ["#ccvc", (v) => v.length === 3]].forEach(([id, test]) => {
        const el = $(id), ok = test(el.value);
        el.closest(".f").classList.toggle("invalid", !ok);
        if (!ok && !firstBad) firstBad = el;
      });
    }
    if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
    const btn = $(".submit[data-buy]");
    btn.classList.add("loading");
    btn.firstChild.textContent = "Processing… ";
    setTimeout(() => { btn.classList.remove("loading"); btn.firstChild.textContent = "Complete order · "; showSuccess(); }, 900);
  });
  document.addEventListener("input", (e) => e.target.closest(".f")?.classList.remove("invalid"));

  Cart.init();
})();
