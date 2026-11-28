/* A Dose of Awareness: rumours and facts, manipulation tricks, and game content. Arabic and English. */
window.DW = window.DW || {};

/* Common tricks used in vaccine misinformation */
DW.tricks = {
  falsecause: { name: { ar: "ربط خاطئ بين حدثين", en: "False cause" }, desc: { ar: "حدثٌ وقع بعد المطعوم، فيُفترض أن المطعوم سببه.", en: "Something happened after the vaccine, so the vaccine is assumed to be the cause." } },
  fakeexpert: { name: { ar: "خبير في غير اختصاصه", en: "Fake expert" }, desc: { ar: "لقب لامع لشخص لا علاقة لتخصصه بالمناعة أو الأوبئة.", en: "An impressive title on someone whose field has nothing to do with immunity or epidemics." } },
  cherry: { name: { ar: "انتقاء رقم دون سياقه", en: "Cherry-picking" }, desc: { ar: "رقم صحيح يُعزل عن بقية الصورة ليوحي بعكسها.", en: "A true number isolated from the rest of the picture to suggest the opposite." } },
  conspiracy: { name: { ar: "نظرية مؤامرة", en: "Conspiracy theory" }, desc: { ar: "اتهام بلا دليل لجهة خفية، وكل نفي يصبح «دليلاً» جديداً.", en: "An accusation without evidence against a hidden actor, where every denial becomes new 'proof'." } },
  impossible: { name: { ar: "توقع المستحيل", en: "Impossible expectations" }, desc: { ar: "رفض كل ما لا يحمي 100% أو لا يخلو من أي أثر جانبي.", en: "Rejecting anything that is not 100% protective or free of any side effect." } },
  natural: { name: { ar: "الطبيعي أفضل دائماً", en: "Appeal to nature" }, desc: { ar: "افتراض أن كل طبيعي آمن وكل مصنَّع خطر.", en: "Assuming everything natural is safe and everything manufactured is dangerous." } }
};

