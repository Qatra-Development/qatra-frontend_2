# دمج البرانشات — 2026-09-28

الهدف هو `develope` الموجود، حسب تأكيدك، وليس إنشاء `develop` جديد.
الترتيب: `blood-requests` ثم `origin/sprint4` ثم `sprint-5`.
نسخ المصدر: `fda797f` و`dc45c3a` و`82d22d9` على الترتيب.

## الفحص والحماية

```sh
git status --short --branch
git branch -a
git fetch origin
git log --graph --oneline --decorate --all -50
git branch backup/develope-before-integration-2026-09-28 origin/develope
git switch -c develope --track origin/develope
```

تأكدت من نظافة العمل، وجلبت المراجع الحديثة، وفحصت تاريخ الفروع.
البرانش الاحتياطي يحفظ نقطة البداية `994cc79`؛ لم أعدّل برانشات المصدر.
استخدمت `origin/sprint4` لأن `sprint4` لم يكن موجودًا محليًا.

## الدمج بالترتيب

```sh
git merge --no-ff --no-commit blood-requests
git commit -m "Merge blood requests into develope"
git merge --no-ff --no-commit origin/sprint4
# مراجعة التعارضات وتصحيح الملفات ثم git add للملفات المحلولة
git commit -m "Merge sprint 4 while keeping institution routing"
git merge --no-ff --no-commit sprint-5
# مراجعة التعارضات وتصحيح الملفات ثم git add للملفات المحلولة
git commit -m "Merge sprint 5 donations and donor dashboard"
```

`--no-ff` يحفظ كل دمج في commit مستقل؛ `--no-commit` يتيح مراجعة النتيجة قبل تثبيتها.
لا يوجد أمر يضمن اختفاء التعارضات؛ حُلّت يدويًا باستخدام `apply_patch` بعد مقارنة النسختين، دون اعتماد `ours` أو `theirs` على المشروع كله.

## القرارات عند التعارض

- `blood-requests`: اندمج دون تعارض.
- `sprint4`: حُلّت تعارضات login وlogout وproxy وglobals؛ بقيت تنسيقات المؤسسة وأوزان الخط الإضافية، وجُمعت عمليات حذف كوكيز الجلسة.
- الدخول والتوجيه: اعتمدنا `sprint-5` حسب اختيارك؛ بنك الدم المعتمد يذهب إلى `/HospitalDashboard`، والمتبرع إلى `/donor/dashboard`. بقي مجلد `BloodBankDashboard` من `sprint4` محفوظًا.
- `HospitalDashboard/donations`: نسخة `sprint-5` مطابقة تمامًا، مع خدماتها ومكوناتها.
- الـ sidebar: احتفظنا برابط «طلباتي» وتصميم `sprint4` وبمنطق الخروج من `sprint-5`.
- الـ header: بقي مسار التنقل من `sprint4` مع دعم صفحات المستجيبين والمطابقة الجديدة دون روابط لصفحات غير موجودة.
- أزيل تكرار حذف `account_type` الناتج عن الدمج التلقائي وسطر فارغ زائد في نهاية ملف.

## أوامر المراجعة

```sh
git diff --cc
git diff --name-only --diff-filter=U
git diff --check
git diff --cached --check
git diff --exit-code sprint-5 -- src/app/HospitalDashboard/donations
./node_modules/.bin/tsc --noEmit
npm run test:auth
npm run lint
npm run build
npm run build -- --webpack
```

`diff --cc` يعرض مواضع التداخل، و`--diff-filter=U` يكشف الملفات غير المحلولة.
`diff --check` يفحص علامات التعارض والمسافات، والمقارنة مع `sprint-5` تؤكد تطابق صفحات التبرعات.

TypeScript نجح، واختبارات auth الـ13 نجحت. نجحت أيضًا تجربة محلية باستجابات وهمية لـ18 حالة دخول/كوكيز/توجيه و5 حالات حماية للزائر؛ لم تُستخدم حسابات حقيقية.

