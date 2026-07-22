/* ==========================================================
   Vital40 — App
   Vanilla JS, sin dependencias externas, 100% offline (PWA)
   ========================================================== */

const STORAGE = {
  profile: "vital40_profile",
  plan: "vital40_plan",
  history: "vital40_history",
  nextDay: "vital40_next_day",
};

const state = {
  view: "loading",
  profile: JSON.parse(localStorage.getItem(STORAGE.profile) || "null"),
  plan: JSON.parse(localStorage.getItem(STORAGE.plan) || "null"),
  history: JSON.parse(localStorage.getItem(STORAGE.history) || "[]"),
  nextDayIndex: parseInt(localStorage.getItem(STORAGE.nextDay) || "0", 10),
  session: null, // sesión de entreno activa
  onboardingStep: 0,
  onboardingData: { limitations: [] },
  restTimer: null,
};
window.state = state; // expuesto para depuración (ej. consola del navegador)
window.EXERCISES = EXERCISES;

function saveProfile() { localStorage.setItem(STORAGE.profile, JSON.stringify(state.profile)); }
function savePlan() { localStorage.setItem(STORAGE.plan, JSON.stringify(state.plan)); }
function saveHistory() { localStorage.setItem(STORAGE.history, JSON.stringify(state.history)); }
function saveNextDay() { localStorage.setItem(STORAGE.nextDay, String(state.nextDayIndex)); }

const root = document.getElementById("app");

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

function setView(v) { state.view = v; render(); window.scrollTo(0, 0); }

/* ---------------- BADGES / MODAL "CÓMO SE HACE" ---------------- */

function patternBadge(pattern) {
  const meta = PATTERN_META[pattern] || { label: pattern, color: "#999", icon: "•" };
  return el("span", { class: "badge", style: `background:${meta.color}22; color:${meta.color}; border:1px solid ${meta.color}55;` },
    `${meta.icon} ${meta.label}`);
}

function infoButton(ex) {
  return el("button", {
    class: "info-btn",
    "aria-label": "Cómo se hace",
    onclick: (e) => { e.preventDefault(); e.stopPropagation(); showExerciseInfo(ex); },
  }, "i");
}

