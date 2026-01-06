function joinWaitlist(e) {
  e.preventDefault();
  document.getElementById("success").classList.remove("hidden");
}

function showPass() {
  const f = document.getElementById("feedback");
  f.innerHTML = "Good control. Energy stayed consistent.";
  f.classList.remove("hidden");
}

function showFail() {
  const f = document.getElementById("feedback");
  f.innerHTML = "Energy rose too fast. Let the groove breathe.";
  f.classList.remove("hidden");
}
// ====== Mixdash Demo V2 State ======
let demo = {
  running: false,
  beat: 78,
  trans: 65,
  time: 80,
  taste: 35, // 0-100 (visual only)
  events: [],
  result: "WAITING",
};

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function setStatus(text, badge){
  const st = document.getElementById("statusText");
  const sb = document.getElementById("statusBadge");
  if(st) st.textContent = text;
  if(sb) sb.textContent = badge || "READY";
}

function setResultBadge(text){
  const rb = document.getElementById("resultBadge");
  if(rb) rb.textContent = text;
}

function pushTimeline(label){
  demo.events.unshift({ t: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), label });
  renderTimeline();
}

function renderTimeline(){
  const el = document.getElementById("timeline");
  if(!el) return;
  if(demo.events.length === 0){
    el.innerHTML = `<div class="tlItem"><span class="dot"></span><span class="muted">No events yet</span></div>`;
    return;
  }
  el.innerHTML = demo.events.slice(0,6).map(e =>
    `<div class="tlItem"><span class="dot"></span><span class="muted">${e.t}</span><span>${e.label}</span></div>`
  ).join("");
}

function renderBars(){
  const sBeat = document.getElementById("sBeat");
  const sTrans = document.getElementById("sTrans");
  const sTime = document.getElementById("sTime");
  const sTaste = document.getElementById("sTaste");

  const bBeat = document.getElementById("bBeat");
  const bTrans = document.getElementById("bTrans");
  const bTime = document.getElementById("bTime");
  const bTaste = document.getElementById("bTaste");

  if(sBeat) sBeat.textContent = `${demo.beat}%`;
  if(sTrans) sTrans.textContent = `${demo.trans}%`;
  if(sTime) sTime.textContent = `${demo.time}%`;
  if(sTaste) sTaste.textContent = demo.taste >= 60 ? "Strong" : demo.taste >= 40 ? "Improving" : "Developing";

  if(bBeat) bBeat.style.width = `${demo.beat}%`;
  if(bTrans) bTrans.style.width = `${demo.trans}%`;
  if(bTime) bTime.style.width = `${demo.time}%`;
  if(bTaste) bTaste.style.width = `${demo.taste}%`;
}

function renderMicroNotes(text){
  const el = document.getElementById("microNotes");
  if(!el) return;
  el.innerHTML = `<div class="note">${text}</div>`;
}

function renderResults(panelHtml, feedbackLines){
  const panel = document.getElementById("resultPanel");
  const cards = document.getElementById("feedbackCards");
  if(panel) panel.innerHTML = panelHtml;

  if(cards){
    cards.innerHTML = feedbackLines.map(line => `<div class="miniCard">“${line}”</div>`).join("");
  }
}

function setControls(){
  const start = document.getElementById("btnStart");
  const right = document.getElementById("btnRight");
  const off = document.getElementById("btnOff");
  const end = document.getElementById("btnEnd");
  if(!start || !right || !off || !end) return;

  start.disabled = demo.running;
  right.disabled = !demo.running;
  off.disabled = !demo.running;
  end.disabled = !demo.running;
}

function renderDemo(){
  renderBars();
  renderTimeline();
  setControls();
  setResultBadge(demo.result);
}

// ====== Actions ======
function startSession(){
  demo.running = true;
  demo.result = "RUNNING";
  setStatus("AI listening…", "LISTENING");
  setResultBadge("RUNNING");
  pushTimeline("Session started");
  renderMicroNotes("Listening for timing, transitions, and energy control.");
  setControls();
}

