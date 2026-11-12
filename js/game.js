(function () {
  const SAVE = "last-trace-v1";
  const ORDER = ["hyejin", "hyeseon", "solmi", "jihee", "minyoung"];
  const PLACES = {
    hyejin: "학교 앞 술집",
    hyeseon: "정문 편의점 옆",
    solmi: "정보보호 연구실",
    jihee: "학생회관 연습실",
    minyoung: "기숙사"
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state;
  let typer = 0;
  let cutouts = {};
  let history = [];

  function fresh() {
    return {
      phase: "title",
      sceneId: null,
      line: 0,
      react: null,
      aff: { hyejin: 0, hyeseon: 0, solmi: 0, jihee: 0, minyoung: 0 },
      doubt: { hyejin: 2, hyeseon: 2, solmi: 4, jihee: 0, minyoung: 0 },
      reason: {
        hyejin: "소문 · 감정적이고 충동적이다",
        hyeseon: "소문 · 연구실과 거리가 있다",
        solmi: "소문 · 삭제 권한이 있다",
        jihee: "소문 · 모두에게 친절하다",
        minyoung: "소문 · 조용하고 갈등이 없다"
      },
      flags: {},
      cleared: {},
      dossier: { hyejin: 0, hyeseon: 0, solmi: 0, jihee: 0, minyoung: 0 },
      flipped: {},
      solved: {},
      met: {},
      noteId: "hyejin",
      tutorial: false
    };
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function scene() { return window.STORY.SCENES[state.sceneId]; }
  function linesOf() { return scene() ? scene().lines : []; }
  function current() { return linesOf()[state.line] || null; }

  function evalCond(cond) {
    if (!cond) return true;
    if (cond === "not:affhigh") {
      const id = scene() && scene().focus;
      return (state.aff[id] || 0) < 4;
    }
    if (cond.indexOf("not:") === 0) return !state.flags[cond.slice(4)];
    let m = cond.match(/^aff:(\w+)>=(\d+)$/);
    if (m) return (state.aff[m[1]] || 0) >= Number(m[2]);
    m = cond.match(/^aff:(\w+)<(\d+)$/);
    if (m) return (state.aff[m[1]] || 0) < Number(m[2]);
    return !!state.flags[cond];
  }

  function skip() {
    const lines = linesOf();
    while (state.line < lines.length && !evalCond(lines[state.line].if)) state.line++;
  }

  function setBg(key) {
    const path = window.STORY.BG[key] || window.STORY.BG.lab;
    const el = document.getElementById("bg");
    el.style.backgroundImage = 'url("' + encodeURI(path) + '")';
  }

  function toast(text) {
    const t = document.getElementById("toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function persist() {
    const data = JSON.parse(JSON.stringify(state));
    localStorage.setItem(SAVE, JSON.stringify(data));
  }

  function hasSave() {
    try { return !!localStorage.getItem(SAVE); } catch (e) { return false; }
  }

  function shownLine() {
    if (state.react) return state.react;
    return current();
  }

  function solveKey() { return state.sceneId + ":" + state.line; }

  function spriteFor(line) {
    if (!line || line.hide || line.group || line.cg) return null;
    if (line.sprite) return line.sprite;
    const cast = window.STORY.CAST[line.who];
    if (cast && cast.img) return line.who;
    const sc = scene();
    if (sc && sc.focus && (line.who === "player" || line.who === "thought" || line.who === "nar")) return sc.focus;
    return sc && sc.focus ? sc.focus : null;
  }

  function renderTop() {
    const bar = document.getElementById("topbar");
    const show = state.phase === "vn" || state.phase === "hub" || state.phase === "finale" || state.phase === "closed";
    bar.hidden = !show;
    const sc = state.phase === "vn" ? scene() : null;
    document.getElementById("place").textContent = sc ? sc.place : (state.phase === "hub" ? "10월 31일 · 임시로 배정된 방" : state.phase === "finale" ? "10월 31일 오후 7:00 · 기록 열람" : "");
    const focus = sc && sc.focus;
    const box = document.getElementById("meters");
    if (!focus) { box.innerHTML = ""; return; }
    const hearts = "♥".repeat(Math.min(5, state.aff[focus] || 0)) + "♡".repeat(Math.max(0, 5 - Math.min(5, state.aff[focus] || 0)));
    const d = state.doubt[focus] || 0;
    const blocks = "■".repeat(d) + "□".repeat(Math.max(0, 5 - d));
    const label = state.dossier[focus] > 0 ? "의문" : "선입견";
    box.innerHTML = '<span>호감 <b class="hearts">' + hearts + '</b></span><span>' + label + ' <b class="bias">' + blocks + "</b></span>";
  }

  function typeInto(el, text) {
    clearInterval(typer);
    if (!el) return;
    if (reduce) { el.textContent = text; state.typing = false; return; }
    state.typing = true;
    let i = 0;
    el.textContent = "";
    typer = setInterval(() => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) { clearInterval(typer); state.typing = false; }
    }, 16);
  }

  function finishType() {
    clearInterval(typer);
    const el = document.querySelector(".dialogue .text");
    const line = shownLine();
    if (el && line) el.textContent = line.text;
    state.typing = false;
  }

  function renderTitle() {
    setBg("grand");
    document.getElementById("stage").innerHTML =
      '<section class="screen"><div class="title-card">' +
      '<div class="eyebrow">INFORMATION SECURITY LAB</div>' +
      "<h1>LAST TRACE</h1><h2>사라진 최종본</h2>" +
      '<p class="sub">2026.10.31　다섯 명의 이야기, 그리고 지워진 파일</p>' +
      '<div class="row">' +
      '<button type="button" class="primary" data-act="new">이야기를 시작한다</button>' +
      (hasSave() ? '<button type="button" class="ghost" data-act="cont">기록을 이어간다</button>' : "") +
      "</div>" +
      '<p class="help">클릭으로 대사를 넘긴다. 선택지는 호감에만 닿는다.<br>선입견은 소문이고, 카드의 뒷면은 기록이다. Enter · 진행　N · 수첩</p>' +
      "</div></section>";
    renderTop();
  }

  function renderVn() {
    const sc = scene();
    const line = shownLine();
    if (!line) { onSceneEnd(); return; }
    setBg(line.cg || line.bg || sc.bg);
    const who = line.who || "nar";
    const cast = window.STORY.CAST[who] || window.STORY.CAST.nar;
    const sid = spriteFor(line);
    const scCast = sid ? window.STORY.CAST[sid] : null;
    let portrait = "";
    if (scCast && scCast.img && !line.group) {
      const src = cutouts[sid] || scCast.img;
      const mood = (who === "player" || who === "thought") ? "listen" : (line.mood ? "mood-" + line.mood : "");
      portrait = '<figure class="portrait ' + (scCast.mode || "studio") + " " + mood + '"><img src="' + src + '" alt="' + scCast.name + '"></figure>';
    }
    let group = "";
    if (line.group) {
      group = '<div class="group">' + ORDER.map((id) => {
        const c = window.STORY.CAST[id];
        return '<img src="' + (cutouts[id] || c.img) + '" alt="' + c.name + '">';
      }).join("") + "</div>";
    }
    const pendingGame = !state.react && line.game && !state.solved[solveKey()];
    const choices = (!state.react && line.choices) ? line.choices : null;
    const name = cast.name || "";
    const compact = !!(choices || pendingGame) && !line.text;
    const klass = "dialogue" + (who === "thought" ? " thought" : "") + (who === "nar" ? " nar" : "") + (compact ? " compact" : "");
    const stage = document.getElementById("stage");
    stage.innerHTML =
      portrait + group +
      '<section class="' + klass + '" data-act="advance">' +
      (name ? '<div class="who"><i style="background:' + cast.color + '"></i>' + name + "</div>" : "") +
      (compact ? "" : '<div class="dir">' + (line.dir || "") + "</div>") +
      (compact ? "" : '<p class="text"></p>') +
      (choices ? '<div class="choices">' + choices.map((c, i) => '<button type="button" class="choice" data-act="choice" data-i="' + i + '">' + (i + 1) + ". " + c.t + "</button>").join("") + "</div>" : "") +
      (pendingGame ? '<div class="choices"><button type="button" class="primary" data-act="game" data-game="' + line.game + '">' + (line.gameLabel || "파일을 연다") + "</button></div>" : "") +
      (history.length ? '<button type="button" class="cue back" data-act="back">BACK</button>' : "") +
      (!choices && !pendingGame ? '<div class="cue">CLICK</div>' : "") +
      "</section>";
    const textEl = stage.querySelector(".text");
    if (textEl) typeInto(textEl, line.text || "");
    renderTop();
  }

  function mission() {
    if (!state.cleared.hyejin) return "학교 앞에서 혜진을 만난다. 오늘은 취조가 아니다.";
    if (!state.cleared.hyeseon) return "정문 쪽에 혜선이 있다. 취향부터 듣는다.";
    if (!state.cleared.solmi) return "연구실의 솔미. 수첩 앞면은 이미 그녀를 가리키고 있다.";
    if (!state.cleared.jihee) return "학생회관의 지희. 모두에게 다정한 사람의 어젯밤.";
    if (!state.cleared.minyoung) return "반복되던 대사가 남았다. 기숙사의 민영을 만나러 간다.";
    if (!state.cleared.deep) return "민영의 컴퓨터에 열리지 않는 파일이 남아 있다.";
    if (!state.flags.reported) return "기록을 모아 연구실에 보고한다.";
    return "사건은 닫혔다. 수첩은 아직 펼쳐 볼 수 있다.";
  }

  function locState(id) {
    if (id === "minyoung") {
      if (!state.flags.bridgePlayed) return "locked";
      if (!state.cleared.minyoung) return "go";
      if (!state.cleared.deep) return "go2";
      return "re";
    }
    if (!state.cleared[id]) {
      const idx = ORDER.indexOf(id);
      if (idx === 0 || state.cleared[ORDER[idx - 1]]) return "go";
      return "locked";
    }
    return "re";
  }

  function renderHub() {
    setBg("quarter");
    const cards = ORDER.map((id) => {
      const c = window.STORY.CAST[id];
      const st = locState(id);
      const locked = st === "locked";
      const ready = st === "go" || st === "go2";
      let tag = "다시 이야기";
      if (st === "locked") tag = "아직 갈 차례가 아니다";
      if (st === "go") tag = "이야기를 들으러 간다";
      if (st === "go2") tag = "열리지 않는 파일";
      const hearts = state.met[id] ? "♥".repeat(Math.min(5, state.aff[id] || 0)) : "";
      return '<button type="button" class="loc' + (ready ? " ready" : "") + '" data-act="hub" data-id="' + id + '"' + (locked ? " disabled" : "") + ">" +
        '<img src="' + c.img + '" alt="">' +
        '<span><span class="nm">' + c.name + " " + hearts + '</span>' +
        '<span class="meta">' + PLACES[id] + "<br>" + c.role + '</span>' +
        '<span class="tag">' + tag + "</span></span></button>";
    }).join("");
    const finaleBtn = state.cleared.deep && !state.flags.reported
      ? '<button type="button" class="primary" data-act="finale">연구실에 보고한다</button>'
      : "";
    document.getElementById("stage").innerHTML =
      '<section class="hub"><div class="panel"><h3>임시 배정된 방</h3>' +
      '<p class="lede">이름표 다섯 장. 앞면은 사람들이 말하는 그 사람이고, 뒷면은 아직 비어 있다.</p>' +
      '<div class="mission">' + mission() + "</div>" +
      '<div class="row" style="justify-content:flex-start">' + finaleBtn +
      '<button type="button" class="ghost" data-act="note">수첩을 연다</button>' +
      '<button type="button" class="ghost" data-act="title">타이틀로</button></div></div>' +
      '<div class="panel">' + cards + "</div></section>";
    renderTop();
    if (!state.tutorial) {
      state.tutorial = true;
      persist();
      toast("호감은 마음이고, 선입견은 소문이다. 파일은 직접 연다.");
    }
  }

  function cardBack(id) {
    const d = window.STORY.DOSSIERS[id];
    const stage = state.dossier[id] || 0;
    if (id === "minyoung") {
      if (stage >= 2) return d.back;
      if (stage === 1) return d.mid;
      return null;
    }
    return stage >= 1 ? d.back : null;
  }

  function renderNote() {
    const modal = document.getElementById("modal");
    const ids = ORDER.slice();
    const side = ids.map((id) => {
      const dot = (state.dossier[id] > 0 && !state.flipped[id]) ? " ●" : "";
      return '<button type="button" data-act="note-pick" data-id="' + id + '" class="' + (state.noteId === id ? "on" : "") + '"><span>' + window.STORY.CAST[id].name + dot + "</span></button>";
    }).join("") + '<button type="button" data-act="note-pick" data-id="time" class="' + (state.noteId === "time" ? "on" : "") + '">타임라인</button>';
    let main = "";
    if (state.noteId === "time") {
      const ev = events();
      main = "<h3>모인 시각</h3>" + (ev.length ? '<div class="timeline">' + ev.map((e) => '<div class="ev' + (e[0] === "23:14" ? " hit" : "") + '"><time>' + e[0] + "</time><span>" + e[1] + "</span></div>").join("") + "</div>" : "<p>아직 시각이 모이지 않았다. 파일을 열면 여기에 쌓인다.</p>");
    } else {
      const id = state.noteId;
      const d = window.STORY.DOSSIERS[id];
      const back = cardBack(id);
      const flipped = !!state.flipped[id] && !!back;
      main = '<h3 style="font-family:var(--serif);font-weight:500">' + window.STORY.CAST[id].name + "</h3>" +
        '<p class="hint">' + (state.reason[id] || "") + "</p>" +
        '<div class="flip-scene"><div class="card3d' + (flipped ? " flipped" : "") + '" data-act="flip" data-id="' + id + '">' +
        '<div class="face front"><div class="k">' + d.front.tag + "</div><h4>" + d.front.title + "</h4><p>" + d.front.text + "</p></div>" +
        '<div class="face back">' + (back
          ? '<div class="k">' + back.tag + "</div><h4>" + back.title + "</h4><ul>" + back.points.map((p) => "<li>" + p + "</li>").join("") + "</ul>"
          : '<div class="k">기록 없음</div><h4 class="lock-back">아직 뒷면이 없다</h4><p>이야기를 듣고, 파일을 직접 열면 이쪽이 채워진다.</p>') +
        "</div></div></div>" +
        '<p class="hint">카드를 누르면 뒤집힌다. 호감이 높아도 뒷면이 바뀌지는 않는다.</p>';
    }
    modal.hidden = false;
    modal.innerHTML = '<div class="notebook"><aside class="note-side">' + side +
      '<button type="button" data-act="close-note">닫기</button>' +
      '<button type="button" data-act="reset">기록을 지운다</button></aside><div class="note-main">' + main + "</div></div>";
  }

  function events() {
    const d = state.dossier;
    const ev = [];
    if (d.solmi) ev.push(["22:40", "솔미의 NAS 접속 종료"]);
    if (d.minyoung >= 1) ev.push(["22:47", "민영의 영상 생성 · loop_maker"]);
    if (d.minyoung >= 2) {
      ev.push(["22:50", "자동 재생 예약"]);
      ev.push(["22:52", "외출 계획"]);
    }
    if (d.jihee) {
      ev.push(["22:58", "지희, 민영 방 앞에서 반복 대사"]);
      ev.push(["23:00", "지희, 학생회관으로 출발"]);
    }
    if (d.hyejin) ev.push(["23:09", "혜진, 학교 앞 술집 결제"]);
    if (d.minyoung >= 2) ev.push(["23:10", "연구동 AP · 계정 minyoung"]);
    if (d.hyeseon) ev.push(["23:12", "혜선, 정문 편의점 0832"]);
    if (d.solmi) ev.push(["23:13", "솔미의 집 PC, 채팅 입력"]);
    if (d.hyejin) ev.push(["23:14", "술집의 비명"]);
    if (d.minyoung >= 2) ev.push(["23:14", "paper_final_v7.docx 삭제"]);
    if (d.jihee) {
      ev.push(["23:16", "지희, 학생회관 입실"]);
      ev.push(["00:41", "민영의 사과 메시지"]);
    }
    return ev;
  }

  function renderFinale() {
    setBg("cctv");
    document.getElementById("bg").style.filter = "brightness(0.38) saturate(0.7)";
    const ev = events();
    const people = ORDER.map((id) => {
      const c = window.STORY.CAST[id];
      const back = cardBack(id);
      const flipped = state.flipped[id] && back;
      const body = flipped
        ? "<strong>" + c.name + "</strong><span>" + back.points.slice(0, 3).join(" · ") + "</span>"
        : "<strong>" + c.name + "</strong><span>" + window.STORY.DOSSIERS[id].front.title + " · 앞면. 눌러 뒷면을 본다.</span>";
      return '<button type="button" class="mini" data-act="finale-flip" data-id="' + id + '"><img src="' + c.img + '" alt="">' + body + "</button>";
    }).join("");
    document.getElementById("stage").innerHTML =
      '<section class="finale"><div class="eyebrow">FINAL REPORT</div><h3>당신이 믿었던 사람은</h3>' +
      "<p class=\"lede\">앞면은 처음 들은 인상이다. 뒷면을 모두 확인한 뒤에 한 사람을 보고한다.</p>" +
      '<div class="timeline">' + ev.map((e) => '<div class="ev' + (e[0] === "23:14" ? " hit" : "") + '"><time>' + e[0] + "</time><span>" + e[1] + "</span></div>").join("") + "</div>" +
      '<div class="people">' + people + "</div>" +
      '<div class="row" style="justify-content:flex-start;margin-top:14px">' +
      ORDER.map((id) => {
        const name = window.STORY.CAST[id].name;
        const code = name.charCodeAt(name.length - 1);
        const particle = (code - 0xac00) % 28 === 0 ? "를" : "을";
        return '<button type="button" class="ghost" data-act="ask" data-id="' + id + '">' + name + particle + " 지목</button>";
      }).join("") +
      '<button type="button" class="ghost" data-act="hub-back">방으로</button></div>' +
      '<div id="rebuttal"></div></section>';
    renderTop();
  }

  function renderClosed() {
    setBg("grand");
    document.getElementById("bg").style.filter = "";
    document.getElementById("stage").innerHTML =
      '<section class="screen"><div class="title-card">' +
      '<div class="end-logo">CASE CLOSED</div><h1>LAST TRACE</h1>' +
      "<h2>사라진 최종본</h2>" +
      '<p class="sub">인상은 앞면에 남고, 기록은 뒷면에 남았다.</p>' +
      '<div class="row"><button type="button" class="primary" data-act="note">수첩을 다시 본다</button>' +
      '<button type="button" class="ghost" data-act="title">타이틀로</button></div></div></section>';
    renderTop();
  }

  function render() {
    closeNote();
    if (state.phase !== "finale") document.getElementById("bg").style.filter = "";
    if (state.phase === "title") return renderTitle();
    if (state.phase === "vn") return renderVn();
    if (state.phase === "hub") return renderHub();
    if (state.phase === "finale") return renderFinale();
    if (state.phase === "closed") return renderClosed();
    renderTitle();
  }

  function remember() {
    const snap = JSON.parse(JSON.stringify(state));
    delete snap.typing;
    history.push(snap);
    if (history.length > 80) history.shift();
  }

  function rewind() {
    if (state.phase !== "vn" || !history.length) return;
    clearInterval(typer);
    closeKit();
    state = history.pop();
    state.typing = false;
    render();
    persist();
  }

  function startScene(id) {
    history = [];
    state.phase = "vn";
    state.sceneId = id;
    state.line = 0;
    state.react = null;
    const sc = scene();
    if (sc && sc.focus) state.met[sc.focus] = true;
    skip();
    render();
    persist();
  }

  function onSceneEnd() {
    const id = state.sceneId;
    if (id === "prologue") return startScene("titlecard");
    if (id === "titlecard") return goHub();
    if (id === "hyejin" || id === "hyeseon" || id === "solmi") {
      state.cleared[id] = true;
      return goHub();
    }
    if (id === "jihee") {
      state.cleared.jihee = true;
      state.flags.bridgePlayed = true;
      return startScene("bridge");
    }
    if (id === "bridge") return goHub();
    if (id === "minyoung") {
      state.cleared.minyoung = true;
      return goHub();
    }
    if (id === "minyoung2") {
      state.cleared.deep = true;
      state.flipped.minyoung = false;
      return goHub();
    }
    if (id === "ending") {
      state.flags.reported = true;
      state.phase = "closed";
      render();
      persist();
      return;
    }
    goHub();
  }

  function goHub() {
    closeKit();
    if (state.cleared.jihee && !state.flags.bridgePlayed) {
      state.flags.bridgePlayed = true;
      startScene("bridge");
      return;
    }
    state.phase = "hub";
    state.sceneId = null;
    state.react = null;
    render();
    persist();
  }

  function advance() {
    if (state.phase !== "vn") return;
    if (state.typing) { finishType(); return; }
    if (state.react) {
      remember();
      state.react = null;
      state.line += 1;
      skip();
      if (!current()) return onSceneEnd();
      render();
      persist();
      return;
    }
    const line = current();
    if (!line) return onSceneEnd();
    if (line.choices) return;
    if (line.game && !state.solved[solveKey()]) return;
    remember();
    state.line += 1;
    skip();
    if (!current()) return onSceneEnd();
    render();
    persist();
  }

  function choose(i) {
    const line = current();
    if (!line || !line.choices) return;
    const c = line.choices[i];
    if (!c) return;
    remember();
    const focus = scene().focus;
    if (focus && typeof c.aff === "number") state.aff[focus] = clamp((state.aff[focus] || 0) + c.aff, 0, 8);
    if (c.flag) state.flags[c.flag] = true;
    if (c.react) state.react = c.react;
    else {
      state.line += 1;
      skip();
    }
    if (!state.react && !current()) return onSceneEnd();
    render();
    persist();
  }

  function payoff(game) {
    if (game === "spectrogram") {
      state.dossier.hyejin = 1;
      state.doubt.hyejin = 0;
      state.reason.hyejin = "23:09 결제와 23:14 비명은 술집";
      state.flipped.hyejin = false;
      toast("혜진 · 카드 뒷면이 열렸다");
    } else if (game === "stego") {
      state.dossier.hyeseon = 1;
      state.doubt.hyeseon = 1;
      state.reason.hyeseon = "집이라는 말과 다른 편의점. 현장에는 없다";
      state.flipped.hyeseon = false;
      toast("혜선 · 거짓 한 겹, 알리바이는 남았다");
    } else if (game === "memory") {
      state.dossier.solmi = 1;
      state.doubt.solmi = 1;
      state.reason.solmi = "권한은 있으나 23:14의 키보드는 집";
      state.flipped.solmi = false;
      toast("솔미 · 선입견이 걷혔다");
    } else if (game === "logs") {
      state.dossier.jihee = 1;
      state.doubt.jihee = 0;
      state.reason.jihee = "23:16 학생회관. 반복 대사와 00:41 답장";
      state.flipped.jihee = false;
      toast("지희 · 목격이 기록으로 남았다");
    } else if (game === "meta") {
      state.dossier.minyoung = Math.max(state.dossier.minyoung, 1);
      state.doubt.minyoung = 3;
      state.reason.minyoung = "22:47에 만들어진 10초 반복";
      state.flipped.minyoung = false;
      toast("민영 · 위화감이 기록을 만나기 시작했다");
    } else if (game === "hex") {
      state.dossier.minyoung = 2;
      state.doubt.minyoung = 5;
      state.reason.minyoung = "계획의 시각과 삭제 로그가 같다";
      state.flipped.minyoung = false;
      toast("민영 · 실행의 기록이 뒷면에 붙었다");
    }
  }

  function openKit(game) {
    closeKit();
    const wrap = document.createElement("div");
    wrap.className = "kit-wrap";
    wrap.id = "kit";
    document.body.appendChild(wrap);
    const fn = window.MINI[game];
    if (!fn) return;
    fn(wrap, {
      close: closeKit,
      clear: () => {
        remember();
        state.solved[solveKey()] = true;
        payoff(game);
        closeKit();
        state.line += 1;
        skip();
        if (!current()) onSceneEnd();
        else { render(); persist(); }
      }
    });
  }

  function closeKit() {
    const k = document.getElementById("kit");
    if (k) k.remove();
  }

  function closeNote() {
    const modal = document.getElementById("modal");
    modal.hidden = true;
    modal.innerHTML = "";
  }

  function openNote() {
    if (state.phase === "title") return;
    renderNote();
  }

  function flipCard(id) {
    if (!cardBack(id)) {
      toast("아직 뒷면에 올릴 기록이 없다");
      return;
    }
    state.flipped[id] = !state.flipped[id];
    persist();
    if (!document.getElementById("modal").hidden) renderNote();
  }

  function goLoc(id) {
    const st = locState(id);
    if (st === "locked") return;
    if (id === "minyoung") {
      if (st === "go") return startScene("minyoung");
      if (st === "go2") return startScene("minyoung2");
      return startScene("minyoungR");
    }
    if (st === "re") return startScene(id + "R");
    startScene(id);
  }

  function confirmAccuse(id) {
    const need = ORDER.filter((k) => !state.flipped[k] || !cardBack(k));
    const box = document.getElementById("rebuttal");
    if (need.length) {
      box.className = "rebuttal";
      box.textContent = "아직 뒷면을 보지 않은 사람이 있다. 인상만으로 보고하지 않는다. " + need.map((k) => window.STORY.CAST[k].name).join(", ");
      return;
    }
    const modal = document.getElementById("modal");
    modal.hidden = false;
    modal.innerHTML = '<div class="modal-card"><h3 style="font-family:var(--serif);font-weight:500;margin-top:0">' + window.STORY.CAST[id].name + "</h3><p>이 사람으로 보고할까. 한 번 말하면, 기록이 받아 준다.</p><div class=\"row\" style=\"justify-content:flex-end\"><button type=\"button\" class=\"ghost\" data-act=\"close-note\">다시 본다</button><button type=\"button\" class=\"primary\" data-act=\"accuse\" data-id=\"" + id + "\">보고한다</button></div></div>";
  }

  function accuse(id) {
    closeNote();
    if (id === "minyoung") {
      startScene("ending");
      return;
    }
    const box = document.getElementById("rebuttal");
    box.className = "rebuttal";
    box.textContent = window.STORY.REBUTTAL[id];
  }

  function newGame() {
    const kept = cutouts;
    state = fresh();
    cutouts = kept;
    closeKit();
    startScene("prologue");
  }

  function continueGame() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE));
      if (!data || !data.aff) return newGame();
      history = [];
      state = data;
      if (state.phase === "vn" && state.sceneId && window.STORY.SCENES[state.sceneId]) {
        skip();
        render();
        return;
      }
      if (state.phase === "finale" || state.phase === "closed" || state.phase === "hub") {
        render();
        return;
      }
      state.phase = "hub";
      render();
    } catch (e) {
      newGame();
    }
  }

  function resetSave() {
    localStorage.removeItem(SAVE);
    history = [];
    state = fresh();
    closeNote();
    closeKit();
    renderTitle();
    toast("기록을 비웠다");
  }

  function onClick(e) {
    const actEl = e.target.closest("[data-act]");
    if (!actEl) return;
    const act = actEl.dataset.act;
    if (act === "advance") {
      if (e.target.closest("button")) return;
      advance();
    } else if (act === "choice") choose(Number(actEl.dataset.i));
    else if (act === "game") openKit(actEl.dataset.game);
    else if (act === "new") newGame();
    else if (act === "cont") continueGame();
    else if (act === "hub") goLoc(actEl.dataset.id);
    else if (act === "note") openNote();
    else if (act === "close-note") closeNote();
    else if (act === "note-pick") { state.noteId = actEl.dataset.id; renderNote(); }
    else if (act === "flip") flipCard(actEl.dataset.id);
    else if (act === "finale") { state.phase = "finale"; render(); persist(); }
    else if (act === "finale-flip") {
      const id = actEl.dataset.id;
      if (!cardBack(id)) { toast("뒷면이 아직 없다"); return; }
      state.flipped[id] = true;
      persist();
      renderFinale();
    } else if (act === "ask") confirmAccuse(actEl.dataset.id);
    else if (act === "accuse") accuse(actEl.dataset.id);
    else if (act === "back") rewind();
    else if (act === "hub-back") goHub();
    else if (act === "title") { state.phase = "title"; closeNote(); render(); }
    else if (act === "reset") {
      if (window.confirm("지금까지의 호감과 기록을 지울까?")) resetSave();
    }
  }

  function onKey(e) {
    if (e.target.matches("input, textarea")) return;
    if (e.key === "Escape") { closeNote(); closeKit(); return; }
    if (e.key === "n" || e.key === "N") {
      if (document.getElementById("modal").hidden) openNote();
      else closeNote();
      return;
    }
    if (state.phase !== "vn") return;
    if (e.key === "Enter" || e.key === " ") {
      if (state.typing) { e.preventDefault(); finishType(); return; }
      if (document.querySelector(".choices")) return;
      e.preventDefault();
      advance();
    }
    if (e.key >= "1" && e.key <= "9") {
      const btn = document.querySelector('.choice[data-i="' + (Number(e.key) - 1) + '"]');
      if (btn) btn.click();
    }
  }

  function cutout(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const ctx = c.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          const frame = ctx.getImageData(0, 0, c.width, c.height);
          const d = frame.data;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            if (min > 240 && max - min < 20) d[i + 3] = 0;
            else if (min > 214 && max - min < 20) d[i + 3] = Math.min(d[i + 3], Math.round(((240 - min) / 26) * 255));
          }
          ctx.putImageData(frame, 0, 0);
          resolve(c.toDataURL("image/png"));
        } catch (err) {
          resolve(url);
        }
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }

  async function boot() {
    state = fresh();
    document.body.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    const studio = ["hyejin", "solmi"];
    await Promise.all(studio.map(async (id) => {
      cutouts[id] = await cutout(window.STORY.CAST[id].img);
    }));
    renderTitle();
  }

  boot();
})();
