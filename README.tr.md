# Seesaw Simulation

**Seesaw Simulation**, fizik kurallarına (tork dengesi) dayalı, interaktif bir web tabanlı tahterevalli simülasyonudur. Kullanıcıların tahterevalli üzerine farklı ağırlıklarda nesneler ekleyerek denge değişimlerini gerçek zamanlı gözlemlemelerini sağlar.

🔗 **Canlı Demo:** [seesaw.yunuscanunal.me](http://seesaw.yunuscanunal.me)

## 🚀 Özellikler

* **Gerçek Zamanlı Fizik:** Sol ve sağ taraftaki toplam torku (Ağırlık x Mesafe) hesaplar ve tahterevallinin açısını buna göre günceller.
* **İnteraktif Kontroller:**
  * Tahterevalli üzerine tıklayarak rastgele ağırlıkta (1-10kg) nesneler bırakabilirsiniz.
  * Fare ile gezinirken nesnenin nereye düşeceğini gösteren "hayalet" önizleme (preview) özelliği.
* **Görsel Geri Bildirim:** Nesnelerin renkleri ağırlıklarına göre yeşilden (hafif) kırmızıya (ağır) doğru dinamik renk geçişi (HSL) ile değişir.
* **Veri Kalıcılığı (Persistence):** Tarayıcıyı yenileseniz bile sahne durumu `localStorage` kullanılarak korunur.
* **Aktivite Günlüğü:** Yapılan her işlem (nesne ekleme, sıfırlama) zaman damgasıyla kaydedilir.
* **Detaylı İstatistik Paneli:**
  * Sol/Sağ Taraf Ağırlığı (kg) ve Torku (Nm)
  * Toplam Nesne Sayısı
  * Anlık Eğim Açısı

## 🛠️ Teknolojiler

Proje, herhangi bir dış kütüphane veya framework kullanılmadan saf (vanilla) web teknolojileri ile geliştirilmiştir:

* **HTML5:** Semantik yapı.
* **CSS3:** Flexbox, CSS Grid, `transform` rotasyonları ve görsel efektler.
* **JavaScript (ES6+):** Fizik motoru, DOM manipülasyonu ve durum yönetimi.

## 🧮 Nasıl Çalışır? (Fizik Mantığı)

Simülasyon, **Tork (Moment)** prensibine dayanır:

$$\tau = F \times d$$

* **$\tau$ (Tork):** Döndürme etkisi.
* **$F$ (Kuvvet):** Nesnenin ağırlığı (kg).
* **$d$ (Mesafe):** Nesnenin denge noktasına (pivot) olan uzaklığı (px).

Sistem her nesne eklendiğinde sol ve sağ taraftaki toplam torku hesaplar. Net tork farkına göre tahterevallinin açısı (`rotate`) güncellenir. Açı, maksimum ±30 derece ile sınırlandırılmıştır.

## 📂 Proje Yapısı

seesaw-simulation/
├── index.html      # Ana sayfa yapısı ve paneller
├── styles.css      # Arayüz tasarımı ve animasyonlar
├── app.js          # Fizik hesaplamaları ve oyun mantığı
├── README.md       # Proje dokümantasyonu
└── CNAME           # Custom domain ayarı

## 📦 Kurulum ve Çalıştırma

Bu proje statik bir web sitesidir, çalıştırmak için Node.js vb. bir backend kurulumuna gerek yoktur.

1.  Repoyu klonlayın:
    ```bash
    git clone [https://github.com/yunuscanunal/seesaw-simulation.git](https://github.com/yunuscanunal/seesaw-simulation.git)
    ```
2.  Klasörün içine girin ve `index.html` dosyasını tarayıcınızda açın.

## 🤝 Katkıda Bulunma

1.  Forklayın.
2.  Feature branch oluşturun (`git checkout -b feature/YeniOzellik`).
3.  Commit atın (`git commit -m 'Yeni özellik eklendi'`).
4.  Pushlayın (`git push origin feature/YeniOzellik`).
5.  Pull Request açın.

---
*Geliştirici: [Yunuscan Ünal](https://github.com/yunuscanunal)*

