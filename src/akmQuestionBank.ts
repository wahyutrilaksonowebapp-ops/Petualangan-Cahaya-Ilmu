import { QuizQuestion } from './curriculumData.ts';

export type DifficultyLevel = 'mudah' | 'sedang' | 'sulit';

export interface AkmQuizQuestion extends QuizQuestion {
  difficulty: DifficultyLevel;
  elementId: number;
}

/**
 * Curated AKM Question Pool for all 5 PAI & BP Elements (CP 020/2026).
 * Each element contains 15+ rich AKM questions tagged with difficulty:
 * 'mudah' (10%), 'sedang' (60%), 'sulit' (30%).
 */
const ELEMENT_AKM_BANK: Record<number, AkmQuizQuestion[]> = {
  // ==================== ELEMEN 1: AL-QUR'AN & HADIS ====================
  1: [
    // MUDAH (3)
    {
      elementId: 1,
      difficulty: 'mudah',
      stimulus: 'Saat tadarus pagi di kelas, guru menampilkan papan huruf hijaiyah berharakat dasar agar siswa dapat membaca Al-Qur\'an dengan lancar.',
      question: 'Tanda baca garis miring di atas huruf hijaiyah yang menghasilkan bunyi vokal "A" disebut...',
      options: ['Fathah', 'Kasrah', 'Dammah', 'Sukun'],
      answer: 0,
      explanation: 'Fathah terletak di atas huruf dan dibaca dengan bunyi vokal "a".',
      hint: 'Letaknya di atas huruf, seperti huruf ba menjadi "ba".',
    },
    {
      elementId: 1,
      difficulty: 'mudah',
      stimulus: 'Sebelum tidur malam, Aisyah membiasakan membaca Surah al-Falaq dan Surah an-Nas untuk memohon perlindungan kepada Allah Swt.',
      question: 'Jumlah ayat dalam Surah an-Nas adalah...',
      options: ['4 ayat', '5 ayat', '6 ayat', '7 ayat'],
      answer: 2,
      explanation: 'Surah an-Nas terdiri atas 6 ayat dan termasuk surah Makkiyah.',
      hint: 'Lebih satu ayat dari Surah al-Falaq.',
    },
    {
      elementId: 1,
      difficulty: 'mudah',
      stimulus: 'Di Hutan Al-Qur\'an, terpampang kaligrafi Surah ad-Duha yang sering dibaca saat melaksanakan salat Duha di sekolah.',
      question: 'Arti kata "Ad-Duha" pada nama Surah ad-Duha adalah...',
      options: ['Waktu malam yang gelap', 'Waktu matahari sepenggalahan naik (pagi)', 'Waktu fajar menyingsing', 'Waktu senja menjelang magrib'],
      answer: 1,
      explanation: 'Ad-Duha berarti waktu pagi ketika matahari mulai naik sepenggalahan.',
      hint: 'Waktu salat sunah di pagi hari sebelum zuhur.',
    },
    // SEDANG (9)
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Ahmad membaca potongan ayat "إِنَّ اللَّهَ" (Innallaha) dan "ثُمَّ" (Tsumma) pada lembar tadarus. Guru mengingatkan agar bunyi nun dan mim bertasydid ditahan sejenak di pangkal hidung.',
      question: 'Hukum bacaan tajwid pada huruf Nun bertasydid (نّ) dan Mim bertasydid (مّ) tersebut adalah...',
      options: ['Izhar Halqi', 'Gunah Musyaddadah', 'Qalqalah Kubra', 'Mad Wajib Muttasil'],
      answer: 1,
      explanation: 'Setiap huruf Nun atau Mim bertasydid wajib dibaca mendengung (Gunah) selama 2 harakat.',
      hint: 'Mengandung bunyi dengung dari rongga hidung.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Dalam Surah al-Ma\'un dijelaskan ciri-ciri orang yang mendustakan agama, salah satunya adalah orang yang menghardik anak yatim dan enggan memberi makan orang miskin.',
      question: 'Sikap siswa di sekolah yang paling sesuai dengan pengamalan pesan pokok Surah al-Ma\'un adalah...',
      options: ['Menyisihkan uang saku untuk santunan yatim & teman yang membutuhkan', 'Memamerkan alat tulis baru agar dipuji teman sekelas', 'Menunda-nunda salat Zuhur hingga waktu hampir habis', 'Menolak kerja bakti membersihkan kelas'],
      answer: 0,
      explanation: 'Surah al-Ma\'un mengajarkan kepedulian sosial terhadap anak yatim dan kaum duafa serta salat yang khusyuk.',
      hint: 'Pilih tindakan nyata yang menunjukkan kepedulian sosial.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Rasulullah saw. bersabda: "Tangan di atas lebih baik daripada tangan di bawah." Hadis ini terpahat di gerbang Hutan Hadis.',
      question: 'Makna ungkapan "tangan di atas" dalam hadis tersebut adalah orang yang...',
      options: ['Suka meminta-minta bantuan orang lain', 'Dermawan dan gemar memberi sedekah kepada sesama', 'Suka mengangkat tangan saat bertengkar', 'Menyimpan hartanya sendiri tanpa peduli sekitar'],
      answer: 1,
      explanation: 'Tangan di atas bermakna pemberi (dermawan), sedangkan tangan di bawah bermakna peminta.',
      hint: 'Orang yang memberi berada di posisi atas dibandingkan yang menerima.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Saat membaca Surah al-Hujurat ayat 13, siswa belajar bahwa Allah menciptakan manusia bersuku-suku dan berbangsa-bangsa agar saling mengenal (lita\'arafu).',
      question: 'Berdasarkan ayat tersebut, ukuran kemuliaan seseorang di sisi Allah Swt. adalah...',
      options: ['Kekayaan harta dan jabatan orang tuanya', 'Warna kulit dan asal daerahnya', 'Ketakwaannya kepada Allah Swt.', 'Jumlah pengikutnya di media sosial'],
      answer: 2,
      explanation: '"Inna akramakum \'indallahi atqakum" — Sesungguhnya yang paling mulia di sisi Allah ialah yang paling bertakwa.',
      hint: 'Berhubungan dengan ketaatan menjalankan perintah Allah dan menjauhi larangan-Nya.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Rafa menemui bacaan "مِنْ يَعْمَلْ" (Nun sukun bertemu huruf Ya) saat menyetor hafalan Al-Qur\'an kepada guru PAI.',
      question: 'Cara membaca hukum tajwid pada lafaz "مِنْ يَعْمَلْ" yang benar adalah...',
      options: ['Dibaca jelas tanpa dengung (Izhar)', 'Dimasukkan ke huruf Ya disertai dengung (Idgam Bigunah)', 'Dipantulkan bunyinya dengan kuat (Qalqalah)', 'Diubah menjadi bunyi Mim (Iqlab)'],
      answer: 1,
      explanation: 'Nun sukun bertemu huruf Ya (ي) termasuk Idgam Bigunah sehingga dilebur disertai dengung 2 harakat.',
      hint: 'Huruf Idgam Bigunah disingkat YANMU (ي ن م و).',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Di kelas, Budi sering membaca huruf ق (Qaf), ط (Ta), ب (Ba), ج (Jim), dan د (Dal) yang berharakat sukun di tengah ayat.',
      question: 'Kelima huruf tersebut dikenal sebagai huruf Qalqalah yang cara membacanya harus...',
      options: ['Dipanjangkan 6 harakat', 'Dipantulkan bunyinya', 'Disamarkan ke hidung', 'Dihilangkan suaranya'],
      answer: 1,
      explanation: 'Qalqalah berarti memantul; hurufnya disingkat "Ba-Ju-Di-To-Qo".',
      hint: 'Ingat singkatan Baju Di Toko.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Surah al-A\'la ayat 1 dimulai dengan perintah "Sabbihisma rabbikal-a\'la" yang mengajak manusia memuji kemahatinggian Allah.',
      question: 'Penerapan langsung dari pesan ayat pertama Surah al-A\'la dalam kehidupan sehari-hari adalah...',
      options: ['Rajin bertasbih dan mensyukuri keindahan alam ciptaan Allah', 'Merasa paling pintar saat mendapat nilai bagus', 'Mengabaikan nasihat orang tua di rumah', 'Berbicara kasar kepada teman bermain'],
      answer: 0,
      explanation: 'Bertasbih menyucikan nama Allah yang Maha Tinggi menumbuhkan sifat rendah hati dan syukur.',
      hint: 'Berkaitan dengan kalimat tasbih Subhanallah.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Pada papan literasi Al-Qur\'an tertulis potongan Surah al-Kausar ayat 2: "Fasalli lirabbika wanhar."',
      question: 'Dua perintah ibadah utama yang terkandung dalam ayat tersebut adalah...',
      options: ['Puasa Ramadan dan berhaji', 'Mendirikan salat dan berkurban', 'Membayar zakat dan berinfak', 'Membaca buku dan menabung'],
      answer: 1,
      explanation: '"Fasalli" berarti dirikanlah salat, dan "wanhar" berarti berkurbanlah karena Tuhanmu.',
      hint: 'Salat Iduladha diikuti dengan penyembelihan hewan.',
    },
    {
      elementId: 1,
      difficulty: 'sedang',
      stimulus: 'Seorang siswa melihat temannya yang berbeda agama sedang membersihkan halaman rumahnya menjelang hari rayanya.',
      question: 'Prinsip Al-Qur\'an dalam Surah al-Kafirun ayat 6 ("Lakum dinukum waliyadin") mengajarkan kita untuk...',
      options: ['Mengikuti ritual ibadah agama lain agar akrab', 'Saling menghormati kebebasan beragama tanpa mencampuri akidah', 'Melarang tetangga menjalankan ibadahnya', 'Memutus hubungan pertemanan dengan yang berbeda keyakinan'],
      answer: 1,
      explanation: 'Surah al-Kafirun menegaskan ketegasan akidah sekaligus toleransi sosial (tidak memaksa agama).',
      hint: 'Bagimu agamamu, dan bagiku agamaku.',
    },
    // SULIT (5)
    {
      elementId: 1,
      difficulty: 'sulit',
      stimulus: 'Analisis Kasus AKM: Di sekolah terdapat program "Jumat Berbagi". Siti rutin menyumbang, namun selalu mengunggah fotonya disertai sindiran bahwa teman lain pelit. Sementara Nabila menyumbang diam-diam meski jumlahnya kecil.',
      question: 'Ditinjau dari kandungan Surah ad-Duha ayat 9-11 dan Surah al-Ma\'un ayat 6, evaluasi yang paling tepat terhadap perilaku keduanya adalah...',
      options: [
        'Siti lebih mulia karena jumlah sumbangannya lebih besar',
        'Perbuatan Siti mendekati sifat riya yang dikecam al-Ma\'un, sedangkan Nabila mencerminkan keikhlasan dan kasih sayang',
        'Keduanya salah karena seharusnya tidak perlu menyumbang di sekolah',
        'Nabila kurang tepat karena syiar kebaikan wajib dipamerkan dengan menyindir',
      ],
      answer: 1,
      explanation: 'Surah al-Ma\'un ayat 6 mengecam orang yang berbuat riya (ingin dipuji). Amal terbaik adalah yang tulus ikhlas.',
      hint: 'Bandingkan keikhlasan Nabila dengan sikap ingin dipuji (riya).',
    },
    {
      elementId: 1,
      difficulty: 'sulit',
      stimulus: 'Perhatikan kutipan hadis: "Sesungguhnya Allah tidak melihat rupa dan harta kalian, tetapi Allah melihat hati dan amal perbuatan kalian." (HR. Muslim). Di kelas, ada siswa baru yang memakai sepatu sederhana tetapi sangat rajin membantu piket dan tekun belajar.',
      question: 'Simpulan penerapan nilai hadis dan Surah al-Hujurat ayat 13 yang paling mendalam pada situasi tersebut adalah...',
      options: [
        'Menilai teman dari penampilan luarnya sebelum mengajaknya belajar kelompok',
        'Menghargai teman tersebut dengan tulus, menjadikannya teladan ketakwaan, serta menumbuhkan persaudaraan tanpa memandang status ekonomi',
        'Membiarkannya sendiri agar tidak merasa malu',
        'Memberinya tugas piket terbanyak karena ia rajin',
      ],
      answer: 1,
      explanation: 'Islam memuliakan ketulusan hati, amal saleh, dan ketakwaan, bukan status sosial maupun penampilan fisik.',
      hint: 'Fokus pada persaudaraan dan penilaian berdasarkan amal saleh serta ketakwaan.',
    },
    {
      elementId: 1,
      difficulty: 'sulit',
      stimulus: 'Perhatikan tiga lafaz berikut: (1) مِنْ بَعْدِ (Nun sukun bertemu Ba), (2) مِنْ رَبِّهِمْ (Nun sukun bertemu Ra), (3) مِنْ خَوْفٍ (Nun sukun bertemu Kha).',
      question: 'Urutan hukum bacaan tajwid yang tepat untuk lafaz (1), (2), dan (3) secara berturut-turut adalah...',
      options: [
        'Izhar Halqi — Iqlab — Idgam Bilagunah',
        'Iqlab — Idgam Bilagunah — Izhar Halqi',
        'Idgam Bigunah — Ikhfa Haqiqi — Iqlab',
        'Ikhfa Haqiqi — Izhar Halqi — Idgam Bilagunah',
      ],
      answer: 1,
      explanation: '(1) Nun sukun + Ba = Iqlab; (2) Nun sukun + Ra = Idgam Bilagunah; (3) Nun sukun + Kha = Izhar Halqi.',
      hint: 'Ba = Iqlab, Lam/Ra = Idgam Bilagunah, huruf tenggorokan (Kha) = Izhar.',
    },
    {
      elementId: 1,
      difficulty: 'sulit',
      stimulus: 'Dalam Surah at-Tin ayat 4-6 disebutkan bahwa manusia diciptakan dalam bentuk sebaik-baiknya (ahsani taqwim), namun dapat jatuh ke tempat serendah-rendahnya kecuali mereka yang beriman dan beramal saleh.',
      question: 'Mengapa kualitas akal saja tanpa iman dan amal saleh belum cukup menjaga martabat "ahsani taqwim" manusia?',
      options: [
        'Karena kecerdasan akal tanpa bimbingan iman dan akhlak dapat disalahgunakan untuk merusak alam dan menzalimi sesama',
        'Karena manusia tidak dianjurkan menuntut ilmu pengetahuan modern',
        'Karena amal saleh hanya wajib dilakukan saat sudah lanjut usia',
        'Karena bentuk fisik manusia akan selalu sama dengan makhluk lain',
      ],
      answer: 0,
      explanation: 'Keseimbangan antara ilmu (akal), iman, dan amal saleh menjaga derajat kemuliaan manusia di sisi Allah.',
      hint: 'Hubungkan kecerdasan dengan tanggung jawab moral dan iman.',
    },
    {
      elementId: 1,
      difficulty: 'sulit',
      stimulus: 'Data kegiatan literasi Al-Qur\'an di SDN Kedungringin I Beji menunjukkan 85% siswa sudah lancar membaca makhraj, tetapi masih sering tergesa-gesa sehingga panjang Mad Tabii (2 harakat) dibaca pendek 1 harakat.',
      question: 'Dampak utama jika panjang bacaan Mad Tabii sering dipendekkan secara sembarangan saat membaca Al-Qur\'an adalah...',
      options: [
        'Bacaan menjadi lebih cepat selesai dan pahalanya bertambah',
        'Dapat mengubah makna kata/ayat Al-Qur\'an (Lahn Jali) dan mengurangi kekhusyukan tartil',
        'Tidak berpengaruh sama sekali selama hurufnya benar',
        'Hanya memengaruhi nada lagu saja tanpa mengubah arti',
      ],
      answer: 1,
      explanation: 'Dalam bahasa Arab Al-Qur\'an, kesalahan panjang-pendek (mad) dapat mengubah arti ayat secara fatal (Lahn Jali).',
      hint: 'Panjang-pendek dalam bahasa Arab menentukan arti kata.',
    },
  ],

  // ==================== ELEMEN 2: AKIDAH ====================
  2: [
    // MUDAH (3)
    {
      elementId: 2,
      difficulty: 'mudah',
      stimulus: 'Pilar keimanan seorang muslim terangkum dalam Rukun Iman yang wajib diyakini dengan sepenuh hati.',
      question: 'Rukun Iman yang pertama dan paling utama adalah beriman kepada...',
      options: ['Malaikat Allah', 'Allah Swt.', 'Kitab-Kitab Allah', 'Hari Akhir'],
      answer: 1,
      explanation: 'Iman kepada Allah Swt. adalah fondasi utama tauhid dalam Rukun Iman.',
      hint: 'Sang Pencipta seluruh alam semesta.',
    },
    {
      elementId: 2,
      difficulty: 'mudah',
      stimulus: 'Allah Swt. memiliki 99 nama-nama yang baik dan agung yang disebut Asmaulhusna.',
      question: 'Asmaulhusna "Al-Ghaffar" memiliki arti Allah Maha...',
      options: ['Pengampun', 'Mematikan', 'Melihat', 'Mendengar'],
      answer: 0,
      explanation: 'Al-Ghaffar artinya Yang Maha Pengampun, mengampuni dosa hamba-Nya yang bertaubat.',
      hint: 'Berkaitan dengan istighfar (memohon ampun).',
    },
    {
      elementId: 2,
      difficulty: 'mudah',
      stimulus: 'Allah Swt. menugaskan para malaikat dengan tugas khusus masing-masing di alam semesta.',
      question: 'Malaikat yang bertugas menyampaikan wahyu Allah kepada para nabi dan rasul adalah Malaikat...',
      options: ['Mikail', 'Jibril', 'Israfil', 'Izrail'],
      answer: 1,
      explanation: 'Malaikat Jibril a.s. bertugas menyampaikan wahyu dari Allah Swt. kepada para nabi dan rasul.',
      hint: 'Malaikat yang menyampaikan wahyu pertama di Gua Hira.',
    },
    // SEDANG (9)
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Farhan selalu jujur saat mengerjakan ulangan meskipun guru sedang keluar kelas sebentar. Ia yakin setiap perbuatannya dicatat dan diawasi.',
      question: 'Perilaku jujur Farhan mencerminkan keimanan kepada Asmaulhusna Al-Basir dan Malaikat pencatat amal, yaitu...',
      options: ['Munkar dan Nakir', 'Raqib dan Atid', 'Malik dan Ridwan', 'Israfil dan Izrail'],
      answer: 1,
      explanation: 'Malaikat Raqib mencatat amal baik, sedangkan Malaikat Atid mencatat amal buruk.',
      hint: 'Dua malaikat yang mendampingi di sebelah kanan dan kiri manusia.',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Di Puncak Keyakinan, siswa mempelajari Asmaulhusna Al-Afuw (Maha Pemaaf) dan Al-Ghaffar (Maha Pengampun).',
      question: 'Cara meneladani sifat Al-Afuw dalam pergaulan sehari-hari bersama teman di sekolah adalah...',
      options: ['Menyimpan dendam sampai teman meminta maaf berkali-kali', 'Mudah memaafkan kesalahan teman dan menghapus rasa benci di hati', 'Membalas ejekan teman dengan ejekan lebih keras', 'Menjauhi teman yang pernah salah selama satu semester'],
      answer: 1,
      explanation: 'Meneladani Al-Afuw berarti lapang dada memaafkan kesalahan orang lain tanpa menyimpan dendam.',
      hint: 'Afuw berarti menghapus bekas kesalahan dengan memaafkan.',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Allah Swt. bersifat Al-Wahid dan As-Samad. Manusia senantiasa berdoa dan menggantungkan harapan hanya kepada-Nya.',
      question: 'Arti Asmaulhusna "As-Samad" yang terdapat dalam Surah al-Ikhlas ayat 2 adalah...',
      options: ['Allah Maha Esa', 'Allah Tempat Bergantung segala sesuatu', 'Allah Maha Kuat', 'Allah Maha Menghidupkan'],
      answer: 1,
      explanation: 'As-Samad bermakna Allah adalah tempat bergantung dan memohon seluruh makhluk.',
      hint: 'Semua makhluk membutuhkan-Nya, sedangkan Allah tidak membutuhkan siapa pun.',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Allah Swt. menurunkan empat kitab suci utama kepada para rasul-Nya sebagai pedoman hidup umat manusia sepanjang zaman.',
      question: 'Pasangan Kitab Suci dan Rasul penerimanya yang paling tepat adalah...',
      options: ['Taurat — Nabi Daud a.s.', 'Zabur — Nabi Musa a.s.', 'Injil — Nabi Isa a.s.', 'Al-Qur\'an — Nabi Ibrahim a.s.'],
      answer: 2,
      explanation: 'Taurat diturunkan kepada Nabi Musa, Zabur kepada Nabi Daud, Injil kepada Nabi Isa, dan Al-Qur\'an kepada Nabi Muhammad saw.',
      hint: 'Ingat urutan: Musa-Taurat, Daud-Zabur, Isa-Injil, Muhammad-Al-Qur\'an.',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Ketika terjadi musibah banjir di desa tetangga, warga tetap bersabar, berikhtiar mengevakuasi barang, dan berdoa kepada Allah.',
      question: 'Keyakinan bahwa segala ketetapan baik dan buruk di alam semesta berada dalam kuasa Allah Swt. adalah Rukun Iman ke-6, yaitu iman kepada...',
      options: ['Rasul-Rasul Allah', 'Hari Akhir', 'Qada dan Qadar', 'Kitab-Kitab Allah'],
      answer: 2,
      explanation: 'Iman kepada Qada dan Qadar (takdir Allah) menumbuhkan ketenangan, ikhtiar, dan tawakal.',
      hint: 'Rukun Iman yang terakhir (keenam).',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Sebagian ketetapan Allah dapat diusahakan perubahannya melalui ikhtiar sungguh-sungguh dan doa, seperti kepandaian dan kesehatan.',
      question: 'Takdir Allah yang masih dapat diubah dengan ikhtiar (usaha) dan doa disebut takdir...',
      options: ['Mubram', 'Muallaq', 'Qadim', 'Mutlak'],
      answer: 1,
      explanation: 'Takdir Muallaq adalah ketetapan yang bergantung pada ikhtiar dan doa manusia, sedangkan Mubram tidak dapat diubah.',
      hint: 'Lawan dari takdir Mubram (kematian/kelahiran).',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Nabi Muhammad saw. dan para rasul memiliki 4 sifat wajib yang menjadi teladan bagi umat manusia.',
      question: 'Sifat wajib rasul "Fatanah" yang wajib diteladani pelajar agar rajin belajar memiliki arti...',
      options: ['Jujur dalam perkataan', 'Dapat dipercaya', 'Cerdas dan bijaksana', 'Menyampaikan kebenaran'],
      answer: 2,
      explanation: 'Sidiq (jujur), Amanah (dapat dipercaya), Tablig (menyampaikan), Fatanah (cerdas).',
      hint: 'Berkaitan dengan kecerdasan akal dan kebijaksanaan.',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Tanda-tanda kebesaran Allah tampak pada pergantian siang dan malam, hujan yang menyuburkan tanah, serta bintang di langit.',
      question: 'Keyakinan kepada Hari Akhir (Yaumul Hisab) akan mendorong seorang siswa untuk...',
      options: ['Berbuat semaunya mumpung masih anak-anak', 'Hati-hati dalam bertindak dan memperbanyak amal kebaikan', 'Malas belajar karena dunia akan berakhir', 'Menyembunyikan kesalahan dari semua orang'],
      answer: 1,
      explanation: 'Yaumul Hisab adalah hari perhitungan amal, sehingga orang beriman selalu menjaga amal salehnya.',
      hint: 'Semua perbuatan kelak akan dimintai pertanggungjawaban.',
    },
    {
      elementId: 2,
      difficulty: 'sedang',
      stimulus: 'Di dinding kelas terpajang kaligrafi Asmaulhusna Al-Qawiyyu dan Al-Qayyum.',
      question: 'Perilaku mandiri merapikan tempat tidur dan menyiapkan buku sekolah sendiri adalah wujud meneladani Asmaulhusna...',
      options: ['Al-Qayyum (Maha Mandiri)', 'Al-Mumit (Maha Mematikan)', 'Al-Muhyi (Maha Menghidupkan)', 'Al-Ba\'is (Maha Membangkitkan)'],
      answer: 0,
      explanation: 'Al-Qayyum artinya Allah Maha Berdiri Sendiri/Mandiri, menginspirasi kita untuk tidak bergantung pada orang lain.',
      hint: 'Berkaitan dengan kemandirian.',
    },
    // SULIT (5)
    {
      elementId: 2,
      difficulty: 'sulit',
      stimulus: 'Studi Kasus AKM: Raka gagal meraih juara 1 lomba MTQ tingkat kecamatan padahal sudah berlatih keras. Temannya menyarankan agar Raka berhenti berlatih karena menganggap "memang sudah takdirnya tidak bisa juara".',
      question: 'Berdasarkan konsep Takdir Muallaq dan tawakal yang benar, sikap yang seharusnya diambil Raka adalah...',
      options: [
        'Menyerah sepenuhnya karena hasil lomba sudah pasti takdir mubram',
        'Menerima hasil dengan ikhlas (sabar), mengevaluasi kekurangan bacaan, lalu meningkatkan latihan dan doa untuk kesempatan berikutnya',
        'Menyalahkan dewan juri karena merasa paling layak menang',
        'Berhenti ikut kegiatan keagamaan di sekolah',
      ],
      answer: 1,
      explanation: 'Prestasi termasuk takdir Muallaq yang dipengaruhi ikhtiar dan doa. Sikap mukmin adalah tawakal disertai evaluasi dan usaha lebih baik.',
      hint: 'Gabungkan keikhlasan hati dengan ikhtiar perbaikan.',
    },
    {
      elementId: 2,
      difficulty: 'sulit',
      stimulus: 'Dalam Asmaulhusna terdapat perbedaan nuansa makna antara Al-Ghaffar (Maha Pengampun) dan Al-Afuw (Maha Pemaaf). Keduanya berkaitan dengan kasih sayang Allah kepada hamba yang bertaubat.',
      question: 'Perbedaan mendasar antara Al-Ghaffar dan Al-Afuw menurut para ulama adalah...',
      options: [
        'Al-Ghaffar menutup dan mengampuni dosa, sedangkan Al-Afuw menghapus jejak dosa hingga bersih tak bersisa',
        'Al-Ghaffar hanya berlaku untuk dosa besar, sedangkan Al-Afuw tidak berlaku bagi manusia',
        'Keduanya memiliki arti Allah Maha Pemberi Rezeki',
        'Al-Afuw berarti menghukum, sedangkan Al-Ghaffar berarti menunda',
      ],
      answer: 0,
      explanation: 'Al-Ghaffar bermakna menutupi dan mengampuni dosa; Al-Afuw lebih mendalam yaitu menghapus catatan/bekas kesalahan hingga bersih.',
      hint: 'Afuw berarti menghapus bersih tanpa bekas.',
    },
    {
      elementId: 2,
      difficulty: 'sulit',
      stimulus: 'Sebuah survei kecil di kelas menunjukkan dua kelompok pandangan tentang Hari Akhir: Kelompok A rajin salat tetapi sering mengabaikan tugas sekolah karena merasa dunia tak penting. Kelompok B rajin beribadah sekaligus tekun belajar dan menjaga lingkungan.',
      question: 'Manakah analisis yang paling sesuai dengan ajaran Islam tentang keseimbangan hidup menuju Hari Akhir?',
      options: [
        'Kelompok A lebih benar karena urusan sekolah tidak bernilai pahala',
        'Kelompok B paling tepat karena menuntut ilmu dan menjaga lingkungan dengan niat ikhlas adalah bekal amal saleh untuk akhirat',
        'Kedua kelompok salah karena anak SD belum wajib memikirkan akhirat',
        'Kelompok A cukup benar asalkan tidak bolos sekolah',
      ],
      answer: 1,
      explanation: 'Islam mengajarkan keseimbangan dunia dan akhirat; belajar sungguh-sungguh dan berbuat baik kepada sesama bernilai ibadah.',
      hint: 'Dunia adalah ladang menanam amal untuk akhirat.',
    },
    {
      elementId: 2,
      difficulty: 'sulit',
      stimulus: 'Lima rasul pilihan mendapatkan gelar Ulul Azmi karena keteguhan hati dan kesabaran luar biasa dalam menghadapi tantangan dakwah yang sangat berat.',
      question: 'Daftar lengkap 5 Rasul Ulul Azmi yang tepat adalah...',
      options: [
        'Adam, Nuh, Ibrahim, Musa, Muhammad',
        'Nuh, Ibrahim, Musa, Isa, Muhammad',
        'Nuh, Hud, Saleh, Isa, Muhammad',
        'Ibrahim, Ismail, Yusuf, Musa, Muhammad',
      ],
      answer: 1,
      explanation: 'Rasul Ulul Azmi terdiri dari 5 rasul: Nuh a.s., Ibrahim a.s., Musa a.s., Isa a.s., dan Muhammad saw. (disingkat NIMIM).',
      hint: 'Ingat singkatan N-I-M-I-M.',
    },
    {
      elementId: 2,
      difficulty: 'sulit',
      stimulus: 'Seorang siswa percaya kepada Allah Al-\'Adl (Maha Adil) dan Al-Hakim (Maha Bijaksana). Saat melihat teman dari keluarga kurang mampu mendapat beasiswa sekolah, ia justru merasa iri.',
      question: 'Bagaimana pemahaman mendalam terhadap Asmaulhusna Al-\'Adl seharusnya mengubah cara pandangnya?',
      options: [
        'Menyadari bahwa adil berarti menempatkan sesuatu sesuai kebutuhan dan proporsinya, sehingga ikut bersyukur temannya terbantu',
        'Meminta sekolah membagi beasiswa sama rata ke semua siswa termasuk yang kaya',
        'Menganggap keadilan hanya berarti semua orang harus menerima jumlah uang yang persis sama',
        'Berhenti berteman dengan penerima beasiswa',
      ],
      answer: 0,
      explanation: 'Adil (Al-\'Adl) bukan sekadar sama rata, melainkan proporsional dan tepat sasaran sesuai hak dan kebutuhan.',
      hint: 'Adil berarti menempatkan sesuatu pada tempatnya yang tepat.',
    },
  ],

  // ==================== ELEMEN 3: AKHLAK ====================
  3: [
    // MUDAH (3)
    {
      elementId: 3,
      difficulty: 'mudah',
      stimulus: 'Setiap pagi sebelum berangkat ke SDN Kedungringin I Beji, Dinda mencium tangan ayah dan ibu serta mengucapkan salam.',
      question: 'Sikap berbakti, hormat, dan patuh kepada kedua orang tua dalam Islam disebut...',
      options: ['Birrul Walidain', 'Ghibah', 'Takabur', 'Hasad'],
      answer: 0,
      explanation: 'Birrul Walidain adalah berbuat baik dan berbakti kepada kedua orang tua.',
      hint: 'Walidain artinya kedua orang tua.',
    },
    {
      elementId: 3,
      difficulty: 'mudah',
      stimulus: 'Ketika melihat pemandangan gunung dan air terjun yang memukau, siswa mengagumi ciptaan Allah Swt.',
      question: 'Kalimat tayibah yang diucapkan untuk memohon ampunan kepada Allah saat berbuat salah adalah...',
      options: ['Astaghfirullahal \'azim', 'Alhamdulillah', 'Allahu Akbar', 'Inna lillahi'],
      answer: 0,
      explanation: 'Istighfar ("Astaghfirullahal \'azim") diucapkan untuk memohon ampun atas kesalahan.',
      hint: 'Bacaan istighfar.',
    },
    {
      elementId: 3,
      difficulty: 'mudah',
      stimulus: 'Di lingkungan Desa Budi Pekerti, warga selalu menyapa dengan ramah saat berpapasan di jalan.',
      question: 'Ucapan salam yang diajarkan Islam saat bertemu sesama muslim adalah...',
      options: ['Assalamu\'alaikum warahmatullahi wabarakatuh', 'Sampai jumpa lagi', 'Selamat makan', 'Terima kasih'],
      answer: 0,
      explanation: 'Salam merupakan doa keselamatan, rahmat, dan keberkahan bagi sesama.',
      hint: 'Artinya semoga keselamatan tercurah atas kalian.',
    },
    // SEDANG (9)
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Tanpa sengaja, Dani menyenggol botol minum temannya hingga jatuh dan pecah di teras kelas.',
      question: 'Langkah pertama yang mencerminkan akhlak terpuji (bertanggung jawab dan menyesal) adalah...',
      options: ['Segera pergi sebelum ketahuan', 'Mengakui kesalahan dengan jujur, meminta maaf, dan bersedia menggantinya', 'Menuduh teman lain yang lewat di dekat meja', 'Tertawa agar suasana tidak tegang'],
      answer: 1,
      explanation: 'Meminta maaf dan bertanggung jawab menunjukkan jiwa kesatria dan akhlak mulia.',
      hint: 'Berani jujur dan bertanggung jawab.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Di kelas terdapat siswa dari beragam latar belakang budaya dan agama. Mereka bekerja sama menyiapkan lomba kebersihan kelas.',
      question: 'Sikap saling menghargai dan menghormati perbedaan dalam Islam dikenal dengan istilah...',
      options: ['Tasamuh (Toleransi)', 'Hasad (Dengki)', 'Riya (Pamer)', 'Bakhil (Kikir)'],
      answer: 0,
      explanation: 'Tasamuh adalah sikap tenggang rasa dan toleransi terhadap sesama dalam kehidupan bermasyarakat.',
      hint: 'Berasal dari bahasa Arab yang artinya lapang dada/toleran.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Bu Guru sedang menjelaskan pelajaran di depan kelas. Beberapa teman di belakang mulai mengobrol keras.',
      question: 'Adab seorang murid yang tawaduk (rendah hati) kepada guru adalah...',
      options: ['Ikut mengobrol agar tidak dianggap pendiam', 'Menyimak penjelasan dengan tenang dan mengingatkan teman dengan sopan', 'Tidur di meja selama pelajaran berlangsung', 'Memotong pembicaraan guru dengan nada tinggi'],
      answer: 1,
      explanation: 'Menghormati guru dan menyimak ilmu dengan saksama adalah kunci keberkahan ilmu.',
      hint: 'Tawaduk artinya rendah hati dan sopan.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Setiap sore, warga desa rutin membersihkan selokan dan menanam pohon di sepanjang jalan untuk mencegah banjir.',
      question: 'Peran manusia menjaga kelestarian alam dan lingkungan disebut sebagai tugas...',
      options: ['Khalifah di muka bumi', 'Penguasa mutlak yang bebas merusak', 'Penonton yang tidak perlu peduli', 'Penebang pohon liar'],
      answer: 0,
      explanation: 'Allah mengangkat manusia sebagai Khalifah fil Ard untuk memakmurkan dan menjaga bumi, bukan merusaknya.',
      hint: 'Pemimpin/pengelola amanah bumi.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Seseorang menerima berita sensasional di grup pesan singkat tentang tetangganya yang belum tentu benar.',
      question: 'Perintah Al-Qur\'an ketika menerima kabar yang belum jelas kebenarannya adalah melakukan...',
      options: ['Tabayyun (memeriksa dan meneliti kebenarannya terlebih dahulu)', 'Langsung meneruskan ke semua grup agar viral', 'Menambah-nambahi cerita agar lebih seru', 'Memarahi orang yang dibicarakan tanpa bukti'],
      answer: 0,
      explanation: 'Tabayyun (klarifikasi/cek fakta) mencegah fitnah dan perpecahan persaudaraan.',
      hint: 'Artinya cek dan ricek kebenaran berita.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Salman ditunjuk menjadi bendahara kelas. Uang kas kelas ia catat rapi dan tidak pernah dipakai untuk jajan pribadi.',
      question: 'Sifat terpuji yang ditunjukkan Salman tersebut adalah...',
      options: ['Amanah (dapat dipercaya)', 'Boros', 'Khianat', 'Sombong'],
      answer: 0,
      explanation: 'Amanah berarti menjaga kepercayaan yang diberikan orang lain dengan penuh tanggung jawab.',
      hint: 'Salah satu sifat mulia Nabi Muhammad saw. (Al-Amin).',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Ketika sedang sangat marah karena diejek, Hasan segera duduk, beristighfar, lalu mengambil air wudu sesuai anjuran Nabi.',
      question: 'Sikap menahan diri dari luapan amarah dan tetap tenang menghadapi ujian disebut...',
      options: ['Sabar dan menahan amarah (Kazimul Ghaiz)', 'Penakut dan lemah', 'Dendam tersembunyi', 'Acuh tak acuh'],
      answer: 0,
      explanation: 'Orang yang kuat menurut Rasulullah saw. bukanlah yang menang bergulat, melainkan yang mampu mengendalikan dirinya saat marah.',
      hint: 'Mengendalikan emosi dengan kesabaran.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Rina memiliki baju layak pakai yang sudah kekecilan, sementara ada keluarga korban bencana yang membutuhkan pakaian.',
      question: 'Sikap berbagi harta/barang bermanfaat untuk membantu sesama menumbuhkan sifat...',
      options: ['Empati dan kedermawanan', 'Kikir dan tamak', 'Iri hati', 'Putus asa'],
      answer: 0,
      explanation: 'Empati adalah kemampuan merasakan kesulitan orang lain dan tergerak membantu dengan dermawan.',
      hint: 'Merasakan penderitaan sesama dan tergerak menolong.',
    },
    {
      elementId: 3,
      difficulty: 'sedang',
      stimulus: 'Nabi Muhammad saw. melarang kita membicarakan keburukan saudara kita di belakangnya meskipun hal itu benar adanya.',
      question: 'Perbuatan membicarakan aib orang lain di belakangnya disebut...',
      options: ['Ghibah', 'Silaturahmi', 'Musyawarah', 'Ta\'awun'],
      answer: 0,
      explanation: 'Ghibah (menggunjing) dilarang keras dalam Islam dan diibaratkan memakan bangkai saudara sendiri.',
      hint: 'Sering disebut menggunjing.',
    },
    // SULIT (5)
    {
      elementId: 3,
      difficulty: 'sulit',
      stimulus: 'Kasus AKM: Dalam musyawarah pemilihan ketua kelas, usulan Bagas kalah suara dari usulan Laila. Setelah rapat selesai, Bagas enggan ikut kegiatan kelas yang dipimpin Laila.',
      question: 'Evaluasi yang paling tepat terhadap sikap Bagas berdasarkan etika musyawarah (Syura) dalam Islam adalah...',
      options: [
        'Wajar dilakukan karena setiap orang bebas menolak hasil musyawarah',
        'Kurang tepat karena ukhuwah dan musyawarah menuntut kelapangan dada menerima keputusan bersama serta mendukung kebaikan',
        'Tepat agar Laila mengundurkan diri sebagai ketua kelas',
        'Sebaiknya musyawarah diulang sampai usulan Bagas menang',
      ],
      answer: 1,
      explanation: 'Dalam musyawarah, setelah keputusan mufakat/mayoritas diambil secara adil, semua anggota wajib bertawakal dan mendukung pelaksanaannya.',
      hint: 'Musyawarah membutuhkan jiwa besar dan persatuan.',
    },
    {
      elementId: 3,
      difficulty: 'sulit',
      stimulus: 'Kasus Lingkungan AKM: Sungai di dekat desa mulai keruh karena sampah plastik. Sekelompok siswa berpendapat "Membuang 1 bungkus plastik kecil tidak akan menyebabkan banjir."',
      question: 'Bagaimana argumen akhlak terhadap alam (Khalifah fil Ard) membantah pola pikir tersebut?',
      options: [
        'Benar bahwa 1 plastik tidak berbahaya sehingga boleh dibuang ke sungai',
        'Jika ratusan orang berpikir sama, sampah akan menumpuk merusak ekosistem; menjaga kebersihan sebagian dari iman dimulai dari diri sendiri',
        'Urusan sungai adalah tanggung jawab petugas kebersihan saja',
        'Sampah plastik akan larut sendiri dalam air sungai',
      ],
      answer: 1,
      explanation: 'Kerusakan besar di bumi berawal dari kelalaian kecil yang dilakukan bersama-sama. Mukmin menjaga alam dimulai dari tindakan pribadinya.',
      hint: 'Kebiasaan kecil yang dilakukan banyak orang berdampak besar bagi lingkungan.',
    },
    {
      elementId: 3,
      difficulty: 'sulit',
      stimulus: 'Kasus Digital AKM: Di sebuah forum gim daring, ada pemain yang memancing emosi dengan kata-kata kasar. Temanmu mengajak membalas dengan kata-kata yang lebih pedas agar dianggap pemberani.',
      question: 'Keputusan berakhlak karimah yang paling bijak dalam menghadapi provokasi digital tersebut adalah...',
      options: [
        'Membalas dengan kata kasar agar tidak diremehkan',
        'Menjaga lisan/ketikan (qaulan kariman), tidak terprovokasi, melaporkan/membisukan akun kasar, dan mengajak teman menjaga adab',
        'Menyebarkan data pribadi pemain tersebut ke internet',
        'Ikut mengejek bersama teman-teman lain',
      ],
      answer: 1,
      explanation: 'Adab menjaga lisan juga berlaku pada jari dan ketikan di dunia maya. Kebaikan tidak dibalas dengan keburukan.',
      hint: 'Lisan dan ketikan yang santun melindungi diri dari dosa.',
    },
    {
      elementId: 3,
      difficulty: 'sulit',
      stimulus: 'Konflik Pertemanan: Nadia merasa sangat kesal kepada Fira karena kesalahpahaman. Namun Nadia teringat keutamaan silaturahmi dan larangan mendiamkan saudara muslim lebih dari tiga hari.',
      question: 'Tindakan paling mulia menurut hadis Nabi Muhammad saw. bagi Nadia adalah...',
      options: [
        'Menunggu Fira meminta maaf terlebih dahulu meski butuh waktu berbulan-bulan',
        'Memulai menyapa dengan salam dan mengajak berbicara baik-baik untuk meluruskan kesalahpahaman',
        'Menceritakan keburukan Fira kepada seluruh kelas agar mendapat dukungan',
        'Pindah tempat duduk sejauh mungkin dari Fira',
      ],
      answer: 1,
      explanation: 'Rasulullah saw. bersabda bahwa yang terbaik di antara dua orang yang berselisih adalah yang lebih dahulu mengucapkan salam.',
      hint: 'Siapa yang lebih mulia: yang memulai salam atau yang menunggu?',
    },
    {
      elementId: 3,
      difficulty: 'sulit',
      stimulus: 'Di kelas 6, guru memberi tugas proyek kelompok. Ada satu anggota yang lambat memahami materi. Anggota lain ingin mengeluarkannya agar kelompok cepat selesai.',
      question: 'Solusi yang mencerminkan prinsip Ta\'awun (tolong-menolong dalam kebaikan) dan kasih sayang adalah...',
      options: [
        'Mengeluarkan anggota tersebut dan melaporkannya ke guru',
        'Membimbingnya dengan sabar serta membagi peran sesuai kemampuannya agar semua belajar dan sukses bersama',
        'Mengerjakan seluruh tugas sendiri lalu tetap mencantumkan namanya tanpa mengajarinya',
        'Menyuruhnya membeli makanan saja sebagai ganti kerja kelompok',
      ],
      answer: 1,
      explanation: 'Ta\'awun berarti saling menguatkan dalam kebaikan sehingga tidak ada teman yang tertinggal.',
      hint: 'Gotong royong sambil saling mengajari.',
    },
  ],

  // ==================== ELEMEN 4: FIKIH ====================
  4: [
    // MUDAH (3)
    {
      elementId: 4,
      difficulty: 'mudah',
      stimulus: 'Sebelum melaksanakan salat, setiap muslim diwajibkan menyucikan diri dari hadas kecil di tempat wudu.',
      question: 'Urutan pertama saat memulai rukun wudu yang wajib dilakukan di dalam hati adalah...',
      options: ['Niat', 'Membasuh kaki', 'Mengusap telinga', 'Berkumur'],
      answer: 0,
      explanation: 'Niat adalah rukun pertama wudu yang dilakukan bersamaan saat membasuh wajah.',
      hint: 'Dilakukan di dalam hati sebelum membasuh anggota wudu.',
    },
    {
      elementId: 4,
      difficulty: 'mudah',
      stimulus: 'Ibadah salat fardu merupakan tiang agama yang dikerjakan setiap hari pada waktu yang telah ditentukan.',
      question: 'Jumlah rakaat salat fardu dalam sehari semalam seluruhnya adalah...',
      options: ['12 rakaat', '15 rakaat', '17 rakaat', '20 rakaat'],
      answer: 2,
      explanation: 'Subuh (2) + Zuhur (4) + Asar (4) + Magrib (3) + Isya (4) = 17 rakaat.',
      hint: 'Jumlahkan 2 + 4 + 4 + 3 + 4.',
    },
    {
      elementId: 4,
      difficulty: 'mudah',
      stimulus: 'Pada bulan Ramadan, umat Islam menunaikan kewajiban berpuasa dari terbit fajar hingga terbenam matahari.',
      question: 'Ibadah zakat yang wajib dikeluarkan setiap muslim menjelang Hari Raya Idulfitri disebut...',
      options: ['Zakat Fitrah', 'Zakat Pertanian', 'Zakat Perniagaan', 'Wakaf'],
      answer: 0,
      explanation: 'Zakat Fitrah wajib ditunaikan pada bulan Ramadan sebelum salat Idulfitri.',
      hint: 'Berhubungan dengan Hari Raya Idulfitri.',
    },
    // SEDANG (9)
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Keluarga Pak Ahmad terdiri dari Ayah, Ibu, dan 3 orang anak. Mereka hendak menunaikan zakat fitrah berupa beras di masjid desa.',
      question: 'Jika takaran zakat fitrah per jiwa adalah 2,5 kg beras, total beras zakat fitrah yang harus dikeluarkan keluarga Pak Ahmad adalah...',
      options: ['7,5 kg', '10 kg', '12,5 kg', '15 kg'],
      answer: 2,
      explanation: 'Jumlah jiwa = 5 orang (Ayah, Ibu, 3 anak). 5 × 2,5 kg = 12,5 kg beras.',
      hint: 'Hitung total anggota keluarga lalu kalikan 2,5 kg.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Saat pergi berkemah di daerah pegunungan yang sangat sulit air, peserta pramuka hendak mendirikan salat Zuhur.',
      question: 'Pengganti wudu menggunakan debu suci ketika tidak ada air atau karena uzur sakit disebut...',
      options: ['Tayamum', 'Istinja', 'Mandi wajib', 'Qasar'],
      answer: 0,
      explanation: 'Tayamum adalah keringanan (rukhsah) bersuci menggunakan debu suci pada wajah dan kedua tangan.',
      hint: 'Bersuci dengan debu yang suci.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Di kantin sekolah, siswa selalu memeriksa label kemasan makanan dan minuman sebelum membeli.',
      question: 'Makanan dan minuman yang diperbolehkan menurut syariat Islam sekaligus baik dan menyehatkan tubuh disebut...',
      options: ['Halalan Tayyiban', 'Syubhat', 'Makruh', 'Haram'],
      answer: 0,
      explanation: 'Halalan (diperbolehkan syariat) dan Tayyiban (baik, bersih, bergizi bagi kesehatan).',
      hint: 'Halal dan baik.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Perhatikan hal-hal berikut: (1) Keluar sesuatu dari qubul/dubur, (2) Tidur nyenyak sambil berbaring, (3) Tersenyum, (4) Berbicara sebelum salat.',
      question: 'Perkara yang membatalkan wudu ditunjukkan oleh nomor...',
      options: ['(1) dan (2)', '(2) dan (3)', '(3) dan (4)', '(1) dan (4)'],
      answer: 0,
      explanation: 'Buang angin/air serta tidur nyenyak tanpa posisi duduk tetap membatalkan wudu.',
      hint: 'Tersenyum dan berbicara tidak membatalkan wudu.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Salat Tarawih dikerjakan umat Islam pada malam-malam bulan Ramadan secara berjamaah di masjid maupun di rumah.',
      question: 'Hukum melaksanakan salat Tarawih pada bulan Ramadan adalah...',
      options: ['Fardu Ain', 'Sunah Muakkad', 'Makruh', 'Mubah'],
      answer: 1,
      explanation: 'Salat Tarawih berhukum Sunah Muakkad (sunah yang sangat dianjurkan).',
      hint: 'Sunah yang sangat dianjurkan oleh Nabi.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Dalam Surah at-Taubah ayat 60 disebutkan 8 golongan (asnaf) yang berhak menerima penyaluran zakat.',
      question: 'Golongan penerima zakat yang disebut "Amil" adalah...',
      options: ['Orang yang tidak memiliki harta dan penghasilan', 'Panitia resmi yang bertugas mengumpulkan dan menyalurkan zakat', 'Orang yang baru masuk Islam', 'Orang yang sedang dalam perjalanan jauh untuk kebaikan'],
      answer: 1,
      explanation: 'Amil adalah pengelola zakat; Fakir/Miskin kekurangan harta; Mualaf baru masuk Islam; Ibnu Sabil musafir.',
      hint: 'Petugas pengurus zakat.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Pada usia tertentu, anak laki-laki dan perempuan mulai memasuki masa balig yang menandai mulainya kewajiban syariat secara penuh.',
      question: 'Anak yang sudah balig dan berakal sehat sehingga dibebani kewajiban hukum Islam disebut...',
      options: ['Mukalaf', 'Mualaf', 'Musafir', 'Makmum'],
      answer: 0,
      explanation: 'Mukalaf adalah muslim yang sudah dewasa (balig) dan berakal sehingga wajib menjalankan salat, puasa, dan syariat lainnya.',
      hint: 'Berbeda dengan mualaf (orang baru masuk Islam).',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Pak Hasan mewakafkan sebidang tanah miliknya agar dibangun musala dan taman bacaan untuk warga desa.',
      question: 'Keistimewaan amal wakaf dibandingkan pemberian biasa adalah...',
      options: ['Pahalanya terus mengalir (amal jariyah) selama bangunan/tanah dimanfaatkan untuk kebaikan', 'Tanahnya dapat diminta kembali sewaktu-waktu', 'Hanya boleh dilakukan oleh pejabat', 'Hanya berlaku selama satu bulan saja'],
      answer: 0,
      explanation: 'Wakaf adalah sedekah jariyah yang pokok hartanya ditahan dan manfaatnya terus mengalir pahalanya.',
      hint: 'Disebut juga sedekah jariyah.',
    },
    {
      elementId: 4,
      difficulty: 'sedang',
      stimulus: 'Saat berpuasa Ramadan, Iqbal tidak sengaja minum seteguk air karena benar-benar lupa, lalu segera ingat saat melihat jam dinding.',
      question: 'Bagaimana hukum puasa Iqbal pada hari tersebut menurut fikih Islam?',
      options: ['Puasanya batal dan wajib segera makan', 'Puasanya tetap sah dan dilanjutkan hingga Magrib karena benar-benar lupa', 'Wajib membayar fidyah satu karung beras', 'Harus mengulang niat dan puasa 2 hari'],
      answer: 1,
      explanation: 'Makan atau minum karena benar-benar lupa tidak membatalkan puasa; segeralah berhenti ketika ingat dan lanjutkan puasa.',
      hint: 'Allah memberi keringanan kepada orang yang benar-benar lupa.',
    },
    // SULIT (5)
    {
      elementId: 4,
      difficulty: 'sulit',
      stimulus: 'Analisis Fikih AKM: Sebuah makanan berbahan daging ayam yang disembelih dengan menyebut nama Allah, tetapi dibeli menggunakan uang hasil mencuri dari kotak amal.',
      question: 'Bagaimanakah status hukum mengonsumsi makanan tersebut berdasarkan kaidah halal zat dan halal cara memperolehnya?',
      options: [
        'Tetap halal karena ayamnya disembelih sesuai syariat',
        'Haram dikonsumsi karena meskipun zatnya halal, cara memperolehnya haram (hasil mencuri)',
        'Makruh saja selama tidak ketahuan orang lain',
        'Mubah jika dibagi-bagikan kepada teman',
      ],
      answer: 1,
      explanation: 'Syarat makanan halal mencakup 3 aspek: halal zatnya, halal cara pengolahannya, dan halal cara memperolehnya.',
      hint: 'Perhatikan halal dari cara mendapatkannya (haram li ghairihi).',
    },
    {
      elementId: 4,
      difficulty: 'sulit',
      stimulus: 'Kasus Fikih AKM: Siswa kelas 6 melakukan studi wisata dari Pasuruan menuju Yogyakarta (jarak > 90 km). Saat waktu Zuhur tiba, bus masih melaju di tol dan baru berhenti di rest area pada waktu Asar.',
      question: 'Keringanan salat (rukhsah) yang paling tepat dilakukan rombongan siswa saat tiba di rest area waktu Asar adalah...',
      options: [
        'Meninggalkan salat Zuhur karena waktunya sudah lewat',
        'Melaksanakan salat Jamak Takhir dan Qasar (Zuhur 2 rakaat + Asar 2 rakaat dikerjakan pada waktu Asar)',
        'Melaksanakan salat Jamak Taqdim pada waktu Subuh esok hari',
        'Cukup berdoa di dalam bus tanpa melaksanakan salat',
      ],
      answer: 1,
      explanation: 'Musafir yang menempuh perjalanan jauh (≥ ±81-89 km) boleh menjamak takhir (di waktu kedua) sekaligus mengqasar salat 4 rakaat menjadi 2 rakaat.',
      hint: 'Dilakukan di waktu kedua (Asar) = Jamak Takhir, diringkas 2 rakaat = Qasar.',
    },
    {
      elementId: 4,
      difficulty: 'sulit',
      stimulus: 'Analisis Zakat AKM: Pak Rudi telah menunaikan zakat fitrah tepat setelah khatib selesai menyampaikan khutbah Idulfitri karena ketiduran di pagi hari.',
      question: 'Berdasarkan ketentuan waktu pembayaran zakat fitrah, status pemberian beras Pak Rudi tersebut adalah...',
      options: [
        'Sah sebagai zakat fitrah yang paling utama',
        'Tidak terhitung sebagai zakat fitrah, melainkan bernilai sedekah biasa',
        'Tetap sah asalkan jumlahnya ditambah 0,5 kg',
        'Haram diterima oleh fakir miskin',
      ],
      answer: 1,
      explanation: 'Waktu wajib/afdhal zakat fitrah adalah sebelum salat Idulfitri. Jika diberikan setelah salat Id, nilainya menjadi sedekah biasa.',
      hint: 'Batas akhir zakat fitrah adalah sebelum pelaksanaan salat Idulfitri.',
    },
    {
      elementId: 4,
      difficulty: 'sulit',
      stimulus: 'Perbandingan Ibadah: Bu Sari memberikan uang rutin ke panti asuhan dengan syarat dan nisab tertentu dari hasil usaha emasnya yang sudah tersimpan 1 tahun (haul), sementara Bu Rina menyumbang sukarela Rp20.000 ke kotak amal masjid.',
      question: 'Identifikasi jenis ibadah harta yang dilakukan Bu Sari dan Bu Rina secara berturut-turut adalah...',
      options: [
        'Sedekah — Zakat Mal',
        'Zakat Mal — Infak/Sedekah',
        'Wakaf — Hadiah',
        'Zakat Fitrah — Fidyah',
      ],
      answer: 1,
      explanation: 'Harta yang mencapai nisab dan haul (1 tahun) wajib dikeluarkan sebagai Zakat Mal, sedangkan sumbangan sukarela tanpa nisab adalah Infak/Sedekah.',
      hint: 'Nisab & haul adalah syarat wajib Zakat Mal.',
    },
    {
      elementId: 4,
      difficulty: 'sulit',
      stimulus: 'Dalam salat berjamaah, Dani datang terlambat (masbuk) saat imam sudah berdiri pada rakaat kedua dan langsung ikut takbiratul ihram serta rukuk bersama imam.',
      question: 'Apa yang harus dilakukan Dani setelah imam mengucapkan salam pada rakaat terakhir salat Magrib?',
      options: [
        'Langsung ikut salam bersama imam karena sudah berjamaah',
        'Berdiri kembali tanpa salam untuk menyempurnakan 1 rakaat yang tertinggal, lalu tasyahud akhir dan salam',
        'Mengulang salat Magrib 3 rakaat dari awal',
        'Cukup sujud sahwi dua kali lalu salam',
      ],
      answer: 1,
      explanation: 'Makmum masbuk yang tertinggal 1 rakaat wajib menambah 1 rakaat setelah imam salam agar jumlah rakaat salatnya sempurna.',
      hint: 'Lengkapi jumlah rakaat yang tertinggal setelah imam salam.',
    },
  ],

  // ==================== ELEMEN 5: SEJARAH PERADABAN ISLAM ====================
  5: [
    // MUDAH (3)
    {
      elementId: 5,
      difficulty: 'mudah',
      stimulus: 'Sejak usia muda sebelum diangkat menjadi rasul, Nabi Muhammad saw. sangat terkenal dengan kejujurannya di kalangan masyarakat Makkah.',
      question: 'Gelar kemuliaan yang diberikan penduduk Makkah kepada Nabi Muhammad saw. karena sifat jujur dan dapat dipercaya adalah...',
      options: ['Al-Amin', 'As-Siddiq', 'Al-Faruq', 'Dzunnurain'],
      answer: 0,
      explanation: 'Al-Amin berarti orang yang sangat dapat dipercaya.',
      hint: 'Gelar sejak muda Nabi Muhammad saw.',
    },
    {
      elementId: 5,
      difficulty: 'mudah',
      stimulus: 'Setelah wafatnya Rasulullah saw., kepemimpinan umat Islam dilanjutkan oleh empat sahabat utama yang disebut Khulafaur Rasyidin.',
      question: 'Siapakah sahabat yang menjadi Khalifah pertama dalam sejarah Khulafaur Rasyidin?',
      options: ['Umar bin Khattab r.a.', 'Abu Bakar as-Siddiq r.a.', 'Usman bin Affan r.a.', 'Ali bin Abi Thalib r.a.'],
      answer: 1,
      explanation: 'Abu Bakar as-Siddiq r.a. adalah khalifah pertama (632–634 M).',
      hint: 'Sahabat setia yang menemani Nabi saat hijrah di Gua Tsur.',
    },
    {
      elementId: 5,
      difficulty: 'mudah',
      stimulus: 'Allah Swt. mengutus Nabi Adam a.s. sebagai manusia sekaligus nabi pertama di muka bumi.',
      question: 'Peristiwa perjalanan hijrah Nabi Muhammad saw. dari Makkah menuju kota tujuan baru membangun peradaban Islam terjadi ke kota...',
      options: ['Madinah (Yatsrib)', 'Damaskus', 'Baghdad', 'Kairo'],
      answer: 0,
      explanation: 'Nabi Muhammad saw. hijrah ke Yatsrib yang kemudian berganti nama menjadi Madinah al-Munawwarah.',
      hint: 'Kota tempat berdirinya Masjid Nabawi.',
    },
    // SEDANG (9)
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Ketika peristiwa Isra Mikraj dikabarkan kepada penduduk Makkah, banyak yang meragukannya. Namun Abu Bakar langsung membenarkannya tanpa ragu sedikit pun.',
      question: 'Dari peristiwa keteguhan iman tersebut, Abu Bakar memperoleh gelar...',
      options: ['Al-Faruq', 'As-Siddiq', 'Saifullah', 'Babul Ilmi'],
      answer: 1,
      explanation: 'As-Siddiq berarti orang yang senantiasa membenarkan kebenaran yang dibawa Rasulullah saw.',
      hint: 'Berasal dari kata "sidiq" (benar/membenarkan).',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Pada masa kekhalifahan Umar bin Khattab r.a., beliau sering berpatroli malam sendirian untuk memastikan tidak ada rakyatnya yang kelaparan.',
      question: 'Jasa besar Khalifah Umar bin Khattab r.a. yang masih digunakan umat Islam di seluruh dunia hingga hari ini adalah...',
      options: ['Menetapkan penanggalan Kalender Hijriah', 'Membangun Ka\'bah pertama kali', 'Menaklukkan Andalusia', 'Mendirikan Universitas Al-Azhar'],
      answer: 0,
      explanation: 'Umar bin Khattab r.a. menetapkan kalender Hijriah dimulai dari peristiwa hijrah Nabi Muhammad saw.',
      hint: 'Berkaitan dengan perhitungan tahun 1 Muharam.',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Saat umat Islam di Madinah kesulitan air bersih, Usman bin Affan r.a. membeli Sumur Raumah dengan hartanya sendiri lalu mewakafkannya untuk seluruh warga secara gratis.',
      question: 'Jasa agung Khalifah Usman bin Affan r.a. dalam menjaga kemurnian kitab suci Al-Qur\'an adalah...',
      options: ['Menyeragamkan dan menggandakan Mushaf Al-Qur\'an (Mushaf Usmani) ke berbagai wilayah', 'Menerjemahkan Al-Qur\'an ke bahasa Latin', 'Mengubah urutan surah Al-Qur\'an', 'Menyimpan mushaf hanya di rumah pribadi'],
      answer: 0,
      explanation: 'Usman bin Affan membentuk tim penyalinan Mushaf Usmani agar tidak terjadi perbedaan bacaan di wilayah Islam yang luas.',
      hint: 'Dikenal dengan nama Mushaf Usmani.',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Ali bin Abi Thalib r.a. dikenal sangat cerdas, berani, dan sejak kecil diasuh langsung oleh Nabi Muhammad saw. sehingga dijuluki "Gerbangnya Ilmu".',
      question: 'Kebijakan penting di bidang ilmu bahasa Arab pada masa Khalifah Ali bin Abi Thalib r.a. adalah...',
      options: ['Memelopori penyusunan ilmu Nahwu (tata bahasa Arab) melalui Abul Aswad ad-Duali', 'Membangun armada kapal dagang ke Amerika', 'Membuat mesin cetak buku', 'Menetapkan mata uang kertas'],
      answer: 0,
      explanation: 'Ali bin Abi Thalib memerintahkan Abul Aswad ad-Duali menyusun dasar ilmu Nahwu agar umat non-Arab membaca Al-Qur\'an dengan benar.',
      hint: 'Berkaitan dengan tata bahasa Arab (Nahwu).',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Setibanya di Madinah, langkah pertama yang dilakukan Nabi Muhammad saw. adalah membangun Masjid Nabawi, mempersaudarakan kaum Muhajirin dan Ansar, serta menyusun Piagam Madinah.',
      question: 'Isi pokok Piagam Madinah yang menjadi teladan bagi kehidupan berbangsa di Indonesia adalah...',
      options: ['Kesepakatan hidup rukun, saling melindungi, dan menghormati kebebasan beragama antarpenduduk Madinah', 'Pengusiran seluruh penduduk non-muslim dari Madinah', 'Larangan berdagang di pasar kota', 'Penghapusan semua suku di Jazirah Arab'],
      answer: 0,
      explanation: 'Piagam Madinah adalah konstitusi masyarakat majemuk yang menjunjung keadilan, persatuan, dan toleransi.',
      hint: 'Konstitusi persatuan masyarakat majemuk.',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Pada tahun 8 Hijriah, Nabi Muhammad saw. memasuki kembali kota Makkah bersama ribuan sahabat secara damai tanpa pertumpahan darah.',
      question: 'Peristiwa pembebasan kota Makkah secara damai penuh pemaafan tersebut dinamakan...',
      options: ['Fathu Makkah', 'Perang Badar', 'Haji Wada', 'Perjanjian Hudaibiyah'],
      answer: 0,
      explanation: 'Fathu Makkah (Pembebasan Makkah) memperlihatkan sifat pemaaf agung Rasulullah saw. kepada penduduk Makkah.',
      hint: '"Fathu" berarti pembebasan/pembukaan.',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Sebelum wafat, Nabi Muhammad saw. melaksanakan ibadah haji terakhirnya di Padang Arafah dan menyampaikan khutbah perpisahan penuh pesan kemanusiaan.',
      question: 'Haji terakhir Nabi Muhammad saw. yang disertai turunnya QS. al-Maidah ayat 3 disebut...',
      options: ['Haji Wada', 'Haji Tamattu', 'Umrah Qada', 'Fathu Makkah'],
      answer: 0,
      explanation: 'Haji Wada berarti Haji Perpisahan, di mana Nabi berpesan agar umat berpegang teguh pada Al-Qur\'an dan Sunah.',
      hint: '"Wada" artinya perpisahan.',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Nabi Ibrahim a.s. dan putranya Nabi Ismail a.s. menunjukkan ketaatan luar biasa kepada perintah Allah Swt. hingga membangun kembali Baitullah.',
      question: 'Bangunan suci yang dibangun kembali oleh Nabi Ibrahim a.s. dan Nabi Ismail a.s. sebagai kiblat umat Islam adalah...',
      options: ['Ka\'bah di Masjidil Haram', 'Masjid Al-Aqsa', 'Masjid Quba', 'Masjid Nabawi'],
      answer: 0,
      explanation: 'Nabi Ibrahim dan Nabi Ismail meninggikan fondasi Ka\'bah di Makkah.',
      hint: 'Kiblat salat umat Islam sedunia.',
    },
    {
      elementId: 5,
      difficulty: 'sedang',
      stimulus: 'Para sahabat yang rela meninggalkan kampung halaman dan harta benda di Makkah demi mempertahankan iman lalu pindah ke Madinah mendapat sebutan khusus.',
      question: 'Penduduk asli Madinah yang menyambut dengan tangan terbuka dan menolong kaum Muhajirin disebut kaum...',
      options: ['Ansar', 'Quraisy', 'Badui', 'Muhajirin'],
      answer: 0,
      explanation: 'Ansar berarti para penolong, yaitu penduduk Madinah yang menolong Nabi dan kaum Muhajirin.',
      hint: 'Artinya kaum penolong.',
    },
    // SULIT (5)
    {
      elementId: 5,
      difficulty: 'sulit',
      stimulus: 'Analisis Sejarah AKM: Saat peristiwa Fathu Makkah, kaum Quraisy yang dahulu menyiksa dan mengusir umat Islam merasa ketakutan akan pembalasan. Namun Rasulullah saw. justru bersabda: "Pergilah kalian, sesungguhnya kalian semua bebas."',
      question: 'Hikmah strategis dan moral terbesar dari sikap pemaaf Rasulullah saw. pada Fathu Makkah adalah...',
      options: [
        'Menunjukkan kelemahan pasukan Islam di hadapan lawan',
        'Meluluhkan hati masyarakat Makkah sehingga mereka berbondong-bondong memeluk Islam dengan sukarela dan menciptakan perdamaian abadi',
        'Membuat musuh kembali memerangi Madinah esok harinya',
        'Menghapus seluruh aturan hukum di kota Makkah',
      ],
      answer: 1,
      explanation: 'Kemenangan sejati dalam Islam bukan dengan dendam, melainkan dengan kasih sayang yang menaklukkan hati manusia.',
      hint: 'Kemenangan yang merangkul hati masyarakat tanpa dendam.',
    },
    {
      elementId: 5,
      difficulty: 'sulit',
      stimulus: 'Studi Keteladanan AKM: Suatu malam Khalifah Umar bin Khattab r.a. mendengar tangisan anak-anak kelaparan di sebuah gubuk. Ia sendiri yang memanggul sekarung gandum dari Baitul Mal dan menolak dibantu pengawalnya sambil berkata, "Apakah engkau mau menanggung dosaku di hari kiamat?"',
      question: 'Nilai kepemimpinan utama dari kisah tersebut yang relevan bagi seorang ketua kelas atau pemimpin masa depan adalah...',
      options: [
        'Pemimpin boleh memerintah bawahan tanpa pernah turun memeriksa keadaan',
        'Kepemimpinan adalah amanah pelayanan yang penuh tanggung jawab, peka terhadap kesulitan anggota, dan rendah hati',
        'Pemimpin harus selalu menyimpan seluruh tugas sendirian tanpa bekerja sama',
        'Jabatan adalah sarana untuk mendapatkan fasilitas paling mewah',
      ],
      answer: 1,
      explanation: 'Umar bin Khattab meneladankan bahwa pemimpin adalah pelayan masyarakat yang kelak dimintai pertanggungjawaban di hadapan Allah.',
      hint: 'Fokus pada amanah, kepekaan sosial, dan tanggung jawab pemimpin.',
    },
    {
      elementId: 5,
      difficulty: 'sulit',
      stimulus: 'Perhatikan kronologi sejarah kodifikasi Al-Qur\'an: (A) Ditulis di pelepah kurma/kulit dan dihafal sahabat pada masa Nabi; (B) Dikumpulkan menjadi satu suhuf karena banyak hafiz gugur di Perang Yamamah; (C) Diseragamkan dalam satu dialek resmi dan digandakan ke berbagai kota.',
      question: 'Pemimpin yang berjasa besar pada tahap (B) dan tahap (C) secara berturut-turut adalah...',
      options: [
        'Umar bin Khattab — Ali bin Abi Thalib',
        'Abu Bakar as-Siddiq — Usman bin Affan',
        'Usman bin Affan — Abu Bakar as-Siddiq',
        'Ali bin Abi Thalib — Umar bin Khattab',
      ],
      answer: 1,
      explanation: 'Tahap (B) penghimpunan mushaf dilakukan atas usul Umar pada masa Khalifah Abu Bakar; Tahap (C) standardisasi & penggandaan pada masa Khalifah Usman bin Affan.',
      hint: 'Abu Bakar mengumpulkan pertama kali, Usman menyeragamkan & menggandakan.',
    },
    {
      elementId: 5,
      difficulty: 'sulit',
      stimulus: 'Analisis Konstitusi AKM: Piagam Madinah disusun oleh Nabi Muhammad saw. untuk menyatukan suku Aus, Khazraj, Muhajirin, serta komunitas Yahudi dan non-muslim lainnya di Madinah.',
      question: 'Kesamaan nilai paling mendasar antara Piagam Madinah dan semboyan Bhinneka Tunggal Ika di Indonesia adalah...',
      options: [
        'Keduanya memaksakan satu suku menjadi penguasa tunggal',
        'Keduanya menjamin persatuan, keadilan hukum, toleransi beragama, dan kerja sama membela tanah air di tengah keberagaman',
        'Keduanya melarang interaksi perdagangan antarsuku',
        'Keduanya hanya berlaku pada masa peperangan saja',
      ],
      answer: 1,
      explanation: 'Piagam Madinah adalah teladan nyata bagaimana Islam merangkul keberagaman dalam ikatan persatuan dan keadilan sosial.',
      hint: 'Persatuan dalam keberagaman yang adil dan damai.',
    },
    {
      elementId: 5,
      difficulty: 'sulit',
      stimulus: 'Ketika terjadi konflik peletakan kembali batu Hajar Aswad di Ka\'bah yang hampir memicu perang antarsuku Quraisy, Nabi Muhammad saw. menggelar kain sorbannya dan meminta setiap kepala suku memegang ujung kain bersama-sama.',
      question: 'Pelajaran pemecahan masalah (problem solving) dari peristiwa tersebut yang dapat diterapkan saat terjadi perselisihan di sekolah adalah...',
      options: [
        'Membiarkan kelompok terkuat mengambil keputusan sendiri',
        'Mencari solusi adil yang melibatkan semua pihak agar merasa dihargai sehingga persatuan tetap terjaga',
        'Menghukum semua pihak yang berselisih tanpa mendengar pendapatnya',
        'Menunda pekerjaan sampai semua orang lupa',
      ],
      answer: 1,
      explanation: 'Kebijaksanaan Nabi Muhammad saw. menciptakan win-win solution yang menyatukan seluruh suku dengan terhormat.',
      hint: 'Solusi adil dan partisipatif yang membuat semua pihak merasa dihargai.',
    },
  ],
};

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Classifies a legacy curriculum question into mudah / sedang / sulit
 * based on AKM markers, stimulus length, and question complexity.
 */