/* Rumours and their corrections. v = vaccine id or "all". */
DW.myths = [
  { v: "flu", t: "falsecause", s: "who-flu-pp",
    claim: { ar: "مطعوم الإنفلونزا يسبب الإنفلونزا.", en: "The flu vaccine gives you flu." },
    fact: { ar: "الحقنة تحتوي على فيروسات معطَّلة لا تستطيع إحداث العدوى. ألم الذراع أو الحرارة الخفيفة ليوم أو يومين علامة على استجابة جهازك المناعي، ونزلات البرد الشتوية قد تصادف موعد الجرعة.", en: "The injection contains inactivated viruses that cannot cause infection. A sore arm or a mild fever for a day or two is a sign that your immune system is responding, and winter colds can coincide with the dose." } },
  { v: "flu", s: "who-flu-pp",
    claim: { ar: "أنا بصحة جيدة ولا أحتاج المطعوم.", en: "I am healthy, so I do not need it." },
    fact: { ar: "الأصحاء يصابون وينقلون العدوى إلى رضيع أو جدّة أو مريض سكري في البيت. المطعوم يحميك ويحمي من حولك، والأولوية لأصحاب الأمراض المزمنة والحوامل وكبار السن.", en: "Healthy people catch flu and pass it to a baby, a grandmother or someone with diabetes at home. The vaccine protects you and the people around you, with priority for people with chronic conditions, pregnant women and older adults." } },
  { v: "flu", s: "who-flu-pp",
    claim: { ar: "أخذته العام الماضي، فلا حاجة لتكراره.", en: "I had it last year, so I do not need it again." },
    fact: { ar: "فيروسات الإنفلونزا تتغير، وتركيبة المطعوم تُحدَّث كل موسم بتوصية من منظمة الصحة العالمية، والحماية تتراجع خلال أشهر. جرعة جديدة كل عام.", en: "Flu viruses change, the vaccine formula is updated each season on WHO advice, and protection fades within months. A new dose every year." } },
  { v: "flu", s: "who-flu-pp",
    claim: { ar: "المطعوم خطر على الحامل.", en: "The vaccine is dangerous in pregnancy." },
    fact: { ar: "منظمة الصحة العالمية تضع الحوامل ضمن الفئات ذات الأولوية في أي مرحلة من الحمل. المطعوم يحمي الأم من مضاعفات الإنفلونزا، وتنتقل أجسامه المضادة إلى المولود فتحميه في أشهره الأولى.", en: "WHO lists pregnant women among the priority groups at any stage of pregnancy. The vaccine protects the mother from flu complications, and her antibodies pass to the baby and protect it in the first months." } },

  { v: "hpv", s: "who-hpv-pp",
    claim: { ar: "مطعوم HPV للمتزوجات فقط.", en: "The HPV vaccine is only for married women." },
    fact: { ar: "العكس صحيح. المطعوم يمنع العدوى ولا يعالجها، فتكون فائدته الأكبر قبل أي تعرّض للفيروس. لهذا توصي منظمة الصحة العالمية به للفتيات من 9 إلى 14 عاماً.", en: "The opposite is true. The vaccine prevents infection and does not treat it, so it helps most before any exposure to the virus. That is why WHO recommends it for girls aged 9 to 14." } },
  { v: "hpv", t: "falsecause", s: "who-hpv-pp",
    claim: { ar: "المطعوم يسبب العقم.", en: "The vaccine causes infertility." },
    fact: { ar: "لا دليل على ذلك في مراجعات المأمونية بعد مئات ملايين الجرعات. ما يهدد الخصوبة فعلاً هو سرطان عنق الرحم وعلاج آفاته، وهذا ما يمنعه المطعوم.", en: "Safety reviews after hundreds of millions of doses show no such effect. What does threaten fertility is cervical cancer and the treatment of its early lesions, which is what the vaccine prevents." } },
  { v: "hpv", t: "cherry", s: "ico-jo-23",
    claim: { ar: "سرطان عنق الرحم نادر عندنا، فلا داعي للمطعوم.", en: "Cervical cancer is rare here, so the vaccine is unnecessary." },
    fact: { ar: "هو أقل شيوعاً في الأردن منه في دول كثيرة، لكن نحو 115 امرأة تُشخَّص به كل عام ويُتوفى نحو 71. ولا يوجد برنامج وطني للكشف المبكر. الوقاية ممكنة بجرعة أو جرعتين.", en: "It is less common in Jordan than in many countries, yet about 115 women are diagnosed every year and about 71 die. There is no national screening programme. Prevention takes one or two doses." } },
  { v: "hpv", s: "who-hpv-pp",
    claim: { ar: "تطعيم الفتيات يغيّر سلوكهن.", en: "Vaccinating girls changes their behaviour." },
    fact: { ar: "الدراسات التي تابعت فتيات تطعّمن لم تجد أي تغيير في سلوكهن. المطعوم وقاية من السرطان، مثلما يقي مطعوم التهاب الكبد (ب) من سرطان الكبد.", en: "Studies that followed vaccinated girls found no change in their behaviour. The vaccine is cancer prevention, just as the hepatitis B vaccine prevents liver cancer." } },

  { v: "measles", t: "fakeexpert", s: "hviid-19",
    claim: { ar: "المطعوم الثلاثي يسبب التوحد.", en: "The MMR vaccine causes autism." },
    fact: { ar: "دراسة دنماركية تابعت 657,461 طفلاً لم تجد أي زيادة في التوحد بين المطعَّمين. الورقة التي أطلقت الادعاء عام 1998 سُحبت بعد ثبوت التلاعب في بياناتها، وشُطب صاحبها من سجل الأطباء.", en: "A Danish study that followed 657,461 children found no increase in autism among the vaccinated. The 1998 paper that launched the claim was retracted after its data were shown to be manipulated, and its author was struck off the medical register." } },
  { v: "measles", t: "natural", s: "cdc-measles",
    claim: { ar: "الحصبة مرض بسيط، والإصابة به أفضل من المطعوم.", en: "Measles is mild, and catching it is better than the vaccine." },
    fact: { ar: "طفل من كل 20 مصاباً يصاب بالتهاب رئوي، وواحد من كل ألف بالتهاب في الدماغ. المطعوم يمنح المناعة دون هذا الثمن.", en: "One child in 20 with measles develops pneumonia, and one in 1,000 develops brain inflammation. The vaccine gives immunity without that price." } },
  { v: "measles", t: "conspiracy", s: "unicef-jo-23",
    claim: { ar: "مطعوم الحملة الوطنية غير موثوق بسبب بلد تصنيعه.", en: "The national campaign vaccine cannot be trusted because of where it was made." },
    fact: { ar: "بلد التصنيع لا يحدد الجودة، بل الاعتماد والرقابة. أكدت منظمة الصحة العالمية واليونيسف مأمونية المطعوم، واشترت اليونيسف أكثر من 436 مليون جرعة من مطعوم الحصبة والحصبة الألمانية لـ57 دولة منذ 2021.", en: "Quality depends on approval and oversight, not on the country of manufacture. WHO and UNICEF confirmed the vaccine is safe, and UNICEF has procured more than 436 million doses of measles-rubella vaccine for 57 countries since 2021." } },
  { v: "measles", s: "cdc-measles",
    claim: { ar: "طفلي أخذ جرعة واحدة وهذا يكفي.", en: "My child had one dose and that is enough." },
    fact: { ar: "جرعة واحدة تحمي نحو 93% من الأطفال، والثانية ترفع الحماية إلى نحو 97%. ولا تتوقف الفاشيات إلا إذا تلقى 95% من الأطفال الجرعتين.", en: "One dose protects about 93% of children, and the second raises protection to about 97%. Outbreaks stop only when 95% of children receive both doses." } },

  { v: "hepb", s: "who-hepb-fs",
    claim: { ar: "لا أعراض عندي، إذن كبدي سليم.", en: "I have no symptoms, so my liver is fine." },
    fact: { ar: "التهاب الكبد (ب) المزمن قد يبقى صامتاً سنوات طويلة، وأغلب المصابين به في العالم لا يعرفون. فحص دم بسيط يحسم الأمر.", en: "Chronic hepatitis B can stay silent for many years, and most people living with it worldwide do not know. A simple blood test settles it." } },
  { v: "hepb", s: "who-hepb-fs",
    claim: { ar: "هذا مرض يخص فئات معينة فقط.", en: "This disease only concerns certain groups." },
    fact: { ar: "الفيروس ينتقل بالدم: أدوات حلاقة أو حجامة أو وشم أو علاج أسنان غير معقّمة، ومن الأم إلى مولودها. كل شخص غير محصَّن معرّض.", en: "The virus travels in blood: unsterile razors, cupping, tattoo or dental instruments, and from mother to newborn. Anyone who is not immune is at risk." } },
  { v: "hepb", s: "who-hepb-fs",
    claim: { ar: "مطعوم الطفولة يحتاج جرعة منشطة كل بضع سنوات.", en: "The childhood vaccine needs a booster every few years." },
    fact: { ar: "من أكمل الجرعات الثلاث يبقى محمياً 20 عاماً على الأقل، وربما مدى الحياة. منظمة الصحة العالمية لا توصي بجرعات منشطة للأصحاء.", en: "People who completed three doses stay protected for at least 20 years and probably for life. WHO does not recommend boosters for healthy people." } },
  { v: "hepb", s: "cdc-adult",
    claim: { ar: "فاتني الموعد، كبرتُ على المطعوم.", en: "I missed my chance, I am too old for it." },
    fact: { ar: "المطعوم فعّال في أي عمر. توصي CDC به لكل البالغين من 19 إلى 59 عاماً، ولمن هم أكبر إذا وُجد عامل خطر. ثلاث جرعات خلال 6 أشهر.", en: "The vaccine works at any age. The CDC recommends it for all adults aged 19 to 59, and for older adults with a risk factor. Three doses over six months." } },

  { v: "pneumo", s: "moh-pcv-25",
    claim: { ar: "المطاعيم الكثيرة ترهق مناعة الرضيع.", en: "Too many vaccines overload a baby's immunity." },
    fact: { ar: "جهاز الرضيع المناعي يواجه يومياً آلاف الجراثيم في الهواء والطعام. مكونات المطاعيم كلها جزء ضئيل من ذلك، والجدول مصمَّم ليُعطى أكثر من مطعوم في الزيارة الواحدة.", en: "A baby's immune system meets thousands of germs in air and food every day. All the vaccine components together are a tiny fraction of that, and the schedule is designed for more than one vaccine per visit." } },
  { v: "pneumo", s: "cdc-adult",
    claim: { ar: "مطعوم الإنفلونزا يغني عن مطعوم المكورات الرئوية.", en: "The flu vaccine replaces the pneumococcal vaccine." },
    fact: { ar: "الأول ضد فيروس والثاني ضد بكتيريا. كبار السن وأصحاب الأمراض المزمنة يحتاجون الاثنين، ويمكن أخذهما في زيارة واحدة.", en: "One works against a virus, the other against a bacterium. Older adults and people with chronic conditions need both, and they can be given at one visit." } },
  { v: "pneumo", s: "unicef-pneu",
    claim: { ar: "الالتهاب الرئوي يُعالج بالمضادات الحيوية فلا حاجة للوقاية.", en: "Pneumonia is treated with antibiotics, so prevention is unnecessary." },
    fact: { ar: "الالتهاب الرئوي ما زال أول سبب معدٍ لوفيات الأطفال دون الخامسة في العالم، ومقاومة البكتيريا للمضادات الحيوية في ازدياد. الوقاية أسلم من العلاج.", en: "Pneumonia is still the leading infectious cause of death in children under five worldwide, and bacterial resistance to antibiotics is growing. Prevention is safer than treatment." } },
  { v: "pneumo", s: "cdc-adult",
    claim: { ar: "هو مطعوم للأطفال فقط.", en: "It is a vaccine for children only." },
    fact: { ar: "خطر المرض يرتفع مجدداً بعد الخمسين، ومع السكري وأمراض القلب والرئة والتدخين. جرعة واحدة تكفي أغلب البالغين. اسأل طبيبك.", en: "The risk rises again after fifty, and with diabetes, heart and lung disease and smoking. One dose is enough for most adults. Ask your doctor." } },

  { v: "mening", s: "ksa-1447",
    claim: { ar: "أخذت مطعوم الحج مرة واحدة ويكفيني العمر كله.", en: "I had the Hajj vaccine once and it covers me for life." },
    fact: { ar: "الحماية تتراجع مع السنوات. الاشتراطات السعودية تقبل المطعوم المقترن إذا أُخذ خلال آخر 5 سنوات. تحقق من تاريخ شهادتك قبل كل رحلة.", en: "Protection fades over the years. Saudi requirements accept the conjugate vaccine if it was given within the last 5 years. Check the date on your certificate before every trip." } },
  { v: "mening", s: "ksa-1447",
    claim: { ar: "آخذه في المطار أو ليلة السفر.", en: "I will have it at the airport or the night before." },
    fact: { ar: "يحتاج الجسم نحو 10 أيام لبناء الحماية، وهي المدة التي تشترطها السعودية قبل الوصول. من يتأخر يسافر بلا حماية وقد يواجه مشكلة في إجراءات الدخول.", en: "The body needs about 10 days to build protection, which is the period Saudi Arabia requires before arrival. Anyone who leaves it late travels unprotected and may face problems at entry." } },
  { v: "mening", s: "who-don-25",
    claim: { ar: "العمرة قصيرة وليست كالحج، فلا يلزمها مطعوم.", en: "Umrah is short and unlike Hajj, so no vaccine is needed." },
    fact: { ar: "الاشتراط يشمل المعتمرين أيضاً. في 2025 سُجّلت إصابات مرتبطة بالعمرة، ولم يلتزم بالمطعوم سوى 54% من المعتمرين الدوليين.", en: "The requirement covers Umrah pilgrims too. In 2025 cases linked to Umrah were reported, and only 54% of international Umrah pilgrims had complied." } },
  { v: "mening", s: "who-mening-fs",
    claim: { ar: "أنا شاب وبصحة جيدة، والسحايا تصيب الضعفاء.", en: "I am young and healthy, and meningitis strikes the weak." },
    fact: { ar: "المكورات السحائية تصيب الأصحاء أيضاً وتتطور في ساعات. ومن يعود حاملاً للبكتيريا قد ينقلها إلى أطفاله ووالديه.", en: "Meningococcal disease also strikes healthy people and develops within hours. Someone who returns carrying the bacteria can pass them to children and parents." } },

  { v: "all", t: "natural", s: "who-hepb-fs",
    claim: { ar: "المناعة الطبيعية أفضل من مناعة المطاعيم.", en: "Natural immunity is better than vaccine immunity." },
    fact: { ar: "المناعة بعد المرض لها ثمن: الحصبة قد تسبب التهاب الدماغ، والتهاب الكبد (ب) قد ينتهي بسرطان. المطعوم يدرّب المناعة دون المرور بالمرض.", en: "Immunity after illness has a price: measles can inflame the brain, and hepatitis B can end in cancer. A vaccine trains immunity without the disease." } },
  { v: "all", t: "conspiracy", s: "who-hpv-pp",
    claim: { ar: "شركات الأدوية تخفي أضرار المطاعيم.", en: "Drug companies hide the harms of vaccines." },
    fact: { ar: "المطاعيم تخضع لرقابة مستقلة بعد طرحها: أنظمة تبليغ وطنية ولجنة مأمونية عالمية في منظمة الصحة العالمية تنشر مراجعاتها علناً.", en: "Vaccines are monitored independently after release: national reporting systems and a global safety committee at WHO that publishes its reviews openly." } },
  { v: "all", t: "impossible", s: "cdc-measles",
    claim: { ar: "ما دام المطعوم لا يحمي 100% فلا فائدة منه.", en: "If a vaccine is not 100% protective, it is useless." },
    fact: { ar: "حزام الأمان لا يمنع كل الإصابات ونستخدمه مع ذلك. جرعتان من مطعوم الحصبة تحميان 97 من كل 100، والبقية يحميهم ارتفاع نسبة المطعَّمين من حولهم.", en: "A seat belt does not prevent every injury and we still wear it. Two doses of measles vaccine protect 97 in 100, and the rest are shielded when enough people around them are vaccinated." } },
  { v: "all", s: "who-measles-25",
    claim: { ar: "هذه الأمراض اختفت، فلماذا نطعّم؟", en: "These diseases have disappeared, so why vaccinate?" },
    fact: { ar: "اختفت لأننا نطعّم. حين تراجعت التغطية عادت الحصبة: 163 إصابة في الأردن عام 2023، و11 مليون إصابة في العالم عام 2024.", en: "They disappeared because we vaccinate. When coverage fell, measles returned: 163 cases in Jordan in 2023 and 11 million infections worldwide in 2024." } }
];

