(function () {
  function shell(title, file) {
    return (
      '<section class="kit">' +
      '<header><i class="dot"></i><i class="dot"></i><i class="dot"></i><b>TRACE</b><em>' + file + "</em></header>" +
      '<div class="kit-body"><h4 style="margin:0 0 8px;font-weight:500">' + title + "</h4>" +
      '<div class="kit-slot"></div><div class="kit-msg"></div>' +
      '<div class="row" style="justify-content:flex-end;margin-top:12px">' +
      '<button type="button" class="ghost" data-close>접어 둔다</button>' +
      '<button type="button" class="primary" data-keep hidden>수첩에 남긴다</button>' +
      "</div></div></section>"
    );
  }

  function mount(wrap, file, title, api) {
    wrap.innerHTML = shell(title, file);
    const slot = wrap.querySelector(".kit-slot");
    const msg = wrap.querySelector(".kit-msg");
    const keep = wrap.querySelector("[data-keep]");
    wrap.querySelector("[data-close]").onclick = () => api.close();
    let done = false;
    keep.onclick = () => {
      if (done) return;
      done = true;
      api.clear();
    };
    return {
      slot,
      say(text, kind) {
        msg.className = "kit-msg" + (kind ? " " + kind : "");
        msg.textContent = text;
      },
      finish(text) {
        msg.className = "kit-msg good";
        msg.textContent = text;
        keep.hidden = false;
        wrap.querySelectorAll(".tiny, .choice, .q button").forEach((b) => {
          if (b !== keep) b.disabled = true;
        });
      }
    };
  }

  function digits() {
    const maps = {
      "2": ["111", "001", "111", "100", "111"],
      "3": ["111", "001", "111", "001", "111"],
      "1": ["010", "110", "010", "010", "111"],
      "4": ["101", "101", "111", "001", "001"]
    };
    return ["2", "3", "1", "4"].map((d) => {
      const cells = maps[d].join("").split("").map((c) => '<b class="' + (c === "1" ? "on" : "") + '"></b>').join("");
      return '<div class="digit" aria-label="' + d + '">' + cells + "</div>";
    }).join("");
  }

  function spectrogram(wrap, api) {
    const ui = mount(wrap, "scream.wav", "녹음 속 소리", api);
    const wave = '<svg class="wave" viewBox="0 0 600 120"><path d="M0 60 Q 20 60 30 58 T 80 55 T 140 20 T 200 90 T 260 10 T 320 100 T 380 30 T 460 70 T 560 60 T 600 60" fill="none" stroke="#e7899a" stroke-width="2"/></svg>';
    ui.slot.innerHTML =
      '<div class="tools">' +
      '<button type="button" class="tiny" data-v="wave">파형</button>' +
      '<button type="button" class="tiny" data-v="size">파일 크기</button>' +
      '<button type="button" class="tiny" data-v="spec">스펙트로그램</button>' +
      "</div><div class=\"view\" data-view></div>";
    const view = ui.slot.querySelector("[data-view]");
    function specGrid() {
      let html = '<div class="spec">';
      for (let c = 0; c < 48; c++) {
        const env = Math.sin((c / 48) * Math.PI);
        const h = 18 + env * 70 + ((c * 17) % 11);
        html += '<i style="height:' + h + 'px;opacity:' + (0.35 + env * 0.6) + '"></i>';
      }
      html += "</div>";
      return html;
    }
    ui.slot.querySelectorAll("[data-v]").forEach((btn) => {
      btn.onclick = () => {
        ui.slot.querySelectorAll("[data-v]").forEach((b) => b.classList.remove("on"));
        btn.classList.add("on");
        const v = btn.dataset.v;
        if (v === "wave") {
          view.innerHTML = wave;
          ui.say("진폭은 비명 그대로다. 언제인지는 파형에 없다.");
        } else if (v === "size") {
          view.innerHTML = '<p class="mono-block">길이 8초\n예상 크기 약 700KB\n실제 크기 1.4MB\n\n가청 대역 밖의 샘플이 많다.</p>';
          ui.say("용량은 힌트다. 그 데이터가 앉은 대역을 봐야 한다.");
        } else {
          view.innerHTML = specGrid() + '<div class="tools"><button type="button" class="tiny" data-zoom>고주파 대역을 확대</button></div><div data-zoombox></div>';
          ui.say("아래쪽은 목소리다. 맨 위 대역만 유난히 규칙적이다.");
          view.querySelector("[data-zoom]").onclick = () => {
            view.querySelector("[data-zoombox]").innerHTML =
              '<div class="zoom-digits">' + digits() + "</div>" +
              '<div class="field"><label>읽힌 숫자</label><input data-code maxlength="5" inputmode="numeric" placeholder="네 자리"><button type="button" class="tiny" data-read>확인</button></div>';
            view.querySelector("[data-read]").onclick = () => {
              const raw = view.querySelector("[data-code]").value.replace(/\s/g, "");
              if (raw === "2314" || raw === "23:14") showReceipt();
              else ui.say("고주파 띠의 밝은 칸을 네 자리로 읽는다.", "bad");
            };
          };
        }
      };
    });

    function showReceipt() {
      ui.say("결제 장소와 비명의 시각을 나란히 둔다.");
      ui.slot.innerHTML =
        '<div class="cols"><div class="col"><h5>고주파 표식</h5><p class="mono-block">2314\n녹음 앱이 함께 심은 시각\n비명이 난 순간</p></div>' +
        '<div class="col"><h5>같은 휴대폰의 결제</h5><p class="receipt">학교앞술집\n2026-10-30 23:09\n38,000원\n승인</p></div></div>' +
        '<p>이 두 기록이 같이 말하는 것은.</p><div class="q">' +
        '<button type="button" class="choice" data-a="lab">혜진이 23:14에 연구실에 있었다</button>' +
        '<button type="button" class="choice" data-a="bar">23:09 결제와 23:14 비명이 모두 술집이다</button>' +
        '<button type="button" class="choice" data-a="fake">녹음은 위조다</button></div>';
      ui.slot.querySelectorAll("[data-a]").forEach((b) => {
        b.onclick = () => {
          const a = b.dataset.a;
          if (a === "bar") ui.finish("결제 단말기는 술집이고, 오 분 뒤의 비명도 같은 파일 안이다. 연구동까지는 걸어서 15분. TRACE-2314.");
          else if (a === "lab") ui.say("결제 장소가 술집이다. 연구실로 이어지지 않는다.", "bad");
          else ui.say("표식은 녹음 앱의 시각이다. 위조라고 볼 근거는 이 파일에 없다.", "bad");
        };
      });
    }
  }

  function stego(wrap, api) {
    const ui = mount(wrap, "venom.jpg", "사진 한 장", api);
    ui.slot.innerHTML =
      '<div class="polaroid"><img class="art" src="assets/venom.jpg" alt="venom.jpg"><span>venom.jpg</span></div>' +
      '<p class="hint" style="text-align:center">JPEG · 2.8MB</p>' +
      '<div class="tools" style="justify-content:center">' +
      '<button type="button" class="tiny" data-v="zoom">이미지 확대</button>' +
      '<button type="button" class="tiny" data-v="exif">EXIF</button>' +
      '<button type="button" class="tiny" data-v="tail">파일 꼬리</button></div><div class="view" data-view></div>';
    const view = ui.slot.querySelector("[data-view]");
    ui.slot.querySelectorAll("[data-v]").forEach((btn) => {
      btn.onclick = () => {
        const v = btn.dataset.v;
        if (v === "zoom") {
          view.innerHTML = '<img class="zoom-shot" src="assets/venom.jpg" alt="확대한 venom.jpg"><p>픽셀을 확대해도 그림 자체는 평범하다. 취향이 특별할 뿐, 화면에 적힌 시각은 없다.</p>';
          ui.say("보이는 면에는 장소가 없다.");
        } else if (v === "exif") {
          view.innerHTML = '<table class="meta"><tr><td>DateTimeOriginal</td><td>2026-10-30 23:11:40</td></tr><tr><td>GPS</td><td>없음</td></tr><tr><td>Software</td><td>없음</td></tr></table>';
          ui.say("시각은 있다. 어디인지는 메타데이터가 말하지 않는다.");
        } else {
          view.innerHTML =
            '<p class="hex">FF D8 FF E0 ... (이미지 본문) ... FF D9\n' +
            "32 33 3A 31 32 20 정문편의점 20 23 30 38 33 32\n" +
            "캔커피, 컵술\n연구동까지 도보 20분</p>";
          ui.say("뷰어는 FF D9 뒤를 그리지 않는다. 메모는 그 뒤에 붙어 있다.");
          const q = document.createElement("div");
          q.className = "q";
          q.innerHTML =
            '<button type="button" class="choice" data-a="fast">2분이면 연구동에 닿는다</button>' +
            '<button type="button" class="choice" data-a="no">23:14 현장에는 있을 수 없다</button>' +
            '<button type="button" class="choice" data-a="exif">EXIF만으로 연구실이다</button>';
          view.appendChild(q);
          q.querySelectorAll("button").forEach((b) => {
            b.onclick = () => {
              if (b.dataset.a === "no") ui.finish("말은 집이었고, 꼬리의 메모는 23:12 정문 편의점 0832다. 연구동까지 20분. 거짓은 한 겹, 알리바이는 남는다. TRACE-0832.");
              else if (b.dataset.a === "fast") ui.say("도보 20분이다. 2분 안에 연구동은 무리다.", "bad");
              else ui.say("EXIF에는 장소가 없다. 장소는 꼬리의 영수증에 있다.", "bad");
            };
          });
        }
      };
    });
  }

  function memory(wrap, api) {
    const ui = mount(wrap, "mem.raw", "사라지지 않은 기록", api);

    // 수업에서 배운 Hex/문자 디코딩/문자열 검색을 재현한 교육용 합성 메모리 이미지.
    // 실제 RAM을 수집한 덤프는 아니다.
    const records = [
      "MEMORY IMAGE // SOLMI-PC // 2026-10-30",
      "[22:15:03] process: ssh.exe connected to lab-nas.univ.example",
      "[22:39:58] transfer status: paper_final_v7.docx upload complete",
      "[22:40:18] ssh session closed: lab-nas.univ.example",
      "[22:51:09] browser tab: lecture review - network security",
      "[23:08:44] browser cache: paper_final_v7.docx (previously viewed filename)",
      "[23:02:14] process: FoodApp.exe started",
      "[23:05:41] FoodApp request: delivery status confirmed",
      "[23:13:52] memo input: 치킨 아직 안 왔냐고 진짜",
      "[23:14:07] memo input: 초인종 누르면 알려줘",
      "[23:14:11] active_window=FoodApp.exe",
      "[23:14:12] order_id=7731&status=confirmed",
      "[23:22:36] memo input: 문 앞에 뒀다고? 확인했어",
      "[23:24:02] delivery notification: delivered",
      "[23:50:00] home-router.local connection active",
      "END OF CAPTURE"
    ];
    const textData = records.join("\r\n") + "\r\n";
    const bytes = [];
    // UTF-16LE 문자열을 바이트로 저장하고, 구간 사이에 비문자 바이트를 섞어 덤프 형태를 재현.
    const header = [0x4D,0x45,0x4D,0x00,0x01,0x00,0x10,0x00,0xA7,0x3C,0x00,0x00];
    bytes.push(...header);
    for (let i = 0; i < textData.length; i++) {
      const c = textData.charCodeAt(i);
      bytes.push(c & 255, (c >> 8) & 255);
      if (i > 0 && i % 73 === 0) bytes.push(0x00, 0xFF, 0x2A, 0x10);
    }
    function toHex(n) { return n.toString(16).toUpperCase().padStart(2, "0"); }
    function escapeHTML(value) {
      return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }
    function decodeBytes(slice, mode) {
      if (mode === "ascii") return slice.map(b => b >= 32 && b <= 126 ? String.fromCharCode(b) : "·").join("");
      let out = "";
      for (let i = 0; i + 1 < slice.length; i += 2) {
        const code = slice[i] | (slice[i + 1] << 8);
        out += code >= 32 && code !== 0xFFFD ? String.fromCharCode(code) : "·";
      }
      return out;
    }

    ui.slot.innerHTML =
      '<div class="memory-lab" style="display:grid;gap:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<div><b style="font-family:var(--mono)">mem.raw</b><div class="hint">사건 관련 메모리 이미지 · 분석용 사본</div></div>' +
          '<span class="tiny on" style="pointer-events:none">READ ONLY</span>' +
        '</div>' +
        '<div class="tools" style="align-items:center;flex-wrap:wrap">' +
          '<label class="hint" for="mem-encoding">문자 집합</label>' +
          '<select id="mem-encoding" class="tiny" style="background:var(--panel);color:var(--ink);border:1px solid var(--line);padding:7px 10px"><option value="unicode">Unicode (UTF-16LE)</option><option value="ascii">Text / ASCII</option></select>' +
          '<button type="button" class="tiny" data-hx-search>문자열 검색 (Ctrl+F)</button>' +
          '<span class="hint" data-mem-count>총 ' + bytes.length + ' bytes</span>' +
        '</div>' +
        '<div class="field" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<input data-mem-query placeholder="검색할 문자열 입력" aria-label="검색할 문자열" style="flex:1;min-width:150px" />' +
          '<button type="button" class="primary" data-mem-find>찾기</button>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<button type="button" class="tiny" data-mem-prev disabled>이전 결과</button>' +
          '<button type="button" class="tiny" data-mem-next disabled>다음 결과</button>' +
          '<span class="hint" data-mem-status>문자열을 검색해 기록을 찾아보자. 검색 결과 주변의 바이트도 함께 확인할 수 있다.</span>' +
        '</div>' +
        '<div class="view" style="padding:0;overflow:auto;max-height:360px">' +
          '<div style="display:grid;grid-template-columns:82px minmax(250px,1fr) minmax(180px,1fr);gap:8px;padding:9px 10px;background:var(--panel);font-size:11px;color:var(--muted);font-family:var(--mono);position:sticky;top:0;z-index:1">' +
            '<b>Offset</b><b>Hexadecimal</b><b>Decoded text</b></div>' +
          '<div data-mem-rows style="font:11px/1.65 var(--mono);min-width:560px"></div>' +
        '</div>' +
        '<section style="border:1px solid var(--line);border-radius:12px;padding:12px;display:grid;gap:8px">' +
          '<b>증거 분석 노트</b><div class="hint">검색한 기록을 바탕으로 아래 항목을 판단하라. 파일명 하나가 보인다는 사실만으로 파일을 수정하거나 삭제했다고 단정할 수는 없다.</div>' +
          '<label class="hint" for="mem-session">① NAS SSH 세션이 종료된 시각 (HH:MM)</label>' +
          '<input id="mem-session" data-mem-session placeholder="종료 시각을 HH:MM 형식으로 입력" />' +
          '<label class="hint" for="mem-app">② 사건 시각 23:14에 활성화된 프로그램</label>' +
          '<input id="mem-app" data-mem-app placeholder="프로그램 이름" />' +
          '<label class="hint" for="mem-order">③ 배달 주문번호</label>' +
          '<input id="mem-order" data-mem-order inputmode="numeric" maxlength="4" placeholder="네 자리 주문번호" />' +
          '<label class="hint" for="mem-cache">④ 브라우저 캐시에 파일명이 남아 있다는 사실만으로 삭제 행위를 입증할 수 있는가?</label>' +
          '<select id="mem-cache" data-mem-cache><option value="">선택하라</option><option value="yes">그렇다</option><option value="no">아니다</option></select>' +
          '<button type="button" class="primary" data-mem-submit>분석 결과 제출</button>' +
        '</section>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<button type="button" class="tiny" data-hint>힌트 보기</button><span class="hint" data-hint-text>힌트는 3단계로 제공된다.</span>' +
        '</div>' +
      '</div>';

    const rows = ui.slot.querySelector('[data-mem-rows]');
    const query = ui.slot.querySelector('[data-mem-query]');
    const encoding = ui.slot.querySelector('#mem-encoding');
    const status = ui.slot.querySelector('[data-mem-status]');
    const prev = ui.slot.querySelector('[data-mem-prev]');
    const next = ui.slot.querySelector('[data-mem-next]');
    let hintLevel = 0;
    let hits = [];
    let hitIndex = -1;
    let searchOffset = -1;

    function makeNeedle(term) {
      const result = [];
      if (encoding.value === 'unicode') {
        for (let i = 0; i < term.length; i++) { const c = term.charCodeAt(i); result.push(c & 255, (c >> 8) & 255); }
      } else {
        for (let i = 0; i < term.length; i++) result.push(term.charCodeAt(i) & 255);
      }
      return result;
    }
    function renderRows(focusOffset) {
      const rowSize = 16;
      let html = '';
      for (let offset = 0; offset < bytes.length; offset += rowSize) {
        const slice = bytes.slice(offset, offset + rowSize);
        const hex = slice.map(toHex).join(' ');
        const decoded = decodeBytes(slice, encoding.value);
        const hit = focusOffset >= offset && focusOffset < offset + rowSize;
        html += '<div data-offset="' + offset + '" style="display:grid;grid-template-columns:82px minmax(250px,1fr) minmax(180px,1fr);gap:8px;padding:3px 10px;border-bottom:1px solid var(--line);background:' + (hit ? 'rgba(231,137,154,.18)' : 'transparent') + '">' +
          '<span style="color:var(--muted)">' + offset.toString(16).toUpperCase().padStart(8, '0') + '</span>' +
          '<span style="white-space:pre;color:var(--ink)">' + hex.padEnd(47, ' ') + '</span>' +
          '<span style="white-space:pre;color:var(--ink)">' + escapeHTML(decoded) + '</span></div>';
      }
      rows.innerHTML = html;
      if (focusOffset >= 0) {
        const target = rows.querySelector('[data-offset="' + (Math.floor(focusOffset / rowSize) * rowSize) + '"]');
        if (target) target.scrollIntoView({ block: 'nearest' });
      }
    }
    function updateNav() {
      prev.disabled = hits.length < 2 || hitIndex <= 0;
      next.disabled = hits.length < 2 || hitIndex >= hits.length - 1;
    }
    function showHit(index) {
      hitIndex = index;
      searchOffset = hits[index];
      status.textContent = '검색 결과 ' + (index + 1) + ' / ' + hits.length + ' · Offset 0x' + searchOffset.toString(16).toUpperCase().padStart(8, '0') + ' · 주변 데이터를 확인하라.';
      renderRows(searchOffset);
      updateNav();
    }
    function search() {
      const term = query.value;
      if (!term) { status.textContent = '검색어를 입력하라.'; return; }
      const needle = makeNeedle(term);
      hits = [];
      outer: for (let i = 0; i <= bytes.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++) if (bytes[i + j] !== needle[j]) continue outer;
        hits.push(i);
        i += Math.max(0, needle.length - 1);
      }
      if (!hits.length) {
        hitIndex = -1; searchOffset = -1; status.textContent = '일치하는 문자열이 없다. 문자 집합 설정과 검색어를 확인하라.';
        updateNav(); renderRows(-1); return;
      }
      showHit(0);
    }
    ui.slot.querySelector('[data-mem-find]').onclick = search;
    ui.slot.querySelector('[data-hx-search]').onclick = () => { query.focus(); status.textContent = '검색어를 입력한 뒤 찾기를 누르라.'; };
    query.addEventListener('keydown', event => { if (event.key === 'Enter') search(); });
    ui.slot.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') { event.preventDefault(); query.focus(); } });
    prev.onclick = () => { if (hitIndex > 0) showHit(hitIndex - 1); };
    next.onclick = () => { if (hitIndex < hits.length - 1) showHit(hitIndex + 1); };
    encoding.onchange = () => { renderRows(searchOffset); status.textContent = encoding.value === 'unicode' ? 'Unicode(UTF-16LE)로 표시 중이다. 검색도 다시 실행하라.' : 'ASCII 방식으로 표시 중이다. 검색도 다시 실행하라.'; hits = []; hitIndex = -1; updateNav(); };
    ui.slot.querySelector('[data-hint]').onclick = () => {
      hintLevel = Math.min(3, hintLevel + 1);
      const hints = [
        '1단계: 사건 시각 전후의 기록과 NAS 연결 종료 기록을 각각 찾아 비교하라.',
        '2단계: 22:40, 23:14, order_id를 검색해 보라. 검색 결과가 여러 개면 이전/다음 결과도 확인하라.',
        '3단계: Unicode(UTF-16LE)를 선택하고, 23:14의 active_window와 order_id를 확인하라. 캐시의 파일명은 삭제 증거와 동일하지 않다.'
      ];
      ui.slot.querySelector('[data-hint-text]').textContent = hints[hintLevel - 1];
    };
    ui.slot.querySelector('[data-mem-submit]').onclick = () => {
      const session = ui.slot.querySelector('[data-mem-session]').value.trim();
      const app = ui.slot.querySelector('[data-mem-app]').value.trim().toLowerCase();
      const order = ui.slot.querySelector('[data-mem-order]').value.trim();
      const cache = ui.slot.querySelector('[data-mem-cache]').value;
      if (session === '22:40' && app === 'foodapp.exe' && order === '7731' && cache === 'no') {
        ui.finish('증거 분석 완료. NAS SSH 세션은 22:40에 종료됐다. 사건 시각 23:14의 활성 프로그램은 FoodApp.exe이며, 주문번호 7731의 배달 요청 기록이 남아 있다. 브라우저 캐시에 paper_final_v7.docx라는 파일명이 남아 있다는 사실만으로 삭제 행위를 입증할 수는 없다. 기록을 종합하면 솔미의 알리바이는 뒷받침되지만, 이 자료만으로 실제 위치까지 단정하지는 않는다. TRACE-7731.');
      } else {
        ui.say('아직 증거 조합이 정확하지 않다. NAS 세션 종료 시각, 사건 시각의 활성 프로그램, 주문번호, 캐시 기록의 증명력을 다시 확인하라.', 'bad');
      }
    };
    renderRows(-1);
    ui.say('메모리 이미지가 열렸다. 단일 문자열만 찾지 말고 시간과 기록의 의미를 비교해 증거를 조합하라.');
  }

  function logs(wrap, api) {
    const ui = mount(wrap, "kakao_access.log", "두 개의 시계", api);
    ui.slot.innerHTML =
      '<div class="cols"><div class="col"><h5>카카오톡</h5><p class="mono-block">10월 30일\n22:58  지희  민영아 문 열어봐\n22:58  지희  드라마 소리 계속 나는데\n22:59  지희  같은 대사 계속 반복돼\n23:00  지희  학생회관 가야겠다\n<span class="late">00:41  민영  미안 소리 커서 못 들었어</span></p></div>' +
      '<div class="col"><h5>학생회관 출입</h5><p class="mono-block">카드  지희\n10월 30일  23:16  IN\n\n연구동 출입  없음</p></div></div>' +
      "<p>사건은 23:14에 일어났다. 지희가 학생회관에 도착한 시각은.</p><div class=\"q\">" +
      '<button type="button" class="choice" data-a="2200">22:00</button>' +
      '<button type="button" class="choice" data-a="2312">23:12</button>' +
      '<button type="button" class="choice" data-a="2316">23:16</button>' +
      '<button type="button" class="choice" data-a="2340">23:40</button></div>';
    ui.slot.querySelectorAll("[data-a]").forEach((b) => {
      b.onclick = () => {
        if (b.dataset.a === "2316") ui.finish("22:58 방 앞, 23:00 출발, 23:16 입실. 23:14에 그녀는 학생회관으로 가는 길이다. 아래쪽 00:41의 답장도 기록에 남긴다. TRACE-2316.");
        else ui.say("출입 기록의 IN 시각을 그대로 읽는다. 카톡의 23:00은 출발이다.", "bad");
      };
    });
  }

  function meta(wrap, api) {
    const ui = mount(wrap, "alibi.mp4", "영상이 기억하는 시간", api);
    let opened = false;
    ui.slot.innerHTML =
      '<div class="player"><i class="bar"></i><div class="cap">가지 마.　가지 마.　가지 마.</div></div>' +
      '<div class="tools">' +
      '<button type="button" class="tiny" data-v="play">재생</button>' +
      '<button type="button" class="tiny" data-v="meta">메타데이터</button>' +
      '<button type="button" class="tiny" data-v="size">용량</button></div>' +
      '<div class="view" data-view><p>같은 장면이 열 초마다 돌아온다.</p></div>';
    const view = ui.slot.querySelector("[data-view]");
    ui.slot.querySelectorAll("[data-v]").forEach((btn) => {
      btn.onclick = () => {
        const v = btn.dataset.v;
        if (v === "play") {
          view.innerHTML = "<p>대사가 한 바퀴 돌고, 같은 입모양으로 다시 시작한다. 내용만 봐서는 이 파일이 언제 만들어졌는지 알 수 없다.</p>";
          ui.say("반복은 들린다. 만든 시각은 파일 쪽에 있다.");
        } else if (v === "size") {
          view.innerHTML = "<p>10초. 용량은 그 길이에 비해 평범하다. 숨긴 용량은 이쪽이 아니다.</p>";
          ui.say("용량은 정상이다. 다른 칸을 본다.");
        } else {
          opened = true;
          view.innerHTML =
            '<table class="meta">' +
            "<tr><td>creation_time</td><td>2026-10-30 22:47:06</td></tr>" +
            "<tr><td>duration</td><td>00:00:10</td></tr>" +
            "<tr><td>encoder</td><td>loop_maker</td></tr>" +
            "<tr><td>comment</td><td>see loop_config.dat</td></tr></table>" +
            '<div class="tools"><button type="button" class="tiny" data-save>이 정보를 기록</button></div>';
          ui.say("만들어진 시각과, 다음에 열 파일 이름.");
          view.querySelector("[data-save]").onclick = () => {
            ui.finish("22:47에 loop_maker로 만들어진 10초 반복. 주석이 loop_config.dat를 가리킨다. 방에 사람이 있는 것처럼 들리게 할 수는 있다. 삭제가 실행됐는지는 아직이다.");
          };
        }
      };
    });
    wrap.querySelector("[data-keep]").addEventListener("click", (e) => {
      if (!opened) {
        e.stopImmediatePropagation();
        ui.say("아직 메타데이터를 열지 않았다.", "bad");
      }
    }, true);
  }

  function hex(wrap, api) {
    const ui = mount(wrap, "loop_config.dat", "열리지 않는 파일", api);
    const rest = "00 00 00 00 4B 2D 77 69";
    ui.slot.innerHTML =
      "<p>확장자는 dat. 앞부분이 비어 있어 도구가 형식을 모른다. 매직 넘버를 되돌리면, 뒤에 이어진 본문을 읽을 수 있다.</p>" +
      '<div class="bytes" data-bytes></div>' +
      '<div class="tools">' +
      '<button type="button" class="tiny" data-sig="zip">ZIP · 50 4B 03 04</button>' +
      '<button type="button" class="tiny" data-sig="gz">GZIP · 1F 8B 08</button>' +
      '<button type="button" class="tiny" data-sig="png">PNG · 89 50 4E 47</button></div>' +
      '<div data-out></div>';
    const bytes = ui.slot.querySelector("[data-bytes]");
    function paint(head, hot) {
      const all = (head + " " + rest).split(" ");
      bytes.innerHTML = all.map((b, i) => '<span class="' + (hot && i < 3 ? "hot" : "") + '">' + b + "</span>").join("");
    }
    paint("00 00 00 08", false);
    ui.slot.querySelectorAll("[data-sig]").forEach((btn) => {
      btn.onclick = () => {
        const s = btn.dataset.sig;
        const out = ui.slot.querySelector("[data-out]");
        if (out.dataset.done === "1") return;
        if (s === "zip") {
          paint("50 4B 03 04", false);
          ui.say("뒤에 로컬 파일 헤더가 이어지지 않는다. ZIP이 아니다.", "bad");
        } else if (s === "png") {
          paint("89 50 4E 47", false);
          ui.say("PNG라면 IHDR이 와야 한다. 이 본문은 그림이 아니다.", "bad");
        } else if (out.dataset.done === "1") {
          return;
        } else {
          out.dataset.done = "1";
          paint("1F 8B 08", true);
          ui.say("GZIP 시그니처와 본문이 이어진다. 압축을 푼다.");
          ui.slot.querySelector("[data-out]").innerHTML =
            '<div class="split"><div class="col"><h5>autoplay.py · 계획</h5><pre class="script"># 22:50 자동 재생\n# 22:52 기숙사 나가기\n# 23:10 연구동 도착, NAS 접속\n# 23:14 v7 정리 (휴지통까지)\n# 23:40 복귀\n# 교수님이 내 이름 빼겠다고 함.\n# 졸업 요건인데...\n# FINAL: 2250\n\nplay("alibi.mp4", loop=True)  # 22:50</pre></div>' +
            '<div class="col"><h5>nas_audit.log · 실행</h5><pre class="script">23:10:18 AUTH_OK\nuser=minyoung\nsrc=172.16.40.18\nap=LAB-3F\n\n<span class="mark">23:14:02 UNLINK\n/Research/Final/paper_final_v7.docx\nuser=minyoung</span>\n\n23:14:11 TRASH_EMPTY\nuser=minyoung\n23:14:27 LOGOUT</pre></div></div>' +
            "<p>무엇을 근거로 실행을 말할 수 있나.</p><div class=\"q\">" +
            '<button type="button" class="choice" data-a="plan">주석에 적힌 23:14</button>' +
            '<button type="button" class="choice" data-a="log">UNLINK 로그만</button>' +
            '<button type="button" class="choice" data-a="both">주석의 시각과 UNLINK가 같다</button></div>';
          ui.slot.querySelectorAll("[data-a]").forEach((b) => {
            b.onclick = () => {
              if (b.dataset.a === "plan") ui.say("주석은 의도다. 그 시각에 삭제가 일어났는지는 로그가 말한다.", "bad");
              else if (b.dataset.a === "log") ui.say("로그는 실행이다. 왜 하필 그 시각인지는 주석이 맞춘다. 둘을 같이 남긴다.", "bad");
              else ui.finish("계획은 스크립트에, 실행은 연구동 AP의 minyoung 계정에 있다. 23:14:02 삭제, 이어서 휴지통. TRACE-2250.");
            };
          });
        }
      };
    });
  }

  window.MINI = { spectrogram, stego, memory, logs, meta, hex };
})();
