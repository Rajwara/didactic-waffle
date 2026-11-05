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
   Variant 2 — Step wizard behaviour
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const LABELS = ["Address", "Delivery", "Payment", "Review"];
  let step = 0;
  let addrMode = "saved";

  // Estimated dates
  $$("[data-date]").forEach((el) => {
    const d = new Date();
    d.setDate(d.getDate() + Number(el.dataset.date));
    el.textContent = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  });

  // Saved vs new address
  $$("[data-addr-mode]").forEach((b) =>
    b.addEventListener("click", () => {
      addrMode = b.dataset.addrMode;
      $$("[data-addr-mode]").forEach((x) => x.setAttribute("aria-selected", x === b));
      $$("[data-addr-pane]").forEach((p) => (p.hidden = p.dataset.addrPane !== addrMode));
      update();
    })
  );

  // Payment detail panes
  $$('input[name="pay"]').forEach((r) =>
    r.addEventListener("change", () => {
      $$("[data-detail]").forEach((p) => (p.hidden = p.dataset.detail !== r.dataset.pay));
      update();
    })
  );

  Cart.onChange((t) => {
    $$("[data-installment]").forEach((el) => {
      const n = Number(el.dataset.installment);
      el.textContent = `${n} × ${(t.total / n).toFixed(2)} ₾ · 0%`;
    });
    if (step === 3) buildReview();
  });

  /* --- values for recap / review --- */
  function addressText() {
    if (addrMode === "saved") return $('input[name="address"]:checked')?.value || "";
    const v = (id) => $(id).value.trim();
    return [v("#n-street"), v("#n-city"), $("#n-region").value].filter(Boolean).join(", ");
  }
  const deliveryText = () => $('input[name="delivery"]:checked')?.value || "";
  const payText = () => {
    const r = $('input[name="pay"]:checked');
    if (!r) return "";
    if (r.dataset.pay === "card") {
      const n = $("#p-num").value.replace(/\D/g, "");
      return n ? `Card •••• ${n.slice(-4)}` : "Card";
    }
    return r.value;
  };

  function stepValid(i) {
    if (i === 0) return addrMode === "saved" ? !!$('input[name="address"]:checked') : $$('[data-addr-pane="new"] [data-req]').every(isFilled);
    if (i === 1) return !!$('input[name="delivery"]:checked');
    if (i === 2) {
      const r = $('input[name="pay"]:checked');
      if (!r) return false;
      if (r.dataset.pay !== "card") return true;
      return $("#p-num").value.replace(/\D/g, "").length === 16 && $("#p-exp").value.length >= 7 && $("#p-cvc").value.length === 3;
    }
    return $("#terms").checked;
  }

  function buildRecap() {
    const vals = [addressText(), deliveryText(), payText()];
    $("#recap").innerHTML = vals
      .slice(0, Math.min(step, 3))
      .map((v, i) => `<div class="recap-row"><span class="ok">✓</span><b>${LABELS[i]}</b><span class="v">${v}</span><button type="button" data-goto="${i}">Edit</button></div>`)
      .join("");
  }

  function buildReview() {
    const t = Cart.totals();
    const rows = [
      ["Ship to", addressText(), 0],
      ["Delivery", deliveryText(), 1],
      ["Payment", payText(), 2],
      ["Items", `${t.qty} × DRESSUP Basics Oversized Fleece Hoodie${Cart.state.gift ? " · gift wrapped" : ""}`, null],
    ];
    $("#review").innerHTML =
      rows.map(([k, v, g]) => `<div><dt>${k}</dt><dd>${v}</dd>${g === null ? "<span></span>" : `<button type="button" data-goto="${g}">Edit</button>`}</div>`).join("") +
      `<div class="tot"><dt>Total to pay</dt><dd>${Cart.gel(t.total)}</dd><span></span></div>`;
  }

  function go(i) {
    step = i;
    $$("[data-panel]").forEach((p) => (p.hidden = Number(p.dataset.panel) !== step));
    $$("#stepper li").forEach((li, n) => {
      li.classList.toggle("active", n === step);
      li.classList.toggle("done", n < step);
    });
    $("#recap").hidden = step === 3;
    buildRecap();
    if (step === 3) buildReview();
    $("#prev").setAttribute("aria-hidden", step === 0);
    update();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function update() {
    const t = Cart.totals();
    $("#next").disabled = !stepValid(step);
    $("#next").textContent = step === 3 ? `Pay ${Cart.gel(t.total)}` : `Continue to ${LABELS[step + 1].toLowerCase()}`;
  }

  $("#next").addEventListener("click", () => {
    if (!stepValid(step)) return;
    if (step === 3) return showSuccess();
    go(step + 1);
  });
  $("#prev").addEventListener("click", () => step > 0 && go(step - 1));
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-goto]");
    if (g) go(Number(g.dataset.goto));
    const li = e.target.closest("#stepper li.done");
    if (li) go(Number(li.dataset.step));
  });
  document.addEventListener("input", update);
  document.addEventListener("change", update);
  Cart.onChange(update);

  Cart.init();
  go(0);
})();