function feltRight(){
  if(!demo.running) return;
  demo.trans = clamp(demo.trans + 2, 0, 100);
  demo.time = clamp(demo.time + 1, 0, 100);
  demo.taste = clamp(demo.taste + 4, 0, 100);
  pushTimeline("Transition felt right");
  renderMicroNotes("Good control. Keep the groove stable.");
  renderBars();
}

function feltOff(){
  if(!demo.running) return;
  demo.trans = clamp(demo.trans - 1, 0, 100);
  demo.taste = clamp(demo.taste - 2, 0, 100);
  pushTimeline("Transition felt off");
  renderMicroNotes("Energy rose too fast. Let the groove breathe longer.");
  renderBars();
}

function endSession(){
  if(!demo.running) return;
  demo.running = false;const btnNext = document.getElementById("btnNext");
if(btnNext) btnNext.disabled = (demo.result !== "PASS");


  // Determine result (demo logic)
  const pass = (demo.trans >= 68 && demo.time >= 80 && demo.taste >= 40);

  demo.result = pass ? "PASS" : "NEEDS WORK";
  setStatus("AI analyzing…", "ANALYZING");
  pushTimeline("Session ended");
  setControls();

  // Fake analysis delay (feels real)
  setTimeout(() => {
    setStatus("Session analyzed", demo.result);
    setResultBadge(demo.result);

    const panelHtml = `
      <div><b>Session result:</b> ${demo.result}</div>
      <div class="muted" style="margin-top:6px;">Summary</div>
      <div>Beatmatching: <b>${demo.beat}%</b></div>
      <div>Transitions: <b>${demo.trans}%</b></div>
      <div>Timing: <b>${demo.time}%</b></div>
      <div>Taste / Flow: <b>${demo.taste >= 60 ? "Strong" : demo.taste >= 40 ? "Improving" : "Developing"}</b></div>
    `;

    const feedback = pass
      ? [
          "Good control. Energy stayed consistent.",
          "Transitions fit the groove.",
          "Keep blends minimal and intentional."
        ]
      : [
          "This transition is too short.",
          "Energy rises too fast.",
          "Let the groove breathe longer."
        ];

    renderResults(panelHtml, feedback);
    renderMicroNotes(pass ? "Nice. Next mission unlocks: controlled EQ blending." : "Retry the mission with longer blends and smaller corrections.");
  }, 700);
}

function simulatePass(){
  if(!demo.running) startSession();
  demo.trans = 74; demo.time = 84; demo.taste = 55;
  pushTimeline("Simulated PASS");
  endSession();
}

function simulateFail(){
  if(!demo.running) startSession();
  demo.trans = 62; demo.time = 78; demo.taste = 33;
  pushTimeline("Simulated FAIL");
  endSession();
}

function resetDemo(){
  demo = { running:false, beat:78, trans:65, time:80, taste:35, events:[], result:"WAITING" };
  setStatus("Idle", "READY");
  renderResults(`<div class="muted">End a session to see the result.</div>`, ["No feedback yet."]);
  renderMicroNotes("Waiting for a session.");
  renderDemo();
}
let demo = {
  running:false,
  beat:78,
  trans:65,
  time:80,
  taste:40,
  events:[]
};

function renderDemo(){
  document.getElementById("bBeat").style.width = demo.beat+"%";
  document.getElementById("bTrans").style.width = demo.trans+"%";
  document.getElementById("bTime").style.width = demo.time+"%";
  document.getElementById("bTaste").style.width = demo.taste+"%";
}

function startSession(){
  demo.running=true;
  document.getElementById("statusText").innerText="AI listening…";
  document.getElementById("statusBadge").innerText="LISTENING";
  toggleButtons(true);
}

function feltRight(){
  demo.trans+=2;
  demo.taste+=3;
  addEvent("Transition felt right");
  renderDemo();
}

function feltOff(){
  demo.trans-=1;
  demo.taste-=2;
  addEvent("Transition felt off");
  renderDemo();
}

