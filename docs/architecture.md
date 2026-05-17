# GsForum - Mevcut Durum Dokumani

## Genel Bakis

- Proje TypeScript ile yazildi.
- Servisler su an in-memory Map kullaniyor (kalici DB yok).
- Mesajlasma icin RabbitMQ provider eklendi.

## Modeller (models/)

- User: kullanici bilgileri + sadakat puani + postCount.
- Admin: User uzerinden turetilir, banUser metodu var.
- Moderator: User uzerinden turetilir, flagPost metodu var.
- Post: gonderi, AI alanlari ve upvote metodu var.
- Topic: konu, postId listesi tutar.
- AuthToken: token ve expire bilgisi.
- AiResult: AI sonucu ve skor bilgisi.

## Servisler (services/)

- UserService: kullanici CRUD + increaseSadakat + incrementPostCount.
- PostService: post CRUD + AI guncelleme + post.created olayi yayinlar.
- TopicService: topic CRUD + addPostToTopic.
- AuthService: register/login + token uretimi (in-memory).
- AiService: AI sonucu CRUD.
- AdminService: admin CRUD + banUser.
- ModeratorService: moderator CRUD + flagPost.
- RabbitMQProvider: IQueueProvider implementasyonu (connect/publish/subscribe).
- UserStatsWorker: post.created olayini dinler, UserService.incrementPostCount cagirir.

## Interface'ler (interfaces/)

- IQueueProvider: connect, publish, subscribe sozlesmesi.
- PostCreatedEvent: post.created mesaj yapisi.

## Servisler Arasi Iletisim (Event-Driven)

- PostService -> IQueueProvider ile mesaj gonderir:
  - event: post.created
  - payload: PostCreatedEvent (post.toJSON())
- UserStatsWorker -> IQueueProvider ile kuyrugu dinler:
  - post.created geldiginde UserService.incrementPostCount cagirir.
- PostService ve UserService birbirini dogrudan tanimaz (gevsek baglilik).

## HTTP Giris Noktasi (main.ts)

- Express API:
  - GET /health
  - POST /users
  - GET /users
  - POST /posts
  - GET /posts

## Notlar

- Simdilik tum servisler bellek icinde calisir.
- RabbitMQ baglantisi icin RabbitMQProvider kullanilir.
- Production icin DB ve kalici kuyruk ayarlari eklenebilir.
