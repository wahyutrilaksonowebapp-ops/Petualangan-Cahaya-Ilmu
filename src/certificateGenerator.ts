// High-Resolution Certificate Generator for SDN Kedungringin I Beji

export interface CertificateInfo {
  playerName: string;
  grade: number;
  fase: string;
  season: number;
  rankTitle: string;
  totalXp: number;
  badges: boolean[];
}

export function generateCertificateCanvas(canvas: HTMLCanvasElement, info: CertificateInfo): void {
  const width = 1600;
  const height = 1130; // Landscape A4 ratio
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Parchment Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#fefce8');
  bgGrad.addColorStop(0.5, '#ffffff');
  bgGrad.addColorStop(1, '#fef9c3');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative Border Pattern (Islamic Arch Style)
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 14;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, width - 96, height - 96);

  // Corner Stars (۞)
  ctx.fillStyle = '#854d0e';
  ctx.font = '54px "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.fillText('۞', 70, 85);
  ctx.fillText('۞', width - 70, 85);
  ctx.fillText('۞', 70, height - 60);
  ctx.fillText('۞', width - 70, height - 60);

  // Header Institution
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PEMERINTAH KABUPATEN PASURUAN • DINAS PENDIDIKAN', width / 2, 105);

  ctx.fillStyle = '#713f12';
  ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SDN KEDUNGRINGIN I BEJI', width / 2, 150);

  ctx.fillStyle = '#64748b';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Jl. Raya Kedungringin, Kec. Beji, Kab. Pasuruan, Jawa Timur 67154', width / 2, 180);

  // Dividing Gold Line with Star
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 380, 205);
  ctx.lineTo(width / 2 + 380, 205);
  ctx.stroke();

  ctx.fillStyle = '#ca8a04';
  ctx.font = '28px serif';
  ctx.fillText('★', width / 2, 213);

  // Certificate Title
  ctx.fillStyle = '#451a03';
  ctx.font = 'bold 48px "Cinzel", "Amiri", serif';
  ctx.fillText('SERTIFIKAT KETUNTASAN', width / 2, 275);

  ctx.fillStyle = '#854d0e';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI • CP 020/2026', width / 2, 312);

  ctx.fillStyle = '#475569';
  ctx.font = 'italic 20px "Plus Jakarta Sans", serif';
  ctx.fillText('Nomor: 421.2/108/PAI-SD/2026', width / 2, 345);

  ctx.fillStyle = '#334155';
  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Diberikan dengan penuh kehormatan kepada:', width / 2, 400);

  // Student Name
  ctx.fillStyle = '#713f12';
  ctx.font = 'bold 54px "Cinzel", "Plus Jakarta Sans", serif';
  ctx.fillText(info.playerName.toUpperCase(), width / 2, 465);

  // Underline beneath name
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 280, 485);
  ctx.lineTo(width / 2 + 280, 485);
  ctx.stroke();

  // Achievement Description Body
  ctx.fillStyle = '#1e293b';
  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  const desc1 = `Atas ketuntasan seluruh eksplorasi materi, simulasi ibadah, dan Ujian Kuis Penjaga Gerbang pada`;
  const desc2 = `Kelas ${info.grade} (${info.fase}) • Season ${info.season} (Semester ${info.season}) di SDN Kedungringin I Beji,`;
  const desc3 = `dengan capaian Gelar Kehormatan: "${info.rankTitle}" dan akumulasi ${info.totalXp} XP Cahaya.`;

  ctx.fillText(desc1, width / 2, 535);
  ctx.fillText(desc2, width / 2, 570);
  ctx.fillText(desc3, width / 2, 605);

  // 5 Badges Showcase
  const badgeLabels = ["Hutan Tajwid", "Keyakinan", "Budi Pekerti", "Ibadah", "Lorong Waktu"];
  const badgeIcons = ["📖", "⭐", "❤️", "🕌", "⏳"];
  const startX = width / 2 - 280;

  for (let i = 0; i < 5; i++) {
    const bx = startX + i * 140;
    const by = 690;
    const isUnlocked = info.badges[i];

    // Circle Badge
    ctx.fillStyle = isUnlocked ? '#fef08a' : '#e2e8f0';
    ctx.beginPath();
    ctx.arc(bx, by, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isUnlocked ? '#ca8a04' : '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '28px serif';
    ctx.fillStyle = isUnlocked ? '#854d0e' : '#94a3b8';
    ctx.fillText(badgeIcons[i], bx, by + 10);

    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isUnlocked ? '#713f12' : '#94a3b8';
    ctx.fillText(badgeLabels[i], bx, by + 58);
  }

  // Official Gold Seal Medallion (Center Bottom)
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.arc(width / 2, 850, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(width / 2, 850, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#713f12';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SEAL OF EXCELLENCE', width / 2, 845);
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PAI & BP SD', width / 2, 865);

  // Signatures
  const dateStr = `Pasuruan, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
  
  // Left: Teacher
  ctx.fillStyle = '#334155';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Mengetahui,', 320, 890);
  ctx.fillText('Guru Pendidikan Agama Islam & BP', 320, 915);

  ctx.font = 'italic bold 22px "Amiri", serif';
  ctx.fillStyle = '#854d0e';
  ctx.fillText('Ust. Pembina PAI & BP', 320, 985);

  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(200, 1005);
  ctx.lineTo(440, 1005);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NIP. 19850412 201001 1 018', 320, 1025);

  // Right: Principal
  ctx.fillStyle = '#334155';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(dateStr, width - 320, 890);
  ctx.fillText('Kepala SDN Kedungringin I Beji', width - 320, 915);

  ctx.font = 'italic bold 22px "Amiri", serif';
  ctx.fillStyle = '#854d0e';
  ctx.fillText('Kepala Sekolah, M.Pd.', width - 320, 985);

  ctx.beginPath();
  ctx.moveTo(width - 440, 1005);
  ctx.lineTo(width - 200, 1005);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.font = '15px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('NIP. 19780820 200312 2 004', width - 320, 1025);
}

export function downloadCertificateAsImage(info: CertificateInfo): void {
  const canvas = document.createElement('canvas');
  generateCertificateCanvas(canvas, info);

  const link = document.createElement('a');
  link.download = `Sertifikat_PAI_${info.playerName.replace(/\s+/g, '_')}_SDN_Kedungringin_I_Beji.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

export function printCertificate(): void {
  window.print();
}
