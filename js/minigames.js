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
    let solved = false;
    ui.slot.innerHTML =
      // 첫 화면: alibi.mp4 첫 장면 사진 + 가운데 재생(▶) 표시. 재생을 누르면 실제 영상이 10초 반복된다
      '<div class="player" style="padding:0;display:block;min-height:0;aspect-ratio:698/460;max-width:100%">' +
      '<img data-poster src="assets/alibi_poster.jpg" alt="alibi.mp4 첫 장면" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">' +
      '<video data-video src="assets/alibi.mp4" playsinline preload="auto" hidden style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#050607"></video>' +
      '<button type="button" data-bigplay aria-label="재생" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;border:2px solid rgba(255,255,255,.85);background:rgba(0,0,0,.45);color:#fff;font-size:24px;line-height:1;padding:0 0 0 5px;cursor:pointer">▶</button>' +
      '<i class="bar"></i>' +
      '<div class="cap" data-cap hidden style="position:absolute;left:16px;right:16px;bottom:14px;text-shadow:0 1px 4px #000">목에 흉터가 사라졌군.</div></div>' +
      '<div class="tools">' +
      '<button type="button" class="tiny" data-v="play">재생</button>' +
      '<button type="button" class="tiny" data-v="meta">메타데이터</button>' +
      '<button type="button" class="tiny" data-v="size">용량</button></div>' +
      '<div class="view" data-view><p>같은 장면이 열 초마다 돌아온다.</p></div>';
    const view = ui.slot.querySelector("[data-view]");
    const video = ui.slot.querySelector("[data-video]");
    const poster = ui.slot.querySelector("[data-poster]");
    const bigPlay = ui.slot.querySelector("[data-bigplay]");
    const cap = ui.slot.querySelector("[data-cap]");
    // 영상이 끝나면 처음으로 돌린 뒤, 다시 첫 장면 사진과 ▶ 표시로 돌아간다
    function stopVideo() {
      video.pause();
      video.currentTime = 0;
      video.hidden = true;
      cap.hidden = true;
      poster.hidden = false;
      bigPlay.style.display = "";
    }
    // 사진을 숨기고 영상을 보여 준 뒤 한 번 재생한다
    function startVideo() {
      poster.hidden = true;
      bigPlay.style.display = "none";
      video.hidden = false;
      cap.hidden = false;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    }
    video.addEventListener("ended", stopVideo);
    bigPlay.onclick = () => ui.slot.querySelector('[data-v="play"]').click();
    ui.slot.querySelectorAll("[data-v]").forEach((btn) => {
      btn.onclick = () => {
        const v = btn.dataset.v;
        if (v === "play") {
          startVideo();
          view.innerHTML = "<p>이 영상이 반복 재생 됐다는거군. 내용만 봐서는 이 파일이 언제 만들어졌는지 알 수 없다.</p>";
          if (!solved) ui.say("반복은 들린다. 만든 시각은 파일 쪽에 있다.");
        } else if (v === "size") {
          view.innerHTML = "<p>alibi.mp4 용량은 600KB.<br><br>10초. 용량은 그 길이에 비해 평범하다. 영상 파일 안에 숨겨진 데이터가 있는 건 아니겠군.</p>";
          if (!solved) ui.say("용량은 정상이다. 다른 칸을 본다.");
        } else {
          opened = true;
          view.innerHTML =
            '<table class="meta">' +
            "<tr><td>creation_time</td><td>2026-10-30 22:47:06</td></tr>" +
            "<tr><td>duration</td><td>00:00:10</td></tr>" +
            "<tr><td>encoder</td><td>loop_maker</td></tr>" +
            "<tr><td>comment</td><td>see loop_config.dat</td></tr></table>" +
            // 혜진 문제처럼 직접 숫자를 적어 확인한다
            '<div class="field"><label>반복 영상의 생성 시각은?</label><input data-code maxlength="5" inputmode="numeric" placeholder="시분 4자리"><button type="button" class="tiny" data-read>확인</button></div>';
          if (solved) {
            // 이미 맞힌 뒤에 다시 열면 답을 채워 두고 입력은 잠근다
            const inp = view.querySelector("[data-code]");
            inp.value = "2247";
            inp.disabled = true;
            view.querySelector("[data-read]").disabled = true;
          } else ui.say("만들어진 시각과, 다음에 열 파일 이름.");
          view.querySelector("[data-read]").onclick = () => {
            const raw = view.querySelector("[data-code]").value.replace(/\s/g, "");
            if (raw === "2247" || raw === "22:47") {
              solved = true;
              ui.finish("사건 당일 22:47에 만들어진 10초 반복. 주석이 loop_config.dat를 확인하라고 한다. 방에 사람이 있는 것처럼 들리게 했다. 이 사람이 범인인가? 확신은 없다.");
              // 맞힌 뒤에도 재생 · 메타데이터 · 용량은 계속 볼 수 있게 다시 켠다
              ui.slot.querySelectorAll("[data-v]").forEach((x) => { x.disabled = false; });
            } else ui.say("creation_time의 시와 분을 네 자리로 적는다. 날짜와 초는 빼고 시각만.", "bad");
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
    // 실제 loop_config.dat의 앞 16바이트. 앞 3칸이 00 00 00으로 덮여 있다 (6C 6F 6F 70 5F 63 = "loop_c")
    const raw = "00 00 00 08 6A A0 E4 6A 02 03 6C 6F 6F 70 5F 63".split(" ");
    const BAD = "background:var(--danger);color:#10140f;border-color:transparent";
    const NAME = "11번째 칸부터 loop_c… 이름이 보인다.";
    // 형식 후보: 이름, 매직넘버, 파일 이름이 들어가는 곳, 고른 뒤 나오는 판정과 이유
    const SIGS = {
      zip: {
        label: "ZIP", head: "50 4B 03 04", where: "31번째 칸부터 + 파일 끝에 PK와 이름이 한 번 더", ok: false,
        verdict: "뒤에 로컬 파일 헤더가 이어지지 않는다. ZIP이 아니다.",
        why: ["덮인 칸은 3개인데 ZIP 매직넘버는 4바이트다. 멀쩡한 넷째 칸 08까지 덮어써야 한다.",
              "ZIP이라면 파일 이름이 31번째 칸부터 나온다. 여기서는 " + NAME]
      },
      gz: {
        label: "GZIP", head: "1F 8B 08", where: "11번째 칸부터 (헤더 10칸 바로 뒤)", ok: true,
        verdict: "파일이 열린다! 원래 gzip 파일이었구나. 압축 해제를 하니 autoplay.py, nas_audit.log 파일이 있다.",
        why: []
      },
      pdf: {
        label: "PDF", head: "25 50 44 46 2D", where: "이름 저장 안 함 (문서 파일)", ok: false,
        verdict: "글자로 읽히지 않는다. PDF가 아니다.",
        why: ["덮인 칸은 3개인데 PDF 매직넘버는 5바이트(%PDF-)다. 멀쩡한 08 6A까지 덮어써야 한다.",
              "PDF라면 %PDF-1.7처럼 글자가 이어져야 한다. 여기는 알아볼 수 없는 바이트 뒤에 loop_c… 이름이 나온다."]
      },
      png: {
        label: "PNG", head: "89 50 4E 47 0D 0A 1A 0A", where: "이름 저장 안 함 (그림 파일)", ok: false,
        verdict: "PNG라면 IHDR이 와야 한다. 이 본문은 그림이 아니다.",
        why: ["덮인 칸은 3개인데 PNG 매직넘버는 8바이트다. 멀쩡한 넷째 칸부터 여덟째 칸까지 덮어써야 한다.",
              "그림 파일은 이름을 저장하지 않는다. 그런데 " + NAME]
      },
      jpg: {
        label: "JPG", head: "FF D8 FF", where: "이름 저장 안 함 (그림 파일)", ok: false,
        verdict: "길이는 3바이트로 맞는다. 그런데 뒤 내용이 JPG와 다르다. JPG가 아니다.",
        why: ["그림 파일은 이름을 저장하지 않는다. 그런데 " + NAME,
              "JPG라면 넷째 칸에 E0이나 E1이 와야 한다. 여기는 08이다."]
      }
    };
    const ORDER_SIG = ["zip", "gz", "pdf", "png", "jpg"];
    function ascii(list) {
      return list.map((b) => {
        const c = parseInt(b, 16);
        return c >= 0x21 && c <= 0x7e ? String.fromCharCode(c) : ".";
      }).join("");
    }
    // HxD 화면처럼 그린다: 왼쪽 Offset, 가운데 16칸(위에 칸 번호), 오른쪽 Decoded text
    const CELL = "display:inline-block;min-width:30px;text-align:center;padding:4px 2px;border-radius:5px;border:1px solid rgba(255,255,255,.06);background:#0c0e13";
    function hexView(list, styleOf) {
      const head = list.map((_, i) => '<span style="min-width:30px;display:inline-block;text-align:center;font-size:10px;opacity:.55">' + (i + 1) + "</span>").join("");
      const body = list.map((b, i) => '<span style="' + CELL + ";" + (styleOf ? styleOf(i) : "") + '">' + b + "</span>").join("");
      return '<div style="overflow-x:auto"><div style="display:grid;grid-template-columns:auto auto auto;gap:4px 14px;align-items:center;font-family:var(--mono);font-size:13px;width:max-content">' +
        '<span style="font-size:11px;opacity:.55">Offset(h)</span><div style="display:flex;gap:4px">' + head + '</div><span style="font-size:11px;opacity:.55">Decoded text</span>' +
        '<span style="opacity:.7">00000000</span><div style="display:flex;gap:4px">' + body + '</div><span style="letter-spacing:.12em">' + ascii(list) + "</span></div></div>";
    }
    // 구역마다 테두리 상자로 나눈다
    const BOX = "border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px 14px;margin-top:12px;background:rgba(255,255,255,.02)";
    const H = '<h5 style="margin:0 0 10px;font-weight:500">';
    const TD = "padding:7px 10px;border-bottom:1px solid rgba(255,255,255,.06);white-space:nowrap";
    ui.slot.innerHTML =
      "<p>확장자는 dat. HxD로 열어 보니 맨 앞 세 칸이 00 00 00으로 덮여 있다. 누군가 일부러 매직 넘버를 지운 것 같다. 매직 넘버를 되돌리면, 뒤에 이어진 본문을 읽을 수 있다.</p>" +
      '<section style="' + BOX + '">' + H + "HxD로 본 앞부분 (원본)</h5>" +
      hexView(raw, (i) => (i < 3 ? "border-color:var(--danger)" : "")) + "</section>" +
      '<section style="' + BOX + '">' + H + "자주 쓰는 형식의 매직넘버</h5>" +
      '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:14px;width:100%">' +
      '<tr style="color:var(--dim)"><td style="' + TD + '">형식</td><td style="' + TD + '">시작 바이트</td><td style="' + TD + '">길이</td><td style="' + TD + '">파일 이름 위치</td></tr>' +
      ORDER_SIG.map((k) => { const g = SIGS[k]; return '<tr><td style="' + TD + '">' + g.label + '</td><td style="' + TD + ';font-family:var(--mono)">' + g.head + '</td><td style="' + TD + '">' + g.head.split(" ").length + '바이트</td><td style="' + TD + ';white-space:normal">' + g.where + "</td></tr>"; }).join("") +
      "</table></div></section>" +
      '<section style="' + BOX + '">' + H + "이 파일은 원래 무엇이었나</h5>" +
      "<p style=\"margin:0\">덮인 칸 수와 파일 이름 위치를 보면, 지워진 매직 넘버를 짐작할 수 있다. 원래 형식을 골라 되돌려 본다.</p>" +
      '<div class="tools">' + ORDER_SIG.map((k) => '<button type="button" class="tiny" data-sig="' + k + '">' + SIGS[k].label + "</button>").join("") + "</div>" +
      '<button type="button" class="primary" data-submit disabled>매직 넘버를 되돌린다</button>' +
      '<div data-fix hidden style="margin-top:14px">' +
      '<p class="hint" style="margin:0 0 6px" data-fix-label></p>' +
      '<div data-fix-bytes></div>' +
      '<p data-verdict style="margin:10px 0 4px"></p>' +
      '<ul data-why class="hint" style="margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:4px"></ul></div></section>' +
      '<div data-out style="margin-top:14px"></div>';
    const fix = ui.slot.querySelector("[data-fix]");
    const out = ui.slot.querySelector("[data-out]");
    let built = false;
    let solved = false;
    // 고른 매직넘버를 맨 앞에 덮어쓴 결과를 원본 아래에 보여 준다 (바이트가 밀리지 않고 그 칸만 바뀐다)
    function showFix(key) {
      const sig = SIGS[key];
      const h = sig.head.split(" ");
      const all = raw.map((b, i) => (i < h.length ? h[i] : b));
      fix.querySelector("[data-fix-label]").textContent = sig.label + " 매직넘버로 되돌린 결과 · " + sig.head + " (" + h.length + "바이트)";
      const GOOD = "background:var(--ok);color:#10140f;border-color:transparent";
      fix.querySelector("[data-fix-bytes]").innerHTML = hexView(all, (i) => (i < h.length ? (sig.ok ? GOOD : BAD) : ""));
      const v = fix.querySelector("[data-verdict]");
      v.className = sig.ok ? "good" : "bad";
      v.textContent = sig.verdict;
      fix.querySelector("[data-why]").innerHTML = sig.why.map((t) => "<li>" + t + "</li>").join("");
      fix.querySelector("[data-why]").hidden = !sig.why.length;
      fix.hidden = false;
    }
    // 압축을 푼 결과 + 질문. 처음 GZIP을 눌렀을 때 한 번만 만든다
    function buildOut() {
      if (built) return;
      built = true;
      out.innerHTML =
        '<div class="split"><div class="col"><h5>autoplay.py · 계획</h5><pre class="script"># 22:50 자동 재생\n# 22:52 기숙사 나가기\n# 23:10 연구동 도착, NAS 접속\n# 23:14 v7 정리 (휴지통까지)\n# 23:40 복귀\n# 교수님이 내 이름 빼겠다고 함.\n# 졸업 요건인데...\n# FINAL: 2250\n\nplay("alibi.mp4", loop=True)  # 22:50</pre></div>' +
        '<div class="col"><h5>nas_audit.log · 실행</h5><pre class="script">23:10:18 AUTH_OK\nuser=minyoung\nsrc=172.16.40.18\nap=LAB-3F\n\n<span class="mark">23:14:02 UNLINK\n/Research/Final/paper_final_v7.docx\nuser=minyoung</span>\n\n23:14:11 TRASH_EMPTY\nuser=minyoung\n23:14:27 LOGOUT</pre></div></div>' +
        "<p>무엇을 근거로 실행을 말할 수 있나.</p><div class=\"q\">" +
        '<button type="button" class="choice" data-a="plan">주석에 23:14 계획이 적혀 있다</button>' +
        '<button type="button" class="choice" data-a="log">UNLINK 삭제 로그가 남아 있다</button>' +
        '<button type="button" class="choice" data-a="both">주석의 시각과 UNLINK 시각이 같다</button></div>';
      out.querySelectorAll("[data-a]").forEach((b) => {
        b.onclick = () => {
          if (b.dataset.a === "plan") ui.say("주석은 의도다. 그 시각에 삭제가 일어났는지는 로그가 말한다.", "bad");
          else if (b.dataset.a === "log") ui.say("로그는 실행이다. 왜 하필 그 시각인지는 주석이 맞춘다. 둘을 같이 남긴다.", "bad");
          else {
            solved = true;
            ui.finish("계획은 스크립트에, 실행은 연구동 AP의 minyoung 계정에 있다. 23:14:02 삭제, 이어서 휴지통. TRACE-2250.");
            // 다 푼 뒤에도 ZIP · GZIP · PNG는 다시 눌러 볼 수 있다
            ui.slot.querySelectorAll("[data-sig], [data-submit]").forEach((x) => { x.disabled = false; });
          }
        };
      });
    }
    // 형식 버튼은 고르기만 하고, 제출을 눌러야 결과가 나온다
    let picked = null;
    const submit = ui.slot.querySelector("[data-submit]");
    ui.slot.querySelectorAll("[data-sig]").forEach((btn) => {
      btn.onclick = () => {
        picked = btn.dataset.sig;
        ui.slot.querySelectorAll("[data-sig]").forEach((x) => x.classList.toggle("on", x === btn));
        submit.disabled = false;
      };
    });
    submit.onclick = () => {
      if (!picked) return;
      showFix(picked);
      if (picked === "gz") {
        buildOut();
        out.hidden = false;
      } else {
        // 틀린 형식으로는 열리지 않으니, 풀린 내용은 숨긴다
        out.hidden = true;
        if (!solved) ui.say("");
      }
    };
  }

  window.MINI = { spectrogram, stego, memory, logs, meta, hex };
})();
