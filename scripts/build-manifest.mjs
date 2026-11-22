import fs from "node:fs";
import { applyLandingExtras } from "./landing-extras.mjs";

const L = (ar, en) => ({ ar, en });
const KEY = {
  schemeAuto: "91b2ba13-1402-43d1-b502-154406fa0a72",
  schemeLight: "911c3937-606d-4425-bd43-e060d2526fa7",
  schemeDark: "0bf6eb3e-35f6-4339-83a8-ea5b2a22f320",
  sideStart: "df37e944-3141-483b-9f38-13faff32b7b4",
  sideEnd: "6463848d-17b1-4185-8b61-efcd8ecaa027",
  stars5: "8ad0649e-c61a-4dcd-bba7-f7217399d9b8",
  stars4: "6da1be6c-7063-4574-8fa1-04ffcf20a08f",
  stars3: "141f6e35-d6ae-41f8-a388-f3152885195b",
  titlePlain: "e27e11eb-74df-43ef-be56-5f0256f91854",
  titleHairline: "370ff065-d7d7-4d34-8861-5389d26c81dc",
  titleBrackets: "348927b7-2ae0-49e5-a21d-95a01188fe38",
  titleTicket: "81d5c9e1-a6c3-4f3d-adbb-5dc35c00d167",
  alignCenter: "4f0c2a18-6b7d-4e21-8a55-9c1d3e7b2f04",
  alignStart: "8e1b6c30-2a94-4d7f-b163-5f8a0c2d9e17",
  modeLight: "1a9e4c72-5d30-4b88-9f21-6c3e8a0b7d45",
  modeDark: "6c2d8f14-9a70-4e35-81b6-3d5f0a9c2e78",
  modeSystem: "9b7e1a26-4c58-4f90-a2d3-8e6b1c0f5a34",
  annMove: "c3a91e70-4b28-4f6a-9d15-2e8b7c0a4f61",
  annStill: "d4b02f81-5c39-4a7b-8e26-3f9c8d1b5a72",
  videoBeside: "a7c3e1d4-2b58-4f90-8a16-5d9e0c3b7f21",
  videoStack: "b8d4f2e5-3c69-4a01-9b27-6e0f1d4c8a32",
  videoCover: "c9e5a3f6-4d70-4b12-8c38-7f1a2e5d9b43",
  frameWide: "d0f6b4a7-5e81-4c23-9d49-8a2b3f6e0c54",
  frameStory: "e1a7c5b8-6f92-4d34-8e50-9b3c4a7f1d65",
  frameSquare: "f2b8d6c9-7a03-4e45-9f61-0c4d5b8a2e76",
  framePortrait: "a3c9e7d0-8b14-4f56-8a72-1d5e6c9b3f07",
  fitCover: "b4d0f8e1-9c25-4a67-9b83-2e6f7d0c4a18",
  fitContain: "c5e1a9f2-0d36-4b78-8c94-3f7a8e1d5b29",
  playClick: "d6f2b0a3-1e47-4c89-9d05-4a8b9f2e6c30",
  playAuto: "e7a3c1b4-2f58-4d90-8e16-5b9c0a3f7d41",
  reelStar5: "7c1e9a20-4b63-4d85-8f17-2a6c0d9e5b41",
  reelStar4: "8d2f0b31-5c74-4e96-9a28-3b7d1e0f6c52",
  reelStar3: "9e3a1c42-6d85-4fa7-8b39-4c8e2f1a7d63",
  dockStart: "a4c8e1b2-3d56-4f78-9a01-2b3c4d5e6f70",
  dockEnd: "b5d9f2c3-4e67-4a89-8b12-3c4d5e6f7081",
};

const text = (id, label, value, o = {}) => ({
  id,
  type: "string",
  format: o.format || "text",
  label,
  icon: o.icon || "sicon-format-text-alt",
  multilanguage: o.multilang !== false,
  required: false,
  description: o.desc ?? null,
  minLength: 0,
  maxLength: o.max ?? (o.format === "textarea" ? 500 : 180),
  value,
});
const area = (id, label, value, desc = null) => text(id, label, value, { format: "textarea", icon: "sicon-paragraph", desc, max: 500 });
const color = (id, label, value = "", desc = null) => ({
  id, type: "string", format: "color", inputType: "color", label, icon: "sicon-format-fill", required: false, description: desc, value,
});
const sw = (id, label, value, desc = null) => ({
  id, type: "boolean", format: "switch", label, icon: "sicon-toggle-off", required: false, description: desc, value, selected: value,
});
const px = (id, width) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
const SHIRT = px(22441297, 1400);
const RACK = px(17281873, 1400);
const LAYERS = px(3755706, 1400);
const SHOP = px(7679720, 1800);
const SEW = px(3738088, 1400);
const TEE = px(37166936, 1400);
const DRESS = px(5191435, 1400);
const LOOK = "https://videos.pexels.com/video-files/8322527/8322527-hd_2048_1080_25fps.mp4";
const REEL_MIRROR = "https://videos.pexels.com/video-files/5585950/5585950-sd_360_640_30fps.mp4";
const REEL_ADJUST = "https://videos.pexels.com/video-files/8788548/8788548-sd_360_640_25fps.mp4";
const REEL_SUIT = "https://videos.pexels.com/video-files/5586005/5586005-sd_360_640_30fps.mp4";
const image = (id, label, desc, value = "") => ({
  id, type: "string", format: "image", label, icon: "sicon-image", required: false, description: desc, value,
});
const url = (id, label, value = "", desc = null) => ({
  id, type: "string", format: "url", label, icon: "sicon-link", required: false, description: desc, value,
});
const icon = (id, label, value) => ({
  id, type: "string", format: "icon", label, icon: "sicon-star2", required: false, class: "form--inline", value,
});
const opt = (value, label, key) => ({ label, value, key });
const drop = (id, label, options, selected, desc = null) => {
  const opts = options.map(([value, name, key]) => opt(value, name, key));
  const picked = opts.filter((item) => item.value === selected);
  return {
    id, type: "items", format: "dropdown-list", source: "Manual", label, icon: "sicon-list",
    required: false, description: desc, options: opts, selected: picked, value: picked,
  };
};
const line = (id) => ({ id, type: "static", format: "line" });
const num = (id, label, value, min, max, desc = null) => ({
  id, type: "number", format: "number", inputType: "number", label, icon: "sicon-calculator",
  required: false, description: desc, minimum: min, maximum: max, value,
});
const scheme = (selected = "auto") => drop(
  "color_scheme",
  "وضع الألوان",
  [["auto", "حسب رأس الصفحة", KEY.schemeAuto], ["light", "فاتح دائماً", KEY.schemeLight], ["dark", "داكن دائماً", KEY.schemeDark]],
  selected,
  "حسب رأس الصفحة يتبع زر الفاتح والداكن في رأس الصفحة. الفاتح أو الداكن يثبت القسم ولا يتأثر بالزر.",
);
const products = (id, label, desc) => ({
  id, type: "items", format: "dropdown-list", source: "products", label, icon: "sicon-box",
  placeholder: "ابحث عن منتج", required: false, description: desc,
  options: [], selected: [], value: [], searchable: true, multichoice: false,
});
const collection = (id, itemLabel, fields, value, min, max) => ({
  id, type: "collection", format: "collection", required: min > 0, minLength: min, maxLength: max,
  item_label: itemLabel,
  fields: fields.map((field) => ({ ...field, id: String(field.id).includes(".") ? field.id : `${id}.${field.id}` })),
  value: value.map((row) => {
    const out = {};
    for (const [key, val] of Object.entries(row)) out[key.startsWith(`${id}.`) ? key : `${id}.${key}`] = val;
    return out;
  }),
});
const titleStyle = (selected = "hairline") => drop(
  "title_style",
  "شكل العنوان",
  [
    ["plain", "عنوان فقط", KEY.titlePlain],
    ["hairline", "خط قصير", KEY.titleHairline],
    ["brackets", "قوسان", KEY.titleBrackets],
    ["ticket", "بطاقة", KEY.titleTicket],
  ],
  selected,
);
const picked = (value, label, key) => [opt(value, label, key)];
const ctaHint = "في صفحة منتج يفتح الشراء السريع. في صفحة العروض يتبع رابط زر الصفحة، أو هذا الرابط إن وضعته.";

