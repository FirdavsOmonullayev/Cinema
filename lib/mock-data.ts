import { AppLanguage } from "@/lib/i18n";
import type { MediaType, MovieDetail } from "@/lib/types";

type Localized = {
  uz: string;
  ru: string;
  en: string;
};

type MockItem = {
  id: string;
  mediaType: MediaType;
  title: Localized;
  overview: Localized;
  year: string;
  genres: string[];
  platform: string | null;
  imdbRating: string | null;
  imdbId: string | null;
  tmdbRating: number | null;
  runtime: string | null;
  studio: string | null;
  releaseDate: string | null;
  trailerKey: string | null;
  keywords: string[];
};

const txt = (en: string, ru: string, uz: string): Localized => ({ en, ru, uz });

function makePoster(title: string, imdbId: string | null) {
  const params = new URLSearchParams({
    mode: "poster",
    title
  });
  if (imdbId) {
    params.set("imdbId", imdbId);
  }
  return `/api/mock-image?${params.toString()}`;
}

function makeBackdrop(title: string) {
  return `/api/mock-image?mode=backdrop&title=${encodeURIComponent(title)}`;
}

const MOCK_ITEMS: MockItem[] = [
  {
    id: "1001",
    mediaType: "movie",
    title: txt("Avatar", "Аватар", "Avatar"),
    overview: txt(
      "A marine joins the Na'vi world and faces a conflict between duty and conscience.",
      "Морпех попадает в мир На'ви и вынужден выбирать между приказом и совестью.",
      "Dengizchi Na'vi olamiga tushib, buyruq va vijdon orasida tanlov qiladi."
    ),
    year: "2009",
    genres: ["Science Fiction", "Adventure"],
    platform: "Disney+",
    imdbRating: "7.9",
    imdbId: "tt0499549",
    tmdbRating: 7.6,
    runtime: "162 min",
    studio: "20th Century Studios",
    releaseDate: "2009-12-18",
    trailerKey: "5PSNL1qE6VY",
    keywords: ["avatar", "pandora", "science fiction", "hollywood"]
  },
  {
    id: "1002",
    mediaType: "movie",
    title: txt("Avengers: Endgame", "Мстители: Финал", "Qasoskorlar: Final"),
    overview: txt(
      "The Avengers unite for one final mission after Infinity War.",
      "Мстители объединяются для последней миссии после Войны бесконечности.",
      "Qasoskorlar Infinity War'dan keyin yakuniy missiya uchun birlashadi."
    ),
    year: "2019",
    genres: ["Action", "Adventure"],
    platform: "Disney+",
    imdbRating: "8.4",
    imdbId: "tt4154796",
    tmdbRating: 8.2,
    runtime: "181 min",
    studio: "Marvel Studios",
    releaseDate: "2019-04-26",
    trailerKey: "TcMBFSGVi1c",
    keywords: ["marvel", "avengers", "superhero", "endgame"]
  },
  {
    id: "1003",
    mediaType: "movie",
    title: txt("The Dark Knight", "Темный рыцарь", "Qora ritsar"),
    overview: txt(
      "Batman battles Joker as Gotham spirals into chaos.",
      "Бэтмен противостоит Джокеру, пока Готэм погружается в хаос.",
      "Betmen Jokerga qarshi turadi, Gotham esa tartibsizlikka botadi."
    ),
    year: "2008",
    genres: ["Action", "Crime"],
    platform: "Max",
    imdbRating: "9.0",
    imdbId: "tt0468569",
    tmdbRating: 8.5,
    runtime: "152 min",
    studio: "DC Studios",
    releaseDate: "2008-07-18",
    trailerKey: "EXeTwQWrcwY",
    keywords: ["dc", "batman", "joker", "gotham"]
  },
  {
    id: "1004",
    mediaType: "movie",
    title: txt("Dune: Part Two", "Дюна: Часть вторая", "Dyuna: Ikkinchi qism"),
    overview: txt(
      "Paul Atreides leads a rebellion on Arrakis.",
      "Пол Атрейдес возглавляет восстание на Арракисе.",
      "Pol Atreydes Arrakisda qo'zg'olonga boshchilik qiladi."
    ),
    year: "2024",
    genres: ["Science Fiction", "Adventure"],
    platform: "Max",
    imdbRating: "8.5",
    imdbId: "tt15239678",
    tmdbRating: 8.4,
    runtime: "166 min",
    studio: "Legendary",
    releaseDate: "2024-03-01",
    trailerKey: "Way9Dexny3w",
    keywords: ["dune", "arrakis", "science fiction", "warner"]
  },
  {
    id: "1005",
    mediaType: "movie",
    title: txt("Interstellar", "Интерстеллар", "Interstellar"),
    overview: txt(
      "Explorers travel through a wormhole to save humanity.",
      "Команда исследователей проходит через червоточину ради спасения человечества.",
      "Tadqiqotchilar insoniyatni qutqarish uchun chuvalchang teshigidan o'tadi."
    ),
    year: "2014",
    genres: ["Science Fiction", "Drama"],
    platform: "Paramount+",
    imdbRating: "8.7",
    imdbId: "tt0816692",
    tmdbRating: 8.4,
    runtime: "169 min",
    studio: "Syncopy",
    releaseDate: "2014-11-07",
    trailerKey: "zSWdZVtXT7E",
    keywords: ["interstellar", "nolan", "space", "science fiction"]
  },
  {
    id: "1006",
    mediaType: "movie",
    title: txt("Oppenheimer", "Оппенгеймер", "Oppenheimer"),
    overview: txt(
      "The story of J. Robert Oppenheimer and the Manhattan Project.",
      "История Роберта Оппенгеймера и Манхэттенского проекта.",
      "Robert Oppengeymer va Manhattan loyihasi haqidagi hikoya."
    ),
    year: "2023",
    genres: ["Drama", "History"],
    platform: "Peacock",
    imdbRating: "8.3",
    imdbId: "tt15398776",
    tmdbRating: 8.1,
    runtime: "180 min",
    studio: "Universal",
    releaseDate: "2023-07-21",
    trailerKey: "uYPbbksJxIg",
    keywords: ["oppenheimer", "history", "drama"]
  },
  {
    id: "1007",
    mediaType: "movie",
    title: txt("Joker", "Джокер", "Joker"),
    overview: txt(
      "An isolated man descends into madness and becomes Joker.",
      "Одинокий человек постепенно сходит с ума и становится Джокером.",
      "Yolg'iz odam ruhiy inqirozga tushib, Jokerga aylanadi."
    ),
    year: "2019",
    genres: ["Crime", "Drama"],
    platform: "Max",
    imdbRating: "8.4",
    imdbId: "tt7286456",
    tmdbRating: 8.1,
    runtime: "122 min",
    studio: "DC Studios",
    releaseDate: "2019-10-04",
    trailerKey: "zAGVQLHvwOY",
    keywords: ["joker", "dc", "crime", "drama"]
  },
  {
    id: "1008",
    mediaType: "movie",
    title: txt("Parasite", "Паразиты", "Parazitlar"),
    overview: txt(
      "A poor family infiltrates a wealthy household with unexpected consequences.",
      "Бедная семья проникает в дом богачей, что ведет к трагедии.",
      "Kambagal oila boylar uyiga kirib boradi va voqealar keskinlashadi."
    ),
    year: "2019",
    genres: ["Thriller", "Drama"],
    platform: "Hulu",
    imdbRating: "8.5",
    imdbId: "tt6751668",
    tmdbRating: 8.5,
    runtime: "132 min",
    studio: "Barunson E&A",
    releaseDate: "2019-05-30",
    trailerKey: "SEUXfv87Wpk",
    keywords: ["parasite", "korea", "thriller"]
  },
  {
    id: "1009",
    mediaType: "tv",
    title: txt("Loki", "Локи", "Loki"),
    overview: txt(
      "Loki is captured by TVA and forced to fix timeline anomalies.",
      "Локи попадает в TVA и вынужден исправлять временные аномалии.",
      "Loki TVA tomonidan ushlanib, vaqt chizig'ini tuzatishga majbur bo'ladi."
    ),
    year: "2021",
    genres: ["Drama", "Sci-Fi & Fantasy"],
    platform: "Disney+",
    imdbRating: "8.2",
    imdbId: "tt9140554",
    tmdbRating: 8.2,
    runtime: "52 min",
    studio: "Marvel Studios",
    releaseDate: "2021-06-09",
    trailerKey: "nW948Va-l10",
    keywords: ["loki", "marvel", "disney", "series"]
  },
  {
    id: "1010",
    mediaType: "tv",
    title: txt("Wednesday", "Уэнсдэй", "Wednesday"),
    overview: txt(
      "Wednesday Addams investigates a mystery at Nevermore Academy.",
      "Уэнсдэй Аддамс расследует тайну в академии Невермор.",
      "Wednesday Addams Nevermore akademiyasida sirli voqeani tekshiradi."
    ),
    year: "2022",
    genres: ["Mystery", "Comedy"],
    platform: "Netflix",
    imdbRating: "8.0",
    imdbId: "tt13443470",
    tmdbRating: 8.4,
    runtime: "50 min",
    studio: "Netflix",
    releaseDate: "2022-11-23",
    trailerKey: "Di310WS8zLk",
    keywords: ["wednesday", "netflix", "mystery"]
  },
  {
    id: "1011",
    mediaType: "tv",
    title: txt("The Last of Us", "Одни из нас", "So'nggi Umid"),
    overview: txt(
      "Joel and Ellie survive a brutal post-apocalyptic America.",
      "Джоэл и Элли пытаются выжить в жестоком постапокалипсисе.",
      "Joel va Elli postapokaliptik Amerikada omon qolishga harakat qiladi."
    ),
    year: "2023",
    genres: ["Drama", "Action"],
    platform: "Max",
    imdbRating: "8.7",
    imdbId: "tt3581920",
    tmdbRating: 8.6,
    runtime: "58 min",
    studio: "HBO",
    releaseDate: "2023-01-15",
    trailerKey: "uLtkt8BonwM",
    keywords: ["last of us", "hbo", "series", "zombie"]
  },
  {
    id: "1012",
    mediaType: "tv",
    title: txt("Stranger Things", "Очень странные дела", "G'aroyib hodisalar"),
    overview: txt(
      "A group of kids uncover supernatural events in Hawkins.",
      "Группа подростков сталкивается с сверхъестественным в Хокинсе.",
      "Bir guruh bolalar Hawkinsda g'ayritabiiy hodisalarga duch keladi."
    ),
    year: "2016",
    genres: ["Drama", "Sci-Fi & Fantasy"],
    platform: "Netflix",
    imdbRating: "8.7",
    imdbId: "tt4574334",
    tmdbRating: 8.6,
    runtime: "51 min",
    studio: "Netflix",
    releaseDate: "2016-07-15",
    trailerKey: "b9EkMc79ZSU",
    keywords: ["stranger things", "netflix", "series"]
  },
  {
    id: "1013",
    mediaType: "tv",
    title: txt("Game of Thrones", "Игра престолов", "Taxtlar o'yini"),
    overview: txt(
      "Noble families wage war for control of the Iron Throne.",
      "Великие дома Вестероса сражаются за Железный трон.",
      "Vesteroz sulolalari Temir Taxt uchun kurashadi."
    ),
    year: "2011",
    genres: ["Drama", "Fantasy"],
    platform: "Max",
    imdbRating: "9.2",
    imdbId: "tt0944947",
    tmdbRating: 8.5,
    runtime: "57 min",
    studio: "HBO",
    releaseDate: "2011-04-17",
    trailerKey: "KPLWWIOCOOQ",
    keywords: ["game of thrones", "hbo", "fantasy"]
  },
  {
    id: "2001",
    mediaType: "movie",
    title: txt("Abdullajon", "Абдуллажон", "Abdullajon"),
    overview: txt(
      "A classic Uzbek sci-fi comedy about an ordinary man meeting aliens.",
      "Классическая узбекская фантастическая комедия про встречу с пришельцами.",
      "Oddiy odam va sayyoraliklar uchrashuvi haqidagi o'zbek klassik komediyasi."
    ),
    year: "1991",
    genres: ["Comedy", "Science Fiction"],
    platform: "Local TV",
    imdbRating: "7.6",
    imdbId: "mock-uz-1",
    tmdbRating: 7.1,
    runtime: "92 min",
    studio: "Uzbekfilm",
    releaseDate: "1991-01-01",
    trailerKey: null,
    keywords: ["uzbek", "o'zbek", "abdullajon", "uzbekfilm"]
  },
  {
    id: "2002",
    mediaType: "movie",
    title: txt("Mahallada duv-duv gap", "Шум в махалле", "Mahallada duv-duv gap"),
    overview: txt(
      "A timeless neighborhood comedy filled with misunderstandings and warmth.",
      "Легендарная комедия махалли о слухах и добрососедстве.",
      "Mahalla hayotidagi mish-mish va kulgili voqealar haqidagi mashhur komediya."
    ),
    year: "1960",
    genres: ["Comedy"],
    platform: "Local TV",
    imdbRating: "7.8",
    imdbId: "mock-uz-2",
    tmdbRating: 7.3,
    runtime: "90 min",
    studio: "Uzbekfilm",
    releaseDate: "1960-01-01",
    trailerKey: null,
    keywords: ["uzbek", "mahalla", "classic", "o'zbek"]
  },
  {
    id: "2003",
    mediaType: "movie",
    title: txt("Suyunchi", "Суюнчи", "Suyunchi"),
    overview: txt(
      "A heartfelt Uzbek village story with humor and tradition.",
      "Теплая узбекская история о деревне, традициях и юморе.",
      "Qishloq hayoti, urf-odat va kulgi uyg'unlashgan o'zbek filmi."
    ),
    year: "1982",
    genres: ["Drama", "Comedy"],
    platform: "Local TV",
    imdbRating: "7.4",
    imdbId: "mock-uz-3",
    tmdbRating: 7.0,
    runtime: "98 min",
    studio: "Uzbekfilm",
    releaseDate: "1982-01-01",
    trailerKey: null,
    keywords: ["uzbek", "suyunchi", "o'zbek", "drama"]
  },
  {
    id: "2004",
    mediaType: "tv",
    title: txt("Mendirman Jaloliddin", "Я - Джалолиддин", "Mendirman Jaloliddin"),
    overview: txt(
      "An epic historical series about Jaloliddin Manguberdi's struggle.",
      "Исторический сериал о борьбе Джалолиддина Мангуберди.",
      "Jaloliddin Manguberdi kurashi haqida tarixiy epik serial."
    ),
    year: "2021",
    genres: ["History", "Action"],
    platform: "Milliy TV",
    imdbRating: "7.9",
    imdbId: "mock-uz-4",
    tmdbRating: 7.5,
    runtime: "45 min",
    studio: "Uzbek-Turkish Production",
    releaseDate: "2021-02-14",
    trailerKey: null,
    keywords: ["uzbek", "serial", "jaloliddin", "history"]
  },
  {
    id: "2101",
    mediaType: "movie",
    title: txt("Tomiris", "Томирис", "Tomiris"),
    overview: txt(
      "A Kazakh historical epic about Queen Tomyris.",
      "Казахский исторический эпос о царице Томирис.",
      "Qozog'iston tarixidagi malikalaridan biri Tomiris haqidagi epik film."
    ),
    year: "2019",
    genres: ["History", "War"],
    platform: "Kazakh TV",
    imdbRating: "6.5",
    imdbId: "tt8415308",
    tmdbRating: 6.9,
    runtime: "156 min",
    studio: "Kazakhfilm",
    releaseDate: "2019-10-01",
    trailerKey: null,
    keywords: ["kazakh", "qazaq", "tomiris", "kz"]
  },
  {
    id: "2102",
    mediaType: "movie",
    title: txt("The Road to Mother", "Дорога к матери", "Onaga yo'l"),
    overview: txt(
      "A moving Kazakh drama spanning decades of hardship.",
      "Трогательная казахская драма о судьбе матери и сына.",
      "Qiyinchiliklarga to'la davrlar oralig'idagi ona va farzand haqidagi drama."
    ),
    year: "2016",
    genres: ["Drama", "History"],
    platform: "Kazakh TV",
    imdbRating: "7.0",
    imdbId: "tt5603216",
    tmdbRating: 7.1,
    runtime: "111 min",
    studio: "Kazakhfilm",
    releaseDate: "2016-09-29",
    trailerKey: null,
    keywords: ["kazakh", "qazaq", "drama", "kz cinema"]
  },
  {
    id: "2103",
    mediaType: "movie",
    title: txt("Racketeer", "Рэкетир", "Racketeer"),
    overview: txt(
      "A gritty Kazakh crime story about street survival and power.",
      "Криминальная история о выживании и власти в Казахстане.",
      "Ko'cha hayoti va kuch uchun kurash haqidagi qozog'istonlik jinoyat filmi."
    ),
    year: "2007",
    genres: ["Crime", "Drama"],
    platform: "Kazakh TV",
    imdbRating: "7.1",
    imdbId: "tt1030553",
    tmdbRating: 6.8,
    runtime: "80 min",
    studio: "SataiFilm",
    releaseDate: "2007-11-08",
    trailerKey: null,
    keywords: ["kazakh", "racketeer", "crime", "qazaq"]
  },
  {
    id: "2201",
    mediaType: "movie",
    title: txt("Brother", "Брат", "Brat"),
    overview: txt(
      "A cult Russian crime drama set in post-Soviet St. Petersburg.",
      "Культовая российская криминальная драма 90-х.",
      "90-yillar Rossiyasidagi kult jinoyat dramasi."
    ),
    year: "1997",
    genres: ["Crime", "Drama"],
    platform: "ivi",
    imdbRating: "7.8",
    imdbId: "tt0118767",
    tmdbRating: 7.4,
    runtime: "96 min",
    studio: "CTB Film",
    releaseDate: "1997-05-17",
    trailerKey: null,
    keywords: ["russian", "brat", "rus", "crime"]
  },
  {
    id: "2202",
    mediaType: "movie",
    title: txt("Brother 2", "Брат 2", "Brat 2"),
    overview: txt(
      "Danila Bagrov faces new enemies in Russia and the US.",
      "Данила Багров сталкивается с новыми врагами в России и США.",
      "Danila Bagrov Rossiya va AQShda yangi dushmanlarga qarshi kurashadi."
    ),
    year: "2000",
    genres: ["Crime", "Action"],
    platform: "ivi",
    imdbRating: "7.6",
    imdbId: "tt0238883",
    tmdbRating: 7.2,
    runtime: "122 min",
    studio: "STW",
    releaseDate: "2000-05-11",
    trailerKey: null,
    keywords: ["russian", "brat 2", "rus", "action"]
  },
  {
    id: "2203",
    mediaType: "movie",
    title: txt("Night Watch", "Ночной дозор", "Tungi qo'riqchi"),
    overview: txt(
      "A fantasy action film where Light and Dark forces battle in Moscow.",
      "Фэнтези-боевик о противостоянии Света и Тьмы в Москве.",
      "Moskvada yorug'lik va zulmat kuchlari to'qnashuvi haqidagi fantastik film."
    ),
    year: "2004",
    genres: ["Fantasy", "Action"],
    platform: "KinoPoisk",
    imdbRating: "6.4",
    imdbId: "tt0403358",
    tmdbRating: 6.2,
    runtime: "114 min",
    studio: "Bazelevs",
    releaseDate: "2004-07-08",
    trailerKey: null,
    keywords: ["russian", "night watch", "fantasy", "moscow"]
  },
  {
    id: "2204",
    mediaType: "movie",
    title: txt("Major Grom: Plague Doctor", "Майор Гром: Чумной Доктор", "Mayor Grom"),
    overview: txt(
      "A St. Petersburg detective hunts a masked vigilante.",
      "Петербургский детектив охотится на загадочного мстителя.",
      "Sankt-Peterburg detektivi niqobli jinoyatchini quvadi."
    ),
    year: "2021",
    genres: ["Action", "Crime"],
    platform: "Netflix",
    imdbRating: "6.3",
    imdbId: "tt11799444",
    tmdbRating: 6.8,
    runtime: "136 min",
    studio: "Bubble Studios",
    releaseDate: "2021-04-01",
    trailerKey: null,
    keywords: ["russian", "major grom", "netflix", "crime"]
  },
  {
    id: "2205",
    mediaType: "tv",
    title: txt("The Boy's Word", "Слово пацана", "Yigit so'zi"),
    overview: txt(
      "A dark coming-of-age Russian series set in late Soviet years.",
      "Мрачная российская драма взросления конца СССР.",
      "SSSR oxiridagi yoshlar hayoti haqida keskin rus seriali."
    ),
    year: "2023",
    genres: ["Drama", "Crime"],
    platform: "Wink",
    imdbRating: "8.1",
    imdbId: "mock-ru-5",
    tmdbRating: 8.0,
    runtime: "50 min",
    studio: "START",
    releaseDate: "2023-11-09",
    trailerKey: null,
    keywords: ["russian", "slovo patsana", "series", "rus"]
  },
  {
    id: "2301",
    mediaType: "movie",
    title: txt("Businessmen", "Бизнесмены", "Biznesmenlar"),
    overview: txt(
      "Three friends in 90s Almaty chase money and power.",
      "Трое друзей в Алматы 90-х стремятся к деньгам и власти.",
      "90-yillar Almatida uch do'st pul va hokimiyat ortidan quvadi."
    ),
    year: "2018",
    genres: ["Drama", "Crime"],
    platform: "Kazakh TV",
    imdbRating: "7.2",
    imdbId: "mock-kz-4",
    tmdbRating: 7.1,
    runtime: "121 min",
    studio: "Askar Uzabayev Production",
    releaseDate: "2018-11-01",
    trailerKey: null,
    keywords: ["kazakh", "businessmen", "almaty", "qazaq"]
  },
  {
    id: "2302",
    mediaType: "movie",
    title: txt("Scorpion", "Чаян", "Chayon"),
    overview: txt(
      "A modern Uzbek action thriller about crime networks.",
      "Современный узбекский экшен-триллер о криминальных сетях.",
      "Jinoyat tarmoqlari haqida zamonaviy o'zbek jangari trilleri."
    ),
    year: "2018",
    genres: ["Action", "Thriller"],
    platform: "Milliy TV",
    imdbRating: "6.8",
    imdbId: "mock-uz-5",
    tmdbRating: 6.9,
    runtime: "104 min",
    studio: "Uzbek Cinema",
    releaseDate: "2018-09-10",
    trailerKey: null,
    keywords: ["uzbek", "chayon", "scorpion", "thriller"]
  },
  {
    id: "2303",
    mediaType: "tv",
    title: txt("Kukhnya", "Кухня", "Oshxona"),
    overview: txt(
      "A famous Russian comedy series set in a luxury restaurant.",
      "Популярный российский комедийный сериал про элитный ресторан.",
      "Hashamatli restoran hayoti haqidagi mashhur rus komediya seriali."
    ),
    year: "2012",
    genres: ["Comedy"],
    platform: "START",
    imdbRating: "8.5",
    imdbId: "tt2809770",
    tmdbRating: 8.0,
    runtime: "24 min",
    studio: "Yellow, Black and White",
    releaseDate: "2012-10-22",
    trailerKey: null,
    keywords: ["kitchen", "kukhnya", "russian", "comedy"]
  },
  {
    id: "2304",
    mediaType: "movie",
    title: txt("Scream", "Крик", "Qichqiriq"),
    overview: txt(
      "A slasher legacy sequel with Ghostface terror.",
      "Новая глава слэшера с возвращением Призрачного лица.",
      "Ghostface qaytgan klassik slasher franshizasining yangi qismi."
    ),
    year: "2022",
    genres: ["Horror", "Mystery"],
    platform: "Paramount+",
    imdbRating: "6.3",
    imdbId: "tt11245972",
    tmdbRating: 6.7,
    runtime: "114 min",
    studio: "Paramount",
    releaseDate: "2022-01-14",
    trailerKey: null,
    keywords: ["horror", "scream", "hollywood"]
  },
  {
    id: "2305",
    mediaType: "movie",
    title: txt("Sherlock Holmes", "Шерлок Холмс", "Sherlok Xolms"),
    overview: txt(
      "Holmes and Watson solve a conspiracy in Victorian London.",
      "Холмс и Ватсон раскрывают заговор в викторианском Лондоне.",
      "Xolms va Vatson Viktoriya davridagi London fitnasini fosh qiladi."
    ),
    year: "2009",
    genres: ["Mystery", "Action"],
    platform: "Max",
    imdbRating: "7.6",
    imdbId: "tt0988045",
    tmdbRating: 7.2,
    runtime: "128 min",
    studio: "Warner Bros.",
    releaseDate: "2009-12-25",
    trailerKey: null,
    keywords: ["sherlock", "detective", "mystery"]
  },
  {
    id: "2306",
    mediaType: "movie",
    title: txt("T-34", "Т-34", "T-34"),
    overview: txt(
      "A WWII tank crew attempts a daring escape.",
      "Военный экипаж танка Т-34 пытается совершить дерзкий побег.",
      "Ikkinchi jahon urushida T-34 ekipaji jasoratli qochishni rejalaydi."
    ),
    year: "2018",
    genres: ["War", "Action"],
    platform: "KinoPoisk",
    imdbRating: "6.8",
    imdbId: "tt8820590",
    tmdbRating: 6.9,
    runtime: "139 min",
    studio: "Mars Media",
    releaseDate: "2018-12-27",
    trailerKey: null,
    keywords: ["russian", "war", "tank", "t34"]
  },
  {
    id: "2307",
    mediaType: "movie",
    title: txt("Sputnik", "Спутник", "Sputnik"),
    overview: txt(
      "A Soviet-era astronaut returns with a dangerous parasite.",
      "Советский космонавт возвращается на Землю с опасным паразитом.",
      "Sovet kosmonavti Yerga xavfli parazit bilan qaytadi."
    ),
    year: "2020",
    genres: ["Science Fiction", "Horror"],
    platform: "Shudder",
    imdbRating: "6.4",
    imdbId: "tt11905962",
    tmdbRating: 6.5,
    runtime: "113 min",
    studio: "Vodorod",
    releaseDate: "2020-04-23",
    trailerKey: null,
    keywords: ["russian", "sputnik", "horror", "space"]
  },
  {
    id: "2308",
    mediaType: "movie",
    title: txt("The Master and Margarita", "Мастер и Маргарита", "Usta va Margarita"),
    overview: txt(
      "A writer's banned novel blurs reality and fantasy in Moscow.",
      "Запрещенный роман писателя меняет реальность и фантазию в Москве.",
      "Yozuvchining taqiqlangan romani Moskvada haqiqat va fantastikani aralashtiradi."
    ),
    year: "2024",
    genres: ["Drama", "Fantasy"],
    platform: "KinoPoisk",
    imdbRating: "7.3",
    imdbId: "mock-ru-6",
    tmdbRating: 7.0,
    runtime: "157 min",
    studio: "Mars Media",
    releaseDate: "2024-01-25",
    trailerKey: null,
    keywords: ["russian", "master and margarita", "moscow"]
  }
];