function inferDifficulty(q: QuizQuestion, index: number): DifficultyLevel {
  const txt = `${q.stimulus || ''} ${q.question}`.toLowerCase();
  if (txt.includes('level 3') || txt.includes('merefleksi') || txt.includes('evaluasi') || txt.includes('analisis')) {
    return 'sulit';
  }
  if (txt.includes('level 1') || txt.includes('memahami') || (!q.stimulus && q.question.length < 75)) {
    return index === 0 ? 'mudah' : 'sedang';
  }
  return 'sedang';
}

/**
 * Builds an AKM mission deck of exact size `targetCount` (10..15)
 * enforcing the difficulty distribution:
 *   - Mudah: 10%
 *   - Sedang: 60%
 *   - Sulit: 30%
 */
export function buildAkmMissionDeck(
  stageId: number,
  baseQuestions: QuizQuestion[],
  targetCount: number = 10
): AkmQuizQuestion[] {
  const clampedCount = Math.max(10, Math.min(15, Math.round(targetCount)));

  // Target quotas: 10% mudah, 30% sulit, 60% sedang
  const mudahTarget = Math.max(1, Math.round(clampedCount * 0.1));
  const sulitTarget = Math.max(1, Math.round(clampedCount * 0.3));
  const sedangTarget = Math.max(1, clampedCount - mudahTarget - sulitTarget);

  // Merge grade-specific curriculum questions + curated element AKM bank
  const convertedBase: AkmQuizQuestion[] = baseQuestions.map((q, idx) => ({
    ...q,
    difficulty: inferDifficulty(q, idx),
    elementId: stageId,
  }));

  const curatedPool = ELEMENT_AKM_BANK[stageId] || ELEMENT_AKM_BANK[1];

  // Deduplicate by normalized question string (keeping grade-specific first)
  const seen = new Set<string>();
  const combined: AkmQuizQuestion[] = [];
  for (const q of [...convertedBase, ...curatedPool]) {
    const key = q.question.trim().toLowerCase().slice(0, 65);
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(q);
    }
  }

  const mudahPool = shuffleArray(combined.filter((q) => q.difficulty === 'mudah'));
  const sedangPool = shuffleArray(combined.filter((q) => q.difficulty === 'sedang'));
  const sulitPool = shuffleArray(combined.filter((q) => q.difficulty === 'sulit'));

  const pick = (pool: AkmQuizQuestion[], count: number, fallbackPools: AkmQuizQuestion[][]): AkmQuizQuestion[] => {
    const picked: AkmQuizQuestion[] = [];
    while (picked.length < count && pool.length > 0) {
      picked.push(pool.shift()!);
    }
    for (const fb of fallbackPools) {
      while (picked.length < count && fb.length > 0) {
        picked.push(fb.shift()!);
      }
    }
    return picked;
  };

  const mudahSelected = pick(mudahPool, mudahTarget, [sedangPool, sulitPool]);
  const sedangSelected = pick(sedangPool, sedangTarget, [sulitPool, mudahPool]);
  const sulitSelected = pick(sulitPool, sulitTarget, [sedangPool, mudahPool]);

  // Progressive AKM flow: Mudah -> Sedang -> Sulit
  return [...mudahSelected, ...sedangSelected, ...sulitSelected].slice(0, clampedCount);
}
