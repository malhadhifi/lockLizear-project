import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans" dir="rtl">

      {/* ===== NAVBAR ===== */}
      <nav className="bg-[#1a1d2e] h-16 flex items-center px-8 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4361ee] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            🔐
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">SecureDocs</div>
            <div className="text-[#8b8fa8] text-[11px]">DRM Platform</div>
          </div>
        </div>
        <div className="mr-auto flex items-center gap-3">
          <Link to="/login"
            className="text-[#9499b8] hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
            تسجيل الدخول
          </Link>
          <Link to="/publisher/register"
            className="bg-[#4361ee] hover:bg-[#3451d1] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-md">
            إنشاء حساب
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section
        className="text-white py-24 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1d2e 0%, #2d3154 50%, #4361ee 100%)' }}
      >
        <span className="inline-block bg-white/10 border border-white/20 text-xs font-semibold px-4 py-1 rounded-full mb-6 tracking-widest uppercase">
          منصة حماية المحتوى الرقمي
        </span>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
          ملفاتك لا تُفتح
          <br />
          <span className="text-yellow-300">إلا بإذنك أنت</span>
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          شفّر مستنداتك PDF محلياً على جهازك، وتحكم من يفتحها،
          على أي جهاز، ولكم من الوقت — كل ذلك من لوحة إدارة واحدة.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mb-10">
          <Link to="/publisher/register"
            className="bg-white text-[#4361ee] font-bold px-8 py-3 rounded-xl hover:shadow-2xl transition-all text-base">
            أنشئ حساب مجاناً ←
          </Link>
          <a href="#how"
            className="border border-white/30 text-white px-8 py-3 rounded-xl hover:bg-white/10 transition-all text-base">
            كيف يعمل؟
          </a>
        </div>
        <div className="flex justify-center gap-8 flex-wrap text-sm text-white/50">
          <span>✓ التشفير يحدث على جهازك فقط</span>
          <span>✓ لا رفع للملف الأصلي</span>
          <span>✓ رخصة تجريبية فور التسجيل</span>
        </div>

        {/* Flow Visual */}
        <div className="flex items-center justify-center gap-2 flex-wrap mt-14">
          {[
            { icon: '🔐', title: 'تطبيق التشفير', sub: 'يشفّر الملف محلياً' },
            null,
            { icon: '🖥️', title: 'لوحة الإدارة',  sub: 'تتحكم بالصلاحيات' },
            null,
            { icon: '📖', title: 'تطبيق القارئ',  sub: 'يفتح بإذن فقط' },
          ].map((step, i) =>
            step === null ? (
              <span key={i} className="text-white/30 text-2xl px-1">→</span>
            ) : (
              <div key={i} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-center w-40">
                <div className="text-2xl mb-2">{step.icon}</div>
                <div className="text-white text-xs font-bold">{step.title}</div>
                <div className="text-white/50 text-[11px] mt-1">{step.sub}</div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ===== SECURITY STRIP ===== */}
      <div className="bg-[#e8f0ff] border-y border-[#4361ee]/20 py-4 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: '🔒', label: 'AES-256 تشفير' },
            { icon: '🗝️', label: 'RSA مفاتيح عامة وخاصة' },
            { icon: '💻', label: 'تحكم بالأجهزة' },
            { icon: '⏱️', label: 'صلاحيات بتوقيت محدد' },
            { icon: '💧', label: 'علامة مائية ديناميكية' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#4361ee] text-sm font-semibold">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PROBLEM ===== */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#e63946] text-xs font-bold uppercase tracking-widest">المشكلة</span>
            <h2 className="text-3xl font-black text-[#1a1d2e] mt-2">لماذا مشاركة PDF العادية خطيرة؟</h2>
            <p className="text-[#8b8fa8] mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              عندما ترسل ملفاً بالطريقة التقليدية، تفقد السيطرة عليه تماماً من اللحظة الأولى.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '💨', title: 'التسريب في ثوانٍ',    desc: 'الملف يُرسَل بالواتساب أو يُرفَع للإنترنت قبل أن تعلم.' },
              { icon: '🕵️', title: 'لا تعرف مَن سرّب',   desc: 'عشرة عملاء فتحوا الملف والملف تسرّب — لكن من؟ لا أحد يعرف.' },
              { icon: '♾️', title: 'لا نهاية للوصول',    desc: 'العميل ألغى اشتراكه لكن الملف يُفتح على جهازه إلى الأبد.' },
              { icon: '📱', title: 'كل الأجهزة مسموحة',  desc: 'الملف الذي اشتراه شخص واحد يُفتح الآن على عشرين جهازاً.' },
            ].map((card, i) => (
              <div key={i} className="drm-card p-6 hover:-translate-y-1 transition-transform cursor-default">
                <div className="w-11 h-11 bg-[#fdecea] rounded-xl flex items-center justify-center text-xl mb-4">
                  {card.icon}
                </div>
                <h3 className="font-bold text-[#1a1d2e] text-sm mb-2">{card.title}</h3>
                <p className="text-[#8b8fa8] text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-20 px-6 bg-[#f5f6fa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#4361ee] text-xs font-bold uppercase tracking-widest">كيف يعمل النظام</span>
            <h2 className="text-3xl font-black text-[#1a1d2e] mt-2">ثلاث خطوات تتحكم فيها كل شيء</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '01', icon: '🔐', title: 'شفّر محلياً', desc: 'حمّل تطبيق Publisher على جهازك. الملف يُشفَّر بـ AES-256 بدون مغادرة جهازك — السيرفر لا يرى الملف الأصلي أبداً.', tag: 'Writer App' },
              { num: '02', icon: '🖥️', title: 'تحكم من لوحتك', desc: 'من المتصفح مباشرة: أضف عملاءك، حدد من يفتح ماذا، على كم جهاز، وحتى متى. يمكنك إلغاء الإذن بنقرة واحدة في أي وقت.', tag: 'Admin Panel' },
              { num: '03', icon: '📖', title: 'العميل يقرأ بإذن', desc: 'العميل يثبّت تطبيق Viewer ويضع رخصته. عند كل فتح يتحقق التطبيق من السيرفر — إذا سحبت الإذن، لن يُفتح الملف فوراً.', tag: 'Viewer App' },
            ].map((step) => (
              <div key={step.num} className="drm-card p-8 relative overflow-hidden hover:-translate-y-1 transition-transform">
                <span className="absolute top-4 left-5 font-black font-mono"
                  style={{ fontSize: '3.5rem', color: 'rgba(67,97,238,0.08)', lineHeight: 1 }}>
                  {step.num}
                </span>
                <div className="w-14 h-14 bg-[#e8f0ff] rounded-xl flex items-center justify-center text-2xl mb-4 mt-6">
                  {step.icon}
                </div>
                <h3 className="font-bold text-[#1a1d2e] text-lg mb-2">{step.title}</h3>
                <p className="text-[#8b8fa8] text-sm leading-relaxed mb-4">{step.desc}</p>
                <span className="text-xs bg-[#f5f6fa] text-[#8b8fa8] border border-gray-200 px-3 py-1 rounded-full font-mono">{step.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#4361ee] text-xs font-bold uppercase tracking-widest">المميزات</span>
            <h2 className="text-3xl font-black text-[#1a1d2e] mt-2">تحكم كامل، حماية حقيقية</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🔒', title: 'تشفير محلي كامل',        desc: 'الملف يُشفَّر على جهاز الناشر، السيرفر لا يرى الملف الأصلي أبداً.' },
              { icon: '⏱️', title: 'صلاحيات بتاريخ انتهاء',  desc: 'حدد تاريخ بدء وانتهاء وصول كل عميل لكل منشور بشكل مستقل.' },
              { icon: '💻', title: 'تحكم في الأجهزة',        desc: 'اسمح لعميل أن يفتح الملف على جهاز واحد أو اثنين أو ثلاثة فقط.' },
              { icon: '💧', title: 'علامة مائية ديناميكية',  desc: 'اسم العميل يُطبَع تلقائياً على كل صفحة — فإذا سرّب، تعرف مَن هو فوراً.' },
              { icon: '⛔', title: 'حظر فوري',               desc: 'اشتبهت بعميل؟ احظره بنقرة — الملف لن يُفتح عنده من اللحظة ذاتها.' },
              { icon: '📦', title: 'منشورات وتجميعات',       desc: 'جمّع عدة ملفات في منشور واحد وامنح العميل وصولاً للمجموعة دفعة واحدة.' },
            ].map((f, i) => (
              <div key={i} className="drm-card p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#e8f0ff] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1d2e] text-sm mb-1">{f.title}</h3>
                  <p className="text-[#8b8fa8] text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#1a1d2e] py-24 px-6 text-center">
        <h2 className="text-3xl font-black text-white mb-4">جاهز لحماية محتواك؟</h2>
        <p className="text-[#8b8fa8] mb-12 max-w-md mx-auto leading-relaxed">
          انضم اليوم وابدأ بتشفير مستنداتك وإدارة تراخيصك في دقائق.
        </p>
        <div className="flex justify-center gap-5 flex-wrap">
          <Link to="/publisher/register"
            className="flex flex-col items-center gap-3 bg-[#2d3154] hover:bg-[#4361ee] border border-white/10 hover:border-[#4361ee] text-white px-10 py-7 rounded-2xl transition-all group min-w-[220px]">
            <span className="text-4xl">🚀</span>
            <span className="font-bold text-base">أنا ناشر جديد</span>
            <span className="text-[#8b8fa8] group-hover:text-white/70 text-xs">أريد حماية مستنداتي</span>
            <span className="mt-2 bg-[#4361ee] group-hover:bg-white group-hover:text-[#4361ee] text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all">
              إنشاء حساب مجاناً ←
            </span>
          </Link>
          <Link to="/login"
            className="flex flex-col items-center gap-3 bg-[#2d3154] hover:bg-[#2d3154]/80 border border-white/10 text-white px-10 py-7 rounded-2xl transition-all group min-w-[220px]">
            <span className="text-4xl">🔑</span>
            <span className="font-bold text-base">لدي حساب بالفعل</span>
            <span className="text-[#8b8fa8] group-hover:text-white/70 text-xs">أريد الوصول للوحة الإدارة</span>
            <span className="mt-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all">
              تسجيل الدخول ←
            </span>
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1a1d2e] border-t border-white/5 py-6 px-8">
        <div className="flex justify-between flex-wrap gap-4 text-[#5a5f7e] text-xs max-w-5xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-base">🔐</span>
            <span className="text-white font-semibold">SecureDocs</span>
            <span>— جميع الحقوق محفوظة © 2026</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a>
            <a href="#" className="hover:text-white transition-colors">تواصل معنا</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