function pick(value: Localized, lang: AppLanguage) {
  return value[lang] ?? value.en;
}

function toDetail(item: MockItem, lang: AppLanguage): MovieDetail {
  const title = pick(item.title, lang);
  return {
    id: item.id,
    mediaType: item.mediaType,
    title,
    overview: pick(item.overview, lang),
    poster: makePoster(title, item.imdbId),
    backdrop: makeBackdrop(title),
    year: item.year,
    genres: item.genres,
    platform: item.platform,
    imdbRating: item.imdbRating,
    imdbId: item.imdbId,
    tmdbRating: item.tmdbRating,
    userAverageRating: null,
    runtime: item.runtime,
    studio: item.studio,
    releaseDate: item.releaseDate,
    trailerKey: item.trailerKey
  };
}

export function getMockTrending(lang: AppLanguage = "uz") {
  return MOCK_ITEMS.map((item) => toDetail(item, lang));
}

export function searchMock(query: string, lang: AppLanguage = "uz") {
  const q = query.toLowerCase();
  return MOCK_ITEMS.filter((item) => {
    const haystack = [
      item.title.en,
      item.title.ru,
      item.title.uz,
      item.overview.en,
      item.overview.ru,
      item.overview.uz,
      item.studio ?? "",
      item.platform ?? "",
      item.genres.join(" "),
      item.keywords.join(" ")
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  }).map((item) => toDetail(item, lang));
}

export function getMockDetail(mediaType: MediaType, id: string, lang: AppLanguage = "uz") {
  const item = MOCK_ITEMS.find((x) => x.mediaType === mediaType && x.id === id);
  return item ? toDetail(item, lang) : null;
}

export function getMockByImdbId(imdbId: string, lang: AppLanguage = "en") {
  const item = MOCK_ITEMS.find((x) => x.imdbId === imdbId);
  return item ? toDetail(item, lang) : null;
}
