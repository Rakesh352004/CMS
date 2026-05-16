import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/* ─── Google Fonts ───────────────────────────────────────────────────────── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');`;

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Hide scrollbar while keeping scroll functionality */
  .page::-webkit-scrollbar { display: none; }
  .page { -ms-overflow-style: none; scrollbar-width: none; }

  :root {
    --bg:          #07090F;
    --bg-2:        #0C0F1A;
    --bg-card:     rgba(12,15,26,0.90);
    --bg-hover:    rgba(255,255,255,0.026);
    --border:      rgba(255,255,255,0.06);
    --border-hi:   rgba(255,255,255,0.11);
    --teal:        #00D4B8;
    --teal-dim:    rgba(0,212,184,0.10);
    --amber:       #F59E0B;
    --amber-dim:   rgba(245,158,11,0.10);
    --green:       #34D399;
    --green-dim:   rgba(52,211,153,0.10);
    --blue:        #60A5FA;
    --blue-dim:    rgba(96,165,250,0.10);
    --purple:      #A78BFA;
    --purple-dim:  rgba(167,139,250,0.10);
    --red:         #F87171;
    --red-dim:     rgba(248,113,113,0.09);
    --red-border:  rgba(248,113,113,0.22);
    --text:        #E2E8F0;
    --text-2:      #94A3B8;
    --text-3:      #475569;
    --sw:          248px;
    --th:          62px;
    --r:           12px;
    --rs:          8px;
  }

  body { background: var(--bg); }

  .ad-root {
    display: flex; flex-direction: column; min-height: 100vh;
    background: var(--bg); color: var(--text);
    font-family: 'Syne', sans-serif; overflow: hidden;
    position: relative;
  }

  .ad-root::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,212,184,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,184,0.02) 1px, transparent 1px);
    background-size: 52px 52px; pointer-events: none; z-index: 0;
  }

  .glow {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
  }
  .glow-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,212,184,0.05) 0%, transparent 65%);
    top: -180px; left: -180px;
  }
  .glow-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(96,165,250,0.035) 0%, transparent 65%);
    bottom: -100px; right: -100px;
  }

  /* ── Sidebar ── */
  .sidebar {
    position: static; width: 100%;
    background: rgba(7,9,15,0.97);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(32px);
    display: flex; flex-direction: row; align-items: center; z-index: 200;
    overflow-x: auto; padding: 0; flex-wrap: nowrap;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .sidebar::-webkit-scrollbar {
    display: none;
  }

  .brand {
    padding: 0 22px; border: none;
    display: flex; align-items: center; gap: 12px; flex-shrink: 0; height: var(--th);
  }
  .brand-logo {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #00D4B8, #00B89E);
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 0 18px rgba(0,212,184,0.25);
    color: #07090F;
  }
  .brand-name { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
  .brand-tag {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal);
  }

  .nav-area { padding: 0 12px; display: flex; flex-direction: row; gap: 2px; flex: 1; align-items: center; }
  .nav-label {
    font-family: 'DM Mono', monospace; font-size: 9px;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-3); padding: 0 10px; margin: 0; display: none;
  }

  .nav-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    color: var(--text-2); font-size: 13.5px; font-weight: 600;
    cursor: pointer; transition: all 0.16s ease;
    border: 1px solid transparent; user-select: none;
  }
  .nav-btn:hover { background: var(--bg-hover); color: var(--text); border-color: var(--border); }
  .nav-btn.active { background: var(--teal-dim); color: var(--teal); border-color: rgba(0,212,184,0.2); }
  .nav-badge {
    margin-left: auto; min-width: 20px; padding: 2px 7px;
    background: var(--amber-dim); color: var(--amber);
    border: 1px solid rgba(245,158,11,0.25);
    font-family: 'DM Mono', monospace; font-size: 10px;
    border-radius: 20px; text-align: center;
  }

  .nav-foot { padding: 0; border: none; display: none; }
  .logout-btn {
    display: none;
  }
  .logout-btn:hover { display: none; }

  /* ── Main ── */
  .main { margin-left: 0; flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; overflow: hidden; }

  /* ── Topbar ── */
  .topbar {
    position: sticky; top: 0; z-index: 100; height: var(--th);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 36px;
    background: rgba(7,9,15,0.82); backdrop-filter: blur(24px);
    border-bottom: 1px solid var(--border);
  }
  .breadcrumb {
    font-family: 'DM Mono', monospace; font-size: 11px;
    color: var(--text-3); letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 8px;
  }
  .breadcrumb .accent { color: var(--teal); }
  .breadcrumb .page   { color: var(--text-2); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .last-refresh { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-3); }
  .refresh-btn {
    display: flex; align-items: center; gap: 6px; padding: 7px 14px;
    border-radius: var(--rs); background: transparent;
    border: 1px solid var(--border); color: var(--text-2);
    font-family: 'DM Mono', monospace; font-size: 11px;
    cursor: pointer; transition: all 0.16s;
  }
  .refresh-btn:hover { border-color: var(--border-hi); color: var(--text); }
  .refresh-btn.spin svg { animation: doSpin 0.7s linear infinite; }
  .status-pill {
    display: flex; align-items: center; gap: 7px; padding: 7px 14px;
    border-radius: var(--rs); background: var(--teal-dim);
    border: 1px solid rgba(0,212,184,0.18);
    font-family: 'DM Mono', monospace; font-size: 11px; color: var(--teal);
  }
  .dot-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  /* ── Page ── */
  .page { padding: 36px; flex: 1; overflow-y: auto; animation: pgIn 0.28s ease; }
  @keyframes pgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .ph { margin-bottom: 32px; }
  .eyebrow { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--teal); margin-bottom: 8px; }
  .ptitle { font-size: 28px; font-weight: 800; letter-spacing: -.025em; }
  .psub { font-family: 'DM Mono', monospace; font-size: 11.5px; color: var(--text-3); margin-top: 7px; line-height: 1.6; }

  /* ── Stats ── */
  .stats { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; margin-bottom: 28px; }
  .stat {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--r); padding: 20px; backdrop-filter: blur(12px);
    transition: all .18s; cursor: default; position: relative; overflow: hidden;
  }
  .stat:hover { border-color: var(--border-hi); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.3); }
  .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .stat-lbl { font-family: 'DM Mono', monospace; font-size: 9.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); }
  .stat-ico { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
  .stat-val { font-size: 34px; font-weight: 800; letter-spacing: -.03em; line-height: 1; }
  .stat-foot { font-family: 'DM Mono', monospace; font-size: 9.5px; color: var(--text-3); margin-top: 6px; }
  .stat-shim { position: absolute; top: 0; right: 0; width: 70px; height: 70px; border-radius: 50%; transform: translate(25%,-25%); opacity: .08; }

  .ic-teal   { background: var(--teal-dim); color: var(--teal); }
  .ic-amber  { background: var(--amber-dim); color: var(--amber); }
  .ic-green  { background: var(--green-dim); color: var(--green); }
  .ic-blue   { background: var(--blue-dim); color: var(--blue); }
  .ic-purple { background: var(--purple-dim); color: var(--purple); }
  .vc-teal   { color: var(--teal); }
  .vc-amber  { color: var(--amber); }
  .vc-green  { color: var(--green); }
  .vc-blue   { color: var(--blue); }
  .vc-purple { color: var(--purple); }

  /* ── Grid ── */
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .g32 { display: grid; grid-template-columns: 2fr 1fr; gap: 18px; }

  /* ── Card ── */
  .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; backdrop-filter: blur(12px); }
  .card + .card { margin-top: 18px; }
  .card-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--border); }
  .card-title { font-size: 14px; font-weight: 700; }
  .card-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-3); margin-top: 2px; }
  .pill { font-family: 'DM Mono', monospace; font-size: 10px; padding: 4px 10px; border-radius: 20px; background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(0,212,184,0.18); }

  /* ── Bar chart ── */
  .chart-wrap { padding: 20px 22px; }
  .bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .bar-row:last-child { margin-bottom: 0; }
  .bar-lbl { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-3); width: 74px; text-align: right; flex-shrink: 0; }
  .bar-track { flex: 1; height: 8px; background: rgba(255,255,255,0.05); border-radius: 20px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 20px; transition: width .8s cubic-bezier(.4,0,.2,1); }
  .bar-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-2); width: 22px; text-align: right; flex-shrink: 0; }

  /* ── Ring ── */
  .ring-wrap { display: flex; align-items: center; justify-content: center; padding: 28px; gap: 28px; }
  .ring-stat { display: flex; flex-direction: column; margin-bottom: 8px; }
  .ring-val { font-size: 22px; font-weight: 800; }
  .ring-lbl { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); margin-top: 2px; }

  /* ── Activity ── */
  .act-row { display: flex; align-items: flex-start; gap: 14px; padding: 15px 22px; border-bottom: 1px solid var(--border); transition: background .15s; }
  .act-row:last-child { border-bottom: none; }
  .act-row:hover { background: var(--bg-hover); }
  .act-dot { width: 7px; height: 7px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .act-title { font-size: 13px; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .act-meta { font-family: 'DM Mono', monospace; font-size: 10.5px; color: var(--text-3); }

  /* ── Status badge ── */
  .sb { font-family: 'DM Mono', monospace; font-size: 9.5px; font-weight: 500; padding: 4px 9px; border-radius: 6px; letter-spacing: .04em; white-space: nowrap; }
  .sb.pending  { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(245,158,11,.2); }
  .sb.progress { background: var(--teal-dim);  color: var(--teal);  border: 1px solid rgba(0,212,184,.2); }
  .sb.resolved { background: var(--green-dim); color: var(--green); border: 1px solid rgba(52,211,153,.2); }
  .sb.closed   { background: rgba(148,163,184,.08); color: var(--text-2); border: 1px solid rgba(148,163,184,.12); }

  /* ── Toolbar ── */
  .toolbar { display: flex; align-items: center; gap: 10px; padding: 16px 22px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  .srch-wrap { position: relative; flex: 1; min-width: 200px; }
  .srch-ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
  .srch-inp {
    width: 100%; padding: 9px 12px 9px 36px;
    background: rgba(0,0,0,.3); border: 1px solid var(--border);
    border-radius: var(--rs); color: var(--text);
    font-family: 'DM Mono', monospace; font-size: 12px; outline: none; transition: border-color .18s;
  }
  .srch-inp::placeholder { color: var(--text-3); }
  .srch-inp:focus { border-color: rgba(0,212,184,.35); }

  .ftabs { display: flex; gap: 4px; background: rgba(0,0,0,.25); padding: 4px; border-radius: 9px; border: 1px solid var(--border); flex-wrap: wrap; }
  .ftab { padding: 6px 12px; border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); cursor: pointer; transition: all .15s; border: 1px solid transparent; white-space: nowrap; }
  .ftab:hover { color: var(--text); }
  .ftab.on { background: var(--teal-dim); color: var(--teal); border-color: rgba(0,212,184,.2); }

  .sort-sel {
    padding: 9px 30px 9px 14px; background: rgba(0,0,0,.3);
    border: 1px solid var(--border); border-radius: var(--rs);
    color: var(--text-2); font-family: 'DM Mono', monospace; font-size: 11px;
    outline: none; cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 stroke%3D%22%2394A3B8%22 stroke-width%3D%222%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22/%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat; background-position: right 10px center; background-size: 12px;
  }
  .sort-sel option { background: #131620; }

  .export-btn {
    display: flex; align-items: center; gap: 6px; padding: 9px 14px;
    border-radius: var(--rs); background: var(--teal-dim);
    border: 1px solid rgba(0,212,184,.22); color: var(--teal);
    font-family: 'DM Mono', monospace; font-size: 11px;
    cursor: pointer; transition: all .16s; white-space: nowrap;
  }
  .export-btn:hover { background: rgba(0,212,184,.16); border-color: rgba(0,212,184,.38); }

  /* ── Bulk bar ── */
  .bulk-bar { display: flex; align-items: center; gap: 12px; padding: 12px 22px; background: rgba(0,212,184,.06); border-bottom: 1px solid rgba(0,212,184,.15); animation: pgIn .2s ease; flex-wrap: wrap; }
  .bulk-count { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--teal); }
  .bulk-acts { display: flex; gap: 8px; margin-left: auto; flex-wrap: wrap; }
  .bbtn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: var(--rs); font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; transition: all .15s; border: 1px solid; white-space: nowrap; }
  .bbtn.res   { background: var(--green-dim); color: var(--green); border-color: rgba(52,211,153,.25); }
  .bbtn.res:hover { background: rgba(52,211,153,.18); }
  .bbtn.prog  { background: var(--teal-dim); color: var(--teal); border-color: rgba(0,212,184,.25); }
  .bbtn.prog:hover { background: rgba(0,212,184,.18); }
  .bbtn.del   { background: var(--red-dim); color: var(--red); border-color: var(--red-border); }
  .bbtn.del:hover { background: rgba(248,113,113,.16); }
  .bbtn.clr   { background: transparent; color: var(--text-3); border-color: var(--border); }
  .bbtn.clr:hover { color: var(--text); border-color: var(--border-hi); }

  /* ── Select-all row ── */
  .sel-all-row { display: flex; align-items: center; gap: 10px; padding: 10px 22px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,.15); }
  .sel-all-info { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-3); letter-spacing: .06em; }

  input[type="checkbox"].ck {
    width: 16px; height: 16px; cursor: pointer; appearance: none;
    background: rgba(0,0,0,.3); border: 1px solid var(--border-hi);
    border-radius: 4px; outline: none; transition: all .15s; flex-shrink: 0;
  }
  input[type="checkbox"].ck:checked {
    background: var(--teal); border-color: var(--teal);
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 12 12%22 fill%3D%22none%22 stroke%3D%22%2307090F%22 stroke-width%3D%222%22%3E%3Cpolyline points%3D%221.5 6 4.5 9 10.5 3%22/%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat; background-position: center; background-size: 10px;
  }

  /* ── Complaint row ── */
  .crow { border-bottom: 1px solid var(--border); transition: background .15s; }
  .crow:last-child { border-bottom: none; }
  .crow:hover { background: var(--bg-hover); }
  .crow.sel { background: rgba(0,212,184,.04); border-left: 2px solid rgba(0,212,184,.35); }

  .crow-main { display: flex; align-items: flex-start; gap: 14px; padding: 18px 22px; }
  .crow-body { flex: 1; min-width: 0; }
  .crow-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .crow-desc { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-2); line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .crow-desc.exp { -webkit-line-clamp: unset; display: block; }
  .crow-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 5px; background: rgba(0,0,0,.28); border: 1px solid var(--border); font-family: 'DM Mono', monospace; font-size: 10.5px; color: var(--text-3); }
  .exp-btn { background: none; border: none; color: var(--teal); font-family: 'DM Mono', monospace; font-size: 10px; cursor: pointer; padding: 3px 0; letter-spacing: .04em; }
  .exp-btn:hover { text-decoration: underline; }

  .crow-acts { display: flex; flex-direction: column; gap: 8px; min-width: 148px; }

  .ss {
    appearance: none; width: 100%; padding: 8px 28px 8px 11px;
    border-radius: var(--rs); font-family: 'DM Mono', monospace; font-size: 11px;
    cursor: pointer; outline: none; transition: all .18s;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2212%22 height%3D%2212%22 viewBox%3D%220 0 24 24%22 fill%3D%22none%22 stroke%3D%22%2394A3B8%22 stroke-width%3D%222%22%3E%3Cpolyline points%3D%226 9 12 15 18 9%22/%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat; background-position: right 9px center; background-size: 11px;
  }
  .ss option { background: #131620; color: var(--text); }
  .ss.pending  { background-color: var(--amber-dim); border: 1px solid rgba(245,158,11,.3); color: var(--amber); }
  .ss.progress { background-color: var(--teal-dim);  border: 1px solid rgba(0,212,184,.3);  color: var(--teal); }
  .ss.resolved { background-color: var(--green-dim); border: 1px solid rgba(52,211,153,.3); color: var(--green); }
  .ss.closed   { background-color: rgba(148,163,184,.08); border: 1px solid rgba(148,163,184,.2); color: var(--text-2); }

  .del-btn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 8px; border-radius: var(--rs); background: var(--red-dim); border: 1px solid var(--red-border); color: var(--red); font-family: 'DM Mono', monospace; font-size: 10.5px; cursor: pointer; transition: all .16s; }
  .del-btn:hover { background: rgba(248,113,113,.16); border-color: rgba(248,113,113,.38); }

  /* ── Pagination ── */
  .pager { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-top: 1px solid var(--border); flex-wrap: wrap; gap: 10px; }
  .pager-info { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); }
  .pager-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .pbtn { padding: 6px 14px; border-radius: var(--rs); background: rgba(0,0,0,.25); border: 1px solid var(--border); color: var(--text-2); font-family: 'DM Mono', monospace; font-size: 11px; cursor: pointer; transition: all .15s; }
  .pbtn:hover:not(:disabled) { border-color: var(--border-hi); color: var(--text); }
  .pbtn:disabled { opacity: .35; cursor: not-allowed; }
  .pbtn.cur { background: var(--teal-dim); color: var(--teal); border-color: rgba(0,212,184,.2); }

  /* ── Users ── */
  .urow { display: flex; align-items: center; gap: 14px; padding: 15px 22px; border-bottom: 1px solid var(--border); transition: background .15s; }
  .urow:last-child { border-bottom: none; }
  .urow:hover { background: var(--bg-hover); }
  .avatar { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; flex-shrink: 0; }
  .av-a { background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(0,212,184,.2); }
  .av-u { background: rgba(148,163,184,.08); color: var(--text-2); border: 1px solid var(--border); }
  .uname { font-size: 13.5px; font-weight: 700; margin-bottom: 2px; }
  .uemail { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .uright { display: flex; gap: 8px; align-items: center; }
  .uccount { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text-3); padding: 3px 8px; border-radius: 5px; background: rgba(0,0,0,.25); border: 1px solid var(--border); white-space: nowrap; }
  .rbadge { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; }
  .rb-a { background: var(--teal-dim); color: var(--teal); border: 1px solid rgba(0,212,184,.18); }
  .rb-u { background: rgba(148,163,184,.08); color: var(--text-2); border: 1px solid var(--border); }

  /* ── Settings ── */
  .s-section { padding: 22px; border-bottom: 1px solid var(--border); }
  .s-section:last-child { border-bottom: none; }
  .s-title { font-size: 13px; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .s-row { display: flex; align-items: center; justify-content: space-between; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.04); }
  .s-row:last-child { border-bottom: none; }
  .s-key { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-3); }
  .s-val { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text-2); }
  .s-val.t { color: var(--teal); }
  .dzone-btn { display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: var(--rs); background: var(--red-dim); border: 1px solid var(--red-border); color: var(--red); font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all .16s; margin-top: 4px; }
  .dzone-btn:hover { background: rgba(248,113,113,.16); }

  /* ── Loader / Empty ── */
  .loader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 40px; color: var(--text-3); font-family: 'DM Mono', monospace; font-size: 11px; gap: 14px; }
  .spinner { width: 26px; height: 26px; border: 2px solid rgba(0,212,184,.12); border-top-color: var(--teal); border-radius: 50%; animation: doSpin .7s linear infinite; }
  @keyframes doSpin { to { transform: rotate(360deg); } }
  .empty-ico { font-size: 30px; opacity: .3; }
  .no-results { padding: 40px 22px; text-align: center; font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-3); }

  /* ── Modal ── */
  .overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.65); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; animation: fadeO .2s ease; }
  @keyframes fadeO { from{opacity:0} to{opacity:1} }
  .modal { background: var(--bg-2); border: 1px solid var(--border-hi); border-radius: 16px; padding: 32px; max-width: 420px; width: 90%; box-shadow: 0 24px 64px rgba(0,0,0,.6); animation: modalIn .22s cubic-bezier(.34,1.56,.64,1); }
  @keyframes modalIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  .modal-ico { width: 48px; height: 48px; border-radius: 14px; background: var(--red-dim); display: flex; align-items: center; justify-content: center; color: var(--red); margin-bottom: 20px; }
  .modal-title { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
  .modal-desc { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text-3); line-height: 1.6; margin-bottom: 24px; }
  .modal-acts { display: flex; gap: 10px; justify-content: flex-end; }
  .modal-cancel { padding: 10px 20px; border-radius: var(--rs); background: transparent; border: 1px solid var(--border); color: var(--text-2); font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all .15s; }
  .modal-cancel:hover { border-color: var(--border-hi); color: var(--text); }
  .modal-confirm { padding: 10px 20px; border-radius: var(--rs); background: var(--red-dim); border: 1px solid var(--red-border); color: var(--red); font-family: 'DM Mono', monospace; font-size: 12px; cursor: pointer; transition: all .15s; }
  .modal-confirm:hover { background: rgba(248,113,113,.18); }

  /* ── Responsive ── */
  @media (max-width: 1100px) { .stats { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 960px)  { .stats { grid-template-columns: repeat(2,1fr); } .g2,.g32 { grid-template-columns: 1fr; } }
  @media (max-width: 760px)  {
    .sidebar { flex-wrap: wrap; padding: 8px 12px; }
    .brand { padding: 0 12px; }
    .main { margin-left: 0; }
    .ad-root { flex-direction: column; }
    .stats { grid-template-columns: 1fr 1fr; }
    .page { padding: 20px; }
    .topbar { padding: 0 20px; }
    .crow-main { flex-direction: column; }
    .crow-acts { width: 100%; flex-direction: row; min-width: 0; }
    .ftabs { flex-wrap: wrap; }
  }
`;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 8;

const sCls = (s = "") => {
  const v = s.toLowerCase().replace(/\s+/g, "");
  return v === "pending" ? "pending" : v === "inprogress" ? "progress" : v === "resolved" ? "resolved" : "closed";
};

const dotClr = (s = "") => {
  const m = { pending: "#F59E0B", inprogress: "#00D4B8", resolved: "#34D399", closed: "#475569" };
  return m[s.toLowerCase().replace(/\s+/g, "")] || "#475569";
};

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const ago = (d) => {
  if (!d) return "";
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const exportCSV = (data) => {
  const rows = [
    ["ID", "Title", "Description", "Status", "User Email", "Created At"],
    ...data.map(c => [c._id, `"${(c.title || "").replace(/"/g, '""')}"`, `"${(c.description || "").replace(/"/g, '""')}"`, c.status, c.user?.email || "", c.createdAt || ""])
  ];
  const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: `complaints_${Date.now()}.csv` });
  a.click(); URL.revokeObjectURL(url);
};

/* ─── SVG Icons ──────────────────────────────────────────────────────────── */
const PATHS = {
  shield:   ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  chart:    ["M3 3v18h18", "M18 17V9", "M13 17V5", "M8 17v-3"],
  list:     ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"],
  users:    ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  settings: ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"],
  logout:   ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  trash:    ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"],
  refresh:  ["M23 4v6h-6", "M1 20v-6h6", "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"],
  export:   ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
  check:    ["M20 6L9 17l-5-5"],
  search:   ["M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0"],
  user:     ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"],
  clock:    ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  warning:  ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  tag:      ["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", "M7 7h.01"],
};

function Ico({ n, s = 15 }) {
  const d = PATHS[n] || [];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.map((p, i) => <path key={i} d={p} />)}
      {n === "user" && <circle cx="12" cy="7" r="4" />}
      {n === "users" && <circle cx="9" cy="7" r="4" />}
    </svg>
  );
}

/* ─── Confirm Modal ──────────────────────────────────────────────────────── */
function ConfirmModal({ title, desc, onConfirm, onCancel }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <div className="modal-ico"><Ico n="warning" s={22} /></div>
        <div className="modal-title">{title}</div>
        <div className="modal-desc">{desc}</div>
        <div className="modal-acts">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-confirm" onClick={onConfirm}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Analytics View ─────────────────────────────────────────────────────── */
function AnalyticsView({ complaints }) {
  const total    = complaints.length;
  const pending  = complaints.filter(c => c.status === "Pending").length;
  const inProg   = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const closed   = complaints.filter(c => c.status === "Closed").length;
  const resRate  = total > 0 ? Math.round(((resolved + closed) / total) * 100) : 0;
  const recent   = [...complaints].reverse().slice(0, 6);

  const STATS = [
    { lbl: "Total Submissions", val: total,    cls: "vc-teal",   ico: "list",    icCls: "ic-teal",   foot: "All time" },
    { lbl: "Pending Review",    val: pending,  cls: "vc-amber",  ico: "clock",   icCls: "ic-amber",  foot: "Awaiting action" },
    { lbl: "In Progress",       val: inProg,   cls: "vc-blue",   ico: "refresh", icCls: "ic-blue",   foot: "Being handled" },
    { lbl: "Resolved",          val: resolved, cls: "vc-green",  ico: "check",   icCls: "ic-green",  foot: "Successfully closed" },
    { lbl: "Closed",            val: closed,   cls: "vc-purple", ico: "tag",     icCls: "ic-purple", foot: "Archived" },
  ];
  const shims = ["#00D4B8", "#F59E0B", "#60A5FA", "#34D399", "#A78BFA"];

  const BAR_DATA = [
    { label: "Pending",     count: pending,  color: "#F59E0B" },
    { label: "In Progress", count: inProg,   color: "#60A5FA" },
    { label: "Resolved",    count: resolved, color: "#34D399" },
    { label: "Closed",      count: closed,   color: "#A78BFA" },
  ];
  const maxBar = Math.max(...BAR_DATA.map(b => b.count), 1);

  const r = 42, cx = 56, cy = 56, circ = 2 * Math.PI * r;
  const dash = (resRate / 100) * circ;

  return (
    <>
      <div className="ph">
        <p className="eyebrow">// Control Panel</p>
        <h1 className="ptitle">System Analytics</h1>
        <p className="psub">Live overview of complaint pipeline, resolution metrics and activity feed.</p>
      </div>

      <div className="stats">
        {STATS.map((s, i) => (
          <div key={s.lbl} className="stat">
            <div className="stat-shim" style={{ background: shims[i] }} />
            <div className="stat-top">
              <span className="stat-lbl">{s.lbl}</span>
              <div className={`stat-ico ${s.icCls}`}><Ico n={s.ico} s={14} /></div>
            </div>
            <div className={`stat-val ${s.cls}`}>{s.val}</div>
            <div className="stat-foot">{s.foot}</div>
          </div>
        ))}
      </div>

      <div className="g32">
        {/* Activity feed */}
        <div className="card">
          <div className="card-head">
            <div><div className="card-title">Recent Activity</div><div className="card-sub">Latest complaint submissions</div></div>
            <span className="pill">{recent.length} entries</span>
          </div>
          {recent.length === 0
            ? <div className="loader"><div className="empty-ico">📭</div>No activity yet</div>
            : recent.map(c => (
              <div key={c._id} className="act-row">
                <div className="act-dot" style={{ background: dotClr(c.status), boxShadow: `0 0 6px ${dotClr(c.status)}` }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="act-title">{c.title}</div>
                  <div className="act-meta">{c.user?.email || "Unknown"} · {c.createdAt ? ago(c.createdAt) : ""}</div>
                </div>
                <span className={`sb ${sCls(c.status)}`}>{c.status}</span>
              </div>
            ))
          }
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Ring */}
          <div className="card">
            <div className="card-head"><div><div className="card-title">Resolution Rate</div><div className="card-sub">Resolved + Closed / Total</div></div></div>
            <div className="ring-wrap">
              <svg width="112" height="112" viewBox="0 0 112 112">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#34D399" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
                  style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }} />
                <text x={cx} y={cy - 6} textAnchor="middle" fill="#E2E8F0"
                  style={{ fontSize: 18, fontWeight: 800, fontFamily: "Syne, sans-serif" }}>{resRate}%</text>
                <text x={cx} y={cy + 11} textAnchor="middle" fill="#475569"
                  style={{ fontSize: 9, fontFamily: "DM Mono, monospace", letterSpacing: "0.08em" }}>RESOLVED</text>
              </svg>
              <div>
                <div className="ring-stat"><span className="ring-val" style={{ color: "#34D399" }}>{resolved + closed}</span><span className="ring-lbl">Closed Out</span></div>
                <div className="ring-stat" style={{ marginTop: 8 }}><span className="ring-val" style={{ color: "#F59E0B" }}>{pending + inProg}</span><span className="ring-lbl">In Pipeline</span></div>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="card">
            <div className="card-head"><div><div className="card-title">Status Distribution</div><div className="card-sub">Complaints by category</div></div></div>
            <div className="chart-wrap">
              {BAR_DATA.map(b => (
                <div key={b.label} className="bar-row">
                  <span className="bar-lbl">{b.label}</span>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(b.count / maxBar) * 100}%`, background: b.color }} /></div>
                  <span className="bar-num">{b.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Queue View ─────────────────────────────────────────────────────────── */
function QueueView({ complaints, onUpdateStatus, onDelete }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [sort, setSort]       = useState("newest");
  const [selected, setSelected] = useState(new Set());
  const [expanded, setExpanded] = useState(new Set());
  const [page, setPage]       = useState(1);
  const [modal, setModal]     = useState(null);

  const TABS = ["All", "Pending", "In Progress", "Resolved", "Closed"];

  const filtered = useMemo(() => {
    let d = [...complaints];
    if (filter !== "All") d = d.filter(c => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(c => (c.title || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q) || (c.user?.email || "").toLowerCase().includes(q));
    }
    d.sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sort === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sort === "az") return (a.title || "").localeCompare(b.title || "");
      return (b.title || "").localeCompare(a.title || "");
    });
    return d;
  }, [complaints, filter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); setSelected(new Set()); }, [filter, search, sort]);

  const allPageSel = paginated.length > 0 && paginated.every(c => selected.has(c._id));

  const toggle = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => {
    if (allPageSel) setSelected(prev => { const s = new Set(prev); paginated.forEach(c => s.delete(c._id)); return s; });
    else setSelected(prev => { const s = new Set(prev); paginated.forEach(c => s.add(c._id)); return s; });
  };
  const toggleExp = (id) => setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const handleConfirm = async () => {
    if (modal.type === "single") {
      await onDelete(modal.id);
      setSelected(prev => { const s = new Set(prev); s.delete(modal.id); return s; });
    } else {
      for (const id of selected) await onDelete(id);
      setSelected(new Set());
    }
    setModal(null);
  };

  const bulkStatus = async (status) => { for (const id of selected) await onUpdateStatus(id, status); setSelected(new Set()); };

  const tabCount = (t) => t === "All" ? complaints.length : complaints.filter(c => c.status === t).length;

  const pageNums = () => {
    const nums = [];
    for (let i = 1; i <= totalPages; i++) if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) nums.push(i);
    return nums;
  };

  return (
    <>
      {modal && (
        <ConfirmModal
          title={modal.type === "single" ? "Delete Complaint" : `Delete ${selected.size} Complaints`}
          desc={modal.type === "single"
            ? "This action is permanent. The complaint record will be removed from the system and cannot be recovered."
            : `You are about to permanently delete ${selected.size} selected complaints. This cannot be undone.`}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      <div className="ph">
        <p className="eyebrow">// Control Panel</p>
        <h1 className="ptitle">Complaints Manager</h1>
        <p className="psub">Search, filter, sort, bulk-manage and export all system complaints.</p>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <div className="srch-wrap">
            <span className="srch-ico"><Ico n="search" s={14} /></span>
            <input className="srch-inp" placeholder="Search title, description or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="ftabs">
            {TABS.map(t => (
              <div key={t} className={`ftab${filter === t ? " on" : ""}`} onClick={() => setFilter(t)}>
                {t} <span style={{ opacity: 0.55, marginLeft: 3 }}>({tabCount(t)})</span>
              </div>
            ))}
          </div>
          <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="az">Title A–Z</option>
            <option value="za">Title Z–A</option>
          </select>
          <button className="export-btn" onClick={() => exportCSV(filtered)}>
            <Ico n="export" s={13} /> Export CSV
          </button>
        </div>

        {/* Bulk bar */}
        {selected.size > 0 && (
          <div className="bulk-bar">
            <span className="bulk-count">{selected.size} selected</span>
            <div className="bulk-acts">
              <button className="bbtn res"  onClick={() => bulkStatus("Resolved")}><Ico n="check" s={12} /> Mark Resolved</button>
              <button className="bbtn prog" onClick={() => bulkStatus("In Progress")}><Ico n="refresh" s={12} /> Set In Progress</button>
              <button className="bbtn del"  onClick={() => selected.size > 0 && setModal({ type: "bulk" })}><Ico n="trash" s={12} /> Delete All</button>
              <button className="bbtn clr"  onClick={() => setSelected(new Set())}>Clear</button>
            </div>
          </div>
        )}

        {/* Select-all row */}
        {paginated.length > 0 && (
          <div className="sel-all-row">
            <input type="checkbox" className="ck" checked={allPageSel} onChange={toggleAll} />
            <span className="sel-all-info">
              {allPageSel ? "Deselect page" : "Select page"} · {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Rows */}
        {paginated.length === 0
          ? <div className="no-results">No complaints match your current filters.</div>
          : paginated.map(c => (
            <div key={c._id} className={`crow${selected.has(c._id) ? " sel" : ""}`}>
              <div className="crow-main">
                <div style={{ display: "flex", alignItems: "center", paddingTop: 2 }}>
                  <input type="checkbox" className="ck" checked={selected.has(c._id)} onChange={() => toggle(c._id)} />
                </div>
                <div className="crow-body">
                  <div className="crow-title">{c.title}</div>
                  <div className={`crow-desc${expanded.has(c._id) ? " exp" : ""}`}>{c.description}</div>
                  <div className="crow-meta">
                    <span className="chip"><Ico n="user" s={11} />{c.user?.email || "Unknown"}</span>
                    {c.createdAt && <span className="chip"><Ico n="clock" s={11} />{fmt(c.createdAt)}</span>}
                    <span className={`sb ${sCls(c.status)}`}>{c.status}</span>
                    {(c.description || "").length > 100 && (
                      <button className="exp-btn" onClick={() => toggleExp(c._id)}>
                        {expanded.has(c._id) ? "▲ collapse" : "▼ read more"}
                      </button>
                    )}
                  </div>
                </div>
                <div className="crow-acts">
                  <select className={`ss ${sCls(c.status)}`} value={c.status} onChange={e => onUpdateStatus(c._id, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <button className="del-btn" onClick={() => setModal({ type: "single", id: c._id })}>
                    <Ico n="trash" s={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        }

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pager">
            <span className="pager-info">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="pager-btns">
              <button className="pbtn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              {pageNums().map((n, i, arr) => (
                <React.Fragment key={n}>
                  {i > 0 && arr[i - 1] !== n - 1 && <span style={{ color: "var(--text-3)", alignSelf: "center", padding: "0 4px" }}>…</span>}
                  <button className={`pbtn${page === n ? " cur" : ""}`} onClick={() => setPage(n)}>{n}</button>
                </React.Fragment>
              ))}
              <button className="pbtn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Users View ─────────────────────────────────────────────────────────── */
function UsersView({ users, loading, complaints }) {
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const cByUser = useMemo(() => {
    const m = {};
    complaints.forEach(c => { const e = c.user?.email; if (e) m[e] = (m[e] || 0) + 1; });
    return m;
  }, [complaints]);

  const filtered = useMemo(() => {
    let d = [...users];
    if (roleFilter === "Admin")    d = d.filter(u => u.role === "admin");
    if (roleFilter === "Standard") d = d.filter(u => u.role !== "admin");
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(u => (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q));
    }
    return d;
  }, [users, search, roleFilter]);

  return (
    <>
      <div className="ph">
        <p className="eyebrow">// Control Panel</p>
        <h1 className="ptitle">User Database</h1>
        <p className="psub">All registered accounts, their roles, and associated complaint activity.</p>
      </div>

      <div className="toolbar" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r)", marginBottom: 18 }}>
        <div className="srch-wrap">
          <span className="srch-ico"><Ico n="search" s={14} /></span>
          <input className="srch-inp" placeholder="Filter by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ftabs">
          {["All", "Admin", "Standard"].map(r => (
            <div key={r} className={`ftab${roleFilter === r ? " on" : ""}`} onClick={() => setRoleFilter(r)}>
              {r} <span style={{ opacity: 0.55, marginLeft: 3 }}>
                ({r === "All" ? users.length : r === "Admin" ? users.filter(u => u.role === "admin").length : users.filter(u => u.role !== "admin").length})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div><div className="card-title">All Accounts</div><div className="card-sub">{filtered.length} of {users.length} users</div></div>
          <span className="pill">{users.length} total</span>
        </div>
        {loading
          ? <div className="loader"><div className="spinner" />Loading users…</div>
          : filtered.length === 0
            ? <div className="loader"><div className="empty-ico">🔍</div>No users match your search</div>
            : filtered.map((u, i) => {
              const isA = u.role === "admin";
              const init = (u.name || u.email || "U")[0].toUpperCase();
              const cc = cByUser[u.email] || 0;
              return (
                <div key={u._id || i} className="urow">
                  <div className={`avatar ${isA ? "av-a" : "av-u"}`}>{init}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="uname">{u.name || (isA ? "Admin" : "User")}</div>
                    <div className="uemail">{u.email}</div>
                  </div>
                  <div className="uright">
                    {cc > 0 && <span className="uccount">{cc} complaint{cc !== 1 ? "s" : ""}</span>}
                    <span className={`rbadge ${isA ? "rb-a" : "rb-u"}`}>{isA ? "System Admin" : "Standard User"}</span>
                  </div>
                </div>
              );
            })
        }
      </div>
    </>
  );
}

/* ─── Settings View ──────────────────────────────────────────────────────── */
function SettingsView({ adminInfo, complaints, users, onRefresh }) {
  const total = complaints.length;
  const res   = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;
  const rate  = total > 0 ? `${Math.round((res / total) * 100)}%` : "N/A";

  return (
    <>
      <div className="ph">
        <p className="eyebrow">// Control Panel</p>
        <h1 className="ptitle">Settings</h1>
        <p className="psub">Admin profile, system statistics, data management and danger zone.</p>
      </div>

      <div className="g2">
        {/* Admin profile */}
        <div className="card">
          <div className="card-head"><div className="card-title">Admin Profile</div></div>
          <div className="s-section">
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--teal-dim)", border: "1px solid rgba(0,212,184,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, color: "var(--teal)" }}>
                {(adminInfo?.email || "A")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{adminInfo?.email || "Admin"}</div>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "var(--teal)", marginTop: 3, letterSpacing: ".06em" }}>● SYSTEM ADMINISTRATOR</div>
              </div>
            </div>
            {[
              { k: "Role",    v: adminInfo?.role || "admin", t: true },
              { k: "Email",   v: adminInfo?.email || "—" },
              { k: "Token",   v: adminInfo?.id ? `…${adminInfo.id.slice(-8)}` : "—" },
              { k: "Session", v: "Active", t: true },
            ].map(r => (
              <div key={r.k} className="s-row">
                <span className="s-key">{r.k}</span>
                <span className={`s-val${r.t ? " t" : ""}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System stats */}
        <div className="card">
          <div className="card-head"><div className="card-title">System Information</div></div>
          <div className="s-section">
            {[
              { k: "Total Complaints", v: total },
              { k: "Total Users",      v: users.length },
              { k: "Pending",          v: complaints.filter(c => c.status === "Pending").length },
              { k: "In Progress",      v: complaints.filter(c => c.status === "In Progress").length },
              { k: "Resolved",         v: complaints.filter(c => c.status === "Resolved").length },
              { k: "Closed",           v: complaints.filter(c => c.status === "Closed").length },
              { k: "Resolution Rate",  v: rate, t: true },
            ].map(r => (
              <div key={r.k} className="s-row">
                <span className="s-key">{r.k}</span>
                <span className={`s-val${r.t ? " t" : ""}`}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data management */}
      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-head"><div className="card-title">Data Management</div></div>
        <div className="s-section">
          <div className="s-title"><Ico n="refresh" s={14} /> Sync &amp; Export</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="export-btn" style={{ fontSize: 12, padding: "10px 18px" }} onClick={onRefresh}>
              <Ico n="refresh" s={14} /> Refresh All Data
            </button>
            <button className="export-btn" style={{ fontSize: 12, padding: "10px 18px" }} onClick={() => exportCSV(complaints)}>
              <Ico n="export" s={14} /> Export Complaints CSV
            </button>
          </div>
        </div>
        <div className="s-section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="s-title" style={{ color: "var(--red)" }}><Ico n="warning" s={14} /> Danger Zone</div>
          <p style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "var(--text-3)", marginBottom: 14, lineHeight: 1.7 }}>
            These actions are irreversible. Proceed with caution.<br />
            Consult your system administrator before performing bulk deletions.
          </p>
          <button className="dzone-btn" onClick={() => toast.warn("Connect this to your backend DELETE /api/complaint/bulk-resolved endpoint.")}>
            <Ico n="trash" s={14} /> Delete All Resolved Complaints
          </button>
        </div>
        <div className="s-section" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="s-title"><Ico n="tag" s={14} /> Keyboard Shortcuts</div>
          {[["1", "Analytics"], ["2", "Global Queue"], ["3", "User Directory"], ["4", "Settings"], ["Esc", "Close modal"]].map(([k, v]) => (
            <div key={k} className="s-row">
              <span className="s-key">{v}</span>
              <kbd style={{ fontFamily: "DM Mono, monospace", fontSize: 10, padding: "3px 8px", borderRadius: 5, background: "rgba(0,0,0,.3)", border: "1px solid var(--border)", color: "var(--text-2)" }}>{k}</kbd>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Root Admin ─────────────────────────────────────────────────────────── */
export default function Admin() {
  const [view, setView]         = useState("analytics");
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* Auth guard */
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    try {
      const dec = JSON.parse(atob(token.split(".")[1]));
      if (dec.role !== "admin") { toast.error("Access Denied"); navigate("/"); return; }
      setAdminInfo(dec);
    } catch { navigate("/login"); return; }
    fetchComplaints();
  }, []);

  /* Keyboard shortcuts 1–4 */
  useEffect(() => {
    const VIEWS = ["analytics", "queue", "users", "settings"];
    const h = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      const n = parseInt(e.key);
      if (n >= 1 && n <= VIEWS.length) setView(VIEWS[n - 1]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* Fetch users on first visit to that view */
  useEffect(() => {
    if (view === "users" && !usersLoaded) fetchUsers();
  }, [view]);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/complaint/all", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setComplaints(Array.isArray(data) ? data : []);
      setLastRefresh(new Date());
    } catch { toast.error("Failed to load complaints"); }
    finally { setLoading(false); }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/all-users", { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setUsersLoaded(true);
    } catch { toast.error("Failed to load users"); }
    finally { setUsersLoading(false); }
  }, [token]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchComplaints();
    if (usersLoaded) await fetchUsers();
    setRefreshing(false);
    toast.success("Data refreshed");
  }, [fetchComplaints, fetchUsers, usersLoaded]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error();
      toast.success(`Status → ${status}`);
      setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    } catch { toast.error("Failed to update status"); }
  }, [token]);

  const deleteComplaint = useCallback(async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/delete/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      toast.success("Complaint deleted");
      setComplaints(prev => prev.filter(c => c._id !== id));
    } catch { toast.error("Failed to delete"); }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminLogin");
    localStorage.removeItem("userLogin");
    navigate("/login");
  };

  const pendingCount = complaints.filter(c => c.status === "Pending").length;

  const NAV = [
    { id: "analytics", label: "Analytics",     ico: "chart",    hint: "1" },
    { id: "queue",     label: "Global Queue",   ico: "list",     hint: "2", badge: pendingCount || null },
    { id: "users",     label: "User Directory", ico: "users",    hint: "3" },
    { id: "settings",  label: "Settings",       ico: "settings", hint: "4" },
  ];

  const LABELS = { analytics: "Analytics", queue: "Complaints Manager", users: "User Directory", settings: "Settings" };

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>
      <div className="ad-root">
        <div className="glow glow-1" /><div className="glow glow-2" />

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-logo"><Ico n="shield" s={18} /></div>
            <div>
              <div className="brand-name">Nexus Admin</div>
              <div className="brand-tag">CMS Portal</div>
            </div>
          </div>
          <nav className="nav-area">
            <div className="nav-label">Main Menu</div>
            {NAV.map(({ id, label, ico, badge, hint }) => (
              <div key={id} className={`nav-btn${view === id ? " active" : ""}`} onClick={() => setView(id)} title={`Press ${hint}`}>
                <Ico n={ico} s={15} /> {label}
                {badge ? <span className="nav-badge">{badge}</span> : null}
              </div>
            ))}
          </nav>
          <div className="nav-foot">
            <button className="logout-btn" onClick={handleLogout}><Ico n="logout" s={15} /> Secure Logout</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          <div className="topbar">
            <div className="breadcrumb">
              <span className="accent">// CMS</span>
              <span style={{ color: "var(--text-3)" }}>/</span>
              <span className="page">{LABELS[view]}</span>
            </div>
            <div className="topbar-right">
              {lastRefresh && <span className="last-refresh">Refreshed {ago(lastRefresh)}</span>}
              <button className={`refresh-btn${refreshing ? " spin" : ""}`} onClick={handleRefresh} disabled={refreshing}>
                <Ico n="refresh" s={13} /> {refreshing ? "Syncing…" : "Refresh"}
              </button>
              <div className="status-pill"><div className="dot-pulse" />System Online</div>
            </div>
          </div>

          <div className="page" key={view}>
            {loading && view !== "users" && view !== "settings"
              ? <div className="loader" style={{ paddingTop: 100 }}><div className="spinner" />Retrieving records…</div>
              : view === "analytics" ? <AnalyticsView complaints={complaints} />
              : view === "queue"     ? <QueueView complaints={complaints} onUpdateStatus={updateStatus} onDelete={deleteComplaint} />
              : view === "users"     ? <UsersView users={users} loading={usersLoading} complaints={complaints} />
              :                        <SettingsView adminInfo={adminInfo} complaints={complaints} users={users} onRefresh={handleRefresh} />
            }
          </div>
        </main>
      </div>
    </>
  );
}