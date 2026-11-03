/* =====================================================================
   PROGRAM — burası antrenman programının tamamıdır.
   Uygulamanın içinden de (Program sekmesi) değiştirebilirsiniz; orada
   yaptığınız değişiklikler telefonunuzda saklanır ve bu dosyanın yerine geçer.

   Hareket alanları:
     id     : hareketin kısa kimliği (geçmiş kayıtlar buna bağlanır; değiştirmeyin)
     ad     : ekranda görünen ad
     grup   : süperset harfi, örn. "A1" ve "A2" aynı grup (A) demektir
     tip    : "tekrar"  → 3×10        | "taraf" → 4×5/taraf
              "max"     → 3×max       | "sureli" → 2×20 sn (taraf:true ise taraf başına)
              "set"     → sadece set sayısı (2 set)
     set    : set sayısı     tekrar : hedef tekrar     sn : süre (saniye)
     kg     : başlangıç ağırlığı. Boş bırakılırsa ağırlık kutusu yoktur,
              null ise ağırlık kutusu vardır ama boştur (ilk seansta siz girersiniz)
     not    : küçük açıklama
     alt    : değiştirilebilir alternatif hareket (örn. pull-up yerine band lat pulldown)
   ===================================================================== */
window.VARSAYILAN_PROGRAM = {
  surum: 1,
  baslangic: '2026-11-03',
  dinlenmeSn: 75,
  genelNot: 'Patlayıcı hareketlerde hız düşerse seti bitir.',

  /* ---- Kontrol listeleri ---- */
  listeler: {
    isinma: { baslik: 'Isınma (5–7 dk)', maddeler: [
      { id: 'jump_rope', ad: 'Jump rope 2×40 sn' },
      { id: 'leg_swings', ad: 'Leg swings' },
      { id: 'hip_circles', ad: 'Hip circles' },
      { id: 'wgs', ad: "World's greatest stretch" },
      { id: 'ankle_circles', ad: 'Ankle circles' },
      { id: 'thoracic_rot', ad: 'Thoracic rotation' } ] },
    omuz: { baslik: 'Omuz prehab', maddeler: [
      { id: 'band_er', ad: 'Band external rotation 2×15' },
      { id: 'band_pull_apart', ad: 'Band pull-apart 2×12' },
      { id: 'wall_slides', ad: 'Scapular wall slides 2×10' },
      { id: 'arm_circles', ad: 'Arm circles' } ] },
    esneme: { baslik: 'Esneme (30 sn/taraf)', maddeler: [
      { id: 's_quad', ad: 'Quad' }, { id: 's_hamstring', ad: 'Hamstring' },
      { id: 's_hipflexor', ad: 'Hip flexor' }, { id: 's_calf', ad: 'Calf' },
      { id: 's_crossbody', ad: 'Cross-body shoulder' }, { id: 's_tricep', ad: 'Triceps overhead' },
      { id: 's_chest', ad: 'Doorway chest' }, { id: 's_child', ad: "Child's pose" },
      { id: 's_sleeper', ad: 'Sleeper stretch' }, { id: 's_9090', ad: '90/90 hip' },
      { id: 's_fig4', ad: 'Figure-4' }, { id: 's_openbook', ad: 'Open-book' },
      { id: 's_thread', ad: 'Thread-the-needle' }, { id: 's_wrist_flex', ad: 'Wrist flexor' },
      { id: 's_wrist_ext', ad: 'Wrist extensor' }, { id: 's_ankle_df', ad: 'Ankle dorsiflexion' } ] },
    mac: { baslik: 'Maç ısınması', maddeler: [
      { id: 'jump_rope', ad: 'Jump rope' },
      { id: 'band_er', ad: 'Band external rotation' },
      { id: 'split_step', ad: 'Split-step ritmi' } ] }
  },

  /* ---- Bilek prehab (Salı, Perşembe, Cuma'da aynı) ---- */
  bilek: [
    { id: 'wrist_curl', ad: 'Wrist curl', tip: 'tekrar', set: 2, tekrar: 15, kg: null },
    { id: 'rev_wrist_curl', ad: 'Reverse wrist curl', tip: 'tekrar', set: 2, tekrar: 15, kg: null },
    { id: 'pron_sup', ad: 'Pronation / supination', tip: 'tekrar', set: 2, tekrar: 12, kg: null }
  ],

  /* ---- Günler: 0 = Pazar, 1 = Pazartesi ... 6 = Cumartesi ---- */
  gunler: {
    1: { ad: 'Pazartesi', baslik: 'Akşam tenis', tur: 'istege_bagli', sure: 'Sabah isteğe bağlı core (~10 dk)',
      not: 'Akşam tenis var. Sabah core yapmak isteğe bağlı.',
      once: [], bilek: false, sonra: ['esneme'],
      hareketler: [
        { id: 'pallof', ad: 'Pallof press', tip: 'tekrar', set: 2, tekrar: 12 },
        { id: 'dead_bug', ad: 'Dead bug', tip: 'tekrar', set: 2, tekrar: 10 },
        { id: 'side_plank', ad: 'Side plank', tip: 'set', set: 2 } ] },

    2: { ad: 'Salı', baslik: 'Üst A', tur: 'antrenman', sure: '~55 dk', yorgunSor: true,
      once: ['isinma', 'omuz'], bilek: true, sonra: ['esneme'],
      hareketler: [
        { id: 'floor_press', ad: 'Floor press', grup: 'A1', tip: 'tekrar', set: 4, tekrar: 10, kg: null },
        { id: 'pullup', ad: 'Pull-up', grup: 'A2', tip: 'max', set: 3, not: '5 tekrardan azsa ya da omuz yorgunsa band lat pulldown',
          alt: { id: 'band_lat_pd', ad: 'Band lat pulldown', tip: 'tekrar', set: 3, tekrar: 12 } },
        { id: 'pushup', ad: 'Push-up', grup: 'B1', tip: 'tekrar', set: 3, tekrar: 15 },
        { id: 'one_arm_row', ad: 'One-arm row', grup: 'B2', tip: 'tekrar', set: 3, tekrar: 10, kg: null },
        { id: 'tri_ext', ad: 'Triceps extension', grup: 'C1', tip: 'tekrar', set: 4, tekrar: 12, kg: 5 },
        { id: 'biceps_curl', ad: 'Biceps curl', grup: 'C2', tip: 'tekrar', set: 4, tekrar: 12, kg: 5 },
        { id: 'hammer_curl', ad: 'Hammer curl', grup: 'D1', tip: 'tekrar', set: 2, tekrar: 12, kg: 5 },
        { id: 'rev_curl', ad: 'Reverse curl', grup: 'D2', tip: 'tekrar', set: 2, tekrar: 12, kg: 5 },
        { id: 'band_row', ad: 'Band seated row', grup: 'E1', tip: 'tekrar', set: 3, tekrar: 12 },
        { id: 'hollow', ad: 'Hollow hold', grup: 'E2', tip: 'set', set: 2 } ] },

    3: { ad: 'Çarşamba', baslik: 'Dinlenme', tur: 'dinlenme', sure: '',
      not: 'Dinlenme günü. Yürüyüş ve hafif esneme yeterli.',
      once: [], bilek: false, sonra: ['esneme'], hareketler: [] },

    4: { ad: 'Perşembe', baslik: 'Güç, çeviklik ve alt vücut', tur: 'antrenman', sure: '~60 dk',
      once: ['isinma', 'omuz'], bilek: true, sonra: ['esneme'],
      hareketler: [
        { id: 'skip_rope', ad: 'Skip jump rope', tip: 'set', set: 3, bolum: 'Önce patlayıcı — tam hızda' },
        { id: 'lat_hops', ad: 'Lateral hops', tip: 'set', set: 3, bolum: 'Önce patlayıcı — tam hızda' },
        { id: 'split_jump', ad: 'Split jump', tip: 'tekrar', set: 3, tekrar: 8, bolum: 'Önce patlayıcı — tam hızda' },
        { id: 'lat_shuffle', ad: 'Lateral shuffle + dur', tip: 'tekrar', set: 3, tekrar: 4, not: 'Her yöne 3 m', bolum: 'Önce patlayıcı — tam hızda' },
        { id: 'decel_drop', ad: 'Deceleration drop', tip: 'tekrar', set: 3, tekrar: 5, bolum: 'Önce patlayıcı — tam hızda' },
        { id: 'sumo_squat', ad: 'Goblet sumo squat', tip: 'tekrar', set: 3, tekrar: 10, kg: 10, not: '2×10 kg', bolum: 'Sonra' },
        { id: 'rdl', ad: 'Romanian deadlift', tip: 'tekrar', set: 3, tekrar: 10, kg: 10, not: '2×10 kg', bolum: 'Sonra' },
        { id: 'def_rev_lunge', ad: 'Deficit reverse lunge', tip: 'tekrar', set: 3, tekrar: 8, kg: 10, not: '2×10 kg', bolum: 'Sonra' },
        { id: 'lat_lunge', ad: 'Lateral lunge', grup: 'A1', tip: 'taraf', set: 3, tekrar: 8, bolum: 'Sonra' },
        { id: 'copenhagen', ad: 'Copenhagen plank', grup: 'A2', tip: 'sureli', set: 2, sn: 20, taraf: true, bolum: 'Sonra' },
        { id: 'calf_raise', ad: 'Dumbbell calf raise', grup: 'B1', tip: 'tekrar', set: 3, tekrar: 12, kg: 10, bolum: 'Sonra' },
        { id: 'woodchop', ad: 'Band woodchop', grup: 'B2', tip: 'tekrar', set: 3, tekrar: 10, bolum: 'Sonra' },
        { id: 'pallof', ad: 'Pallof press', tip: 'tekrar', set: 3, tekrar: 10, bolum: 'Sonra' },
        { id: 'leg_raise', ad: 'Lying leg raise', tip: 'tekrar', set: 2, tekrar: 12, not: 'Süre sıkışırsa ilk bu çıkar', bolum: 'Sonra' } ] },

    5: { ad: 'Cuma', baslik: 'Üst B — omuz, çekiş, rotasyon', tur: 'antrenman', sure: '~55 dk',
      once: ['isinma', 'omuz'], bilek: true, sonra: ['esneme'],
      hareketler: [
        { id: 'band_rot', ad: 'Band explosive rotation', tip: 'taraf', set: 4, tekrar: 5, bolum: 'Önce patlayıcı' },
        { id: 'overhead_slam', ad: 'Band overhead slam', tip: 'tekrar', set: 3, tekrar: 6, bolum: 'Önce patlayıcı' },
        { id: 'incline_press', ad: 'Incline press', grup: 'A1', tip: 'tekrar', set: 4, tekrar: 10, kg: null, bolum: 'Sonra' },
        { id: 'pullup', ad: 'Pull-up', grup: 'A2', tip: 'max', set: 3, not: '5 tekrardan azsa band lat pulldown', bolum: 'Sonra',
          alt: { id: 'band_lat_pd', ad: 'Band lat pulldown', tip: 'tekrar', set: 3, tekrar: 12 } },
        { id: 'incline_fly', ad: 'Incline fly', grup: 'B1', tip: 'tekrar', set: 3, tekrar: 10, kg: null, bolum: 'Sonra' },
        { id: 'pullover', ad: 'Straight-arm pullover', grup: 'B2', tip: 'set', set: 3, bolum: 'Sonra' },
        { id: 'lat_raise', ad: 'Lateral raise', grup: 'C1', tip: 'tekrar', set: 4, tekrar: 12, kg: 5, bolum: 'Sonra' },
        { id: 'rear_fly', ad: 'Rear delt fly', grup: 'C2', tip: 'set', set: 4, kg: 5, bolum: 'Sonra' },
        { id: 'sl_er', ad: 'Side-lying external rotation', grup: 'D1', tip: 'tekrar', set: 3, tekrar: 12, kg: 2, not: '2–3 kg, yavaş iniş', bolum: 'Sonra' },
        { id: 'side_plank', ad: 'Side plank', grup: 'D2', tip: 'set', set: 2, bolum: 'Sonra' } ] },

    6: { ad: 'Cumartesi', baslik: 'Tam dinlenme', tur: 'dinlenme', sure: '',
      not: 'Tam dinlenme. Tenis esnemelerini 45–60 sn tutarak yap.',
      once: [], bilek: false, sonra: ['esneme'], esnemeBaslik: 'Esneme (45–60 sn tutarak)', hareketler: [] },

    0: { ad: 'Pazar', baslik: 'Maç günü', tur: 'mac', sure: '90 dk maç',
      not: 'Maç günü. Ağır antrenman yok.',
      once: ['mac'], bilek: false, sonra: [], hareketler: [] }
  }
};
