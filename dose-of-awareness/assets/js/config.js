/*
  A Dose of Awareness (جرعة وعي)
  SETTINGS FILE. This is the only file that needs editing after deployment.
  Every value is optional. An empty value hides the matching feature.
*/
window.DW = window.DW || {};
DW.config = {
  // Names shown in the header and footer
  campaign: { ar: "جرعة وعي", en: "A Dose of Awareness" },
  slogan: { ar: "قبل المطعوم، جرعة وعي", en: "Before the vaccine, a dose of awareness" },
  owner: { ar: "حملة توعية رقمية يقودها طلبة كلية الصيدلة", en: "A digital awareness campaign led by students of the Faculty of Pharmacy" },
  unit: { ar: "مركز الأمراض المعدية والمطاعيم، الجامعة الأردنية", en: "Infectious Disease and Vaccine Center, The University of Jordan" },

  // People credited in the footer and on the About page
  people: [
    { role: { ar: "مديرة مركز الأمراض المعدية والمطاعيم", en: "Director, Infectious Disease and Vaccine Center" },
      name: { ar: "الأستاذة الدكتورة رولا درويش", en: "Professor Rula Darwish" },
      title: { ar: "أستاذة الأحياء الدقيقة", en: "Professor of Microbiology" } },
    { role: { ar: "الإشراف على حملة التوعية الرقمية، والتصميم والتطوير", en: "Supervisor of the digital awareness campaign; design and development" },
      name: { ar: "الدكتورة سمر ملحم", en: "Dr Samar J. Melhem" },
      title: { ar: "أستاذ مساعد في الصحة الرقمية والمعلوماتية الصحية، كلية الصيدلة، الجامعة الأردنية", en: "Assistant Professor of Digital Health and Health Informatics, Faculty of Pharmacy, The University of Jordan" },
      orcid: "0000-0003-0967-0871" }
  ],
  copyright: { ar: "© 2026 الدكتورة سمر ملحم ومركز الأمراض المعدية والمطاعيم، الجامعة الأردنية. جميع الحقوق محفوظة.", en: "© 2026 Dr Samar J. Melhem and the Infectious Disease and Vaccine Center, The University of Jordan. All rights reserved." },

  // true shows a "pre-launch preview" ribbon and asks search engines not to list the site. Set to false on go-live.
  preview: true,

  // Public address of the site once it is live, without a trailing slash.
  // Used by the QR tool, the share buttons and the phone apps. Example: "https://vaccines.ju.edu.jo"
  siteUrl: "",

  // Campaign server.
  //   "auto"  the site looks for the server at its own address, and the phone apps look for it at siteUrl
  //           (use this when the server hosts the site, as on Railway)
  //   a full address, for example "https://dose.up.railway.app", when the pages are hosted on a different web server
  //   ""      no server: stamps, scores and pledges stay on the visitor's own device
  apiBase: "auto",

  // Launch date of the campaign (YYYY-MM-DD) and the date of the workshop.
  launch: "2026-12-27",

  // Social channels. Paste the full links once the accounts exist.
  social: { instagram: "", facebook: "", youtube: "", tiktok: "" },
  hashtag: { ar: "#جرعة_وعي", en: "#DoseOfAwareness" },
  contactEmail: "",

  // Optional older data service (Google Apps Script). Leave empty when the campaign server is used.
  backendUrl: "",

  // Google Form where students upload brochures and posters for review.
  submitFormUrl: "",
  // Short knowledge and attitude survey (before and after), if used.
  surveyUrl: "",

  // Which vaccine is featured on the home page. One of: flu, hpv, measles, hepb, pneumo, mening
  featured: "flu",

  // Date the medical content was last reviewed (YYYY-MM-DD) and by whom.
  reviewed: "2026-11-25",
  reviewer: { ar: "", en: "" },

  // Official logos. Save the approved files under these names in assets/img and they appear in the
  // header, the footer and the certificates. Until a file exists, its place stays empty.
  logos: [
    { src: "assets/img/logo-university.png", alt: { ar: "الجامعة الأردنية", en: "The University of Jordan" } },
    { src: "assets/img/logo-centre.png", alt: { ar: "مركز الأمراض المعدية والمطاعيم", en: "Infectious Disease and Vaccine Center" } }
  ],
  // Watermark of the centre shown faintly behind pages and on certificates.
  watermark: "assets/img/seal.svg",

  // Campaign videos stored with the site. ready: false shows a "film in preparation" card.
  // Set youtube to a video ID to use YouTube instead of the local file.
  videos: {
    flu:     { file: "assets/video/flu.mp4",     poster: "assets/video/flu.jpg",     ready: true,  youtube: "" },
    hpv:     { file: "assets/video/hpv.mp4",     poster: "assets/video/hpv.jpg",     ready: true,  youtube: "" },
    measles: { file: "assets/video/measles.mp4", poster: "assets/video/measles.jpg", ready: true,  youtube: "" },
    hepb:    { file: "assets/video/hepb.mp4",    poster: "assets/video/hepb.jpg",    ready: true,  youtube: "" },
    pneumo:  { file: "assets/video/pneumo.mp4",  poster: "assets/video/pneumo.jpg",  ready: true,  youtube: "" },
    mening:  { file: "assets/video/mening.mp4",  poster: "assets/video/mening.jpg",  ready: true,  youtube: "" }
  }
};
