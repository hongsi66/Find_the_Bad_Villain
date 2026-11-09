window.STORY = {
  BG: {
    grand: "background/멋있어보이는연구실.jpeg",
    lab: "background/연구실.jpeg",
    cctv: "background/cctv를 보고있는 연구실 사진.jpeg",
    working: "background/연구실에서일하고있는사람.jpeg",
    hall: "background/학교복도.jpeg",
    gate: "background/학교출입문.jpeg",
    guitar: "background/누군가의집.jpeg",
    quarter: "background/누군가의집2.jpeg",
    messy: "background/누군가의어질러진집.jpeg",
    dorm: "background/밤샘커피를 마시는 누군가의 집.jpeg"
  },
  CAST: {
    hyejin: { name: "혜진", color: "#ff8aa3", img: "character/혜진.jpeg", mode: "studio", role: "코인 차트에서 눈을 떼지 못하는 학부연구생" },
    hyeseon: { name: "혜선", color: "#c9b6ff", img: "character/혜선.jpeg", mode: "illust", role: "혼자 있는 시간을 아끼는 학부연구생" },
    solmi: { name: "솔미", color: "#9eb6ff", img: "character/솔미.jpeg", mode: "studio", role: "연구실 NAS를 맡은 학부연구생" },
    jihee: { name: "지희", color: "#ffc56d", img: "character/지희.jpeg", mode: "illust", role: "학생회와 밴드부를 오가는 학부연구생" },
    minyoung: { name: "민영", color: "#f0b3c8", img: "character/민영.jpeg", mode: "illust", role: "방에서 드라마를 반복해 보는 학부연구생" },
    prof: { name: "교수", color: "#e6d3b0" },
    assist: { name: "조교", color: "#b7c4ce" },
    player: { name: "나", color: "#8fd0c4" },
    nar: { name: "", color: "#d9d0c3" },
    thought: { name: "생각", color: "#e6b15c" }
  },
  DOSSIERS: {
    hyejin: {
      front: { tag: "소문", title: "충동적인 투자자", text: "감정 기복이 크고, 술과 코인 이야기로 대화를 삼킨다. 사건 당일에도 술집에 있었다고 했다." },
      back: { tag: "기록 TRACE-2314", title: "술집에 묶인 두 시각", points: ["23:09 학교 앞 술집 카드 결제 38,000원", "같은 녹음의 고주파 시각 표식 23:14", "비명과 결제가 같은 장소. 연구동까지 도보 15분", "사건 시각에 연구동에 있었을 가능성은 낮다"] }
    },
    hyeseon: {
      front: { tag: "소문", title: "거리 두는 취향", text: "일본어를 섞어 말하고, 연구실 사람들과 잘 섞이지 않는다. 집이라고만 했다." },
      back: { tag: "기록 TRACE-0832", title: "집이라는 말 한 겹", points: ["사진은 취미 파일이고, 시각만으로는 장소가 없다", "파일 꼬리의 메모: 23:12 정문 편의점 영수증 0832", "연구동까지 도보 20분. 23:14 현장에는 닿지 못한다", "거짓은 있다. 그 거짓은 범행이 아니다"] }
    },
    solmi: {
      front: { tag: "소문", title: "삭제할 수 있는 사람", text: "NAS 관리자다. 말수가 적고, 권한만 보면 가장 먼저 이름이 나온다." },
      back: { tag: "기록 TRACE-7731", title: "권한과 그 시각의 키보드", points: ["NAS SSH는 22:40에 종료. 23:14에 연구실 접속 없음", "집 공유기는 PC가 집에 있었음을 보여줄 뿐, 사람까지 확정하지 않는다", "23:13 키보드 입력과 23:22 배달 수령 답장이 사람 위치를 보강", "지난주 민영 계정에 수정 권한을 올려 두고 아직 내리지 않음"] }
    },
    jihee: {
      front: { tag: "소문", title: "모두가 좋아하는 사람", text: "학생회와 밴드. 연구실에서도 먼저 말을 건다. 숨길 것이 없어 보인다." },
      back: { tag: "기록 TRACE-2316", title: "길 위에 있던 목격", points: ["22:58 민영의 방 앞. 같은 대사가 반복", "23:00 학생회관으로 출발, 23:16 출입", "23:14에는 연구동이 아니라 이동 중", "민영의 답장 카톡은 00:41"] }
    },
    minyoung: {
      front: { tag: "소문", title: "갈등 없는 사람", text: "방에서 드라마를 본다. 목소리를 높이지 않고, 누구의 선입견에도 맨 아래에 있다." },
      mid: { tag: "기록 미완", title: "만들어진 10초", points: ["제출한 영상은 같은 장면이 반복되는 10초", "생성 시각 10월 30일 22:47, 도구 loop_maker", "주석에 loop_config.dat", "영상은 방에 사람이 있는 것처럼 들리게 할 수 있다. 삭제의 실행은 아직이다"] },
      back: { tag: "기록 TRACE-2250", title: "계획과 실행", points: ["loop_config.dat는 확장자와 달리 GZIP", "스크립트: 22:50 재생, 22:52 외출, 23:14 삭제 계획", "NAS 감사 로그: 23:10 연구동 AP, 계정 minyoung", "23:14:02 UNLINK paper_final_v7.docx, 이어서 휴지통 비움", "동기: 공저자 제외와 졸업 요건"] }
    }
  },
  TIMELINE: [
    ["22:40", "솔미의 NAS 접속 종료"],
    ["22:47", "민영의 영상 생성 · loop_maker"],
    ["22:50", "자동 재생 예약"],
    ["22:52", "외출 계획"],
    ["22:58", "지희, 민영 방 앞에서 반복 대사"],
    ["23:00", "지희, 학생회관으로 출발"],
    ["23:09", "혜진, 학교 앞 술집 결제"],
    ["23:10", "연구동 AP에서 minyoung 접속"],
    ["23:12", "혜선, 정문 편의점 결제"],
    ["23:13", "솔미의 집 PC에서 채팅 입력"],
    ["23:14", "술집의 비명 / 논문 최종본 삭제"],
    ["23:16", "지희, 학생회관 입실"],
    ["00:41", "민영의 사과 메시지"]
  ],
  REBUTTAL: {
    hyejin: "혜진의 23:09 결제와 23:14 비명은 같은 술집에 묶여 있다. 연구동까지는 걸어서 15분이다. 시끄럽다는 인상과, 그 시각의 위치는 다른 이야기다.",
    hyeseon: "혜선은 집이라고 했고, 영수증은 23:12 정문 편의점이다. 그 차이는 거짓이 맞다. 다만 연구동까지 20분이라, 23:14의 현장에는 있을 수 없다.",
    solmi: "솔미는 관리자고, 그래서 가장 먼저 의심받았다. SSH는 22:40에 끝났고, 삭제는 23:14에 민영 계정으로 연구동 AP에서 남았다. 집 공유기만으로 사람을 확정할 수는 없지만, 그 PC의 키보드 기록도 연구실 로그와 맞지 않는다.",
    jihee: "지희는 22:58에 민영의 방 앞에 있었고 23:16에 학생회관에 들어갔다. 23:14에는 그 사이 길에 있었다. 그녀가 들은 반복 대사는 범행을 가린 소리였다."
  }
};