/* True statements for the "Rumour or fact" game */
DW.truths = [
  { v: "flu", s: "who-flu-pp", q: { ar: "تبدأ حماية مطعوم الإنفلونزا بعد أسبوعين تقريباً من الجرعة.", en: "Protection from the flu vaccine builds about two weeks after the dose." } },
  { v: "flu", s: "jfda-26", q: { ar: "السعر الرسمي لمطعوم الإنفلونزا الثلاثي في صيدليات الأردن هذا الموسم نحو 8 دنانير.", en: "The official price of the trivalent flu vaccine in Jordanian pharmacies this season is about 8 JOD." } },
  { v: "flu", s: "alnahar-22", q: { ar: "يُسمح للصيادلة المدرَّبين في الأردن بإعطاء مطعوم الإنفلونزا في الصيدليات.", en: "Trained pharmacists in Jordan are allowed to give the flu vaccine in pharmacies." } },
  { v: "hpv", s: "who-hpv-pp", q: { ar: "توصي منظمة الصحة العالمية بمطعوم HPV للفتيات من 9 إلى 14 عاماً.", en: "WHO recommends the HPV vaccine for girls aged 9 to 14." } },
  { v: "hpv", s: "palmer-24", q: { ar: "في اسكتلندا لم تُسجَّل أي إصابة بسرطان عنق الرحم الغازي بين من تطعّمن في عمر 12 إلى 13 عاماً.", en: "In Scotland no invasive cervical cancer was recorded among women vaccinated at age 12 to 13." } },
  { v: "measles", s: "cdc-measles", q: { ar: "فيروس الحصبة يبقى في هواء الغرفة حتى ساعتين بعد مغادرة المصاب.", en: "The measles virus stays in the air of a room for up to two hours after the patient leaves." } },
  { v: "measles", s: "who-measles-25", q: { ar: "أنقذ مطعوم الحصبة نحو 59 مليون إنسان منذ عام 2000.", en: "The measles vaccine has saved nearly 59 million lives since 2000." } },
  { v: "hepb", s: "who-hepb-fs", q: { ar: "التهاب الكبد (ب) لا ينتقل بالمصافحة ولا بمشاركة الطعام.", en: "Hepatitis B does not spread through handshakes or shared food." } },
  { v: "hepb", s: "abudayyeh-25", q: { ar: "دخل مطعوم التهاب الكبد (ب) البرنامج الوطني الأردني عام 1995.", en: "The hepatitis B vaccine entered Jordan's national programme in 1995." } },
  { v: "pneumo", s: "moh-pcv-25", q: { ar: "مطعوم المكورات الرئوية مجاني في الأردن للمواليد من 1 كانون الثاني 2025.", en: "The pneumococcal vaccine is free in Jordan for children born from 1 January 2025." } },
  { v: "pneumo", s: "cdc-adult", q: { ar: "يمكن أخذ مطعوم المكورات الرئوية ومطعوم الإنفلونزا في الزيارة نفسها.", en: "The pneumococcal and flu vaccines can be given at the same visit." } },
  { v: "mening", s: "ksa-1447", q: { ar: "تشترط السعودية أخذ مطعوم السحايا قبل الوصول بعشرة أيام على الأقل.", en: "Saudi Arabia requires the meningitis vaccine at least ten days before arrival." } },
  { v: "mening", s: "moh-hajj-26", q: { ar: "تعطي مراكز وزارة الصحة الأردنية مطعوم السحايا للحجاج والمعتمرين.", en: "Jordanian Ministry of Health centres give the meningitis vaccine to Hajj and Umrah pilgrims." } }
];

