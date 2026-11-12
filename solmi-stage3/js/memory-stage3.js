// Solmi Stage 3 memory analyzer function.
// Integration: replace the existing memory(wrap, api) function in js/minigames.js with this function.
function memory(wrap, api) {
    const ui = mount(wrap, "mem.raw", "사라지지 않은 기록", api);

    // 수업에서 다룬 HxD의 핵심 동작(오프셋/Hex/문자 디코딩/문자열 검색)을
    // 브라우저 안에서 재현한 교육용 메모리 이미지 뷰어다. 실제 RAM 덤프는 아니다.
    const records = [
      "MEMORY IMAGE // SOLMI-PC // 2026-10-30",
      "[22:15:03] note: NAS 작업을 마치고 연결을 종료함",
      "[22:40:18] ssh session closed: lab-nas.univ.example",
      "[22:51:09] browser tab: lecture review",
      "[23:02:14] FoodApp.exe started",
      "[23:05:41] order request sent: delivery status confirmed",
      "[23:13:52] memo input: 치킨 아직 안 왔냐고 진짜",
      "[23:14:07] memo input: 초인종 누르면 알려줘",
      "[23:14:11] order_id=7731&status=confirmed",
      "[23:22:36] memo input: 문 앞에 뒀다고? 확인했어",
      "[23:24:02] delivery notification: delivered",
      "[23:50:00] home-router.local connection active",
      "END OF CAPTURE"
    ];
    const textData = records.join("\r\n") + "\r\n";
    const bytes = [];
    for (let i = 0; i < textData.length; i++) {
      const c = textData.charCodeAt(i);
      bytes.push(c & 255, (c >> 8) & 255); // UTF-16LE
    }
    // 검색 화면과 Hex 뷰가 실제로 같은 바이트 배열을 참조하도록 구성한다.
    function decodeAt(offset, count) {
      let out = "";
      for (let i = offset; i + 1 < Math.min(bytes.length, offset + count); i += 2) {
        const code = bytes[i] | (bytes[i + 1] << 8);
        out += code === 0 ? "·" : (code >= 32 ? String.fromCharCode(code) : "·");
      }
      return out;
    }
    function toHex(n) { return n.toString(16).toUpperCase().padStart(2, "0"); }

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
        '</div>' +
        '<div class="field" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<input data-mem-query placeholder="검색할 문자열 입력" aria-label="검색할 문자열" style="flex:1;min-width:150px" />' +
          '<button type="button" class="primary" data-mem-find>찾기</button>' +
        '</div>' +
        '<div class="hint" data-mem-status>검색어를 입력해 메모리 안의 기록을 찾아보자.</div>' +
        '<div class="view" style="padding:0;overflow:auto">' +
          '<div style="display:grid;grid-template-columns:82px minmax(250px,1fr) minmax(180px,1fr);gap:8px;padding:9px 10px;background:var(--panel);font-size:11px;color:var(--muted);font-family:var(--mono);position:sticky;top:0">' +
            '<b>Offset</b><b>Hexadecimal</b><b>Decoded text</b></div>' +
          '<div data-mem-rows style="font:11px/1.65 var(--mono);min-width:560px"></div>' +
        '</div>' +
        '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
          '<button type="button" class="tiny" data-hint>힌트 보기</button><span class="hint" data-hint-text>힌트는 3단계로 제공된다.</span>' +
        '</div>' +
        '<div data-mem-answer hidden class="field" style="border-top:1px solid var(--line);padding-top:12px">' +
          '<label>기록에서 확인한 주문번호를 입력하라</label>' +
          '<div style="display:flex;gap:8px"><input data-mem-code inputmode="numeric" maxlength="4" placeholder="네 자리 주문번호" style="flex:1"/><button type="button" class="primary" data-mem-submit>증거 제출</button></div>' +
        '</div>' +
      '</div>';

    const rows = ui.slot.querySelector('[data-mem-rows]');
    const query = ui.slot.querySelector('[data-mem-query]');
    const encoding = ui.slot.querySelector('#mem-encoding');
    const status = ui.slot.querySelector('[data-mem-status]');
    const answer = ui.slot.querySelector('[data-mem-answer]');
    let hintLevel = 0;
    let searchOffset = -1;

    function renderRows(focusOffset) {
      const rowSize = 16;
      let html = '';
      for (let offset = 0; offset < bytes.length; offset += rowSize) {
        const slice = bytes.slice(offset, offset + rowSize);
        const hex = slice.map(toHex).join(' ');
        let decoded = '';
        if (encoding.value === 'unicode') decoded = decodeAt(offset, rowSize);
        else decoded = slice.map((b) => b >= 32 && b <= 126 ? String.fromCharCode(b) : '·').join('');
        const hit = focusOffset >= offset && focusOffset < offset + rowSize;
        html += '<div data-offset="' + offset + '" style="display:grid;grid-template-columns:82px minmax(250px,1fr) minmax(180px,1fr);gap:8px;padding:3px 10px;border-bottom:1px solid var(--line);background:' + (hit ? 'rgba(231,137,154,.16)' : 'transparent') + '">' +
          '<span style="color:var(--muted)">' + offset.toString(16).toUpperCase().padStart(8, '0') + '</span>' +
          '<span style="white-space:pre;color:var(--ink)">' + hex.padEnd(47, ' ') + '</span>' +
          '<span style="white-space:pre;color:var(--ink)">' + decoded.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</span></div>';
      }
      rows.innerHTML = html;
      if (focusOffset >= 0) {
        const target = rows.querySelector('[data-offset="' + (Math.floor(focusOffset / rowSize) * rowSize) + '"]');
        if (target) target.scrollIntoView({ block: 'nearest' });
      }
    }
    function search() {
      const term = query.value;
      if (!term) { status.textContent = '검색어를 입력해.'; return; }
      let needle = [];
      if (encoding.value === 'unicode') {
        for (let i = 0; i < term.length; i++) { const c = term.charCodeAt(i); needle.push(c & 255, (c >> 8) & 255); }
      } else needle = Array.from(term).map((c) => c.charCodeAt(0) & 255);
      let found = -1;
      outer: for (let i = 0; i <= bytes.length - needle.length; i++) {
        for (let j = 0; j < needle.length; j++) if (bytes[i + j] !== needle[j]) continue outer;
        found = i; break;
      }
      if (found < 0) {
        searchOffset = -1; status.textContent = '일치하는 문자열을 찾지 못했다. 문자 집합 설정을 확인해 봐.';
        renderRows(-1); return;
      }
      searchOffset = found;
      status.textContent = '검색 결과: Offset 0x' + found.toString(16).toUpperCase().padStart(8, '0') + ' · 주변 데이터를 확인해 봐.';
      renderRows(found);
      answer.hidden = false;
    }
    ui.slot.querySelector('[data-mem-find]').onclick = search;
    ui.slot.querySelector('[data-hx-search]').onclick = () => { query.focus(); status.textContent = '찾을 문자열을 입력한 뒤 찾기를 누른다.'; };
    query.addEventListener('keydown', (event) => { if (event.key === 'Enter') search(); });
    ui.slot.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') { event.preventDefault(); query.focus(); } });
    encoding.onchange = () => { renderRows(searchOffset); status.textContent = encoding.value === 'unicode' ? 'Unicode(UTF-16LE)로 디코딩하고 있다.' : 'ASCII 방식으로 표시하고 있다.'; };
    ui.slot.querySelector('[data-hint]').onclick = () => {
      hintLevel = Math.min(3, hintLevel + 1);
      const hints = [
        '1단계: 메모리에는 실행 중 입력한 문자열이 남을 수 있다.',
        '2단계: HxD에서 Ctrl+F를 누르듯, 검색어를 입력해 문자열을 찾아보자.',
        '3단계: 이 기록은 Unicode(UTF-16LE)로 저장되어 있다. 사건 시각인 23:14를 검색해 주변 기록을 읽어 봐.'
      ];
      ui.slot.querySelector('[data-hint-text]').textContent = hints[hintLevel - 1];
    };
    ui.slot.querySelector('[data-mem-submit]').onclick = () => {
      const code = ui.slot.querySelector('[data-mem-code]').value.trim();
      if (code === '7731') ui.finish('메모리 기록에서 주문번호 7731을 확인했다. NAS SSH 세션은 22:40에 종료됐고, 23:14에는 배달을 기다리는 입력 기록이 남아 있다. 솔미의 알리바이가 증거로 보강됐다. TRACE-7731.');
      else ui.say('주문 요청 기록에서 order_id 값을 다시 확인해 봐.', 'bad');
    };
    renderRows(-1);
    ui.say('메모리 이미지가 열렸다. 문자열 검색과 문자 집합 설정을 이용해 기록을 찾아보자.');
  }
