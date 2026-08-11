const RECEIVER = 'riruyaaa@gmail.com';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const b = req.body || {};

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1F4E40">케이스노트 협업 신청이 들어왔습니다</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr style="background:#f1f5f9"><th style="text-align:left;padding:10px 14px;width:35%">병원명</th><td style="padding:10px 14px">${b['병원명'] || '-'}</td></tr>
          <tr><th style="text-align:left;padding:10px 14px">지역</th><td style="padding:10px 14px">${b['지역'] || '-'}</td></tr>
          <tr style="background:#f1f5f9"><th style="text-align:left;padding:10px 14px">연락처</th><td style="padding:10px 14px">${b['연락처'] || '-'}</td></tr>
          <tr><th style="text-align:left;padding:10px 14px">원하시는 게시 주기</th><td style="padding:10px 14px">${b['게시_주기'] || '-'}</td></tr>
          <tr style="background:#f1f5f9"><th style="text-align:left;padding:10px 14px;vertical-align:top">소개하고 싶은 케이스 / 강점</th><td style="padding:10px 14px;white-space:pre-wrap">${b['소개_케이스'] || '-'}</td></tr>
        </table>
      </div>
    `;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: '케이스노트 신청 알림 <onboarding@resend.dev>',
        to: [RECEIVER],
        subject: `[케이스노트 신청] ${b['병원명'] || '병원'}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: '이메일 전송 실패' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류' });
  }
};
