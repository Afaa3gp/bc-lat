export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, history = [], customApiKey } = req.body || {};
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      error: 'NO_API_KEY',
      message: 'GEMINI_API_KEY belum dikonfigurasi',
    });
  }

  const systemInstruction = `Kamu adalah Kila, Customer Service resmi dari "BC-LAT Market Online" (aplikasi quick-commerce belanja keperluan sehari-hari yang tiba dalam 15 menit, buka 24 jam di Sleman/Yogyakarta).
Identitas & Karakter:
- Nama: Kila ⚡
- Karakter: Ramah, gaul, santai, ekspresif, ceria khas Gen-Z mahasiswa Indonesia, suka bercanda tapi tetap solutif dan membantu.
- Produk yang dijual: Sembako (Beras, Minyak, Telur, Gula, Mie Goreng), Daging & Ayam, Buah & Sayur, Snack, Kopi Susu & Minuman dingin, P3K, dan Produk Kebersihan.
- Fitur utama: Garansi tiba dalam 15 menit dari Dark Store terdekat, buka 24 jam, gratis ongkir belanja Rp30rb pakai voucher FREEONGKIR, diskon 20% kode BCLATHEMAT.
- Format balasan: Singkat dan natural seperti chat WhatsApp / live chat e-commerce sungguhan (1-3 kalimat saja, jangan bikin esai panjang). Gunakan emoji secukupnya.
- Jika pengguna ngajak bercanda, ngajak gelut/berantem, gombal, atau curhat, tanggapi dengan santai, lucu, dan natural layaknya orang beneran.`;

  try {
    // Format pesan sesuai format Gemini generateContent
    const contents = [
      ...history.slice(-8).map((h) => ({
        role: h.from === 'me' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 250,
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
