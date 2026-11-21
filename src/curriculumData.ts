export interface QuizQuestion {
  stimulus?: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
  difficulty?: 'mudah' | 'sedang' | 'sulit';
}

export interface ForestGateDetailCard {
  badge: string;
  title: string;
  arabic?: string;
  transliteration?: string;
  meaning?: string;
  letters?: string[];
  note?: string;
}

export interface ForestGateMaterial {
  id: string;
  gateLabel: string;
  title: string;
  bannerDesc: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  description: string;
  points: string[];
  detailHeading?: string;
  detailCards?: ForestGateDetailCard[];
  ttsText: string;
}

export interface StageCurriculum {
  title: string;
  element: string;
  fase: string;
  arabic: string;
  translation: string;
  description: string;
  points: string[];
  ttsText: string;
  bossName: string;
  bossDesc: string;
  quiz: QuizQuestion[];
  forestGates?: Record<string, ForestGateMaterial>;
}

const GRADE6_STAGE1_FOREST_GATES: Record<string, ForestGateMaterial> = {
  's1-tajwid': {
    id: 's1-tajwid',
    gateLabel: 'Hutan Tajwid',
    title: 'Hukum Bacaan Gunnah pada Q.S. al-Insyirah',
    bannerDesc: 'Fase C Kelas 6 • Mengenal dan mempraktikkan bacaan dengung Gunnah Musyaddadah (نّ dan مّ) pada Q.S. al-Insyirah.',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: "Fa-inna ma'al-'usri yusrā • Inna ma'al-'usri yusrā (Q.S. al-Insyirah: 5–6)",
    translation: 'Maka sesungguhnya beserta kesulitan ada kemudahan. Sesungguhnya beserta kesulitan itu ada kemudahan.',
    description: 'Di Hutan Tajwid Fase C Kelas 6, kita mempelajari hukum bacaan Gunnah (Gunnah Musyaddadah) yang terdapat dalam Q.S. al-Insyirah. Gunnah artinya suara dengung yang keluar dari pangkal hidung (al-khaisyum) ketika membaca huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ) dengan panjang tahanan 2 harakat (1 alif).',
    points: [
      'Pengertian Gunnah Musyaddadah: Setiap huruf Nun bertasydid (نّ) dan Mim bertasydid (مّ) wajib dibaca berdengung jelas (wajibul gunnah) melalui pangkal hidung (al-khaisyum).',
      'Panjang bacaan Gunnah: Ditahan selama 2 harakat (kira-kira dua ketukan lembut) sebelum melafalkan harakat huruf tersebut.',
      'Penerapan pada Q.S. al-Insyirah Ayat 5: Pada lafal فَإِنَّ (fa-inna) terdapat huruf Nun bertasydid (نّ), sehingga wajib dibaca dengung 2 harakat.',
      'Penerapan pada Q.S. al-Insyirah Ayat 6: Pada lafal إِنَّ (inna) terdapat huruf Nun bertasydid (نّ), sehingga kembali dibaca dengung 2 harakat dengan tartil.',
      'Cara membedakan: Ayat 1–4 dan 7–8 Q.S. al-Insyirah tidak memiliki نّ atau مّ (Gunnah Musyaddadah); fokus bacaan Gunnah Musyaddadah pada surah ini berada di ayat 5 dan ayat 6.'
    ],
    detailHeading: 'Analisis Contoh Hukum Bacaan Gunnah pada Q.S. al-Insyirah',
    detailCards: [
      {
        badge: 'Q.S. al-Insyirah Ayat 5',
        title: 'Lafal Gunnah: فَإِنَّ (Nun Bertasydid نّ)',
        arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliteration: "Fa-inna ma'al-'usri yusrā",
        meaning: 'Maka sesungguhnya beserta kesulitan ada kemudahan.',
        note: 'Sebab Gunnah: Huruf Nun bertasydid (نّ) pada kata فَإِنَّ. Cara baca: tahan dengung halus dari pangkal hidung selama 2 harakat.'
      },
      {
        badge: 'Q.S. al-Insyirah Ayat 6',
        title: 'Lafal Gunnah: إِنَّ (Nun Bertasydid نّ)',
        arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliteration: "Inna ma'al-'usri yusrā",
        meaning: 'Sesungguhnya beserta kesulitan itu ada kemudahan.',
        note: 'Sebab Gunnah: Huruf Nun bertasydid (نّ) pada kata إِنَّ. Cara baca: tahan dengung di pangkal hidung 2 harakat agar bacaan tartil dan fasih.'
      },
      {
        badge: 'Tips Praktik Tartil',
        title: 'Kunci Makhraj al-Khaisyum (Pangkal Hidung)',
        note: 'Saat mengucapkan "fa-in-na" dan "in-na", tempelkan ujung lidah pada gusi gigi seri atas lalu alirkan suara dengung melalui hidung selama 2 ketukan sebelum melepas bunyi "na".'
      }
    ],
    ttsText: 'Selamat datang di Hutan Tajwid Fase C Kelas 6! Materi kita adalah Hukum Bacaan Gunnah pada Surah al-Insyirah. Gunnah Musyaddadah terjadi apabila ada huruf nun bertasydid atau mim bertasydid, yang wajib dibaca berdengung jelas dari pangkal hidung selama dua harakat. Di dalam Surah al-Insyirah, hukum bacaan Gunnah terdapat pada ayat kelima yaitu lafal fa-inna ma al usri yusra, dan ayat keenam yaitu lafal inna ma al usri yusra, keduanya karena terdapat huruf nun bertasydid.'
  },
  's1-alquran': {
    id: 's1-alquran',
    gateLabel: "Hutan Al-Qur'an",
    title: 'Lafal, Arti, dan Pesan Pokok Q.S. ad-Duha & Q.S. al-Insyirah',
    bannerDesc: 'Fase C Kelas 6 • Membaca, mengartikan, dan mengamalkan pesan pokok Q.S. ad-Duha (11 ayat) dan Q.S. al-Insyirah (8 ayat).',
    arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: "Mā wadda'aka rabbuka wa mā qalā (ad-Duha: 3) • Fa-inna ma'al-'usri yusrā (al-Insyirah: 5)",
    translation: 'Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak (pula) membencimu • Maka sesungguhnya beserta kesulitan ada kemudahan.',
    description: 'Di Hutan Al-Qur\'an Fase C Kelas 6, kita mendalami lafal, arti, dan pesan pokok dua surah Makkiyah yang saling berkaitan erat: Q.S. ad-Duha (surah ke-93, 11 ayat) dan Q.S. al-Insyirah (surah ke-94, 8 ayat). Keduanya diturunkan untuk menenangkan hati Nabi Muhammad saw. serta menanamkan sikap optimis, peduli sosial, disiplin, dan syukur nikmat.',
    points: [
      'Q.S. ad-Duha (11 Ayat, Makkiyah): "Ad-Duha" berarti waktu matahari sepenggalahan naik (pagi). Allah menegaskan bahwa Dia tidak pernah meninggalkan dan tidak membenci hamba-Nya, serta akhirat lebih baik daripada dunia.',
      'Pesan Pokok Q.S. ad-Duha (Ayat 9–11): Larangan berlaku sewenang-wenang/menghardik anak yatim (فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ), larangan membentak orang yang meminta-minta (وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ), dan perintah menyebut/mensyukuri nikmat Allah (وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ).',
      'Q.S. al-Insyirah (8 Ayat, Makkiyah): "Al-Insyirah" berarti melapangkan dada. Allah melapangkan hati Nabi Muhammad saw., meringankan beban dakwah, dan meninggikan sebutan (nama) beliau.',
      'Pesan Pokok Q.S. al-Insyirah (Ayat 5–8): Meyakini setiap kesulitan selalu disertai kemudahan (optimis dan pantang menyerah), disiplin segera beramal lagi setelah menyelesaikan satu tugas (فَإِذَا فَرَغْتَ فَانصَبْ), dan hanya kepada Allah tempat berharap serta bertawakal (وَإِلَىٰ رَبِّكَ فَارْغَبْ).'
    ],
    detailHeading: 'Ringkasan Lafal, Arti & Pesan Pokok Kedua Surah',
    detailCards: [
      {
        badge: 'Q.S. ad-Duha • 11 Ayat • Makkiyah',
        title: 'Lafal Inti & Arti Q.S. ad-Duha (Ayat 9–11)',
        arabic: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ ۝ وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ ۝ وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ',
        transliteration: "Fa-ammal-yatīma falā taqhar • Wa ammas-sā'ila falā tanhar • Wa ammā bini'mati rabbika faḥaddiṡ",
        meaning: 'Maka terhadap anak yatim janganlah engkau berlaku sewenang-wenang. Dan terhadap orang yang meminta-minta janganlah engkau menghardiknya. Dan terhadap nikmat Tuhanmu, hendaklah engkau nyatakan (dengan bersyukur).',
        note: 'Pesan Pokok: Yakin akan kasih sayang Allah Swt., menyayangi anak yatim, santun kepada peminta-minta, serta bersyukur atas segala nikmat.'
      },
      {
        badge: 'Q.S. al-Insyirah • 8 Ayat • Makkiyah',
        title: 'Lafal Inti & Arti Q.S. al-Insyirah (Ayat 1, 5–8)',
        arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ ... فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَبْ',
        transliteration: "Alam nasyraḥ laka ṣadrak • Fa-inna ma'al-'usri yusrā • Inna ma'al-'usri yusrā • Fa-iżā faragta fanṣab • Wa ilā rabbika fargab",
        meaning: 'Bukankah Kami telah melapangkan dadamu? ... Maka sesungguhnya beserta kesulitan ada kemudahan, sesungguhnya beserta kesulitan itu ada kemudahan. Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain), dan hanya kepada Tuhanmulah engkau berharap.',
        note: 'Pesan Pokok: Berlapang dada menghadapi ujian, optimis karena kemudahan menyertai kesulitan, produktif memanfaatkan waktu, dan bertawakal hanya kepada Allah Swt.'
      }
    ],
    ttsText: 'Selamat datang di Hutan Al-Qur\'an Fase C Kelas 6! Materi kita adalah lafal, arti, dan pesan pokok Surah ad-Duha dan Surah al-Insyirah. Surah ad-Duha terdiri dari sebelas ayat yang mengajarkan bahwa Allah tidak pernah meninggalkan hamba-Nya, melarang kita menyakiti anak yatim dan peminta-minta, serta memerintahkan kita bersyukur atas nikmat Allah. Sedangkan Surah al-Insyirah terdiri dari delapan ayat yang mengajarkan kelapangan hati, keyakinan bahwa bersama kesulitan selalu ada kemudahan, sikap disiplin berkarya, dan tawakal hanya kepada Allah Subhanahu wa Ta\'ala.'
  },
  's1-hadis': {
    id: 's1-hadis',
    gateLabel: 'Hutan Hadis',
    title: 'Hadis tentang Keutamaan Menyayangi & Menyantuni Anak Yatim',
    bannerDesc: 'Fase C Kelas 6 • Memahami dan mengamalkan hadis sahih Rasulullah saw. tentang kedudukan mulia orang yang menyayangi anak yatim.',
    arabic: 'أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا، وَأَشَارَ بِالسَّبَّابَةِ وَالْوُسْطَى وَفَرَّجَ بَيْنَهُمَا شَيْئًا',
    transliteration: "Anā wa kāfilul-yatīmi fil-jannati hākażā, wa asyāra bis-sabbābati wal-wusṭā wa farraja bainahumā syai'ā.",
    translation: '"Aku dan orang yang menanggung (memelihara) anak yatim di surga kelak seperti ini." Beliau mengisyaratkan dengan jari telunjuk dan jari tengah serta merenggangkan sedikit di antara keduanya. (H.R. al-Bukhari dari Sahl bin Sa\'ad r.a.)',
    description: 'Di Hutan Hadis Fase C Kelas 6, kita memetik teladan agung dari hadis sahih riwayat Imam al-Bukhari tentang keutamaan menyantuni, melindungi, dan menyayangi anak yatim. Hadis ini menguatkan perintah Allah Swt. dalam Q.S. ad-Duha ayat 9 agar kita memuliakan anak yatim dengan penuh kasih sayang.',
    points: [
      'Pengertian Anak Yatim: Anak yang belum balig yang ditinggal wafat oleh ayahnya, sehingga membutuhkan perhatian, kasih sayang, dan dukungan dari lingkungan sekitar.',
      'Kedudukan Mulia di Surga: Rasulullah saw. menjanjikan bahwa orang yang mengasuh, menanggung, dan menyayangi anak yatim akan berada sangat dekat bersama beliau di surga—bagaikan dekatnya jari telunjuk dan jari tengah.',
      'Keutamaan di Dunia: Menyayangi dan mengusap kepala anak yatim dengan lembut dapat melunakkan hati yang keras, mendatangkan keberkahan rezeki, dan menumbuhkan kepedulian sosial.',
      'Pengamalan Siswa Kelas 6: Berteman akrab dengan teman yatim tanpa membeda-bedakan, tidak mengejek atau menghardiknya, menyisihkan sebagian uang saku untuk santunan yatim, serta mendoakan kebaikan bagi mereka.'
    ],
    detailHeading: 'Pelajaran & Wujud Nyata Keutamaan Terhadap Anak Yatim',
    detailCards: [
      {
        badge: 'Makna Kafilul Yatim',
        title: 'Siapakah Pengasuh / Penanggung Anak Yatim?',
        note: 'Kafilul yatim adalah orang yang mengurus kebutuhan anak yatim—baik kebutuhan hidup, pendidikan, bimbingan akhlak, maupun kasih sayang—baik dari keluarga dekat maupun orang lain yang tulus membantu.'
      },
      {
        badge: 'Teladan di Sekolah',
        title: '4 Cara Siswa Kelas 6 Memuliakan Teman Yatim',
        note: '1) Menyapa dan mengajak bermain bersama tanpa pilih kasih. 2) Menjaga tutur kata yang lembut (tidak mengejek/menghardik). 3) Berbagi alat tulis, buku, atau bekal dengan ikhlas. 4) Ikut berinfak pada kegiatan santunan yatim di sekolah.'
      }
    ],
    ttsText: 'Selamat datang di Hutan Hadis Fase C Kelas 6! Materi kita adalah hadis tentang keutamaan terhadap anak yatim. Rasulullah shallallahu alaihi wasallam bersabda dalam hadis riwayat Imam Bukhari: Aku dan orang yang menanggung anak yatim di surga kelak seperti ini, sambil beliau mengisyaratkan jari telunjuk dan jari tengah yang sangat berdekatan. Mari kita memuliakan, menyayangi, dan berbagi dengan anak yatim dengan tulus dan penuh hormat.'
  },
  's1-hijaiyah': {
    id: 's1-hijaiyah',
    gateLabel: 'Hutan Hijaiyah',
    title: 'Huruf Tunggal Penyusun Ayat 1–3 Q.S. ad-Duha & Q.S. al-Insyirah beserta Transliterasinya',
    bannerDesc: 'Fase C Kelas 6 • Mengurai huruf hijaiyah tunggal penyusun 3 ayat pertama Q.S. ad-Duha dan 3 ayat pertama Q.S. al-Insyirah lengkap dengan transliterasi.',
    arabic: 'وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
    transliteration: "Contoh 3 Ayat Q.S. ad-Duha (1–3) & 3 Ayat Q.S. al-Insyirah (1–3)",
    translation: 'Mengenal bentuk huruf tunggal (mufradah) yang menyusun setiap kata pada ayat 1–3 Q.S. ad-Duha dan ayat 1–3 Q.S. al-Insyirah beserta cara membacanya.',
    description: 'Di Hutan Hijaiyah Fase C Kelas 6, kita berlatih mengidentifikasi huruf-huruf hijaiyah tunggal (lepas) yang menyusun ayat 1 sampai ayat 3 dari Q.S. ad-Duha serta ayat 1 sampai ayat 3 dari Q.S. al-Insyirah, lengkap dengan transliterasi Latin agar kita terampil membaca dan menulis Al-Qur\'an secara tepat.',
    points: [
      'Arah membaca & mengurai huruf hijaiyah selalu dimulai dari kanan ke kiri.',
      'Huruf bertasydid (seperti ضّ, لّ, دّ, بّ) saat diurai ke bentuk tulisan rasm dituliskan sesuai huruf tunggal penyusunnya, sedangkan saat dibaca ditekan/rangkap sesuai transliterasi.',
      'Perhatikan huruf yang tidak dapat disambung ke kiri (ا، د، ذ، ر، ز، و) seperti pada kata وَدَّعَكَ، إِذَا، صَدْرَكَ، dan وِزْرَكَ.',
      'Tanda titik pemisah (•) pada uraian huruf di bawah menandakan batas antar kata agar mudah diikuti.'
    ],
    detailHeading: 'Uraian Huruf Tunggal & Transliterasi Ayat 1–3 Q.S. ad-Duha dan Q.S. al-Insyirah',
    detailCards: [
      {
        badge: 'Q.S. ad-Duha • Ayat 1',
        title: 'Ayat 1 Q.S. ad-Duha',
        arabic: 'وَالضُّحَىٰ',
        transliteration: 'Waḍ-ḍuḥā',
        meaning: 'Demi waktu duha (ketika matahari naik sepenggalahan).',
        letters: ['و', 'ا', 'ل', 'ض', 'ح', 'ى'],
        note: '6 huruf tunggal (kanan ke kiri): wau – alif – lam – dad – ha – alif maqsurah (ya tanpa titik).'
      },
      {
        badge: 'Q.S. ad-Duha • Ayat 2',
        title: 'Ayat 2 Q.S. ad-Duha',
        arabic: 'وَاللَّيْلِ إِذَا سَجَىٰ',
        transliteration: 'Wal-laili iżā sajā',
        meaning: 'Dan demi malam apabila telah sunyi.',
        letters: ['و', 'ا', 'ل', 'ل', 'ي', 'ل', '•', 'إ', 'ذ', 'ا', '•', 'س', 'ج', 'ى'],
        note: 'Tersusun dari 3 kata: وَاللَّيْلِ (و ا ل ل ي ل), إِذَا (إ ذ ا), dan سَجَىٰ (س ج ى).'
      },
      {
        badge: 'Q.S. ad-Duha • Ayat 3',
        title: 'Ayat 3 Q.S. ad-Duha',
        arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
        transliteration: "Mā wadda'aka rabbuka wa mā qalā",
        meaning: 'Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak (pula) membencimu.',
        letters: ['م', 'ا', '•', 'و', 'د', 'ع', 'ك', '•', 'ر', 'ب', 'ك', '•', 'و', 'م', 'ا', '•', 'ق', 'ل', 'ى'],
        note: 'Tersusun dari 5 kata: مَا (م ا), وَدَّعَكَ (و د ع ك), رَبُّكَ (ر ب ك), وَمَا (و م ا), dan قَلَىٰ (ق ل ى).'
      },
      {
        badge: 'Q.S. al-Insyirah • Ayat 1',
        title: 'Ayat 1 Q.S. al-Insyirah',
        arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
        transliteration: 'Alam nasyraḥ laka ṣadrak(a)',
        meaning: 'Bukankah Kami telah melapangkan dadamu (Muhammad)?',
        letters: ['أ', 'ل', 'م', '•', 'ن', 'ش', 'ر', 'ح', '•', 'ل', 'ك', '•', 'ص', 'د', 'ر', 'ك'],
        note: 'Tersusun dari 4 kata: أَلَمْ (أ ل م), نَشْرَحْ (ن ش ر ح), لَكَ (ل ك), dan صَدْرَكَ (ص د ر ك).'
      },
      {
        badge: 'Q.S. al-Insyirah • Ayat 2',
        title: 'Ayat 2 Q.S. al-Insyirah',
        arabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
        transliteration: "Wa waḍa'nā 'anka wizrak(a)",
        meaning: 'Dan Kami pun telah menurunkan bebanmu darimu,',
        letters: ['و', 'و', 'ض', 'ع', 'ن', 'ا', '•', 'ع', 'ن', 'ك', '•', 'و', 'ز', 'ر', 'ك'],
        note: 'Tersusun dari 3 kata: وَوَضَعْنَا (و و ض ع ن ا), عَنكَ (ع ن ك), dan وِزْرَكَ (و ز ر ك).'
      },
      {
        badge: 'Q.S. al-Insyirah • Ayat 3',
        title: 'Ayat 3 Q.S. al-Insyirah',
        arabic: 'الَّذِي أَنقَضَ ظَهْرَكَ',
        transliteration: 'Allażī anqaḍa ẓahrak(a)',
        meaning: 'yang memberatkan punggungmu,',
        letters: ['ا', 'ل', 'ذ', 'ي', '•', 'أ', 'ن', 'ق', 'ض', '•', 'ظ', 'ه', 'ر', 'ك'],
        note: 'Tersusun dari 3 kata: الَّذِي (ا ل ذ ي), أَنقَضَ (أ ن ق ض), dan ظَهْرَكَ (ظ ه ر ك).'
      }
    ],
    ttsText: 'Selamat datang di Hutan Hijaiyah Fase C Kelas 6! Di sini kita mempelajari huruf tunggal hijaiyah penyusun ayat satu sampai tiga Surah ad-Duha dan Surah al-Insyirah lengkap dengan transliterasinya. Surah ad-Duha ayat satu berbunyi wad-duha, ayat dua wal-laili iza saja, dan ayat tiga ma wadda aka rabbuka wa ma qala. Sedangkan Surah al-Insyirah ayat satu berbunyi alam nasyrah laka sadrak, ayat dua wa wada na anka wizrak, dan ayat tiga allazi anqada zahrak. Amati susunan huruf tunggalnya dari kanan ke kiri agar mahir membaca dan menulis Al-Qur\'an.'
  }
};

export interface CurriculumMap {
  [season: number]: {
    [grade: number]: {
      [stage: number]: StageCurriculum;
    };
  };
}

