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
const image = (id, label, desc) => ({
  id, type: "string", format: "image", label, icon: "sicon-image", required: false, description: desc, value: "",
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
const scheme = (selected = "light") => drop(
  "color_scheme",
  "وضع الألوان",
  [["auto", "حسب الصفحة", KEY.schemeAuto], ["light", "فاتح", KEY.schemeLight], ["dark", "داكن", KEY.schemeDark]],
  selected,
  "الوضع التلقائي يتبع زر المزاج إن وُجد، وإلا يتبع جهاز الزائر",
);
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
const picked = (value, label, key) => [opt(value, label, key)];
const ctaHint = "في صفحة منتج يفتح الشراء السريع. في صفحة العروض يتبع رابط زر الصفحة، أو هذا الرابط إن وضعته.";

const components = [
  {
    title: "مقدمة مقسومة",
    icon: "sicon-format-text-alt",
    name: "split-intro",
    key: "b8c74ba0-a1c0-4d10-874e-25c41e0163af",
    image: "",
    props: { "min-height": "520px" },
    fields: [
      text("kicker", "سطر صغير فوق العنوان", L("تحميص أسبوعي", "Roasted every week")),
      text("title", "العنوان", L("قهوة تُروى بهدوء، من المحمصة إلى فنجانك", "Coffee told slowly, from the roaster to your cup"), { max: 120 }),
      area("text", "النص", L("نختار محاصيل صغيرة، نحمّصها على دفعات قصيرة، ونشحن الكيس بعد التحميص حتى تصل النكهة كما قُصد لها.", "We choose small crops, roast them in short batches, and ship the bag after roasting so the flavor arrives as intended.")),
      text("primary_label", "نص الزر الأساسي", L("اطلب الكيس", "Order the bag")),
      url("primary_url", "رابط الزر الأساسي", "", ctaHint),
      text("secondary_label", "نص الزر الثاني", L("اقرأ الفصول", "Read the chapters")),
      url("secondary_url", "رابط الزر الثاني", "#rw-chapters", "رابط حر داخل الصفحة أو خارجها. اتركه فارغاً لإخفاء الزر."),
      line("si-line"),
      image("image", "صورة الجانب", "المقاس المقترح 900×1200 بكسل، صورة طولية للمنتج أو الطقس المحيط به."),
      text("image_alt", "وصف الصورة", L("كيس قهوة على طاولة خشبية", "A coffee bag on a wooden table")),
      drop("media_side", "مكان الصورة", [["start", "بجانب بداية النص", KEY.sideStart], ["end", "بجانب نهاية النص", KEY.sideEnd]], "end"),
      sw("show_tone", "زر التبديل بين الفاتح والداكن", true, "يبدل الأقسام المضبوطة على حسب الصفحة ويتذكر اختيار الزائر"),
      color("bg_color", "لون الخلفية"),
      scheme("light"),
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
        text("title", "الوعد", L("تحميص صغير", "Small roast")),
        text("note", "سطر توضيحي", L("دفعات محدودة كل أسبوع", "Limited batches each week")),
      ], [
        { icon: "sicon-time", title: L("تحميص صغير", "Small roast"), note: L("دفعات محدودة كل أسبوع", "Limited batches each week") },
        { icon: "sicon-shipping-fast", title: L("شحن بعد التحميص", "Ships after roasting"), note: L("يغادر الكيس خلال يومين", "The bag leaves within two days") },
        { icon: "sicon-star2", title: L("طحن حسب أداتك", "Ground for your tool"), note: L("اختر الطحنة مع الطلب", "Choose the grind with the order") },
        { icon: "sicon-rotate", title: L("استبدال واضح", "A clear replacement"), note: L("إن وصل الكيس بحالة غير سليمة", "If the bag arrives damaged") },
      ], 1, 4),
      color("bg_color", "لون الخلفية"),
      scheme("light"),
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
      text("kicker", "سطر صغير", L("أربعة فصول", "Four chapters")),
      text("title", "العنوان", L("من الكيس إلى الفنجان", "From the bag to the cup")),
      text("subtitle", "وصف قصير", L("طريق قصير، بلا مفاجآت بعد الدفع.", "A short path, with no surprises after checkout.")),
      collection("items", "فصل", [
        text("title", "عنوان الفصل", L("اختر المحصول", "Choose the crop")),
        area("text", "الشرح", L("ثلاثة محاصيل في القائمة، وكل واحد بسطر يصف مذاقه.", "Three crops on the list, each with a line that describes its taste.")),
      ], [
        { title: L("اختر المحصول", "Choose the crop"), text: L("ثلاثة محاصيل في القائمة، وكل واحد بسطر يصف مذاقه.", "Three crops on the list, each with a line about its taste.") },
        { title: L("حدد الطحنة", "Set the grind"), text: L("حب أو طحن يناسب أداة التحضير التي تستخدمها.", "Whole bean, or a grind that matches the brewer you use.") },
        { title: L("يُحمّص طلبك", "Your order is roasted"), text: L("لا نحمّص الكمية قبل أن تطلبها.", "We do not roast the batch before you order it.") },
        { title: L("يصل طازجاً", "It arrives fresh"), text: L("تاريخ التحميص مكتوب على الكيس.", "The roast date is written on the bag.") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme("light"),
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
      text("kicker", "سطر صغير", L("من وصلهم الكيس", "From people who received the bag")),
      text("title", "العنوان", L("جمل قصيرة، بلا مبالغة", "Short lines, without exaggeration")),
      text("subtitle", "وصف قصير", L("", "")),
      collection("items", "صوت", [
        text("quote", "الجملة", L("النكهة وصلت هادئة، والفنجان الثاني أوضح من الأول.", "The flavor arrived calm, and the second cup was clearer than the first.")),
        text("name", "الاسم", L("نورة", "Noura")),
        text("place", "المدينة", L("الرياض", "Riyadh")),
        drop("stars", "الدرجة من ٥", [["5", "٥", KEY.stars5], ["4", "٤", KEY.stars4], ["3", "٣", KEY.stars3]], "5"),
      ], [
        { quote: L("النكهة وصلت هادئة، والفنجان الثاني أوضح من الأول.", "The flavor arrived calm, and the second cup was clearer than the first."), name: L("نورة", "Noura"), place: L("الرياض", "Riyadh"), stars: picked("5", "٥", KEY.stars5) },
        { quote: L("اخترت طحن الإسبريسو، وجاء مطابقاً لما كتبتُه في الطلب.", "I chose an espresso grind, and it matched what I wrote in the order."), name: L("سلمان", "Salman"), place: L("جدة", "Jeddah"), stars: picked("5", "٥", KEY.stars5) },
        { quote: L("تاريخ التحميص كان قبل يومين من الوصول. هذا ما أبحث عنه.", "The roast date was two days before it arrived. That is what I look for."), name: L("هند", "Hind"), place: L("الخبر", "Khobar"), stars: picked("4", "٤", KEY.stars4) },
        { quote: L("الكيس مناسب للتجربة قبل الاشتراك. بدأت بكيس واحد.", "The bag is a good trial before a subscription. I started with one."), name: L("فيصل", "Faisal"), place: L("أبها", "Abha"), stars: picked("5", "٥", KEY.stars5) },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme("light"),
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
      text("title", "العنوان", L("المحصول والطحنة", "The crop and the grind")),
      text("subtitle", "وصف قصير", L("صورتان تكفيان لشرح ما لا يشرحه السطر.", "Two photos are enough to explain what a line cannot.")),
      line("dd-a"),
      image("image_a", "الصورة الأولى", "المقاس المقترح 1200×1500 بكسل."),
      text("alt_a", "وصف الصورة الأولى", L("حبّات القهوة قبل الطحن", "Coffee beans before grinding")),
      text("title_a", "عنوان اللقطة الأولى", L("المحصول", "The crop")),
      area("text_a", "نص اللقطة الأولى", L("محصول مرتفع، حموضة واضحة، وحلاوة تقترب من الفاكهة المجففة.", "A high-grown crop, clear acidity, and a sweetness close to dried fruit.")),
      line("dd-b"),
      image("image_b", "الصورة الثانية", "المقاس المقترح 1000×1300 بكسل."),
      text("alt_b", "وصف الصورة الثانية", L("طحنة تناسب التحضير المنزلي", "A grind suited to home brewing")),
      text("title_b", "عنوان اللقطة الثانية", L("الطحنة", "The grind")),
      area("text_b", "نص اللقطة الثانية", L("نكتب اسم الأداة على الكيس حتى لا تخمّن عند التحضير.", "We write the brewer's name on the bag so you are not guessing at brew time.")),
      color("bg_color", "لون الخلفية"),
      scheme("light"),
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
      text("kicker", "سطر صغير", L("كيس واحد يكفي للبداية", "One bag is enough to start")),
      text("title", "العنوان", L("جرّبه لأسبوع الصباح", "Try it for a week of mornings")),
      area("text", "النص", L("إن ناسب طقوسك أعد الطلب. وإن لم يناسبك، لن نطلب منك اشتراكاً مسبقاً.", "If it suits your ritual, order again. If it does not, we will not ask you for a subscription first.")),
      text("button_label", "نص الزر", L("اطلب الآن", "Order now")),
      url("button_url", "رابط الزر", "", ctaHint),
      text("note", "سطر تحت الزر", L("التحميص يبدأ بعد تأكيد الطلب", "Roasting starts after the order is confirmed")),
      color("bg_color", "لون الخلفية"),
      scheme("light"),
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
      text("kicker", "سطر صغير", L("للعمل العميق", "For deep work")),
      text("title", "العنوان", L("ركّز ساعتين. العالم ينتظر.", "Focus for two hours. The world can wait.")),
      area("text", "النص", L("عزل هادئ، ووزن لا يُشعر به بعد الدقيقة العاشرة.", "Quiet isolation, and a weight you stop noticing after the tenth minute.")),
      text("button_label", "نص الزر", L("اطلب السماعة", "Order the headset")),
      url("button_url", "رابط الزر", "", ctaHint),
      image("image", "صورة الخلفية", "المقاس المقترح 1920×1080 بكسل. إن تركتها فارغة تظهر خلفية لونية."),
      text("image_alt", "وصف الصورة", L("سماعة عمل على مكتب", "A work headset on a desk")),
      line("dh-1"),
      text("fact_1_value", "الرقم الأول", L("١٨ ساعة", "18 hours")),
      text("fact_1_label", "تسمية الرقم الأول", L("بطارية", "Battery")),
      text("fact_2_value", "الرقم الثاني", L("٢٤٠ غ", "240 g")),
      text("fact_2_label", "تسمية الرقم الثاني", L("الوزن", "Weight")),
      text("fact_3_value", "الرقم الثالث", L("سنة", "1 year")),
      text("fact_3_label", "تسمية الرقم الثالث", L("ضمان", "Warranty")),
      sw("show_tone", "زر التبديل بين الفاتح والداكن", true, "يبدل بقية أقسام الصفحة المضبوطة على حسب الصفحة"),
      color("bg_color", "لون الخلفية"),
      scheme("dark"),
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
      collection("items", "رقم", [
        text("value", "الرقم", L("+١٢ ألف", "+12k")),
        text("label", "العنوان", L("طلب", "Orders")),
        text("hint", "سطر صغير", L("منذ إطلاق السماعة", "Since the headset launched")),
      ], [
        { value: L("+١٢ ألف", "+12k"), label: L("طلب", "Orders"), hint: L("منذ إطلاق السماعة", "Since the headset launched") },
        { value: L("٤.٨", "4.8"), label: L("تقييم المتجر", "Store rating"), hint: L("على الطلبات المكتملة", "On completed orders") },
        { value: L("٤٨ س", "48 h"), label: L("تجهيز", "Dispatch"), hint: L("للطلبات داخل المدينة", "For in-city orders") },
      ], 1, 3),
      color("bg_color", "لون الخلفية"),
      scheme("dark"),
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
        text("title", "السبب", L("عزل بلا ضغط", "Isolation without pressure")),
        area("text", "الشرح", L("الوسادة تحيط بالأذن دون أن تضغط على الذراع.", "The cushion surrounds the ear without pressing the arm.")),
      ], [
        { icon: "sicon-shield-check", title: L("عزل بلا ضغط", "Isolation without pressure"), text: L("الوسادة تحيط بالأذن دون أن تضغط على الذراع.", "The cushion surrounds the ear without pressing the arm.") },
        { icon: "sicon-time", title: L("يوم عمل كامل", "A full workday"), text: L("البطارية تغطي اجتماعات اليوم دون شحن منتصف الظهر.", "The battery covers the day's meetings without a midday charge.") },
        { icon: "sicon-star2", title: L("صوت الاجتماع واضح", "A clear meeting voice"), text: L("الميكروفون يقترب من الفم، لا من ضجيج الغرفة.", "The microphone sits near the mouth, not the room noise.") },
        { icon: "sicon-box", title: L("طيّ داخل الحقيبة", "Folds into a bag"), text: L("المفصل يطوي الكأسين إلى داخل الطوق.", "The hinge folds both cups into the band.") },
        { icon: "sicon-rotate", title: L("قماش قابل للتبديل", "A pad you can swap"), text: L("الوسادة تُفك بزر واحد حين تبلى.", "The pad comes off with one snap when it wears out.") },
        { icon: "sicon-gift", title: L("صندوق مرتب", "A tidy box"), text: L("السماعة، الكيس، وسلك قصير. لا ورق زائد.", "Headset, pouch, and a short cable. No extra paper.") },
      ], 1, 8),
      color("bg_color", "لون الخلفية"),
      scheme("dark"),
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
      text("title", "العنوان", L("يوم العمل نفسه، بضوضاء أقل", "The same workday, with less noise")),
      text("subtitle", "وصف قصير", L("", "")),
      text("col_off", "عنوان العمود الأول", L("بدونها", "Without it")),
      text("col_on", "عنوان العمود الثاني", L("معها", "With it")),
      collection("items", "صف", [
        text("off", "بدونها", L("صوت المقهى يدخل الاجتماع", "Cafe noise joins the meeting")),
        text("on", "معها", L("صوتك يبقى في المقدمة", "Your voice stays in front")),
      ], [
        { off: L("صوت المقهى يدخل الاجتماع", "Cafe noise joins the meeting"), on: L("صوتك يبقى في المقدمة", "Your voice stays in front") },
        { off: L("تعيد الشحن قبل العصر", "You recharge before the afternoon"), on: L("اليوم ينتهي وفيها شحن", "The day ends with charge left") },
        { off: L("السماعة تضغط بعد ساعة", "The headset presses after an hour"), on: L("الذراع يبقى خفيفاً", "The arm stays light") },
        { off: L("الكيس منفصل وتبحث عنه", "The pouch is separate and you hunt for it"), on: L("تُطوى وتدخل الكيس نفسه", "It folds into its own pouch") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme("dark"),
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
      text("title", "العنوان", L("صندوق واحد، ثلاث قطع", "One box, three pieces")),
      text("price_note", "سطر السعر أو الملاحظة", L("السعر يظهر من منتج الصفحة", "The price comes from the page product")),
      collection("items", "سطر", [
        text("text", "النص", L("السماعة مع وسادتين", "The headset with two pads")),
      ], [
        { text: L("السماعة مع وسادتين", "The headset with two pads") },
        { text: L("كيس قماشي للطي", "A cloth pouch for folding") },
        { text: L("سلك شحن قصير", "A short charging cable") },
        { text: L("بطاقة الضمان لسنة", "A one-year warranty card") },
      ], 1, 8),
      text("aside_title", "عنوان الجانب", L("ابدأ بالقطعة لا بالاشتراك", "Start with the piece, not a subscription")),
      area("aside_text", "نص الجانب", L("الزر يفتح شراء الصفحة. إن كانت الصفحة عرضاً، يتبع رابط الزر الرئيسي.", "The button opens this page's checkout. On a promotion page it follows the main button link.")),
      text("button_label", "نص الزر", L("أضفها للطلب", "Add it to the order")),
      url("button_url", "رابط الزر", "", ctaHint),
      color("bg_color", "لون الخلفية"),
      scheme("dark"),
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
      text("button_label", "نص الزر الاحتياطي", L("اطلبها الآن", "Order it now")),
      url("button_url", "رابط الزر", "", ctaHint),
      collection("items", "موقف", [
        text("label", "الموقف", L("أعمل من البيت", "I work from home")),
        area("message", "الرسالة", L("إن كانت الغرفة قريبة من المطبخ، العزل أهم من شكل السماعة.", "If the room is near the kitchen, isolation matters more than how the headset looks.")),
        text("button", "نص الزر", L("اطلبها للبيت", "Order it for home")),
      ], [
        { label: L("أعمل من البيت", "I work from home"), message: L("إن كانت الغرفة قريبة من المطبخ، العزل أهم من شكل السماعة.", "If the room is near the kitchen, isolation matters more than how the headset looks."), button: L("اطلبها للبيت", "Order it for home") },
        { label: L("أسافر بالسماعة", "I travel with it"), message: L("الطي داخل الكيس يغني عن علبة صلبة في الحقيبة الصغيرة.", "Folding into the pouch replaces a hard case in a small bag."), button: L("اطلبها للسفر", "Order it for travel") },
        { label: L("أذاكر ساعات", "I study for hours"), message: L("الوزن الخفيف هو الفرق بين ساعة تركيز وساعة تعدّل فيها السماعة.", "The light weight is the difference between an hour of focus and an hour of adjusting it."), button: L("اطلبها للمذاكرة", "Order it for study") },
      ], 1, 6),
      color("bg_color", "لون الخلفية"),
      scheme("dark"),
    ],
  },
];

const templates = [
  {
    name: "wuduh",
    id: "846b8092-8d09-493a-a59e-4485260dd34c",
    is_default: true,
    primary_color: "#8a5a32",
    order: ["split-intro", "promise-row", "chapter-path", "voice-stack", "detail-duo", "close-invite"],
  },
  {
    name: "zakham",
    id: "f4a1ec56-5f6a-4683-ab2d-9f25426104e6",
    is_default: false,
    primary_color: "#0f6e6a",
    order: ["dock-hero", "count-band", "reason-rail", "versus-board", "offer-panel", "situation-pick"],
  },
];

const bundlePath = new URL("../twilight-bundle.json", import.meta.url);
let previous = { templates: [] };
if (fs.existsSync(bundlePath)) previous = JSON.parse(fs.readFileSync(bundlePath, "utf8"));
const previousTemplates = new Map((previous.templates || []).map((item) => [item.path, item]));

const bundle = {
  name: { ar: "عتبة", en: "Ataba" },
  description: {
    ar: "صفحتا هبوط بعناصر مختلفة: وضوح هادئة للقهوة، وزخم للتحويل على منتج تقني.",
    en: "Two landing pages with different sections: a calm coffee page, and a conversion page for a tech product.",
  },
  author_email: "sajispprt@gmail.com",
  support_url: "https://github.com/Ashaheen892/tw-ataba",
  repository: "https://github.com/Ashaheen892/tw-ataba",
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
for (const template of templates) {
  const list = template.order.map((name) => structuredClone(byName.get(name)));
  fs.writeFileSync(new URL(`../templates/${template.name}.json`, import.meta.url), `${JSON.stringify({ id: template.id, components: list }, null, 2)}\n`);
}
fs.writeFileSync(new URL("../public/twilight-bundle.json", import.meta.url), `${JSON.stringify(bundle, null, 4)}\n`);
console.log("pages:", templates.map((template) => `${template.name}(${template.order.length})`).join(", "));
console.log("sections:", components.map((component) => component.name).join(", "));