function showExerciseInfo(ex) {
  const overlay = el("div", { class: "modal-overlay", onclick: (e) => { if (e.target === overlay) overlay.remove(); } });
  const meta = PATTERN_META[ex.pattern] || {};
  const card = el("div", { class: "modal-card" });
  card.appendChild(el("div", { class: "modal-header" }, [
    patternBadge(ex.pattern),
    el("button", { class: "modal-close", onclick: () => overlay.remove() }, "✕"),
  ]));
  card.appendChild(el("h2", {}, ex.name));
  if (ex.steps && ex.steps.length) {
    const ol = el("ol", { class: "steps-list" });
    ex.steps.forEach((s) => ol.appendChild(el("li", {}, s)));
    card.appendChild(ol);
  }
  if (ex.cue) {
    card.appendChild(el("div", { class: "cue-box" }, `💡 ${ex.cue}`));
  }
  card.appendChild(el("button", { class: "btn-primary big", onclick: () => overlay.remove() }, "Entendido"));
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

/* ---------------- ONBOARDING ---------------- */

const ONBOARD_STEPS = ["sexo", "edad", "nivel", "objetivo", "dias", "equipamiento", "limitaciones", "resumen"];

function renderOnboarding() {
  const step = ONBOARD_STEPS[state.onboardingStep];
  const d = state.onboardingData;
  const container = el("div", { class: "screen onboarding" });

  container.appendChild(el("div", { class: "progress-bar" }, [
    el("div", { class: "progress-fill", style: `width:${((state.onboardingStep + 1) / ONBOARD_STEPS.length) * 100}%` }),
  ]));

  const card = el("div", { class: "card" });

  if (step === "sexo") {
    card.appendChild(el("h2", {}, "¿Con qué perfil querés que ajustemos la rutina?"));
    card.appendChild(el("p", { class: "hint" }, "Solo se usa para adaptar sugerencias generales de volumen; siempre podés cambiarlo."));
    card.appendChild(optionGroup(["Mujer", "Hombre", "Prefiero no decirlo"], d.sexo, (v) => { d.sexo = v; render(); }));
  }

  if (step === "edad") {
    card.appendChild(el("h2", {}, "¿En qué rango de edad estás?"));
    card.appendChild(optionGroup(["40-49", "50-59", "60-69", "70+"], d.edad, (v) => { d.edad = v; render(); }));
  }

  if (step === "nivel") {
    card.appendChild(el("h2", {}, "¿Cuál es tu nivel de entrenamiento actual?"));
    card.appendChild(optionGroup(
      ["principiante", "intermedio", "avanzado"],
      d.nivel,
      (v) => { d.nivel = v; render(); },
      { principiante: "Principiante — recién empiezo o retomo", intermedio: "Intermedio — entreno con cierta regularidad", avanzado: "Avanzado — entreno hace años sin pausas largas" }
    ));
  }

  if (step === "objetivo") {
    card.appendChild(el("h2", {}, "¿Cuál es tu objetivo principal?"));
    card.appendChild(optionGroup(
      ["fuerza", "perdida_grasa", "resistencia_cardio", "movilidad", "mantenimiento"],
      d.objetivo,
      (v) => { d.objetivo = v; render(); },
      GOAL_LABELS
    ));
  }

  if (step === "dias") {
    card.appendChild(el("h2", {}, "¿Cuántos días por semana podés entrenar?"));
    card.appendChild(optionGroup(["2", "3", "4", "5"], d.dias ? String(d.dias) : null, (v) => { d.dias = parseInt(v, 10); render(); }));
  }

  if (step === "equipamiento") {
    card.appendChild(el("h2", {}, "¿Qué equipamiento tenés disponible?"));
    card.appendChild(optionGroup(
      ["ninguno", "mancuernas", "gym"],
      d.equipamiento,
      (v) => { d.equipamiento = v; render(); },
      { ninguno: "Nada — solo mi cuerpo, en casa", mancuernas: "Mancuernas y/o bandas elásticas", gym: "Acceso a un gimnasio completo" }
    ));
  }

  if (step === "limitaciones") {
    card.appendChild(el("h2", {}, "¿Alguna molestia o limitación a tener en cuenta?"));
    card.appendChild(el("p", { class: "hint" }, "Elegí todas las que apliquen. Ajustamos los ejercicios para cuidar esas zonas."));
    const opts = ["rodilla", "hombro", "espalda_baja"];
    const wrap = el("div", { class: "option-group" });
    opts.forEach((op) => {
      const active = d.limitations.includes(op);
      wrap.appendChild(el("button", {
        class: "option-btn" + (active ? " active" : ""),
        onclick: () => {
          d.limitations = active ? d.limitations.filter((x) => x !== op) : [...d.limitations, op];
          render();
        },
      }, LIMITATION_LABELS[op]));
    });
    wrap.appendChild(el("button", {
      class: "option-btn" + (d.limitations.length === 0 ? " active" : ""),
      onclick: () => { d.limitations = []; render(); },
    }, "Ninguna"));
    card.appendChild(wrap);
  }

  if (step === "resumen") {
    card.appendChild(el("h2", {}, "¡Listo! Este es tu perfil"));
    const list = el("ul", { class: "summary-list" });
    list.appendChild(el("li", {}, `Perfil: ${d.sexo}`));
    list.appendChild(el("li", {}, `Edad: ${d.edad}`));
    list.appendChild(el("li", {}, `Nivel: ${d.nivel}`));
    list.appendChild(el("li", {}, `Objetivo: ${GOAL_LABELS[d.objetivo]}`));
    list.appendChild(el("li", {}, `Días por semana: ${d.dias}`));
    list.appendChild(el("li", {}, `Equipamiento: ${d.equipamiento}`));
    list.appendChild(el("li", {}, `Limitaciones: ${d.limitations.length ? d.limitations.map((l) => LIMITATION_LABELS[l]).join(", ") : "Ninguna"}`));
    card.appendChild(list);
    card.appendChild(el("button", {
      class: "btn-primary big",
      onclick: () => {
        state.profile = {
          sexo: d.sexo, edad: d.edad, level: d.nivel, goal: d.objetivo,
          daysPerWeek: d.dias, equipment: d.equipamiento, limitations: d.limitations,
        };
        saveProfile();
        state.plan = generateRoutine(state.profile);
        savePlan();
        state.nextDayIndex = 0;
        saveNextDay();
        setView("home");
      },
    }, "Generar mi rutina"));
  }

  container.appendChild(card);

  const nav = el("div", { class: "nav-buttons" });
  if (state.onboardingStep > 0) {
    nav.appendChild(el("button", { class: "btn-secondary", onclick: () => { state.onboardingStep--; render(); } }, "Atrás"));
  } else {
    nav.appendChild(el("span"));
  }
  if (step !== "resumen") {
    const canAdvance = isStepValid(step, d);
    nav.appendChild(el("button", {
      class: "btn-primary" + (canAdvance ? "" : " disabled"),
      onclick: () => { if (canAdvance) { state.onboardingStep++; render(); } },
    }, "Siguiente"));
  }
  container.appendChild(nav);

  return container;
}

function isStepValid(step, d) {
  if (step === "sexo") return !!d.sexo;
  if (step === "edad") return !!d.edad;
  if (step === "nivel") return !!d.nivel;
  if (step === "objetivo") return !!d.objetivo;
  if (step === "dias") return !!d.dias;
  if (step === "equipamiento") return !!d.equipamiento;
  if (step === "limitaciones") return true;
  return true;
}

function optionGroup(values, current, onPick, labels = null) {
  const wrap = el("div", { class: "option-group" });
  values.forEach((v) => {
    const label = labels ? labels[v] : v;
    wrap.appendChild(el("button", {
      class: "option-btn" + (current === v ? " active" : ""),
      onclick: () => onPick(v),
    }, label));
  });
  return wrap;
}

/* ---------------- HOME ---------------- */

function computeStats() {
  const total = state.history.length;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeek = state.history.filter((h) => new Date(h.date) >= startOfWeek).length;

  // racha: días distintos consecutivos con al menos una sesión, contando hacia atrás desde hoy/ayer
  const days = new Set(state.history.map((h) => new Date(h.date).toDateString()));
  let streak = 0;
  let cursor = new Date();
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  if (streak === 0) {
    cursor = new Date();
    cursor.setDate(cursor.getDate() - 1);
    while (days.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }
  return { total, thisWeek, streak };
}

function renderHome() {
  const container = el("div", { class: "screen" });
  const stats = computeStats();
  const nextDay = state.plan.days[state.nextDayIndex % state.plan.days.length];

  container.appendChild(el("div", { class: "hero" }, [
    el("h1", {}, "Hola 👋"),
    el("p", { class: "hint" }, `Objetivo: ${GOAL_LABELS[state.profile.goal]}`),
  ]));

  const statsRow = el("div", { class: "stats-row" }, [
    statCard(stats.total, "Entrenos totales"),
    statCard(stats.thisWeek, "Esta semana"),
    statCard(stats.streak, "Racha (días)"),
  ]);
  container.appendChild(statsRow);

  const nextCard = el("div", { class: "card highlight" });
  nextCard.appendChild(el("p", { class: "eyebrow" }, `Día ${nextDay.day} de ${state.plan.days.length}`));
  nextCard.appendChild(el("h2", {}, nextDay.label));
  nextCard.appendChild(el("p", { class: "hint" }, `${nextDay.main.length} ejercicios principales · calentamiento y estiramiento incluidos`));
  const dayIdx = state.nextDayIndex % state.plan.days.length;
  nextCard.appendChild(el("div", { class: "nav-buttons" }, [
    el("button", { class: "btn-secondary", onclick: () => { state.previewDayIndex = dayIdx; setView("preview"); } }, "Ver rutina completa"),
    el("button", { class: "btn-primary", onclick: () => startSession(dayIdx) }, "Empezar"),
  ]));
  container.appendChild(nextCard);

  const tipCard = el("div", { class: "card tip" });
  tipCard.appendChild(el("p", {}, "💡 Consejo: para registrar series sin abrir el celular en cada toque, instalá también Hevy (gratis) — Vital40 se enfoca en armarte el plan a tu medida."));
  container.appendChild(tipCard);

  return container;
}

function statCard(value, label) {
  return el("div", { class: "stat-card" }, [
    el("div", { class: "stat-value" }, String(value)),
    el("div", { class: "stat-label" }, label),
  ]);
}

/* ---------------- VISTA PREVIA DE LA RUTINA ---------------- */

function renderPreview() {
  const dayIdx = state.previewDayIndex ?? (state.nextDayIndex % state.plan.days.length);
  const day = state.plan.days[dayIdx];
  const container = el("div", { class: "screen" });

  container.appendChild(el("div", { class: "workout-header" }, [
    el("button", { class: "link-btn", onclick: () => setView("home") }, "← Volver"),
    el("h3", {}, `${day.label} — vista previa`),
  ]));

  container.appendChild(el("div", { class: "card" }, [
    el("p", { class: "eyebrow" }, "Calentamiento"),
    ...day.warmup.map((it) => previewRow(it, false, dayIdx)),
  ]));

  const mainCard = el("div", { class: "card" });
  mainCard.appendChild(el("p", { class: "eyebrow" }, "Ejercicios principales"));
  mainCard.appendChild(el("p", { class: "hint" }, "Tocá \"Cambiar\" para sustituir cualquier ejercicio por una alternativa equivalente."));
  day.main.forEach((it) => mainCard.appendChild(previewRow(it, true, dayIdx)));
  container.appendChild(mainCard);

  container.appendChild(el("div", { class: "card" }, [
    el("p", { class: "eyebrow" }, "Estiramiento final"),
    ...day.cooldown.map((it) => previewRow(it, false, dayIdx)),
  ]));

  container.appendChild(el("button", {
    class: "btn-primary big",
    onclick: () => startSession(dayIdx),
  }, "Empezar este entrenamiento"));

  return container;
}

function previewRow(ex, swappable, dayIdx) {
  const meta = PATTERN_META[ex.pattern] || {};
  const row = el("div", { class: "preview-row" });
  row.appendChild(el("div", { class: "preview-row-main" }, [
    el("div", { class: "preview-row-top" }, [
      patternBadge(ex.pattern),
    ]),
    el("div", { class: "ex-name" }, ex.name),
    ex.sets ? el("div", { class: "hint" }, `${ex.sets} series × ${ex.reps}`) : null,
  ]));
  const actions = el("div", { class: "preview-row-actions" });
  actions.appendChild(infoButton(ex));
  if (swappable) {
    actions.appendChild(el("button", {
      class: "swap-btn",
      onclick: () => openSwapPicker(ex, dayIdx),
    }, "Cambiar"));
  }
  row.appendChild(actions);
  return row;
}

function openSwapPicker(ex, dayIdx) {
  const day = state.plan.days[dayIdx];
  const usedIds = [...day.warmup, ...day.main, ...day.cooldown].map((e) => e.id);
  const alternatives = getAlternatives(ex, state.profile, usedIds);

  const overlay = el("div", { class: "modal-overlay", onclick: (e) => { if (e.target === overlay) overlay.remove(); } });
  const card = el("div", { class: "modal-card" });
  card.appendChild(el("div", { class: "modal-header" }, [
    patternBadge(ex.pattern),
    el("button", { class: "modal-close", onclick: () => overlay.remove() }, "✕"),
  ]));
  card.appendChild(el("h2", {}, `Cambiar "${ex.name}"`));

  if (alternatives.length === 0) {
    card.appendChild(el("p", { class: "hint" }, "No hay otra alternativa disponible con tu equipamiento y limitaciones actuales."));
  } else {
    const list = el("div", { class: "alt-list" });
    alternatives.forEach((alt) => {
      const row = el("div", { class: "alt-row" });
      row.appendChild(el("div", { class: "ex-name" }, alt.name));
      const btns = el("div", { class: "preview-row-actions" });
      btns.appendChild(infoButton(alt));
      btns.appendChild(el("button", {
        class: "swap-btn",
        onclick: () => {
          const idx = day.main.findIndex((m) => m.id === ex.id);
          if (idx !== -1) {
            day.main[idx] = { ...alt, sets: ex.sets, reps: ex.reps, rest: ex.rest };
            savePlan();
          }
          overlay.remove();
          render();
        },
      }, "Usar este"));
      row.appendChild(btns);
      list.appendChild(row);
    });
    card.appendChild(list);
  }
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

/* ---------------- WORKOUT SESSION ---------------- */

function startSession(dayIndex) {
  const day = state.plan.days[dayIndex];
  state.session = {
    dayIndex,
    day,
    phase: "warmup", // warmup -> exercises -> cooldown -> done
    exerciseIndex: 0,
    setIndex: 0,
    log: [], // { exerciseId, name, sets: [{weight, reps}] }
    startedAt: Date.now(),
  };
  setView("workout");
}

function renderWorkout() {
  const s = state.session;
  const container = el("div", { class: "screen workout" });

  container.appendChild(el("div", { class: "workout-header" }, [
    el("button", { class: "link-btn", onclick: () => { if (confirm("¿Salir del entrenamiento? Se perderá el progreso de esta sesión.")) setView("home"); } }, "✕ Salir"),
    el("h3", {}, s.day.label),
  ]));

  if (s.phase === "warmup") {
    container.appendChild(checklistPhase("Calentamiento", s.day.warmup, () => { s.phase = "exercises"; render(); }, "Comenzar ejercicios"));
  } else if (s.phase === "cooldown") {
    container.appendChild(checklistPhase("Estiramiento final", s.day.cooldown, () => finishSession(), "Terminar entrenamiento"));
  } else if (s.phase === "exercises") {
    container.appendChild(renderExercisePhase());
  } else if (s.phase === "done") {
    container.appendChild(renderSummary());
  }

  return container;
}

function checklistPhase(title, items, onDone, doneLabel) {
  const wrap = el("div", { class: "card" });
  wrap.appendChild(el("h2", {}, title));
  const list = el("div", { class: "checklist" });
  items.forEach((it) => {
    const row = el("label", { class: "check-row" });
    const box = el("input", { type: "checkbox" });
    row.appendChild(box);
    row.appendChild(el("div", { class: "check-row-body" }, [
      el("div", { class: "ex-name" }, it.name),
      el("div", { class: "ex-cue" }, it.cue),
    ]));
    row.appendChild(infoButton(it));
    list.appendChild(row);
  });
  wrap.appendChild(list);
  wrap.appendChild(el("button", { class: "btn-primary big", onclick: onDone }, doneLabel));
  return wrap;
}

function renderExercisePhase() {
  const s = state.session;
  const ex = s.day.main[s.exerciseIndex];
  const wrap = el("div", { class: "card" });

  wrap.appendChild(el("p", { class: "eyebrow" }, `Ejercicio ${s.exerciseIndex + 1} de ${s.day.main.length}`));
  wrap.appendChild(el("div", { class: "ex-title-row" }, [
    el("h2", {}, ex.name),
    infoButton(ex),
  ]));
  wrap.appendChild(patternBadge(ex.pattern));
  wrap.appendChild(el("p", { class: "hint", style: "margin-top:10px;" }, ex.cue));
  wrap.appendChild(el("p", { class: "target" }, `Objetivo: ${ex.sets} series × ${ex.reps} · descanso ${ex.rest}s`));

  if (!s.log[s.exerciseIndex]) {
    s.log[s.exerciseIndex] = { exerciseId: ex.id, name: ex.name, sets: [] };
  }
  const exLog = s.log[s.exerciseIndex];

  const setsWrap = el("div", { class: "sets-wrap" });
  for (let i = 0; i < ex.sets; i++) {
    const done = exLog.sets[i];
    const row = el("div", { class: "set-row" + (done ? " done" : "") });
    row.appendChild(el("span", { class: "set-num" }, `Serie ${i + 1}`));
    const weightInput = el("input", { type: "number", inputmode: "decimal", placeholder: "kg", class: "mini-input", value: done ? done.weight : "" });
    const repsInput = el("input", { type: "number", inputmode: "numeric", placeholder: "reps", class: "mini-input", value: done ? done.reps : "" });
    row.appendChild(weightInput);
    row.appendChild(repsInput);
    row.appendChild(el("button", {
      class: "btn-check" + (done ? " checked" : ""),
      onclick: () => {
        exLog.sets[i] = { weight: weightInput.value || "0", reps: repsInput.value || ex.reps };
        startRest(ex.rest);
      },
    }, done ? "✓" : "Marcar"));
    setsWrap.appendChild(row);
  }
  wrap.appendChild(setsWrap);

  const nav = el("div", { class: "nav-buttons" });
  if (s.exerciseIndex > 0) {
    nav.appendChild(el("button", { class: "btn-secondary", onclick: () => { s.exerciseIndex--; render(); } }, "Anterior"));
  } else {
    nav.appendChild(el("span"));
  }
  const isLast = s.exerciseIndex === s.day.main.length - 1;
  nav.appendChild(el("button", {
    class: "btn-primary",
    onclick: () => {
      if (isLast) { s.phase = "cooldown"; render(); }
      else { s.exerciseIndex++; render(); }
    },
  }, isLast ? "Ir a estiramiento" : "Siguiente ejercicio"));
  wrap.appendChild(nav);

  return wrap;
}

function startRest(seconds) {
  clearInterval(state.restTimer);
  const overlay = el("div", { class: "rest-overlay", id: "rest-overlay" });
  let remaining = seconds;
  const timeEl = el("div", { class: "rest-time" }, formatTime(remaining));
  overlay.appendChild(el("div", { class: "rest-label" }, "Descanso"));
  overlay.appendChild(timeEl);
  overlay.appendChild(el("button", {
    class: "btn-secondary",
    onclick: () => { clearInterval(state.restTimer); overlay.remove(); },
  }, "Saltar descanso"));
  document.body.appendChild(overlay);

  state.restTimer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(state.restTimer);
      timeEl.textContent = "¡Listo!";
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      beep();
      setTimeout(() => { overlay.remove(); render(); }, 900);
    } else {
      timeEl.textContent = formatTime(remaining);
    }
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) { /* audio no disponible */ }
}

function finishSession() {
  const s = state.session;
  const totalSets = s.log.reduce((acc, e) => acc + (e ? e.sets.length : 0), 0);
  const record = {
    date: new Date().toISOString(),
    dayLabel: s.day.label,
    exercises: s.log.filter(Boolean),
    totalSets,
    durationMin: Math.round((Date.now() - s.startedAt) / 60000),
  };
  state.history.unshift(record);
  saveHistory();
  state.nextDayIndex = (s.dayIndex + 1) % state.plan.days.length;
  saveNextDay();
  s.phase = "done";
  render();
}

function renderSummary() {
  const s = state.session;
  const last = state.history[0];
  const wrap = el("div", { class: "card center" });
  wrap.appendChild(el("div", { class: "big-emoji" }, "✅"));
  wrap.appendChild(el("h2", {}, "¡Entrenamiento completado!"));
  wrap.appendChild(el("p", { class: "hint" }, `${last.totalSets} series registradas · ${last.durationMin} min`));
  wrap.appendChild(el("button", { class: "btn-primary big", onclick: () => { state.session = null; setView("home"); } }, "Volver al inicio"));
  return wrap;
}

/* ---------------- HISTORIAL ---------------- */

function renderHistory() {
  const container = el("div", { class: "screen" });
  container.appendChild(el("h1", {}, "Historial"));
  if (state.history.length === 0) {
    container.appendChild(el("p", { class: "hint" }, "Todavía no completaste ningún entrenamiento."));
    return container;
  }
  const list = el("div", { class: "history-list" });
  state.history.forEach((h) => {
    const d = new Date(h.date);
    const item = el("div", { class: "card history-item" });
    item.appendChild(el("div", { class: "history-date" }, d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })));
    item.appendChild(el("div", { class: "ex-name" }, h.dayLabel));
    item.appendChild(el("div", { class: "hint" }, `${h.totalSets} series · ${h.durationMin} min`));
    list.appendChild(item);
  });
  container.appendChild(list);
  return container;
}

