import fs from "node:fs";

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
const SERUM = px(4735932, 1400);
const AMBER = px(4041392, 1400);
const DROP = px(3762879, 1400);
const BAG = px(27204288, 1800);
const ROAST = px(894695, 1400);
const SERUM_VIDEO = "https://videos.pexels.com/video-files/9697876/9697876-hd_1920_1080_25fps.mp4";
const REEL_DROPPER = "https://videos.pexels.com/video-files/8479098/8479098-sd_360_640_24fps.mp4";
const REEL_HANDS = "https://videos.pexels.com/video-files/6925815/6925815-sd_360_640_25fps.mp4";
const REEL_HARVEST = "https://videos.pexels.com/video-files/7118137/7118137-sd_640_360_25fps.mp4";
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
  id, type: "collection", format: "collection", required: true, minLength: min, maxLength: max,
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
    title: "رأس الصفحة",
    icon: "sicon-store",
    name: "page-bar",
    key: "c4e8a1b2-7f30-4a6e-9c15-2d8b6f0e4a71",
    image: "",
    props: { "min-height": "88px" },
    fields: [
      image("logo", "شعار مخصص", "اتركه فارغاً ليظهر شعار المتجر."),
      image("logo_dark", "شعار للخلفية الداكنة", "يظهر فوق السلايدر الشفاف وفي الوضع الداكن. بدونه يُستخدم الشعار الأساسي."),
      num("logo_height", "ارتفاع الشعار", 52, 28, 120, "بالبكسل."),
      drop("align", "مكان الشعار", [["center", "الوسط", KEY.alignCenter], ["start", "البداية", KEY.alignStart]], "center"),
      line("pb-logo"),
      sw("sticky", "تثبيت الرأس عند التمرير", true, "يبقى الشعار ظاهراً أثناء نزول الزائر."),
      sw("transparent", "رأس شفاف فوق القسم التالي", false, "يناسب صورة افتتاحية داكنة. عند التمرير يعود الرأس بلون الخلفية."),
      sw("show_shadow", "خط فاصل أسفل الرأس", true),
      line("pb-behavior"),
      sw("show_mode_toggle", "زر الفاتح والداكن", true, "يبدّل الأقسام المضبوطة على حسب الصفحة، ويتذكر اختيار الزائر."),
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
      text("kicker", "سطر صغير فوق العنوان", L("منتج واحد", "One product")),
      text("title", "العنوان", L("سيروم خفيف في زجاجة تُرى", "A light serum in a bottle you can see"), { max: 120 }),
      area("text", "النص", L("قطرة واحدة على بشرة نظيفة. الصورة جانبية حتى يبقى النص قصيراً.", "One drop on clean skin. The photo sits beside the text so the line stays short.")),
      text("primary_label", "نص الزر الأساسي", L("اشتر الآن", "Buy now")),
      url("primary_url", "رابط الزر الأساسي", "", ctaHint),
      text("secondary_label", "نص الزر الثاني", L("اقرأ التفاصيل", "Read the details")),
      url("secondary_url", "رابط الزر الثاني", "#rw-chapters", "رابط حر داخل الصفحة أو خارجها. اتركه فارغاً لإخفاء الزر."),
      line("si-line"),
      image("image", "صورة الجانب", "المقاس المقترح 900×1200 بكسل، صورة طولية للمنتج أو الطقس المحيط به.", DROP),
      text("image_alt", "وصف الصورة", L("قطرة السيروم على راحة اليد", "A drop of serum on an open hand")),
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
        { icon: "sicon-shipping-fast", title: L("شحن واضح", "Clear shipping"), note: L("مدة الوصول مكتوبة قبل الدفع", "The arrival window is written before checkout") },
        { icon: "sicon-shield-check", title: L("دفع آمن", "Secure payment"), note: L("خيارات الدفع المعتمدة في المتجر", "The store's own payment options") },
        { icon: "sicon-rotate", title: L("استبدال واضح", "A clear exchange"), note: L("إن وصل المنتج بحالة غير سليمة", "If the product arrives damaged") },
        { icon: "sicon-time", title: L("رد سريع", "A quick reply"), note: L("سؤال المنتج يُجاب قبل الشراء", "A product question is answered before purchase") },
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
      text("title", "العنوان", L("من الاختيار حتى الوصول", "From the choice to the arrival")),
      text("subtitle", "وصف قصير", L("طريق قصير، بلا مفاجآت بعد الدفع.", "A short path, with no surprises after checkout.")),
      collection("items", "فصل", [
        text("title", "عنوان الفصل", L("اختر المنتج", "Choose the product")),
        area("text", "الشرح", L("خيار واضح، وبجانبه سطر يشرح الفرق.", "A clear option, with a line beside it that explains the difference.")),
      ], [
        { title: L("اختر المنتج", "Choose the product"), text: L("خيار واضح، وبجانبه سطر يشرح الفرق.", "A clear option, with a line that explains the difference.") },
        { title: L("حدد الخيار", "Set the option"), text: L("مقاس أو لون أو كمية، حسب ما يبيعه المتجر.", "A size, a color, or a quantity, depending on what the store sells.") },
        { title: L("نجهّز الطلب", "We prepare the order"), text: L("التجهيز يبدأ بعد تأكيد الدفع.", "Preparation starts after payment is confirmed.") },
        { title: L("يصلك في الموعد", "It arrives on time"), text: L("مدة الشحن مكتوبة قبل إتمام الطلب.", "The shipping window is written before checkout.") },
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
      text("kicker", "سطر صغير", L("من جرّب المنتج", "From people who tried it")),
      text("title", "العنوان", L("جمل قصيرة، بلا مبالغة", "Short lines, without exaggeration")),
      text("subtitle", "وصف قصير", L("", "")),
      collection("items", "صوت", [
        text("quote", "الجملة", L("وصل كما في الصورة، والتغليف كان سليماً.", "It arrived as shown, and the packing was intact.")),
        text("name", "الاسم", L("نورة", "Noura")),
        text("place", "المدينة", L("الرياض", "Riyadh")),
        drop("stars", "الدرجة من ٥", [["5", "٥", KEY.stars5], ["4", "٤", KEY.stars4], ["3", "٣", KEY.stars3]], "5"),
      ], [
        { quote: L("وصل كما في الصورة، والتغليف كان سليماً.", "It arrived as shown, and the packing was intact."), name: L("نورة", "Noura"), place: L("الرياض", "Riyadh"), stars: picked("5", "٥", KEY.stars5) },
        { quote: L("الخيار الذي طلبته جاء مطابقاً لما كتبته.", "The option I ordered matched what I wrote."), name: L("سلمان", "Salman"), place: L("جدة", "Jeddah"), stars: picked("5", "٥", KEY.stars5) },
        { quote: L("الشحن جاء في المدة المكتوبة على الصفحة.", "Shipping arrived within the window written on the page."), name: L("هند", "Hind"), place: L("الخبر", "Khobar"), stars: picked("4", "٤", KEY.stars4) },
        { quote: L("بدأت بقطعة واحدة قبل أن أكرر الطلب.", "I started with one piece before ordering again."), name: L("فيصل", "Faisal"), place: L("أبها", "Abha"), stars: picked("5", "٥", KEY.stars5) },
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
      text("title", "العنوان", L("الزجاجة، ثم القطرة", "The bottle, then the drop")),
      text("subtitle", "وصف قصير", L("لقطة للزجاج الداكن، ولقطة لقطرة واحدة على اليد.", "One frame of the dark glass, and one of a single drop on the hand.")),
      line("dd-a"),
      image("image_a", "الصورة الأولى", "المقاس المقترح 1200×1500 بكسل.", AMBER),
      text("alt_a", "وصف الصورة الأولى", L("زجاجة سيروم داكنة على طبق خشب", "A dark serum bottle on a wooden dish")),
      text("title_a", "عنوان اللقطة الأولى", L("الزجاج", "The glass")),
      area("text_a", "نص اللقطة الأولى", L("زجاجة داكنة تحفظ الزيت من الضوء، والقطارة تقيس الكمية.", "Dark glass keeps the oil from the light, and the dropper measures the amount.")),
      line("dd-b"),
      image("image_b", "الصورة الثانية", "المقاس المقترح 1000×1300 بكسل.", DROP),
      text("alt_b", "وصف الصورة الثانية", L("قطرة سيروم تنزل على راحة اليد", "A drop of serum falling onto an open hand")),
      text("title_b", "عنوان اللقطة الثانية", L("الاستخدام", "In use")),
      area("text_b", "نص اللقطة الثانية", L("قطرة واحدة على راحة اليد، ثم تُفرد على بشرة نظيفة.", "One drop on the palm, then spread it over clean skin.")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "دعوة الختام",
    icon: "sicon-megaphone",
    name: "close-invite",
    key: "df171afb-b40e-4933-93ae-38e480e6bf60",
    image: "",
    props: { "min-height": "320px" },
    fields: [
      text("kicker", "سطر صغير", L("القرار الأخير", "The last decision")),
      text("title", "العنوان", L("اطلب السيروم اليوم، ويصلك خلال يومين", "Order the serum today, and it arrives within two days")),
      area("text", "النص", L("التجهيز داخل المدينة خلال يومين. إن وصلت الزجاجة مفتوحة نستبدلها خلال ١٤ يوماً.", "In-city dispatch is within two days. If the bottle arrives open, we replace it within 14 days.")),
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
      text("title", "العنوان", L("حقيبة جلد ليوم طويل", "A leather bag for a long day")),
      area("text", "النص", L("حزام يُفك، وجيب أمامي. الصورة كافية قبل أن تفتح التفاصيل.", "A strap that unclips, and a front pocket. The photo is enough before you open the details.")),
      text("button_label", "نص الزر", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      image("image", "صورة الخلفية", "المقاس المقترح 1920×1080 بكسل. إن تركتها فارغة تظهر خلفية لونية.", BAG),
      text("image_alt", "وصف الصورة", L("حقيبة جلد بنية بحزام ذهبي", "A brown leather bag with a gold-tone strap")),
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
        label: "موعد انتهاء العرض",
        icon: "sicon-time",
        multilanguage: false,
        required: false,
        description: "اتركه فارغاً ليبدأ العد من ٧٢ ساعة عند أول زيارة.",
        value: "",
      },
      text("countdown_label", "عنوان العد", L("ينتهي العرض خلال", "The offer ends in")),
      collection("items", "رقم", [
        text("value", "الرقم", L("+١٢ ألف", "+12k")),
        text("label", "العنوان", L("طلب", "Orders")),
        text("hint", "سطر صغير", L("منذ إطلاق المنتج", "Since the product launched")),
      ], [
        { value: L("+١٢ ألف", "+12k"), label: L("طلب", "Orders"), hint: L("منذ إطلاق المنتج", "Since the product launched") },
        { value: L("٤.٨", "4.8"), label: L("تقييم المتجر", "Store rating"), hint: L("على الطلبات المكتملة", "On completed orders") },
        { value: L("٤٨ س", "48 h"), label: L("تجهيز", "Dispatch"), hint: L("للطلبات داخل المدينة", "For in-city orders") },
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
      text("kicker", "سطر صغير", L("لماذا هذه", "Why this one")),
      text("title", "العنوان", L("ستة أسباب تُمرَّر باليد", "Six reasons you scroll by hand")),
      text("subtitle", "وصف قصير", L("اسحب السكة. كل بطاقة سبب واحد فقط.", "Drag the rail. Each card is one reason.")),
      collection("items", "سبب", [
        icon("icon", "الأيقونة", "sicon-star2"),
        text("title", "السبب", L("خامة واضحة", "A clear material")),
        area("text", "الشرح", L("اكتب خامة واحدة يلمسها المشتري أو يراها في الصورة.", "Name one material the buyer can touch or see in the photo.")),
      ], [
        { icon: "sicon-shield-check", title: L("جلد يُرى في الصورة", "Leather you can see"), text: L("الحزام والمقبض من الجلد نفسه، بلا طبقة لامعة تخفي الخامة.", "The strap and the handle are the same leather, with no shiny coat hiding it.") },
        { icon: "sicon-time", title: L("يصل في موعده", "It arrives on time"), text: L("مدة الشحن مكتوبة قبل الدفع، لا بعدها.", "The shipping window is written before payment, not after.") },
        { icon: "sicon-star2", title: L("استخدام يومي", "Daily use"), text: L("جملة واحدة عن اللحظة التي يُستخدم فيها المنتج.", "One sentence about the moment the product is used.") },
        { icon: "sicon-box", title: L("تغليف مرتب", "Tidy packing"), text: L("ما يصل في الصندوق، بلا قطع زائدة.", "What arrives in the box, with nothing extra.") },
        { icon: "sicon-rotate", title: L("استبدال سهل", "An easy exchange"), text: L("شرط الاستبدال في سطر، إن وصل المنتج بغير حالته.", "The exchange rule in one line, if it arrives damaged.") },
        { icon: "sicon-gift", title: L("هدية جاهزة", "Ready to gift"), text: L("هل يصلح هدية؟ اكتب ذلك هنا إن كان صحيحاً.", "Does it work as a gift? Write that here if it does.") },
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
        { off: L("البحث عن البديل يستغرق وقتاً", "Looking for a substitute takes time"), on: L("الخيار جاهز في صفحة واحدة", "The choice is ready on one page") },
        { off: L("المواصفات موزعة على أكثر من شاشة", "Specs are split across screens"), on: L("المعلومة المهمة في سطر واحد", "The important fact is one line") },
        { off: L("الشحن غير واضح قبل الدفع", "Shipping is unclear before payment"), on: L("الموعد مكتوب بجانب السعر", "The date is written beside the price") },
        { off: L("الاستبدال يحتاج مراسلات طويلة", "An exchange needs a long thread"), on: L("الشرط مكتوب قبل الطلب", "The rule is written before the order") },
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
      text("title", "العنوان", L("ماذا يصل مع الطلب", "What arrives with the order")),
      text("price_note", "سطر السعر أو الملاحظة", L("السعر يظهر من منتج الصفحة", "The price comes from the page product")),
      collection("items", "سطر", [
        text("text", "النص", L("المنتج الأساسي", "The main product")),
      ], [
        { text: L("المنتج الأساسي", "The main product") },
        { text: L("تغليف يحمي القطعة", "Packing that protects the piece") },
        { text: L("بطاقة استخدام قصيرة", "A short use card") },
        { text: L("شرط الاستبدال مكتوب", "The exchange rule, written down") },
      ], 1, 8),
      text("aside_title", "عنوان الجانب", L("ابدأ بطلب واحد", "Start with one order")),
      area("aside_text", "نص الجانب", L("الزر يفتح شراء الصفحة. إن كانت الصفحة عرضاً، يتبع رابط الزر الرئيسي.", "The button opens this page's checkout. On a promotion page it follows the main button link.")),
      text("button_label", "نص الزر", L("أضفها للطلب", "Add it to the order")),
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
      text("title", "العنوان", L("اختر يومك، نكتب لك الجملة", "Pick your day, and we write the line")),
      text("subtitle", "وصف قصير", L("كل موقف يفتح رسالة وزر شراء.", "Each situation opens a message and a buy button.")),
      text("button_label", "نص الزر الاحتياطي", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      collection("items", "موقف", [
        text("label", "الموقف", L("أحتاجه اليوم", "I need it today")),
        area("message", "الرسالة", L("اكتب لمن يناسب هذا الخيار، ومتى يصله.", "Write who this option is for, and when it arrives.")),
        text("button", "نص الزر", L("اطلبه الآن", "Order it now")),
      ], [
        { label: L("أحتاجه اليوم", "I need it today"), message: L("اكتب مدة التجهيز للشحن داخل المدينة.", "Write the dispatch time for in-city shipping."), button: L("اطلبه الآن", "Order it now") },
        { label: L("أهداه لغيري", "I am gifting it"), message: L("اكتب إن كان التغليف يصلح هدية دون شراء إضافي.", "Write whether the packing works as a gift with nothing extra."), button: L("اطلبه هدية", "Order it as a gift") },
        { label: L("أجربه أولاً", "I want to try it"), message: L("اكتب شرط الاستبدال إن لم يناسب الاستخدام.", "Write the exchange rule if it does not fit the use."), button: L("ابدأ بالتجربة", "Start with a trial") },
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
      text("title", "العنوان", L("ماذا داخل الكيس", "What is in the bag")),
      text("subtitle", "وصف قصير", L("سطر لكل شيء يصل مع القهوة.", "One line for everything that arrives with the coffee.")),
      titleStyle("hairline"),
      collection("items", "سطر", [
        text("label", "البند", L("الوزن", "Weight")),
        text("value", "القيمة", L("يُكتب من التاجر", "Written by the merchant")),
      ], [
        { label: L("الوزن", "Weight"), value: L("٢٥٠ غراماً", "250 g") },
        { label: L("التحميص", "Roast"), value: L("وسط، يميل للشوكولاتة", "Medium, leaning toward chocolate") },
        { label: L("التغليف", "Packing"), value: L("كيس بصمام يحفظ الرائحة", "A valve bag that keeps the aroma") },
        { label: L("التاريخ", "Date"), value: L("تاريخ التحميص مطبوع على الكيس", "The roast date is printed on the bag") },
      ], 1, 8),
      text("foot", "سطر أسفل الإيصال", L("الوزن وتاريخ التحميص مكتوبان على الكيس.", "The weight and roast date are printed on the bag.")),
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
      text("title", "العنوان", L("متى يُشرب؟", "When is it drunk?")),
      text("subtitle", "وصف قصير", L("اختر وقتاً لتقرأ طريقة الفنجان.", "Pick a time to read how the cup is made.")),
      titleStyle("brackets"),
      collection("items", "وقت", [
        text("when", "التوقيت", L("الصباح", "Morning")),
        text("title", "العنوان", L("قبل الخروج", "Before leaving")),
        area("text", "الجملة", L("قطعة خفيفة لا تؤخر أول ساعة في اليوم.", "A light piece that does not slow the first hour of the day.")),
      ], [
        { when: L("الصباح", "Morning"), title: L("قبل الخروج", "Before leaving"), text: L("فنجان بعد التحميص بيومين، حين تهدأ الحبوب.", "A cup two days after roasting, once the beans have settled.") },
        { when: L("الظهر", "Noon"), title: L("بين مشوارين", "Between two errands"), text: L("جرعة قصيرة، من غير أدوات أكثر من المطحنة.", "A short cup, with nothing more than a grinder.") },
        { when: L("المساء", "Evening"), title: L("بعد العودة", "After coming home"), text: L("آخر فنجان، ثم يُغلق الكيس حتى الصباح.", "A last cup, then the bag is sealed until morning.") },
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
      text("title", "العنوان", L("من المقلاة إلى الكيس", "From the roaster to the bag")),
      text("subtitle", "وصف قصير", L("محمصة واحدة، وثلاث حقائق عن الدفعة.", "One roaster, and three facts about the batch.")),
      titleStyle("ticket"),
      text("place", "اسم المكان", L("محمصة صغيرة", "A small roastery")),
      image("image", "صورة المكان", "المقاس المقترح 1200×900 بكسل، صورة أفقية للمكان أو الخامة.", ROAST),
      text("image_alt", "وصف الصورة", L("حبوب تُحمّص داخل المقلاة", "Beans roasting in the drum")),
      collection("items", "حقيقة", [
        text("label", "العنوان", L("المصدر", "Source")),
        text("text", "التفصيل", L("من أين تأتي الخامة أو القطعة", "Where the material or the piece comes from")),
      ], [
        { label: L("المصدر", "Source"), text: L("حبوب تُحمّص على دفعات صغيرة", "Beans roasted in small batches") },
        { label: L("الدفعة", "Batch"), text: L("كيس ٢٥٠ غراماً من التحميص نفسه", "A 250 g bag from the same roast") },
        { label: L("الفحص", "Check"), text: L("يُراجع تاريخ التحميص قبل إغلاق الكيس", "The roast date is checked before the bag is sealed") },
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
      text("title", "العنوان", L("ثلاث عادات تحفظ الطعم", "Three habits that keep the taste")),
      text("subtitle", "وصف قصير", L("الكيس يُغلق، ويبتعد عن الحرارة، ويُطحن عند الفنجان.", "The bag is sealed, kept away from heat, and ground at the cup.")),
      titleStyle("hairline"),
      collection("items", "خطوة", [
        text("title", "الخطوة", L("انفض الغبار", "Shake off the dust")),
        area("text", "التفصيل", L("قبل أي غسيل، حتى تبقى الخامة في شكلها.", "Before any wash, so the material keeps its shape.")),
      ], [
        { title: L("أغلق الكيس", "Seal the bag"), text: L("بعد كل فنجان، حتى لا تخرج الرائحة.", "After every cup, so the aroma does not escape.") },
        { title: L("بعيداً عن الحرارة", "Away from heat"), text: L("رف عادي، لا بجانب الفرن ولا في الشمس.", "An ordinary shelf, not beside the oven or in the sun.") },
        { title: L("اطحن عند الاستخدام", "Grind when you brew"), text: L("الطحن المبكر يذهب بالطعم قبل الفنجان.", "Grinding early loses the taste before the cup.") },
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
      text("title", "العنوان", L("كلمة من المحمصة", "A word from the roastery")),
      text("subtitle", "وصف قصير", L("", "")),
      titleStyle("plain"),
      area("text", "نص الرسالة", L("نحمّص كمية نقدر نراجع تاريخها. إن وصل الكيس بغير التاريخ المكتوب عليه، نبدّله دون جدال طويل.", "We roast an amount whose date we can still check. If the bag arrives with a different date, we replace it without a long argument.")),
      text("signer", "التوقيع", L("فريق التحميص", "The roasting team")),
      text("role", "الصفة", L("المحمصة", "The roastery")),
      text("button_label", "نص الزر", L("اطلب الكيس", "Order the bag")),
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
      text("title", "العنوان", L("كلمات على كيس القهوة", "Words on the coffee bag")),
      text("subtitle", "وصف قصير", L("أربع بطاقات، لا جدول مواصفات.", "Four tickets, not a spec table.")),
      titleStyle("ticket"),
      collection("items", "بطاقة", [
        text("word", "الكلمة", L("واضح", "Clear")),
        text("note", "سطر صغير", L("المعلومة قبل الدفع", "The fact before payment")),
      ], [
        { word: L("محمّص", "Roasted"), note: L("التاريخ على الكيس", "The date is on the bag") },
        { word: L("طازج", "Fresh"), note: L("دفعة صغيرة لا مخزون طويل", "A small batch, not a long stock") },
        { word: L("مغلق", "Sealed"), note: L("صمام يحفظ الرائحة", "A valve keeps the aroma") },
        { word: L("قابل للاستبدال", "Exchangeable"), note: L("إن اختلف التاريخ المكتوب", "If the printed date differs") },
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
        text("alt", "وصف الصورة", L("المنتج في الاستخدام", "The product in use")),
        text("title", "العنوان", L("المنتج الذي يبيع نفسه من أول نظرة", "The product that explains itself at first glance")),
        area("text", "النص", L("اكتب جملة واحدة عن الفائدة، ثم ادعُ الزائر للطلب.", "Write one sentence about the benefit, then invite the visitor to order.")),
        text("button", "نص الزر", L("اطلب الآن", "Order now")),
        url("url", "رابط الزر", "", ctaHint),
      ], [
        { image: SERUM, alt: L("زجاجة سيروم على رخام أبيض", "A serum bottle on white marble"), title: L("سيروم صافٍ من أول نظرة", "A clear serum at first glance"), text: L("زجاجة زجاجية وقطارة بيضاء. السعر في القسم التالي.", "A glass bottle and a white dropper. The price is in the next section."), button: L("شاهد المنتج", "See the product"), url: "#rw-product" },
        { image: AMBER, alt: L("زجاجة داكنة على طبق خشب", "A dark bottle on a wooden dish"), title: L("الزجاج الداكن يحفظ الزيت", "Dark glass keeps the oil"), text: L("اللون يُرى داخل الزجاجة، والقطارة تقيس الكمية.", "The color shows inside the bottle, and the dropper measures the amount."), button: L("اطلب الآن", "Order now"), url: "" },
        { image: DROP, alt: L("قطرة تنزل من القطارة", "A drop falling from the dropper"), title: L("قطرة واحدة قبل الخروج", "One drop before leaving"), text: L("على بشرة نظيفة، ثم يُفرد. لا خطوات أكثر من ذلك.", "On clean skin, then spread. No more steps than that."), button: L("أضف للطلب", "Add to the order"), url: "" },
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
      text("title", "اسم المنتج إن لم يُختر منتج", L("سيروم صافٍ", "Clear serum"), { max: 120 }),
      area("text", "وصف قصير", L("زيت خفيف في زجاجة قطارة. عند اختيار منتج من المتجر يُستبدل الاسم والسعر والصور ببياناته.", "A light oil in a dropper bottle. Choosing a store product replaces the name, price, and photos with its own.")),
      text("price_text", "السعر عند المعاينة", L("١٨٩ ر.س", "SAR 189")),
      text("compare_text", "السعر قبل الخصم عند المعاينة", L("٢٤٠ ر.س", "SAR 240")),
      text("button_label", "نص زر الشراء", L("اشتر الآن", "Buy now")),
      url("button_url", "رابط الزر", "", ctaHint),
      collection("views", "زاوية", [
        image("image", "صورة الزاوية", "المقاس المقترح 1000×1000 بكسل. إن تُركت فارغة تُملأ من صور المنتج، ويبقى اسم الزاوية."),
        text("label", "اسم الزاوية", L("الأمام", "Front")),
        text("alt", "وصف الصورة", L("المنتج من الأمام", "The product from the front")),
      ], [
        { image: SERUM, label: L("الزجاجة", "Bottle"), alt: L("زجاجة السيروم على الرخام", "The serum bottle on marble") },
        { image: AMBER, label: L("اللون", "Color"), alt: L("الزجاجة الداكنة عن قرب", "The dark bottle up close") },
        { image: DROP, label: L("القطرة", "Drop"), alt: L("قطرة السيروم على اليد", "A drop of serum on the hand") },
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
      text("title", "العنوان", L("شاهد القطرة قبل أن تطلب", "Watch the drop before you order")),
      area("text", "النص", L("فيديو قصير لفتح الزجاجة ووضع السيروم. يبدأ عند الضغط، والصوت لا يفتح وحده.", "A short video of opening the bottle and applying the serum. It starts on tap, and the sound does not start on its own.")),
      image("poster", "صورة الغلاف", "المقاس المقترح 1600×900 بكسل، تظهر قبل التشغيل.", SERUM),
      url("video_url", "رابط الفيديو", SERUM_VIDEO, "رابط يوتيوب أو فيميو أو ملف mp4."),
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
    title: "ريلز التجارب",
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
        text("quote", "الرأي أو وصف التجربة", L("وصل كما في الصور، واستخدمته من اليوم الأول.", "It arrived as shown, and I used it the same day.")),
        drop("stars", "الدرجة من ٥", [["5", "٥", KEY.reelStar5], ["4", "٤", KEY.reelStar4], ["3", "٣", KEY.reelStar3]], "5"),
        text("link_label", "نص رابط المنتج", L("", "")),
        url("link_url", "رابط المنتج", "", "اتركه فارغاً إذا كانت التجربة عن منتج الصفحة."),
      ], [
        { video_url: REEL_DROPPER, poster: SERUM, name: L("نورة", "Noura"), place: L("الرياض", "Riyadh"), quote: L("القطرة واضحة، واستخدمت السيروم من أول صباح.", "The drop was clear, and I used the serum the first morning."), stars: picked("5", "٥", KEY.reelStar5), link_label: L("", ""), link_url: "" },
        { video_url: REEL_HANDS, poster: DROP, name: L("سلمان", "Salman"), place: L("جدة", "Jeddah"), quote: L("الكمية قليلة، والزيت ما ثقل على البشرة.", "The amount is small, and the oil did not feel heavy."), stars: picked("5", "٥", KEY.reelStar5), link_label: L("", ""), link_url: "" },
        { video_url: REEL_HARVEST, poster: ROAST, name: L("هند", "Hind"), place: L("الخبر", "Khobar"), quote: L("حبيت أشوف الحبوب قبل ما أطلب الكيس.", "I wanted to see the beans before I ordered the bag."), stars: picked("4", "٤", KEY.reelStar4), link_label: L("", ""), link_url: "" },
      ], 1, 8),
      text("button_label", "نص زر الشراء", L("اطلب الآن", "Order now")),
      url("button_url", "رابط الزر", "", ctaHint),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
  {
    title: "فوتر الصفحة",
    icon: "sicon-link",
    name: "page-foot",
    key: "b7e2c4a1-6f38-4d90-8b15-3a9c0e7d2f64",
    image: "",
    props: { "min-height": "160px" },
    fields: [
      image("logo", "شعار مخصص", "اتركه فارغاً ليظهر شعار المتجر."),
      image("logo_dark", "شعار للخلفية الداكنة", "يظهر في الوضع الداكن. بدونه يُستخدم الشعار الأساسي."),
      area("note", "سطر التعريف", L("التفاصيل والأسعار في هذه الصفحة، والطلب يُكمَل من المتجر.", "The details and prices are on this page, and the order is completed in the store.")),
      sw("show_store", "إظهار رابط المتجر", true, "يُضاف رابط المتجر إلى روابط الفوتر."),
      text("store_label", "نص رابط المتجر", L("المتجر", "Store")),
      collection("links", "رابط", [
        text("label", "النص", L("سياسة الاستبدال", "Exchange policy")),
        url("url", "الرابط", "", "اتركه فارغاً لإخفاء الرابط."),
      ], [
        { label: L("سياسة الاستبدال", "Exchange policy"), url: "" },
        { label: L("تواصل معنا", "Contact us"), url: "" },
      ], 0, 6),
      text("legal", "سطر نظامي", L("السجل التجاري يُكتب هنا إن لزم", "Add the commercial register here if needed")),
      color("bg_color", "لون الخلفية"),
      scheme(),
    ],
  },
];

const catalog = [
  "page-bar",
  "open-slider",
  "product-hero",
  "open-video",
  "review-reels",
  "promise-row",
  "detail-duo",
  "close-invite",
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
  "page-foot",
];
components.sort((a, b) => catalog.indexOf(a.name) - catalog.indexOf(b.name));

const templates = [
  {
    name: "wuduh",
    id: "846b8092-8d09-493a-a59e-4485260dd34c",
    is_default: true,
    primary_color: "#2457c5",
    order: [["page-bar", { sticky: true, show_mode_toggle: true }], "open-slider", "product-hero", "promise-row", "open-video", "detail-duo", "close-invite", "page-foot"],
  },
  {
    name: "zakham",
    id: "f4a1ec56-5f6a-4683-ab2d-9f25426104e6",
    is_default: false,
    primary_color: "#0f6e6a",
    order: [["page-bar", { sticky: true, transparent: true, show_shadow: false, default_mode: "dark" }], "dock-hero", "count-band", "reason-rail", "versus-board", "offer-panel", "situation-pick", "page-foot"],
  },
  {
    name: "saji",
    id: "9d14165d-429f-4cbc-9254-ae64d434d1d7",
    is_default: false,
    primary_color: "#1c3d36",
    order: ["page-bar", "origin-card", "receipt-note", "day-parts", "care-thread", "maker-letter", "shelf-tags", "page-foot"],
  },
];

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