window.STORY.SCENES = {
  prologue: {
    bg: "lab",
    place: "10월 31일 오전 9:30 · 정보보호 연구실",
    focus: null,
    lines: [
      { who: "nar", text: "토요일 아침인데, 연구실의 공기는 밤처럼 무겁다. 책상 위에는 출력된 초안과 메모가 흩어져 있다." },
      { who: "nar", cg: "working", hide: true, text: "조교가 모니터 앞에서 경로를 다시 연다. 화면의 문장은 짧다." },
      { who: "nar", cg: "working", hide: true, text: "paper_final_v7.docx\nNAS / Research / Final /\n요청한 파일을 찾을 수 없습니다.\n휴지통은 비어 있고, 남은 백업은 지난주의 v5뿐이다." },
      { who: "prof", bg: "lab", hide: true, dir: "책상을 내리치며", text: "이게 대체 무슨 짓이야." },
      { who: "prof", hide: true, dir: "목소리를 낮추지 못한 채", text: "두 달 동안 다듬은 최종본이다. 내일이 투고 마감인데, 파일이 통째로 사라졌어." },
      { who: "assist", hide: true, dir: "화면에서 눈을 떼지 못하고", text: "교수님, NAS 오류일 가능성은… 로그가 너무 깨끗합니다. 휴지통까지 비워져 있어요." },
      { who: "prof", hide: true, text: "어젯밤 연구실 출입 기록이 있는 학생은 다섯이다. 혜진, 혜선, 민영, 솔미, 지희." },
      { who: "assist", hide: true, text: "다섯 명 모두, 그 시간에는 연구실에 없었다고 했습니다. 민영 학생은 원래도 말이 짧아서, 진술이라고 해 봐야 방에서 드라마를 봤다는 정도고요." },
      { who: "prof", hide: true, dir: "잠시 침묵한 뒤", text: "누군가의 말은 사실과 다를 거다. 그래서 밖 사람을 불렀네. 자네다." },
      { who: "player", hide: true, text: "알겠습니다. 파일부터 압수할까요." },
      { who: "prof", hide: true, dir: "고개를 저으며", text: "그렇게 들이대면 애들은 입을 닫네. 오늘은 조사관처럼 굴지 말게. 이야기를 듣게." },
      { who: "prof", hide: true, text: "다만 한 가지는 지키게. 인상으로 판단하지 말게. 기록이 말할 때, 그때 믿게." },
      { who: "nar", hide: true, text: "책상 위 메모에는 다섯 이름이 적혀 있다. 아직 아무도 범인으로 적히지 않았다." }
    ]
  },

  titlecard: {
    bg: "grand",
    place: "",
    focus: null,
    lines: [
      { who: "nar", hide: true, text: "LAST TRACE\n사라진 최종본" },
      { who: "nar", bg: "quarter", hide: true, text: "학교 측이 비워 둔 임시 방이다. 책상 위에는 다섯 장의 이름표와, 아직 열지 않은 노트북이 있다." },
      { who: "thought", hide: true, text: "오늘은 취조가 아니다. 먼저 사람을 만난다. 파일은, 그들이 내밀 때 본다." }
    ]
  },

  hyejin: {
    bg: "gate",
    place: "10월 31일 오전 10:20 · 학교 앞",
    focus: "hyejin",
    lines: [
      { who: "nar", text: "아직 문을 열지 않은 술집. 빗물에 젖은 테라스 구석에서, 혜진은 고개를 들지 않는다." },
      { who: "nar", text: "손안의 화면은 온통 빨간색이다. 숫자가 떨어질 때마다 그녀의 어깨가 따라 내려앉는다." },
      { who: "hyejin", dir: "화면에서 눈을 떼지 않은 채", text: "15퍼센트. 진짜… 제 인생도 같이 폭락 중인데.", mood: "down" },
      { who: "player", choices: [
        { t: "옆에 앉아, 차트부터 같이 본다.", aff: 2, react: { who: "hyejin", dir: "그제야 고개를 들고", text: "어, 앉아요. 어차피 망한 거, 구경은 공짜예요.", mood: "smile" } },
        { t: "논문 이야기부터 꺼낸다.", aff: 0, react: { who: "hyejin", dir: "한숨과 함께 휴대폰을 탁 놓고", text: "아, 그거요. 연구실 난리 났다던. 지금은 제 계좌가 더 급한데.", mood: "cold" } }
      ]},
      { who: "hyejin", text: "친구들이랑 마시기로 했는데 다들 취소했어요. 그래서 혼자 마셨고, 혼자 봤고, 혼자 소리 질렀어요.", mood: "warm" },
      { who: "player", choices: [
        { t: "얼마나 크게 질렀는지 묻는다.", aff: 1, react: { who: "hyejin", dir: "민망한 듯 웃으며", text: "사장님이 창고에서 뛰쳐나올 정도요. 창피해서 오늘 얼굴 들기가…", mood: "smile" } },
        { t: "그 시간이 언제인지부터 확인한다.", aff: 0, react: { who: "hyejin", dir: "입술을 깨물며", text: "시각이요? 그때는 숫자밖에 안 보였는데.", mood: "shy" } }
      ]},
      { who: "hyejin", text: "아, 맞다. 녹음 앱을 켜 두고 있었어요. 화면 기록할 때 시각이 같이 남는 설정. 켠 줄도 몰랐는데, 제 비명이 들어 있을걸요." },
      { who: "hyejin", dir: "휴대폰을 내밀며", text: "들어 볼래요? 진짜 별거 없을 텐데. 증거라고 내미는 거 아니에요. 그냥… 들어 주면.", mood: "shy" },
      { who: "nar", text: "혜진이 내민 휴대폰. 녹음 파일 하나가 켜져 있다.", game: "spectrogram", gameLabel: "scream.wav를 연다" },
      { who: "hyejin", dir: "눈을 크게 뜨며", text: "2314가 제 비명 시각이라고요? 결제 알림도 그 앞에 있었는데. 9분에 38,000원.", mood: "shock" },
      { who: "thought", text: "결제는 술집 단말기다. 비명의 시각 표식은 같은 녹음 안에 있다. 다섯 분 뒤에도 그녀는 그 테이블에 있었다. 연구동까지는 걸어서 15분." },
      { who: "hyejin", dir: "휴대폰을 도로 끌어안으며", text: "그래서 저, 범인은 아닌 거죠. 코인 계좌도 같이 봐 주시면 안 돼요? 거긴 진짜 사건인데.", mood: "smile" },
      { who: "player", choices: [
        { t: "그건 내 일이 아니라고, 부드럽게 거절한다.", aff: 1, react: { who: "hyejin", dir: "풀이 죽다가 피식 웃으며", text: "알겠어요. 오르면 고기 살게요. 그때는 조사 이야기 금지.", mood: "warm" } },
        { t: "사건과 무관하다고 선을 긋는다.", aff: 0, react: { who: "hyejin", dir: "다시 화면으로 시선을 내리며", text: "네. 수사는 수사대로 하세요. 전 차트 볼래요.", mood: "down" } }
      ]},
      { who: "nar", text: "혜진은 다시 빨간 숫자 속으로 돌아간다. 술집 쪽 기록은, 수첩의 뒷면에 남긴다." }
    ]
  },

  hyejinR: {
    bg: "gate", place: "학교 앞", focus: "hyejin",
    lines: [
      { who: "hyejin", if: "aff:hyejin>=4", dir: "손을 흔들며", text: "또 왔어요? 오늘은 3퍼센트밖에 안 죽었어요. 기념일이네요.", mood: "smile" },
      { who: "hyejin", if: "not:affhigh", dir: "고개만 까닥이며", text: "더 물을 거 있어요? 전 여기 있었는걸요.", mood: "cold" },
      { who: "nar", text: "새로운 파일은 없다. 이미 들은 이야기는 수첩에 있다." }
    ]
  },

  hyeseon: {
    bg: "messy",
    place: "10월 31일 오전 11:10 · 정문 편의점 옆",
    focus: "hyeseon",
    lines: [
      { who: "nar", text: "정문 편의점에서 캔을 집어 든 혜선은, 비 대신 이 방으로 들어왔다. 헤드폰은 목에 걸려 있고, 책상은 그녀의 취향으로 가득하다." },
      { who: "hyeseon", dir: "한쪽 이어폰을 빼며", text: "네. 무슨 일이세요. 논문 그거, 이미 소문은 들었어요.", mood: "cold" },
      { who: "player", choices: [
        { t: "방 안의 취향을 먼저 알아봐 준다.", aff: 2, react: { who: "hyeseon", dir: "어깨의 힘이 조금 빠지며", text: "…눈은 있으시네. 다들 이상하다고만 하는데.", mood: "smile" } },
        { t: "연구실 사람들이 거리를 둔다는 말부터 꺼낸다.", aff: 0, react: { who: "hyeseon", dir: "피식 웃으며", text: "또 그 얘기구나. 일본어 좀 섞고 혼자 논다고, 사건까지 연결하는 거예요?", mood: "cold" } }
      ]},
      { who: "hyeseon", text: "교수님하고 싸운 적 없어요. 저는 제 할 일만 해요. 어젯밤에도 애니메이션 보고, 술 마시고, 그게 끝.", mood: "shy" },
      { who: "hyeseon", dir: "휴대폰을 기울여 보이며", text: "사진 한 장 있어요. venom.jpg. 제 취향이 좀 특이하긴 하죠. 수업 과제로 파일 꼬리에 메모 심는 연습도 해 둬서, 어제 영수증을 샘플로 넣었어요." },
      { who: "player", choices: [
        { t: "취향은 취향으로 두고, 사진을 받아 든다.", aff: 1, react: { who: "hyeseon", dir: "장난스럽게", text: "そうですね. 무서우면 축소해서 보세요.", mood: "smile" } },
        { t: "왜 영수증을 숨겼는지 먼저 묻는다.", aff: 0, react: { who: "hyeseon", dir: "눈썹을 올리며", text: "숨긴 게 아니라 연습이에요. 이미지 뷰어는 꼬리를 안 읽잖아요.", mood: "cold" } }
      ]},
      { who: "nar", text: "화면 속의 사진은 취향 그 자체다. 용량만 조금 무겁다.", game: "stego", gameLabel: "venom.jpg를 연다" },
      { who: "player", text: "집이라고 하셨죠. 메모는 23:12, 정문 편의점입니다. 영수증 번호 0832." },
      { who: "hyeseon", dir: "캔을 내려놓고, 한참 뒤에", text: "…정문 앞이 집 앞이긴 하거든. 걸어서 3분. 솔직히 귀찮아서 집이라고 했어요. 연구동까지는 20분이에요. 그 시간에 거기 있을 수가 없죠.", mood: "down" },
      { who: "thought", text: "말과 기록이 어긋난다. 그런데 어긋난 방향은 연구실이 아니다. 거짓 한 겹과, 현장에 없을 알리바이는 같이 적힌다." },
      { who: "hyeseon", dir: "헤드폰을 다시 쓰며", text: "이제 제 취향 말고 시간을 보시면 돼요. 수고하세요.", mood: "smile" },
      { who: "hyeseon", if: "aff:hyeseon>=4", dir: "이어폰을 내리기 직전에", text: "…다음에 그 애니메이션, 무섭지 않은 회차로 틀어 줄 수도 있어요.", mood: "shy" }
    ]
  },

  hyeseonR: {
    bg: "messy", place: "정문 편의점 옆", focus: "hyeseon",
    lines: [
      { who: "hyeseon", if: "aff:hyeseon>=4", text: "또 왔네요. 오늘은 영수증 없어요. 차만 있어요.", mood: "smile" },
      { who: "hyeseon", if: "not:affhigh", text: "집이라고 한 건 이미 말했어요. 더 캐면 진짜 집에 갈 거예요.", mood: "cold" },
      { who: "nar", text: "그녀는 다시 화면 속으로 돌아간다." }
    ]
  },

  solmi: {
    bg: "lab",
    place: "10월 31일 오후 12:30 · 정보보호 연구실",
    focus: "solmi",
    lines: [
      { who: "nar", cg: "working", hide: true, text: "연구실 구석, 모니터 앞에 한 사람이 앉아 있다. 다른 학생은 없다." },
      { who: "solmi", bg: "lab", dir: "화면을 잠그고 의자에 기대며", text: "…뭔데요. 논문 삭제, 저도 들었어요. 연구실이 뒤집어진 건 아침부터고요.", mood: "cold" },
      { who: "thought", text: "수첩의 앞면은 이미 그녀를 가리키고 있었다. NAS 관리자. 삭제할 수 있는 사람. 그건 아직 소문이다." },
      { who: "player", choices: [
        { t: "권한이 있으니 가장 유력하다고 말한다.", aff: 0, react: { who: "solmi", dir: "팔짱을 낀 채 웃으며", text: "그럴 줄 알았어요. 관리자니까요. 그게 뭐요.", mood: "cold" } },
        { t: "관리하면서 어떤 기록이 남는지 묻는다.", aff: 2, react: { who: "solmi", dir: "눈을 가늘게 뜨다가", text: "…질문치고는 멀쩡하네요. 권한만 보고 이름 부르는 사람하곤 달라서.", mood: "smile" } }
      ]},
      { who: "solmi", text: "어젯밤 11시에는 집이었어요. SSH는 10시 40분에 끊었고요. 의심할 거면 덤프를 보세요. 제가 범인이면 이런 걸 순순히 주겠어요?", mood: "cold" },
      { who: "solmi", dir: "USB를 책상 위에 내려놓으며", text: "자, 가져가세요. 괜히 사람 귀찮게 하지 말고.", mood: "down" },
      { who: "nar", text: "USB는 가볍고, 그 안의 덤프는 그렇지 않다.", game: "memory", gameLabel: "메모리 덤프를 연다" },
      { who: "solmi", dir: "피식 웃으며", text: "이제 좀 맞나요. 공유기에 붙어 있었다고 제가 소파에 붙어 있었다는 뜻은 아니에요. 그 정도는 직접 보신 것 같고.", mood: "smile" },
      { who: "solmi", text: "아, 하나. 지난주에 민영이가 자기 실험 데이터 폴더 권한을 올려 달라고 해서, 읽기에서 수정으로 바꿔 줬어요. 아직 안 내렸어요. 귀찮아서." },
      { who: "player", choices: [
        { t: "그 계정이 아직 살아 있다는 말을 더 듣는다.", aff: 1, flag: "perm", react: { who: "solmi", dir: "담담하게", text: "본인 계정이에요. 제 관리자 비번 준 거 아니에요. 조용히, 급하게 부탁하더라고요. 데이터 다시 정리해야 한다면서.", mood: "cold" } },
        { t: "고개만 끄덕이고 넘어간다.", aff: 0, react: { who: "solmi", text: "나중에 내리든 말든, 어제 그 시각에 제가 연구실에 있던 건 아니에요.", mood: "cold" } }
      ]},
      { who: "solmi", dir: "노트북을 다시 열며", text: "처음부터 기록부터 봤으면 좋았을 텐데요. 다음엔 치킨 먹을 때 좀 부르지… 아, 그건 취소.", mood: "smile" },
      { who: "thought", text: "선입견이 한 칸 걷힌다. 권한은 그대로다. 다만 23:14의 키보드는 연구실이 아니었다. 그리고 민영의 수정 권한은, 아직 살아 있다." }
    ]
  },

  solmiR: {
    bg: "lab", place: "정보보호 연구실", focus: "solmi",
    lines: [
      { who: "solmi", if: "aff:solmi>=4", text: "또요. 덤프는 한 장이면 충분해요. 커피는 사 오고.", mood: "smile" },
      { who: "solmi", if: "not:affhigh", text: "할 말 끝났으면 화면 잠글게요.", mood: "cold" },
      { who: "nar", text: "모니터 불빛만 다시 켜진다." }
    ]
  },

  jihee: {
    bg: "guitar",
    place: "10월 31일 오후 2:00 · 학생회관 연습실",
    focus: "jihee",
    lines: [
      { who: "nar", text: "연습실에서 기타 줄이 한 번 울리고 멈춘다. 지희는 악기를 내려놓기도 전에 손을 흔든다." },
      { who: "jihee", dir: "밝게", text: "안녕하세요! 혹시 아침에 연구실로 오셨다는 분이세요? 논문, 진짜 사라진 거예요?", mood: "smile" },
      { who: "player", choices: [
        { t: "기타 이야기부터 받아 준다.", aff: 2, react: { who: "jihee", dir: "신이 나서", text: "아, 그거요? 오늘 합주 잔여 연습이에요. 어제 좀 늦어서 더 남았거든요.", mood: "warm" } },
        { t: "어젯밤 행적부터 묻는다.", aff: 0, react: { who: "jihee", dir: "웃음을 조금 거두고", text: "아… 네. 취조는 아닌 거죠? 표정은 아닌데, 질문이 갑자기 그렇게 와서.", mood: "shy" } }
      ]},
      { who: "jihee", text: "어제는 합주하러 학생회관에 왔어요. 그 전에 기숙사에 들렀고요. 민영이한테 물어볼 게 있어서. 그런데 문을 안 열어 주더라고요.", mood: "down" },
      { who: "jihee", dir: "고개를 갸웃하며", text: "방 안에는 있는 것 같았어요. 드라마 소리가 났는데, 같은 대사가 계속 반복됐어요. 처음엔 민영이가 저를 놀리나 했어요. 거의 기계처럼." },
      { who: "jihee", dir: "휴대폰을 건네며", text: "카톡 봐도 돼요. 숨길 거 없잖아요. 학생회관 출입 카드도 남아 있을 거예요.", mood: "smile" },
      { who: "nar", text: "카톡과 출입 기록이 나란히 열려 있다. 같은 밤의 서로 다른 시계다.", game: "logs", gameLabel: "대화와 출입 기록을 연다" },
      { who: "jihee", text: "맞아요, 11시 16분에 들어갔어요. 좀 늦었거든요. 그리고 민영이 답장은 새벽에 왔어요. 미안, 소리 커서 못 들었어. 그 애답긴 한데…", mood: "shy" },
      { who: "thought", text: "22:58 방 앞. 23:16 학생회관. 그 사이인 23:14에 그녀는 연구동이 아니다. 남는 것은 반복된 대사, 그리고 자정이 넘은 답장이다." },
      { who: "jihee", dir: "미소가 걷히며", text: "그런데 민영이한테 무슨 일 있는 건 아니죠? 그 애, 그런 일 할 사람 아닌데.", mood: "down" },
      { who: "player", choices: [
        { t: "아직은 알 수 없다고 한다.", aff: 1, react: { who: "jihee", dir: "안도한 듯, 그러나 끝까지 웃지 못하고", text: "그래요. 그 애 방, 드라마 소리만 컸던 거예요. 제가 예민했던 걸 수도 있고.", mood: "shy" } },
        { t: "반복 재생이 수상하다고 말한다.", aff: -1, react: { who: "jihee", dir: "한 걸음 물러서며", text: "그런 말로 단정하지 마세요. 민영이는 그냥 무서워서 소리 틀어 놓고 자는 애예요.", mood: "angry" } }
      ]},
      { who: "thought", text: "느낌은 기록되지 않는다. 지희의 다정함도, 민영을 향하는 위화감도, 아직은 수첩의 앞면이다." }
    ]
  },

  jiheeR: {
    bg: "guitar", place: "학생회관 연습실", focus: "jihee",
    lines: [
      { who: "jihee", if: "aff:jihee>=4", text: "다시 들르셨어요? 합주 끝나면 음료라도 살게요. 민영이 이야기는… 아직 묻지 말아 주세요.", mood: "smile" },
      { who: "jihee", if: "not:affhigh", text: "기록은 다 드렸잖아요. 그 애 험담만 아니면, 더 도와드릴게요.", mood: "shy" },
      { who: "nar", text: "기타 줄이 다시 조용히 울린다." }
    ]
  },

  bridge: {
    bg: "hall",
    place: "10월 31일 오후 3:40 · 기숙사로 가는 복도",
    focus: null,
    lines: [
      { who: "nar", hide: true, text: "복도의 창으로 달이 일찍 떠 있다. 네 사람의 이야기가 발소리 사이에 섞인다." },
      { who: "thought", hide: true, text: "혜진은 시끄럽고, 혜선은 거리를 두고, 솔미는 권한을 가졌고, 지희는 모두에게 다정했다. 수첩의 앞면이 말한 그대로다." },
      { who: "thought", hide: true, text: "뒷면은 달랐다. 그리고 한 가지가 남는다. 민영의 방에서 같은 대사가 반복됐다. 사과는 자정이 넘어서 도착했다." },
      { who: "nar", hide: true, text: "기숙사로 갈 이유가 생겼다. 아직 단정은 없다. 먼저 그녀의 이야기를 듣는다." }
    ]
  },

  minyoung: {
    bg: "dorm",
    place: "10월 31일 오후 4:30 · 기숙사",
    focus: "minyoung",
    lines: [
      { who: "nar", text: "복도는 조용하다. 민영의 문 앞에는 작은 택배 상자가 놓여 있다. 노크 끝에, 문이 좁게 열린다." },
      { who: "minyoung", dir: "눈을 비비며, 담요를 어깨에 두른 채", text: "…누구세요.", mood: "shy" },
      { who: "player", text: "안녕하세요. 연구실 일로 사람들을 만나고 있습니다. 잠깐 이야기해도 될까요." },
      { who: "minyoung", dir: "옆으로 비켜 서며", text: "아… 네. 들어오세요. 밖은 별로 안 좋아해서, 방이 좀 좁아요.", mood: "shy" },
      { who: "player", choices: [
        { t: "어떤 드라마를 좋아하는지 묻는다.", aff: 2, react: { who: "minyoung", dir: "머쓱하게 웃으며", text: "공포랑 스릴러요. 사람보다 대사가 편해서. 같은 회차를 몇 번이나 봐요.", mood: "smile" } },
        { t: "어젯밤 어디에 있었는지 바로 묻는다.", aff: 0, react: { who: "minyoung", dir: "손가락을 만지작거리며", text: "드라마요. 저녁부터… 자정 전까지는 봤을 거예요. 혼자였고요.", mood: "down" } }
      ]},
      { who: "minyoung", text: "잠이 잘 안 와서, 같은 장면을 반복해서 틀어 둬요. 소리가 있어야 잠이 오거든요. 바보 같죠.", mood: "shy" },
      { who: "thought", text: "반복. 지희가 들은 말도 그거였다. 아직 이것만으로 무엇을 말할 수는 없다." },
      { who: "minyoung", dir: "잠시 멈칫하며", text: "지희 언니가 왔었어요. 노크 소리… 드라마가 커서 못 들었어요. 나중에 미안하다고 카톡 보냈고요.", mood: "down" },
      { who: "player", text: "그 답장, 00:41에 도착한 메시지 말인가요." },
      { who: "minyoung", dir: "시선을 피하며", text: "…네. 드라마 끝나고 보낸 거예요. 바로 보냈다고 하기엔, 좀 늦었죠.", mood: "shy" },
      { who: "player", choices: [
        { t: "그 이야기는 여기까지만 하고, 영상을 부탁한다.", aff: 1, react: { who: "minyoung", dir: "노트북을 가리키며", text: "이거요. 제가 보던 거예요. 별거 없을 텐데…", mood: "shy" } },
        { t: "늦은 답장이 마음에 걸린다고 말한다.", aff: 0, react: { who: "minyoung", dir: "담요를 끌어당기며", text: "이상하게 들리겠죠. 그래도 영상은 드릴게요. 확인하시면… 되잖아요.", mood: "down" } }
      ]},
      { who: "nar", text: "그녀가 보던 영상이라는 파일. 길이는 숨 한 번보다 짧다.", game: "meta", gameLabel: "alibi.mp4를 연다" },
      { who: "player", text: "이 파일은 어젯밤 22:47에 만들어졌습니다. 만든 프로그램 이름은 loop_maker. 주석에는 loop_config.dat가 있습니다." },
      { who: "minyoung", dir: "한참 침묵하다가", text: "…그날 저장했을 수도 있죠. 기존에 보던 걸, 잘리는 부분만.", mood: "down" },
      { who: "player", text: "그 파일, 이 컴퓨터에 있습니까." },
      { who: "minyoung", dir: "목소리가 작아져", text: "있어요. 꼭… 그래야 하나요.", mood: "shy" },
      { who: "player", text: "네. 말과 파일을 같이 봐야 하니까요." },
      { who: "minyoung", dir: "고개를 숙이며", text: "…알겠어요.", mood: "down" },
      { who: "thought", text: "열 초짜리 반복은, 방에 사람이 있는 것처럼 들리게 할 수 있다. 그러나 삭제가 실행됐다는 기록은 아직 없다." }
    ]
  },

  minyoung2: {
    bg: "dorm",
    place: "10월 31일 오후 6:00 · 기숙사",
    focus: "minyoung",
    lines: [
      { who: "nar", text: "같은 방. 창밖만 더 어두워져 있다. 파일 목록은 대부분 평범한 영상과 문서다. 그중 하나가 열리지 않는다." },
      { who: "nar", text: "loop_config.dat\n알 수 없는 형식 · 1KB\n파일을 열 수 없습니다." },
      { who: "player", text: "민영 씨. 이 파일이 뭔지 알고 있습니까." },
      { who: "minyoung", dir: "모니터를 바라보며", text: "예전에 테스트하던 거예요. 영상 재생 관련… 오래된 파일이라 안 열리는 것 같아요.", mood: "shy" },
      { who: "player", text: "영상의 주석이 이 이름을 가리키고 있습니다. 확장자는 형식 그 자체가 아닙니다." },
      { who: "minyoung", dir: "표정이 굳어", text: "…", mood: "down" },
      { who: "nar", text: "이름은 설정 파일인데, 도구는 형식을 모른다.", game: "hex", gameLabel: "loop_config.dat를 연다" },
      { who: "nar", text: "방 안이 조용해진다. 민영은 화면을 보다가, 천천히 고개를 숙인다." },
      { who: "player", text: "22:50에 영상을 반복 재생하도록 예약했습니다. 22:52에 방을 나설 계획이 적혀 있습니다." },
      { who: "minyoung", dir: "손을 꽉 쥐며", text: "…그만 읽으시면 안 돼요?", mood: "down" },
      { who: "player", text: "스크립트만으로는 실행이라고 말할 수 없습니다. 그래서 같이 들어 있던 감사 로그를 봤습니다." },
      { who: "player", text: "23:10, 연구동 무선 AP. 계정은 minyoung. 23:14:02, paper_final_v7.docx 삭제. 이어서 휴지통을 비웠습니다." },
      { who: "minyoung", dir: "고개를 숙인 채", text: "…네.", mood: "down" },
      { who: "player", text: "지희 씨가 들은 반복 대사는, 빈 방에서 돌고 있던 그 영상이었습니다." },
      { who: "minyoung", dir: "떨리는 목소리로", text: "교수님께서 제 이름을 빼겠다고 하셨어요. 실험 데이터가 재현되지 않는다고. 처음부터 다시 검증하겠다고.", mood: "shock" },
      { who: "minyoung", dir: "눈물을 참으며", text: "그 논문이 제 졸업 요건이었어요. 없으면 졸업을 못 할 수도 있었어요. 다른 사람들도 처음부터 다시 할 줄 알았어요.", mood: "down" },
      { who: "player", text: "그건 혼자 결정할 일이 아니었습니다." },
      { who: "minyoung", dir: "고개를 숙인 채", text: "알아요. 그런데 그때는 너무 무서웠어요. 죄송해요. 정말 죄송해요.", mood: "down" },
      { who: "thought", text: "의도는 주석에 있었고, 실행은 로그에 있었다. 다정하게 들은 이야기와, 계정 이름은 같은 사람을 가리킨다." }
    ]
  },

  minyoungR: {
    bg: "dorm",
    place: "기숙사",
    focus: "minyoung",
    lines: [
      { who: "minyoung", if: "aff:minyoung>=3", dir: "고개를 든 채", text: "…아직 여기 있어요. 아까는 이야기를 들어 줘서, 조금은 덜 무서웠어요. 그래도 제가 한 일은 그대로예요.", mood: "down" },
      { who: "minyoung", if: "aff:minyoung<3", dir: "손을 모으며", text: "죄송해요. 더 변명 같은 건 하지 않을게요.", mood: "down" },
      { who: "nar", text: "노트북은 덮여 있다. 반복되던 대사는 더 이상 들리지 않는다." }
    ]
  },

  ending: {
    bg: "lab",
    place: "10월 31일 오후 7:00 · 정보보호 연구실",
    focus: null,
    lines: [
      { who: "player", hide: true, text: "범인은 민영 씨입니다." },
      { who: "nar", hide: true, text: "잠시, 연구실의 의자 몇 개가 동시에 소리를 낸다." },
      { who: "player", hide: true, text: "22:47에 알리바이용 영상을 만들었고, 22:50에 반복 재생을 예약했습니다. 지희 씨가 들은 대사는 빈 방의 소리였습니다." },
      { who: "player", hide: true, text: "그리고 23:14. 연구동에서 본인 계정으로 최종본을 지우고, 휴지통까지 비웠습니다. 계획의 시각과 감사 로그가 같습니다." },
      { who: "prof", hide: true, dir: "안경을 벗으며", text: "…그랬군." },
      { who: "minyoung", dir: "눈물을 흘리며", text: "죄송합니다. 정말 죄송합니다.", mood: "down" },
      { who: "hyejin", sprite: "hyejin", dir: "입을 벌린 채", text: "뭐? 민영이가?", mood: "shock" },
      { who: "hyeseon", sprite: "hyeseon", dir: "믿기지 않는다는 표정으로", text: "와. 전혀 몰랐네.", mood: "shock" },
      { who: "solmi", sprite: "solmi", dir: "팔짱을 풀며", text: "결국 권한의 이름이 아니라, 그 시각에 로그인된 계정이었군요.", mood: "cold" },
      { who: "jihee", sprite: "jihee", dir: "민영을 바라보며", text: "민영아… 왜 혼자 그렇게까지 했어.", mood: "down" },
      { who: "minyoung", dir: "고개를 숙이며", text: "미안해. 정말 미안해.", mood: "down" },
      { who: "prof", hide: true, dir: "깊게 한숨을 쉬며", text: "논문이 돌아올지는 모르겠다. 사실관계부터 확인하고, 연구실이 대응하겠다." },
      { who: "player", hide: true, if: "aff:minyoung>=3", text: "오후에 나눈 이야기는 거짓이 아닌 부분도 있었다. 그래도 계정과 시각은 그 이야기를 넘어간다." },
      { who: "player", hide: true, text: "디지털 흔적은 삭제 뒤에도 남습니다. 지웠다고 해서 모든 것이 사라지는 것은 아니니까요." },
      { who: "nar", hide: true, group: true, text: "사람들은 흔적을 지울 수 있다고 생각한다. 파일을 지우고, 기록을 비우고, 새로운 이야기를 만든다." },
      { who: "nar", hide: true, group: true, text: "그러나 아주 작은 기록이 하나, 모든 말을 다시 늘어놓게 한다." },
      { who: "nar", hide: true, group: true, text: "LAST TRACE\nCASE CLOSED" }
    ]
  }
};