const components = [
  {
    title: "رأس المجلة",
    icon: "sicon-store",
    name: "edit-bar",
    key: "c4e8a1b2-7f30-4a6e-9c15-2d8b6f0e4a71",
    image: "",
    props: { "min-height": "88px" },
    fields: [
      collection("bars", "شريط", [
        text("text", "نص الشريط", L("", ""), { max: 140 }),
        drop("media", "بجانب النص", [["none", "بدون", "ebf61642-2e54-47ae-9018-bfaf1857177c"], ["icon", "أيقونة", "fb70e3e4-c43f-45b1-a75e-7c043d6e36dc"], ["image", "صورة مصغرة", "39dea639-0118-4a0d-a29b-f48851a0e796"]], "icon", "اختر أيقونة من مكتبة سلة أو صورة صغيرة لمنتج أو شعار."),
        icon("icon", "الأيقونة", "sicon-megaphone"),
        image("image", "الصورة المصغرة", "المقاس المقترح 112×112 بكسل، مربعة بزوايا مدورة، PNG أو WebP بخلفية شفافة أو صورة منتج. تظهر بحجم ٢٨×٢٨ بكسل بزوايا مدورة. تُستخدم عند اختيار «صورة مصغرة» في «بجانب النص»."),
        drop("motion", "حركة الشريط", [["move", "متحرك", "3750fc54-ea15-44bb-8e54-a1931e8558e4"], ["still", "ثابت", "216c574a-63b0-49e2-b720-b0934addcaf0"]], "move", "المتحرك يمرّ الجملة باستمرار. الثابت يُبقيها في الوسط."),
        url("link", "رابط الشريط", "", "اختياري. يفتح عند الضغط على الشريط."),
        color("bg", "خلفية هذا الشريط", "", "اتركه فارغاً ليأخذ لون الشريط العام."),
        color("ink", "كتابة هذا الشريط", "", "اتركه فارغاً ليأخذ لون الكتابة العام."),
      ], [
        { text: L("شحن مجاني فوق ٢٥٠ ر.س", "Free shipping over SAR 250"), media: [{ label: "أيقونة", value: "icon", key: "fb70e3e4-c43f-45b1-a75e-7c043d6e36dc" }], icon: "sicon-shipping-fast", image: "", motion: [{ label: "متحرك", value: "move", key: "3750fc54-ea15-44bb-8e54-a1931e8558e4" }], link: "", bg: "", ink: "" },
        { text: L("قميص الكتان متوفر بكل المقاسات", "The linen shirt is back in every size"), media: [{ label: "صورة مصغرة", value: "image", key: "39dea639-0118-4a0d-a29b-f48851a0e796" }], icon: "sicon-megaphone", image: "https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&w=200", motion: [{ label: "ثابت", value: "still", key: "216c574a-63b0-49e2-b720-b0934addcaf0" }], link: "", bg: "", ink: "" },
        { text: L("تبديل المقاس خلال ١٤ يوم", "Size exchange within 14 days"), media: [{ label: "أيقونة", value: "icon", key: "fb70e3e4-c43f-45b1-a75e-7c043d6e36dc" }], icon: "sicon-rotate", image: "", motion: [{ label: "متحرك", value: "move", key: "3750fc54-ea15-44bb-8e54-a1931e8558e4" }], link: "", bg: "", ink: "" },
      ], 0, 5),
      drop("bars_layout", "عرض الأشرطة", [["stack", "كل شريط في سطر", "9e5cba9e-6c76-44b6-87e1-98233ac5e0d3"], ["rotate", "شريط واحد يتبدل", "fa0cb8d3-ce22-4c2c-8b88-05e28058b3f4"]], "rotate", "كل شريط في سطر يعرض الأشرطة فوق بعضها. شريط واحد يتبدل يعرض شريطاً كل ٤ ثوانٍ ويتوقف عند مرور المؤشر."),
      line("pb-announce"),
      image("logo", "شعار مخصص", "اتركه فارغاً ليظهر شعار المتجر."),
      image("logo_dark", "شعار للخلفية الداكنة", "يظهر فوق السلايدر الشفاف وفي الوضع الداكن. بدونه يُستخدم الشعار الأساسي."),
      num("logo_height", "ارتفاع الشعار", 52, 28, 120, "بالبكسل."),
      drop("align", "مكان الشعار", [["center", "الوسط", KEY.alignCenter], ["start", "البداية", KEY.alignStart]], "center"),
      line("pb-logo"),
      sw("sticky", "تثبيت الرأس عند التمرير", true, "يبقى الشعار ظاهراً أثناء نزول الزائر."),
      sw("transparent", "رأس شفاف فوق القسم التالي", false, "يناسب صورة افتتاحية داكنة. عند التمرير يعود الرأس بلون الخلفية."),
      sw("show_shadow", "خط فاصل أسفل الرأس", true),
      line("pb-behavior"),
      sw("show_mode_toggle", "زر الفاتح والداكن", true, "أيقونة في الرأس تتبدل بين القمر والشمس، وتبدّل الأقسام المضبوطة على حسب الصفحة، وتتذكر اختيار الزائر."),
      drop("default_mode", "وضع الصفحة عند الفتح", [["light", "فاتح", KEY.modeLight], ["dark", "داكن", KEY.modeDark], ["system", "حسب جهاز الزائر", KEY.modeSystem]], "light"),
      line("pb-mode"),
      sw("link_to_store", "الشعار يفتح المتجر", false, "اتركه مغلقاً ليبقى الزائر في صفحة الهبوط."),
      text("link_label", "رابط بجانب الشعار", L("المتجر", "Store")),
      url("link_url", "عنوان الرابط", "", "اتركه فارغاً لإخفاء الرابط."),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "مقدمة مقسومة",
    icon: "sicon-format-text-alt",
    name: "split-intro",
    key: "b8c74ba0-a1c0-4d10-874e-25c41e0163af",
    image: "",
    props: { "min-height": "520px" },
    fields: [
      text("kicker", "سطر صغير فوق العنوان", L("قطعة واحدة", "One piece")),
      text("title", "العنوان", L("قميص كتان بقصة مستقيمة", "A straight-cut linen shirt"), { max: 120 }),
      area("text", "النص", L("القماش يُرى نسيجه، والكم يُطوّى. الصورة بجانب النص حتى يبقى الوصف قصيراً.", "The weave shows, and the sleeve rolls up. The photo sits beside the text so the description stays short.")),
      text("primary_label", "نص الزر الأساسي", L("اشتر الآن", "Buy now")),
      url("primary_url", "رابط الزر الأساسي", "", ctaHint),
      text("secondary_label", "نص الزر الثاني", L("اقرأ التفاصيل", "Read the details")),
      url("secondary_url", "رابط الزر الثاني", "#rw-chapters", "رابط حر داخل الصفحة أو خارجها. اتركه فارغاً لإخفاء الزر."),
      line("si-line"),
      image("image", "صورة الجانب", "المقاس المقترح 900×1200 بكسل، صورة طولية للقطعة أو طريقة لبسها.", SHIRT),
      text("image_alt", "وصف الصورة", L("قميص كتان فاتح على علاقة", "A light linen shirt on a hanger")),
      drop("media_side", "مكان الصورة", [["start", "بجانب بداية النص", KEY.sideStart], ["end", "بجانب نهاية النص", KEY.sideEnd]], "end"),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "صف الوعود",
    icon: "sicon-shield-check",
    name: "promise-row",
    key: "8fbd923a-1db0-4e50-916c-dbe4643aaa01",
    image: "",
    props: { "min-height": "180px" },
    fields: [
      text("kicker", "سطر صغير", L("", "")),
      text("title", "العنوان", L("", "")),
      text("subtitle", "وصف قصير", L("", "")),
      collection("items", "وعد", [
        icon("icon", "الأيقونة", "sicon-shield-check"),
        text("title", "الوعد", L("شحن واضح", "Clear shipping")),
        text("note", "سطر توضيحي", L("مدة الوصول مكتوبة قبل الدفع", "The arrival window is written before checkout")),
      ], [
        { icon: "sicon-shipping-fast", title: L("مقاس مكتوب", "The size is written"), note: L("جدول المقاسات قبل الدفع", "The size chart is shown before checkout") },
        { icon: "sicon-shield-check", title: L("قماش مذكور", "The fabric is named"), note: L("كتان، ووزنه بجانب المقاس", "Linen, and its weight sits beside the size") },
        { icon: "sicon-rotate", title: L("استبدال المقاس", "A size exchange"), note: L("خلال ١٤ يوماً إن اختلف المقاس", "Within 14 days if the size is off") },
        { icon: "sicon-time", title: L("تجهيز واضح", "Clear dispatch"), note: L("مدة تجهيز القطعة قبل الطلب", "The making time is written before the order") },
      ], 1, 4),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "مسار الفصول",
    icon: "sicon-list",
    name: "chapter-path",
    key: "c1f85c4b-f89c-48f3-8817-8b28274358b0",
    image: "",
    props: { "min-height": "420px" },
    fields: [
      text("kicker", "سطر صغير", L("أربع خطوات", "Four steps")),
      text("title", "العنوان", L("من المقاس حتى الوصول", "From the size to the arrival")),
      text("subtitle", "وصف قصير", L("طريق قصير، والمقاس واضح قبل الدفع.", "A short path, and the size is clear before checkout.")),
      collection("items", "فصل", [
        text("title", "عنوان الفصل", L("اختر المنتج", "Choose the product")),
        area("text", "الشرح", L("خيار واضح، وبجانبه سطر يشرح الفرق.", "A clear option, with a line beside it that explains the difference.")),
      ], [
        { title: L("اختر القطعة", "Choose the piece"), text: L("القميص أو الطبقة التي تناسبه، وفي سطر واحد.", "The shirt or the layer that fits, in one line.") },
        { title: L("حدد المقاس", "Set the size"), text: L("المقاس واللون من الجدول، قبل الدفع.", "The size and color come from the chart, before checkout.") },
        { title: L("نفصّل الطلب", "We prepare the order"), text: L("التجهيز يبدأ بعد تأكيد الدفع.", "Preparation starts after payment is confirmed.") },
        { title: L("تصلك في الموعد", "It arrives on time"), text: L("مدة الشحن مكتوبة قبل إتمام الطلب.", "The shipping window is written before checkout.") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "رصيد الأصوات",
    icon: "sicon-star",
    name: "voice-stack",
    key: "21d29498-6a4f-48c6-aade-fc00c5cf79b2",
    image: "",
    props: { "min-height": "360px" },
    fields: [
      text("kicker", "سطر صغير", L("من لبس القطعة", "From people who wore it")),
      text("title", "العنوان", L("جمل قصيرة عن المقاس والقماش", "Short lines about the size and the fabric")),
      text("subtitle", "وصف قصير", L("", "")),
      collection("items", "صوت", [
        text("quote", "الجملة", L("وصل كما في الصورة، والتغليف كان سليماً.", "It arrived as shown, and the packing was intact.")),
        text("name", "الاسم", L("نورة", "Noura")),
        text("place", "المدينة", L("الرياض", "Riyadh")),
        drop("stars", "الدرجة من ٥", [["5", "٥", KEY.stars5], ["4", "٤", KEY.stars4], ["3", "٣", KEY.stars3]], "5"),
      ], [
        { quote: L("المقاس طابق الجدول، والقماش خفيف على الدوام.", "The size matched the chart, and the fabric was light for work."), name: L("نورة", "Noura"), place: L("الرياض", "Riyadh"), stars: picked("5", "٥", KEY.stars5) },
        { quote: L("اللون في الصورة هو لون القميص الذي وصل.", "The color in the photo is the color of the shirt that arrived."), name: L("سلمان", "Salman"), place: L("جدة", "Jeddah"), stars: picked("5", "٥", KEY.stars5) },
        { quote: L("الكم ينطوي بسهولة، والقصة ما ضاقت عند الكتف.", "The sleeve rolls easily, and the cut was not tight at the shoulder."), name: L("هند", "Hind"), place: L("الخبر", "Khobar"), stars: picked("4", "٤", KEY.stars4) },
        { quote: L("بدأت بقطعة واحدة، ثم طلبت اللون الثاني.", "I started with one piece, then ordered the second color."), name: L("فيصل", "Faisal"), place: L("أبها", "Abha"), stars: picked("5", "٥", KEY.stars5) },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "لقطتان",
    icon: "sicon-image",
    name: "detail-duo",
    key: "96bb3b61-2bdc-4a39-b401-ee3ab1497a1d",
    image: "",
    props: { "min-height": "460px" },
    fields: [
      text("kicker", "سطر صغير", L("عن قرب", "Up close")),
      text("title", "العنوان", L("القميص، ثم الطبقات", "The shirt, then the layers")),
      text("subtitle", "وصف قصير", L("لقطة للقميص على العلاقة، ولقطة للطبقة التي فوقه.", "One frame of the shirt on the hanger, and one of the layer over it.")),
      line("dd-a"),
      image("image_a", "الصورة الأولى", "المقاس المقترح 1200×1500 بكسل.", SHIRT),
      text("alt_a", "وصف الصورة الأولى", L("قميص كتان فاتح بأزرار ظاهرة", "A light linen shirt with visible buttons")),
      text("title_a", "عنوان اللقطة الأولى", L("القميص", "The shirt")),
      area("text_a", "نص اللقطة الأولى", L("أزرار ظاهرة وجيب صدر، ونسيج الكتان يبين عن قرب.", "Visible buttons and a chest pocket, and the linen weave shows up close.")),
      line("dd-b"),
      image("image_b", "الصورة الثانية", "المقاس المقترح 1000×1300 بكسل.", LAYERS),
      text("alt_b", "وصف الصورة الثانية", L("جاكيت فوق قميص وربطة", "A jacket over a shirt and a tie")),
      text("title_b", "عنوان اللقطة الثانية", L("الطبقة", "The layer")),
      area("text_b", "نص اللقطة الثانية", L("القميص يبقى تحت الطبقة، والياقة لا تتحرك من مكانها.", "The shirt stays under the layer, and the collar does not shift.")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "الصفحة الأخيرة (دعوة الختام)",
    icon: "sicon-megaphone",
    name: "closing-page",
    key: "df171afb-b40e-4933-93ae-38e480e6bf60",
    image: "",
    props: { "min-height": "320px" },
    fields: [
      text("kicker", "سطر صغير", L("القرار الأخير", "The last decision")),
      text("title", "العنوان", L("اطلب القميص اليوم، ويصلك خلال يومين", "Order the shirt today, and it arrives within two days")),
      area("text", "النص", L("التجهيز داخل المدينة خلال يومين. إن اختلف المقاس نستبدله خلال ١٤ يوماً.", "In-city dispatch is within two days. If the size is off, we exchange it within 14 days.")),
      text("button_label", "نص الزر", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      text("note", "سطر تحت الزر", L("الدفع يتم داخل صفحة الهبوط", "Payment happens on this landing page")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "واجهة الرصيف",
    icon: "sicon-image",
    name: "dock-hero",
    key: "8372091d-dfb6-46ab-8481-6170917e1444",
    image: "",
    props: { "min-height": "640px" },
    fields: [
      text("kicker", "سطر صغير", L("المنتج أولاً", "The product first")),
      text("title", "العنوان", L("قطعة تُختار من العلاقة", "A piece chosen from the rail")),
      area("text", "النص", L("القماش ظاهر، والقصة تُرى قبل جدول المقاسات.", "The fabric shows, and the cut is visible before the size chart.")),
      text("button_label", "نص الزر", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      image("image", "صورة الخلفية", "المقاس المقترح 1920×1080 بكسل. إن تركتها فارغة تظهر خلفية لونية.", SHOP),
      text("image_alt", "وصف الصورة", L("اختيار قطعة من علاقة ملابس", "Choosing a piece from a clothing rail")),
      line("dh-1"),
      text("fact_1_value", "الرقم الأول", L("٢٤ س", "24 h")),
      text("fact_1_label", "تسمية الرقم الأول", L("تجهيز", "Dispatch")),
      text("fact_2_value", "الرقم الثاني", L("٤.٨", "4.8")),
      text("fact_2_label", "تسمية الرقم الثاني", L("تقييم", "Rating")),
      text("fact_3_value", "الرقم الثالث", L("١٤ يوم", "14 days")),
      text("fact_3_label", "تسمية الرقم الثالث", L("استبدال", "Exchange")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "شريط الأرقام",
    icon: "sicon-calculator",
    name: "count-band",
    key: "dcc89e15-44f7-406d-901a-b20fd2e3afd9",
    image: "",
    props: { "min-height": "180px" },
    fields: [
      sw("show_countdown", "إظهار العد التنازلي", true, "يظهر فوق الأرقام. إن تُرك الموعد فارغاً يبدأ من ٧٢ ساعة عند أول زيارة."),
      {
        id: "ends_at",
        type: "string",
        format: "datetime",
        inputType: "datetime-local",
        label: "تاريخ انتهاء العرض",
        icon: "sicon-calendar-time",
        multilanguage: false,
        required: false,
        description: "اختر التاريخ والوقت من الحقل. اتركه فارغاً ليبدأ العد من ٧٢ ساعة عند أول زيارة.",
        placeholder: "2026-12-05T23:59",
        minLength: 0,
        maxLength: 40,
        value: "",
      },
      text("countdown_label", "عنوان العد", L("ينتهي العرض خلال", "The offer ends in")),
      collection("items", "رقم", [
        text("value", "الرقم", L("+١٢ ألف", "+12k")),
        text("label", "العنوان", L("طلب", "Orders")),
        text("hint", "سطر صغير", L("منذ إطلاق المنتج", "Since the product launched")),
      ], [
        { value: L("+١٢ ألف", "+12k"), label: L("قطعة", "Pieces"), hint: L("منذ أول تشكيلة", "Since the first collection") },
        { value: L("٤.٨", "4.8"), label: L("تقييم المقاس", "Size rating"), hint: L("على القطع المستلمة", "On received pieces") },
        { value: L("٤٨ س", "48 h"), label: L("تجهيز", "Dispatch"), hint: L("لتجهيز المقاس داخل المدينة", "To prepare an in-city size") },
      ], 1, 3),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "سكة الأسباب",
    icon: "sicon-star2",
    name: "reason-rail",
    key: "e0307a54-f504-420e-856f-d4c949390ada",
    image: "",
    props: { "min-height": "320px" },
    fields: [
      text("kicker", "سطر صغير", L("لماذا هذه القطعة", "Why this piece")),
      text("title", "العنوان", L("ستة أسباب تُمرَّر باليد", "Six reasons you scroll by hand")),
      text("subtitle", "وصف قصير", L("اسحب السكة. كل بطاقة سبب واحد فقط.", "Drag the rail. Each card is one reason.")),
      collection("items", "سبب", [
        icon("icon", "الأيقونة", "sicon-star2"),
        text("title", "السبب", L("قماش واضح", "A clear fabric")),
        area("text", "الشرح", L("اكتب قماشاً واحداً يلمسه المشتري أو يراه في الصورة.", "Name one fabric the buyer can touch or see in the photo.")),
      ], [
        { icon: "sicon-shield-check", title: L("كتان يُرى نسيجه", "Linen you can see"), text: L("النسيج ظاهر في الصورة، بلا طباعة تخفي القماش.", "The weave shows in the photo, with no print hiding the cloth.") },
        { icon: "sicon-time", title: L("يصل في موعده", "It arrives on time"), text: L("مدة الشحن مكتوبة قبل الدفع، لا بعدها.", "The shipping window is written before payment, not after.") },
        { icon: "sicon-star2", title: L("للدوام", "For the workday"), text: L("قصة مستقيمة لا تضيق عند الكتف خلال اليوم.", "A straight cut that does not tighten at the shoulder through the day.") },
        { icon: "sicon-box", title: L("تغليف مرتب", "Tidy packing"), text: L("القميص يصل معلقاً، مع بطاقة المقاس.", "The shirt arrives on a hanger, with the size card.") },
        { icon: "sicon-rotate", title: L("استبدال المقاس", "A size exchange"), text: L("خلال ١٤ يوماً إن اختلف المقاس عن الجدول.", "Within 14 days if the size differs from the chart.") },
        { icon: "sicon-gift", title: L("هدية جاهزة", "Ready to gift"), text: L("يصل في كيس قماش، بلا تغليف إضافي.", "It arrives in a cloth bag, with no extra wrapping.") },
      ], 1, 8),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "لوحة المقارنة",
    icon: "sicon-list",
    name: "versus-board",
    key: "0a595a3a-69c2-4733-92cf-599565958d8f",
    image: "",
    props: { "min-height": "380px" },
    fields: [
      text("kicker", "سطر صغير", L("قبل وبعد", "Before and after")),
      text("title", "العنوان", L("الفرق في سطرين متقابلين", "The difference in two facing lines")),
      text("subtitle", "وصف قصير", L("", "")),
      text("col_off", "عنوان العمود الأول", L("قبل", "Before")),
      text("col_on", "عنوان العمود الثاني", L("بعد", "After")),
      collection("items", "صف", [
        text("off", "بدونها", L("البحث عن البديل يستغرق وقتاً", "Looking for a substitute takes time")),
        text("on", "معها", L("الخيار جاهز في صفحة واحدة", "The choice is ready on one page")),
      ], [
        { off: L("المقاس يُخمَّن من الصورة", "The size is guessed from the photo"), on: L("المقاس مكتوب في الجدول", "The size is written in the chart") },
        { off: L("القماش غير مذكور", "The fabric is not named"), on: L("كتان، ووزنه في سطر", "Linen, and its weight is one line") },
        { off: L("اللون يختلف بعد الوصول", "The color changes after it arrives"), on: L("لون الصورة هو لون القطعة", "The photo color is the piece color") },
        { off: L("تبديل المقاس يحتاج مراسلات", "A size change needs a long thread"), on: L("شرط الاستبدال مكتوب قبل الطلب", "The exchange rule is written before the order") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "لوحة العرض",
    icon: "sicon-box",
    name: "offer-panel",
    key: "711a6a61-9a20-4885-9968-9e39bbd8b92a",
    image: "",
    props: { "min-height": "360px" },
    fields: [
      text("kicker", "سطر صغير", L("ما يصلك", "What arrives")),
      text("title", "العنوان", L("ماذا يصل مع القميص", "What arrives with the shirt")),
      text("price_note", "سطر السعر أو الملاحظة", L("السعر يظهر من منتج الصفحة", "The price comes from the page product")),
      collection("items", "سطر", [
        text("text", "النص", L("المنتج الأساسي", "The main product")),
      ], [
        { text: L("قميص الكتان", "The linen shirt") },
        { text: L("كيس قماش للتعليق", "A cloth bag for hanging") },
        { text: L("بطاقة المقاس والعناية", "The size and care card") },
        { text: L("شرط استبدال المقاس", "The size-exchange rule") },
      ], 1, 8),
      text("aside_title", "عنوان الجانب", L("ابدأ بمقاس واحد", "Start with one size")),
      area("aside_text", "نص الجانب", L("الزر يفتح شراء الصفحة. اختر المقاس من جدول القطعة.", "The button opens this page's checkout. Choose the size from the piece chart.")),
      text("button_label", "نص الزر", L("أضف القميص", "Add the shirt")),
      url("button_url", "رابط الزر", "", ctaHint),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "اختيار الموقف",
    icon: "sicon-star2",
    name: "situation-pick",
    key: "11351c9b-6d4d-4e9a-86b0-49fa1071f75c",
    image: "",
    props: { "min-height": "340px" },
    fields: [
      text("kicker", "سطر صغير", L("هل تناسبك؟", "Is it for you?")),
      text("title", "العنوان", L("اختر المناسبة، نكتب لك الجملة", "Pick the occasion, and we write the line")),
      text("subtitle", "وصف قصير", L("كل موقف يفتح رسالة وزر شراء.", "Each occasion opens a message and a buy button.")),
      text("button_label", "نص الزر الاحتياطي", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      collection("items", "موقف", [
        text("label", "الموقف", L("أحتاجه اليوم", "I need it today")),
        area("message", "الرسالة", L("اكتب لمن يناسب هذا الخيار، ومتى يصله.", "Write who this option is for, and when it arrives.")),
        text("button", "نص الزر", L("اطلبه الآن", "Order it now")),
      ], [
        { label: L("ألبسه للدوام", "I will wear it to work"), message: L("قصة مستقيمة وقماش خفيف، والتجهيز داخل المدينة خلال يومين.", "A straight cut and a light fabric, with in-city dispatch within two days."), button: L("اطلبه للدوام", "Order it for work") },
        { label: L("أهداه", "I am gifting it"), message: L("يصل في كيس قماش، وبطاقة المقاس داخله.", "It arrives in a cloth bag, with the size card inside."), button: L("اطلبه هدية", "Order it as a gift") },
        { label: L("أجرب المقاس", "I want to try the size"), message: L("إن اختلف المقاس عن الجدول، الاستبدال خلال ١٤ يوماً.", "If the size differs from the chart, the exchange is within 14 days."), button: L("ابدأ بالمقاس", "Start with the size") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "إيصال المحتوى",
    icon: "sicon-list",
    name: "receipt-note",
    key: "1d9eccb2-f1e7-40fc-a4d2-9f98715b80df",
    image: "",
    props: { "min-height": "420px" },
    fields: [
      text("title", "العنوان", L("ماذا داخل الطلب", "What is in the order")),
      text("subtitle", "وصف قصير", L("سطر لكل شيء يصل مع القطعة.", "One line for everything that arrives with the piece.")),
      titleStyle("hairline"),
      collection("items", "سطر", [
        text("label", "البند", L("الوزن", "Weight")),
        text("value", "القيمة", L("يُكتب من التاجر", "Written by the merchant")),
      ], [
        { label: L("القطعة", "Piece"), value: L("قميص كتان", "A linen shirt") },
        { label: L("المقاس", "Size"), value: L("يُختار من الجدول", "Chosen from the chart") },
        { label: L("القماش", "Fabric"), value: L("كتان خفيف", "Light linen") },
        { label: L("العناية", "Care"), value: L("غسيل بارد وكي من الداخل", "A cold wash, and iron from the inside") },
      ], 1, 8),
      text("foot", "سطر أسفل الإيصال", L("المقاس والقماش مكتوبان على البطاقة.", "The size and the fabric are printed on the card.")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "أوقات اليوم",
    icon: "sicon-time",
    name: "day-parts",
    key: "3999f570-826e-4b4a-a735-187b35eb405b",
    image: "",
    props: { "min-height": "380px" },
    fields: [
      text("title", "العنوان", L("متى يُلبس؟", "When is it worn?")),
      text("subtitle", "وصف قصير", L("اختر وقتاً لتقرأ كيف تُلبس القطعة.", "Pick a time to read how the piece is worn.")),
      titleStyle("brackets"),
      collection("items", "وقت", [
        text("when", "التوقيت", L("الصباح", "Morning")),
        text("title", "العنوان", L("قبل الخروج", "Before leaving")),
        area("text", "الجملة", L("قطعة خفيفة لا تؤخر أول ساعة في اليوم.", "A light piece that does not slow the first hour of the day.")),
      ], [
        { when: L("الصباح", "Morning"), title: L("قبل الدوام", "Before work"), text: L("قطعة خفيفة، والكم يُطوّى إن طال اليوم.", "A light piece, and the sleeve rolls up if the day runs long.") },
        { when: L("الظهر", "Noon"), title: L("بين مشوارين", "Between two errands"), text: L("الطبقة تُخلع، والقميص يبقى وحده.", "The layer comes off, and the shirt stays on its own.") },
        { when: L("المساء", "Evening"), title: L("بعد العودة", "After coming home"), text: L("يُعلّق على العلاقة حتى يرجع شكله.", "It hangs on the rail until it finds its shape again.") },
      ], 1, 4),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "بطاقة المنشأ",
    icon: "sicon-image",
    name: "origin-card",
    key: "0ced9085-6757-4e47-8bd3-76d95b071e6d",
    image: "",
    props: { "min-height": "520px" },
    fields: [
      text("title", "العنوان", L("من المشغل إلى العلاقة", "From the workshop to the rail")),
      text("subtitle", "وصف قصير", L("مشغل واحد، وثلاث حقائق عن القطعة.", "One workshop, and three facts about the piece.")),
      titleStyle("ticket"),
      text("place", "اسم المكان", L("مشغل صغير", "A small workshop")),
      image("image", "صورة المكان", "المقاس المقترح 1200×900 بكسل، صورة أفقية للمكان أو الخامة.", SEW),
      text("image_alt", "وصف الصورة", L("خياطة قماش فاتح على الماكينة", "Sewing a light cloth on the machine")),
      collection("items", "حقيقة", [
        text("label", "العنوان", L("المصدر", "Source")),
        text("text", "التفصيل", L("من أين تأتي الخامة أو القطعة", "Where the material or the piece comes from")),
      ], [
        { label: L("المصدر", "Source"), text: L("كتان يُفصَّل على دفعات صغيرة", "Linen cut in small batches") },
        { label: L("القصة", "Cut"), text: L("مستقيمة، والكم يُطوّى", "Straight, and the sleeve rolls up") },
        { label: L("الفحص", "Check"), text: L("المقاس يُراجع قبل وضع القطعة في الكيس", "The size is checked before the piece goes in the bag") },
      ], 1, 4),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "خيط العناية",
    icon: "sicon-format-text-alt",
    name: "care-thread",
    key: "78ac3381-8df8-4f18-aa14-3f42cd0790dc",
    image: "",
    props: { "min-height": "460px" },
    fields: [
      text("title", "العنوان", L("ثلاث عادات تحفظ القميص", "Three habits that keep the shirt")),
      text("subtitle", "وصف قصير", L("غسيل بارد، وكي من الداخل، وتعليق بدل الطي الطويل.", "A cold wash, ironing from the inside, and hanging instead of a long fold.")),
      titleStyle("hairline"),
      collection("items", "خطوة", [
        text("title", "الخطوة", L("اغسله بارداً", "Wash it cold")),
        area("text", "التفصيل", L("دورة باردة حتى يبقى لون القماش.", "A cold cycle so the cloth keeps its color.")),
      ], [
        { title: L("اغسله بارداً", "Wash it cold"), text: L("دورة باردة، حتى يبقى لون الكتان.", "A cold cycle, so the linen keeps its color.") },
        { title: L("كيّه من الداخل", "Iron it from the inside"), text: L("الحرارة على القفا، لا على وجه القماش.", "The heat stays on the reverse, not on the face of the cloth.") },
        { title: L("علّقه", "Hang it"), text: L("علاقة عريضة، لا طي طويل يترك خطاً على الكتف.", "A wide hanger, not a long fold that marks the shoulder.") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "رسالة الصانع",
    icon: "sicon-paragraph",
    name: "maker-letter",
    key: "628de14f-6ded-4b21-aab4-5b476d3ce975",
    image: "",
    props: { "min-height": "420px" },
    fields: [
      text("title", "العنوان", L("كلمة من المشغل", "A word from the workshop")),
      text("subtitle", "وصف قصير", L("", "")),
      titleStyle("plain"),
      area("text", "نص الرسالة", L("نخيط كمية نقدر نراجع مقاسها. إن وصل القميص بغير المقاس المكتوب على البطاقة، نبدّله دون جدال طويل.", "We sew an amount whose size we can still check. If the shirt arrives in a different size from the card, we exchange it without a long argument.")),
      text("signer", "التوقيع", L("فريق التفصيل", "The cutting team")),
      text("role", "الصفة", L("المشغل", "The workshop")),
      text("button_label", "نص الزر", L("اطلب القميص", "Order the shirt")),
      url("button_url", "رابط الزر", "", ctaHint),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "بطاقات الرف",
    icon: "sicon-star2",
    name: "shelf-tags",
    key: "308978a7-1563-4de3-ac34-dfcb649d29aa",
    image: "",
    props: { "min-height": "340px" },
    fields: [
      text("title", "العنوان", L("كلمات على بطاقة القطعة", "Words on the piece card")),
      text("subtitle", "وصف قصير", L("أربع بطاقات، لا جدول طويل.", "Four tickets, not a long table.")),
      titleStyle("ticket"),
      collection("items", "بطاقة", [
        text("word", "الكلمة", L("واضح", "Clear")),
        text("note", "سطر صغير", L("المعلومة قبل الدفع", "The fact before payment")),
      ], [
        { word: L("كتان", "Linen"), note: L("النسيج ظاهر", "The weave shows") },
        { word: L("مستقيم", "Straight"), note: L("القصة لا تضيق عند الكتف", "The cut is not tight at the shoulder") },
        { word: L("خفيف", "Light"), note: L("يناسب الدوام", "It suits the workday") },
        { word: L("قابل للاستبدال", "Exchangeable"), note: L("إن اختلف المقاس المكتوب", "If the printed size differs") },
      ], 1, 8),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "سلايدر افتتاحي",
    icon: "sicon-image",
    name: "open-slider",
    key: "a3d2aa90-eaf2-408b-921d-26f1d961aca3",
    image: "",
    props: { "min-height": "560px" },
    fields: [
      text("title", "اسم القسم", L("افتتاح الصفحة", "Page opening")),
      collection("items", "شريحة", [
        image("image", "صورة الشريحة", "المقاس المقترح 1400×900 بكسل، صورة أفقية للمنتج أو الاستخدام."),
        url("video", "فيديو الشريحة (اختياري)", "", "رابط ملف MP4 أو يوتيوب أو فيميو. يعمل بلا صوت ويتكرر، والصورة تظهر قبل تحميله. الشريحة تنتقل عند انتهاء الملف."),
        text("alt", "وصف الصورة", L("المنتج في الاستخدام", "The product in use")),
        text("title", "العنوان", L("القطعة التي تبيع نفسها من أول نظرة", "The piece that explains itself at first glance")),
        area("text", "النص", L("اكتب جملة واحدة عن القماش أو القصة، ثم ادعُ الزائر للطلب.", "Write one sentence about the fabric or the cut, then invite the visitor to order.")),
        text("button", "نص الزر", L("اطلب الآن", "Order now")),
        url("url", "رابط الزر", "", ctaHint),
      ], [
        { image: SHIRT, alt: L("قميص كتان فاتح على علاقة", "A light linen shirt on a hanger"), title: L("قميص كتان من أول نظرة", "A linen shirt at first glance"), text: L("أزرار ظاهرة وجيب صدر. المقاس في القسم التالي.", "Visible buttons and a chest pocket. The size is in the next section."), button: L("شاهد القطعة", "See the piece"), url: "#rw-product" },
        { image: RACK, video: LOOK, alt: L("قمصان بيضاء على علاقات خشبية", "White shirts on wooden hangers"), title: L("التشكيلة على العلاقة", "The collection on the rail"), text: L("أكثر من قطعة، واللون يُرى قبل الاختيار.", "More than one piece, and the color shows before you choose."), button: L("اطلب الآن", "Order now"), url: "" },
        { image: SHOP, alt: L("اختيار قطعة من علاقة الملابس", "Choosing a piece from a clothing rail"), title: L("الاختيار قبل الخروج", "The choice before leaving"), text: L("من العلاقة إلى المقاس. لا خطوات أكثر من ذلك.", "From the rail to the size. No more steps than that."), button: L("أضف للطلب", "Add to the order"), url: "" },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "هيرو المنتج",
    icon: "sicon-box",
    name: "product-hero",
    key: "bf08848d-81bc-4145-88b7-4c08e8d2253b",
    image: "",
    props: { "min-height": "640px" },
    fields: [
      products("product", "المنتج", "في صفحة منتج يظهر منتج الصفحة نفسه. في صفحة العروض يظهر المنتج الذي تختاره هنا: اسمه وصوره وسعره."),
      text("title", "اسم المنتج إن لم يُختر منتج", L("قميص كتان", "Linen shirt"), { max: 120 }),
      area("text", "وصف قصير", L("قصة مستقيمة وقماش خفيف. عند اختيار منتج من المتجر يُستبدل الاسم والسعر والصور ببياناته.", "A straight cut and a light fabric. Choosing a store product replaces the name, price, and photos with its own.")),
      text("price_text", "السعر عند المعاينة", L("١٨٩ ر.س", "SAR 189")),
      text("compare_text", "السعر قبل الخصم عند المعاينة", L("٢٤٠ ر.س", "SAR 240")),
      text("button_label", "نص زر الشراء", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      collection("views", "زاوية", [
        image("image", "صورة الزاوية", "المقاس المقترح 1000×1000 بكسل. إن تُركت فارغة تُملأ من صور المنتج، ويبقى اسم الزاوية."),
        text("label", "اسم الزاوية", L("الأمام", "Front")),
        text("alt", "وصف الصورة", L("المنتج من الأمام", "The product from the front")),
      ], [
        { image: SHIRT, label: L("القميص", "Shirt"), alt: L("قميص الكتان من الأمام", "The linen shirt from the front") },
        { image: RACK, label: L("العلاقة", "Rail"), alt: L("قمصان على علاقات خشبية", "Shirts on wooden hangers") },
        { image: LAYERS, label: L("الطبقة", "Layer"), alt: L("جاكيت فوق قميص", "A jacket over a shirt") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "فيديو افتتاحي",
    icon: "sicon-image",
    name: "open-video",
    key: "979146a6-6e45-4011-ac04-77a4b5aa3cc8",
    image: "",
    props: { "min-height": "480px" },
    fields: [
      text("title", "العنوان", L("شاهد الاختيار قبل أن تطلب", "Watch the choice before you order")),
      area("text", "النص", L("فيديو قصير لاختيار القطعة من العلاقة. يبدأ عند الضغط، والصوت لا يفتح وحده.", "A short video of choosing the piece from the rail. It starts on tap, and the sound does not start on its own.")),
      image("poster", "صورة الغلاف", "المقاس المقترح 1600×900 بكسل، تظهر قبل التشغيل.", SHOP),
      url("video_url", "رابط الفيديو", LOOK, "رابط يوتيوب أو فيميو أو ملف mp4."),
      line("ov-view"),
      drop("layout", "مكان الفيديو", [
        ["beside", "بجانب النص", KEY.videoBeside],
        ["stack", "تحت النص بعرض الصفحة", KEY.videoStack],
        ["cover", "خلفية والنص فوقه", KEY.videoCover],
      ], "beside"),
      drop("frame", "شكل الإطار", [
        ["wide", "عريض ١٦:٩", KEY.frameWide],
        ["story", "طولي ٩:١٦", KEY.frameStory],
        ["square", "مربع", KEY.frameSquare],
        ["portrait", "بورتريه ٤:٥", KEY.framePortrait],
      ], "wide"),
      drop("fit", "ملاءمة الفيديو", [
        ["cover", "تغطية الإطار", KEY.fitCover],
        ["contain", "إظهار الفيديو كاملاً", KEY.fitContain],
      ], "cover"),
      drop("playback", "التشغيل", [
        ["click", "عند الضغط", KEY.playClick],
        ["auto", "تلقائي بدون صوت", KEY.playAuto],
      ], "click", "التلقائي يبدأ الفيديو وحده وبلا صوت، سواء كان ملفاً أو يوتيوب أو فيميو. الزائر يفتح الصوت من المشغّل إذا أراد."),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "ريلز الآراء",
    icon: "sicon-star",
    name: "review-reels",
    key: "d4e8b1c6-2f70-4a93-9c15-6e8a0b3d7f24",
    image: "",
    props: { "min-height": "640px" },
    fields: [
      text("kicker", "سطر صغير", L("تجارب العملاء", "Customer experiences")),
      text("title", "العنوان", L("شاهد التجربة قبل الشراء", "Watch the experience before buying"), { max: 120 }),
      text("subtitle", "وصف قصير", L("فيديوهات قصيرة من عملاء جرّبوا المنتج. تعمل كلها بدون صوت، والصوت يُفتح من الزر.", "Short videos from customers who tried the product. They all play muted, and sound opens from the button.")),
      sw("autoplay", "تشغيل الفيديوهات بدون صوت", true, "عند الوصول إلى الريلز تعمل كل الفيديوهات معاً وبلا صوت. كل بطاقة فيها زر للصوت والكتم."),
      collection("items", "تجربة", [
        url("video_url", "رابط الفيديو", "", "رابط يوتيوب أو فيميو أو ملف mp4 طولي."),
        image("poster", "صورة الغلاف", "المقاس المقترح 720×1280 بكسل، تظهر قبل التشغيل."),
        text("name", "اسم العميل", L("نورة", "Noura")),
        text("place", "المدينة", L("الرياض", "Riyadh")),
        text("quote", "الرأي أو وصف التجربة", L("المقاس طابق الجدول، ولبست القطعة من اليوم الأول.", "The size matched the chart, and I wore the piece the same day.")),
        drop("stars", "الدرجة من ٥", [["5", "٥", KEY.reelStar5], ["4", "٤", KEY.reelStar4], ["3", "٣", KEY.reelStar3]], "5"),
        text("link_label", "نص رابط المنتج", L("", "")),
        url("link_url", "رابط المنتج", "", "اتركه فارغاً إذا كانت التجربة عن منتج الصفحة."),
      ], [
        { video_url: REEL_MIRROR, poster: TEE, name: L("نورة", "Noura"), place: L("الرياض", "Riyadh"), quote: L("المقاس طابق الجدول، ولبست القطعة من أول يوم.", "The size matched the chart, and I wore the piece the first day."), stars: picked("5", "٥", KEY.reelStar5), link_label: L("", ""), link_url: "" },
        { video_url: REEL_ADJUST, poster: DRESS, name: L("سلمان", "Salman"), place: L("جدة", "Jeddah"), quote: L("القصة مريحة، والقماش ما ثقل خلال الدوام.", "The cut is easy, and the fabric did not feel heavy through the workday."), stars: picked("5", "٥", KEY.reelStar5), link_label: L("", ""), link_url: "" },
        { video_url: REEL_SUIT, poster: LAYERS, name: L("هند", "Hind"), place: L("الخبر", "Khobar"), quote: L("حبيت أشوف الطبقة قبل ما أطلب المقاس.", "I wanted to see the layer before I ordered the size."), stars: picked("4", "٤", KEY.reelStar4), link_label: L("", ""), link_url: "" },
      ], 1, 8),
      text("button_label", "نص زر الشراء", L("اطلب الآن", "Order now")),
      url("button_url", "رابط الزر", "", ctaHint),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "خاتمة المجلة (الفوتر)",
    icon: "sicon-link",
    name: "edit-footer",
    key: "b7e2c4a1-6f38-4d90-8b15-3a9c0e7d2f64",
    image: "",
    props: { "min-height": "160px" },
    fields: [
      text("announce", "الشريط الإعلاني", L("الطلب يُكمَل من المتجر · القماش والمقاس في هذه الصفحة", "The order is completed in the store · fabric and size are on this page"), { desc: "يظهر فوق الفوتر. اتركه فارغاً لإخفاء الشريط." }),
      drop("announce_mode", "حركة الشريط", [["move", "متحرك", KEY.annMove], ["still", "ثابت", KEY.annStill]], "move", "المتحرك يمرّ الجملة باستمرار. الثابت يُبقيها في الوسط."),
      line("ft-announce"),
      image("logo", "شعار مخصص", "اتركه فارغاً ليظهر شعار المتجر."),
      image("logo_dark", "شعار للخلفية الداكنة", "يظهر في الوضع الداكن. بدونه يُستخدم الشعار الأساسي."),
      area("note", "سطر التعريف", L("المقاس والقماش في هذه الصفحة، والطلب يُكمَل من المتجر.", "The size and the fabric are on this page, and the order is completed in the store.")),
      sw("show_store", "إظهار رابط المتجر", true, "يُضاف رابط المتجر إلى روابط الفوتر."),
      text("store_label", "نص رابط المتجر", L("المتجر", "Store")),
      collection("links", "رابط", [
        text("label", "النص", L("سياسة الاستبدال", "Exchange policy")),
        url("url", "الرابط", "", "صفحة السياسة أو التواصل. اتركه فارغاً ليذهب الرابط إلى المتجر."),
      ], [
        { label: L("سياسة الاستبدال", "Exchange policy"), url: "https://help.salla.sa/" },
        { label: L("تواصل معنا", "Contact us"), url: "https://salla.sa/contact" },
      ], 0, 6),
      collection("badges", "شارة", [
        image("image", "الصورة", "المقاس المقترح 168×56 بكسل، شعار الجهة بخلفية شفافة."),
        text("alt", "وصف الصورة", L("وثيقة العمل الحر", "Freelance work document")),
        url("url", "الرابط", "", "صفحة التحقق، مثل وثيقة العمل الحر أو منصة الأعمال."),
      ], [
        { image: "", alt: L("وثيقة العمل الحر", "Freelance work document"), url: "https://freelance.sa/" },
        { image: "", alt: L("منصة الأعمال", "Business platform"), url: "https://business.sa/" },
      ], 0, 6),
      text("legal", "سطر نظامي", L("السجل التجاري يُكتب هنا إن لزم", "Add the commercial register here if needed")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
];

const catalog = [
  "edit-bar",
  "open-slider",
  "product-hero",
  "open-video",
  "review-reels",
  "promise-row",
  "detail-duo",
  "closing-page",
  "split-intro",
  "chapter-path",
  "voice-stack",
  "dock-hero",
  "count-band",
  "reason-rail",
  "versus-board",
  "offer-panel",
  "situation-pick",
  "origin-card",
  "receipt-note",
  "day-parts",
  "care-thread",
  "maker-letter",
  "shelf-tags",
  "edit-footer",
];
components.sort((a, b) => catalog.indexOf(a.name) - catalog.indexOf(b.name));

const templates = [
  {
    name: "wuduh",
    id: "846b8092-8d09-493a-a59e-4485260dd34c",
    is_default: true,
    primary_color: "#2457c5",
    order: [["edit-bar", { sticky: true, show_mode_toggle: true }], "open-slider", "product-hero", "promise-row", "open-video", "detail-duo", "closing-page", "edit-footer"],
  },
  {
    name: "zakham",
    id: "f4a1ec56-5f6a-4683-ab2d-9f25426104e6",
    is_default: false,
    primary_color: "#0f6e6a",
    order: [["edit-bar", { sticky: true, transparent: true, show_shadow: false, default_mode: "dark" }], "dock-hero", "count-band", "reason-rail", "versus-board", "offer-panel", "situation-pick", "edit-footer"],
  },
  {
    name: "saji",
    id: "9d14165d-429f-4cbc-9254-ae64d434d1d7",
    is_default: false,
    primary_color: "#1c3d36",
    order: ["edit-bar", "origin-card", "receipt-note", "day-parts", "care-thread", "maker-letter", "shelf-tags", "edit-footer"],
  },
];

applyLandingExtras({ components, catalog, templates, L, text, color, sw, drop, line, collection, image, url, scheme, KEY });

const bundlePath = new URL("../twilight-bundle.json", import.meta.url);
let previous = { templates: [] };
if (fs.existsSync(bundlePath)) previous = JSON.parse(fs.readFileSync(bundlePath, "utf8"));
const previousTemplates = new Map((previous.templates || []).map((item) => [item.path, item]));

const bundle = {
  name: { ar: "مجموعة ساجي", en: "Saji Collection" },
  description: {
    ar: "ثلاث صفحات هبوط لأي متجر. كل صفحة تبدأ برأس فيه الشعار ووضع الألوان، ثم الأقسام بترتيب الشراء، وتنتهي بفوتر.",
    en: "Three landing pages for any store. Each page starts with a header for the logo and the color mode, then the sections in purchase order, and ends with a footer.",
  },
  author: {
    name: "Saji",
    email: "sajispprt@gmail.com",
    url: "https://saji-tech.com/",
  },
  author_email: "sajispprt@gmail.com",
  support_url: "https://github.com/Ashaheen892/tw-saji-landing",
  repository: "https://github.com/Ashaheen892/tw-saji-landing",
  features: ["landing-page-templates"],
  components,
  templates: templates.map((template) => {
    const path = `templates.${template.name}`;
    const saved = previousTemplates.get(path) || {};
    return {
      id: template.id,
      path,
      category_id: saved.category_id || "",
      primary_color: template.primary_color,
      thumbnail: saved.thumbnail || "",
      is_default: template.is_default,
      ...(saved.public_preview_url ? { public_preview_url: saved.public_preview_url } : {}),
    };
  }),
};

fs.writeFileSync(bundlePath, `${JSON.stringify(bundle, null, 4)}\n`);
fs.mkdirSync(new URL("../templates/", import.meta.url), { recursive: true });
fs.mkdirSync(new URL("../public/", import.meta.url), { recursive: true });
const byName = new Map(components.map((component) => [component.name, component]));
const materialize = (entry) => {
  const [name, overrides] = Array.isArray(entry) ? entry : [entry, {}];
  const copy = structuredClone(byName.get(name));
  for (const [id, value] of Object.entries(overrides)) {
    const field = copy.fields.find((item) => item.id === id);
    if (!field) continue;
    if (field.format === "dropdown-list") {
      const picked = (field.options || []).filter((item) => item.value === value);
      field.selected = picked;
      field.value = picked;
    } else {
      field.value = value;
      if ("selected" in field) field.selected = value;
    }
  }
  return copy;
};
for (const template of templates) {
  const list = template.order.map((entry) => materialize(entry));
  fs.writeFileSync(new URL(`../templates/${template.name}.json`, import.meta.url), `${JSON.stringify({ id: template.id, components: list }, null, 2)}\n`);
}
fs.writeFileSync(new URL("../public/twilight-bundle.json", import.meta.url), `${JSON.stringify(bundle, null, 4)}\n`);
console.log("pages:", templates.map((template) => `${template.name}(${template.order.length})`).join(", "));
console.log("sections:", components.map((component) => component.name).join(", "));