export const CURRICULUM_DATA: CurriculumMap = {
  // SEASON 1 (SEMESTER 1)
  1: {
    // KELAS 1 (FASE A)
    1: {
      1: {
        title: "Huruf Hijaiah & Makharijul Huruf",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase A",
        arabic: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن و هـ لا ي",
        translation: "Huruf hijaiah adalah huruf Arab permulaan yang digunakan dalam kitab suci Al-Qur'an.",
        description: "Mengenal bentuk dan tempat keluarnya bunyi huruf (makhraj) serta harakat dasar: Fathah (bunyi a), Kasrah (bunyi i), dan Dammah (bunyi u).",
        points: [
          "Huruf hijaiah berjumlah 29 huruf dasar.",
          "Harakat fathah berada di atas berbunyi 'A', kasrah di bawah berbunyi 'I', dan dammah berbunyi 'U'.",
          "Membaca Al-Qur'an dimulai dengan melafalkan huruf dari makhraj yang tepat seperti tenggorokan, lidah, dan bibir."
        ],
        ttsText: "Huruf hijaiah adalah huruf dasar Al-Qur'an. Fathah berbunyi a, kasrah berbunyi i, dan dammah berbunyi u.",
        bossName: "Penjaga Huruf Hijaiah",
        bossDesc: "Buktikan ketepatan mengenal harakat dan bunyi huruf Al-Qur'an!",
        quiz: [
          {
            question: "Tanda harakat yang berada di atas huruf dan berbunyi 'A' disebut tanda...",
            options: ["Fathah", "Kasrah", "Dammah", "Sukun"],
            answer: 0,
            explanation: "Fathah adalah harakat garis di atas huruf yang menghasilkan bunyi vokal 'A'.",
            hint: "Garis miring yang terletak di atas huruf."
          },
          {
            question: "Harakat Kasrah memberikan bunyi vokal...",
            options: ["A", "I", "U", "An"],
            answer: 1,
            explanation: "Kasrah adalah harakat di bawah huruf yang menghasilkan bunyi vokal 'I'.",
            hint: "Bunyinya seperti kata 'Ibu'."
          },
          {
            question: "Huruf pertama dalam susunan huruf hijaiah adalah...",
            options: ["Ba", "Ta", "Alif", "Jim"],
            answer: 2,
            explanation: "Huruf pertama dalam abjad hijaiah adalah Alif (ا).",
            hint: "Huruf yang tegak lurus seperti angka satu."
          }
        ]
      },
      2: {
        title: "Rukun Iman yang Enam",
        element: "Akidah",
        fase: "Fase A",
        arabic: "آمَنْتُ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ",
        translation: "Aku beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, dan rasul-rasul-Nya.",
        description: "Rukun Iman adalah pokok-pokok keyakinan setiap orang muslim yang wajib dipercayai dengan tulus di dalam hati.",
        points: [
          "Rukun Iman berjumlah 6 perkara.",
          "Urutan pertama adalah Iman kepada Allah Swt. sebagai Sang Pencipta alam semesta.",
          "Diikuti iman kepada Malaikat, Kitab-Kitab, Rasul-Rasul, Hari Kiamat, serta Qada dan Qadar."
        ],
        ttsText: "Rukun Iman ada enam: Iman kepada Allah, Malaikat, Kitab, Rasul, Hari Kiamat, dan Takdir.",
        bossName: "Pengawal Pilar Keimanan",
        bossDesc: "Ujilah keyakinanmu terhadap 6 Rukun Iman!",
        quiz: [
          {
            question: "Berapakah jumlah Rukun Iman yang wajib kita yakini?",
            options: ["4", "5", "6", "7"],
            answer: 2,
            explanation: "Rukun Iman dalam Islam ada 6 perkara.",
            hint: "Satu angka lebih banyak dari rukun Islam."
          },
          {
            question: "Rukun Iman yang pertama adalah beriman kepada...",
            options: ["Malaikat", "Allah Swt.", "Kitab Suci", "Hari Kiamat"],
            answer: 1,
            explanation: "Rukun Iman pertama dan paling utama adalah beriman kepada Allah Swt.",
            hint: "Tuhan yang Maha Esa Pencipta alam."
          },
          {
            question: "Meyakini adanya hari pembalasan dan kiamat termasuk rukun iman ke...",
            options: ["Tiga", "Empat", "Lima", "Enam"],
            answer: 2,
            explanation: "Iman kepada Hari Akhir/Kiamat adalah rukun iman yang kelima.",
            hint: "Tepat sebelum iman kepada Qada dan Qadar."
          }
        ]
      },
      3: {
        title: "Menyucikan Allah Swt.",
        element: "Akhlak",
        fase: "Fase A",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        translation: "Maha Suci Allah dan segala puji bagi-Nya.",
        description: "Akhlak terpuji kepada Allah Swt. dengan selalu menyucikan nama-Nya dari segala kekurangan melalui kalimat tayibah tasbih.",
        points: [
          "Kalimat Tasbih berbunyi 'Subhanallah' yang artinya Maha Suci Allah.",
          "Kalimat Tahmid berbunyi 'Alhamdulillah' untuk bersyukur atas nikmat.",
          "Menyucikan Allah membuat hati tenang dan dijauhkan dari sifat sombong."
        ],
        ttsText: "Menyucikan Allah dilakukan dengan mengucapkan Subhanallah yang berarti Maha Suci Allah.",
        bossName: "Penjaga Budi Pekerti",
        bossDesc: "Tunjukkan adab luhur menyucikan asma Allah Swt.!",
        quiz: [
          {
            question: "Lafaz kalimat tayibah untuk menyucikan Allah adalah...",
            options: ["Alhamdulillah", "Subhanallah", "Allahu Akbar", "Astaghfirullah"],
            answer: 1,
            explanation: "Subhanallah artinya Maha Suci Allah, diucapkan saat takjub atau menyucikan Allah.",
            hint: "Disebut juga dengan bacaan tasbih."
          },
          {
            question: "Arti dari bacaan 'Subhanallah' adalah...",
            options: ["Segala puji bagi Allah", "Maha Suci Allah", "Allah Maha Besar", "Tiada Tuhan selain Allah"],
            answer: 1,
            explanation: "Subhanallah bermakna Maha Suci Allah dari segala sifat kekurangan.",
            hint: "Ada kata 'Suci'."
          },
          {
            question: "Ketika melihat ciptaan Allah yang sangat indah dan menakjubkan, kita mengucap...",
            options: ["Subhanallah", "Inna lillahi", "Astaghfirullah", "Bismillah"],
            answer: 0,
            explanation: "Saat kagum melihat keindahan ciptaan Allah, disunahkan mengucap Subhanallah / Masya Allah.",
            hint: "Kalimat tasbih."
          }
        ]
      },
      4: {
        title: "Rukun Islam & Syahadatain",
        element: "Fikih",
        fase: "Fase A",
        arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ",
        translation: "Aku bersaksi bahwa tiada Tuhan selain Allah, dan Nabi Muhammad adalah utusan Allah.",
        description: "Rukun Islam adalah pondasi utama amalan lahiriah seorang muslim. Dimulai dari mengucapkan dua kalimat syahadat.",
        points: [
          "Rukun Islam ada 5: Syahadat, Salat, Zakat, Puasa, dan Haji bagi yang mampu.",
          "Syahadatain terdiri dari Syahadat Tauhid dan Syahadat Rasul.",
          "Syahadat adalah pintu gerbang seseorang memeluk agama Islam."
        ],
        ttsText: "Rukun Islam ada 5. Pertama adalah mengucap dua kalimat syahadat yang menjadi pintu keislaman.",
        bossName: "Ksatria Pondasi Ibadah",
        bossDesc: "Ujilah pemahamanmu tentang Rukun Islam dan Syahadatain!",
        quiz: [
          {
            question: "Berapakah jumlah Rukun Islam yang menjadi pondasi umat muslim?",
            options: ["3", "4", "5", "6"],
            answer: 2,
            explanation: "Rukun Islam ada 5 perkara yang saling menguatkan.",
            hint: "Sama dengan jumlah jari di satu tangan."
          },
          {
            question: "Syahadat yang menyatakan bahwa Nabi Muhammad utusan Allah disebut syahadat...",
            options: ["Tauhid", "Rasul", "Iman", "Islam"],
            answer: 1,
            explanation: "Kalimat 'wa asyhadu anna Muhammadar Rasulullah' disebut Syahadat Rasul.",
            hint: "Terdapat sebutan Rasul di dalamnya."
          },
          {
            question: "Rukun Islam yang kedua setelah mengucapkan syahadatain adalah mendirikan...",
            options: ["Puasa", "Salat", "Zakat", "Haji"],
            answer: 1,
            explanation: "Rukun Islam kedua adalah mendirikan salat lima waktu.",
            hint: "Ibadah tiang agama yang dikerjakan 5 kali sehari."
          }
        ]
      },
      5: {
        title: "Kisah Keteladanan Nabi Adam a.s.",
        element: "Sejarah Peradaban Islam",
        fase: "Fase A",
        arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
        translation: "Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami, niscaya kami termasuk orang rugi.",
        description: "Nabi Adam a.s. adalah manusia pertama sekaligus Nabi pertama yang diciptakan Allah Swt. dari tanah dengan penuh kemuliaan.",
        points: [
          "Nabi Adam a.s. diciptakan oleh Allah dari saripati tanah.",
          "Diberikan ilmu pengetahuan berupa nama-nama benda di alam semesta.",
          "Mencontohkan sifat taubat yang tulus dan memohon ampunan ketika melakukan kekhilafan."
        ],
        ttsText: "Nabi Adam alaihissalam adalah manusia dan nabi pertama. Beliau mengajarkan kita untuk segera memohon ampun jika berbuat salah.",
        bossName: "Penjaga Catatan Sejarah Awal",
        bossDesc: "Jawablah kisah keteladanan Nabi Adam a.s. dengan benar!",
        quiz: [
          {
            question: "Siapakah manusia pertama yang diciptakan Allah Swt.?",
            options: ["Nabi Nuh a.s.", "Nabi Ibrahim a.s.", "Nabi Adam a.s.", "Nabi Musa a.s."],
            answer: 2,
            explanation: "Nabi Adam a.s. adalah bapak seluruh umat manusia (Abul Basyar).",
            hint: "Nabi dan manusia paling pertama."
          },
          {
            question: "Bahan apakah yang digunakan Allah untuk menciptakan Nabi Adam a.s.?",
            options: ["Cahaya", "Api", "Tanah", "Angin"],
            answer: 2,
            explanation: "Nabi Adam a.s. diciptakan Allah dari saripati tanah.",
            hint: "Bahan dasar tempat tumbuhan berpijak."
          },
          {
            question: "Keteladanan utama yang ditunjukkan Nabi Adam saat menyadari kesalahannya adalah...",
            options: ["Menyalahkan orang lain", "Segera bertaubat dan memohon ampun", "Bersembunyi", "Marah"],
            answer: 1,
            explanation: "Nabi Adam langsung berdoa memohon ampunan Allah dengan sungguh-sungguh.",
            hint: "Meminta maaf dan istighfar kepada Allah."
          }
        ]
      }
    },
    // KELAS 2 (FASE A)
    2: {
      1: {
        title: "Huruf Bersambung & Surah Pendek",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase A",
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ • مَلِكِ النَّاسِ • إِلَٰهِ النَّاسِ",
        translation: "Katakanlah: 'Aku berlindung kepada Tuhannya manusia, Raja manusia, Sembahan manusia.'",
        description: "Membaca dan merangkai huruf hijaiah bersambung 3 huruf atau lebih, serta melafalkan Surah an-Nas dan Surah al-Falaq sebagai pelindung diri.",
        points: [
          "Huruf hijaiah mengalami perubahan bentuk saat di awal, tengah, dan akhir kata.",
          "Ada 6 huruf yang tidak bisa disambung dengan huruf setelahnya (ا, د, ذ, ر, ز, و).",
          "Surah an-Nas dan al-Falaq dinamakan Al-Mu'awwidzatain (dua surah perlindungan)."
        ],
        ttsText: "Surah an-Nas dan al-Falaq adalah surah perlindungan. Huruf hijaiah berubah bentuk saat disambung.",
        bossName: "Pilar Pembaca Kalam",
        bossDesc: "Ujilah kemampuan menyambung huruf dan pemahaman surah pelindung!",
        quiz: [
          {
            question: "Surah an-Nas dan Surah al-Falaq sering disebut sebagai surah...",
            options: ["Al-Fatihah", "Al-Mu'awwidzatain", "Al-Baqarah", "Al-Kausar"],
            answer: 1,
            explanation: "Al-Mu'awwidzatain berarti dua surah yang berisi doa perlindungan kepada Allah.",
            hint: "Dua surah pelindung dari kejahatan bisikan."
          },
          {
            question: "Arti dari kata 'An-Nas' adalah...",
            options: ["Waktu Subuh", "Manusia", "Malam", "Bintang"],
            answer: 1,
            explanation: "An-Nas artinya sekumpulan manusia.",
            hint: "Lawan kata dari bangsa jin atau malaikat."
          },
          {
            question: "Di antara huruf berikut, manakah huruf yang tidak bisa menyambung ke huruf sesudahnya?",
            options: ["Ba (ب)", "Nun (ن)", "Wau (و)", "Jim (ج)"],
            answer: 2,
            explanation: "Huruf Wau (و) hanya bisa disambung dari depan, tidak bisa menyambung ke huruf setelahnya.",
            hint: "Huruf yang berbentuk lengkung bulat."
          }
        ]
      },
      2: {
        title: "Asmaulhusna Maha Pengasih & Damai",
        element: "Akidah",
        fase: "Fase A",
        arabic: "الرَّحْمَٰنُ • الرَّحِيمُ • السَّلَامُ • الْمُؤْمِنُ",
        translation: "Maha Pengasih, Maha Penyayang, Maha Pemberi Kesejahteraan, Maha Pemberi Keamanan.",
        description: "Mengenal nama-nama indah Allah: ar-Rahman (Pengasih), ar-Rahim (Penyayang), as-Salam (Pemberi Keselamatan), dan al-Mu'min (Pemberi Keamanan).",
        points: [
          "Ar-Rahman berarti kasih Allah meliputi seluruh makhluk di alam semesta.",
          "Ar-Rahim adalah kasih sayang khusus Allah kepada hamba-Nya yang beriman di akhirat.",
          "As-Salam mengajarkan kita untuk selalu menebarkan kedamaian dan salam kepada sesama."
        ],
        ttsText: "Ar-Rahman Maha Pengasih kepada semua makhluk. As-Salam memberi keselamatan dan kedamaian.",
        bossName: "Penjaga Sinar Asmaulhusna",
        bossDesc: "Tunjukkan pemahamanmu tentang nama-nama agung Allah!",
        quiz: [
          {
            question: "Asmaulhusna 'Ar-Rahman' artinya Allah Maha...",
            options: ["Pengasih", "Adil", "Melihat", "Mengetahui"],
            answer: 0,
            explanation: "Ar-Rahman artinya Maha Pengasih kepada seluruh makhluk di dunia.",
            hint: "Selalu berpasangan dengan Ar-Rahim di awal basmalah."
          },
          {
            question: "Asmaulhusna 'As-Salam' memiliki arti Allah Maha...",
            options: ["Pencipta", "Pemberi Kesejahteraan / Keselamatan", "Pemberi Rezeki", "Kaya"],
            answer: 1,
            explanation: "As-Salam artinya Maha Sejahtera dan Sumber Keselamatan.",
            hint: "Kata dasarnya sama dengan ucapan salam."
          },
          {
            question: "Penerapan meneladani sifat Al-Mu'min dalam kehidupan sehari-hari adalah...",
            options: ["Membuat teman takut", "Memberi rasa aman dan tidak mengganggu orang lain", "Mengejek kawan", "Suka berkelahi"],
            answer: 1,
            explanation: "Meneladani Al-Mu'min artinya menjaga lingkungan tetap damai dan aman.",
            hint: "Menjaga keamanan dan ketertiban kelas."
          }
        ]
      },
      3: {
        title: "Pola Hidup Bersih & Sehat",
        element: "Akhlak",
        fase: "Fase A",
        arabic: "الطَّهُورُ شَطْرُ الْإِيمَانِ",
        translation: "Kebersihan itu adalah sebagian dari iman. (HR. Muslim)",
        description: "Akhlak mulia terhadap diri sendiri dengan menjaga kebersihan tubuh, pakaian, makanan sehat, serta tempat tinggal dan sekolah.",
        points: [
          "Islam sangat mencintai kebersihan lahiriah dan batiniah.",
          "Mandi teratur, menggosok gigi, dan memotong kuku adalah sunah Rasulullah.",
          "Menjaga kebersihan kelas SDN Kedungringin I Beji merupakan wujud akhlak terpuji."
        ],
        ttsText: "Kebersihan adalah sebagian dari iman. Menjaga kebersihan diri dan sekolah adalah ibadah.",
        bossName: "Penjaga Kesucian Diri",
        bossDesc: "Ujilah perilakumu dalam memelihara kebersihan jasmani dan rohani!",
        quiz: [
          {
            question: "Berdasarkan hadis Rasulullah saw., kebersihan adalah sebagian dari...",
            options: ["Harta", "Iman", "Kekuatan", "Kepandaian"],
            answer: 1,
            explanation: "At-tahuru syatrul iman, kebersihan adalah sebagian dari keimanan.",
            hint: "Keyakinan hati seorang muslim."
          },
          {
            question: "Cara menjaga kebersihan gigi yang dicontohkan Rasulullah adalah dengan...",
            options: ["Bersiwak / menggosok gigi", "Makan permen manis", "Berkumur air es", "Tidur siang"],
            answer: 0,
            explanation: "Menggosok gigi atau bersiwak menjaga mulut tetap segar dan bersih dari kuman.",
            hint: "Alat pembersih gigi alami atau sikat gigi."
          },
          {
            question: "Tindakan terpuji saat melihat sampah berserakan di halaman sekolah adalah...",
            options: ["Membiarkannya", "Mengambil dan membuangnya ke tempat sampah", "Menendang sampah", "Menyuruh teman"],
            answer: 1,
            explanation: "Mengambil sampah dan membuang ke tempatnya menunjukkan kecintaan pada kebersihan.",
            hint: "Peduli kebersihan lingkungan sekolah."
          }
        ]
      },
      4: {
        title: "Salat Fardu Lima Waktu",
        element: "Fikih",
        fase: "Fase A",
        arabic: "الصَّلَاةُ عِمَادُ الدِّينِ",
        translation: "Salat itu adalah tiang agama. (HR. Baihaqi)",
        description: "Salat Fardu adalah kewajiban lima waktu sehari semalam: Subuh, Zuhur, Asar, Magrib, dan Isya dengan jumlah rakaat yang ditentukan.",
        points: [
          "Salat Subuh 2 rakaat, Zuhur 4 rakaat, Asar 4 rakaat, Magrib 3 rakaat, dan Isya 4 rakaat.",
          "Total rakaat salat fardu sehari semalam adalah 17 rakaat.",
          "Salat melatih kedisiplinan waktu, ketenangan jiwa, dan mencegah perbuatan keji."
        ],
        ttsText: "Salat fardu ada lima waktu dengan total 17 rakaat. Salat adalah tiang agama Islam.",
        bossName: "Imam Penegak Tiang Agama",
        bossDesc: "Tunjukkan ketelitianmu mengenai ketentuan salat fardu lima waktu!",
        quiz: [
          {
            question: "Jumlah rakaat salat Magrib adalah...",
            options: ["2 rakaat", "3 rakaat", "4 rakaat", "5 rakaat"],
            answer: 1,
            explanation: "Salat Magrib dikerjakan sebanyak 3 rakaat saat matahari terbenam.",
            hint: "Jumlah ganjil lebih dari dua rakaat."
          },
          {
            question: "Berapa total jumlah rakaat salat fardu lima waktu dalam sehari semalam?",
            options: ["15 rakaat", "17 rakaat", "20 rakaat", "23 rakaat"],
            answer: 1,
            explanation: "2 (Subuh) + 4 (Zuhur) + 4 (Asar) + 3 (Magrib) + 4 (Isya) = 17 rakaat.",
            hint: "Angka yang sama dengan tanggal kemerdekaan Indonesia."
          },
          {
            question: "Salat yang dikerjakan pada fajar terbit dan berjumlah dua rakaat adalah salat...",
            options: ["Subuh", "Zuhur", "Asar", "Isya"],
            answer: 0,
            explanation: "Salat Subuh dikerjakan di waktu fajar sebanyak 2 rakaat.",
            hint: "Waktu pagi sebelum matahari terbit."
          }
        ]
      },
      5: {
        title: "Kisah Keteladanan Nabi Nuh a.s.",
        element: "Sejarah Peradaban Islam",
        fase: "Fase A",
        arabic: "وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا",
        translation: "Dan buatlah bahtera (kapal) itu dengan pengawasan dan petunjuk wahyu Kami. (QS. Hud: 37)",
        description: "Nabi Nuh a.s. adalah salah satu Rasul Ulul Azmi yang memiliki kesabaran luar biasa dalam berdakwah selama 950 tahun dan membuat bahtera besar.",
        points: [
          "Nabi Nuh berdakwah siang dan malam dengan penuh kesabaran.",
          "Diperintahkan Allah membuat kapal raksasa di atas bukit.",
          "Menyelamatkan orang-orang beriman dan pasang-pasangan hewan saat banjir besar melanda."
        ],
        ttsText: "Nabi Nuh sangat sabar berdakwah dan membuat bahtera besar untuk menyelamatkan orang beriman dari banjir bandang.",
        bossName: "Nahkoda Bahtera Kesabaran",
        bossDesc: "Pecahkan ujian seputar kisah perjuangan Nabi Nuh a.s.!",
        quiz: [
          {
            question: "Mukjizat besar yang dibuat Nabi Nuh a.s. atas perintah Allah adalah...",
            options: ["Tongkat menjadi ular", "Bahtera (kapal) raksasa", "Unta keluar dari batu", "Memadamkan api"],
            answer: 1,
            explanation: "Nabi Nuh diperintahkan membuat bahtera besar untuk menyelamatkan kaum beriman.",
            hint: "Kendaraan laut berukuran sangat besar."
          },
          {
            question: "Sikap mulia yang paling menonjol dari Nabi Nuh a.s. dalam berdakwah adalah...",
            options: ["Mudah putus asa", "Kesabaran dan ketabahan yang luar biasa", "Suka marah", "Membalas dendam"],
            answer: 1,
            explanation: "Nabi Nuh terkenal dengan kesabaran luar biasa meski diejek oleh kaumnya.",
            hint: "Tidak pernah menyerah menghadapi cobaan."
          },
          {
            question: "Anak Nabi Nuh yang menolak beriman dan ikut tenggelam dalam air bah bernama...",
            options: ["Sam", "Ham", "Kan'an", "Yafits"],
            answer: 2,
            explanation: "Kan'an menolak naik ke perahu dan memilih lari ke puncak gunung sehingga tenggelam.",
            hint: "Diawal huruf K."
          }
        ]
      }
    },
    // KELAS 3 (FASE B)
    3: {
      1: {
        title: "Mad Tabii & Surah al-Kausar",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase B",
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ • فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        translation: "Sungguh, Kami telah memberimu nikmat yang banyak. Maka laksanakanlah salat karena Tuhanmu, dan berkurbanlah.",
        description: "Mempelajari hukum bacaan Mad Tabii (panjang 2 harakat karena huruf alif, wau sukun, atau ya sukun) dan keutamaan Surah al-Kausar.",
        points: [
          "Mad Tabii terjadi jika fathah bertemu alif, kasrah bertemu ya sukun, atau dammah bertemu wau sukun.",
          "Panjang bacaan Mad Tabii adalah 1 alif atau 2 harakat.",
          "Surah al-Kausar mengingatkan kita untuk selalu bersyukur, mendirikan salat, dan berkurban."
        ],
        ttsText: "Mad tabii dibaca panjang dua harakat. Surah al-Kausar mengajarkan kita untuk bersyukur atas nikmat yang melimpah.",
        bossName: "Penjaga Irama Mad",
        bossDesc: "Ujilah hukum panjang bacaan dan kandungan Surah al-Kausar!",
        quiz: [
          {
            question: "Berapa harakat panjang bacaan Mad Tabii (Mad Asli)?",
            options: ["1 harakat", "2 harakat", "4 harakat", "6 harakat"],
            answer: 1,
            explanation: "Mad Tabii dibaca panjang sepanjang 2 ketukan atau 1 alif.",
            hint: "Sama dengan dua ketukan sedang."
          },
          {
            question: "Huruf mad tabii berjumlah tiga, yaitu...",
            options: ["Alif, Wawu, Ya", "Ba, Ta, Tsa", "Mim, Nun, Wau", "Kaf, Lam, Mim"],
            answer: 0,
            explanation: "Huruf mad adalah Alif sukun sesudah fathah, Wau sukun sesudah dammah, dan Ya sukun sesudah kasrah.",
            hint: "Huruf vokal panjang dalam bahasa Arab."
          },
          {
            question: "Arti dari nama surah 'Al-Kausar' adalah...",
            options: ["Pertolongan", "Nikmat yang Banyak", "Waktu Pagi", "Kemenangan"],
            answer: 1,
            explanation: "Al-Kausar berarti karunia nikmat Allah yang berlimpah ruah.",
            hint: "Kebaikan dan anugerah yang melimpah."
          }
        ]
      },
      2: {
        title: "Sifat-Sifat Allah Swt.",
        element: "Akidah",
        fase: "Fase B",
        arabic: "لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ",
        translation: "Tidak ada sesuatu pun yang serupa dengan Dia, dan Dia Yang Maha Mendengar, Maha Melihat. (QS. Asy-Syura: 11)",
        description: "Mengenal Sifat Wajib bagi Allah (ada 20), Sifat Mustahil (sifat yang tidak mungkin ada pada Allah), dan Sifat Jaiz bagi Allah.",
        points: [
          "Sifat Wajib adalah sifat kesempurnaan yang pasti dimiliki Allah (seperti Wujud, Qidam, Baqa).",
          "Sifat Mustahil adalah lawan dari sifat wajib (seperti Adam, Hudus, Fana).",
          "Sifat Jaiz Allah adalah kebebasan mutlak Allah untuk menciptakan atau tidak menciptakan sesuatu."
        ],
        ttsText: "Allah memiliki sifat wajib yang sempurna, sifat mustahil yang tidak mungkin ada, dan sifat jaiz.",
        bossName: "Pengawal Hakikat Ketuhanan",
        bossDesc: "Tunjukkan pemahamanmu mengenai sifat wajib dan mustahil Allah Swt.!",
        quiz: [
          {
            question: "Sifat wajib Allah 'Wujud' memiliki arti bahwa Allah itu...",
            options: ["Maha Kuasa", "Pasti Ada", "Kekal", "Maha Mengetahui"],
            answer: 1,
            explanation: "Wujud artinya Allah itu Ada, mustahil Adam (tidak ada).",
            hint: "Lawan dari kata tidak ada."
          },
          {
            question: "Lawan dari sifat wajib 'Baqa' (Kekal) adalah sifat mustahil...",
            options: ["Fana (Rusak/Binasa)", "Ajzun (Lemah)", "Jahlun (Bodoh)", "Mautun (Mati)"],
            answer: 0,
            explanation: "Baqa artinya kekal, mustahil bagi Allah bersifat Fana (rusak atau binasa).",
            hint: "Segala yang di dunia ini akan mengalami hal ini kecuali Allah."
          },
          {
            question: "Berapakah jumlah sifat wajib bagi Allah yang masyhur dipelajari?",
            options: ["10 sifat", "15 sifat", "20 sifat", "25 sifat"],
            answer: 2,
            explanation: "Sifat wajib bagi Allah yang wajib diketahui berjumlah 20 sifat.",
            hint: "Dua kali lipat dari angka sepuluh."
          }
        ]
      },
      3: {
        title: "Berbaik Sangka kepada Allah",
        element: "Akhlak",
        fase: "Fase B",
        arabic: "أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",
        translation: "Aku (Allah) sesuai dengan persangkaan hamba-Ku kepada-Ku. (Hadis Qudsi)",
        description: "Menumbuhkan sikap Husnuzan (berbaik sangka) kepada ketetapan Allah Swt., meyakini bahwa setiap takdir mengandung hikmah terbaik.",
        points: [
          "Husnuzan kepada Allah memunculkan optimisme, rasa syukur, dan kesabaran.",
          "Menghindari Suuzan (berburuk sangka) saat menghadapi ujian atau kesulitan.",
          "Yakin bahwa doa kita pasti didengar dan dikabulkan pada waktu yang paling tepat."
        ],
        ttsText: "Husnuzan adalah berbaik sangka kepada Allah. Allah selalu memberikan yang terbaik bagi hamba-Nya.",
        bossName: "Penjaga Nurani Ikhlas",
        bossDesc: "Ujilah sikap berbaik sangka dan tawakal dalam menghadapi takdir!",
        quiz: [
          {
            question: "Sikap berbaik sangka kepada Allah dan sesama manusia disebut...",
            options: ["Suuzan", "Husnuzan", "Riya", "Hasad"],
            answer: 1,
            explanation: "Husnuzan berasal dari kata husnu (baik) dan zhan (prasangka).",
            hint: "Diawali dengan kata 'Husnu'."
          },
          {
            question: "Ketika kita berdoa namun belum terkabul seketika, sikap yang benar adalah...",
            options: ["Berhenti berdoa", "Tetap berbaik sangka bahwa Allah menyiapkan waktu terbaik", "Menyalahkan orang lain", "Marah"],
            answer: 1,
            explanation: "Tetap husnuzan karena Allah Maha Mengetahui kapan waktu terbaik mengabulkan doa.",
            hint: "Sabar dan terus berikhtiar."
          },
          {
            question: "Lawan dari sifat Husnuzan adalah...",
            options: ["Tawaduk", "Suuzan", "Amanah", "Qanaah"],
            answer: 1,
            explanation: "Suuzan berarti berburuk sangka dan merupakan akhlak tercela yang harus dijauhi.",
            hint: "Prasangka buruk yang membahayakan hati."
          }
        ]
      },
      4: {
        title: "Panggilan Suci: Azan dan Ikamah",
        element: "Fikih",
        fase: "Fase B",
        arabic: "حَيَّ عَلَى الصَّلَاةِ • حَيَّ عَلَى الْفَلَاحِ",
        translation: "Marilah melaksanakan salat, marilah menuju kemenangan.",
        description: "Memahami makna seruan azan sebagai tanda masuknya waktu salat dan ikamah sebagai seruan untuk segera berdiri merapatkan saf salat.",
        points: [
          "Orang yang mengumandangkan azan disebut Muazin.",
          "Menjawab azan dengan khusyuk mendatangkan syafaat dan pahala besar.",
          "Ikamah dikumandangkan sesaat sebelum salat fardu berjamaah dimulai."
        ],
        ttsText: "Azan adalah panggilan salat. Muazin pertama dalam Islam adalah sahabat mulia Bilal bin Rabah.",
        bossName: "Muazin Cahaya Menara",
        bossDesc: "Buktikan kecakapanmu memahami lafaz dan adab azan serta ikamah!",
        quiz: [
          {
            question: "Orang yang bertugas mengumandangkan azan disebut...",
            options: ["Imam", "Makmum", "Muazin", "Khatib"],
            answer: 2,
            explanation: "Muazin adalah sebutan bagi orang yang menyerukan azan.",
            hint: "Sahabat Bilal bin Rabah adalah seorang..."
          },
          {
            question: "Seruan yang menandakan salat berjamaah akan segera dimulai disebut...",
            options: ["Azan", "Ikamah", "Takbiran", "Khutbah"],
            answer: 1,
            explanation: "Ikamah dibaca cepat sebagai tanda saf salat harus dirapatkan untuk segera dimulai.",
            hint: "Dibaca setelah azan dan doa."
          },
          {
            question: "Siapakah muazin pertama dalam sejarah Islam yang bersuara sangat merdu?",
            options: ["Abu Bakar", "Bilal bin Rabah", "Umar bin Khattab", "Ali bin Abi Talib"],
            answer: 1,
            explanation: "Bilal bin Rabah r.a. ditunjuk langsung oleh Rasulullah saw. sebagai muazin pertama.",
            hint: "Sahabat yang sangat teguh mempertahankan keimanan saat disiksa batu besar."
          }
        ]
      },
      5: {
        title: "Kelahiran Nabi Muhammad saw.",
        element: "Sejarah Peradaban Islam",
        fase: "Fase B",
        arabic: "وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",
        translation: "Dan tiadalah Kami mengutus engkau (Muhammad), melainkan untuk menjadi rahmat bagi semesta alam. (QS. Al-Anbiya: 107)",
        description: "Sejarah kelahiran Nabi Muhammad saw. pada hari Senin, 12 Rabiulawal Tahun Gajah di kota Makkah, serta masa pengasuhan di perkampungan Bani Sa'ad.",
        points: [
          "Nabi lahir dalam keadaan yatim karena sang ayah, Abdullah, wafat sebelum beliau lahir.",
          "Ibunda beliau bernama Siti Aminah, dan disusui oleh Halimah as-Sa'diyah.",
          "Tahun kelahirannya disebut Tahun Gajah karena bertepatan dengan serbuan pasukan gajah Abrahah yang dihancurkan burung Ababil."
        ],
        ttsText: "Nabi Muhammad lahir pada Tahun Gajah tanggal 12 Rabiul Awal di Makkah sebagai rahmat bagi semesta alam.",
        bossName: "Pengawal Lentera Sirah",
        bossDesc: "Ujilah wawasanmu mengenai masa awal kelahiran Nabi agung penutup para nabi!",
        quiz: [
          {
            question: "Nabi Muhammad saw. dilahirkan di kota suci...",
            options: ["Madinah", "Makkah", "Kairo", "Yerusalem"],
            answer: 1,
            explanation: "Nabi Muhammad saw. lahir di Makkah dekat Ka'bah pada tahun 571 M.",
            hint: "Kota tempat Ka'bah berada."
          },
          {
            question: "Tahun kelahiran Nabi Muhammad saw. dikenal dengan sebutan Tahun...",
            options: ["Kuda", "Gajah", "Unta", "Bintang"],
            answer: 1,
            explanation: "Dikenal sebagai Tahun Gajah ('Amul Fil) karena penyerbuan pasukan Abrahah yang berkendara gajah.",
            hint: "Hewan bertubuh besar dengan belalai panjang."
          },
          {
            question: "Wanita mulia dari Bani Sa'ad yang mengasuh dan menyusui Nabi Muhammad di masa bayi adalah...",
            options: ["Khadijah", "Aisyah", "Halimah as-Sa'diyah", "Fatimah"],
            answer: 2,
            explanation: "Halimah as-Sa'diyah membawa bayi Muhammad ke pedesaan yang udaranya bersih dan penuh berkah.",
            hint: "Nama depannya Halimah."
          }
        ]
      }
    },
    // KELAS 4 (FASE B)
    4: {
      1: {
        title: "Idgam Bigunah & Surah an-Nasr",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase B",
        arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ • وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
        translation: "Apabila telah datang pertolongan Allah dan kemenangan, dan engkau melihat manusia berbondong-bondong masuk agama Allah.",
        description: "Mempelajari hukum nun sukun/tanwin bertemu huruf Ya, Nun, Mim, Wau (Idgam Bigunah) dan huruf Lam, Ra (Idgam Bilagunah) serta Surah an-Nasr.",
        points: [
          "Idgam Bigunah artinya memasukkan bunyi dengan mendengung selama 2 harakat.",
          "Huruf Idgam Bigunah ada 4 (ي, ن, م, و), sedangkan Idgam Bilagunah ada 2 (ل, ر).",
          "Surah an-Nasr menceritakan pertolongan Allah dan peristiwa kemenangan Fathu Makkah."
        ],
        ttsText: "Idgam bigunah dibaca melebur dengan dengung pada huruf ya nun mim dan wau. Surah an-Nasr tentang pertolongan Allah.",
        bossName: "Penjaga Alunan Gunah",
        bossDesc: "Ujilah hukum bacaan Idgam dan makna Surah an-Nasr berbasis kasus AKM!",
        quiz: [
          {
            stimulus: "Fauzan sedang bertadarus di musala SDN Kedungringin I Beji membaca potongan ayat: 'فَمَنْ يَّعْمَلْ مِثْقَالَ ذَرَّةٍ' (fa man ya'mal). Temannya, Zaki, mendengar Fauzan membaca dengan meleburkan nun sukun ke huruf ya disertai dengung 2 harakat.",
            question: "Berdasarkan hukum tajwid, analisis bacaan yang dipraktikkan Fauzan tersebut termasuk hukum ... karena ...",
            options: [
              "Idgam Bigunah, karena nun sukun (نْ) bertemu huruf ya (ي) dan dibaca melebur dengan dengung",
              "Idgam Bilagunah, karena nun sukun (نْ) bertemu huruf mim dan dibaca tanpa dengung",
              "Izhar Halqi, karena nun sukun bertemu huruf ya dan wajib dibaca jelas tanpa dengung",
              "Ikhfa Hakiki, karena nun sukun bertemu huruf ya dan disamarkan bunyinya"
            ],
            answer: 0,
            explanation: "Hukum Idgam Bigunah terjadi apabila nun sukun atau tanwin bertemu salah satu dari 4 huruf (Ya, Nun, Mim, Wau). Cara membacanya dileburkan dan didengungkan 2 harakat.",
            hint: "Nun sukun bertemu huruf Ya (ي) dan dibaca melebur dengan dengung."
          },
          {
            stimulus: "Dalam suatu perlombaan cerdas cermat PAI, peserta diberikan empat potongan lafal berikut:\n(1) مِنْ وَّلَدٍ (min waladin)\n(2) هُدًى لِّلْمُتَّقِينَ (hudan lil-muttaqin)\n(3) عَنْ نَّفْسٍ ('an nafsin)\n(4) مِنْ رَّبِّهِمْ (min rabbihim)",
            question: "Manakah pasangan lafal yang sama-sama mengandung hukum bacaan Idgam Bilagunah (melebur tanpa mendengung)?",
            options: [
              "(2) dan (4)",
              "(1) dan (3)",
              "(1) dan (4)",
              "(2) dan (3)"
            ],
            answer: 0,
            explanation: "Idgam Bilagunah terjadi apabila nun sukun/tanwin bertemu huruf Lam (ل) atau Ra (ر). Nomor (2) tanwin bertemu lam, nomor (4) nun sukun bertemu ra. Keduanya dibaca lebur tanpa dengung.",
            hint: "Cari lafal yang nun sukun atau tanwinnya bertemu huruf Lam atau Ra."
          },
          {
            stimulus: "Ketika peristiwa Fathu Makkah terjadi, kaum muslimin berhasil membebaskan kota Makkah secara damai tanpa pertumpahan darah. Surah an-Nasr diturunkan kepada Nabi Muhammad saw. sebagai isyarat kemenangan dakwah tauhid.",
            question: "Pelajaran akhlak utama yang diperintahkan Allah Swt. dalam Surah an-Nasr setelah memperoleh nikmat kemenangan besar adalah ...",
            options: [
              "Bertasbih menyucikan Allah, memuji-Nya, dan memohon ampunan (istigfar)",
              "Berbangga diri dan merayakan kemenangan dengan pesta pora",
              "Membalas dendam kepada kaum yang pernah memusuhi umat Islam",
              "Meminta bagian harta rampasan perang sebanyak-banyaknya"
            ],
            answer: 0,
            explanation: "Surah an-Nasr ayat 3 memerintahkan: 'Fasabbih bihamdi rabbika wastaghfirh' (Maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampunan kepada-Nya). Kemenangan harus disyukuri dengan tawaduk dan istigfar.",
            hint: "Sesuai bunyi ayat ketiga: bertasbih, bertahmid, dan beristigfar."
          }
        ]
      },
      2: {
        title: "Asmaulhusna Al-Ghaffar & Al-Fattah",
        element: "Akidah",
        fase: "Fase B",
        arabic: "الْغَفَّارُ • الْوَهَّابُ • الْفَتَّاحُ • اللَّطِيفُ",
        translation: "Maha Pengampun, Maha Pemberi Karunia, Maha Pembuka Rahmat, Maha Lembut.",
        description: "Mendalami makna Asmaulhusna: al-Gaffar (Maha Pengampun), al-Wahhab (Maha Pemberi tanpa pamrih), al-Fattah (Maha Pembuka jalan kebaikan), dan al-Latif.",
        points: [
          "Al-Gaffar mengajarkan kita untuk mudah memaafkan kesalahan orang lain tanpa mendendam.",
          "Al-Wahhab menginspirasi kita untuk suka berbagi rezeki dan bersedekah tanpa pamrih.",
          "Al-Fattah membuka pintu rezeki, pemahaman ilmu, dan solusi bagi orang yang menghadapi kebuntuan."
        ],
        ttsText: "Al-Ghaffar Maha Pengampun, Al-Wahhab Maha Pemberi, dan Al-Fattah Maha Pembuka pintu rahmat dan kemudahan.",
        bossName: "Penjaga Pintu Ampunan",
        bossDesc: "Tunjukkan pemahamanmu mengenai keagungan nama-nama Allah berbasis studi kasus AKM!",
        quiz: [
          {
            stimulus: "Rina secara tidak sengaja menumpahkan cat air hingga mengotori buku gambar milik Aisyah di kelas. Rina merasa sangat bersalah dan langsung meminta maaf dengan sungguh-sungguh. Aisyah sempat kesal, namun ia mengingat nama Allah 'Al-Gaffar'.",
            question: "Berdasarkan pemahaman terhadap asmaulhusna Al-Gaffar, sikap terbaik yang harus diambil Aisyah sebagai wujud peneladanan sifat tersebut adalah ...",
            options: [
              "Memaafkan kesalahan Rina dengan tulus dan tidak menyimpan dendam di hati",
              "Menuntut ganti rugi uang yang banyak agar Rina merasa jera",
              "Membalas dengan mengotori tas sekolah milik Rina saat jam istirahat",
              "Mendiamkan Rina selama berbulan-bulan dan tidak mau berteman lagi"
            ],
            answer: 0,
            explanation: "Al-Gaffar artinya Allah Maha Pengampun. Meneladani sifat ini berarti menjadi pribadi yang pemaaf, berlapang dada, dan tidak menyimpan dendam terhadap sesama teman.",
            hint: "Meneladani sifat pemaaf Allah tanpa menyimpan dendam."
          },
          {
            stimulus: "Pak Rahman adalah seorang petani di dekat desa Kedungringin. Walaupun hasil panennya kadang pas-pasan, beliau selalu menyisihkan sebagian beras terbaiknya untuk diberikan kepada panti asuhan tanpa mengharapkan pujian manusia. Beliau yakin Allah Maha Al-Wahhab.",
            question: "Makna asmaulhusna 'Al-Wahhab' yang diresapi oleh Pak Rahman dalam kehidupannya adalah bahwa Allah Swt. ...",
            options: [
              "Maha Pemberi karunia dan anugerah tanpa henti serta tanpa mengharapkan imbalan apapun",
              "Maha Memperhitungkan setiap untung rugi dari manusia",
              "Maha Mengambil kembali nikmat secara paksa",
              "Maha Menghukum orang yang kekurangan harta"
            ],
            answer: 0,
            explanation: "Al-Wahhab artinya Allah Maha Memberi karunia yang berlimpah ruah secara cuma-cuma tanpa pamrih dan tanpa diminta.",
            hint: "Pemberi anugerah nikmat tanpa pamrih."
          },
          {
            stimulus: "Budi merasa kesulitan memahami pelajaran matematika menjelang ujian sekolah. Setelah berusaha giat belajar dan berdoa memohon kepada Allah yang memiliki asmaulhusna 'Al-Fattah', tiba-tiba ia menemukan cara penyelesaian rumus yang mudah dipahami.",
            question: "Pernyataan yang paling tepat mengenai fungsi asmaulhusna 'Al-Fattah' dalam kehidupan seorang pelajar muslim adalah ...",
            options: [
              "Allah Maha Membuka pintu rahmat, pemahaman ilmu, dan jalan keluar atas kebuntuan",
              "Allah langsung memberikan nilai 100 tanpa perlu ikhtiar belajar",
              "Allah mengunci pintu kesulitan sehingga manusia tidak bisa berusaha",
              "Allah membeda-bedakan pertolongan hanya kepada orang yang kaya"
            ],
            answer: 0,
            explanation: "Al-Fattah artinya Allah Maha Membuka, baik membuka pintu rezeki, pintu rahmat, jalan keluar dari kesulitan hidup, maupun keterbukaan pikiran dalam memahami ilmu.",
            hint: "Maha Pembuka pintu kebaikan, rahmat, dan jalan keluar."
          }
        ]
      },
      3: {
        title: "Adab Berbakti kepada Keluarga",
        element: "Akhlak",
        fase: "Fase B",
        arabic: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا",
        translation: "Dan Tuhanmu telah memerintahkan supaya kamu jangan menyembah selain Dia dan hendaklah kamu berbuat baik pada ibu bapakmu.",
        description: "Kewajiban berbakti (Birrul Walidain) kepada ayah dan ibu, menyayangi saudara kandung, serta menciptakan keharmonisan rumah tangga.",
        points: [
          "Ibu dan Ayah telah merawat, mendidik, dan mengasihi kita sejak kecil dengan penuh pengorbanan.",
          "Bertutur kata lembut, tidak membentak, dan menaati nasihat baik orang tua.",
          "Mendoakan kedua orang tua setiap selesai mendirikan salat fardu."
        ],
        ttsText: "Berbakti kepada orang tua adalah amalan paling utama setelah salat. Ucapkan perkataan yang santun kepada ayah dan ibu.",
        bossName: "Pelindung Harmoni Keluarga",
        bossDesc: "Ujilah adab luhurmu dalam berbakti kepada orang tua dan keluarga berbasis studi kasus AKM!",
        quiz: [
          {
            stimulus: "Sepulang sekolah, Dimas melihat ibunya sedang sibuk menggendong adiknya yang menangis sambil memasak di dapur. Di sisi lain, teman-teman Dimas memanggilnya di depan rumah untuk segera pergi bermain game.",
            question: "Berdasarkan prinsip akhlak Birrul Walidain (berbakti kepada orang tua), tindakan terpuji yang paling bijaksana dilakukan oleh Dimas adalah ...",
            options: [
              "Menyapa teman dengan sopan meminta izin menunda bermain, lalu segera membantu ibu menjaga adik",
              "Langsung lari keluar rumah ikut bermain agar tidak diejek teman sebaya",
              "Pura-pura tidur di kamar agar tidak disuruh membantu pekerjaan rumah",
              "Menyuruh ibunya meletakkan adik bayi di lantai agar bisa menyiapkan makan siang Dimas"
            ],
            answer: 0,
            explanation: "Birrul Walidain menuntut kepekaan nurani untuk mendahulukan bakti dan pertolongan kepada orang tua daripada kesenangan bermain semata.",
            hint: "Mendahulukan membantu ibu yang sedang kerepotan dengan santun."
          },
          {
            stimulus: "Dalam Al-Qur'an Surah Al-Isra' ayat 23, Allah Swt. berfirman: 'فَلَا تَقُلْ لَّهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا' (Maka sekali-kali janganlah engkau mengatakan kepada kedua orang tuamu perkataan 'ah' dan janganlah membentak mereka).",
            question: "Hikmah mendalam dari larangan mengucapkan kata 'ah' atau keluhan kepada orang tua adalah ...",
            options: [
              "Menjaga perasaan orang tua dari rasa sedih dan sakit hati atas pengorbanan tulus mereka",
              "Supaya anak selalu diberikan uang jajan lebih banyak setiap hari",
              "Hanya berlaku jika orang tua kita adalah pejabat atau orang terpandang",
              "Menghindari teguran guru di hadapan teman-teman sekolah"
            ],
            answer: 0,
            explanation: "Perkataan 'ah' adalah tingkat penolakan paling kecil. Jika yang terkecil saja dilarang keras, maka membentak atau menyakiti hati orang tua jauh lebih diharamkan.",
            hint: "Menghormati dan menjaga kelembutan hati orang tua yang telah membesarkan kita."
          },
          {
            stimulus: "Hasan dan adiknya, Wildan, sering berbeda pendapat tentang mainan di rumah. Sebagai kakak tertua, Hasan ingin meneladani adab persaudaraan dalam Islam sebagaimana diajarkan Rasulullah saw.",
            question: "Penerapan adab kepada saudara kandung yang mencerminkan budi pekerti luhur adalah ...",
            options: [
              "Kakak menyayangi dan membimbing adik, sedangkan adik menghormati dan patuh pada nasihat baik kakak",
              "Kakak berhak menguasai semua mainan karena usianya lebih tua dari adik",
              "Adik bebas membangkang karena masih kecil dan tidak wajib diatur",
              "Mengadukan kesalahan sepele adik kepada orang tua agar adik dimarahi"
            ],
            answer: 0,
            explanation: "Rasulullah saw. bersabda: 'Bukan dari golongan kami orang yang tidak menyayangi yang lebih muda dan tidak menghormati yang lebih tua.' Adab persaudaraan dilandasi kasih sayang dan saling menghormati.",
            hint: "Yang tua menyayangi, yang muda menghormati."
          }
        ]
      },
      4: {
        title: "Salat Sunah Rawatib, Duha, & Tahajud",
        element: "Fikih",
        fase: "Fase B",
        arabic: "مَنْ صَلَّى اثْنَتَيْ عَشْرَةَ رَكْعَةً فِي يَوْمٍ وَلَيْلَةٍ بُنِيَ لَهُ بِهِنَّ بَيْتٌ فِي الْجَنَّةِ",
        translation: "Barangsiapa salat sunah 12 rakaat dalam sehari semalam, niscaya dibangunkan baginya sebuah rumah di surga.",
        description: "Mengenal ragam salat sunah penyempurna salat fardu: Salat Rawatib (Qabliyah & Ba'diyah), Salat Duha di pagi hari, dan Salat Tahajud di sepertiga malam.",
        points: [
          "Salat Rawatib terbagi menjadi Muakkad (sangat dianjurkan) dan Gairu Muakkad.",
          "Salat Duha dikerjakan saat matahari naik hingga menjelang zuhur untuk melapangkan rezeki dan kesehatan.",
          "Salat Tahajud didirikan pada malam hari setelah tidur dan memiliki kedudukan yang sangat terpuji."
        ],
        ttsText: "Salat sunah rawatib menyempurnakan salat wajib. Salat duha di pagi hari dan tahajud di sepertiga malam.",
        bossName: "Penjaga Gerbang Sunah",
        bossDesc: "Buktikan wawasanmu tentang ketentuan salat-salat sunah berbasis kasus fikih AKM!",
        quiz: [
          {
            stimulus: "Zulfa selesai mendirikan salat Magrib fardu berjamaah di musala. Setelah berzikir dan berdoa, ia berdiri kembali untuk mendirikan salat sunah 2 rakaat. Ia tahu bahwa ada salat sunah yang sangat dianjurkan (muakkad) dan ada yang gairu muakkad.",
            question: "Salat sunah 2 rakaat yang dikerjakan Zulfa setelah salat fardu Magrib tersebut dinamakan salat ...",
            options: [
              "Sunah Ba'diyah Magrib, yang berhukum Sunah Muakkad (sangat dianjurkan)",
              "Sunah Qabliyah Magrib, yang berhukum Wajib 'Ain",
              "Sunah Tahajud, yang dikerjakan menjelang waktu Isya",
              "Sunah Duha, yang dikerjakan setelah salat Magrib"
            ],
            answer: 0,
            explanation: "Salat sunah setelah fardu disebut Ba'diyah (sesudah). 2 rakaat sesudah Magrib berstatus sunah muakkad yang senantiasa dijaga Rasulullah saw.",
            hint: "Dikerjakan sesudah (ba'da) salat fardu Magrib."
          },
          {
            stimulus: "Setiap hari Jumat pukul 08.00 pagi sebelum kegiatan belajar mengajar dimulai, siswa SDN Kedungringin I Beji dibiasakan mendirikan salat Duha bersama di musala sekolah.",
            question: "Tujuan dan hikmah spiritual dari pembiasaan salat Duha bagi siswa di pagi hari adalah ...",
            options: [
              "Sebagai ungkapan syukur atas nikmat kesehatan sendi tubuh dan memohon kelapangan rezeki ilmu yang berkah",
              "Menggantikan kewajiban salat fardu Subuh yang terlewatkan",
              "Syarat utama agar dapat naik kelas secara otomatis tanpa ujian",
              "Supaya jam pelajaran di kelas berkurang dan siswa bisa bersantai"
            ],
            answer: 0,
            explanation: "Salat Duha adalah sedekah bagi 360 persendian tubuh manusia di pagi hari serta sarana memohon keberkahan ilmu dan rezeki dari Allah Swt.",
            hint: "Syukur atas kesehatan raga dan memohon kemudahan mencari rezeki/ilmu."
          },
          {
            stimulus: "Faris ingin mendirikan salat sunah Tahajud di malam hari. Ia mengatur alarm jam 03.15 pagi. Namun, sebelum tidur malam ia ragu apakah ia boleh mengerjakan salat Tahajud jika belum tidur sama sekali sejak sore.",
            question: "Berdasarkan ketentuan fikih ibadah yang tepat, syarat mendirikan salat Tahajud adalah ...",
            options: [
              "Disyaratkan harus tidur terlebih dahulu di waktu malam, walaupun hanya sebentar",
              "Boleh dikerjakan kapan saja di waktu siang tanpa perlu tidur",
              "Hanya boleh dikerjakan oleh orang tua dan terlarang bagi anak-anak",
              "Wajib dikerjakan secara berjamaah sebanyak minimal 20 orang"
            ],
            answer: 0,
            explanation: "Secara bahasa dan istilah fikih, salat Tahajud adalah salat sunah malam yang dikerjakan sesudah bangun dari tidur, meskipun tidurnya hanya sejenak.",
            hint: "Harus didahului dengan tidur di waktu malam."
          }
        ]
      },
      5: {
        title: "Kerasulan & Dakwah Periode Makkah",
        element: "Sejarah Peradaban Islam",
        fase: "Fase B",
        arabic: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
        translation: "Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan. (QS. Al-'Alaq: 1)",
        description: "Peristiwa turunnya wahyu pertama di Gua Hira pada usia 40 tahun, dakwah secara sembunyi-sembunyi (Sirriyah), hingga dakwah terang-terangan (Jahriyah).",
        points: [
          "Wahyu pertama adalah Surah al-'Alaq ayat 1-5 yang dibawa Malaikat Jibril.",
          "Orang-orang pertama yang masuk Islam disebut As-Sabiqunal Awwalun (Khadijah, Ali, Abu Bakar, Zaid).",
          "Nabi dan para sahabat menghadapi boikot dan penyiksaan kejam dari kaum kafir Quraisy dengan penuh ketabahan."
        ],
        ttsText: "Wahyu pertama turun di Gua Hira melalui Malaikat Jibril. Nabi berdakwah dengan sabar menghadapi cobaan kaum kafir Quraisy.",
        bossName: "Penjaga Gua Hira",
        bossDesc: "Ujilah sejarah perjuangan kerasulan Nabi di Makkah berbasis literasi sejarah AKM!",
        quiz: [
          {
            stimulus: "Pada usia 40 tahun, Nabi Muhammad saw. sering menyendiri (bertahannus) di Gua Hira karena prihatin melihat rusaknya moral masyarakat jahiliyah Makkah yang menyembah berhala, menindas kaum lemah, dan gemar berjudi.",
            question: "Peristiwa agung yang terjadi pada malam 17 Ramadan di Gua Hira tersebut adalah ...",
            options: [
              "Turunnya wahyu Al-Qur'an pertama (Surah al-'Alaq: 1-5) yang menandai diangkatnya beliau menjadi Rasulullah",
              "Perjalanan Isra Mi'raj dari Masjidil Haram ke Masjidil Aqsa",
              "Kemenangan umat Islam dalam peristiwa Fathu Makkah",
              "Perjanjian Hudaibiyah antara kaum muslimin dan kafir Quraisy"
            ],
            answer: 0,
            explanation: "Peristiwa Nuzulul Qur'an pertama berupa wahyu Surah al-'Alaq ayat 1-5 di Gua Hira menandai pengangkatan Nabi Muhammad saw. sebagai utusan Allah bagi seluruh alam.",
            hint: "Malaikat Jibril menyampaikan wahyu Iqra' (bacalah)."
          },
          {
            stimulus: "Pada masa dakwah secara rahasia (Sirriyah), beberapa orang terdekat langsung mempercayai risalah Nabi tanpa keraguan sedikit pun, di antaranya Siti Khadijah, Abu Bakar as-Siddiq, Ali bin Abi Talib, dan Zaid bin Haritsah.",
            question: "Karakter teladan yang ditunjukkan oleh kelompok As-Sabiqunal Awwalun tersebut adalah ...",
            options: [
              "Keimanan yang teguh, keberanian membela kebenaran, dan ketulusan berkorban di jalan tauhid",
              "Mencari keuntungan kekuasaan politik di suku Quraisy",
              "Hanya percaya jika diberi harta emas yang berlimpah oleh Nabi",
              "Menunggu apakah ajaran Islam disukai oleh mayoritas bangsawan Quraisy"
            ],
            answer: 0,
            explanation: "As-Sabiqunal Awwalun adalah teladan keteguhan iman dan keberanian memeluk kebenaran hakiki di tengah penentangan kaum musyrik Quraisy.",
            hint: "Keteguhan iman dan keberanian membela kebenaran sejak awal."
          },
          {
            stimulus: "Ketika dakwah mulai dilakukan secara terang-terangan (Jahriyah), kaum kafir Quraisy memboikot Bani Hasyim selama 3 tahun dan menyiksa sahabat lemah seperti Bilal bin Rabah dan keluarga Yasir agar murtad. Namun kaum muslimin tetap bertahan.",
            question: "Nilai luhur budi pekerti yang dapat dipetik oleh siswa zaman sekarang dari perjuangan dakwah periode Makkah adalah ...",
            options: [
              "Kesabaran dan keteguhan memegang prinsip kebenaran meski menghadapi rintangan dan celaan",
              "Mudah putus asa saat menghadapi tugas sekolah yang sulit",
              "Menyerah kepada teman yang mengajak berbuat curang atau melanggar aturan",
              "Membalas setiap celaan dengan kekerasan fisik di sekolah"
            ],
            answer: 0,
            explanation: "Perjuangan dakwah Makkah mengajarkan kita untuk sabar, tawakal, dan teguh memegang nilai kejujuran serta kebenaran meski mendapat cobaan.",
            hint: "Sabar dan teguh memegang prinsip kebaikan."
          }
        ]
      }
    },
    // KELAS 5 (FASE C)
    5: {
      1: {
        title: "Hukum Mim Sukun & Surah al-'Asr",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase C",
        arabic: "وَالْعَصْرِ • إِنَّ الْإِنسَانَ لَفِي خُسْرٍ • إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",
        translation: "Demi masa. Sungguh, manusia berada dalam kerugian, kecuali orang-orang yang beriman dan mengerjakan kebajikan.",
        description: "Memahami 3 hukum bacaan Mim Sukun: Ikhfa Syafawi (bertemu Ba), Idgam Mimi (bertemu Mim), Izhar Syafawi (bertemu huruf lainnya), serta tafsir Surah al-'Asr.",
        points: [
          "Ikhfa Syafawi: Mim sukun bertemu Ba, dibaca samar beriring dengung.",
          "Idgam Mimi/Mutamasilain: Mim sukun bertemu Mim, dibaca melebur dengan dengung.",
          "Surah al-'Asr menegaskan pentingnya memanfaatkan waktu untuk iman, amal saleh, dan saling menasihati dalam kebenaran."
        ],
        ttsText: "Hukum mim sukun ada tiga: ikhfa syafawi, idgam mimi, dan izhar syafawi. Surah al-Asr mengajarkan kita menghargai waktu.",
        bossName: "Pengawal Waktu dan Tajwid",
        bossDesc: "Tunjukkan penguasaan hukum mim sukun dan pesan Surah al-'Asr berbasis kasus AKM!",
        quiz: [
          {
            stimulus: "Saat membaca Al-Qur'an Surah Al-Fil ayat 4: 'تَرْمِيهِمْ بِحِجَارَةٍ' (tarmihim bihijarah), Farhan menemukan huruf Mim Sukun (مْ) bertemu langsung dengan huruf Ba (ب). Farhan melafalkannya dengan merapatkan bibir samar disertai dengung 2 harakat.",
            question: "Hukum bacaan mim sukun yang dipraktikkan Farhan tersebut adalah ... karena ...",
            options: [
              "Ikhfa Syafawi, karena mim sukun bertemu huruf ba dan dibaca samar di bibir dengan dengung",
              "Idgam Mimi, karena mim sukun bertemu sesama huruf mim",
              "Izhar Syafawi, karena mim sukun bertemu huruf selain ba dan mim",
              "Iklab, karena nun sukun diganti menjadi mim"
            ],
            answer: 0,
            explanation: "Ikhfa Syafawi terjadi apabila Mim Sukun (مْ) bertemu dengan huruf Ba (ب). Cara membacanya bibir dirapatkan secara lembut dan ditahan dengan dengung selama 2 harakat.",
            hint: "Mim sukun bertemu huruf Ba (ب) dibaca samar dan dengung."
          },
          {
            stimulus: "Perhatikan potongan lafal berikut:\n(1) لَهُمْ مَّا يَشَاءُونَ (lahum ma yasya'un)\n(2) أَمْ لَمْ تُنذِرْهُمْ (am lam tundzirhum)\n(3) عَلَيْهِمْ بِمُصَيْطِرٍ ('alaihim bimushaitir)\n(4) خَلَقَكُمْ مِّنْ تُرَابٍ (khalaqakum min turab)",
            question: "Manakah pasangan nomor yang keduanya menerapkan hukum bacaan Idgam Mimi / Mutamasilain?",
            options: [
              "(1) dan (4)",
              "(2) dan (3)",
              "(1) dan (3)",
              "(2) dan (4)"
            ],
            answer: 0,
            explanation: "Idgam Mimi (Mutamasilain) terjadi jika Mim Sukun (مْ) bertemu dengan huruf Mim (م). Nomor (1) lahum ma dan nomor (4) khalaqakum min sama-sama mempertemukan mim sukun dengan mim.",
            hint: "Pertemuan huruf mim sukun dengan huruf mim bertasydid."
          },
          {
            stimulus: "Dalam kehidupan sehari-hari di SDN Kedungringin I Beji, sering kita melihat ada siswa yang menunda-nunda belajar hingga larut malam hanya untuk bermain ponsel tanpa batas. Surah al-'Asr mengingatkan bahwa manusia berada dalam kerugian kecuali yang memenuhi empat pilar.",
            question: "Berdasarkan Surah al-'Asr ayat 3, empat pilar yang menyelamatkan manusia dari kerugian waktu adalah ...",
            options: [
              "Beriman, beramal saleh, saling menasihati dalam kebenaran, dan saling menasihati dalam kesabaran",
              "Mencari kekayaan, menjadi juara kelas, memenangkan pertandingan, dan menabung uang",
              "Mengerjakan tugas sendirian, tidak memedulikan teman, dan fokus pada diri sendiri",
              "Beribadah hanya saat di sekolah dan melupakan adab saat berada di rumah"
            ],
            answer: 0,
            explanation: "Surah al-'Asr ayat 3 merinci 4 syarat selamat dari kerugian: (1) beriman, (2) beramal saleh, (3) saling menasihati dalam kebenaran (tawashau bil-haqq), dan (4) saling menasihati dalam kesabaran (tawashau bis-sabr).",
            hint: "Iman, amal saleh, nasihat kebenaran, dan kesabaran."
          }
        ]
      },
      2: {
        title: "Asmaulhusna Al-Hakim & Al-Wadud",
        element: "Akidah",
        fase: "Fase C",
        arabic: "الْحَلِيمُ • الشَّكُورُ • الْحَكِيمُ • الْوَدُودُ",
        translation: "Maha Penyantun, Maha Menghargai (Pembalas Kebaikan), Maha Bijaksana, Maha Mencintai.",
        description: "Mempelajari Asmaulhusna: al-Halim (Maha Penyantun), asy-Syakur (Maha Menghargai kebaikan), al-Hakim (Maha Bijaksana), dan al-Wadud (Maha Pengasih dan Pecinta kebaikan).",
        points: [
          "Al-Hakim menunjukkan segala hukum dan ciptaan Allah sarat dengan hikmah mendalam.",
          "Al-Wadud berarti cinta kasih Allah yang tulus kepada hamba-hamba-Nya yang taat.",
          "Meneladani sifat ini dengan bersikap bijaksana dalam mengambil keputusan dan menyayangi sesama makhluk."
        ],
        ttsText: "Al-Hakim Maha Bijaksana dan Al-Wadud Maha Mencintai. Teladanilah dengan saling menyayangi sesama makhluk.",
        bossName: "Penjaga Mahkota Kebijaksanaan",
        bossDesc: "Ujilah pemahamanmu tentang nama-nama agung kebijaksanaan Allah berbasis studi kasus AKM!",
        quiz: [
          {
            stimulus: "Ketika seseorang tertimpa musibah sakit, ia mungkin merasa sedih. Namun setelah sembuh, ia menjadi lebih menjaga pola makan sehat dan semakin rajin beribadah. Ia menyadari ada kebaikan tersembunyi yang Allah rancang dengan sempurna.",
            question: "Peristiwa di atas membuktikan bahwa ketetapan Allah Swt. selalu mencerminkan asmaulhusna Al-Hakim, yang bermakna ...",
            options: [
              "Maha Bijaksana, di mana segala ciptaan dan takdir-Nya selalu sarat dengan hikmah dan kebaikan mendalam",
              "Maha Menghukum tanpa alasan yang jelas",
              "Maha Berkehendak semaunya tanpa aturan",
              "Maha Menuntut balas atas perbuatan manusia"
            ],
            answer: 0,
            explanation: "Al-Hakim bermakna Allah Maha Bijaksana. Segala takdir, perintah, dan larangan-Nya mengandung hikmah dan kemaslahatan hakiki bagi hamba-Nya.",
            hint: "Penuh dengan kebijaksanaan dan hikmah terbaik."
          },
          {
            stimulus: "Seorang ibu yang merawat bayinya di malam dingin dengan penuh kelembutan hanyalah setitik kecil dari wujud kasih sayang. Allah Swt. memiliki nama 'Al-Wadud'.",
            question: "Pernyataan yang paling tepat mendeskripsikan asmaulhusna Al-Wadud adalah ...",
            options: [
              "Allah Maha Mencintai dan Mengasihi hamba-hamba-Nya yang beriman dengan cinta yang tulus dan abadi",
              "Allah hanya mencintai hamba yang tidak pernah berbuat dosa sama sekali",
              "Cinta Allah sama persis dengan cinta manusia yang penuh pamrih",
              "Kasih sayang Allah terbatas hanya di dunia dan terputus di akhirat"
            ],
            answer: 0,
            explanation: "Al-Wadud adalah Dzat yang Maha Mencintai dan Mengasihi hamba-hamba-Nya yang saleh dengan limpahan rahmat, kebaikan, dan keridaan-Nya.",
            hint: "Maha Mencintai hamba-hamba-Nya dengan kasih murni."
          },
          {
            stimulus: "Rani berhasil meraih juara 1 lomba kaligrafi tingkat kecamatan. Teman-temannya di kelas memberikan selamat. Rani tersenyum, mengucapkan terima kasih kepada teman-temannya dan bersujud syukur kepada Allah Swt.",
            question: "Sikap Rani yang pandai berterima kasih kepada sesama dan bersyukur kepada Allah merupakan bentuk peneladanan asmaulhusna ...",
            options: [
              "Asy-Syakur (Maha Menghargai dan Membalas Kebaikan)",
              "Al-Muntaqim (Maha Membalas Kejahatan)",
              "Al-Jabbar (Maha Gagah Perkasa)",
              "Al-Mutakabbir (Maha Memiliki Kebesaran)"
            ],
            answer: 0,
            explanation: "Asy-Syakur adalah Dzat yang Maha Menghargai dan membalas kebaikan sekecil apa pun. Meneladani sifat ini dengan menjadi insan yang pandai bersyukur dan berterima kasih.",
            hint: "Berkaitan dengan sikap syukur dan pandai membalas kebaikan."
          }
        ]
      },
      3: {
        title: "Berdoa & Bertawakal kepada Allah",
        element: "Akhlak",
        fase: "Fase C",
        arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        translation: "Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. (QS. At-Talaq: 3)",
        description: "Memahami kedudukan doa sebagai intisari ibadah dan tawakal sebagai sikap berserah diri kepada Allah setelah melakukan ikhtiar yang sungguh-sungguh.",
        points: [
          "Ikhtiar (usaha maksimal) harus berjalan beriringan dengan tawakal (penyerahan hasil).",
          "Berdoa dengan adab yang baik: suci, menghadap kiblat, dan yakin dikabulkan.",
          "Hati yang bertawakal tidak akan gelisah menghadapi kegagalan dan tidak sombong saat berhasil."
        ],
        ttsText: "Tawakal adalah berserah diri kepada Allah setelah berikhtiar maksimal. Doa adalah senjata utama orang mukmin.",
        bossName: "Pengawal Perisai Tawakal",
        bossDesc: "Tunjukkan pemahamanmu mengenai ikhtiar, doa, dan tawakal berbasis studi kasus AKM!",
        quiz: [
          {
            stimulus: "Arman mengikuti seleksi lomba olimpiade sains. Selama dua bulan ia belajar dengan tekun setiap hari dan menjaga salat lima waktu. Pada hari pengumuman, Arman menyerahkan apa pun hasilnya kepada ketetapan Allah tanpa rasa cemas berlebihan.",
            question: "Sikap batin Arman yang berserah diri kepada Allah setelah berikhtiar secara optimal dinamakan ...",
            options: [
              "Tawakal, yaitu penyerahan diri yang aktif setelah ikhtiar dan doa maksimal",
              "Pasrah pasif, yaitu berdiam diri tanpa ada usaha belajar",
              "Takabur, yaitu yakin pasti menang karena merasa paling pintar",
              "Pesimis, yaitu menduga bahwa usahanya pasti akan sia-sia"
            ],
            answer: 0,
            explanation: "Tawakal bukan pasrah buta, melainkan menyerahkan keputusan dan hasil akhir kepada Allah Swt. sesudah mengerahkan seluruh daya upaya (ikhtiar) dan doa.",
            hint: "Penyerahan hasil akhir setelah berusaha sekuat tenaga."
          },
          {
            stimulus: "Rasulullah saw. bersabda: 'Doa adalah intisari (otak) ibadah.' Seseorang berdoa memohon kelulusan ujian, namun ia tidak pernah membuka buku pelajaran dan tidak pernah masuk kelas.",
            question: "Berdasarkan prinsip ajaran Islam, kekeliruan orang tersebut terletak pada ...",
            options: [
              "Memisahkan antara doa dengan ikhtiar nyata, padahal doa wajib diiringi usaha sungguh-sungguh",
              "Doanya kurang panjang bacaannya",
              "Tempat berdoa yang dipilih kurang bagus",
              "Jumlah rakaat salat yang dikerjakan terlalu sedikit"
            ],
            answer: 0,
            explanation: "Dalam ajaran Islam, doa dan ikhtiar bagaikan dua sayap burung. Berdoa tanpa berusaha adalah angan-angan kosong, sedangkan berusaha tanpa doa adalah kesombongan.",
            hint: "Doa harus berpasangan dengan kerja keras nyata."
          },
          {
            stimulus: "Dito memanjatkan doa kepada Allah Swt. Namun setelah satu minggu, apa yang ia minta belum juga terwujud. Setan membisikkan rasa putus asa agar Dito berhenti berdoa.",
            question: "Adab yang benar saat menghadapi doa yang belum kunjung tampak hasilnya adalah ...",
            options: [
              "Tetap berhusnuzan dan istiqamah berdoa, karena Allah Maha Tahu waktu dan bentuk terbaik bagi hamba-Nya",
              "Berhenti berdoa dan melampiaskan amarah kepada orang tua",
              "Menganggap Allah tidak adil dan enggan bersujud lagi",
              "Meminta pertolongan kepada dukun atau peramal nasib"
            ],
            answer: 0,
            explanation: "Rasulullah saw. mengingatkan bahwa doa seorang hamba pasti dikabulkan selama ia tidak tergesa-gesa mengatakan 'aku sudah berdoa tetapi belum dikabulkan'. Tetaplah berbaik sangka kepada Allah.",
            hint: "Tetap berbaik sangka dan sabar menanti ketetapan terbaik Allah."
          }
        ]
      },
      4: {
        title: "Puasa Wajib & Puasa Sunah",
        element: "Fikih",
        fase: "Fase C",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
        translation: "Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang-orang sebelum kamu agar kamu bertakwa. (QS. Al-Baqarah: 183)",
        description: "Ketentuan puasa Ramadan (syarat, rukun, hal membatalkan), serta amalan puasa sunah: Senin-Kamis, Ayyamul Bidh, Syawal, dan Arafah.",
        points: [
          "Puasa artinya menahan diri dari makan, minum, dan perkara yang membatalkan dari terbit fajar hingga terbenam matahari.",
          "Rukun puasa ada dua: niat di malam hari dan menahan diri (imsak).",
          "Hikmah puasa melatih kejujuran, empati kepada kaum miskin, dan menjaga kesehatan."
        ],
        ttsText: "Puasa Ramadan wajib bagi setiap muslim yang balig dan berakal. Puasa melatih ketakwaan dan kepedulian sosial.",
        bossName: "Penjaga Gerbang Rayyan",
        bossDesc: "Pecahkan ujian ketentuan puasa wajib dan sunah berbasis kasus fikih AKM!",
        quiz: [
          {
            stimulus: "Ketika berpuasa di bulan Ramadan, seorang siswa merasa sangat haus sehabis berolahraga. Ia pergi ke kamar mandi dan melihat air keran yang segar. Tidak ada satu pun guru atau teman yang melihatnya, namun ia menahan diri untuk tidak meminumnya setetes pun.",
            question: "Nilai karakter budi pekerti luhur yang terbentuk dari ibadah puasa pada situasi di atas adalah ...",
            options: [
              "Kejujuran dan integritas spiritual karena meyakini Allah Maha Melihat (Muraqabah)",
              "Rasa takut dimarahi guru piket sekolah",
              "Kebiasaan berpura-pura baik di hadapan orang lain",
              "Keinginan dipuji teman sebaya sebagai anak yang hebat"
            ],
            answer: 0,
            explanation: "Ibadah puasa adalah rahasia antara hamba dengan Tuhannya. Menahan diri saat sendiri menumbuhkan rasa muraqabatullah (merasa selalu diawasi Allah Swt.).",
            hint: "Integritas kejujuran karena yakin Allah Maha Melihat di mana pun."
          },
          {
            stimulus: "Pada bulan Zulhijah, umat Islam di seluruh dunia menyambut hari raya Iduladha. Bagi umat Islam yang tidak sedang menunaikan ibadah haji di tanah suci, disunahkan berpuasa pada tanggal 9 Zulhijah saat jamaah haji sedang wukuf.",
            question: "Puasa sunah yang dimaksud pada tanggal 9 Zulhijah tersebut adalah puasa ... yang memiliki keutamaan ...",
            options: [
              "Puasa Arafah, yang menghapuskan dosa setahun yang lalu dan setahun yang akan datang",
              "Puasa Asyura, yang menghapuskan dosa 10 tahun",
              "Puasa Syawal, yang pahalanya sama seperti puasa sebulan penuh",
              "Puasa Daud, yang dikerjakan selang satu hari"
            ],
            answer: 0,
            explanation: "Puasa hari Arafah (9 Zulhijah) disunahkan bagi muslim yang tidak berhaji. Keutamaannya menghapuskan dosa kecil setahun sebelum dan setahun sesudahnya.",
            hint: "Puasa di hari wukuf Arafah tanggal 9 Zulhijah."
          },
          {
            stimulus: "Seorang musafir sedang melakukan perjalanan jauh dari Surabaya menuju Jakarta menggunakan kereta api di siang hari bulan Ramadan. Karena kondisi fisiknya sangat lemah dan lelah, ia merasa kesulitan melanjutkan puasanya.",
            question: "Berdasarkan hukum fikih Islam, rukhsah (keringanan) yang diberikan syariat kepada musafir tersebut adalah ...",
            options: [
              "Boleh berbuka puasa, namun wajib mengganti (mengqada) puasanya di hari lain di luar bulan Ramadan",
              "Tetap dipaksa berpuasa sampai pingsan karena musafir tidak mendapat keringanan",
              "Puasanya gugur dan tidak perlu mengganti puasa sama sekali",
              "Wajib membayar denda memerdekakan budak seketika"
            ],
            answer: 0,
            explanation: "Surah Al-Baqarah ayat 184 menyatakan bahwa orang yang sakit atau sedang dalam perjalanan (musafir) diperbolehkan tidak berpuasa dan wajib menggantinya (qada) sebanyak hari yang ditinggalkan.",
            hint: "Boleh membatalkan tetapi wajib mengqada (mengganti) di hari lain."
          }
        ]
      },
      5: {
        title: "Kepemimpinan Nabi di Madinah",
        element: "Sejarah Peradaban Islam",
        fase: "Fase C",
        arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ",
        translation: "Sesungguhnya orang-orang mukmin itu bersaudara, karena itu damaikanlah antara kedua saudaramu. (QS. Al-Hujurat: 10)",
        description: "Strategi kepemimpinan Rasulullah saw. di Madinah: Membangun Masjid Nabawi, mempersaudarakan kaum Muhajirin dan Ansar, serta merumuskan Piagam Madinah.",
        points: [
          "Masjid Nabawi berfungsi sebagai pusat ibadah, musyawarah, pendidikan, dan pemerintahan.",
          "Mempersaudarakan Muhajirin (pendatang dari Makkah) dengan Ansar (penduduk asli Madinah) atas dasar iman.",
          "Piagam Madinah adalah konstitusi tertulis pertama yang menjamin kebebasan beragama dan persatuan antarumat."
        ],
        ttsText: "Nabi mempersaudarakan Muhajirin dan Ansar di Madinah serta membuat Piagam Madinah untuk persatuan seluruh warga.",
        bossName: "Duta Piagam Madinah",
        bossDesc: "Ujilah pengetahuan sejarah kepemimpinan teladan Rasulullah di Madinah berbasis literasi sejarah AKM!",
        quiz: [
          {
            stimulus: "Ketika kaum muslimin Makkah berhijrah ke Madinah (kaum Muhajirin), sebagian besar dari mereka meninggalkan seluruh harta benda, rumah, dan perniagaan di Makkah. Setibanya di Madinah, Rasulullah saw. mengambil langkah strategis sosial.",
            question: "Langkah brilian yang diambil Rasulullah saw. untuk menyelesaikan masalah ekonomi dan sosial kaum Muhajirin adalah ...",
            options: [
              "Mempersaudarakan kaum Muhajirin dan kaum Ansar atas dasar ikatan akidah dan saling tolong menolong",
              "Meminta bantuan utang uang berbunga kepada pedagang Yahudi Madinah",
              "Menyuruh kaum Muhajirin kembali ke Makkah untuk mengambil harta mereka secara sembunyi",
              "Mengusir penduduk asli Madinah agar rumahnya bisa ditempati kaum Muhajirin"
            ],
            answer: 0,
            explanation: "Rasulullah saw. mempersaudarakan kaum Muhajirin dan Ansar, sehingga kaum Ansar dengan tulus membagi rumah, tanah, dan modal usaha kepada saudara seimannya.",
            hint: "Mempersaudarakan kaum Muhajirin dengan Ansar."
          },
          {
            stimulus: "Kota Madinah dihuni oleh masyarakat yang majemuk (plural), terdiri dari suku Aus, Khazraj, kaum Muhajirin, serta kabilah-kabilah Yahudi seperti Bani Qainuqa, Bani Nadir, dan Bani Quraizhah. Nabi merumuskan sebuah perjanjian tertulis yang disebut Piagam Madinah.",
            question: "Prinsip utama yang termaktub dalam Piagam Madinah sebagai konstitusi modern pertama di dunia adalah ...",
            options: [
              "Jaminan kebebasan beragama, kesetaraan hak di hadapan hukum, dan kewajiban bersama membela kota Madinah",
              "Pemberlakuan hukum yang menguntungkan satu suku saja",
              "Kewajiban seluruh warga Madinah untuk pindah agama secara paksa",
              "Larangan bagi warga non-muslim untuk tinggal di dalam kota Madinah"
            ],
            answer: 0,
            explanation: "Piagam Madinah meletakkan dasar toleransi beragama, keadilan hukum, dan persatuan pertahanan bersama tanpa memandang suku atau agama.",
            hint: "Kebebasan beragama, keadilan hukum, dan persatuan warga."
          },
          {
            stimulus: "Masjid Nabawi yang dibangun dengan kesederhanaan tiang pohon kurma dan atap pelepah kurma tidak hanya difungsikan untuk mendirikan salat fardu berjamaah.",
            question: "Fungsi multifungsi Masjid Nabawi pada zaman Rasulullah saw. yang relevan dicontoh dalam pengelolaan musala sekolah saat ini adalah ...",
            options: [
              "Sebagai pusat pembinaan akhlak, musyawarah memecahkan masalah, dan pusat pendidikan ilmu pengetahuan",
              "Sebagai tempat tidur dan bersantai saat jam pelajaran berlangsung",
              "Sebagai tempat berniaga jual beli barang dagangan untuk mencari untung",
              "Sebagai tempat membeda-bedakan status sosial siswa kaya dan miskin"
            ],
            answer: 0,
            explanation: "Masjid Nabawi adalah pusat peradaban: tempat salat, tempat belajar (Ahlus Suffah), tempat musyawarah, dan penyelesaian sengketa masyarakat.",
            hint: "Pusat ibadah, pembinaan karakter, musyawarah, dan pendidikan."
          }
        ]
      }
    },
    // KELAS 6 (FASE C) - MATERI & BANK 10 SOAL AKM RESMI: Q.S. AD-DUHA, Q.S. AL-INSYIRAH & HUKUM BACAAN GUNNAH
    6: {
      1: {
        title: "Q.S. ad-Duha, Q.S. al-Insyirah & Hukum Bacaan Gunnah",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase C",
        arabic: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ • فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Maka terhadap anak yatim janganlah engkau berlaku sewenang-wenang (QS. Ad-Duha: 9) • Maka sesungguhnya beserta kesulitan ada kemudahan (QS. Al-Insyirah: 5).",
        description: "Mempelajari bacaan, arti, dan pesan pokok Q.S. ad-Duha (11 ayat), Q.S. al-Insyirah (8 ayat), serta penerapan hukum bacaan tajwid Gunnah Musyaddadah (Nun bertasydid نّ dan Mim bertasydid مّ) dalam kehidupan sehari-hari.",
        points: [
          "Q.S. ad-Duha (11 ayat, Makkiyah): Ad-Duha artinya waktu matahari sepenggalahan naik (pagi). Allah menegaskan tidak meninggalkan Nabi Muhammad saw., memerintahkan menyayangi anak yatim, tidak menghardik peminta-minta, dan mensyukuri nikmat Allah.",
          "Q.S. al-Insyirah (8 ayat, Makkiyah): Al-Insyirah artinya melapangkan dada. Mengajarkan bahwa bersama setiap kesulitan selalu ada kemudahan (ayat 5-6), disiplin terus berkarya setelah selesai suatu urusan (ayat 7), dan hanya berharap kepada Allah (ayat 8).",
          "Hukum Bacaan Gunnah (Gunnah Musyaddadah): Apabila terdapat huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ), wajib dibaca mendengung jelas keluar dari pangkal hidung (al-khaisyum) selama 2 harakat (ketukan).",
          "Contoh Gunnah di kedua surah: فَأَمَّا الْيَتِيمَ dan وَأَمَّا السَّائِلَ (Mim bertasydid di Q.S. ad-Duha), serta فَإِنَّ مَعَ الْعُسْرِ dan إِنَّ مَعَ الْعُسْرِ (Nun bertasydid di Q.S. al-Insyirah)."
        ],
        ttsText: "Materi PAI Kelas 6 Al-Qur'an dan Hadis membahas Surah ad-Duha, Surah al-Insyirah, dan hukum bacaan Gunnah. Surah ad-Duha terdiri atas sebelas ayat yang mengajarkan syukur dan kasih sayang kepada anak yatim. Surah al-Insyirah terdiri atas delapan ayat yang mengajarkan ketabahan karena bersama kesulitan ada kemudahan. Sedangkan hukum bacaan Gunnah berlaku pada huruf nun bertasydid dan mim bertasydid yang dibaca mendengung dua harakat melalui pangkal hidung.",
        bossName: "Rintangan Pemahaman: Q.S. ad-Duha, al-Insyirah & Gunnah",
        bossDesc: "Taklukkan 10 soal AKM Q.S. ad-Duha, Q.S. al-Insyirah, dan Hukum Bacaan Gunnah dengan Pesawat 3D!",
        forestGates: GRADE6_STAGE1_FOREST_GATES,
        quiz: [
          // 1. MUDAH (10%)
          {
            difficulty: "mudah",
            stimulus: "[AKM Mudah • Mengenal Q.S. ad-Duha]\nSetiap pagi sebelum belajar di SDN Kedungringin I Beji, siswa kelas 6 bersama-sama membaca Q.S. ad-Duha yang terdiri atas 11 ayat dan termasuk golongan surah Makkiyah.",
            question: "Arti dari nama Surah 'ad-Duha' (الضُّحَىٰ) yang menjadi sumpah Allah pada ayat pertama adalah...",
            options: [
              "Waktu matahari sepenggalahan naik (waktu pagi)",
              "Waktu malam ketika gelap gulita",
              "Waktu terbenamnya matahari di sore hari",
              "Waktu fajar sebelum terbit matahari"
            ],
            answer: 0,
            explanation: "Ad-Duha artinya waktu matahari sepenggalahan naik di pagi hari, saat cahaya mulai terang dan aktivitas penuh semangat dimulai.",
            hint: "Waktu pelaksanaan salat sunah Duha di pagi hari."
          },
          // 2. SEDANG (60% - 1/6)
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Tajwid Hukum Bacaan Gunnah]\nPerhatikan dua potongan ayat berikut:\n(1) فَإِنَّ مَعَ الْعُسْرِ يُسْرًا (Q.S. al-Insyirah: 5)\n(2) فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ (Q.S. ad-Duha: 9)\nPada lafaz فَإِنَّ terdapat Nun bertasydid (نّ) dan pada lafaz فَأَمَّا terdapat Mim bertasydid (مّ).",
            question: "Hukum bacaan tajwid pada huruf Nun bertasydid (نّ) dan Mim bertasydid (مّ) beserta cara membacanya yang tepat adalah...",
            options: [
              "Gunah Musyaddadah, dibaca mendengung dari pangkal hidung selama 2 harakat",
              "Izhar Halqi, dibaca jelas dan pendek tanpa suara dengung",
              "Qalqalah Kubra, dibaca memantul kuat di akhir ayat",
              "Mad Tabii, dibaca memanjang tanpa melalui rongga hidung"
            ],
            answer: 0,
            explanation: "Huruf Nun bertasydid (نّ) dan Mim bertasydid (مّ) merupakan hukum bacaan Gunnah (Gunnah Musyaddadah) yang wajib dibaca mendengung melalui pangkal hidung (al-khaisyum) sepanjang 2 harakat.",
            hint: "Gunnah selalu ditandai tasydid pada huruf Nun atau Mim dengan bunyi dengung 2 ketukan."
          },
          // 3. SEDANG (60% - 2/6)
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Asbabun Nuzul Q.S. ad-Duha]\nKetika wahyu sempat terhenti turun beberapa waktu (fatratul wahyi), kaum musyrikin Quraisy mengejek bahwa Tuhan telah meninggalkan dan membenci Nabi Muhammad saw. Allah Swt. pun menurunkan Q.S. ad-Duha ayat 3: مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ.",
            question: "Pesan penenang hati yang ditegaskan Allah Swt. dalam Q.S. ad-Duha ayat 3 tersebut adalah...",
            options: [
              "Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak pula membencimu",
              "Wahyu Al-Qur'an telah selesai diturunkan seluruhnya di Makkah",
              "Nabi Muhammad saw. diperintahkan membalas ejekan kaum Quraisy",
              "Kehidupan dunia lebih utama dibandingkan kehidupan akhirat"
            ],
            answer: 0,
            explanation: "Ayat ke-3 Q.S. ad-Duha menghibur Nabi Muhammad saw. dan umat beriman bahwa Allah Swt. tidak pernah meninggalkan maupun membenci hamba-Nya yang taat.",
            hint: "Perhatikan kata 'ma wadda'aka' (tidak meninggalkanmu) dan 'ma qala' (tidak membencimu)."
          },
          // 4. SEDANG (60% - 3/6)
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Pengamalan Q.S. ad-Duha Ayat 9-10]\nDi kelas 6 ada seorang siswa baru yang ayahnya telah wafat (anak yatim). Suatu hari, ia lupa membawa penggaris dan dengan sopan meminjam kepada teman sebangkunya.",
            question: "Sikap yang paling sesuai dengan perintah Q.S. ad-Duha ayat 9 (فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ) dan ayat 10 (وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ) adalah...",
            options: [
              "Meminjamkan penggaris dengan ramah, menghiburnya, dan memperlakukannya penuh kasih sayang",
              "Menolaknya dengan suara keras agar ia jera dan tidak lupa lagi",
              "Meminjamkan penggaris tetapi sambil menyindir di depan kelas",
              "Membiarkannya saja dan pura-pura tidak mendengar permintaannya"
            ],
            answer: 0,
            explanation: "Q.S. ad-Duha ayat 9 melarang berlaku sewenang-wenang kepada anak yatim, dan ayat 10 melarang menghardik orang yang meminta bantuan.",
            hint: "Pilih sikap santun, menyayangi anak yatim, dan tidak membentak orang yang meminta."
          },
          // 5. SEDANG (60% - 4/6)
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Makna Q.S. ad-Duha Ayat 11]\nAyat penutup Q.S. ad-Duha berbunyi: وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ (Dan terhadap nikmat Tuhanmu, hendaklah engkau nyatakan dengan bersyukur).",
            question: "Wujud nyata mengamalkan Q.S. ad-Duha ayat 11 bagi seorang siswa kelas 6 yang meraih prestasi dan kecukupan rezeki adalah...",
            options: [
              "Mengucap Alhamdulillah, tetap rendah hati, dan berbagi ilmu atau sedekah kepada sesama",
              "Memamerkan nilai dan barang mahal agar dipuji teman-teman",
              "Menyembunyikan kemampuan belajarnya agar tidak dimintai bantuan teman",
              "Merasa semua keberhasilan murni karena kehebatan diri sendiri"
            ],
            answer: 0,
            explanation: "Menyatakan nikmat Allah (tahadduts bin-ni'mah) diwujudkan dengan syukur lisan, rendah hati, serta memanfaatkan nikmat untuk membantu sesama.",
            hint: "Syukur nikmat dilakukan dengan rendah hati dan berbagi manfaat, bukan riya."
          },
          // 6. SEDANG (60% - 5/6)
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Memahami Q.S. al-Insyirah Ayat 1-4]\nDalam Q.S. al-Insyirah ayat 1-4, Allah Swt. mengingatkan nikmat-nikmat besar yang telah dianugerahkan kepada Nabi Muhammad saw., diawali dengan ayat أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ.",
            question: "Tiga nikmat utama yang Allah Swt. sebutkan pada ayat 1 hingga 4 Q.S. al-Insyirah secara berurutan adalah...",
            options: [
              "Melapangkan dada, meringankan beban berat, dan meninggikan sebutan nama beliau",
              "Memberikan kekayaan istana, pasukan besar, dan umur panjang",
              "Menurunkan hujan lebat, kebun yang subur, dan hewan ternak",
              "Memberikan mukjizat membelah laut dan menyembuhkan orang sakit"
            ],
            answer: 0,
            explanation: "Q.S. al-Insyirah ayat 1-4 menguraikan 3 karunia Allah: kelapangan dada (ayat 1), diringankannya beban (ayat 2-3), dan ditinggikannya sebutan nama Nabi (ayat 4).",
            hint: "Nasyrah laka sadrak = melapangkan dadamu; warafa'na laka dzikrak = meninggikan sebutanmu."
          },
          // 7. SEDANG (60% - 6/6)
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Kontekstual Q.S. al-Insyirah Ayat 5-6]\nRafi, siswa Kelas 6 SDN Kedungringin I Beji, sempat gagal menyelesaikan latihan soal ujian sekolah dan merasa cemas. Guru mengingatkannya pada Q.S. al-Insyirah ayat 5-6: فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا.",
            question: "Makna optimisme dan tindakan terbaik bagi Rafi berdasarkan pengulangan ayat 5 dan 6 Q.S. al-Insyirah tersebut adalah...",
            options: [
              "Tetap tenang, berdoa, dan terus berlatih karena di balik satu kesulitan Allah siapkan banyak kemudahan",
              "Berhenti belajar dan memilih menyalin jawaban teman saat ujian",
              "Menyerah karena menganggap dirinya tidak berbakat dalam pelajaran tersebut",
              "Menyalahkan soal latihan yang dianggap terlalu rumit"
            ],
            answer: 0,
            explanation: "Pengulangan ayat 5-6 menegaskan bahwa satu kesulitan (al-'usri) selalu diiringi banyak kemudahan (yusran) bagi hamba yang sabar dan tekun berikhtiar.",
            hint: "Pesan utamanya adalah pantang putus asa dan percaya pertolongan Allah setelah usaha."
          },
          // 8. SULIT (30% - 1/3)
          {
            difficulty: "sulit",
            stimulus: "[AKM Sulit • Analisis Tajwid Gunnah Lintas Surah]\nPerhatikan empat potongan ayat dari Q.S. ad-Duha dan Q.S. al-Insyirah berikut:\n(1) وَالضُّحَىٰ  (2) فَأَمَّا الْيَتِيمَ  (3) فَإِنَّ مَعَ الْعُسْرِ  (4) فَلَا تَقْهَرْ",
            question: "Pasangan nomor lafaz yang sama-sama mengandung hukum bacaan Gunnah Musyaddadah sehingga wajib dibaca dengung 2 harakat adalah...",
            options: [
              "Nomor (2) dan (3) karena mengandung huruf Mim bertasydid (مّ) dan Nun bertasydid (نّ)",
              "Nomor (1) dan (2) karena keduanya memiliki tanda tasydid di awal kata",
              "Nomor (3) dan (4) karena berada di akhir ayat surah Makkiyah",
              "Nomor (1) dan (4) karena dibaca jelas tanpa dengung"
            ],
            answer: 0,
            explanation: "Meski وَالضُّحَىٰ memiliki tasydid pada huruf Dhad (ضّ), itu adalah Alif Lam Syamsiyah bukan Gunnah. Gunnah Musyaddadah khusus terjadi pada Mim bertasydid (فَأَمَّا) dan Nun bertasydid (فَإِنَّ).",
            hint: "Hati-hati pengecoh! Tidak semua tasydid adalah Gunnah; khusus huruf Nun (نّ) dan Mim (مّ) saja."
          },
          // 9. SULIT (30% - 2/3)
          {
            difficulty: "sulit",
            stimulus: "[AKM Sulit • Evaluasi & Refleksi Q.S. al-Insyirah Ayat 7-8]\nPerhatikan dua ayat terakhir Q.S. al-Insyirah:\nفَإِذَا فَرَغْتَ فَانصَبْ (7) وَإِلَىٰ رَبِّكَ فَارْغَبْ (8)\nSetelah selesai mengerjakan seluruh ujian semester, Dika langsung bermain gim berjam-jam hingga lupa salat Asar, sementara Zahra beristirahat secukupnya lalu tadarus, membantu ibu, dan berdoa memohon hasil terbaik.",
            question: "Evaluasi yang paling tepat terhadap perilaku Dika dan Zahra menurut pesan Q.S. al-Insyirah ayat 7 dan 8 adalah...",
            options: [
              "Zahra mengamalkan ayat 7-8 dengan mengisi waktu luang secara produktif dan menggantungkan harapan hanya kepada Allah, sedangkan Dika lalai memanfaatkan waktu",
              "Dika sudah benar karena ayat 7 memerintahkan beristirahat total tanpa batas setelah ujian selesai",
              "Keduanya belum tepat karena setelah selesai ujian siswa wajib terus belajar tanpa tidur",
              "Zahra kurang tepat karena membantu orang tua tidak termasuk ibadah dalam ayat 7"
            ],
            answer: 0,
            explanation: "Ayat 7 mengajarkan etos kerja berkelanjutan (tidak menyia-nyiakan waktu luang setelah satu urusan selesai), dan ayat 8 mengajarkan tawakal penuh hanya kepada Allah Swt.",
            hint: "Bandingkan siapa yang memanfaatkan waktu luang untuk amal produktif dan berserah diri kepada Allah."
          },
          // 10. SULIT (30% - 3/3)
          {
            difficulty: "sulit",
            stimulus: "[AKM Sulit • Sintesis Nilai Q.S. ad-Duha & Q.S. al-Insyirah]\nPanitia kelas 6 mengadakan bakti sosial untuk anak yatim dan warga kurang mampu. Di tengah persiapan, turun hujan deras sehingga beberapa anggota panitia panik dan ingin membatalkan acara. Ketua kelas menenangkan teman-temannya, mengajak berdoa, mencari aula terdekat, dan tetap menyalurkan bantuan dengan ramah.",
            question: "Bagaimana tindakan ketua kelas tersebut memadukan nilai utama Q.S. ad-Duha dan Q.S. al-Insyirah secara utuh?",
            options: [
              "Memadukan kasih sayang pada anak yatim & syukur nikmat (Q.S. ad-Duha) dengan kelapangan dada, solusi di balik kesulitan, dan tawakal kepada Allah (Q.S. al-Insyirah)",
              "Hanya mengamalkan Q.S. ad-Duha saja karena kegiatan tersebut dilakukan pada pagi hari",
              "Hanya mengamalkan hukum Gunnah karena panitia membaca doa bersama dengan suara keras",
              "Menunjukkan bahwa kegiatan sosial sebaiknya ditunda sampai tidak ada hambatan sama sekali"
            ],
            answer: 0,
            explanation: "Q.S. ad-Duha menanamkan kepedulian sosial (yatim & duafa) dan syukur nikmat, sedangkan Q.S. al-Insyirah melatih kelapangan hati, ketangguhan mencari solusi saat sulit, serta tawakal kepada Allah Swt.",
            hint: "Gabungkan pesan sosial/syukur dari Q.S. ad-Duha dengan pesan ketabahan/tawakal dari Q.S. al-Insyirah."
          }
        ]
      },
      2: {
        title: "Asmaulhusna: Al-Waliy, Al-Hamid, Al-'Adl, As-Sabur",
        element: "Akidah",
        fase: "Fase C",
        arabic: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا يُخْرِجُهُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ",
        translation: "Allah adalah Pelindung orang-orang yang beriman; Dia mengeluarkan mereka dari kegelapan kepada cahaya. (QS. Al-Baqarah: 257)",
        description: "Meneladani sifat Asmaulhusna: Al-Waliy (Maha Melindungi), Al-Hamid (Maha Terpuji), Al-'Adl (Maha Adil mutlak), dan As-Sabur (Maha Penyabar).",
        points: [
          "Al-Waliy: Pelindung sejati orang-orang beriman dari tipu daya keburukan.",
          "Al-'Adl: Allah menempatkan segala sesuatu secara adil tanpa ada kezaliman sedikit pun.",
          "Al-Hamid: Segala puji hanya milik Allah, mendidik hamba-Nya senantiasa bersyukur.",
          "As-Sabur: Mengajarkan kesabaran dalam menghadapi proses hidup dan tidak mudah terburu-buru."
        ],
        ttsText: "Al-Waliy Maha Melindungi, Al-Adl Maha Adil, Al-Hamid Maha Terpuji, dan As-Sabur Maha Sabar.",
        bossName: "Pengawal Pilar Ketauhidan",
        bossDesc: "Kalahkan Bos Akidah melalui pemahaman mendalam 4 Asmaulhusna agung!",
        quiz: [
          {
            stimulus: "[Level 1: Memahami - Makna Asmaulhusna]\nSeorang mukmin meyakini bahwa Allah Maha Melindungi dan Menolong hamba-hamba-Nya yang beriman ketika mereka berada dalam kesulitan.",
            question: "Asmaulhusna yang memiliki arti 'Maha Melindungi / Maha Menolong' adalah...",
            options: ["Al-Waliy", "Al-Mumit", "Al-Baqi", "Al-Muqtadir"],
            answer: 0,
            explanation: "Al-Waliy artinya Maha Melindungi dan Maha Mengurusi segala urusan hamba-Nya yang beriman.",
            hint: "Pelindung dan penolong kaum beriman."
          },
          {
            stimulus: "[Level 2: Menerapkan - Studi Kasus Keadilan]\nSebagai ketua kelompok belajar PAI di SDN Kedungringin I Beji, Farhan membagi tugas proyek membuat mading islami kepada 4 anggotanya.",
            question: "Penerapan meneladani sifat Al-'Adl (Maha Adil) yang paling tepat dilakukan Farhan adalah...",
            options: [
              "Memberikan semua tugas menulis dan menggambar kepada anggota yang paling pintar",
              "Membagi tugas secara proporsional sesuai kemampuan dan bakat masing-masing anggota secara musyawarah",
              "Mengerjakan sendiri seluruh tugas mading agar nilainya sempurna",
              "Memberikan tugas paling banyak kepada anggota yang tidak ia sukai"
            ],
            answer: 1,
            explanation: "Adil (Al-'Adl) adalah menempatkan sesuatu pada tempatnya secara proporsional dan bijaksana.",
            hint: "Membagi tugas secara proporsional dan bijak sesuai kemampuan."
          },
          {
            stimulus: "[Level 3: Merefleksi - Hikmah As-Sabur]\nDalam kehidupan sehari-hari, seorang siswa sering kali menghadapi antrean panjang di kantin atau hasil ulangan yang belum memuaskan meski telah belajar sungguh-sungguh.",
            question: "Refleksi nilai As-Sabur (Maha Penyabar) yang membentuk kedewasaan emosional siswa tersebut adalah...",
            options: [
              "Mengamuk dan menyalahkan petugas kantin serta guru yang mengoreksi",
              "Mampu menahan amarah, tertib mengantre, dan mengoreksi kesalahan belajar dengan ikhlas",
              "Menyerobot antrean karena terburu-buru lapar",
              "Mengurung diri dan tidak mau masuk sekolah lagi"
            ],
            answer: 1,
            explanation: "Meneladani As-Sabur melahirkan disiplin, ketenangan jiwa, dan pengendalian diri dari nafsu amarah.",
            hint: "Mengendalikan diri, sabar mengantre, dan tabah belajar dari kesalahan."
          }
        ]
      },
      3: {
        title: "Toleransi & Akhlak kepada Tetangga",
        element: "Akhlak",
        fase: "Fase C",
        arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ • مَن كَانَ يُؤْمِنُ بِاللَّهِ فَلْيُكْرِمْ جَارَهُ",
        translation: "Untukmu agamamu, dan untukku agamaku. (QS. Al-Kafirun: 6) • Barangsiapa beriman kepada Allah, hendaklah memuliakan tetangganya. (HR. Bukhari)",
        description: "Adab bertetangga (muslim dan non-muslim), batas-batas toleransi beragama (Tasamuh), serta etika bermedia sosial menghindari hoaks dan fitnah.",
        points: [
          "Hak Tetangga: Memberikan salam, menjenguk bila sakit, membantu saat tertimpa musibah, dan tidak mengganggu kenyamanan mereka.",
          "Prinsip Tasamuh: Menghormati perayaan keagamaan orang lain tanpa mengikuti ritual ibadah mereka ('Lakum dinukum waliyadin').",
          "Tabayun di Era Digital: Memeriksa kebenaran berita sebelum menyebarkan agar tidak menimbulkan adu domba di lingkungan warga."
        ],
        ttsText: "Memuliakan tetangga adalah tanda keimanan. Bersikap toleran dalam bingkai kerukunan Bhinneka Tunggal Ika.",
        bossName: "Duta Kerukunan Warga",
        bossDesc: "Hadapi ujian akhlak mulia dalam bertetangga, toleransi, dan tabayun bermedsos!",
        quiz: [
          {
            stimulus: "[Level 1: Memahami - Konsep Tasamuh]\nIslam mengajarkan umatnya untuk saling menghargai dan menghormati perbedaan keyakinan dalam kehidupan bermasyarakat.",
            question: "Istilah dalam ajaran Islam yang merujuk pada sikap toleransi dan lapang dada adalah...",
            options: ["Tasamuh", "Tawaduk", "Tawakal", "Ta'awun"],
            answer: 0,
            explanation: "Tasamuh adalah sikap tenggang rasa, lapang dada, dan toleransi sosial antar sesama manusia.",
            hint: "Sikap toleransi dalam bahasa Arab."
          },
          {
            stimulus: "[Level 2: Menerapkan - Tetangga Berbeda Keyakinan]\nPak Wayan adalah tetangga sebelah rumah Budi di Desa Kedungringin yang beragama Hindu. Saat hari raya Nyepi, keluarga Pak Wayan sedang menjalankan ibadah keheningan di rumahnya.",
            question: "Sikap Budi dan keluarganya yang paling tepat sesuai adab toleransi Islam adalah...",
            options: [
              "Menyetel musik dengan pengeras suara di depan rumah Pak Wayan",
              "Menjaga ketenangan lingkungan, tidak membuat kebisingan, dan menghormati ibadah mereka",
              "Ikut serta menyalakan dupa di dalam rumah Pak Wayan",
              "Melarang Pak Wayan merayakan hari rayanya"
            ],
            answer: 1,
            explanation: "Toleransi dalam Islam diwujudkan dengan menjaga kenyamanan dan tidak mengganggu tetangga yang beribadah, tanpa mencampuradukkan akidah.",
            hint: "Menjaga ketenangan dan menghormati tanpa mencampuri ritual akidah."
          },
          {
            stimulus: "[Level 3: Merefleksi - Etika Tabayun]\nSebuah pesan berantai menyebar di grup WhatsApp warga Kedungringin yang menyatakan bahwa ada warga baru yang berniat mencuri di masjid, padahal berita tersebut belum tentu benar.",
            question: "Langkah reflektif dan bijaksana seorang siswa berakhlak mulia menghadapi berita tersebut adalah...",
            options: [
              "Langsung meneruskan (forward) pesan itu ke semua grup agar viral",
              "Melakukan tabayun (klarifikasi dan konfirmasi) kepada pengurus RT/takmir serta tidak menyebarkan fitnah",
              "Mengajak teman-teman untuk mengusir warga baru tersebut",
              "Membuat status media sosial untuk menakut-nakuti warga"
            ],
            answer: 1,
            explanation: "Surah al-Hujurat ayat 6 memerintahkan tabayun (cek dan ricek kebenaran berita) sebelum bertindak agar tidak merugikan orang lain.",
            hint: "Klarifikasi (tabayun) dan hindari menyebarkan isu sebelum terbukti benar."
          }
        ]
      },
      4: {
        title: "Zakat, Infak, Sedekah (ZIS) & Wakaf",
        element: "Fikih",
        fase: "Fase C",
        arabic: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا",
        translation: "Sesungguhnya zakat itu hanyalah untuk orang-orang fakir, orang miskin, amil zakat... (QS. At-Taubah: 60)",
        description: "Ketentuan Fikih Zakat Fitrah (2,5 kg / 3,5 liter beras), Zakat Mal (nisab 85 gram emas, haul 1 tahun, kadar 2,5%), Infak, Sedekah, serta 8 Golongan Mustahik.",
        points: [
          "Zakat Fitrah: Wajib bagi setiap jiwa muslim yang menemui sebagian Ramadan dan Syawal, berfungsi menyucikan jiwa.",
          "Zakat Mal: Dikeluarkan atas harta yang berkembang dan mencapai nisab serta haul guna membersihkan harta dan membantu fakir miskin.",
          "8 Golongan Penerima Zakat: Fakir, Miskin, Amil, Mualaf, Riqab, Garimin, Fisabilillah, Ibnu Sabil."
        ],
        ttsText: "Zakat fitrah menyucikan jiwa, zakat mal membersihkan harta. Tunaikan zakat kepada delapan golongan mustahik.",
        bossName: "Bendahara Baitul Mal Pasuruan",
        bossDesc: "Buktikan kemahiran fikih zakat, perhitungan nisab, dan kemaslahatan umat!",
        quiz: [
          {
            stimulus: "[Level 1: Memahami - Ketentuan Zakat Fitrah]\nSetiap menjelang hari raya Idulfitri, panitia zakat di SDN Kedungringin I Beji mengumpulkan zakat fitrah dari para murid dan guru.",
            question: "Besaran makanan pokok (beras) yang wajib dikeluarkan untuk zakat fitrah per jiwa adalah...",
            options: [
              "2,5 kg atau 3,5 liter beras",
              "1,0 kg atau 1,5 liter beras",
              "5,0 kg atau 7,0 liter beras",
              "10 kg beras super"
            ],
            answer: 0,
            explanation: "Kadar zakat fitrah menurut mayoritas ulama dan ketentuan BAZNAS adalah 1 sha' setara 2,5 kg atau 3,5 liter beras pokok.",
            hint: "Ukuran standar zakat fitrah adalah 2,5 kg beras."
          },
          {
            stimulus: "[Level 2: Menerapkan - Studi Kasus Zakat Mal]\nPak Harun, seorang pengusaha tambak di Beji, memiliki tabungan emas murni seberat 90 gram yang telah ia simpan selama genap satu tahun (haul). Nisab emas adalah 85 gram dengan tarif zakat 2,5%.",
            question: "Kewajiban fikih yang harus dilakukan Pak Harun atas tabungan emasnya adalah...",
            options: [
              "Tidak wajib zakat karena belum mencapai 100 gram",
              "Wajib mengeluarkan zakat mal sebesar 2,5% dari 90 gram emas (2,25 gram emas / senilai uangnya)",
              "Cukup bersedekah senyum kepada tetangga",
              "Wajib memberikan seluruh 90 gram emas kepada masjid"
            ],
            answer: 1,
            explanation: "Karena telah melebihi nisab (90 gr > 85 gr) dan genap haul 1 tahun, Pak Harun wajib mengeluarkan zakat mal 2,5% = 2,25 gram emas.",
            hint: "Telah mencapai nisab (85g) dan haul, zakatnya 2,5%."
          },
          {
            stimulus: "[Level 3: Merefleksi - Zakat Produktif & Pengentasan Kemiskinan]\nBaitul Mal SDN Kedungringin bekerja sama dengan BAZNAS mendistribusikan dana zakat tidak hanya berupa sembako konsumtif, tetapi juga memberikan beasiswa dan modal usaha gerobak jualan untuk mustahik.",
            question: "Refleksi kemaslahatan dari program zakat produktif tersebut bagi kehidupan sosial adalah...",
            options: [
              "Membuat mustahik menjadi bergantung terus-menerus pada bantuan",
              "Memberdayakan ekonomi keluarga mustahik sehingga di masa depan dapat mandiri dan menjadi muzakki (pemberi zakat)",
              "Menghabiskan dana kas zakat tanpa hasil yang jelas",
              "Mendorong orang malas untuk meminta-minta zakat"
            ],
            answer: 1,
            explanation: "Zakat produktif bertujuan mentransformasikan kaum mustahik menjadi mandiri dan berdaya hingga kelak mampu menjadi muzakki.",
            hint: "Memberdayakan mustahik agar mandiri dan kelak bisa menjadi muzakki."
          }
        ]
      },
      5: {
        title: "Perjuangan Khulafaur Rasyidin: Abu Bakar & Umar bin Khattab",
        element: "Sejarah Peradaban Islam",
        fase: "Fase C",
        arabic: "أَصْحَابِي كَالنُّجُومِ بِأَيِّهِمُ اقْتَدَيْتُمُ اهْتَدَيْتُمْ",
        translation: "Sahabat-sahabatku laksana bintang-bintang; dengan siapa pun kalian meneladani, niscaya kalian akan mendapat petunjuk.",
        description: "Kepemimpinan Khulafaur Rasyidin: Keteguhan tauhid Abu Bakar As-Siddiq mengumpulkan mushaf Al-Qur'an dan keadilan sosial bersahaja Umar bin Khattab Al-Faruq.",
        points: [
          "Abu Bakar As-Siddiq: Sahabat yang paling awal membenarkan peristiwa Isra Mikraj, menginfakkan seluruh hartanya untuk perang Tabuk, dan memerintahkan kodifikasi mushaf Al-Qur'an.",
          "Umar bin Khattab Al-Faruq: Pemimpin tegas yang membedakan hak dan batil, memelopori penanggalan Hijriah, mendirikan Baitul Mal teratur, dan berpatroli malam memanggul karung gandum untuk rakyat lapar.",
          "Nilai Kepemimpinan: Integritas, kejujuran, hidup sederhana, dan mengutamakan pelayanan terhadap masyarakat kecil."
        ],
        ttsText: "Abu Bakar As-Siddiq rela mengorbankan seluruh hartanya demi dakwah. Umar bin Khattab adil, bersahaja, dan memanggul gandum sendiri demi rakyatnya.",
        bossName: "Penjaga Pustaka Sejarah Peradaban",
        bossDesc: "Ujilah wawasan keteladanan dua sahabat agung pembimbing umat!",
        quiz: [
          {
            stimulus: "[Level 1: Memahami - Gelar As-Siddiq & Al-Faruq]\nDua khalifah pertama umat Islam mendapat gelar mulia atas keteguhan sikap dan sifat mereka dalam mendampingi Rasulullah saw.",
            question: "Gelar 'As-Siddiq' untuk Abu Bakar dan 'Al-Faruq' untuk Umar bin Khattab masing-masing bermakna...",
            options: [
              "Yang Membenarkan / Amat Jujur dan Pembeda antara yang Hak dan Batil",
              "Singa Padang Pasir dan Pemilik Dua Cahaya",
              "Pintu Gerbang Ilmu dan Pedang Allah yang Terhunus",
              "Ksatria Berkuda dan Pembela Kebajikan"
            ],
            answer: 0,
            explanation: "As-Siddiq bermakna orang yang membenarkan kebenaran tanpa ragu, sedangkan Al-Faruq bermakna pembeda tegas antara kebenaran dan kebatilan.",
            hint: "As-Siddiq = Yang membenarkan; Al-Faruq = Pembeda yang hak dan batil."
          },
          {
            stimulus: "[Level 2: Menerapkan - Kisah Umar Memanggul Gandum]\nKetika terjadi masa paceklik (Tahun Abu), Khalifah Umar bin Khattab berpatroli malam di pelosok Madinah dan mendapati seorang ibu memasak batu dalam panci untuk menenangkan anak-anaknya yang kelaparan.",
            question: "Keteladanan sikap kepemimpinan yang ditunjukkan Khalifah Umar bin Khattab saat menyaksikan peristiwa tersebut adalah...",
            options: [
              "Menyalahkan ibu tersebut karena tidak melapor ke kantor istana",
              "Segera kembali ke Baitul Mal, memanggul sendiri karung gandum dan minyak, lalu memasakkannya untuk keluarga tersebut",
              "Menyuruh prajuritnya saja yang mengurus sementara ia beristirahat di rumah",
              "Hanya mendoakan tanpa memberikan bantuan makanan nyata"
            ],
            answer: 1,
            explanation: "Umar menolak dibantu dan bersikeras memanggul sendiri karung gandum, seraya berkata: 'Apakah engkau mau memikul dosaku di hari kiamat kelak?'",
            hint: "Memanggul sendiri bahan makanan demi tanggung jawab kepada rakyat."
          },
          {
            stimulus: "[Level 3: Merefleksi - Kodifikasi Mushaf Al-Qur'an]\nSetelah Perang Yamamah yang menggugurkan puluhan sahabat penghafal Al-Qur'an (huffazh), Umar mengusulkan kepada Abu Bakar untuk mengumpulkan catatan wahyu menjadi satu mushaf resmi yang terjaga.",
            question: "Refleksi bagi generasi muda SDN Kedungringin I Beji dalam merawat warisan agung mushaf Al-Qur'an di era digital ini adalah...",
            options: [
              "Menyimpan mushaf Al-Qur'an di rak tinggi tanpa pernah dibaca dan dipelajari",
              "Rajin membaca (tilawah), menghafalkan (tahfiz), dan mengamalkan nilai-nilai Al-Qur'an dalam perilaku sehari-hari",
              "Memperdebatkan perbedaan terjemahan di media sosial tanpa bimbingan guru",
              "Menganggap Al-Qur'an hanya perlu dibaca saat bulan Ramadan saja"
            ],
            answer: 1,
            explanation: "Pengorbanan para sahabat menjaga kemurnian Al-Qur'an patut kita teladani dengan rajin membaca, menghafal, dan mengamalkannya.",
            hint: "Rajin membaca, menghafal, dan mengamalkannya dalam kehidupan nyata."
          }
        ]
      }
    }
  },

  // SEASON 2 (SEMESTER 2)
  2: {
    // KELAS 1 (FASE A)
    1: {
      1: {
        title: "Sambung 2 Huruf & Surah al-Fatihah",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase A",
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ • الرَّحْمَٰنِ الرَّحِيمِ • مَالِكِ يَوْمِ الدِّينِ",
        translation: "Segala puji bagi Allah, Tuhan seluruh alam. Yang Maha Pengasih, Maha Penyayang. Pemilik hari pembalasan.",
        description: "Praktik menyambung 2 huruf hijaiah dan menghafal Surah al-Fatihah sebagai Ummul Qur'an yang wajib dibaca di setiap rakaat salat.",
        points: [
          "Menyambung dua huruf hijaiah melatih kelancaran membaca kata sederhana.",
          "Surah al-Fatihah terdiri dari 7 ayat dan dinamakan Ummul Kitab (Induk Al-Qur'an).",
          "Membaca Al-Fatihah merupakan rukun salat yang tidak sah salat tanpanya."
        ],
        ttsText: "Surah al-Fatihah adalah induk Al-Qur'an yang wajib dibaca pada setiap salat.",
        bossName: "Penjaga Ummul Qur'an",
        bossDesc: "Lafalkan dan pahami Surah al-Fatihah serta sambungan huruf hijaiah!",
        quiz: [
          {
            question: "Berapakah jumlah ayat dalam Surah al-Fatihah?",
            options: ["5 ayat", "6 ayat", "7 ayat", "8 ayat"],
            answer: 2,
            explanation: "Surah al-Fatihah terdiri dari 7 ayat termasuk basmalah.",
            hint: "Jumlah hari dalam satu pekan."
          },
          {
            question: "Nama lain dari Surah al-Fatihah yang berarti 'Induk Kitab' adalah...",
            options: ["Ummul Kitab", "As-Sab'ul Masani", "Al-Kausar", "Al-Baqarah"],
            answer: 0,
            explanation: "Al-Fatihah disebut Ummul Kitab atau Ummul Qur'an karena merangkum seluruh isi Al-Qur'an.",
            hint: "Kata Ummul artinya ibu atau induk."
          },
          {
            question: "Huruf Ba (ب) yang bersambung dengan Alif (ا) berharakat fathah dibaca...",
            options: ["Ba", "Bi", "Bu", "Baa (panjang)"],
            answer: 3,
            explanation: "Ba bertemu alif dibaca panjang dua harakat (baa).",
            hint: "Dibaca panjang dua harakat."
          }
        ]
      },
      2: {
        title: "Iman kepada Allah Swt.",
        element: "Akidah",
        fase: "Fase A",
        arabic: "اللَّهُ خَالِقُ كُلِّ شَيْءٍ",
        translation: "Allah adalah Pencipta segala sesuatu. (QS. Az-Zumar: 62)",
        description: "Meyakini adanya Allah Swt. melalui pengamatan ciptaan-Nya yang terbentang di alam semesta: langit, bumi, pepohonan, dan manusia.",
        points: [
          "Adanya alam semesta yang teratur membuktikan adanya Allah Sang Maha Pencipta (Al-Khaliq).",
          "Manusia, hewan, dan tumbuhan adalah makhluk ciptaan Allah.",
          "Bersyukur kepada Allah dengan menjaga dan merawat lingkungan sekitar sekolah."
        ],
        ttsText: "Allah adalah Pencipta segala sesuatu. Keindahan alam semesta membuktikan keberadaan Allah Swt.",
        bossName: "Pengawal Alam Semesta",
        bossDesc: "Ujilah keyakinanmu terhadap bukti keberadaan Allah Swt.!",
        quiz: [
          {
            question: "Matahari, bulan, bintang, dan bumi adalah bukti nyata adanya...",
            options: ["Manusia", "Allah Maha Pencipta", "Malaikat", "Mesin raksasa"],
            answer: 1,
            explanation: "Keteraturan alam semesta adalah tanda kemahakuasaan Allah Swt.",
            hint: "Tuhan Yang Maha Esa."
          },
          {
            question: "Sebutan bagi segala sesuatu yang diciptakan oleh Allah adalah...",
            options: ["Khaliq", "Makhluk", "Rasul", "Nabi"],
            answer: 1,
            explanation: "Allah adalah Al-Khaliq (Pencipta), sedangkan yang diciptakan disebut makhluk.",
            hint: "Semua ciptaan disebut..."
          },
          {
            question: "Cara kita bersyukur kepada Allah yang telah menciptakan tubuh sehat adalah...",
            options: ["Malas bergerak", "Menggunakan tubuh untuk beribadah dan belajar", "Suka berkelahi", "Makan berlebihan"],
            answer: 1,
            explanation: "Kesehatan tubuh dimanfaatkan untuk kebaikan, beribadah, dan menuntut ilmu.",
            hint: "Mengisi hari dengan amal saleh."
          }
        ]
      },
      3: {
        title: "Memuji Allah dengan Tahmid",
        element: "Akhlak",
        fase: "Fase A",
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "Segala puji bagi Allah, Tuhan seluruh alam.",
        description: "Membiasakan mengucap kalimat tayibah Tahmid (Alhamdulillah) setiap kali mendapat kenikmatan, selesai makan, dan bersin.",
        points: [
          "Alhamdulillah artinya Segala puji bagi Allah.",
          "Mengucap Alhamdulillah membuat nikmat kita ditambah oleh Allah.",
          "Menebarkan rasa syukur kepada teman dan guru di SDN Kedungringin I Beji."
        ],
        ttsText: "Ucapkan Alhamdulillah saat menerima nikmat dan setelah menyelesaikan perbuatan baik.",
        bossName: "Penjaga Bunga Syukur",
        bossDesc: "Tunjukkan akhlak memuji Allah Swt. dalam kehidupan sehari-hari!",
        quiz: [
          {
            question: "Kalimat tayibah yang diucapkan saat selesai makan atau minum adalah...",
            options: ["Bismillah", "Alhamdulillah", "Astaghfirullah", "Allahu Akbar"],
            answer: 1,
            explanation: "Selesai makan kita mengucapkan Alhamdulillah sebagai rasa syukur atas rezeki makanan.",
            hint: "Bermula dengan kata Alhamdu."
          },
          {
            question: "Arti dari kalimat 'Alhamdulillah' adalah...",
            options: ["Maha Suci Allah", "Segala puji bagi Allah", "Allah Maha Besar", "Dengan nama Allah"],
            answer: 1,
            explanation: "Alhamdulillah adalah ungkapan pujian bahwa hanya Allah yang berhak dipuji.",
            hint: "Pujian bagi Tuhan semesta alam."
          },
          {
            question: "Janji Allah bagi hamba yang bersyukur adalah...",
            options: ["Akan ditambah nikmat-Nya", "Akan dikurangi hartanya", "Dibiarkan saja", "Diberi kesusahan"],
            answer: 0,
            explanation: "La'in syakartum la'azidannakum: jika kamu bersyukur, niscaya akan Kutambah nikmat-Ku kepadamu.",
            hint: "Mendapat tambahan kebaikan dan berkah."
          }
        ]
      },
      4: {
        title: "Tata Cara Bersuci (Wudu & Tayamum)",
        element: "Fikih",
        fase: "Fase A",
        arabic: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ",
        translation: "Sungguh, Allah menyukai orang yang tobat dan menyukai orang yang menyucikan diri. (QS. Al-Baqarah: 222)",
        description: "Mempraktikkan tata cara bersuci dari hadas kecil melalui wudu, istinja (cebok) yang bersih, dan tayamum menggunakan debu suci jika tidak ada air.",
        points: [
          "Wudu dimulai dengan niat, membasuh muka, tangan sampai siku, mengusap kepala, dan membasuh kaki hingga mata kaki secara tertib.",
          "Tayamum adalah pengganti wudu bila tidak ada air atau sakit, dengan debu tanah yang suci.",
          "Istinja adalah membersihkan qubul atau dubur setelah buang air kecil atau besar."
        ],
        ttsText: "Wudu menyucikan hadas kecil sebelum salat. Jika tidak ada air, kita bersuci dengan tayamum.",
        bossName: "Penjaga Sumber Air Wudu",
        bossDesc: "Ujilah urutan dan rukun tata cara bersuci!",
        quiz: [
          {
            question: "Anggota badan yang pertama kali dibasuh setelah niat dalam rukun wudu adalah...",
            options: ["Tangan", "Muka / Wajah", "Telinga", "Kaki"],
            answer: 1,
            explanation: "Rukun wudu yang pertama adalah niat disertai membasuh seluruh wajah/muka.",
            hint: "Bagian kepala depan yang ada mata dan hidung."
          },
          {
            question: "Benda yang digunakan untuk bertayamum sebagai pengganti air adalah...",
            options: ["Daun kering", "Debu tanah yang suci", "Batu karang", "Pasir basah"],
            answer: 1,
            explanation: "Tayamum menggunakan debu tanah yang bersih dan suci.",
            hint: "Butiran halus tanah yang kering dan bersih."
          },
          {
            question: "Membersihkan kotoran setelah buang air kecil atau buang air besar disebut...",
            options: ["Istinja", "Tayamum", "Mandi wajib", "Kumur-kumur"],
            answer: 0,
            explanation: "Istinja adalah membersihkan sisa kotoran buang air dengan air suci atau batu.",
            hint: "Diawali huruf I-s-t-i..."
          }
        ]
      },
      5: {
        title: "Kisah Keteladanan Nabi Idris a.s.",
        element: "Sejarah Peradaban Islam",
        fase: "Fase A",
        arabic: "وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ ۚ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا",
        translation: "Dan ceritakanlah (kisah) Idris di dalam Kitab. Sungguh, dia seorang yang sangat membenarkan dan seorang nabi. (QS. Maryam: 56)",
        description: "Nabi Idris a.s. terkenal sangat rajin belajar, pandai menulis dengan pena, menjahit pakaian, serta memiliki keberanian menegakkan kebenaran.",
        points: [
          "Nabi Idris a.s. adalah manusia pertama yang pandai menulis dengan qalam (pena).",
          "Manusia pertama yang menjahit pakaian dari kain untuk menggantikan kulit hewan.",
          "Diberi gelar 'Asadul Usud' (Singa dari segala singa) karena gagah berani membela ajaran Allah."
        ],
        ttsText: "Nabi Idris sangat cerdas dan rajin belajar. Beliau adalah manusia pertama yang pandai menulis dengan pena dan menjahit pakaian.",
        bossName: "Pena Penjaga Peradaban",
        bossDesc: "Ujilah keteladanan kecerdasan dan ketekunan Nabi Idris a.s.!",
        quiz: [
          {
            question: "Nabi yang dikenal sebagai manusia pertama yang pandai menulis dengan pena (qalam) adalah...",
            options: ["Nabi Adam a.s.", "Nabi Idris a.s.", "Nabi Nuh a.s.", "Nabi Hud a.s."],
            answer: 1,
            explanation: "Nabi Idris a.s. dianugerahi kepandaian menulis, membaca, berhitung, dan menjahit.",
            hint: "Nabi kedua dalam urutan 25 nabi."
          },
          {
            question: "Selain pandai menulis, Nabi Idris a.s. juga manusia pertama yang pandai...",
            options: ["Membuat kapal", "Menjahit pakaian dari kain", "Bercocok tanam padi", "Membuat pedang besi"],
            answer: 1,
            explanation: "Nabi Idris mengajarkan manusia membuat dan menjahit pakaian yang menutup aurat.",
            hint: "Menyatukan kain dengan benang dan jarum."
          },
          {
            question: "Sikap mulia Nabi Idris yang harus dicontoh siswa SDN Kedungringin I Beji adalah...",
            options: ["Malas membaca buku", "Semangat menuntut ilmu dan pantang menyerah", "Suka bermain tanpa belajar", "Takut bertanya"],
            answer: 1,
            explanation: "Ketekunan Nabi Idris dalam belajar menjadikannya teladan bagi para penuntut ilmu.",
            hint: "Rajin belajar dan mencintai buku."
          }
        ]
      }
    },
    // KELAS 2 (FASE A)
    2: {
      1: {
        title: "Surah al-Ikhlas & Hadis Kebersihan",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase A",
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ • لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translation: "Katakanlah: 'Dialah Allah, Yang Maha Esa. Allah tempat meminta segala sesuatu. Allah tidak beranak dan tidak pula diperanakkan.'",
        description: "Menghayati kemurnian tauhid dalam Surah al-Ikhlas (Allah Maha Esa), serta mengamalkan hadis kebersihan sebagian dari iman.",
        points: [
          "Surah al-Ikhlas setara dengan sepertiga Al-Qur'an dalam nilai keutamaan tauhid.",
          "As-Samad berarti Allah Maha Dibutuhkan dan tempat bergantung seluruh makhluk.",
          "Menjaga kesucian badan, pakaian, dan bangku kelas sekolah setiap hari."
        ],
        ttsText: "Surah al-Ikhlas menegaskan bahwa Allah itu Esa, tidak beranak dan tidak diperanakkan. Jagalah kebersihan diri.",
        bossName: "Penjaga Kemurnian Tauhid",
        bossDesc: "Tunjukkan pemahamanmu mengenai Surah al-Ikhlas dan hadis kebersihan!",
        quiz: [
          {
            question: "Arti dari ayat pertama Surah al-Ikhlas 'Qul Huwallahu Ahad' adalah...",
            options: ["Katakanlah: Dialah Allah Yang Maha Esa", "Allah tempat bergantung", "Tidak beranak dan tidak diperanakkan", "Dan tidak ada yang setara"],
            answer: 0,
            explanation: "Ahad artinya Maha Tunggal / Maha Esa, tiada sekutu bagi-Nya.",
            hint: "Menyatakan Allah itu satu."
          },
          {
            question: "Arti dari asma Allah 'As-Samad' dalam Surah al-Ikhlas adalah...",
            options: ["Maha Mendengar", "Maha Pengampun", "Tempat meminta segala sesuatu / bergantung", "Maha Hidup"],
            answer: 2,
            explanation: "As-Samad bermakna bahwa seluruh makhluk bergantung dan memohon kepada Allah Swt.",
            hint: "Tempat seluruh makhluk bersandar dan memohon pertolongan."
          },
          {
            question: "Pahala membaca Surah al-Ikhlas satu kali diibaratkan setara dengan membaca...",
            options: ["Separuh Al-Qur'an", "Sepertiga Al-Qur'an", "Seluruh Al-Qur'an", "Satu juz"],
            answer: 1,
            explanation: "Rasulullah saw. bersabda bahwa Surah al-Ikhlas sebanding dengan sepertiga isi Al-Qur'an.",
            hint: "Satu per tiga bagian Al-Qur'an."
          }
        ]
      },
      2: {
        title: "Iman kepada Malaikat Allah",
        element: "Akidah",
        fase: "Fase A",
        arabic: "لَّا يَعْصُونَ اللَّهَ مَا أَمَرَهُمْ وَيَفْعَلُونَ مَا يُؤْمَرُونَ",
        translation: "Mereka tidak durhaka kepada Allah terhadap apa yang Dia perintahkan dan selalu mengerjakan apa yang diperintahkan. (QS. At-Tahrim: 6)",
        description: "Mengenal 10 Malaikat Allah yang wajib diimani beserta tugas mulianya (Jibril, Mikail, Israfil, Izrail, Munkar, Nakir, Raqib, Atid, Malik, Ridwan).",
        points: [
          "Malaikat diciptakan Allah dari nur (cahaya), tidak memiliki nafsu, dan selalu taat.",
          "Malaikat Jibril menyampaikan wahyu, Mikail membagikan rezeki dan hujan.",
          "Malaikat Raqib dan Atid mencatat amal perbuatan baik dan buruk kita setiap detik."
        ],
        ttsText: "Malaikat diciptakan dari cahaya dan selalu taat. Ada sepuluh malaikat yang wajib kita ketahui tugasnya.",
        bossName: "Pengawal Cahaya Malaikat",
        bossDesc: "Ujilah hafalan dan pemahaman tugas 10 Malaikat Allah!",
        quiz: [
          {
            question: "Malaikat yang bertugas menyampaikan wahyu kepada para nabi dan rasul adalah...",
            options: ["Malaikat Mikail", "Malaikat Jibril", "Malaikat Israfil", "Malaikat Izrail"],
            answer: 1,
            explanation: "Malaikat Jibril ditugaskan membawa firman wahyu Allah.",
            hint: "Disebut juga Ruhul Qudus."
          },
          {
            question: "Malaikat yang bertugas mencatat segala amal kebaikan manusia adalah...",
            options: ["Malaikat Atid", "Malaikat Raqib", "Malaikat Malik", "Malaikat Ridwan"],
            answer: 1,
            explanation: "Malaikat Raqib mencatat amal baik, sedangkan Atid mencatat amal buruk.",
            hint: "Berada di sebelah kanan kita."
          },
          {
            question: "Malaikat diciptakan oleh Allah Swt. dari...",
            options: ["Api", "Tanah", "Cahaya (Nur)", "Air"],
            answer: 2,
            explanation: "Malaikat diciptakan dari cahaya, jin dari api, dan manusia dari tanah.",
            hint: "Sesuatu yang bersinar terang benderang."
          }
        ]
      },
      3: {
        title: "Adab Terbiasa Berdoa",
        element: "Akhlak",
        fase: "Fase A",
        arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
        translation: "Dan Tuhanmu berfirman: 'Berdoalah kepada-Ku, niscaya akan Kuperkenankan bagimu.' (QS. Ghafir: 60)",
        description: "Membiasakan diri melafalkan doa harian: doa sebelum dan sesudah makan, doa sebelum tidur dan bangun tidur, serta doa masuk dan keluar kamar mandi.",
        points: [
          "Doa adalah bentuk komunikasi hamba dengan Sang Pencipta.",
          "Memulai segala perbuatan baik dengan basmalah dan doa keselamatan.",
          "Menjaga adab berdoa: ikhlas, mengangkat tangan, dan suara lembut."
        ],
        ttsText: "Berdoalah sebelum dan sesudah melakukan aktivitas sehari-hari agar diberkahi Allah Swt.",
        bossName: "Penjaga Gerbang Doa Harian",
        bossDesc: "Ujilah hafalan dan pengamalan doa harianmu!",
        quiz: [
          {
            question: "Doa sebelum tidur yang benar berbunyi...",
            options: ["Bismika Allahumma ahya wa bismika amut", "Alhamdulillahillazi ahyana", "Rabbighfirli waliwalidayya", "Bismillahi tawakkaltu 'alallah"],
            answer: 0,
            explanation: "Artinya: 'Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati'.",
            hint: "Mengandung kata ahya (hidup) dan amut (mati)."
          },
          {
            question: "Saat hendak memasuki kamar mandi / toilet, kaki yang didahulukan melangkah adalah kaki...",
            options: ["Kanan", "Kiri", "Keduanya bersamaan", "Bebas"],
            answer: 1,
            explanation: "Sunah masuk toilet mendahulukan kaki kiri dan keluar dengan kaki kanan.",
            hint: "Kebalikan dari masuk masjid."
          },
          {
            question: "Sebelum memulai kegiatan belajar di kelas SDN Kedungringin I Beji, kita dianjurkan membaca...",
            options: ["Dongeng", "Doa belajar dan basmalah", "Nyanyian keras", "Keluhan"],
            answer: 1,
            explanation: "Membaca doa belajar memohon agar dilapangkan ilmu dan pemahaman.",
            hint: "Memohon ilmu yang bermanfaat kepada Allah."
          }
        ]
      },
      4: {
        title: "Zikir & Berdoa setelah Salat",
        element: "Fikih",
        fase: "Fase A",
        arabic: "فَإِذَا قَضَيْتُمُ الصَّلَاةَ فَاذْكُرُوا اللَّهَ",
        translation: "Maka apabila kamu telah menyelesaikan salat, ingatlah Allah. (QS. An-Nisa: 103)",
        description: "Melatih adab zikir sesudah salat fardu: Membaca Istigfar 3x, Tasbih 33x, Tahmid 33x, Takbir 33x, Tahlil, dan doa kebaikan dunia akhirat.",
        points: [
          "Zikir menentramkan jiwa dan menguatkan bekas ibadah salat dalam kehidupan.",
          "Membaca tasbih (Subhanallah), tahmid (Alhamdulillah), dan takbir (Allahu Akbar) masing-masing 33 kali.",
          "Menutup rangkaian zikir dengan doa kebaikan untuk orang tua dan guru."
        ],
        ttsText: "Setelah salat, jangan langsung beranjak pergi. Berzikirlah dengan istigfar, tasbih, tahmid, dan takbir.",
        bossName: "Imam Khusyuk",
        bossDesc: "Buktikan adab dan bacaan zikirmu setelah salat!",
        quiz: [
          {
            question: "Jumlah bacaan Tasbih (Subhanallah) yang dianjurkan dibaca setelah salat fardu adalah...",
            options: ["10 kali", "33 kali", "50 kali", "99 kali"],
            answer: 1,
            explanation: "Sunah zikir setelah salat: 33x Tasbih, 33x Tahmid, dan 33x Takbir.",
            hint: "Tiga puluh tiga kali."
          },
          {
            question: "Kalimat tayibah Takbir berbunyi...",
            options: ["Subhanallah", "Alhamdulillah", "Allahu Akbar", "La ilaha illallah"],
            answer: 2,
            explanation: "Allahu Akbar adalah takbir yang artinya Allah Maha Besar.",
            hint: "Mengagungkan kebesaran Allah."
          },
          {
            question: "Sikap tubuh saat berzikir dan berdoa setelah salat sebaiknya...",
            options: ["Duduk tenang dan khusyuk menghadap kiblat", "Bercanda dengan teman", "Tidur terlentang", "Melihat ke kanan kiri"],
            answer: 0,
            explanation: "Zikir dilakukan dengan tenang, sopan, dan penuh konsentrasi menghadap kiblat.",
            hint: "Khusyuk dan tertib."
          }
        ]
      },
      5: {
        title: "Kisah Keteladanan Nabi Ibrahim a.s.",
        element: "Sejarah Peradaban Islam",
        fase: "Fase A",
        arabic: "قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ",
        translation: "Kami (Allah) berfirman: 'Wahai api! Jadilah kamu dingin, dan penyelamat bagi Ibrahim!' (QS. Al-Anbiya: 69)",
        description: "Perjuangan Nabi Ibrahim a.s. mencari Tuhan dengan akal sehat, menghancurkan berhala Raja Namrud, dan mukjizat selamat dari kobaran api.",
        points: [
          "Nabi Ibrahim dijuluki Khalilullah (Kekasih Allah) dan bapak para nabi (Abul Anbiya).",
          "Berani mendakwahi Raja Namrud dan kaumnya yang menyembah patung berhala.",
          "Ketika dilempar ke dalam kobaran api unggun raksasa, api berubah menjadi dingin dan menyelamatkannya."
        ],
        ttsText: "Nabi Ibrahim adalah kekasih Allah. Kobaran api raja Namrud menjadi dingin atas perintah Allah Swt.",
        bossName: "Penjaga Api Dingin",
        bossDesc: "Ujilah sejarah mukjizat dan keteguhan iman Nabi Ibrahim a.s.!",
        quiz: [
          {
            question: "Raja sombong yang memerintahkan membakar Nabi Ibrahim a.s. bernama Raja...",
            options: ["Fir'aun", "Namrud", "Abrahah", "Jalut"],
            answer: 1,
            explanation: "Raja Namrud dari Babilonia membakar Nabi Ibrahim karena patung sembahannya dihancurkan.",
            hint: "Raja zalim penentang Nabi Ibrahim."
          },
          {
            question: "Mukjizat yang dialami Nabi Ibrahim a.s. saat dilempar ke kobaran api adalah...",
            options: ["Api menjadi dingin dan menyelamatkannya", "Bisa terbang ke langit", "Tiba-tiba turun hujan salju", "Menghilang dari pandangan"],
            answer: 0,
            explanation: "Allah memerintahkan api: 'Kuni bardan wa salaman' (jadilah dingin dan menyelamatkan).",
            hint: "Api tidak membakar tubuh beliau."
          },
          {
            question: "Gelar kemuliaan bagi Nabi Ibrahim a.s. sebagai kekasih Allah adalah...",
            options: ["Habibullah", "Khalilullah", "Kalimullah", "Ruhullah"],
            answer: 1,
            explanation: "Nabi Ibrahim bergelar Khalilullah yang bermakna Kekasih Allah.",
            hint: "Diawali kata 'Khalil'."
          }
        ]
      }
    },
    // KELAS 3 (FASE B)
    3: {
      1: {
        title: "Izhar Halqi & Hadis Kewajiban Salat",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase B",
        arabic: "بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ ... وَإِقَامِ الصَّلَاةِ",
        translation: "Islam dibangun di atas lima perkara: ... dan mendirikan salat.",
        description: "Mempelajari hukum Izhar Halqi (nun sukun/tanwin bertemu 6 huruf halqi: Hamzah, Ha, Ain, Gain, Ha, Kha dibaca jelas tanpa dengung) dan hadis salat.",
        points: [
          "Izhar artinya jelas dan tegas, Halqi artinya tenggorokan.",
          "Huruf Izhar Halqi ada 6: ء, هـ, ع, غ, ح, خ.",
          "Hadis menegaskan salat sebagai batas pembeda iman dan amalan pertama yang dihisab di akhirat."
        ],
        ttsText: "Izhar halqi dibaca jelas tanpa dengung pada enam huruf tenggorokan. Salat adalah amalan pertama yang dihisab.",
        bossName: "Pilar Suara Jernih Halqi",
        bossDesc: "Ujilah ketepatan membaca Izhar Halqi dan hadis kewajiban salat!",
        quiz: [
          {
            question: "Berapa jumlah huruf Izhar Halqi yang keluar dari tenggorokan?",
            options: ["4", "5", "6", "8"],
            answer: 2,
            explanation: "Ada 6 huruf halqi: Hamzah, Ha, Ain, Gain, Ha, Kha.",
            hint: "Enam huruf tenggorokan."
          },
          {
            question: "Cara membaca hukum bacaan Izhar Halqi adalah...",
            options: ["Mendengung panjang", "Samar-samar", "Jelas dan terang tanpa dengung", "Membalikkan bunyi"],
            answer: 2,
            explanation: "Izhar artinya jelas, dibaca terang bunyi nun atau tanwinnya tanpa dengung.",
            hint: "Jelas dan tidak berdengung."
          },
          {
            question: "Amalan ibadah yang pertama kali akan dihisab dan dihitung pada hari kiamat adalah...",
            options: ["Haji", "Salat", "Puasa", "Sedekah"],
            answer: 1,
            explanation: "Rasulullah saw. bersabda bahwa amalan pertama yang dihisab dari seorang hamba adalah salatnya.",
            hint: "Tiang agama yang lima waktu."
          }
        ]
      },
      2: {
        title: "Iman kepada Kitab-Kitab Allah",
        element: "Akidah",
        fase: "Fase B",
        arabic: "وَأَنزَلْنَا إِلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ الْكِتَابِ",
        translation: "Dan Kami telah menurunkan Kitab (Al-Qur'an) kepadamu dengan membawa kebenaran, membenarkan kitab-kitab sebelumnya.",
        description: "Mengenal 4 kitab suci yang diturunkan Allah: Taurat (Nabi Musa), Zabur (Nabi Daud), Injil (Nabi Isa), dan Al-Qur'an (Nabi Muhammad saw.).",
        points: [
          "Taurat diturunkan kepada Nabi Musa a.s. dalam bahasa Ibrani.",
          "Zabur diturunkan kepada Nabi Daud a.s. berisi doa dan puji-pujian.",
          "Injil diturunkan kepada Nabi Isa a.s., dan Al-Qur'an sebagai kitab penyempurna dan penutup."
        ],
        ttsText: "Ada empat kitab suci: Taurat untuk Nabi Musa, Zabur untuk Nabi Daud, Injil untuk Nabi Isa, dan Al-Qur'an untuk Nabi Muhammad.",
        bossName: "Penjaga Pustaka Kitab Suci",
        bossDesc: "Ujilah wawasanmu mengenai 4 kitab suci Allah Swt.!",
        quiz: [
          {
            question: "Kitab suci Zabur diturunkan oleh Allah Swt. kepada...",
            options: ["Nabi Musa a.s.", "Nabi Daud a.s.", "Nabi Isa a.s.", "Nabi Ibrahim a.s."],
            answer: 1,
            explanation: "Kitab Zabur diturunkan kepada Nabi Daud a.s.",
            hint: "Nabi yang memiliki suara sangat merdu dan menaklukkan Jalut."
          },
          {
            question: "Kitab suci Al-Qur'an diturunkan kepada Nabi Muhammad saw. sebagai kitab...",
            options: ["Khusus bangsa Arab saja", "Penyempurna seluruh kitab suci sebelumnya untuk seluruh alam", "Sama seperti kitab kuno", "Buku biasa"],
            answer: 1,
            explanation: "Al-Qur'an adalah mukjizat abadi yang menyempurnakan ajaran kitab-kitab terdahulu.",
            hint: "Penyempurna dan penutup wahyu ilahi."
          },
          {
            question: "Kitab Taurat diturunkan kepada Nabi...",
            options: ["Nabi Musa a.s.", "Nabi Isa a.s.", "Nabi Adam a.s.", "Nabi Nuh a.s."],
            answer: 0,
            explanation: "Kitab Taurat diturunkan kepada Nabi Musa a.s. di bukit Tursina.",
            hint: "Nabi yang membelah lautan merah dengan tongkatnya."
          }
        ]
      },
      3: {
        title: "Akhlak Mulia kepada Orang Tua",
        element: "Akhlak",
        fase: "Fase B",
        arabic: "رِضَى الرَّبِّ فِي رِضَى الْوَالِدِ وَسَخَطُ الرَّبِّ فِي سَخَطِ الْوَالِدِ",
        translation: "Rida Allah terletak pada rida kedua orang tua, dan murka Allah terletak pada murka kedua orang tua. (HR. Tirmidzi)",
        description: "Menghayati betapa agungnya kedudukan kedua orang tua, menjaga perasaan mereka, membantu pekerjaan rumah, dan memuliakan keduanya.",
        points: [
          "Keridaan Allah bergantung pada keridaan ayah dan ibu.",
          "Dilarang berkata 'Ah' atau membentak orang tua.",
          "Bakti kepada orang tua membuka pintu surga dan memanjangkan umur berkah."
        ],
        ttsText: "Rida Allah ada pada rida orang tua. Jangan sekali-kali berkata kasar atau membentak ayah dan ibu.",
        bossName: "Penjaga Pintu Surga Firdaus",
        bossDesc: "Buktikan adab birrul walidain kepada orang tuamu!",
        quiz: [
          {
            question: "Berdasarkan sabda Rasulullah saw., rida Allah bergantung kepada rida...",
            options: ["Teman sebaya", "Kedua orang tua", "Tetangga jauh", "Pedagang"],
            answer: 1,
            explanation: "Ridhallahi fi ridhal walidain: Rida Allah ada pada rida orang tua.",
            hint: "Ayah dan Ibu tercinta."
          },
          {
            question: "Perkataan paling ringan yang dilarang diucapkan kepada orang tua menurut Surah Al-Isra ayat 23 adalah perkataan...",
            options: ["Ah / Cih", "Terima kasih", "Sama-sama", "Permisi"],
            answer: 0,
            explanation: "Allah melarang mengatakan kata 'Uff' (Ah/Cih) yang menunjukkan rasa kesal pada orang tua.",
            hint: "Kata keluhan satu huruf vokal."
          },
          {
            question: "Saat orang tua meminta tolong untuk membeli sesuatu ke warung, sikap anak saleh adalah...",
            options: ["Pura-pura tidur", "Segera melaksanakan dengan senang hati dan senyuman", "Meminta upah besar", "Menolak dengan marah"],
            answer: 1,
            explanation: "Membantu orang tua dengan ikhlas adalah ladang pahala besar.",
            hint: "Sigap dan patuh membantu."
          }
        ]
      },
      4: {
        title: "Ketentuan Salat Jumat",
        element: "Fikih",
        fase: "Fase B",
        arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ",
        translation: "Wahai orang-orang yang beriman! Apabila telah diseru untuk salat pada hari Jumat, maka segeralah mengingat Allah. (QS. Al-Jumu'ah: 9)",
        description: "Ketentuan ibadah Salat Jumat: Hukum wajib bagi laki-laki muslim, 2 rakaat berjamaah, didahului 2 khutbah, serta amalan sunah hari Jumat.",
        points: [
          "Salat Jumat menggantikan salat Zuhur pada hari Jumat bagi laki-laki mukalaf.",
          "Sunah Jumat: Mandi, memotong kuku, memakai wangi-wangian, dan berpakaian putih bersih.",
          "Wajib mendengarkan khutbah dengan tenang tanpa berbicara agar pahala Jumat tidak sia-sia."
        ],
        ttsText: "Salat Jumat hukumnya fardu ain bagi laki-laki muslim. Dengarkan khutbah dengan tenang dan jangan berbicara.",
        bossName: "Khatib Mimbar Jumat",
        bossDesc: "Ujilah pemahamanmu mengenai syarat, rukun, dan adab salat Jumat!",
        quiz: [
          {
            question: "Salat Jumat didirikan sebanyak...",
            options: ["2 rakaat setelah dua khutbah", "3 rakaat", "4 rakaat", "2 rakaat tanpa khutbah"],
            answer: 0,
            explanation: "Salat Jumat berjumlah 2 rakaat yang didahului oleh dua khutbah Jumat.",
            hint: "Dua rakaat berjamaah."
          },
          {
            question: "Ketika khatib sedang berkhutbah di atas mimbar, sikap makmum yang benar adalah...",
            options: ["Mengobrol dengan teman sebelah", "Bermain ponsel", "Mendengarkan dengan tenang dan khusyuk", "Tidur"],
            answer: 2,
            explanation: "Berbicara saat khutbah membuat pahala Jumat gugur dan sia-sia.",
            hint: "Fokus mendengarkan pesan nasihat khatib."
          },
          {
            question: "Salah satu amalan sunah sebelum berangkat ke masjid untuk salat Jumat adalah...",
            options: ["Begadang semalaman", "Mandi sunah Jumat dan memakai pakaian bersih", "Makan bawang mentah", "Berlari kencang"],
            answer: 1,
            explanation: "Mandi, bersiwak, dan memakai wewangian adalah sunah agung di hari Jumat.",
            hint: "Menjaga kebersihan dan aroma wangi tubuh."
          }
        ]
      },
      5: {
        title: "Masa Remaja & Pernikahan Nabi saw.",
        element: "Sejarah Peradaban Islam",
        fase: "Fase B",
        arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ",
        translation: "Dan sesungguhnya engkau (Muhammad) benar-benar berbudi pekerti yang luhur. (QS. Al-Qalam: 4)",
        description: "Kisah masa remaja Nabi Muhammad saw. berniaga ke negeri Syam, mendapatkan gelar Al-Amin (Dapat Dipercaya), hingga pernikahan agung dengan Sayyidah Khadijah.",
        points: [
          "Nabi diajak pamannya, Abu Talib, berniaga sejak usia 12 tahun ke Syam.",
          "Kejujuran dan integritas Nabi menjadikannya digelari 'Al-Amin' oleh penduduk Makkah.",
          "Menikah dengan Sayyidah Khadijah binti Khuwailid pada usia 25 tahun dengan mahar 20 ekor unta muda."
        ],
        ttsText: "Nabi Muhammad digelari Al-Amin karena sangat jujur dalam berniaga dan bertutur kata.",
        bossName: "Kafilah Negeri Syam",
        bossDesc: "Ujilah sejarah masa muda dan kejujuran teladan Nabi Muhammad saw.!",
        quiz: [
          {
            question: "Gelar 'Al-Amin' yang diberikan bangsa Quraisy kepada Nabi Muhammad saw. artinya...",
            options: ["Pemimpin yang gagah", "Orang yang terpercaya dan jujur", "Orang yang kaya raya", "Pemberani di medan perang"],
            answer: 1,
            explanation: "Al-Amin artinya orang yang dapat dipercaya dan tidak pernah berdusta.",
            hint: "Berkaitan dengan sifat jujur dan amanah."
          },
          {
            question: "Pada usia berapakah Nabi Muhammad saw. menikah dengan Sayyidah Khadijah r.a.?",
            options: ["20 tahun", "25 tahun", "30 tahun", "40 tahun"],
            answer: 1,
            explanation: "Nabi menikah dengan Khadijah saat berusia 25 tahun, sedangkan Khadijah berusia 40 tahun.",
            hint: "Seperempat abad."
          },
          {
            question: "Sifat utama Nabi Muhammad saat berdagang yang patut dicontoh adalah...",
            options: ["Menipu timbangan", "Jujur menceritakan kelebihan dan kekurangan barang", "Mengambil keuntungan berlebihan", "Sumpah palsu"],
            answer: 1,
            explanation: "Nabi selalu jujur tidak pernah mengurangi takaran atau berbohong dalam jual beli.",
            hint: "Kejujuran dan transparansi."
          }
        ]
      }
    },
    // KELAS 4 (FASE B)
    4: {
      1: {
        title: "Iklab, Ikhfa, & Hadis Menjaga Sesama",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase B",
        arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
        translation: "Seorang muslim sejati adalah yang orang lain selamat dari kejahatan lisan dan tangannya. (HR. Bukhari)",
        description: "Menguasai hukum Iklab (menukar bunyi nun sukun menjadi mim saat bertemu Ba) dan Ikhfa Hakiki (15 huruf dibaca samar), serta hadis menjaga kerukunan.",
        points: [
          "Huruf Iklab hanya 1, yaitu Ba (ب), dibaca dengung dan berubah bunyi mim samar.",
          "Ikhfa Hakiki memiliki 15 huruf, dibaca samar antara izhar dan idgam.",
          "Menjaga lisan dari ghibah dan tangan dari perbuatan mencelakai teman."
        ],
        ttsText: "Iklab menukar nun mati menjadi mim saat bertemu ba. Seorang muslim sejati menjaga lisan dan tangannya dari menyakiti orang lain.",
        bossName: "Penjaga Lisan Santun",
        bossDesc: "Tunjukkan pemahaman hukum tajwid Iklab, Ikhfa, dan adab sesama muslim!",
        quiz: [
          {
            question: "Hukum bacaan ketika Nun Sukun atau Tanwin bertemu dengan huruf Ba (ب) adalah...",
            options: ["Izhar", "Idgam", "Iklab", "Ikhfa"],
            answer: 2,
            explanation: "Iklab membalikkan bunyi nun sukun menjadi mim samar dengan dengung.",
            hint: "Ditandai dengan huruf mim kecil di atasnya."
          },
          {
            question: "Berapa jumlah huruf dalam hukum bacaan Ikhfa Hakiki?",
            options: ["6 huruf", "10 huruf", "15 huruf", "20 huruf"],
            answer: 2,
            explanation: "Huruf Ikhfa Hakiki ada 15 huruf (Ta, Tsa, Jim, Dal, Zal, Zai, Sin, Syin, Sad, Dad, Ta, Za, Fa, Qaf, Kaf).",
            hint: "Jumlah huruf terbanyak dalam hukum nun mati."
          },
          {
            question: "Berdasarkan hadis Rasulullah, seorang muslim sejati adalah yang orang lain selamat dari...",
            options: ["Harta dan kekayaannya", "Lisan (ucapan) dan tangannya", "Rumah tangganya", "Ilmunya"],
            answer: 1,
            explanation: "Tidak menyakiti sesama baik dengan perkataan kotor maupun pukulan/tindakan fisik.",
            hint: "Mulut dan anggota gerak tubuh."
          }
        ]
      },
      2: {
        title: "Iman kepada Rasul-Rasul Allah",
        element: "Akidah",
        fase: "Fase B",
        arabic: "تِلْكَ الرُّسُلُ فَضَّلْنَا بَعْضَهُمْ عَلَىٰ بَعْضٍ",
        translation: "Rasul-rasul itu Kami lebihkan sebagian mereka dari sebagian yang lain. (QS. Al-Baqarah: 253)",
        description: "Mengenal 25 Nabi dan Rasul yang wajib diketahui, 4 Sifat Wajib Rasul (Sidiq, Amanah, Tablig, Fatanah), dan 5 Rasul Ulul Azmi.",
        points: [
          "Nabi menerima wahyu untuk dirinya, sedangkan Rasul wajib menyampaikan wahyu kepada umatnya.",
          "Sifat Wajib Rasul: Sidiq (jujur), Amanah (terpercaya), Tablig (menyampaikan), Fatanah (cerdas).",
          "5 Rasul Ulul Azmi (Nuh, Ibrahim, Musa, Isa, Muhammad) memiliki keteguhan hati luar biasa."
        ],
        ttsText: "Rasul memiliki empat sifat wajib: sidiq, amanah, tablig, dan fatanah. Lima rasul bergelar Ulul Azmi.",
        bossName: "Pengawal Risalah Kenabian",
        bossDesc: "Ujilah wawasanmu mengenai para nabi, rasul, dan sifat kemuliaannya!",
        quiz: [
          {
            question: "Sifat wajib bagi rasul 'Fatanah' memiliki arti bahwa para rasul itu pasti...",
            options: ["Jujur", "Dapat dipercaya", "Cerdas dan bijaksana", "Menyampaikan wahyu"],
            answer: 2,
            explanation: "Fatanah artinya cerdas, mustahil rasul itu Baladah (bodoh).",
            hint: "Kemampuan intelektual dan kebijaksanaan tinggi."
          },
          {
            question: "Rasul yang memiliki kesabaran dan ketabahan luar biasa menghadapi ujian berat bergelar...",
            options: ["Khulafaur Rasyidin", "Ulul Azmi", "As-Sabiqunal Awwalun", "Bani Israil"],
            answer: 1,
            explanation: "Ulul Azmi adalah gelar bagi 5 rasul pilihan yang memiliki tekad dan kesabaran membaja.",
            hint: "Artinya pemilik keteguhan hati."
          },
          {
            question: "Berikut ini yang BUKAN termasuk dalam 5 Rasul Ulul Azmi adalah...",
            options: ["Nabi Nuh a.s.", "Nabi Daud a.s.", "Nabi Musa a.s.", "Nabi Isa a.s."],
            answer: 1,
            explanation: "5 Rasul Ulul Azmi disingkat NIMIM: Nuh, Ibrahim, Musa, Isa, Muhammad.",
            hint: "Nabi yang menerima Zabur bukan termasuk Ulul Azmi."
          }
        ]
      },
      3: {
        title: "Akhlak Hormat & Tawaduk kepada Guru",
        element: "Akhlak",
        fase: "Fase B",
        arabic: "تَعَلَّمُوا الْعِلْمَ وَتَعَلَّمُوا لِلْعِلْمِ السَّكِينَةَ وَالْوَقَارَ وَتَوَاضَعُوا لِمَنْ تَتَعَلَّمُونَ مِنْهُ",
        translation: "Tuntutlah ilmu dan pelajari ketenangan serta wibawa, dan rendahkanlah hatimu kepada orang yang kamu belajar darinya.",
        description: "Memuliakan bapak dan ibu guru di sekolah sebagai orang tua kedua yang membimbing kita dengan ilmu dan akhlak mulia.",
        points: [
          "Guru adalah pewaris ilmu para nabi yang menerangi kebodohan.",
          "Menyapa dengan senyum dan salam saat berpapasan di SDN Kedungringin I Beji.",
          "Memperhatikan penjelasan guru di kelas dengan seksama dan mengamalkan ilmu."
        ],
        ttsText: "Hormati dan muliakan gurumu. Kerendahan hati di hadapan guru adalah kunci keberkahan ilmu pengetahuan.",
        bossName: "Pelindung Keberkahan Ilmu",
        bossDesc: "Tunjukkan adab santun dan takzim kepada guru!",
        quiz: [
          {
            question: "Mengapa kita wajib memuliakan dan menghormati bapak dan ibu guru?",
            options: ["Karena guru memberi nilai saja", "Karena guru adalah pembimbing yang mengajarkan ilmu dan kebaikan", "Karena guru galak", "Karena takut dihukum"],
            answer: 1,
            explanation: "Guru adalah pahlawan pendidikan yang mendidik rohani dan kecerdasan kita.",
            hint: "Sumber ilmu dan pembimbing akhlak di sekolah."
          },
          {
            question: "Sikap yang tepat saat guru sedang menerangkan materi pelajaran di kelas adalah...",
            options: ["Mengobrol dengan teman di belakang", "Mendengarkan dengan seksama dan mencatat hal penting", "Tidur di atas meja", "Keluar kelas tanpa izin"],
            answer: 1,
            explanation: "Fokus mendengarkan adalah wujud adab memuliakan majelis ilmu.",
            hint: "Konsentrasi dan menghargai guru."
          },
          {
            question: "Adab yang benar saat berpapasan dengan guru di koridor sekolah SDN Kedungringin I Beji adalah...",
            options: ["Pura-pura tidak melihat", "Mengucapkan salam, tersenyum, dan menyapa dengan sopan", "Berlari menjauh", "Bersiul keras"],
            answer: 1,
            explanation: "Menebarkan 5S: Senyum, Salam, Sapa, Sopan, dan Santun.",
            hint: "Menyapa dengan ramah dan salam."
          }
        ]
      },
      4: {
        title: "Tanda Balig & Tanggung Jawab Taklif",
        element: "Fikih",
        fase: "Fase B",
        arabic: "رُفِعَ الْقَلَمُ عَنْ ثَلَاثَةٍ: عَنِ النَّائِمِ حَتَّى يَسْتَيْقِظَ، وَعَنِ الصَّبِيِّ حَتَّى يَحْتَلِمَ",
        translation: "Pena catatan amal diangkat dari tiga golongan: orang tidur sampai bangun, anak kecil sampai balig (ihtilam)...",
        description: "Memahami tanda-tanda memasuki usia balig (dewasa) secara biologis dan fikih, serta kewajiban menjalankan syariat (Mukalaf).",
        points: [
          "Tanda balig bagi laki-laki: Mimpi basah (Ihtilam), tumbuh jakun, suara membesar.",
          "Tanda balig bagi perempuan: Mengalami menstruasi (Haid) pertama kali.",
          "Seseorang yang sudah balig menjadi Mukalaf: Segala kewajiban salat, puasa, dan menutup aurat dicatat penuh sebagai pahala atau dosa."
        ],
        ttsText: "Balig menandai dimulainya tanggung jawab menjalankan seluruh kewajiban syariat Islam sebagai mukalaf.",
        bossName: "Penjaga Gerbang Taklif",
        bossDesc: "Ujilah pemahamanmu mengenai tanda balig dan tanggung jawab ibadah!",
        quiz: [
          {
            question: "Seseorang yang telah mencapai usia balig dan dibebani kewajiban menjalankan hukum syariat disebut...",
            options: ["Mualaf", "Mukalaf", "Musafir", "Munafik"],
            answer: 1,
            explanation: "Mukalaf adalah orang muslim yang telah balig dan berakal sehat sehingga wajib beribadah.",
            hint: "Orang yang dikenai taklif (beban hukum)."
          },
          {
            question: "Tanda biologis balig yang khusus dialami oleh anak perempuan adalah...",
            options: ["Tumbuh kumis", "Mengalami haid (menstruasi)", "Suara menjadi berat", "Tumbuh jakun"],
            answer: 1,
            explanation: "Haid adalah siklus alami tanda kematangan fisik perempuan.",
            hint: "Siklus bulanan kaum wanita."
          },
          {
            question: "Setelah mengalami mimpi basah atau selesai masa haid, cara bersuci yang wajib dilakukan adalah...",
            options: ["Cukup berwudu saja", "Mandi wajib (mandi junub)", "Mencuci muka", "Tayamum tanpa sebab"],
            answer: 1,
            explanation: "Hadas besar wajib disucikan dengan mandi janabah/mandi wajib ke seluruh tubuh.",
            hint: "Membasahi seluruh anggota tubuh dari ujung rambut hingga kaki."
          }
        ]
      },
      5: {
        title: "Peristiwa Bersejarah Hijrah ke Madinah",
        element: "Sejarah Peradaban Islam",
        fase: "Fase B",
        arabic: "إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ",
        translation: "Jikalau kamu tidak menolongnya, sesungguhnya Allah telah menolongnya ketika orang-orang kafir mengusirnya (berdua di dalam gua).",
        description: "Kisah hijrah Nabi Muhammad saw. bersama Abu Bakar as-Siddiq dari Makkah ke Madinah, bersembunyi di Gua Sur, dan sambutan hangat kaum Yatsrib.",
        points: [
          "Hijrah dilakukan untuk menyelamatkan akidah umat dan memperluas dakwah Islam.",
          "Ali bin Abi Talib menggantikan Nabi tidur di ranjang untuk mengecoh kepungan kafir Quraisy.",
          "Peristiwa Hijrah dijadikan permulaan perhitungan Kalender Hijriah oleh Khalifah Umar bin Khattab."
        ],
        ttsText: "Hijrah ke Madinah adalah tonggak kejayaan Islam. Nabi ditemani Abu Bakar bersembunyi di Gua Sur sebelum tiba di Madinah.",
        bossName: "Pengawal Titik Hijrah",
        bossDesc: "Ujilah sejarah perjalanan hijrah agung Nabi Muhammad saw.!",
        quiz: [
          {
            question: "Sahabat setia yang mendampingi Rasulullah saw. selama perjalanan hijrah dan bersembunyi di Gua Sur adalah...",
            options: ["Umar bin Khattab", "Abu Bakar as-Siddiq", "Usman bin Affan", "Ali bin Abi Talib"],
            answer: 1,
            explanation: "Abu Bakar menemani Nabi di Gua Sur dan menempuh perjalanan gurun menuju Madinah.",
            hint: "Sahabat terdekat yang bergelar As-Siddiq."
          },
          {
            question: "Pemuda pemberani yang rela tidur di tempat tidur Nabi saat rumah beliau dikepung kaum Quraisy adalah...",
            options: ["Ali bin Abi Talib", "Zaid bin Haritsah", "Bilal bin Rabah", "Hamzah"],
            answer: 0,
            explanation: "Ali bin Abi Talib r.a. dengan gagah berani berselimut di kasur Rasulullah untuk mengelabui musuh.",
            hint: "Sepupu sekaligus menantu Rasulullah."
          },
          {
            question: "Nama kota Madinah sebelum kedatangan Rasulullah saw. bernama kota...",
            options: ["Thaif", "Yatsrib", "Kufah", "Basrah"],
            answer: 1,
            explanation: "Kota tersebut bernama Yatsrib lalu diubah menjadi Madinatul Munawwarah (Kota yang Bercahaya).",
            hint: "Dimulai dari huruf Y."
          }
        ]
      }
    },
    // KELAS 5 (FASE C)
    5: {
      1: {
        title: "Praktik Qalqalah & Berbuat Baik",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase C",
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • مِن شَرِّ مَا خَلَقَ",
        translation: "Katakanlah: 'Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya.'",
        description: "Mempelajari hukum Qalqalah (memantul pada huruf Ba, Jim, Dal, Ta, Qaf: BAJADITOK) terbagi dua: Sugra (di tengah kata) dan Kubra (di akhir ayat/waqaf).",
        points: [
          "5 Huruf Qalqalah dirangkum dalam singkatan: BA-JU-DI-TO-KO (ب, ج, د, ط, ق).",
          "Qalqalah Sugra pantulannya ringan di tengah kata, Qalqalah Kubra pantulannya kuat di akhir kata karena sukun wakaf.",
          "Menghubungkan bacaan Al-Qur'an dengan hadis berbakti kepada orang tua dan guru."
        ],
        ttsText: "Qalqalah adalah bunyi huruf yang memantul pada lima huruf. Sugra pantulan kecil dan Kubra pantulan besar.",
        bossName: "Penjaga Pantulan Suara Qalqalah",
        bossDesc: "Ujilah ketepatan hukum Qalqalah Sugra dan Kubra!",
        quiz: [
          {
            question: "Berapa jumlah huruf Qalqalah dalam ilmu tajwid?",
            options: ["3 huruf", "4 huruf", "5 huruf", "6 huruf"],
            answer: 2,
            explanation: "Huruf Qalqalah ada 5: Ba, Jim, Dal, Ta, Qaf (ق، ط، ب، ج، د).",
            hint: "Terkumpul dalam kata 'Baju Di Toko'."
          },
          {
            question: "Pantulan huruf qalqalah yang berada di akhir kalimat karena diwaqafkan (berhenti) disebut Qalqalah...",
            options: ["Sugra (Kecil)", "Kubra (Besar)", "Mutawasitah (Sedang)", "Kabir"],
            answer: 1,
            explanation: "Qalqalah Kubra terjadi di akhir kata karena waqaf, pantulannya terdengar lebih tebal dan kuat.",
            hint: "Kubra artinya besar."
          },
          {
            question: "Contoh bacaan Qalqalah Sugra di bawah ini terdapat pada kata...",
            options: ["Al-Falaq (di akhir ayat)", "Yaj'al (يَجْعَلْ)", "Kasab (di akhir)", "Ahad (di akhir)"],
            answer: 1,
            explanation: "Huruf Jim sukun di tengah kata 'Yaj'al' adalah contoh Qalqalah Sugra.",
            hint: "Huruf qalqalah sukun yang terletak di tengah kata."
          }
        ]
      },
      2: {
        title: "Iman kepada Hari Akhir (Kiamat)",
        element: "Akidah",
        fase: "Fase C",
        arabic: "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا • وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا",
        translation: "Apabila bumi diguncangkan dengan guncangan yang dahsyat, dan bumi telah mengeluarkan beban-beban berat (yang dikandung)nya. (QS. Az-Zalzalah: 1-2)",
        description: "Meyakini terjadinya Hari Kiamat: Kiamat Sugra (bencana alam, kematian seseorang) dan Kiamat Kubra (hancurnya seluruh alam semesta), serta tahapan alam akhirat.",
        points: [
          "Kiamat Kubra diawali dengan tiupan sangkakala pertama Malaikat Israfil.",
          "Tahapan Hari Akhir: Yaumul Ba'as (kebangkitan), Yaumul Mahsyar (perkumpulan), Yaumul Hisab (perhitungan), Yaumul Mizan (penimbangan).",
          "Iman kepada Hari Akhir mendorong manusia giat beramal saleh dan menjauhi maksiat."
        ],
        ttsText: "Iman kepada hari akhir mengingatkan kita bahwa dunia hanyalah sementara dan setiap amal akan dihisab di akhirat.",
        bossName: "Penjaga Neraca Mizan",
        bossDesc: "Ujilah wawasanmu mengenai tahapan dan peristiwa Hari Kiamat!",
        quiz: [
          {
            question: "Kematian seseorang atau terjadinya bencana alam seperti gempa bumi dan banjir termasuk tanda kiamat...",
            options: ["Kiamat Kubra", "Kiamat Sugra (Kecil)", "Kiamat Wusta", "Kiamat Hakiki"],
            answer: 1,
            explanation: "Kiamat Sugra adalah kiamat kecil yang terjadi dalam kehidupan dunia seperti kematian tiap individu.",
            hint: "Sugra artinya kecil."
          },
          {
            question: "Malaikat yang bertugas meniup sangkakala tanda kehancuran alam semesta dan kebangkitan adalah...",
            options: ["Malaikat Jibril", "Malaikat Israfil", "Malaikat Izrail", "Malaikat Munkar"],
            answer: 1,
            explanation: "Malaikat Israfil meniup sangkakala pertama untuk menghancurkan dunia dan kedua untuk membangkitkan manusia.",
            hint: "Peniup trompet sangkakala."
          },
          {
            question: "Hari di mana seluruh amal perbuatan manusia dihitung dan diperiksa di hadapan Allah disebut...",
            options: ["Yaumul Ba'as", "Yaumul Hisab", "Yaumul Jaza", "Yaumul Mahsyar"],
            answer: 1,
            explanation: "Yaumul Hisab adalah hari perhitungan amal kebajikan dan keburukan.",
            hint: "Kata Hisab berkaitan dengan hitungan."
          }
        ]
      },
      3: {
        title: "Akhlak kepada Teman & Anti-Bullying",
        element: "Akhlak",
        fase: "Fase C",
        arabic: "لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ",
        translation: "Janganlah suatu kaum mengolok-olok kaum yang lain, boleh jadi mereka (yang diperolok-olokkan) lebih baik dari mereka. (QS. Al-Hujurat: 11)",
        description: "Menjaga persaudaraan sesama teman sebaya, menjauhi perundungan (bullying), saling tolong-menolong, dan tidak membuka aib teman.",
        points: [
          "Melarang memanggil teman dengan julukan atau sebutan yang buruk.",
          "Membela teman yang tertindas dan menciptakan iklim sekolah SDN Kedungringin I Beji yang aman dan menyenangkan.",
          "Menjauhi sifat iri dengki dan ghibah (membicarakan keburukan orang lain)."
        ],
        ttsText: "Jangan mengolok-olok teman. Di hadapan Allah, derajat kemuliaan ditentukan oleh ketakwaan hati.",
        bossName: "Duta Sahabat Sejati",
        bossDesc: "Tunjukkan sikap terpuji menolak perundungan dan menyayangi kawan!",
        quiz: [
          {
            question: "Sikap mengejek, mengancam, atau menyakiti teman di sekolah dikenal dengan istilah...",
            options: ["Toleransi", "Perundungan (Bullying)", "Kerjasama", "Gotong royong"],
            answer: 1,
            explanation: "Perundungan adalah perilaku tercela yang dilarang keras dalam agama dan norma hukum.",
            hint: "Tindakan menindas yang menyakitkan hati."
          },
          {
            question: "Surah Al-Hujurat ayat 11 dengan tegas melarang kita untuk...",
            options: ["Saling tolong menolong", "Mengolok-olok atau memanggil dengan panggilan buruk", "Belajar bersama", "Berbagi bekal makanan"],
            answer: 1,
            explanation: "Allah melarang mencela, mengolok-olok, dan memberi gelar buruk kepada sesama mukmin.",
            hint: "Memanggil teman dengan julukan yang memalukan."
          },
          {
            question: "Tindakan terpuji jika melihat ada teman yang diejek atau disakiti adalah...",
            options: ["Ikut menertawakannya", "Membela, melerai, dan melaporkan kepada bapak/ibu guru", "Merekam dengan gembira", "Meninggalkannya begitu saja"],
            answer: 1,
            explanation: "Anak saleh berdiri membela kebenaran dan melindungi temannya dari kezaliman.",
            hint: "Melerai dan menolong kawan yang tertindas."
          }
        ]
      },
      4: {
        title: "Makanan & Minuman Halal serta Haram",
        element: "Fikih",
        fase: "Fase C",
        arabic: "كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا",
        translation: "Makanlah dari apa yang ada di bumi yang halal lagi baik (bergizi). (QS. Al-Baqarah: 168)",
        description: "Memahami kriteria makanan Halalan Toyyiban (halal zatnya, halal cara perolehannya, dan bergizi), serta bahaya mengonsumsi makanan/minuman haram.",
        points: [
          "Halal mencakup: Halal zatnya, halal cara memprosesnya, dan halal cara memperolehnya.",
          "Makanan haram: Bangkai, darah, daging babi, hewan yang disembelih tanpa nama Allah, dan khamr (minuman keras).",
          "Makanan halal menumbuhkan energi positif untuk beribadah dan menjamin terkabulnya doa."
        ],
        ttsText: "Konsumsilah makanan yang halal lagi baik. Makanan haram mengeraskan hati dan menghalangi terkabulnya doa.",
        bossName: "Penjaga Rezeki Halal",
        bossDesc: "Pecahkan ujian seputar fikih makanan halal dan haram!",
        quiz: [
          {
            question: "Konsep makanan yang diperintahkan dalam Al-Qur'an adalah 'Halalan Toyyiban', kata Toyyib artinya...",
            options: ["Mahal harganya", "Baik, bersih, dan bergizi bagi tubuh", "Berasal dari luar negeri", "Berporsi banyak"],
            answer: 1,
            explanation: "Toyyib artinya baik, sehat, aman, dan bermanfaat bagi kesehatan tubuh.",
            hint: "Baik dan bermanfaat bagi kesehatan jasmani."
          },
          {
            question: "Hewan air/laut yang halal dimakan bangkainya tanpa perlu disembelih adalah...",
            options: ["Katak", "Ikan dan Belalang", "Buaya", "Ular air"],
            answer: 1,
            explanation: "Rasulullah menegaskan ada dua bangkai yang halal: ikan laut dan belalang.",
            hint: "Bangkai yang halal menurut hadis Nabi."
          },
          {
            question: "Salah satu dampak buruk mengonsumsi makanan dan minuman haram adalah...",
            options: ["Badan bertambah tinggi", "Doa terhalang dan sulit dikabulkan Allah", "Menjadi pintar", "Mendapat banyak kawan"],
            answer: 1,
            explanation: "Makanan haram menjadi penghalang terbesar doa seorang hamba diijabah Allah.",
            hint: "Membuat doa terhalang dan hati gelap."
          }
        ]
      },
      5: {
        title: "Fathu Makkah & Haji Wada",
        element: "Sejarah Peradaban Islam",
        fase: "Fase C",
        arabic: "جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا",
        translation: "Telah datang kebenaran dan telah lenyap kebatilan. Sungguh, kebatilan itu adalah sesuatu yang pasti lenyap. (QS. Al-Isra: 81)",
        description: "Peristiwa pembebasan kota Makkah (Fathu Makkah) tanpa pertumpahan darah pada tahun 8 H, pembersihan berhala di Ka'bah, serta khutbah perpisahan (Haji Wada).",
        points: [
          "Fathu Makkah terjadi karena pelanggaran kaum Quraisy terhadap Perjanjian Hudaibiah.",
          "Nabi memberi amnesti umum dan memaafkan penduduk Makkah dengan penuh kelembutan.",
          "Pada Haji Wada, turun wahyu terakhir Surah al-Ma'idah ayat 3 yang menegaskan kesempurnaan agama Islam."
        ],
        ttsText: "Fathu Makkah adalah pembebasan kota Makkah penuh kedamaian. Haji Wada adalah haji perpisahan Nabi Muhammad saw.",
        bossName: "Penjaga Pintu Ka'bah Suci",
        bossDesc: "Ujilah sejarah pembebasan kota Makkah dan Haji Perpisahan Nabi!",
        quiz: [
          {
            question: "Peristiwa pembebasan kota Makkah oleh 10.000 pasukan muslimin tanpa pertempuran berdarah disebut...",
            options: ["Perang Badar", "Fathu Makkah", "Perang Uhud", "Perjanjian Hudaibiah"],
            answer: 1,
            explanation: "Fathu Makkah adalah kemenangan gemilang penaklukan Makkah yang penuh ampunan dan damai.",
            hint: "Pembebasan kota suci Makkah."
          },
          {
            question: "Sikap Rasulullah saw. kepada kaum kafir Quraisy yang dahulu pernah menyiksa dan mengusirnya saat Fathu Makkah adalah...",
            options: ["Membalas dendam dan memenjarakan mereka", "Memaafkan mereka seluruhnya tanpa hukuman", "Mengusir mereka dari Makkah", "Menyita semua hartanya"],
            answer: 1,
            explanation: "Nabi bersabda: 'Pergilah kalian, hari ini tidak ada cercaan atas kalian, kalian semua bebas'.",
            hint: "Memperlihatkan akhlak mulia memaafkan musuh."
          },
          {
            question: "Ibadah haji terakhir yang dilaksanakan oleh Nabi Muhammad saw. sebelum beliau wafat dikenal sebagai...",
            options: ["Haji Qiran", "Haji Wada' (Haji Perpisahan)", "Haji Ifrad", "Haji Tamattu'"],
            answer: 1,
            explanation: "Wada' berarti perpisahan, di mana Nabi menyampaikan khutbah agung perpisahan kepada umatnya.",
            hint: "Haji perpisahan."
          }
        ]
      }
    },
    // KELAS 6 (FASE C) - SINKRON DENGAN MATERI Q.S. AD-DUHA, Q.S. AL-INSYIRAH & HUKUM BACAAN GUNNAH (10 SOAL AKM)
    6: {
      1: {
        title: "Q.S. ad-Duha, Q.S. al-Insyirah & Hukum Bacaan Gunnah",
        element: "Al-Qur'an dan Hadis",
        fase: "Fase C",
        arabic: "فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ • فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Maka terhadap anak yatim janganlah engkau berlaku sewenang-wenang (QS. Ad-Duha: 9) • Maka sesungguhnya beserta kesulitan ada kemudahan (QS. Al-Insyirah: 5).",
        description: "Mempelajari bacaan, arti, dan pesan pokok Q.S. ad-Duha (11 ayat), Q.S. al-Insyirah (8 ayat), serta penerapan hukum bacaan tajwid Gunnah Musyaddadah (Nun bertasydid نّ dan Mim bertasydid مّ) dalam kehidupan sehari-hari.",
        points: [
          "Q.S. ad-Duha (11 ayat, Makkiyah): Ad-Duha artinya waktu matahari sepenggalahan naik (pagi). Allah menegaskan tidak meninggalkan Nabi Muhammad saw., memerintahkan menyayangi anak yatim, tidak menghardik peminta-minta, dan mensyukuri nikmat Allah.",
          "Q.S. al-Insyirah (8 ayat, Makkiyah): Al-Insyirah artinya melapangkan dada. Mengajarkan bahwa bersama setiap kesulitan selalu ada kemudahan (ayat 5-6), disiplin terus berkarya setelah selesai suatu urusan (ayat 7), dan hanya berharap kepada Allah (ayat 8).",
          "Hukum Bacaan Gunnah (Gunnah Musyaddadah): Apabila terdapat huruf Nun bertasydid (نّ) atau Mim bertasydid (مّ), wajib dibaca mendengung jelas keluar dari pangkal hidung (al-khaisyum) selama 2 harakat (ketukan).",
          "Contoh Gunnah di kedua surah: فَأَمَّا الْيَتِيمَ dan وَأَمَّا السَّائِلَ (Mim bertasydid di Q.S. ad-Duha), serta فَإِنَّ مَعَ الْعُسْرِ dan إِنَّ مَعَ الْعُسْرِ (Nun bertasydid di Q.S. al-Insyirah)."
        ],
        ttsText: "Materi PAI Kelas 6 Al-Qur'an dan Hadis membahas Surah ad-Duha, Surah al-Insyirah, dan hukum bacaan Gunnah. Surah ad-Duha terdiri atas sebelas ayat yang mengajarkan syukur dan kasih sayang kepada anak yatim. Surah al-Insyirah terdiri atas delapan ayat yang mengajarkan ketabahan karena bersama kesulitan ada kemudahan. Sedangkan hukum bacaan Gunnah berlaku pada huruf nun bertasydid dan mim bertasydid yang dibaca mendengung dua harakat melalui pangkal hidung.",
        bossName: "Rintangan Pemahaman: Q.S. ad-Duha, al-Insyirah & Gunnah",
        bossDesc: "Taklukkan 10 soal AKM Q.S. ad-Duha, Q.S. al-Insyirah, dan Hukum Bacaan Gunnah dengan Pesawat 3D!",
        forestGates: GRADE6_STAGE1_FOREST_GATES,
        quiz: [
          {
            difficulty: "mudah",
            stimulus: "[AKM Mudah • Mengenal Q.S. ad-Duha]\nSetiap pagi sebelum belajar di SDN Kedungringin I Beji, siswa kelas 6 bersama-sama membaca Q.S. ad-Duha yang terdiri atas 11 ayat dan termasuk golongan surah Makkiyah.",
            question: "Arti dari nama Surah 'ad-Duha' (الضُّحَىٰ) yang menjadi sumpah Allah pada ayat pertama adalah...",
            options: [
              "Waktu matahari sepenggalahan naik (waktu pagi)",
              "Waktu malam ketika gelap gulita",
              "Waktu terbenamnya matahari di sore hari",
              "Waktu fajar sebelum terbit matahari"
            ],
            answer: 0,
            explanation: "Ad-Duha artinya waktu matahari sepenggalahan naik di pagi hari, saat cahaya mulai terang dan aktivitas penuh semangat dimulai.",
            hint: "Waktu pelaksanaan salat sunah Duha di pagi hari."
          },
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Tajwid Hukum Bacaan Gunnah]\nPerhatikan dua potongan ayat berikut:\n(1) فَإِنَّ مَعَ الْعُسْرِ يُسْرًا (Q.S. al-Insyirah: 5)\n(2) فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ (Q.S. ad-Duha: 9)\nPada lafaz فَإِنَّ terdapat Nun bertasydid (نّ) dan pada lafaz فَأَمَّا terdapat Mim bertasydid (مّ).",
            question: "Hukum bacaan tajwid pada huruf Nun bertasydid (نّ) dan Mim bertasydid (مّ) beserta cara membacanya yang tepat adalah...",
            options: [
              "Gunah Musyaddadah, dibaca mendengung dari pangkal hidung selama 2 harakat",
              "Izhar Halqi, dibaca jelas dan pendek tanpa suara dengung",
              "Qalqalah Kubra, dibaca memantul kuat di akhir ayat",
              "Mad Tabii, dibaca memanjang tanpa melalui rongga hidung"
            ],
            answer: 0,
            explanation: "Huruf Nun bertasydid (نّ) dan Mim bertasydid (مّ) merupakan hukum bacaan Gunnah (Gunnah Musyaddadah) yang wajib dibaca mendengung melalui pangkal hidung (al-khaisyum) sepanjang 2 harakat.",
            hint: "Gunnah selalu ditandai tasydid pada huruf Nun atau Mim dengan bunyi dengung 2 ketukan."
          },
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Asbabun Nuzul Q.S. ad-Duha]\nKetika wahyu sempat terhenti turun beberapa waktu (fatratul wahyi), kaum musyrikin Quraisy mengejek bahwa Tuhan telah meninggalkan dan membenci Nabi Muhammad saw. Allah Swt. pun menurunkan Q.S. ad-Duha ayat 3: مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ.",
            question: "Pesan penenang hati yang ditegaskan Allah Swt. dalam Q.S. ad-Duha ayat 3 tersebut adalah...",
            options: [
              "Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak pula membencimu",
              "Wahyu Al-Qur'an telah selesai diturunkan seluruhnya di Makkah",
              "Nabi Muhammad saw. diperintahkan membalas ejekan kaum Quraisy",
              "Kehidupan dunia lebih utama dibandingkan kehidupan akhirat"
            ],
            answer: 0,
            explanation: "Ayat ke-3 Q.S. ad-Duha menghibur Nabi Muhammad saw. dan umat beriman bahwa Allah Swt. tidak pernah meninggalkan maupun membenci hamba-Nya yang taat.",
            hint: "Perhatikan kata 'ma wadda'aka' (tidak meninggalkanmu) dan 'ma qala' (tidak membencimu)."
          },
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Pengamalan Q.S. ad-Duha Ayat 9-10]\nDi kelas 6 ada seorang siswa baru yang ayahnya telah wafat (anak yatim). Suatu hari, ia lupa membawa penggaris dan dengan sopan meminjam kepada teman sebangkunya.",
            question: "Sikap yang paling sesuai dengan perintah Q.S. ad-Duha ayat 9 (فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ) dan ayat 10 (وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ) adalah...",
            options: [
              "Meminjamkan penggaris dengan ramah, menghiburnya, dan memperlakukannya penuh kasih sayang",
              "Menolaknya dengan suara keras agar ia jera dan tidak lupa lagi",
              "Meminjamkan penggaris tetapi sambil menyindir di depan kelas",
              "Membiarkannya saja dan pura-pura tidak mendengar permintaannya"
            ],
            answer: 0,
            explanation: "Q.S. ad-Duha ayat 9 melarang berlaku sewenang-wenang kepada anak yatim, dan ayat 10 melarang menghardik orang yang meminta bantuan.",
            hint: "Pilih sikap santun, menyayangi anak yatim, dan tidak membentak orang yang meminta."
          },
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Makna Q.S. ad-Duha Ayat 11]\nAyat penutup Q.S. ad-Duha berbunyi: وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ (Dan terhadap nikmat Tuhanmu, hendaklah engkau nyatakan dengan bersyukur).",
            question: "Wujud nyata mengamalkan Q.S. ad-Duha ayat 11 bagi seorang siswa kelas 6 yang meraih prestasi dan kecukupan rezeki adalah...",
            options: [
              "Mengucap Alhamdulillah, tetap rendah hati, dan berbagi ilmu atau sedekah kepada sesama",
              "Memamerkan nilai dan barang mahal agar dipuji teman-teman",
              "Menyembunyikan kemampuan belajarnya agar tidak dimintai bantuan teman",
              "Merasa semua keberhasilan murni karena kehebatan diri sendiri"
            ],
            answer: 0,
            explanation: "Menyatakan nikmat Allah (tahadduts bin-ni'mah) diwujudkan dengan syukur lisan, rendah hati, serta memanfaatkan nikmat untuk membantu sesama.",
            hint: "Syukur nikmat dilakukan dengan rendah hati dan berbagi manfaat, bukan riya."
          },
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Memahami Q.S. al-Insyirah Ayat 1-4]\nDalam Q.S. al-Insyirah ayat 1-4, Allah Swt. mengingatkan nikmat-nikmat besar yang telah dianugerahkan kepada Nabi Muhammad saw., diawali dengan ayat أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ.",
            question: "Tiga nikmat utama yang Allah Swt. sebutkan pada ayat 1 hingga 4 Q.S. al-Insyirah secara berurutan adalah...",
            options: [
              "Melapangkan dada, meringankan beban berat, dan meninggikan sebutan nama beliau",
              "Memberikan kekayaan istana, pasukan besar, dan umur panjang",
              "Menurunkan hujan lebat, kebun yang subur, dan hewan ternak",
              "Memberikan mukjizat membelah laut dan menyembuhkan orang sakit"
            ],
            answer: 0,
            explanation: "Q.S. al-Insyirah ayat 1-4 menguraikan 3 karunia Allah: kelapangan dada (ayat 1), diringankannya beban (ayat 2-3), dan ditinggikannya sebutan nama Nabi (ayat 4).",
            hint: "Nasyrah laka sadrak = melapangkan dadamu; warafa'na laka dzikrak = meninggikan sebutanmu."
          },
          {
            difficulty: "sedang",
            stimulus: "[AKM Sedang • Kontekstual Q.S. al-Insyirah Ayat 5-6]\nRafi, siswa Kelas 6 SDN Kedungringin I Beji, sempat gagal menyelesaikan latihan soal ujian sekolah dan merasa cemas. Guru mengingatkannya pada Q.S. al-Insyirah ayat 5-6: فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا.",
            question: "Makna optimisme dan tindakan terbaik bagi Rafi berdasarkan pengulangan ayat 5 dan 6 Q.S. al-Insyirah tersebut adalah...",
            options: [
              "Tetap tenang, berdoa, dan terus berlatih karena di balik satu kesulitan Allah siapkan banyak kemudahan",
              "Berhenti belajar dan memilih menyalin jawaban teman saat ujian",
              "Menyerah karena menganggap dirinya tidak berbakat dalam pelajaran tersebut",
              "Menyalahkan soal latihan yang dianggap terlalu rumit"
            ],
            answer: 0,
            explanation: "Pengulangan ayat 5-6 menegaskan bahwa satu kesulitan (al-'usri) selalu diiringi banyak kemudahan (yusran) bagi hamba yang sabar dan tekun berikhtiar.",
            hint: "Pesan utamanya adalah pantang putus asa dan percaya pertolongan Allah setelah usaha."
          },
          {
            difficulty: "sulit",
            stimulus: "[AKM Sulit • Analisis Tajwid Gunnah Lintas Surah]\nPerhatikan empat potongan ayat dari Q.S. ad-Duha dan Q.S. al-Insyirah berikut:\n(1) وَالضُّحَىٰ  (2) فَأَمَّا الْيَتِيمَ  (3) فَإِنَّ مَعَ الْعُسْرِ  (4) فَلَا تَقْهَرْ",
            question: "Pasangan nomor lafaz yang sama-sama mengandung hukum bacaan Gunnah Musyaddadah sehingga wajib dibaca dengung 2 harakat adalah...",
            options: [
              "Nomor (2) dan (3) karena mengandung huruf Mim bertasydid (مّ) dan Nun bertasydid (نّ)",
              "Nomor (1) dan (2) karena keduanya memiliki tanda tasydid di awal kata",
              "Nomor (3) dan (4) karena berada di akhir ayat surah Makkiyah",
              "Nomor (1) dan (4) karena dibaca jelas tanpa dengung"
            ],
            answer: 0,
            explanation: "Meski وَالضُّحَىٰ memiliki tasydid pada huruf Dhad (ضّ), itu adalah Alif Lam Syamsiyah bukan Gunnah. Gunnah Musyaddadah khusus terjadi pada Mim bertasydid (فَأَمَّا) dan Nun bertasydid (فَإِنَّ).",
            hint: "Hati-hati pengecoh! Tidak semua tasydid adalah Gunnah; khusus huruf Nun (نّ) dan Mim (مّ) saja."
          },
          {
            difficulty: "sulit",
            stimulus: "[AKM Sulit • Evaluasi & Refleksi Q.S. al-Insyirah Ayat 7-8]\nPerhatikan dua ayat terakhir Q.S. al-Insyirah:\nفَإِذَا فَرَغْتَ فَانصَبْ (7) وَإِلَىٰ رَبِّكَ فَارْغَبْ (8)\nSetelah selesai mengerjakan seluruh ujian semester, Dika langsung bermain gim berjam-jam hingga lupa salat Asar, sementara Zahra beristirahat secukupnya lalu tadarus, membantu ibu, dan berdoa memohon hasil terbaik.",
            question: "Evaluasi yang paling tepat terhadap perilaku Dika dan Zahra menurut pesan Q.S. al-Insyirah ayat 7 dan 8 adalah...",
            options: [
              "Zahra mengamalkan ayat 7-8 dengan mengisi waktu luang secara produktif dan menggantungkan harapan hanya kepada Allah, sedangkan Dika lalai memanfaatkan waktu",
              "Dika sudah benar karena ayat 7 memerintahkan beristirahat total tanpa batas setelah ujian selesai",
              "Keduanya belum tepat karena setelah selesai ujian siswa wajib terus belajar tanpa tidur",
              "Zahra kurang tepat karena membantu orang tua tidak termasuk ibadah dalam ayat 7"
            ],
            answer: 0,
            explanation: "Ayat 7 mengajarkan etos kerja berkelanjutan (tidak menyia-nyiakan waktu luang setelah satu urusan selesai), dan ayat 8 mengajarkan tawakal penuh hanya kepada Allah Swt.",
            hint: "Bandingkan siapa yang memanfaatkan waktu luang untuk amal produktif dan berserah diri kepada Allah."
          },
          {
            difficulty: "sulit",
            stimulus: "[AKM Sulit • Sintesis Nilai Q.S. ad-Duha & Q.S. al-Insyirah]\nPanitia kelas 6 mengadakan bakti sosial untuk anak yatim dan warga kurang mampu. Di tengah persiapan, turun hujan deras sehingga beberapa anggota panitia panik dan ingin membatalkan acara. Ketua kelas menenangkan teman-temannya, mengajak berdoa, mencari aula terdekat, dan tetap menyalurkan bantuan dengan ramah.",
            question: "Bagaimana tindakan ketua kelas tersebut memadukan nilai utama Q.S. ad-Duha dan Q.S. al-Insyirah secara utuh?",
            options: [
              "Memadukan kasih sayang pada anak yatim & syukur nikmat (Q.S. ad-Duha) dengan kelapangan dada, solusi di balik kesulitan, dan tawakal kepada Allah (Q.S. al-Insyirah)",
              "Hanya mengamalkan Q.S. ad-Duha saja karena kegiatan tersebut dilakukan pada pagi hari",
              "Hanya mengamalkan hukum Gunnah karena panitia membaca doa bersama dengan suara keras",
              "Menunjukkan bahwa kegiatan sosial sebaiknya ditunda sampai tidak ada hambatan sama sekali"
            ],
            answer: 0,
            explanation: "Q.S. ad-Duha menanamkan kepedulian sosial (yatim & duafa) dan syukur nikmat, sedangkan Q.S. al-Insyirah melatih kelapangan hati, ketangguhan mencari solusi saat sulit, serta tawakal kepada Allah Swt.",
            hint: "Gabungkan pesan sosial/syukur dari Q.S. ad-Duha dengan pesan ketabahan/tawakal dari Q.S. al-Insyirah."
          }
        ]
      },
      2: {
        title: "Iman kepada Qada dan Qadar",
        element: "Akidah",
        fase: "Fase C",
        arabic: "إِنَّا كُلَّ شَيْءٍ خَلَقْنَاهُ بِقَدَرٍ",
        translation: "Sungguh, Kami menciptakan segala sesuatu menurut ukuran (takdir). (QS. Al-Qamar: 49)",
        description: "Meyakini rukun iman keenam: Qada (ketetapan rencana Allah sejak zaman azali) dan Qadar (realisasi takdir di dunia), serta pembagian Takdir Muallaq dan Mubram.",
        points: [
          "Takdir Muallaq: Takdir yang dapat diubah melalui ikhtiar sungguh-sungguh dan doa (contoh: kepandaian, kesehatan).",
          "Takdir Mubram: Takdir mutlak yang tidak dapat diubah manusia (contoh: jenis kelamin kelahiran, kematian).",
          "Manfaat iman kepada takdir: Hati menjadi tabah, bersyukur saat sukses, dan tidak berputus asa."
        ],
        ttsText: "Takdir terbagi dua: takdir muallaq yang bisa diubah dengan ikhtiar dan doa, serta takdir mubram yang mutlak ketentuan Allah.",
        bossName: "Penjaga Lembaran Lauhul Mahfuz",
        bossDesc: "Ujilah pemahamanmu mengenai rukun iman keenam: Qada dan Qadar!",
        quiz: [
          {
            question: "Takdir yang erat kaitannya dengan usaha, ikhtiar, dan doa manusia sehingga dapat diubah disebut Takdir...",
            options: ["Mubram", "Muallaq", "Azali", "Fasik"],
            answer: 1,
            explanation: "Takdir Muallaq tergantung pada ikhtiar manusia, seperti orang rajin belajar menjadi berprestasi.",
            hint: "Muallaq artinya yang digantungkan pada ikhtiar."
          },
          {
            question: "Contoh dari Takdir Mubram (takdir yang pasti terjadi dan tidak bisa diubah manusia) adalah...",
            options: ["Mendapat nilai ulangan bagus", "Menjadi juara kelas", "Waktu dan tempat kematian seseorang", "Memiliki tubuh atletis"],
            answer: 2,
            explanation: "Kematian (ajal) adalah ketentuan mutlak Allah yang tidak dapat dimajukan atau dimundurkan sesaat pun.",
            hint: "Peristiwa ajal / kematian."
          },
          {
            question: "Sikap orang mukmin yang beriman teguh kepada Qada dan Qadar ketika ditimpa musibah adalah...",
            options: ["Menyalahkan takdir Allah", "Sabar, tabah, dan introspeksi diri serta meyakini ada hikmah", "Putus asa dan mogok makan", "Marah kepada semua orang"],
            answer: 1,
            explanation: "Orang beriman akan mengucapkan istirja' (Inna lillahi wa inna ilaihi raji'un) dan berprasangka baik pada hikmah Allah.",
            hint: "Sabar dan mengambil hikmah positif."
          }
        ]
      },
      3: {
        title: "Akhlak kepada Hewan & Lingkungan Hidup",
        element: "Akhlak",
        fase: "Fase C",
        arabic: "فِي كُلِّ كَبِدٍ رَطْبَةٍ أَجْرٌ",
        translation: "Pada setiap makhluk yang bernyawa terdapat pahala sedekah (jika disayangi). (HR. Bukhari)",
        description: "Menjaga kelestarian lingkungan hidup sebagai khalifah di bumi: Menanam pohon, merawat hewan, tidak menyiksa binatang, serta hemat air dan energi.",
        points: [
          "Kisah wanita yang diampuni dosanya karena memberi minum anjing yang kehausan dengan sepatunya.",
          "Larangan menebang pohon sembarangan dan mencemari sumber mata air sungai.",
          "Menjaga kebersihan dan kerindangan halaman SDN Kedungringin I Beji sebagai wujud kepedulian lingkungan."
        ],
        ttsText: "Sayangilah hewan dan rawatlah lingkungan hidup. Setiap kasih sayang kepada makhluk bernyawa mendatangkan pahala sedekah.",
        bossName: "Penjaga Rindang Bumi",
        bossDesc: "Tunjukkan kepedulian dan akhlakmu terhadap flora, fauna, dan bumi!",
        quiz: [
          {
            question: "Salah satu contoh akhlak terpuji terhadap hewan piaraan di rumah adalah...",
            options: ["Mengurungnya tanpa diberi makan", "Memberi makan dan minum yang layak serta kandang bersih", "Memukulnya saat bosan", "Mengadunya dengan hewan lain"],
            answer: 1,
            explanation: "Rasulullah mewajibkan berbuat ihsan kepada hewan dengan memberi makan dan merawatnya.",
            hint: "Merawat dan memberi makan secara rutin."
          },
          {
            question: "Tindakan pelestarian lingkungan yang dapat dilakukan siswa di lingkungan SDN Kedungringin I Beji adalah...",
            options: ["Membuang sampah plastik ke selokan", "Menanam pohon dan merawat tanaman taman sekolah", "Mencoret-coret meja dan dinding", "Membiarkan kran air meluber"],
            answer: 1,
            explanation: "Menanam tanaman dan menjaga kebersihan merupakan amanah khalifah fil ardh.",
            hint: "Penghijauan dan menanam bunga."
          },
          {
            question: "Kisah seorang wanita yang diampuni dosanya oleh Allah menurut hadis Nabi adalah karena...",
            options: ["Memberi minum anjing yang kehausan dari sumur", "Menyimpan banyak emas", "Berperang sendirian", "Menjual dagangan mahal"],
            answer: 0,
            explanation: "Kasih sayangnya mengambilkan air dengan sepatunya untuk anjing yang sekarat mendatangkan ampunan Allah.",
            hint: "Menolong anjing yang kehausan."
          }
        ]
      },
      4: {
        title: "Wakaf: Amal Jariyah yang Mengalir",
        element: "Fikih",
        fase: "Fase C",
        arabic: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ...",
        translation: "Apabila anak cucu Adam meninggal dunia, terputuslah amalnya kecuali tiga perkara: sedekah jariyah (wakaf)... (HR. Muslim)",
        description: "Memahami hakikat Wakaf: Menahan pokok harta dan menyedekahkan manfaatnya untuk kepentingan umat secara abadi, rukun wakaf, dan nazhir wakaf.",
        points: [
          "Sedekah jariyah dalam hadis Nabi adalah amalan wakaf yang pahalanya terus mengalir walau pewakaf telah wafat.",
          "Rukun Wakaf: Wakif (pewakaf), Mauquf (harta yang diwakafkan), Mauquf 'alaih (penerima manfaat), dan Sighat (ikrar wakaf).",
          "Contoh wakaf: Tanah untuk masjid, madrasah, sumur air bersih, rumah sakit, hingga wakaf uang produktif."
        ],
        ttsText: "Wakaf adalah sedekah jariyah yang pahalanya terus mengalir abadi meskipun orang yang berwakaf telah meninggal dunia.",
        bossName: "Penjaga Wakaf Abadi",
        bossDesc: "Ujilah wawasanmu mengenai ketentuan fikih wakaf umat!",
        quiz: [
          {
            question: "Pahala amalan yang tidak akan terputus meskipun seseorang telah meninggal dunia menurut hadis adalah...",
            options: ["Harta warisan yang banyak", "Sedekah jariyah (wakaf), ilmu bermanfaat, dan anak saleh yang mendoakannya", "Gelar dan jabatan", "Rumah mewah"],
            answer: 1,
            explanation: "Tiga amalan abadi: sedekah jariyah, ilmu yang dimanfaatkan, dan doa anak saleh.",
            hint: "Tiga amalan dalam hadis kematian."
          },
          {
            question: "Orang atau lembaga yang diberi amanah untuk mengelola dan memelihara harta wakaf disebut...",
            options: ["Wakif", "Nazhir", "Muazin", "Muzaki"],
            answer: 1,
            explanation: "Nazhir adalah pihak yang bertanggung jawab mengelola harta wakaf agar tetap produktif dan bermanfaat.",
            hint: "Pengelola harta wakaf."
          },
          {
            question: "Harta yang diwakafkan tidak boleh...",
            options: ["Dimanfaatkan masyarakat", "Dijual, dihibahkan, atau diwariskan untuk kepentingan pribadi", "Dirawat dengan baik", "Dicatat di pengadilan"],
            answer: 1,
            explanation: "Pokok harta wakaf harus ditahan (kekal) dan tidak boleh dipindahtangankan kepemilikannya.",
            hint: "Tidak boleh diubah menjadi milik pribadi atau dijual."
          }
        ]
      },
      5: {
        title: "Keteladanan Usman & Ali bin Abi Talib",
        element: "Sejarah Peradaban Islam",
        fase: "Fase C",
        arabic: "أَنَا مَدِينَةُ الْعِلْمِ وَعَلِيٌّ بَابُهَا",
        translation: "Aku (Muhammad) adalah kotanya ilmu dan Ali adalah pintu gerbangnya. (Hadis Riwayat Tirmidzi)",
        description: "Meneladani kedermawanan Khalifah Usman bin Affan (pemilik dua cahaya / Zun Nurain) dan kecerdasan serta keberanian Khalifah Ali bin Abi Talib (Babul Ilmi).",
        points: [
          "Usman bin Affan membeli Sumur Raumah dari orang Yahudi dan mewakafkannya gratis untuk seluruh penduduk Madinah.",
          "Usman membukukan Al-Qur'an dalam satu standarisasi ejaan yang disebut Mushaf Usmani.",
          "Ali bin Abi Talib dijuluki 'Babul Ilmi' (Pintu Gerbang Ilmu) karena kecerdasan fatwa dan keberaniannya di setiap medan perjuangan."
        ],
        ttsText: "Usman bin Affan dermawan mewakafkan sumur Raumah dan membukukan Al-Qur'an. Ali bin Abi Talib cerdas berilmu tinggi dan pemberani.",
        bossName: "Penjaga Gerbang Khulafaur Rasyidin Terakhir",
        bossDesc: "Ujilah kisah teladan kedermawanan Usman dan kecerdasan Ali r.a.!",
        quiz: [
          {
            question: "Sahabat dermawan yang membeli sumur Raumah dan mewakafkannya untuk seluruh warga Madinah adalah...",
            options: ["Abu Bakar as-Siddiq", "Umar bin Khattab", "Usman bin Affan", "Abdurrahman bin Auf"],
            answer: 2,
            explanation: "Usman bin Affan r.a. membeli sumur air tawar Raumah dengan harga mahal demi kemaslahatan umat.",
            hint: "Khalifah ketiga yang bergelar Zun Nurain."
          },
          {
            question: "Gelar kemuliaan 'Babul Ilmi' (Pintu Gerbang Ilmu) disematkan oleh Nabi kepada sahabat...",
            options: ["Ali bin Abi Talib r.a.", "Zaid bin Tsabit", "Mu'adz bin Jabal", "Khalid bin Walid"],
            answer: 0,
            explanation: "Nabi bersabda: 'Ana madinatul ilmi wa Aliyyun babuha' (Aku kota ilmu dan Ali pintu gerbangnya).",
            hint: "Khalifah keempat yang merupakan menantu Rasulullah."
          },
          {
            question: "Standardisasi penulisan mushaf Al-Qur'an yang kita baca hingga hari ini dinamakan...",
            options: ["Mushaf Kufi", "Mushaf Usmani", "Mushaf Madani", "Mushaf Basri"],
            answer: 1,
            explanation: "Kodifikasi resmi pada masa Khalifah Usman bin Affan dinamakan Mushaf Usmani (Rasm Usmani).",
            hint: "Dinamai sesuai nama Khalifah Usman bin Affan."
          }
        ]
      }
    }
  }
};
