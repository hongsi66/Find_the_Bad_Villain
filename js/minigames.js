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
    const ui = mount(wrap, "memdump_strings.txt", "메모리에 남은 것", api);
    const tabs = {
      proc: "22:20–23:50   chrome, kakaotalk\n23:14          문서 편집 프로세스 없음\n23:14          ssh 프로세스 없음\n23:14          paper_final 문자열, 편집 중인 핸들 없음",
      net: "22:15–22:40   lab-nas.univ.example:22   CLOSED\n23:14          lab-nas 로 향하는 소켓 없음\n22:20–23:50   home-router.local         ESTABLISHED\n\n공유기 이름은 그 PC가 붙은 네트워크다.\n사람 위치와 항상 같지는 않다.",
      str: "23:13  typed   치킨 아직이야? 초인종 누르지 마\n23:13  order   #7731\n23:22  typed   문 앞에 뒀어? 응, 확인했어\n\n이 문장들은 키보드 입력 버퍼에 남아 있다."
    };
    const seen = { proc: false, net: false, str: false };
    ui.slot.innerHTML =
      '<div class="tabs">' +
      '<button type="button" class="tiny" data-t="proc">프로세스</button>' +
      '<button type="button" class="tiny" data-t="net">네트워크</button>' +
      '<button type="button" class="tiny" data-t="str">문자열</button></div>' +
      '<div class="view"><p class="mono-block" data-body>세 탭을 모두 연 뒤에 질문이 열린다.</p></div><div data-q></div>';
    const body = ui.slot.querySelector("[data-body]");
    function maybeAsk() {
      if (!seen.proc || !seen.net || !seen.str) return;
      if (ui.slot.querySelector("[data-q]").childElementCount) return;
      ui.slot.querySelector("[data-q]").innerHTML =
        "<p>23:14에 이 PC에서 확인되는 것은.</p><div class=\"q\">" +
        '<button type="button" class="choice" data-a="ssh">NAS에 SSH로 접속 중이었다</button>' +
        '<button type="button" class="choice" data-a="chat">집에서 배달을 기다리며 채팅을 치고 있었다</button>' +
        '<button type="button" class="choice" data-a="edit">연구실에서 논문을 고치고 있었다</button></div>';
      ui.slot.querySelectorAll("[data-a]").forEach((b) => {
        b.onclick = () => {
          if (b.dataset.a === "ssh") ui.say("SSH는 22:40에 닫혔다. 23:14의 소켓 목록에 NAS가 없다.", "bad");
          else if (b.dataset.a === "edit") ui.say("그 시각의 프로세스에는 논문 편집기가 없다.", "bad");
          else askNuance();
        };
      });
    }
    function askNuance() {
      ui.slot.querySelector("[data-q]").innerHTML =
        "<p>집 공유기 기록만으로, 솔미가 그 방에 있었다고 단정할 수 있나.</p><div class=\"q\">" +
        '<button type="button" class="choice" data-a="yes">있다. 네트워크가 집이면 사람도 집이다</button>' +
        '<button type="button" class="choice" data-a="no">없다. PC의 위치일 뿐이다. 키보드 입력과 수령 답장이 사람을 보강한다</button></div>';
      ui.slot.querySelectorAll("[data-a]").forEach((b) => {
        b.onclick = () => {
          if (b.dataset.a === "yes") ui.say("공유기는 그 컴퓨터가 붙은 곳이다. 사람이 의자 위에 있었는지는 입력 기록이 따로 말한다.", "bad");
          else ui.finish("NAS 접속은 22:40에 끝났다. 23:14의 키보드는 집이었고, 그 사실도 공유기 단독이 아니라 입력 문자로 보강된다. 주문 7731. TRACE-7731.");
        };
      });
    }
    ui.slot.querySelectorAll("[data-t]").forEach((btn) => {
      btn.onclick = () => {
        ui.slot.querySelectorAll("[data-t]").forEach((b) => b.classList.remove("on"));
        btn.classList.add("on");
        seen[btn.dataset.t] = true;
        body.textContent = tabs[btn.dataset.t];
        maybeAsk();
      };
    });
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