function endSession(){
  demo.running=false;
  document.getElementById("statusText").innerText="Analyzed";
  document.getElementById("statusBadge").innerText="DONE";

  document.getElementById("resultPanel").innerHTML = `
    Beatmatching: ${demo.beat}%<br>
    Transitions: ${demo.trans}%<br>
    Timing: ${demo.time}%<br>
    <b>Taste: Improving</b>
  `;

  document.getElementById("feedbackCards").innerHTML = `
    <div>“Energy rose too fast.”</div>
    <div>“Let the groove breathe longer.”</div>
  `;

  toggleButtons(false);
}

function toggleButtons(on){
  document.getElementById("btnRight").disabled=!on;
  document.getElementById("btnOff").disabled=!on;
  document.getElementById("btnEnd").disabled=!on;
}

function addEvent(text){
  const el=document.getElementById("timeline");
  el.innerHTML+=`<div>${text}</div>`;
}
function nextMission(){
  const missionEl = document.querySelector(".missionText");
  if(missionEl) missionEl.textContent = "Keep energy stable through a 32-bar blend.";
  pushTimeline("Next mission unlocked");
  renderMicroNotes("New mission ready. Focus on control, not speed.");
  document.getElementById("btnNext").disabled = true;
}
// ===== Immersive demo behaviour =====
let demo = { running:false, beat:78, trans:65, time:80, taste:35, events:[], result:"READY" };
let presenceTimer = null;

function clamp(n,min,max){ return Math.max(min, Math.min(max,n)); }

function bootPresence(){
  const lines = [
    "Most DJs rush transitions here.",
    "Good DJs manage technique. Great DJs manage energy.",
    "Taste is built in moments like this.",
    "Control beats complexity.",
    "Let the groove breathe."
  ];
  let i = 0;
  const coach = document.getElementById("coachLine");
  if(!coach) return;
  if(presenceTimer) clearInterval(presenceTimer);
  presenceTimer = setInterval(() => {
    i = (i + 1) % lines.length;
    coach.textContent = lines[i];
  }, 3500);
}

function setPresence(status, hint){
  const st = document.getElementById("presenceStatus");
  const hi = document.getElementById("presenceHint");
  if(st) st.textContent = status;
  if(hi) hi.textContent = hint || "";
}

function pushTimeline(label){
  demo.events.unshift({ t: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), label });
  renderTimeline();
}

function renderTimeline(){
  const el = document.getElementById("timeline");
  if(!el) return;
  if(demo.events.length === 0){
    el.innerHTML = `<div class="tlItem"><span class="dot"></span><span class="muted">No events yet</span></div>`;
    return;
  }
  el.innerHTML = demo.events.slice(0,6).map(e =>
    `<div class="tlItem"><span class="dot"></span><span class="muted">${e.t}</span><span>${e.label}</span></div>`
  ).join("");
}

function renderBars(){
  const sBeat = document.getElementById("sBeat");
  const sTrans = document.getElementById("sTrans");
  const sTime = document.getElementById("sTime");
  const sTaste = document.getElementById("sTaste");
  const bBeat = document.getElementById("bBeat");
  const bTrans = document.getElementById("bTrans");
  const bTime = document.getElementById("bTime");
  const bTaste = document.getElementById("bTaste");

  if(sBeat) sBeat.textContent = `${demo.beat}%`;
  if(sTrans) sTrans.textContent = `${demo.trans}%`;
  if(sTime) sTime.textContent = `${demo.time}%`;
  if(sTaste) sTaste.textContent = demo.taste >= 60 ? "Strong" : demo.taste >= 40 ? "Improving" : "Developing";

  if(bBeat) bBeat.style.width = `${demo.beat}%`;
  if(bTrans) bTrans.style.width = `${demo.trans}%`;
  if(bTime) bTime.style.width = `${demo.time}%`;
  if(bTaste) bTaste.style.width = `${demo.taste}%`;
}

function setControls(){
  const start = document.getElementById("btnStart");
  const right = document.getElementById("btnRight");
  const off = document.getElementById("btnOff");
  const end = document.getElementById("btnEnd");
  const next = document.getElementById("btnNext");
  if(!start || !right || !off || !end) return;

  start.disabled = demo.running;
  right.disabled = !demo.running;
  off.disabled = !demo.running;
  end.disabled = !demo.running;
  if(next) next.disabled = true; // unlock only on PASS
}

