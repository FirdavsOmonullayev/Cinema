export type AppLanguage = "uz" | "ru" | "en";

export const LANGUAGE_OPTIONS: { code: AppLanguage; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" }
];

export const DEFAULT_LANGUAGE: AppLanguage = "uz";

export function parseLanguage(value: string | null | undefined): AppLanguage {
  return value === "ru" || value === "en" || value === "uz" ? value : DEFAULT_LANGUAGE;
}

type Dict = Record<string, Record<AppLanguage, string>>;

const dict: Dict = {
  nav_home: { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
  nav_trending: { uz: "Trend", ru: "Тренды", en: "Trending" },
  nav_favorites: { uz: "Sevimlilar", ru: "Избранное", en: "Favorites" },
  nav_history: { uz: "Tarix", ru: "История", en: "History" },
  auth_sign_in: { uz: "Kirish", ru: "Войти", en: "Sign in" },
  auth_logout: { uz: "Chiqish", ru: "Выйти", en: "Logout" },
  hero_badge: { uz: "Global Kino va Seriallar", ru: "Фильмы и сериалы мира", en: "Global Movies & Series" },
  hero_title_1: { uz: "Dunyo kino va seriallari haqida", ru: "Полная база мирового кино и сериалов", en: "Explore Global Movies & Series" },
  hero_title_2: { uz: "to'liq ma'lumot", ru: "в одном месте", en: "in one place" },
  hero_desc: {
    uz: "Avatar, Marvel/DC filmlari, Netflix seriallari va Markaziy Osiyo kontentlarini bir joyda kuzating.",
    ru: "Смотрите Avatar, фильмы Marvel/DC, сериалы Netflix и контент Центральной Азии в одном месте.",
    en: "Track Avatar, Marvel/DC films, Netflix series, and Central Asian titles in one place."
  },
  search_placeholder: {
    uz: "Avatar, Marvel, DC, Netflix, Uzbek kino...",
    ru: "Avatar, Marvel, DC, Netflix, узбекское кино...",
    en: "Avatar, Marvel, DC, Netflix, Uzbek cinema..."
  },
  sort_imdb: { uz: "IMDb bo'yicha", ru: "По IMDb", en: "Sort by IMDb" },
  sort_user: { uz: "User reyting bo'yicha", ru: "По оценкам пользователей", en: "Sort by User Rating" },
  no_results: {
    uz: "Hech narsa topilmadi. Boshqa nom bilan qidirib ko'ring.",
    ru: "Ничего не найдено. Попробуйте другой запрос.",
    en: "Nothing found. Try another query."
  },
  trend_title: { uz: "Haftalik Trendlar", ru: "Тренды недели", en: "Trending This Week" },
  trend_sub: {
    uz: "Eng trend bo'layotgan kino va seriallar",
    ru: "Самые популярные фильмы и сериалы",
    en: "Most trending movies and series"
  },
  label_year: { uz: "Yil", ru: "Год", en: "Year" },
  label_platform: { uz: "Platforma", ru: "Платформа", en: "Platform" },
  label_user: { uz: "User", ru: "Польз.", en: "User" },
  label_unknown_genre: { uz: "Janr yo'q", ru: "Жанр не указан", en: "Unknown genre" },
  details: { uz: "Batafsil", ru: "Детали", en: "Details" },
  genres: { uz: "Janrlar", ru: "Жанры", en: "Genres" },
  release_date: { uz: "Chiqqan sana", ru: "Дата выхода", en: "Release date" },
  community_rating: { uz: "Jamoa reytingi", ru: "Рейтинг сообщества", en: "Community rating" },
  your_rating: { uz: "Sizning reyting", ru: "Ваша оценка", en: "Your rating" },
  votes: { uz: "ovoz", ru: "голосов", en: "votes" },
  actions: { uz: "Amallar", ru: "Действия", en: "Actions" },
  rate_this: { uz: "Baholash", ru: "Оценить", en: "Rate this title" },
  signin_to_rate: { uz: "Baholash uchun kiring", ru: "Войдите, чтобы оценить", en: "Sign in to rate" },
  add_favorite: { uz: "Sevimliga qo'shish", ru: "Добавить в избранное", en: "Add to favorites" },
  remove_favorite: { uz: "Sevimlidan olib tashlash", ru: "Удалить из избранного", en: "Remove favorite" },
  signin_for_fav: { uz: "Sevimli uchun kiring", ru: "Войдите для избранного", en: "Sign in for favorites" },
  data_source: {
    uz: "Ma'lumotlar TMDb/OMDb va lokal kutubxona orqali yangilanadi.",
    ru: "Данные обновляются через TMDb/OMDb и локальную библиотеку.",
    en: "Data is enriched via TMDb/OMDb and local library."
  },
  back_home: { uz: "Bosh sahifaga qaytish", ru: "Назад на главную", en: "Back to Home" },
  not_found: { uz: "Topilmadi", ru: "Не найдено", en: "Not found" },
  na: { uz: "Mavjud emas", ru: "Н/Д", en: "N/A" },
  platform_na: { uz: "Platforma yo'q", ru: "Платформа Н/Д", en: "Platform N/A" },
  studio_na: { uz: "Studio yo'q", ru: "Студия Н/Д", en: "Studio N/A" },
  favorites_need_login: {
    uz: "Sevimlilar uchun akkauntga kiring.",
    ru: "Войдите в аккаунт для избранного.",
    en: "Sign in to use favorites."
  },
  favorites_title: { uz: "Sevimlilarim", ru: "Мое избранное", en: "My Favorites" },
  favorites_empty: {
    uz: "Sevimlilar ro'yxati hozircha bo'sh.",
    ru: "Список избранного пока пуст.",
    en: "Favorites list is empty."
  },
  history_need_login: {
    uz: "Qidiruv tarixi uchun tizimga kiring.",
    ru: "Войдите для истории поиска.",
    en: "Sign in to view search history."
  },
  history_title: { uz: "Qidiruv tarixi", ru: "История поиска", en: "Search History" },
  history_empty: { uz: "Tarix hozircha bo'sh.", ru: "История пока пуста.", en: "History is empty." },
  auth_create_account: { uz: "Akkaunt yaratish", ru: "Создать аккаунт", en: "Create account" },
  auth_name: { uz: "Ism", ru: "Имя", en: "Name" },
  auth_email: { uz: "Email", ru: "Email", en: "Email" },
  auth_password: { uz: "Parol", ru: "Пароль", en: "Password" },
  auth_loading: { uz: "Yuklanmoqda...", ru: "Загрузка...", en: "Loading..." },
  auth_login_btn: { uz: "Kirish", ru: "Войти", en: "Login" },
  auth_register_btn: { uz: "Ro'yxatdan o'tish", ru: "Регистрация", en: "Register" },
  auth_switch_to_register: {
    uz: "Akkaunt yo'qmi? Ro'yxatdan o'ting",
    ru: "Нет аккаунта? Зарегистрируйтесь",
    en: "No account? Register"
  },
  auth_switch_to_login: {
    uz: "Akkaunt bormi? Kiring",
    ru: "Уже есть аккаунт? Войдите",
    en: "Already have account? Login"
  },
  rate_modal_title: { uz: "Kino baholash", ru: "Оценить тайтл", en: "Rate this title" },
  rate_modal_help: { uz: "1 dan 10 gacha baho bering", ru: "Поставьте оценку от 1 до 10", en: "Rate from 1 to 10" },
  rate_modal_save: { uz: "Bahoni saqlash", ru: "Сохранить оценку", en: "Save rating" },
  saving: { uz: "Saqlanmoqda...", ru: "Сохранение...", en: "Saving..." },
  unknown_platform: { uz: "Noma'lum platforma", ru: "Неизв. платформа", en: "Unknown platform" },
  failed_load: { uz: "Yuklashda xatolik", ru: "Ошибка загрузки", en: "Failed to load" }
};

export function tr(lang: AppLanguage, key: keyof typeof dict): string {
  return dict[key][lang] ?? dict[key].en;
}
