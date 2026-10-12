import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temporarily Suspended | Sawariya Event',
  description: 'Sawariya Event is temporarily unavailable. Please contact the service provider for assistance.',
  robots: { index: false, follow: false },
};

export default function SuspendedPage() {
  return (
    <main className="suspended-page">
      <div className="suspended-card">
        <div className="brand-mark" aria-hidden="true">S</div>
        <p className="eyebrow">SAWARIYA EVENT</p>
        <div className="divider"><span /></div>
        <h1>Website Temporarily <em>Suspended</em></h1>
        <p className="lead">This website has been temporarily suspended due to pending payment.</p>
        <p className="details">To restore access or request assistance, please contact the website administrator.</p>
        <div className="status"><span className="status-dot" /> TEMPORARY SERVICE INTERRUPTION</div>
        <footer>Service Provider <strong>OPALSTAYS HOSPITALITY</strong></footer>
      </div>
      <style>{`
        * { box-sizing: border-box; }
        .suspended-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 28px; background: radial-gradient(ellipse at top, #152a58 0%, #07142f 52%, #030916 100%); color: #f8f5ed; font-family: Arial, Helvetica, sans-serif; }
        .suspended-card { width: min(100%, 760px); text-align: center; padding: clamp(32px, 7vw, 76px); border: 1px solid rgba(201,148,46,.45); background: rgba(5,16,39,.72); box-shadow: 0 28px 90px rgba(0,0,0,.28); position: relative; }
        .brand-mark { width: 58px; height: 58px; display: grid; place-items: center; margin: 0 auto 18px; border: 1px solid #c9942e; color: #e8c36b; font: 34px Georgia, serif; }
        .eyebrow { color: #e8c36b; letter-spacing: .28em; font-size: 11px; font-weight: 700; margin: 28px 0 18px; }
        .divider { display: flex; align-items: center; gap: 12px; justify-content: center; margin: 0 auto 30px; }
        .divider::before, .divider::after { content: ''; height: 1px; width: 54px; background: rgba(232,195,107,.55); }
        .divider span { width: 6px; height: 6px; background: #e8c36b; transform: rotate(45deg); }
        h1 { font: 500 clamp(34px, 6vw, 58px)/1.12 Georgia, 'Times New Roman', serif; margin: 0 auto 22px; max-width: 620px; }
        h1 em { color: #e8c36b; font-weight: 400; }
        .lead { max-width: 520px; margin: 0 auto 14px; font-size: clamp(15px, 2vw, 18px); line-height: 1.8; color: rgba(248,245,237,.9); }
        .details { max-width: 500px; margin: 0 auto; color: #b9c1d2; font-size: 14px; line-height: 1.8; }
        .status { display: inline-flex; align-items: center; gap: 9px; margin-top: 36px; padding: 11px 14px; border: 1px solid rgba(232,195,107,.28); color: #e8c36b; font-size: 9px; letter-spacing: .15em; font-weight: 700; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #c9942e; }
        footer { margin-top: 42px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.12); color: #aeb7c9; font-size: 11px; letter-spacing: .08em; }
        footer strong { display: block; color: #f8f5ed; font-size: 12px; letter-spacing: .16em; margin-top: 8px; }
        @media (max-width: 480px) { .suspended-page { padding: 16px; } .suspended-card { padding: 34px 22px; } }
      `}</style>
    </main>
  );
}