/* "Spot the trick": invented posts written in the style of real misinformation. They are examples for teaching, not real posts. */
DW.posts = [
  { t: "falsecause",
    post: { ar: "ابن جيراننا أخذ المطعوم يوم الأحد، ويوم الثلاثاء ارتفعت حرارته ودخل المستشفى. المطعوم هو السبب! انشروا قبل الحذف.", en: "Our neighbours' son had the vaccine on Sunday, and on Tuesday he had a high fever and was in hospital. The vaccine did it! Share before it gets deleted." },
    why: { ar: "تتابُع حدثين لا يجعل الأول سبباً للثاني. الأطفال يصابون بعدوى كثيرة في كل الأحوال، ولهذا تُقارن الدراسات آلاف المطعَّمين بغير المطعَّمين. وعبارة «قبل الحذف» وسيلة ضغط.", en: "One event following another does not make the first the cause. Children catch many infections anyway, which is why studies compare thousands of vaccinated and unvaccinated children. And 'before it gets deleted' is a pressure tactic." } },
  { t: "fakeexpert",
    post: { ar: "خبير الطاقة الحيوية ومؤسس «أكاديمية المناعة الطبيعية» يكشف: المطاعيم تدمّر مناعة أطفالكم.", en: "A bio-energy expert and founder of the 'Natural Immunity Academy' reveals: vaccines destroy your children's immunity." },
    why: { ar: "اللقب لا يساوي الاختصاص. اسأل: هل صاحب الكلام طبيب أو باحث في المناعة أو الأوبئة؟ وأين نُشر دليله؟", en: "A title is not expertise. Ask: is this person a physician or a researcher in immunology or epidemiology? And where is the evidence published?" } },
  { t: "cherry",
    post: { ar: "ثلث المصابين بالإنفلونزا في المستشفى هذا الشتاء كانوا مطعَّمين. إذن المطعوم لا ينفع!", en: "A third of flu patients in hospital this winter were vaccinated. So the vaccine does not work!" },
    why: { ar: "الرقم وحده يضلل. إذا كان أغلب كبار السن مطعَّمين فسيظهر بين المرضى مطعَّمون. المقارنة الصحيحة هي نسبة دخول المستشفى عند المطعَّمين وعند غير المطعَّمين.", en: "The number alone misleads. When most older adults are vaccinated, some patients will be vaccinated too. The fair comparison is the rate of hospital admission among vaccinated and unvaccinated people." } },
  { t: "conspiracy",
    post: { ar: "لماذا يصرّون على تطعيم أولادنا نحن بالذات؟ فكّروا: من المستفيد؟", en: "Why do they insist on vaccinating our children in particular? Think: who benefits?" },
    why: { ar: "سؤال موحٍ بلا دليل. المطاعيم نفسها تُعطى لأطفال العالم كله، وجداول كل الدول منشورة علناً.", en: "A loaded question with no evidence. The same vaccines are given to children all over the world, and every country's schedule is public." } },
  { t: "impossible",
    post: { ar: "يعترفون بأن المطعوم لا يحمي الجميع وبأن له آثاراً جانبية. فلماذا نأخذه أصلاً؟", en: "They admit the vaccine does not protect everyone and has side effects. So why take it at all?" },
    why: { ar: "لا دواء ولا إجراء طبياً يخلو من أي أثر أو ينجح دائماً. السؤال الصحيح: هل نفعه أكبر من ضرره؟ والجواب تحسمه البيانات لا الانطباعات.", en: "No medicine or procedure is free of any effect or works every time. The right question is whether the benefit outweighs the harm, and data answer that, not impressions." } },
  { t: "natural",
    post: { ar: "أجدادنا عاشوا بلا مطاعيم وكانوا أقوى منا. العسل والحبة السوداء تكفي لتقوية المناعة.", en: "Our grandparents lived without vaccines and were stronger than us. Honey and black seed are enough to boost immunity." },
    why: { ar: "من نراهم من الأجداد هم من نجوا. في زمانهم كان كثير من الأطفال يموتون بالحصبة والخناق قبل الخامسة. الغذاء الجيد مفيد، لكنه لا يصنع أجساماً مضادة لفيروس الحصبة.", en: "The grandparents we see are the ones who survived. In their time many children died of measles and diphtheria before the age of five. Good food helps, but it does not make antibodies against the measles virus." } }
];

