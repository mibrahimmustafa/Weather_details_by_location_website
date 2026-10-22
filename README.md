# أجواء · Ajwaa 🌦️
> **الطقس والوقت، أينما كنت** · *Weather & time, wherever you are*

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-gold.svg)](https://github.com/mibrahimmustafa/Weather_details_by_location_website)
[![No API Keys Required](https://img.shields.io/badge/API%20Keys-None%20(100%25%20Free)-green.svg)](#-مصادر-البيانات--data-sources)
[![Zero Build Steps](https://img.shields.io/badge/Build%20Step-None%20(Pure%20Web)-blue.svg)](#-التقنيات-المستخدمة--technology-stack)

---

## 📖 الفهرس / Table of Contents
1. [نظرة عامة / Overview](#-نظرة-عامة--overview)
2. [المزايا الرئيسية / Key Features](#-المزايا-الرئيسية--key-features)
3. [الهوية البصرية وتصميم اللوجو / Brand Identity & Logo](#-الهوية-البصرية-وتصميم-اللوجو--brand-identity)
4. [هيكل المشروع / Project Structure](#-هيكل-المشروع--project-structure)
5. [مصادر البيانات العامة / Data Sources](#-مصادر-البيانات--data-sources)
6. [طريقة التشغيل محلياً / Running Locally](#-طريقة-التشغيل-محليا--running-locally)
7. [النشر على GitHub Pages / Deployment](#-النشر-على-github-pages--deployment)
8. [شروط الاستخدام والخصوصية / Privacy & Terms](#-الخصوصية-والأمان--privacy--security)
9. [المؤلف والترخيص / Author & License](#-المؤلف-والترخيص--author--license)

---

## 🌟 نظرة عامة / Overview

**أجواء (Ajwaa)** هو تطبيق ويب فائق الخفة والسرعة لمتابعة حالة الطقس والتوقيت المحلي المباشر لأي مدينة في العالم بدقة متناهية. تم بناؤه بالكامل باستخدام **تقنيات الويب النقي (Pure Vanilla HTML5, CSS3, JavaScript ES2022)** دون الحاجة إلى أي مكتبات ثقيلة أو أطر عمل أو بيئات تجميع (Build Tools)، ودون الحاجة لأي مفاتيح برمجية (API Keys).

**Ajwaa** is an ultra-fast, lightweight client-side weather and real-time local clock web application. Engineered purely with vanilla standards (HTML5, CSS3, JavaScript ES2022), it requires zero build steps, zero external frameworks, and zero private API tokens.

---

## 🚀 المزايا الرئيسية / Key Features

- 📍 **معرفة الموقع التلقائي (GPS Geolocation):** يحدد موقع المستخدم بدقة مع التحويل العكسي لاسم المدينة والحي (Reverse Geocoding).
- 🕒 **ساعة محلية حية متزامنة (Live City Clock):** حساب توقيت المدينة المحددة لحظة بلحظة مع مؤشر المنطقة الزمنية (GMT+X) وتحديث كل ثانية.
- 🌍 **بحث عالمي عن المدن (Global Search):** بحث سريع ومريح مع ميزة التأخير الذكي (Debounce 380ms) لتوفير البيانات، مع قائمة بالمدن الشائعة والمفضلة.
- ⚠️ **محرّك تنبيهات جوية ذكي (Intelligent Weather Alerts Engine):** يقيم سرعة الرياح، وموجات الحر والصقيع، والسيول، والأشعة فوق البنفسجية، وتنبيهات الأعاصير القريبة.
- 🌀 **رصد الأعاصير والأنظمة المدارية (NASA EONET Cyclones Tracker):** يرصد الأعاصير النشطة عالمياً مع حساب المسافة الفاصلة بينها وبين مدينتك بالكيلومتر وسرعة الرياح بالعقدة والكم/س.
- 📊 **جودة الهواء ومؤشر الغبار (Air Quality & Dust):** قياس تركيز الغبار (µg/m³)، مؤشر AQI، وجزيئات PM2.5 و PM10 مع رسم بياني مساحي لـ 24 ساعة ونصائح صحية وقائية.
- 🌧️ **تفاصيل هطول الأمطار (Precipitation Details):** حساب التراكم خلال 24 ساعة، ونسبة احتمال الهطول الحالية، وأعمدة بيانية لتوقعات الساعات القادمة.
- ☀️ **مسار الشمس التفاعلي (Sun Path Arc):** منحنى مكافئ مرسوم بـ SVG يوضح مسار الشمس من الشروق للغروب وموقعها الحالي ومقدار ضوء النهار المتبقي.
- 📅 **توقعات 7 أيام بشريط مدى حراري موحد (7-Day Normalized Range Bar):** استعراض التوقعات الأسبوعية مع تدرج لوني حراري موحد وتفاصيل كل يوم عند النقر.
- 🎨 **مشاهد طقس متحركة (Dynamic Atmospheric Backgrounds):** خلفية كارت البطل تتفاعل حركياً مع حالة الطقس (شمس ووهج، قمر ونجوم، سحب متحركة، مطر ساقط، أتربة، برق ورعد).
- 🌐 **دعم كامل للغتين العربية (RTL) والإنجليزية (LTR):** تبديل فوري للغة، والاتجاهات، والأيقونات المنطقية.
- 🌓 **ثلاثة أنماط للمظهر (Dark, Light, System):** تصميم زجاجي عصري (Glassmorphism) يحترم إعدادات نظام تشغيل جهازك.
- 💾 **تخزين مؤقت ذكي (10-Minute Smart Cache):** يتيح تصفح البيانات عند انقطاع الإنترنت مع ظهور شريط تنبيه «بيانات محفوظة».

---

## 🎨 الهوية البصرية وتصميم اللوجو / Brand Identity

- **الفكرة البصرية للوجو:** شمس ذهبية بداخلها عقارب ساعة تشير للتوقيت، تمر تحتها سحابة بيضاء ناعمة، وتسقط منها قطرتان تركوازيتان.
- **التنفيذ:** مرسوم بنقاء 100% كرمز متجهي SVG دون أي صور خارجية ثقيلة، مما يضمن حدة كاملة على جميع الشاشات والشاشات عالية الكثافة (Retina Displays).
- **الشعار النصي:** «الطقس والوقت، أينما كنت» / *"Weather & time, wherever you are"*.

---

## 📁 هيكل المشروع / Project Structure

```text
Weather_details_by_location_website/
├── index.html                 # الصفحة الرئيسية ومخطط التطبيق
├── privacy.html               # صفحة سياسة الخصوصية باللغتين
├── terms.html                 # صفحة شروط الاستخدام باللغتين
├── Architectures.json         # التوثيق الشامل للبنية البرمجية
├── README.md                  # دليل المشروع والتوثيق
├── assets/
│   └── icons/
│       └── favicon.svg        # لوجو وأيقونة التطبيق المبتكرة
├── css/
│   ├── tokens.css             # متغيرات التصميم والألوان والظلال والسمات
│   ├── base.css               # إعادة الضبط والقواعد المنطقية للاتجاهات RTL/LTR
│   ├── layout.css             # الهيدر المثبت والحاوية والشبكات المستجيبة
│   ├── components.css         # الكروت الزجاجية، الأزرار، الشيتات، السكيلتون
│   ├── atmosphere.css         # مشاهد الطقس الحية المتحركة بـ CSS
│   └── motion.css             # انتقالات الحركة وتوافق prefers-reduced-motion
└── js/
    ├── config.js              # الثوابت، المدن الافتراضية، مفاتيح التخزين
    ├── i18n.js                # قواميس الترجمة العربية والإنجليزية والربط اللحظي
    ├── store.js               # إدارة الحالة المركزية بنمط Publish/Subscribe
    ├── storage.js             # التخزين المؤقت في localStorage وإدارة الكاش
    ├── format.js              # حساب الساعة الحقيقية للمدن، التواريخ، والأرقام
    ├── charts.js              # الرسوم البيانية SVG (الغبار، مسار الشمس)
    ├── domain/
    │   ├── units.js           # التحويل بين النظام المتري والإمبراطوري
    │   ├── conditions.js      # ربط أكواد WMO بوصف الطقس والأيقونات
    │   ├── levels.js          # تصنيفات الغبار و UV وجودة الهواء والنصائح
    │   ├── alerts.js          # محرّك التنبيهات الجوية ومعايير الخطورة
    │   └── geo.js             # معادلة Haversine للمسافات وسرعات الرياح
    ├── api/
    │   ├── http.js            # عميل Fetch مع مؤقت 18 ثانية وإعادة المحاولة
    │   ├── forecast.js        # جلب بيانات الطقس الحالية والساعية واليومية
    │   ├── airquality.js      # جلب بيانات الغبار و PM10 و AQI و UV
    │   ├── geocoding.js       # البحث الجغرافي والتحويل العكسي للإحداثيات
    │   └── storms.js          # جلب الأعاصير المدارية المفتوحة من NASA
    ├── components/
    │   ├── toast.js           # إشعارات التوست
    │   ├── header.js          # الهيدر العلوي
    │   ├── hero.js            # كارت البطل الرئيسي والساعة الحية
    │   ├── alerts.js          # كروت التنبيهات
    │   ├── hourly.js          # شريط الـ 24 ساعة الأفقي
    │   ├── rainDust.js        # بطاقتي المطر والغبار
    │   ├── details.js         # شبكة التفاصيل السبعة مع شيتات الشرح
    │   ├── sunPath.js         # مسار الشمس اليومي
    │   ├── cyclones.js        # قائمة الأعاصير القريبة
    │   ├── forecast7.js       # توقعات الأسبوع
    │   └── sheets.js          # الشيتات المنبثقة (البحث، الإعدادات، الترحيب)
    └── main.js                # المنسق العام ومتحكم دورة الحياة (Bootstrap)
```

---

## 🌐 مصادر البيانات / Data Sources

التطبيق يعتمد حصرياً على واجهات برمجة تطبيقات عالمية مفتوحة ومجانية تماماً وبلا حاجة لأي مفاتيح خاصة:
1. **Open-Meteo Weather Forecast API:** توقعات الطقس الحالية واليومية والساعية.
2. **Open-Meteo Air Quality API:** بيانات الغبار والأتربة العالقة ومؤشر AQI والأشعة فوق البنفسجية.
3. **Open-Meteo Geocoding API:** محرك البحث الجغرافي عن المدن باللغتين العربية والإنجليزية.
4. **NASA EONET (Earth Observatory Natural Event Tracker):** تتبع الأعاصير المدارية المفتوحة ومساراتها.
5. **BigDataCloud / Nominatim API:** عكس الإحداثيات الجغرافية (GPS) إلى اسم المدينة والحي.

---

## 💻 طريقة التشغيل محلياً / Running Locally

المشروع مصمم ليعمل **فوراً** دون أي خطوات تثبيت أو أوامر npm معقدة:

### الطريقة الأولى: الفتح المباشر
- يمكنك ببساطة النقر المزدوج على ملف `index.html` في جهازك ليفتح في أي متصفح ويب حديث.

### الطريقة الثانية: عبر أي خادم ويب محلي خفيف
باستخدام بايثون:
```bash
python -m http.server 8000
```
أو باستخدام Node.js:
```bash
npx serve .
```
ثم افتح الرابط: `http://localhost:8000`

---

## 🚀 النشر على GitHub Pages / Deployment

1. ارفع المشروع على مستودع GitHub:
```bash
git add .
git commit -m "feat: complete Ajwaa weather web app"
git push -u origin main
```
2. في صفحة المستودع على GitHub:
   - اذهب إلى **Settings** > **Pages**.
   - اختر الفرع `main` والمجلد `/ (root)`.
   - اضغط **Save**.
   - سيصبح موقعك متاحاً عالمياً خلال ثوانٍ على رابط مثل:
     `https://mibrahimmustafa.github.io/Weather_details_by_location_website/`

---

## 🔒 الخصوصية والأمان / Privacy & Security

- لا يتم جمع أو تخزين أي بيانات شخصية أو إحداثيات GPS على أي خوادم خارجية.
- تتوفر صفحتان قانونيتان كاملتان:
  - [سياسة الخصوصية / Privacy Policy](privacy.html)
  - [شروط وأحكام الاستخدام / Terms of Use](terms.html)

---

## 👨‍💻 المؤلف والترخيص / Author & License

- **المطور:** Mohamed Ibrahim Mustafa
- **الترخيص:** مرخص بموجب رخصة [MIT License](LICENSE). مفتوح المصدر ومتاح للاستخدام والتطوير.
- **الإصدار:** 1.0.0
