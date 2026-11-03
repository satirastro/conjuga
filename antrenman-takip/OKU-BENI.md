# Antrenman Takip

Tek sayfalık, internetsiz çalışan antrenman takip uygulaması. Hesap ve sunucu yok; veriler telefondaki tarayıcıda (localStorage) saklanır.

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Uygulamanın kendisi (ekranlar ve mantık) |
| `program.js` | **Antrenman programı** — hareketler, set, tekrar, ağırlık. Değiştirmek istediğin yer burası |
| `hareketler.js` | Her hareketin "nasıl yapılır" metni, diyagramı ve YouTube arama sözcüğü |
| `diyagram.js` | Çizgi-adam diyagramlarını çizen küçük motor |
| `sw.js` | İnternetsiz çalışmayı sağlar. Dosyaları güncellersen içindeki `SURUM` değerini artır (v1 → v2) |
| `manifest.webmanifest`, `ikon-*.png` | Ana ekrana eklenince uygulama gibi açılmasını sağlar |

Programı değiştirmenin iki yolu var: uygulamanın içindeki **Program** sekmesi (önerilen; yalnızca o telefonu etkiler) ya da `program.js` dosyası (yeni kurulumlar için varsayılanı değiştirir).
