import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div dir="rtl" style={{ minHeight: '100vh', backgroundColor: '#f5f6fa', fontFamily: 'Arial, sans-serif' }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{ background: '#006775', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#4361ee', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            🔐
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>SecureDocs</div>
            <div style={{ color: '#8b8fa8', fontSize: 11 }}>DRM Platform</div>
          </div>
        </div>
        <div style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="#how" style={{ color: '#9499b8', textDecoration: 'none', fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 8 }}>
            كيف يعمل؟
          </a>
          <Link to="/login" style={{ color: '#9499b8', textDecoration: 'none', fontSize: 13, fontWeight: 500, padding: '8px 14px', borderRadius: 8 }}>
            تسجيل الدخول
          </Link>
          <Link to="/publisher/register" style={{ background: '#009cad', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600, padding: '9px 20px', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,156,173,0.4)' }}>
            إنشاء حساب
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section style={{ background: 'linear-gradient(135deg, #006775 0%, #008b9c 50%, #009cad 100%)', padding: '80px 24px', textAlign: 'center', color: '#fff' }}>
        <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, padding: '4px 16px', borderRadius: 50, marginBottom: 24, letterSpacing: 2, textTransform: 'uppercase' }}>
          منصة حماية المحتوى الرقمي
        </span>
        <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 20, lineHeight: 1.2 }}>
          ملفاتك لا تُفتح<br />
          <span style={{ color: '#ffd166' }}>إلا بإذنك أنت</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
          شفّر مستنداتك PDF محلياً على جهازك، وتحكم من يفتحها، على أي جهاز، ولكم من الوقت.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link to="/publisher/register" style={{ background: '#fff', color: '#009cad', textDecoration: 'none', fontWeight: 700, padding: '12px 32px', borderRadius: 12, fontSize: 15, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            أنشئ حساب مجاناً ←
          </Link>
          <a href="#how" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff', textDecoration: 'none', fontWeight: 600, padding: '12px 32px', borderRadius: 12, fontSize: 15 }}>
            كيف يعمل؟
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          <span>✓ التشفير يحدث على جهازك فقط</span>
          <span>✓ لا رفع للملف الأصلي</span>
          <span>✓ رخصة تجريبية فور التسجيل</span>
        </div>

        {/* Flow */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 56 }}>
          {[{ icon: '🔐', title: 'تطبيق التشفير', sub: 'يشفّر الملف محلياً' }, null,
            { icon: '🖥️', title: 'لوحة الإدارة', sub: 'تتحكم بالصلاحيات' }, null,
            { icon: '📖', title: 'تطبيق القارئ', sub: 'يفتح بإذن فقط' }]
            .map((s, i) => s === null
              ? <span key={i} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 22 }}>→</span>
              : <div key={i} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '16px 20px', textAlign: 'center', width: 150 }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{s.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>{s.sub}</div>
                </div>
            )}
        </div>
      </section>

      {/* ===== SECURITY STRIP ===== */}
      <div style={{ background: '#e6f5f6', borderTop: '1px solid rgba(0,156,173,0.15)', borderBottom: '1px solid rgba(0,156,173,0.15)', padding: '14px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
          {[{ icon: '🔒', label: 'AES-256 تشفير' }, { icon: '🗝️', label: 'RSA مفاتيح عامة وخاصة' }, { icon: '💻', label: 'تحكم بالأجهزة' }, { icon: '⏱️', label: 'صلاحيات بتوقيت محدد' }, { icon: '💧', label: 'علامة مائية ديناميكية' }]
            .map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#009cad', fontSize: 13, fontWeight: 600 }}>
                <span>{item.icon}</span><span>{item.label}</span>
              </div>
            ))}
        </div>
      </div>

      {/* ===== PROBLEM ===== */}
      <section style={{ padding: '72px 24px', background: '#fff', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: '#e63946', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>المشكلة</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#1a1d2e', marginTop: 8 }}>لماذا مشاركة PDF العادية خطيرة؟</h2>
          </div>
          <div className="row g-4">
            {[{ icon: '💨', title: 'التسريب في ثوانِ', desc: 'الملف يُرسَل بالواتساب أو يُرفَع للإنترنت قبل أن تعلم.' },
              { icon: '🕵️', title: 'لا تعرف مَن سرّب', desc: 'عشرة عملاء فتحوا الملف — لكن من سرّب؟ لا أحد يعرف.' },
              { icon: '♾️', title: 'لا نهاية للوصول', desc: 'العميل ألغى اشتراكه لكن الملف لا يزال يُفتح إلى الأبد.' },
              { icon: '📱', title: 'كل الأجهزة مسموحة', desc: 'الملف اشتراه شخص واحد يُفتح على عشرين جهازاً.' }]
              .map((card, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="drm-card p-4 h-100">
                    <div style={{ width: 44, height: 44, background: '#fdecea', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 14 }}>{card.icon}</div>
                    <h6 style={{ fontWeight: 700, color: '#1a1d2e', marginBottom: 8 }}>{card.title}</h6>
                    <p style={{ color: '#8b8fa8', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{card.desc}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" style={{ padding: '72px 24px', background: '#f5f6fa' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: '#009cad', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>كيف يعمل النظام</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#006775', marginTop: 8 }}>ثلاث خطوات تتحكم فيها كل شيء</h2>
          </div>
          <div className="row g-4">
            {[{ num: '01', icon: '🔐', title: 'شفّر محلياً', desc: 'حمّل تطبيق Publisher. الملف يُشفَّر بـ AES-256 بدون مغادرة جهازك — السيرفر لا يرى الملف الأصلي أبداً.', tag: 'Writer App' },
              { num: '02', icon: '🖥️', title: 'تحكم من لوحتك', desc: 'من المتصفح: أضف عملاءك، حدد من يفتح ماذا، على كم جهاز، وحتى متى. إلغاء الإذن بنقرة واحدة.', tag: 'Admin Panel' },
              { num: '03', icon: '📖', title: 'العميل يقرأ بإذن', desc: 'يثبّت تطبيق Viewer ويضع رخصته. عند كل فتح يتحقق من السيرفر — إذا سحبت الإذن لن يُفتح فوراً.', tag: 'Viewer App' }]
              .map((step) => (
                <div key={step.num} className="col-12 col-md-4">
                  <div className="drm-card p-4 h-100" style={{ position: 'relative', overflow: 'hidden' }}>
                    <span style={{ position: 'absolute', top: 8, left: 12, fontSize: 56, fontWeight: 900, color: 'rgba(0,156,173,0.07)', lineHeight: 1, fontFamily: 'monospace' }}>{step.num}</span>
                    <div style={{ width: 56, height: 56, background: '#e6f5f6', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16, marginTop: 24 }}>{step.icon}</div>
                    <h5 style={{ fontWeight: 700, color: '#006775', marginBottom: 8 }}>{step.title}</h5>
                    <p style={{ color: '#8b8fa8', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{step.desc}</p>
                    <span style={{ fontSize: 11, background: '#f5f6fa', color: '#8b8fa8', border: '1px solid #e9ecef', padding: '4px 12px', borderRadius: 50, fontFamily: 'monospace' }}>{step.tag}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section style={{ padding: '72px 24px', background: '#fff', borderTop: '1px solid #e9ecef', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: '#009cad', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>المميزات</span>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#006775', marginTop: 8 }}>تحكم كامل، حماية حقيقية</h2>
          </div>
          <div className="row g-3">
            {[{ icon: '🔒', title: 'تشفير محلي كامل', desc: 'الملف يُشفَّر على جهاز الناشر، السيرفر لا يرى الملف الأصلي أبداً.' },
              { icon: '⏱️', title: 'صلاحيات بتاريخ انتهاء', desc: 'حدد تاريخ بدء وانتهاء وصول كل عميل لكل منشور.' },
              { icon: '💻', title: 'تحكم في الأجهزة', desc: 'اسمح لعميل بفتح الملف على جهاز واحد أو اثنين فقط.' },
              { icon: '💧', title: 'علامة مائية ديناميكية', desc: 'اسم العميل يُطبَع تلقائياً على كل صفحة — فإذا سرّب، تعرف مَن هو فوراً.' },
              { icon: '⛔', title: 'حظر فوري', desc: 'اشتبهت بعميل؟ احظره بنقرة — الملف لن يُفتح عنده فوراً.' },
              { icon: '📦', title: 'منشورات وتجميعات', desc: 'جمّع عدة ملفات في منشور واحد وامنح الوصول دفعة واحدة.' }]
              .map((f, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4">
                  <div className="drm-card p-4 h-100" style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#e6f5f6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                    <div>
                      <h6 style={{ fontWeight: 700, color: '#006775', marginBottom: 6 }}>{f.title}</h6>
                      <p style={{ color: '#8b8fa8', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background: '#006775', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 12 }}>جاهز لحماية محتواك؟</h2>
        <p style={{ color: '#8b8fa8', marginBottom: 48, maxWidth: 420, margin: '0 auto 48px', lineHeight: 1.7 }}>
          انضم اليوم وابدأ بتشفير مستنداتك وإدارة تراخيصك في دقائق.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {[{ to: '/publisher/register', icon: '🚀', title: 'أنا ناشر جديد', sub: 'أريد حماية مستنداتي', btn: 'إنشاء حساب مجاناً ←', primary: true },
            { to: '/login', icon: '🔑', title: 'لدي حساب بالفعل', sub: 'أريد الوصول للوحة الإدارة', btn: 'تسجيل الدخول ←', primary: false }]
            .map((c) => (
              <Link key={c.to} to={c.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: '#008b9c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', padding: '28px 40px', borderRadius: 20, minWidth: 220 }}>
                <span style={{ fontSize: 40 }}>{c.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{c.title}</span>
                <span style={{ color: '#dcf0f2', fontSize: 12 }}>{c.sub}</span>
                <span style={{ marginTop: 8, background: c.primary ? '#fff' : 'rgba(255,255,255,0.1)', color: c.primary ? '#008b9c' : '#fff', fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 10 }}>{c.btn}</span>
              </Link>
            ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#005461', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, color: '#8ecacc', fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>🔐</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>SecureDocs</span>
            <span>— جميع الحقوق محفوظة © 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#" style={{ color: '#5a5f7e', textDecoration: 'none' }}>سياسة الخصوصية</a>
            <a href="#" style={{ color: '#5a5f7e', textDecoration: 'none' }}>شروط الاستخدام</a>
            <a href="#" style={{ color: '#5a5f7e', textDecoration: 'none' }}>تواصل معنا</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
