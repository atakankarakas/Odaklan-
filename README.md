# Odaklan! 🎯

**Türkçe Pomodoro Zamanlayıcı** — Odaklanmanı artır, verimliliğini takip et.

![Odaklan! Screenshot](screenshot.png)

## ✨ Özellikler

### ⏱️ Pomodoro Zamanlayıcı
- **Özelleştirilebilir süreler** (Ayarlar panelinden)
- Odak / Kısa Mola / Uzun Mola modları
- Her 4 pomodoro'dan sonra otomatik uzun mola
- Görsel ilerleme halkası (çalışırken parlama efekti)
- **Otomatik başlatma** seçeneği (mola/odak geçişlerinde)

### ✅ Görev Yönetimi
- **Numaralı görev listesi** (1. 2. 3.)
- **Aktif görev göstergesi** (🎯 Odaklanıyorsun)
- Görev tamamlandığında **otomatik sonrakine geçiş**
- **Sürükle-bırak** ile sıralama
- Görevler `localStorage`'da saklanır

### 📊 İstatistikler
- **Günlük odaklanma süresi** takibi
- **Pomodoro sayacı** (sayfa yenilense bile korunur)
- **Son 7 gün geçmişi** ile haftalık performans
- Aylık karşılaştırma ve motivasyon mesajları

### 🎨 Poster Oluşturucu ("Trophy Room")
- **Instagram Story** veya **Feed** formatında dışa aktarma
- Motivasyon sözleri (Türk/İslam kültüründen)
- Tek tıkla indirme

### ⚙️ Ayarlar Paneli
- **Zamanlayıcı süreleri** (Odak, Kısa Mola, Uzun Mola)
- **Ses ayarları** (Alarm, Ambiyans, Ses seviyesi)
- **Dil seçimi** (Türkçe/İngilizce)
- Tüm ayarlar kalıcı olarak kaydedilir

### 🔔 Bildirimler
- Tarayıcı bildirimleri (izin gerektirir)
- iOS/PWA için akıllı yönlendirme
- Sesli uyarılar (özelleştirilebilir)

### 🎵 Ambiyans Sesleri
- **Sessiz** | **Yağmur** | **Kafe** | **Şömine**
- Ayarlar panelinden kontrol

### 📱 Mobil Native Deneyim
- **44px+ dokunma alanları** (Apple HIG uyumlu)
- **Safe Area** desteği (iPhone çentik/home indicator)
- **touch-manipulation** (çift tıklama zoom engeli)
- **Active state feedback** (her dokunuşta görsel geri bildirim)
- PWA desteği (Ana ekrana eklenebilir)

---

## 🚀 Kurulum

### Yerel Kullanım
```bash
# Projeyi klonlayın
git clone https://github.com/atakankarakas/odaklan.git

# Klasöre gidin
cd odaklan

# Tarayıcıda açın veya sunucu başlatın:
npx serve .
```

### Canlı Demo
[🔗 Odaklan! Demo](https://atakankarakas.github.io/odaklan)

---

## 📁 Proje Yapısı

```
Odaklan!/
├── index.html          # Ana uygulama (tek dosya)
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── README.md           # Bu dosya
└── assets/
    └── sounds/         # Ses dosyaları
        ├── rain.mp3
        ├── cafe.mp3
        ├── fireplace.mp3
        ├── complete.mp3
        └── break-end.mp3
```

---

## 🛠️ Teknolojiler

| Teknoloji | Kullanım |
|-----------|----------|
| **HTML5** | Yapı |
| **Tailwind CSS** (CDN) | Stil |
| **Vanilla JavaScript** | Mantık |
| **LocalStorage** | Veri kalıcılığı |
| **Web Notifications API** | Bildirimler |
| **html2canvas** | Poster oluşturma |
| **Service Worker** | PWA & Cache |

---

## 📖 Kullanım

1. **Mod Seç:** Odak / Kısa Mola / Uzun Mola
2. **Görev Ekle:** Görevler bölümünden ekle, sırala, tamamla
3. **Başla:** Timer'ı başlat (Space tuşu da çalışır)
4. **Odaklan:** İlerleme halkasını izle
5. **İstatistikler:** Sağ üstteki süreye tıkla
6. **Poster:** İstatistikler > Poster Oluştur

### Klavye Kısayolları
| Tuş | İşlem |
|-----|-------|
| `Space` | Başla / Durdur |
| `R` | Sıfırla |
| `Esc` | Modal'ı kapat / Durdur |

---

## 📄 Lisans

MIT License — Özgürce kullanın, değiştirin, paylaşın.

---

## 👨‍💻 Geliştirici

**Atakan Karakaş**

---

<p align="center">
  <sub>🍅 Odaklanın, başarın! 🍅</sub>
</p>