/* ---------------- AJUSTES ---------------- */

function renderSettings() {
  const container = el("div", { class: "screen" });
  container.appendChild(el("h1", {}, "Ajustes"));

  const card = el("div", { class: "card" });
  card.appendChild(el("p", {}, [el("b", {}, "Perfil: "), `${state.profile.sexo}, ${state.profile.edad}, nivel ${state.profile.level}`]));
  card.appendChild(el("p", {}, [el("b", {}, "Objetivo: "), GOAL_LABELS[state.profile.goal]]));
  card.appendChild(el("p", {}, [el("b", {}, "Días por semana: "), String(state.profile.daysPerWeek)]));
  card.appendChild(el("p", {}, [el("b", {}, "Equipamiento: "), state.profile.equipment]));
  card.appendChild(el("p", {}, [el("b", {}, "Limitaciones: "), state.profile.limitations.length ? state.profile.limitations.map((l) => LIMITATION_LABELS[l]).join(", ") : "Ninguna"]));
  container.appendChild(card);

  container.appendChild(el("button", {
    class: "btn-primary big",
    onclick: () => {
      if (confirm("Esto va a generar una rutina nueva con tu perfil actual. ¿Continuar?")) {
        state.plan = generateRoutine(state.profile);
        savePlan();
        state.nextDayIndex = 0;
        saveNextDay();
        setView("home");
      }
    },
  }, "Regenerar rutina"));

  container.appendChild(el("button", {
    class: "btn-secondary big",
    onclick: () => {
      if (confirm("Vas a volver a completar el cuestionario inicial. Tu historial se conserva.")) {
        state.onboardingStep = 0;
        state.onboardingData = { limitations: [] };
        setView("onboarding");
      }
    },
  }, "Editar perfil completo"));

  container.appendChild(el("button", {
    class: "btn-danger big",
    onclick: () => {
      if (confirm("Esto borra todo: perfil, rutina e historial. ¿Estás seguro?")) {
        localStorage.clear();
        location.reload();
      }
    },
  }, "Borrar todos mis datos"));

  return container;
}