فحص lint الكامل أظهر 6 أخطاء و15 تحذيرًا سابقة للدمج. تأكدت من تطابق ملفات الأخطاء مع فروع المصدر؛ الملفات التي حُلّت تعارضاتها اجتازت lint. أما الأخطاء السابقة فهي في:

- `src/app/BloodBankDashboard/components/LatestRequests.tsx`
- `src/app/BloodBankDashboard/inventory/page.tsx`
- `src/app/BloodBankDashboard/page.tsx`
- `src/app/HospitalDashboard/components/LatestRequests.tsx`
- `src/app/HospitalPath/components/Header.tsx`
- `src/features/donor-dashboard/components/DonorCallDetailsModal.tsx`

تعطل Turbopack بسبب منع فتح منفذ محلي (`Operation not permitted`) حتى بعد محاولة التشغيل بالصلاحية الموسعة، ولذلك استُخدم Webpack للتحقق دون تغيير إعدادات المشروع.
بناء `npm run build -- --webpack` نجح بالكامل، بما فيه TypeScript وتوليد الصفحات ومسارات التبرعات الجديدة.

## التأكد من إدراج الفروع

```sh
git merge-base --is-ancestor blood-requests develope
git merge-base --is-ancestor origin/sprint4 develope
git merge-base --is-ancestor sprint-5 develope
git log --first-parent --oneline -4
git status --short --branch
```

خروج أوامر `--is-ancestor` بالقيمة 0 يثبت وجود تاريخ كل فرع في النتيجة.
الدمج محلي فقط؛ لم يُنفذ `git push` ولم تُحذف أي فروع.

## استكمال الدمج: ashraf

أُضيف `origin/ashraf` عند `9462cbb` فوق نتيجة الدمج السابقة `a332ecd` لضم ربط شاشات `sprint4` بالـ API.

```sh
git fetch origin
git branch backup/develope-before-ashraf-2026-09-28 develope
git merge --no-ff --no-commit origin/ashraf
git diff --cc
```

اندمجت إضافات الربط في 14 ملفًا دون تعارض، ومنها خدمة `HospitalDashboard/lib/api.ts` والمخزون والإحصاءات والطلبات والتنبيهات.
اقتصرت التعارضات على `components/ui/auth/LoginForm.tsx` و`src/app/api/auth/login/route.ts` و`src/proxy.ts`؛ اعتمدت محتوياتها من `sprint-5` باستخدام `git show sprint-5:<path>` ثم `apply_patch`، بناءً على تعليماتك.
تحققت بمقارنة Git أن إضافات الربط مطابقة لـ `origin/ashraf`، وأن ملفات التوجيه ومجلد التبرعات وميزات المتبرع والتبرعات مطابقة لـ `sprint-5`.

حُلّت التعارضات باعتماد `sprint-5` وثُبّت الدمج في commit مستقل. نجح البناء عبر Webpack بما فيه TypeScript.

```sh
git add components/ui/auth/LoginForm.tsx src/app/api/auth/login/route.ts src/proxy.ts MERGE_NOTES.md
git diff --cached --check
git commit -m "Merge Ashraf's dashboard API integration, keeping sprint 5 routing"
git merge-base --is-ancestor origin/ashraf develope
git merge-base --is-ancestor sprint-5 develope
git status --short --branch
```

نجحت اختبارات auth الـ13، و12 فحصًا محليًا باستجابات وهمية لخدمتي لوحتي المستشفى وبنك الدم، شملت القراءة والصفحات وquery parameters وإرسال الإجراء وأخطاء 422/403/401. لم تُستخدم حسابات أو بيانات حقيقية، ولم يُنفذ push لهذا الدمج.

بعد إضافة `ashraf` أصبح lint الكامل يُظهر 5 أخطاء و15 تحذيرًا سابقة في ملفات المصدر، دون أخطاء تعارض؛ زال خطأ `HospitalDashboard/components/LatestRequests.tsx` بفضل تحديث الفرع نفسه. لم أُجرِ refactor إضافيًا خارج الدمج.
