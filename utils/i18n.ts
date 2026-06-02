export type Locale = "en" | "ja";

export const locales: Locale[] = ["en", "ja"];

type TranslationKey =
  | "appEyebrow"
  | "appTitle"
  | "mobilePwa"
  | "findingLocation"
  | "locationEnabled"
  | "locationDenied"
  | "offlineReady"
  | "online"
  | "localOnly"
  | "supabaseReady"
  | "addNewSpot"
  | "all"
  | "nearbySpots"
  | "tapSpot"
  | "sortedByDistance"
  | "categoryList"
  | "spotDetails"
  | "category"
  | "description"
  | "touristNote"
  | "openingHours"
  | "payment"
  | "insideOutside"
  | "insideStation"
  | "outsideStation"
  | "tags"
  | "distance"
  | "unknown"
  | "edit"
  | "delete"
  | "close"
  | "reportProblem"
  | "submitReport"
  | "reportTitle"
  | "reportType"
  | "reportDetails"
  | "reportSubmitted"
  | "name"
  | "submitNewLocation"
  | "editSpot"
  | "addSpot"
  | "saveSpot"
  | "updateSpot"
  | "currentLocationAutofill"
  | "paymentNote"
  | "latitude"
  | "longitude"
  | "language"
  | "userSpot"
  | "sampleSpot"
  | "verified"
  | "needsReview"
  | "lastChecked"
  | "openInGoogleMaps"
  | "openInAppleMaps"
  | "availabilityDisclaimer"
  | "syncing"
  | "queuedOffline"
  | "viewMore";

export type Translator = (key: TranslationKey) => string;

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    appEyebrow: "Japan Survival Map",
    appTitle: "Umeda Essentials",
    mobilePwa: "Mobile web PWA",
    findingLocation: "Finding your location...",
    locationEnabled: "Location enabled. Showing nearby spots.",
    locationDenied: "Location denied or unavailable. Showing Umeda center.",
    offlineReady: "Offline map basics ready",
    online: "Online",
    localOnly: "Local only",
    supabaseReady: "Supabase sync ready",
    addNewSpot: "Add new spot",
    all: "All",
    nearbySpots: "Nearby spots",
    tapSpot: "Tap a spot to see details.",
    sortedByDistance: "Sorted by distance",
    categoryList: "Showing category list",
    spotDetails: "Spot details",
    category: "Category",
    description: "Description",
    touristNote: "Tourist note",
    openingHours: "Opening hours",
    payment: "Payment",
    insideOutside: "Inside / outside station",
    insideStation: "Inside station",
    outsideStation: "Outside station",
    tags: "Tags",
    distance: "Distance",
    unknown: "Unknown",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    reportProblem: "Report problem",
    submitReport: "Submit report",
    reportTitle: "Report a problem",
    reportType: "Problem type",
    reportDetails: "Details",
    reportSubmitted: "Thanks. Your report was saved.",
    name: "Name",
    submitNewLocation: "Submit a new location",
    editSpot: "Edit spot",
    addSpot: "Add spot",
    saveSpot: "Save spot",
    updateSpot: "Update spot",
    currentLocationAutofill: "Current location auto-fills coordinates if available.",
    paymentNote: "Payment note",
    latitude: "Latitude",
    longitude: "Longitude",
    language: "Language",
    userSpot: "User spot",
    sampleSpot: "Sample spot",
    verified: "Verified",
    needsReview: "Needs review",
    lastChecked: "Last checked",
    openInGoogleMaps: "Open in Google Maps",
    openInAppleMaps: "Open in Apple Maps",
    availabilityDisclaimer: "Opening hours and availability may change. Please confirm onsite.",
    syncing: "Syncing",
    queuedOffline: "Queued offline",
    viewMore: "View more",
  },
  ja: {
    appEyebrow: "Japan Survival Map",
    appTitle: "梅田エッセンシャル",
    mobilePwa: "モバイルPWA",
    findingLocation: "現在地を確認しています...",
    locationEnabled: "現在地を利用中です。近いスポットを表示します。",
    locationDenied: "現在地を使えません。梅田中心を表示します。",
    offlineReady: "オフライン基本機能あり",
    online: "オンライン",
    localOnly: "ローカルのみ",
    supabaseReady: "Supabase同期準備済み",
    addNewSpot: "スポット追加",
    all: "すべて",
    nearbySpots: "近くのスポット",
    tapSpot: "スポットをタップして詳細を表示します。",
    sortedByDistance: "距離順",
    categoryList: "カテゴリ一覧",
    spotDetails: "スポット詳細",
    category: "カテゴリ",
    description: "説明",
    touristNote: "旅行者メモ",
    openingHours: "営業時間",
    payment: "支払い",
    insideOutside: "駅構内 / 駅外",
    insideStation: "駅構内",
    outsideStation: "駅外",
    tags: "タグ",
    distance: "距離",
    unknown: "不明",
    edit: "編集",
    delete: "削除",
    close: "閉じる",
    reportProblem: "問題を報告",
    submitReport: "報告を送信",
    reportTitle: "スポットの問題を報告",
    reportType: "問題の種類",
    reportDetails: "詳細",
    reportSubmitted: "ありがとうございます。報告を保存しました。",
    name: "名前",
    submitNewLocation: "新しい場所を投稿",
    editSpot: "スポット編集",
    addSpot: "スポット追加",
    saveSpot: "保存",
    updateSpot: "更新",
    currentLocationAutofill: "現在地が使える場合、座標に自動入力されます。",
    paymentNote: "支払いメモ",
    latitude: "緯度",
    longitude: "経度",
    language: "言語",
    userSpot: "ユーザー追加",
    sampleSpot: "サンプル",
    verified: "確認済み",
    needsReview: "要確認",
    lastChecked: "最終確認",
    openInGoogleMaps: "Google Mapsで開く",
    openInAppleMaps: "Apple Mapsで開く",
    availabilityDisclaimer: "営業時間や利用可否は変わることがあります。現地でも確認してください。",
    syncing: "同期中",
    queuedOffline: "オフライン保存済み",
    viewMore: "詳細を見る",
  },
};

export function getTranslator(locale: Locale): Translator {
  return (key) => translations[locale][key];
}