/* ---------------- LAYOUT / NAV ---------------- */

function renderNavBar() {
  const items = [
    ["home", "🏠", "Inicio"],
    ["history", "📅", "Historial"],
    ["settings", "⚙️", "Ajustes"],
  ];
  const bar = el("div", { class: "navbar" });
  items.forEach(([v, icon, label]) => {
    bar.appendChild(el("button", {
      class: "nav-item" + (state.view === v ? " active" : ""),
      onclick: () => setView(v),
    }, [el("div", { class: "nav-icon" }, icon), el("div", { class: "nav-label" }, label)]));
  });
  return bar;
}

function render() {
  root.innerHTML = "";
  let screen;
  if (state.view === "onboarding") {
    screen = renderOnboarding();
  } else if (state.view === "home") {
    screen = renderHome();
  } else if (state.view === "preview") {
    screen = renderPreview();
  } else if (state.view === "workout") {
    screen = renderWorkout();
  } else if (state.view === "history") {
    screen = renderHistory();
  } else if (state.view === "settings") {
    screen = renderSettings();
  }
  root.appendChild(screen);

  if (["home", "history", "settings"].includes(state.view)) {
    root.appendChild(renderNavBar());
  }
}

/* ---------------- INIT ---------------- */

function init() {
  if (state.profile && state.plan) {
    state.view = "home";
  } else {
    state.view = "onboarding";
  }
  render();
}

init();

/* ---------------- PWA: instalación y service worker ---------------- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}

let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = document.getElementById("install-btn");
  if (btn) btn.classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("install-btn");
  if (btn) {
    btn.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      btn.classList.add("hidden");
    });
  }
});