function renderMicro(text){
  const el = document.getElementById("microNotes");
  if(!el) return;
  el.innerHTML = `<div class="note">${text}</div>`;
}

function renderResults(panelHtml, feedbackLines){
  const panel = document.getElementById("resultPanel");
  const cards = document.getElementById("feedbackCards");
  if(panel) panel.innerHTML = panelHtml;
  if(cards){
    cards.innerHTML = feedbackLines.map(line => `<div class="miniCard">“${line}”</div>`).join("");
  }
}

function renderDemo(){
  renderBars();
  renderTimeline();
  setControls();
  setPresence("Idle", "Press start to begin.");
  renderMicro("Waiting for a session.");
}

function startSession(){
  demo.running = true;
  demo.result = "RUNNING";
  pushTimeline("Session started");
  setPresence("Listening…", "Mark moments that felt right or off.");
  renderMicro("Listening for timing, transitions, and energy control.");
  setControls();
}

function feltRight(){
  if(!demo.running) return;
  demo.trans = clamp(demo.trans + 2, 0, 100);
  demo.time = clamp(demo.time + 1, 0, 100);
  demo.taste = clamp(demo.taste + 4, 0, 100);
  pushTimeline("✓ Transition felt controlled");
  renderMicro("Good control. Keep the groove stable.");
  renderBars();
}

function feltOff(){
  if(!demo.running) return;
  demo.trans = clamp(demo.trans - 1, 0, 100);
  demo.taste = clamp(demo.taste - 2, 0, 100);
  pushTimeline("⚠ Energy rose too fast");
  renderMicro("Consider longer blends. Less movement.");
  renderBars();
}

function endSession(){
  if(!demo.running) return;
  demo.running = false;

  setPresence("Analyzing…", "Building your session summary.");
  pushTimeline("Session ended");
  setControls();

  setTimeout(() => {
    const pass = (demo.trans >= 68 && demo.time >= 80 && demo.taste >= 40);
    demo.result = pass ? "PASS" : "NEEDS WORK";
    const badge = document.getElementById("resultBadge");
    if(badge) badge.textContent = demo.result;

    setPresence("Session complete", pass ? "New mission unlocked." : "Retry with more patience.");

    const panelHtml = `
      <div><b>Session complete</b></div>
      <div class="muted" style="margin-top:6px;">Summary</div>
      <div>Beatmatching: <b>${demo.beat}%</b></div>
      <div>Transitions: <b>${demo.trans}%</b></div>
      <div>Timing: <b>${demo.time}%</b></div>
      <div>Taste / Flow: <b>${demo.taste >= 60 ? "Strong" : demo.taste >= 40 ? "Improving" : "Developing"}</b></div>
      <div class="muted" style="margin-top:10px;">Taste isn’t right or wrong. It’s intention and control.</div>
    `;

    const feedback = pass
      ? ["Good control. Energy stayed consistent.", "Transitions fit the groove.", "Keep blends minimal and intentional."]
      : ["This transition is too short.", "Energy rises too fast.", "Let the groove breathe longer."];

    renderResults(panelHtml, feedback);
    renderMicro(pass ? "Nice. Tap Next mission." : "Try again: longer blends, fewer moves.");

    const next = document.getElementById("btnNext");
    if(next) next.disabled = !pass;
  }, 700);
}

function nextMission(){
  const m = document.getElementById("missionText");
  if(m) m.textContent = "Maintain energy through a 32‑bar blend without increasing intensity too early.";
  pushTimeline("Next mission unlocked");
  renderMicro("New mission ready. Focus on control, not speed.");
  const next = document.getElementById("btnNext");
  if(next) next.disabled = true;
}
// ===== Homepage bloom lines =====
(function(){
  const el = document.getElementById("heroLine");
  if(!el) return;

  const lines = [
    "Taste is built in moments like this.",
    "Control beats complexity.",
    "Let the groove breathe.",
    "Most DJs rush transitions here.",
    "Great mixing feels inevitable."
  ];

  let i = 0;
  setInterval(() => {
    i = (i + 1) % lines.length;
    el.textContent = lines[i];
  }, 3200);
})();