/* "At the counter": one customer, three possible replies. best = index of the best reply. */
DW.cases = [
  { v: ["flu", "pneumo"], best: 0,
    who: { ar: "أم خالد، 67 عاماً، سكري وضغط. جاءت لصرف علاجها الشهري.", en: "Um Khaled, 67, diabetes and hypertension. She is collecting her monthly medicines." },
    says: { ar: "كل سنة تسألونني عن مطعوم الإنفلونزا، وأنا لا أمرض.", en: "Every year you ask me about the flu vaccine, and I never get sick." },
    opts: [
      { ar: "ما شاء الله على صحتك. السكري يجعل الإنفلونزا أشد خطراً حتى على من لا يمرض كثيراً. أنصحك بالمطعوم اليوم، وسعره 8 دنانير. وهل حدّثك طبيبك عن مطعوم المكورات الرئوية؟", en: "I am glad you keep well. Diabetes makes flu more dangerous even for people who rarely fall ill. I recommend the vaccine today, it costs 8 JOD. Has your doctor mentioned the pneumococcal vaccine?" },
      { ar: "كما تريدين. إن غيّرتِ رأيك فالمطعوم موجود.", en: "As you wish. If you change your mind, we have it." },
      { ar: "لا بد أن تأخذيه. من لا يتطعم في عمرك يعرّض نفسه للموت.", en: "You must take it. At your age, anyone who skips it is risking death." }
    ],
    why: { ar: "التوصية الواضحة من مقدم الرعاية أقوى ما يدفع الناس إلى التطعيم. الرد الأول يحترم كلامها، ويربط المطعوم بحالتها، ويذكر السعر، ويفتح موضوع مطعوم آخر تحتاجه. الانسحاب يضيّع الفرصة، والتخويف ينفّر.", en: "A clear recommendation from a health professional is the strongest driver of vaccination. The first reply respects what she said, links the vaccine to her condition, states the price, and opens the door to another vaccine she needs. Backing off wastes the moment, and fear pushes people away." } },
  { v: ["hpv"], best: 0,
    who: { ar: "سيدة تسأل عن فيتامينات لابنتها، 12 عاماً.", en: "A woman asking about vitamins for her daughter, aged 12." },
    says: { ar: "سمعت عن مطعوم لسرطان عنق الرحم، لكنه للكبار، أليس كذلك؟", en: "I heard about a vaccine for cervical cancer, but it is for adults, is it not?" },
    opts: [
      { ar: "سؤالك في وقته. المطعوم يعطي أفضل حماية في عمر ابنتك تحديداً، من 9 إلى 14 عاماً، لأنه يمنع العدوى قبل حدوثها. هو غير مشمول في البرنامج الوطني، فاسألي طبيبة الأطفال عن الجرعات والسعر.", en: "Good timing. The vaccine protects best at exactly your daughter's age, 9 to 14, because it prevents the infection before it happens. It is outside the national programme, so ask the paediatrician about doses and price." },
      { ar: "نعم، هو للمتزوجات.", en: "Yes, it is for married women." },
      { ar: "الموضوع حساس، والأفضل ألا تشغلي بالك به الآن.", en: "It is a sensitive subject. Better not to worry about it now." }
    ],
    why: { ar: "الأم هي التي فتحت الموضوع، وهذه أفضل لحظة للمعلومة الصحيحة. تقديم المطعوم على أنه وقاية من السرطان في العمر المناسب يجيب عن سؤالها دون إحراج.", en: "The mother raised the subject herself, which is the best moment for accurate information. Presenting the vaccine as cancer prevention at the right age answers her question without embarrassment." } },
  { v: ["measles"], best: 0,
    who: { ar: "أب يشتري خافض حرارة لطفله، 10 أشهر.", en: "A father buying a fever medicine for his 10-month-old." },
    says: { ar: "قرأت أن مطعوم الحصبة يسبب التوحد، وأفكر في تأجيله.", en: "I read that the measles vaccine causes autism, and I am thinking of delaying it." },
    opts: [
      { ar: "أفهم قلقك، وكثيرون قرأوا الكلام نفسه. دراسة على أكثر من 650 ألف طفل لم تجد أي علاقة، والورقة التي بدأت الإشاعة سُحبت. الخطر الحقيقي هو الحصبة التي عادت إلى الأردن في 2023. هل أخذ طفلك جرعة الشهر التاسع؟", en: "I understand the worry, and many people have read the same thing. A study of more than 650,000 children found no link, and the paper that started the rumour was retracted. The real danger is measles, which returned to Jordan in 2023. Has your son had his 9-month dose?" },
      { ar: "هذا كلام فارغ. لا تصدّق كل ما تقرأه في الإنترنت.", en: "That is nonsense. Do not believe everything you read online." },
      { ar: "إن كنت قلقاً فأجّله حتى يكبر قليلاً.", en: "If you are worried, delay it until he is a little older." }
    ],
    why: { ar: "تصحيح الإشاعة ينجح حين يبدأ بتفهّم القلق، ثم الحقيقة، ثم سبب خطأ الإشاعة، ثم خطوة عملية. الاستخفاف يغلق الحوار، والتأجيل يترك الطفل بلا حماية في أخطر عمر.", en: "Correcting a rumour works when it starts by acknowledging the worry, then gives the fact, then explains why the rumour is wrong, then offers a practical step. Dismissing the parent ends the conversation, and delay leaves the child unprotected at the riskiest age." } },
  { v: ["mening"], best: 0,
    who: { ar: "شاب، 28 عاماً، يشتري مستلزمات سفر.", en: "A man of 28 buying travel supplies." },
    says: { ar: "مسافر للعمرة بعد خمسة أيام. المطعوم؟ آخذه هناك.", en: "I am travelling for Umrah in five days. The vaccine? I will get it there." },
    opts: [
      { ar: "السعودية تشترط المطعوم قبل الوصول بعشرة أيام على الأقل، وأنت متأخر عن الموعد. اذهب غداً صباحاً إلى المركز الصحي ومعك حجزك، واسألهم عما يلزم في حالتك. وللرحلات القادمة: الشهادة صالحة 5 سنوات.", en: "Saudi Arabia requires the vaccine at least ten days before arrival, and you are past that point. Go to the health centre tomorrow morning with your booking and ask what applies in your case. For future trips, the certificate is valid for 5 years." },
      { ar: "لا مشكلة، كثيرون يسافرون بلا مطعوم.", en: "No problem, plenty of people travel without it." },
      { ar: "خذ معك مضاداً حيوياً للاحتياط.", en: "Take an antibiotic with you just in case." }
    ],
    why: { ar: "الصدق بشأن الموعد مع خطوة عملية فورية أفضل من الطمأنة الزائفة. المضاد الحيوي ليس بديلاً عن المطعوم، وصرفه بلا داعٍ يزيد مقاومة البكتيريا.", en: "Honesty about the deadline plus an immediate practical step beats false reassurance. An antibiotic is not a substitute for the vaccine, and dispensing one without need adds to bacterial resistance." } },
  { v: ["hepb"], best: 0,
    who: { ar: "طالبة تمريض في السنة الثانية، من مواليد 2006.", en: "A second-year nursing student, born in 2006." },
    says: { ar: "طلبوا منا إثبات مطعوم التهاب الكبد (ب) قبل التدريب. أخذته وأنا رضيعة، فهل أحتاج شيئاً؟", en: "They asked us for proof of hepatitis B vaccination before clinical training. I had it as a baby, so do I need anything?" },
    opts: [
      { ar: "مواليد 2006 تلقّوه ضمن البرنامج الوطني، وهذا جيد. العاملون الصحيون يُنصحون بفحص الأجسام المضادة للتأكد من الاستجابة، وطبيب الكلية يقرر إن لزمت جرعة إضافية. احتفظي بنسخة من بطاقة مطاعيمك.", en: "People born in 2006 received it through the national programme, which is good. Health workers are advised to have an antibody test to confirm the response, and the faculty physician decides whether an extra dose is needed. Keep a copy of your vaccination card." },
      { ar: "أعيدي الجرعات الثلاث كلها للاحتياط.", en: "Repeat all three doses to be safe." },
      { ar: "لا تحتاجين شيئاً. المطعوم يحمي الجميع مدى الحياة بلا استثناء.", en: "You need nothing. The vaccine protects everyone for life without exception." }
    ],
    why: { ar: "الحماية طويلة الأمد عند أغلب الناس، لكن من يتعرض للدم في عمله يحتاج توثيقاً وفحصاً للاستجابة. إعادة الجرعات كلها بلا فحص إجراء غير لازم.", en: "Protection is long-lasting for most people, but anyone exposed to blood at work needs documentation and a check of the response. Repeating the whole series without a test is unnecessary." } },
  { v: ["flu"], best: 0,
    who: { ar: "سيدة حامل في الشهر الخامس تشتري مكملات الحمل.", en: "A woman five months pregnant, buying pregnancy supplements." },
    says: { ar: "لا آخذ أي دواء أو مطعوم وأنا حامل.", en: "I do not take any medicine or vaccine while pregnant." },
    opts: [
      { ar: "حرصك في محله. مطعوم الإنفلونزا تحديداً توصي به منظمة الصحة العالمية للحامل في أي شهر، لأن الإنفلونزا أشد على الحوامل، ولأنه يحمي مولودك في أشهره الأولى. ما رأيك أن تسألي طبيبتك في الزيارة القادمة؟ وأنا جاهزة متى قررتِ.", en: "You are right to be careful. The flu vaccine in particular is recommended by WHO at any stage of pregnancy, because flu is harder on pregnant women and because it protects your baby in the first months. How about asking your doctor at the next visit? I am here whenever you decide." },
      { ar: "صحيح، الأفضل تجنب كل شيء في الحمل.", en: "True, it is best to avoid everything in pregnancy." },
      { ar: "خذيه الآن، لا وقت للتردد.", en: "Take it now, there is no time to hesitate." }
    ],
    why: { ar: "الحامل من الفئات ذات الأولوية لمطعوم الإنفلونزا. الرد الأفضل يؤيد حرصها، ويقدّم المعلومة الدقيقة، ويترك لها القرار مع طبيبتها.", en: "Pregnant women are a priority group for the flu vaccine. The best reply supports her caution, gives the accurate information, and leaves the decision with her and her doctor." } },
  { v: ["pneumo"], best: 0,
    who: { ar: "جدّة مع حفيدها الرضيع، عمره شهران.", en: "A grandmother with her two-month-old grandson." },
    says: { ar: "في المركز قالوا عليه مطعوم جديد مع المطاعيم الأخرى. في زماننا لم يكن كل هذا.", en: "At the centre they said there is a new vaccine along with the others. In our day there was none of this." },
    opts: [
      { ar: "صحيح، هو جديد: مطعوم المكورات الرئوية دخل البرنامج الوطني في أيلول 2025 مجاناً. يحمي من أخطر أسباب الالتهاب الرئوي والسحايا عند الرضّع، وإعطاؤه مع بقية المطاعيم مدروس. جرعاته في الشهر 2 و4 و12.", en: "True, it is new: the pneumococcal vaccine joined the national programme in September 2025, free of charge. It protects against the most dangerous causes of pneumonia and meningitis in infants, and giving it with the other vaccines has been studied. The doses are at 2, 4 and 12 months." },
      { ar: "معك حق، المطاعيم كثرت ولا داعي لها كلها.", en: "You are right, there are too many vaccines and not all are needed." },
      { ar: "لا أعرف. اسألي في المركز.", en: "I do not know. Ask at the centre." }
    ],
    why: { ar: "الجدّات يؤثرن في قرار الأسرة. جواب واثق ومحدد يحوّل الاستغراب إلى اطمئنان.", en: "Grandmothers shape the family's decision. A confident, specific answer turns surprise into reassurance." } },
  { v: ["all"], best: 0,
    who: { ar: "زميلك في الجامعة يريك منشوراً على هاتفه.", en: "A university classmate shows you a post on his phone." },
    says: { ar: "«انشروا قبل الحذف: المطعوم يسبب العقم». ما رأيك، أنشره للاحتياط؟", en: "'Share before it is deleted: the vaccine causes infertility.' What do you think, shall I share it just in case?" },
    opts: [
      { ar: "قبل النشر اسأل ثلاثة أسئلة: من كتبه؟ ما مصدره؟ ولماذا يستعجلني؟ عبارة «قبل الحذف» أسلوب ضغط معروف. تعال نبحث عن الادعاء في موقع منظمة الصحة العالمية.", en: "Before sharing, ask three questions: who wrote it, what is the source, and why is it rushing me? 'Before it is deleted' is a known pressure tactic. Let us look the claim up on the WHO website." },
      { ar: "انشره، لن يضر.", en: "Share it, it will do no harm." },
      { ar: "أنت ساذج إن صدّقت هذا.", en: "You are naive if you believe that." }
    ],
    why: { ar: "إعادة النشر «للاحتياط» هي ما يصنع انتشار الإشاعة. تعليم الأسئلة الثلاثة يحمي صاحبك من الإشاعة التالية أيضاً، والسخرية تجعله يتمسك بها.", en: "Sharing 'just in case' is exactly how rumours spread. Teaching the three questions protects your friend from the next rumour as well, and mockery makes people hold on tighter." } }
];
