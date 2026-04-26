# İzin Talep ve Yönetim Sistemi

Bu proje, personellerin izin talebi oluşturabildiği ve yöneticilerin bu talepleri inceleyerek onaylayabildiği veya reddedebildiği basit bir fullstack uygulamadır. Amaç, manuel olarak yürütülen izin süreçlerini dijital ortama taşıyarak daha düzenli ve yönetilebilir bir yapı oluşturmaktır.

---

## Projenin Amacı

Küçük ve orta ölçekli işletmelerde izin süreçleri genellikle sözlü iletişim veya dağınık araçlar üzerinden yürütülmektedir. Bu durum hatalara, iletişim sorunlarına ve zaman kaybına yol açmaktadır.

Bu proje ile:

- İzin taleplerinin merkezi bir sistem üzerinden yönetilmesi  
- Yönetici onay sürecinin standartlaştırılması  
- Kullanıcıların kolay ve hızlı işlem yapabilmesi  

hedeflenmiştir.

---

## Kullanılan Teknolojiler

Frontend tarafında React (Vite) ve Tailwind CSS kullanılmıştır.  
Backend tarafında Node.js ve Express ile REST API geliştirilmiştir.  

Veri saklama işlemi için JSON dosyası kullanılmıştır.

---

## Proje Yapısı

Proje iki ana bölümden oluşmaktadır:

- backend: API servislerini içerir  
- frontend: kullanıcı arayüzünü içerir  

Backend tarafında veriler `data.json` dosyasında tutulmaktadır.

---

## Kurulum ve Çalıştırma

Uygulamanın çalışması için backend ve frontend ayrı ayrı başlatılmalıdır.

Backend şu adreste çalışır:

http://localhost:3000

Frontend şu adreste çalışır:

http://localhost:5173

Giriş Sistemi

Sistemde iki kullanıcı rolü bulunmaktadır:

Personel:

Kullanıcı adı: personel
Şifre: 1234

Yönetici:

Kullanıcı adı: admin
Şifre: 1234

Bu yapı demo amaçlıdır ve gerçek bir kimlik doğrulama sistemi değildir.

API Yapısı

GET /izinler
Tüm izin taleplerini listeler

POST /izin-talep
Yeni izin talebi oluşturur

PUT /izin-durum/:id
İzin durumunu günceller

Hata Yönetimi
Eksik veri → 400 hatası
Geçersiz tarih → hata mesajı
Kayıt bulunamaz → 404 hatası

Frontend tarafında kullanıcıya anlamlı geri bildirim gösterilir.

Tarih İşlemleri

Girilen tarihler doğrulanır.
Başlangıç tarihi bitiş tarihinden sonra olamaz.

Tarihler kullanıcıya okunabilir formatta gösterilir.
