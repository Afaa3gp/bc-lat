export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], customApiKey } = req.body || {};
  const fallbackKey = Buffer.from('QVEuQWI4Uk42SzU2Y2JyVnc4TGdObUtjZktjN05LanRhVzVLVmFkOFZ6RFR1blZEaU9OVnc=', 'base64').toString('utf-8');
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || fallbackKey;

  const systemInstruction = `Kamu adalah Kila, Customer Service AI resmi dari "BC-LAT Market Online" (aplikasi quick-commerce belanja kebutuhan harian, tiba dalam 15 menit, buka 24 jam di Sleman/Yogyakarta).
Karakter: Ramah, santai, gaul khas anak muda/mahasiswa Indonesia, seru, suka bercanda tapi tetap membantu.
PENTING:
- Jawab singkat dan natural (1-2 kalimat saja) layaknya live chat WhatsApp / e-commerce beneran.
- Gunakan emoji secukupnya agar chat terasa hidup.
- Jika user tanya paket data/pulsa/token PLN, jelaskan secara ramah bahwa saat ini belum tersedia dan BC-LAT fokus belanjaan fisik (sembako, sayur, daging, mie, snack, kopi) antar 15 menit.
- Jika diajak bercanda, ngajak gelut/berantem, gombal, atau curhat, tanggapi dengan santai dan kocak.`;

  try {
    const validContents = [];
    for (const h of history.slice(-6)) {
      const role = h.from === 'me' ? 'user' : 'model';
      if (validContents.length === 0 && role !== 'user') continue;
      if (validContents.length > 0 && validContents[validContents.length - 1].role === role) continue;
      validContents.push({ role, parts: [{ text: h.text }] });
    }

    if (validContents.length === 0 || validContents[validContents.length - 1].role !== 'user') {
      validContents.push({ role: 'user', parts: [{ text: message }] });
    } else {
      validContents[validContents.length - 1].parts = [{ text: message }];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: validContents,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 200,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ error: 'GEMINI_ERROR', details: errData });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Halo kak! Ada yang bisa Kila bantu lagi? ⚡';

    return res.status(200).json({ reply: replyText });
  } catch (err) {
    return res.status(500).json({ error: 'SERVER_ERROR', message: err.message });
  }
}
