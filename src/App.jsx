import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Género de Voz (reemplaza Personalidades) ───────────
const GENEROS = [
  { label: 'Voz Normal', labelEn: 'Voz Normal', pitch: 0.75, rateAdd: -0.05, emoji: '🔉', desc: 'Normal Voice',  descEn: 'Normal Voice'   },
  { label: 'Voz Aguda',  labelEn: 'Voz Aguda', pitch: 1.30, rateAdd:  0.05, emoji: '🔊', desc: 'High-pitched Voice',   descEn: 'High-pitched Voice'  },
];

// ─── Voces / Idiomas ─────────────
const VOCES = [
  { label: 'Español (México)',     labelEn: 'Spanish (Mexico)',     lang: 'es-MX', flag: '🇲🇽', group: 'es' },
  { label: 'Español (España)',     labelEn: 'Spanish (Spain)',      lang: 'es-ES', flag: '🇪🇸', group: 'es' },
  { label: 'Español (Argentina)',  labelEn: 'Spanish (Argentina)',  lang: 'es-AR', flag: '🇦🇷', group: 'es' },
  { label: 'Español (Colombia)',   labelEn: 'Spanish (Colombia)',   lang: 'es-CO', flag: '🇨🇴', group: 'es' },
  { label: 'Español (Chile)',      labelEn: 'Spanish (Chile)',      lang: 'es-CL', flag: '🇨🇱', group: 'es' },
  { label: 'Español (Venezuela)',  labelEn: 'Spanish (Venezuela)',  lang: 'es-VE', flag: '🇻🇪', group: 'es' },
  { label: 'English (US)',         labelEn: 'English (US)',         lang: 'en-US', flag: '🇺🇸', group: 'en' },
  { label: 'English (UK)',         labelEn: 'English (UK)',         lang: 'en-GB', flag: '🇬🇧', group: 'en' },
  { label: 'English (AU)',         labelEn: 'English (AU)',         lang: 'en-AU', flag: '🇦🇺', group: 'en' },
  { label: 'English (IN)',         labelEn: 'English (IN)',         lang: 'en-IN', flag: '🇮🇳', group: 'en' },
  { label: 'Português (Brasil)',   labelEn: 'Portuguese (Brazil)',  lang: 'pt-BR', flag: '🇧🇷', group: 'pt' },
  { label: 'Português (Portugal)', labelEn: 'Portuguese (Portugal)',lang: 'pt-PT', flag: '🇵🇹', group: 'pt' },
  { label: 'Français',             labelEn: 'French',              lang: 'fr-FR', flag: '🇫🇷', group: 'fr' },
  { label: 'Français (Canada)',    labelEn: 'French (Canada)',      lang: 'fr-CA', flag: '🇨🇦', group: 'fr' },
  { label: 'Deutsch',              labelEn: 'German',              lang: 'de-DE', flag: '🇩🇪', group: 'de' },
  { label: 'Italiano',             labelEn: 'Italian',             lang: 'it-IT', flag: '🇮🇹', group: 'it' },
  { label: '日本語',                labelEn: 'Japanese',            lang: 'ja-JP', flag: '🇯🇵', group: 'default' },
  { label: '中文 (普通话)',          labelEn: 'Chinese (Mandarin)',  lang: 'zh-CN', flag: '🇨🇳', group: 'default' },
  { label: 'Русский',              labelEn: 'Russian',             lang: 'ru-RU', flag: '🇷🇺', group: 'default' },
  { label: 'العربية',               labelEn: 'Arabic',              lang: 'ar-SA', flag: '🇸🇦', group: 'default' },
  { label: 'हिन्दी',                labelEn: 'Hindi',               lang: 'hi-IN', flag: '🇮🇳', group: 'default' },
  { label: 'Türkçe',               labelEn: 'Turkish',             lang: 'tr-TR', flag: '🇹🇷', group: 'default' },
];

// ─── Estados de Ánimo ─────────────────
const ANIMOS = [
  { label: 'Neutral',    labelEn: 'Neutral',      pitch: 1.00, rateMulti: 1.00, volume: 1.00, desc: 'Expresión equilibrada',    descEn: 'Balanced expression',    emoji: '😐' },
  { label: 'Alegre',     labelEn: 'Happy',         pitch: 1.25, rateMulti: 1.15, volume: 1.00, desc: 'Tono alto y animado',       descEn: 'High and lively tone',   emoji: '😄' },
  { label: 'Serio',      labelEn: 'Serious',       pitch: 0.80, rateMulti: 0.88, volume: 0.95, desc: 'Grave, pausado y firme',    descEn: 'Deep, steady and firm',  emoji: '😠' },
  { label: 'Entusiasta', labelEn: 'Enthusiastic',  pitch: 1.35, rateMulti: 1.25, volume: 1.00, desc: 'Muy enérgico y expresivo',  descEn: 'Very energetic and expressive', emoji: '🤩' },
  { label: 'Melancólico',labelEn: 'Melancholic',   pitch: 0.70, rateMulti: 0.78, volume: 0.88, desc: 'Suave, lento y nostálgico', descEn: 'Soft, slow and nostalgic', emoji: '😔' },
  { label: 'Enérgico',   labelEn: 'Energetic',     pitch: 1.15, rateMulti: 1.30, volume: 1.00, desc: 'Rápido, dinámico y potente',descEn: 'Fast, dynamic and powerful', emoji: '⚡' },
  { label: 'Relajado',   labelEn: 'Relaxed',       pitch: 0.88, rateMulti: 0.82, volume: 0.90, desc: 'Calmado y pausado',         descEn: 'Calm and slow-paced',    emoji: '😌' },
  { label: 'Tenso',      labelEn: 'Tense',         pitch: 1.10, rateMulti: 1.18, volume: 0.95, desc: 'Urgente y con tensión',     descEn: 'Urgent and tense',       emoji: '😤' },
];

const VELOCIDADES = [
  { label: 'Muy Lento',  labelEn: 'Very Slow',  rate: 0.50 },
  { label: 'Lento',      labelEn: 'Slow',        rate: 0.75 },
  { label: 'Normal',     labelEn: 'Normal',      rate: 1.00 },
  { label: 'Rápido',     labelEn: 'Fast',        rate: 1.25 },
  { label: 'Muy Rápido', labelEn: 'Very Fast',   rate: 1.60 },
];

// ─── Traducciones ─────────────────────────────────────────────────────────────
const TEXTS = {
  es: {
    subtitle:      'Texto a Voz con Inteligencia Artificial',
    voice:         '🌍 Voz / Acento / Región',
    gender:        '🎭 Tipo de Voz',
    speed:         '⚡ Velocidad',
    mood:          '💫 Estado de Ánimo',
    placeholder:   'Escribe o pega aquí el texto que deseas escuchar…',
    generate:      'Generar Audio',
    generating:    'Generando…',
    stop:          'Detener Audio',
    history:       '📋 Historial',
    clearAll:      'Limpiar todo',
    emptyHistory:  'Aún no has generado audios',
    save:          '💾 Guardar',
    load:          '📂 Cargar',
    footer:        'Todos los derechos reservados',
    renameTitle:   'Nombre del audio',
    renamePlaceholder: 'Escribe un nombre…',
    renameConfirm: 'Guardar',
    renameCancel:  'Cancelar',
    downloadTxt:   'Descargar transcripción',
    normal:        'Voz Normal',
    high:          'Voz Aguda',
    // Toasts
    audioGenerated:    '✓ Audio generado correctamente',
    audioError:        'Error al generar el audio',
    historyExported:   '📁 Historial exportado',
    historyCleared:    'Historial limpiado',
    fileReadError:     'Error al leer el archivo',
    deleted:           'Eliminado del historial',
    nameUpdated:       '✓ Nombre actualizado',
    transcriptDl:      '📄 Transcripción descargada',
    noText:            'Por favor escribe algún texto',
    audioLoaded:       (n) => `✓ Audio "${n}" cargado al historial`,
    entriesLoaded:     (n) => `✓ ${n} entradas cargadas`,
    downloaded:        (fmt) => `📥 ${fmt} descargado`,
  },
  en: {
    subtitle:      'AI Text to Speech',
    voice:         '🌍 Voice / Accent / Region',
    gender:        '🎭 Voice Type',
    speed:         '⚡ Speed',
    mood:          '💫 Mood',
    placeholder:   'Write or paste the text you want to hear…',
    generate:      'Generate Audio',
    generating:    'Generating…',
    stop:          'Stop Audio',
    history:       '📋 History',
    clearAll:      'Clear all',
    emptyHistory:  'You have not generated audios yet',
    save:          '💾 Save',
    load:          '📂 Load',
    footer:        'All rights reserved',
    renameTitle:   'Audio name',
    renamePlaceholder: 'Enter a name…',
    renameConfirm: 'Save',
    renameCancel:  'Cancel',
    downloadTxt:   'Download transcript',
    normal:          'Normal Voice',
    high:        'High-pitched Voice',
    // Toasts
    audioGenerated:    '✓ Audio generated successfully',
    audioError:        'Error generating audio',
    historyExported:   '📁 History exported',
    historyCleared:    'History cleared',
    fileReadError:     'Error reading file',
    deleted:           'Removed from history',
    nameUpdated:       '✓ Name updated',
    transcriptDl:      '📄 Transcript downloaded',
    noText:            'Please enter some text',
    audioLoaded:       (n) => `✓ Audio "${n}" added to history`,
    entriesLoaded:     (n) => `✓ ${n} entries loaded`,
    downloaded:        (fmt) => `📥 ${fmt} downloaded`,
  },
};

// ─── Gender Select (solo 2 opciones — botones toggle) ─────────────────────────
function GenderToggle({ value, onChange, dark, lang }) {
  const isEs = lang === 'es';
  const opts = [
    { val: 'Voz Normal', icon: '🔉', label: isEs ? 'Voz Normal' : 'Normal Voice' },
    { val: 'Voz Aguda',  icon: '🔊', label: isEs ? 'Voz Aguda'  : 'High-pitched Voice' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {opts.map(o => {
        const active = value === o.val;
        return (
          <button key={o.val} onClick={() => onChange(o.val)} style={{
            flex: 1, padding: '10px 8px', borderRadius: 10,
            background: active
              ? (dark ? 'linear-gradient(135deg,#1d4ed8,#2563eb)' : 'linear-gradient(135deg,#1d4ed8,#3b82f6)')
              : (dark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
            color: active ? '#fff' : (dark ? '#cbd5e1' : '#475569'),
            fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            fontWeight: active ? 700 : 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: active ? '0 4px 12px rgba(37,99,235,0.35)' : 'none',
            border: active === true ? 'none' : (dark ? '1px solid rgba(255,255,255,0.1)' : '1.5px solid #e2e8f0'),
            transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 16 }}>{o.icon}</span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Custom Select ────────────────────────────────────────────────────────────
function Select({ value, onChange, options, dark, lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const isEn = lang === 'en';
  const getDisplayLabel = o => (isEn && o.labelEn) ? o.labelEn : o.label;
  const getDisplayDesc  = o => (isEn && o.descEn)  ? o.descEn  : o.desc;
  const sel = options.find(o => o.label === value) || options[0];

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 10,
        border: dark ? '1px solid rgba(255,255,255,0.12)' : '1.5px solid #e2e8f0',
        background: dark ? 'rgba(255,255,255,0.06)' : '#fff',
        color: dark ? '#e2e8f0' : '#1e293b', fontSize: 13,
        fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 0.2s',
        boxShadow: open ? (dark ? '0 0 0 2px #4a90d9' : '0 0 0 2px #1d4ed8') : 'none',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {sel.emoji && <span>{sel.emoji}</span>}
          {sel.flag && <span>{sel.flag}</span>}
          {getDisplayLabel(sel)}
          {sel.desc && <span style={{ fontSize: 11, opacity: 0.55, marginLeft: 4 }}>· {getDisplayDesc(sel)}</span>}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 6 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 9999,
          borderRadius: 10,
          border: dark ? '1px solid rgba(255,255,255,0.15)' : '1.5px solid #e2e8f0',
          background: dark ? '#1a2535' : '#fff',
          boxShadow: dark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.14)',
          maxHeight: 260, overflowY: 'auto',
        }}>
          {options.map(o => (
            <button key={o.label} onClick={() => { onChange(o.label); setOpen(false); }}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 14px', border: 'none',
                background: o.label === value ? (dark ? 'rgba(74,144,217,0.2)' : '#eff6ff') : 'transparent',
                color: o.label === value ? (dark ? '#7dc4f5' : '#1d4ed8') : (dark ? '#e2e8f0' : '#374151'),
                fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (o.label !== value) e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : '#f8fafc'; }}
              onMouseLeave={e => { if (o.label !== value) e.currentTarget.style.background = 'transparent'; }}
            >
              {o.emoji && <span>{o.emoji}</span>}
              {o.flag && <span>{o.flag}</span>}
              <span style={{ flex: 1 }}>{getDisplayLabel(o)}</span>
              {o.desc && <span style={{ fontSize: 11, opacity: 0.5, flexShrink: 0 }}>{getDisplayDesc(o)}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────
function RenameModal({ item, dark, onConfirm, onCancel, lang }) {
  const t = TEXTS[lang];
  const [val, setVal] = useState(item.nombre || '');
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 16px',
    }} onClick={onCancel}>
      <div style={{
        background: dark ? '#1a2535' : '#fff',
        border: dark ? '1px solid rgba(255,255,255,0.12)' : '1.5px solid #e2e8f0',
        borderRadius: 16, padding: '24px 24px 20px', width: '100%', maxWidth: 400,
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        animation: 'modalIn 0.2s ease',
      }} onClick={e => e.stopPropagation()}>
        <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700,
          color: dark ? '#f1f5f9' : '#0f172a', fontFamily: "'Sora', sans-serif" }}>
          ✏️ {t.renameTitle}
        </p>
        <input
          ref={inputRef}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onConfirm(val); if (e.key === 'Escape') onCancel(); }}
          placeholder={t.renamePlaceholder}
          maxLength={80}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 9, boxSizing: 'border-box',
            border: dark ? '1px solid rgba(255,255,255,0.18)' : '1.5px solid #cbd5e1',
            background: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
            color: dark ? '#f1f5f9' : '#0f172a', fontSize: 14,
            fontFamily: "'DM Sans', sans-serif", outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.15)'; }}
          onBlur={e => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.18)' : '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button onClick={() => onConfirm(val)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, border: 'none',
            background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', color: '#fff',
            fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
          }}>{t.renameConfirm}</button>
          <button onClick={onCancel} style={{
            flex: 1, padding: '9px 0', borderRadius: 9, border: 'none',
            background: dark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
            color: dark ? '#94a3b8' : '#475569',
            fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
          }}>{t.renameCancel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Audio Player ─────────────────
function AudioPlayer({ item, dark, isPlaying, onPlayPause, onStop }) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const getEstimatedDuration = useCallback(() => {
    const velData = VELOCIDADES.find(v => v.label === item.velocidad) || VELOCIDADES[2];
    const animData = ANIMOS.find(a => a.label === item.animo) || ANIMOS[0];
    const gd = GENEROS.find(g => g.label === item.genero) || GENEROS[0];
    const effectiveRate = (velData.rate + gd.rateAdd) * animData.rateMulti;
    return Math.max(1, item.texto.length / (14 * effectiveRate));
  }, [item]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - (currentTime * 1000);
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const dur = getEstimatedDuration();
        setCurrentTime(Math.min(elapsed, dur));
        setProgress(Math.min(100, (elapsed / dur) * 100));
        if (elapsed >= dur) clearInterval(intervalRef.current);
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, getEstimatedDuration]);

  useEffect(() => {
    if (!isPlaying && currentTime > 0 && currentTime >= getEstimatedDuration() - 0.5) {
      setProgress(0); setCurrentTime(0);
    }
  }, [isPlaying]);

  const fmt = s => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const dur = getEstimatedDuration();

  const handleSeek = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * dur;
    setCurrentTime(newTime); setProgress(pct * 100);
    startTimeRef.current = Date.now() - newTime * 1000;
    if (isPlaying) {
      onStop();
      setTimeout(() => onPlayPause(item, item.texto.slice(Math.floor(pct * item.texto.length))), 50);
    }
  };

  return (
    <div style={{
      marginTop: 8, padding: '10px 12px', borderRadius: 10,
      background: dark ? 'rgba(37,99,235,0.12)' : '#eff6ff',
      border: dark ? '1px solid rgba(37,99,235,0.25)' : '1px solid #bfdbfe',
    }}>
      <div onClick={handleSeek} style={{
        height: 5, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.12)' : '#dbeafe',
        cursor: 'pointer', position: 'relative', marginBottom: 8, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`,
          background: 'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius: 99, transition: 'width 0.1s linear',
        }} />
        <div style={{
          position: 'absolute', top: '50%', transform: 'translate(-50%,-50%)',
          left: `${progress}%`, width: 11, height: 11, borderRadius: '50%',
          background: '#2563eb', boxShadow: '0 0 0 2px rgba(37,99,235,0.4)', transition: 'left 0.1s linear',
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => onPlayPause(item)} style={{
          width: 32, height: 32, borderRadius: '50%', border: 'none',
          background: isPlaying ? '#7c3aed' : '#2563eb', color: '#fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, flexShrink: 0,
          boxShadow: isPlaying ? '0 2px 8px rgba(124,58,237,0.4)' : '0 2px 8px rgba(37,99,235,0.35)',
        }}>{isPlaying ? '⏸' : '▶'}</button>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 1.5, height: 18, marginBottom: 2 }}>
            {Array.from({ length: 32 }).map((_, i) => {
              const passed = (i / 32) * 100 <= progress;
              return (
                <div key={i} style={{
                  width: 2, borderRadius: 99, flexShrink: 0,
                  height: `${20 + Math.sin(i * 0.9) * 45 + Math.sin(i * 2.1) * 25}%`,
                  background: passed ? (dark ? '#4a90d9' : '#2563eb') : (dark ? 'rgba(255,255,255,0.15)' : '#cbd5e1'),
                  animation: isPlaying && passed
                    ? `wave-bar-mini ${0.6 + (i % 4) * 0.12}s ease-in-out ${(i * 0.03).toFixed(2)}s infinite alternate`
                    : 'none',
                }} />
              );
            })}
          </div>
        </div>
        <span style={{ fontSize: 11, color: dark ? '#94a3b8' : '#64748b', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
          {fmt(currentTime)} / {fmt(dur)}
        </span>
      </div>
    </div>
  );
}

// ─── History Item ─────
function HistoryItem({ item, dark, onPlay, onDelete, onDownload, onDownloadTxt, onRename, playingId, onStop, lang }) {
  const isPlaying = playingId === item.id;
  const [showPlayer, setShowPlayer] = useState(false);
  const textSecondary = dark ? '#94a3b8' : '#64748b';

  useEffect(() => { if (isPlaying) setShowPlayer(true); }, [isPlaying]);

  const fechaHora = new Date(item.timestamp).toLocaleString(lang === 'es' ? 'es-MX' : 'en-US', {
    dateStyle: 'short', timeStyle: 'short',
  });

  return (
    <div style={{
      padding: '12px 14px', borderRadius: 12, marginBottom: 10,
      background: dark ? (isPlaying ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.04)') : (isPlaying ? '#f0f7ff' : '#f8fafc'),
      border: dark
        ? (isPlaying ? '1px solid rgba(37,99,235,0.3)' : '1px solid rgba(255,255,255,0.07)')
        : (isPlaying ? '1.5px solid #bfdbfe' : '1px solid #e9eef5'),
      transition: 'all 0.25s',
      overflowX: 'hidden',
      minWidth: 0,
      width: '100%',
      boxSizing: 'border-box',
    }}>

      {/* Nombre del audio + icono lápiz */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, minWidth: 0, overflow: 'hidden' }}>
        <span style={{
          fontSize: 13, fontWeight: 700,
          color: dark ? '#e2e8f0' : '#1e293b',
          flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.nombre || `Audio · ${fechaHora}`}
        </span>
        {item.isImported && (
          <span style={{
            flexShrink: 0, fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
            padding: '2px 6px', borderRadius: 4,
            background: dark ? 'rgba(245,158,11,0.18)' : '#fef3c7',
            color: dark ? '#fcd34d' : '#92400e',
          }}>
            {(item.audioFormat || 'AUDIO').toUpperCase()}
          </span>
        )}
        {/* Lápiz para renombrar */}
        <button onClick={() => onRename(item)} title={lang === 'es' ? 'Cambiar nombre' : 'Rename'} style={{
          flexShrink: 0, width: 24, height: 24, borderRadius: 6, border: 'none',
          background: dark ? 'rgba(255,255,255,0.07)' : '#e9eef5',
          color: dark ? '#94a3b8' : '#64748b',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, transition: 'background 0.15s',
          padding: 0,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(37,99,235,0.25)' : '#dbeafe'; e.currentTarget.style.color = '#2563eb'; }}
          onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.07)' : '#e9eef5'; e.currentTarget.style.color = dark ? '#94a3b8' : '#64748b'; }}
        >
          ✏️
        </button>
      </div>

      {/* Meta: fecha · voz · velocidad · ánimo */}
      <div style={{ fontSize: 11, color: textSecondary, marginBottom: 5, display: 'flex', gap: 5, flexWrap: 'wrap', minWidth: 0, overflow: 'hidden' }}>
        <span>🗓 {fechaHora}</span>
        <span>·</span>
        <span>{(() => { const v = VOCES.find(x => x.label === item.voz); return lang === 'en' && v?.labelEn ? v.labelEn : item.voz; })()}</span>
        <span>·</span>
        <span>{lang === 'en' ? (item.genero === 'Voz Normal' ? 'Normal Voice' : 'High-pitched Voice') : item.genero}</span>
        <span>·</span>
        <span>{(() => { const v = VELOCIDADES.find(x => x.label === item.velocidad); return lang === 'en' && v?.labelEn ? v.labelEn : item.velocidad; })()}</span>
        <span>·</span>
        <span>{(() => { const v = ANIMOS.find(x => x.label === item.animo); return lang === 'en' && v?.labelEn ? v.labelEn : item.animo; })()}</span>
      </div>

      {/* Transcripción (preview) */}
      <div style={{
        fontSize: 13, color: dark ? '#cbd5e1' : '#334155', marginBottom: 8,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        maxWidth: '100%', boxSizing: 'border-box',
      }}>{item.texto}</div>

      {/* Botones */}
      <div className="vc-history-btn-row" style={{ display: 'flex', gap: 5, flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
        {/* Reproducir */}
        <button onClick={() => onPlay(item)} style={{
          flex: '1 1 auto', minWidth: 70, padding: '6px 4px', borderRadius: 7, border: 'none',
          background: isPlaying ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'linear-gradient(135deg,#1d4ed8,#2563eb)',
          color: '#fff', fontSize: 11, fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer', fontWeight: 600, letterSpacing: 0.3,
          boxShadow: isPlaying ? '0 2px 8px rgba(124,58,237,0.35)' : '0 2px 8px rgba(37,99,235,0.25)',
        }}>{isPlaying ? '⏹ Detener' : '▶ Reproducir'}</button>

        {/* Descargar transcripción TXT */}
        <button onClick={() => onDownloadTxt(item)} style={{
          padding: '6px 8px', borderRadius: 7, border: 'none',
          background: dark ? 'rgba(139,92,246,0.15)' : '#ede9fe',
          color: dark ? '#c4b5fd' : '#5b21b6', fontSize: 10, cursor: 'pointer',
          fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
        }} title={lang === 'es' ? 'Descargar transcripción' : 'Download transcript'}>📄 TXT</button>

        {/* Eliminar */}
        <button onClick={() => onDelete(item.id)} style={{
          padding: '6px 8px', borderRadius: 7, border: 'none',
          background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
          color: '#ef4444', fontSize: 12, cursor: 'pointer',
        }} title="Eliminar">✕</button>
      </div>

      {/* Player — aparece al reproducir */}
      {showPlayer && (
        <AudioPlayer item={item} dark={dark} isPlaying={isPlaying} onPlayPause={onPlay} onStop={onStop} />
      )}
    </div>
  );
}

// ─── Construir parámetros TTS desde el item del historial ────────────────────
// ─── Idioma para Google TTS según la voz seleccionada ────────────────────────
function getLangCode(vozLabel) {
  const vd = VOCES.find(v => v.label === vozLabel) || VOCES[0];
  return vd.lang; // e.g. 'es-MX', 'en-US', etc.
}

// ─── Divide texto en fragmentos ≤ 200 chars cortando en espacios ─────────────
function splitChunks(text, max = 200) {
  const chunks = [];
  let rem = text.trim();
  while (rem.length > 0) {
    if (rem.length <= max) { chunks.push(rem); break; }
    let idx = rem.lastIndexOf(' ', max);
    if (idx <= 0) idx = max;
    chunks.push(rem.slice(0, idx).trim());
    rem = rem.slice(idx).trim();
  }
  return chunks;
}

// ─── Fetch MP3 desde Google Translate TTS ────────────────────────────────────
async function fetchGoogleTTS(text, lang) {
  const params = `ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encodeURIComponent(text)}`;

  // En desarrollo: proxy Vite evita CORS. En producción (Vercel): llamada directa.
  const candidates = [
    `/gtts?${params}`,                                              // proxy local (npm run dev)
    `https://translate.google.com/translate_tts?${params}`,        // directo (Vercel/producción)
    `https://corsproxy.io/?${encodeURIComponent(`https://translate.google.com/translate_tts?${params}`)}`,
  ];

  for (const url of candidates) {
    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 15000);
      const res  = await fetch(url, {
        signal: ctrl.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
      clearTimeout(tid);
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength > 500) return buf; // MP3 real
    } catch { /* probar siguiente */ }
  }
  throw new Error('No se pudo obtener el audio de Google TTS. Verifica tu conexión.');
}

// ─── Generar y descargar audio usando Google TTS — sin reproducción automática
async function generateAndDownloadAudio(item, format) {
  const lang   = getLangCode(item.voz);
  const chunks = splitChunks(item.texto, 200);

  // Obtener MP3 de Google para cada fragmento
  const buffers = [];
  for (const chunk of chunks) {
    const buf = await fetchGoogleTTS(chunk, lang);
    buffers.push(buf);
  }

  if (format === 'mp3') {
    // Concatenar todos los MP3 en uno solo
    const total    = buffers.reduce((s, b) => s + b.byteLength, 0);
    const combined = new Uint8Array(total);
    let offset = 0;
    for (const b of buffers) { combined.set(new Uint8Array(b), offset); offset += b.byteLength; }
    downloadBlob(new Blob([combined], { type: 'audio/mpeg' }), `vozcraft-${item.id}.mp3`);

  } else {
    // WAV: decodificar MP3 → PCM → encodeWAV
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioCtx();
    try {
      const pcmChunks = [];
      let sampleRate  = 44100;
      for (const buf of buffers) {
        const decoded  = await audioCtx.decodeAudioData(buf.slice(0));
        sampleRate     = decoded.sampleRate;
        pcmChunks.push(decoded.getChannelData(0));
      }
      const totalSamples = pcmChunks.reduce((s, c) => s + c.length, 0);
      const allSamples   = new Float32Array(totalSamples);
      let off = 0;
      for (const c of pcmChunks) { allSamples.set(c, off); off += c.length; }
      downloadBlob(new Blob([encodeWAV(allSamples, sampleRate)], { type: 'audio/wav' }), `vozcraft-${item.id}.wav`);
    } finally {
      audioCtx.close();
    }
  }
}

function encodeWAV(samples, sampleRate) {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const ws = (off, str) => { for (let i = 0; i < str.length; i++) v.setUint8(off + i, str.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + samples.length * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true); v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true); ws(36, 'data');
  v.setUint32(40, samples.length * 2, true);
  let off = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(off, s < 0 ? s * 32768 : s * 32767, true); off += 2;
  }
  return buf;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// ─── Descargar transcripción TXT ───
function downloadTranscript(item, lang) {
  const fecha = new Date(item.timestamp);
  const fechaStr = fecha.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'long' });
  const horaStr  = fecha.toLocaleTimeString(lang === 'es' ? 'es-MX' : 'en-US', { timeStyle: 'medium' });
  const nombre   = item.nombre || `Audio-${item.id}`;
  const sep = '═'.repeat(50);

  const content = [
    'VozCraft — Transcripción de Audio',
    sep,
    `Nombre:     ${nombre}`,
    `Fecha:      ${fechaStr}`,
    `Hora:       ${horaStr}`,
    `Idioma:     ${item.voz}`,
    `Género:     ${item.genero || '—'}`,
    `Velocidad:  ${item.velocidad}`,
    `Ánimo:      ${item.animo}`,
    sep,
    'TRANSCRIPCIÓN:',
    '',
    item.texto,
    '',
    sep,
    '© VozCraft · mateoRiosdev · 2026',
  ].join('\n');

  const safeName = nombre.replace(/[^a-zA-Z0-9_\-áéíóúñÁÉÍÓÚÑ ]/g, '').trim().replace(/ /g, '_') || `vozcraft-${item.id}`;
  downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), `${safeName}.txt`);
}

// ─── Main App ───
export default function VozCraft() {
  const [dark,     setDark]     = useState(true);
  const [language, setLanguage] = useState('es');
  const t = TEXTS[language];

  const [voz,      setVoz]      = useState('Español (México)');
  const [genero,   setGenero]   = useState('Voz Normal');
  const [velocidad,setVelocidad]= useState('Normal');
  const [animo,    setAnimo]    = useState('Neutral');
  const [texto,    setTexto]    = useState('');
  const [generando,setGenerando]= useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [playingId,setPlayingId]= useState(null);
  const [history,  setHistory]  = useState([]);
  const [charCount,setCharCount]= useState(0);
  const [toast,    setToast]    = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const uttRef = useRef(null);

  // Load history
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get('vozcraft-history');
        if (r) setHistory(JSON.parse(r.value));
      } catch {}
    })();
  }, []);

  const saveHistory = async h => {
    try { await window.storage.set('vozcraft-history', JSON.stringify(h)); } catch {}
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const speak = useCallback((txt, vozLabel, generoLabel, velLabel, animLabel, onEnd) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    const vd   = VOCES.find(v => v.label === vozLabel) || VOCES[0];
    const gd   = GENEROS.find(g => g.label === generoLabel) || GENEROS[0];
    const veld = VELOCIDADES.find(v => v.label === velLabel) || VELOCIDADES[2];
    const ad   = ANIMOS.find(a => a.label === animLabel) || ANIMOS[0];

    u.lang   = vd.lang;
    u.pitch  = Math.max(0.1, Math.min(2, gd.pitch * ad.pitch));
    u.rate   = Math.max(0.1, Math.min(10, (veld.rate + gd.rateAdd) * ad.rateMulti));
    u.volume = Math.max(0, Math.min(1, ad.volume));

    // Seleccionar voz del sistema según género
    const loadedVoices = window.speechSynthesis.getVoices();
    const voicesForLang = loadedVoices.filter(v =>
      v.lang === vd.lang || v.lang.startsWith(vd.lang.split('-')[0])
    );
    const wantFemale = generoLabel === 'Voz Aguda';
    // Intentar encontrar voz del género correcto
    const gendered = voicesForLang.find(v => {
      const n = v.name.toLowerCase();
      return wantFemale
        ? n.includes('female') || n.includes('woman') || n.includes('girl') || n.includes('femenin') || n.includes('paulina') || n.includes('mónica') || n.includes('lucia') || n.includes('valentina') || n.includes('rosa') || n.includes('samantha') || n.includes('karen') || n.includes('alice') || n.includes('milena')
        : n.includes('male') || n.includes('man') || n.includes('guy') || n.includes('masculin') || n.includes('jorge') || n.includes('carlos') || n.includes('diego') || n.includes('miguel') || n.includes('alex') || n.includes('daniel') || n.includes('thomas') || n.includes('james') || n.includes('mark');
    });
    const fallback = voicesForLang[0];
    if (gendered) u.voice = gendered;
    else if (fallback) u.voice = fallback;

    u.onstart = () => setReproduciendo(true);
    u.onend   = () => { setReproduciendo(false); setPlayingId(null); if (onEnd) onEnd(); };
    u.onerror = () => { setReproduciendo(false); setPlayingId(null); };

    uttRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setReproduciendo(false); setPlayingId(null); setGenerando(false);
  }, []);

  const handleGenerar = async () => {
    if (!texto.trim()) { showToast(t.noText, 'error'); return; }
    if (generando) { stopSpeech(); return; }

    setGenerando(true);
    const item = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      texto: texto.trim(),
      nombre: '',
      voz, genero, velocidad, animo,
    };

    await new Promise(r => setTimeout(r, 400));
    speak(texto, voz, genero, velocidad, animo, () => setGenerando(false));

    const newHistory = [item, ...history].slice(0, 30);
    setHistory(newHistory); saveHistory(newHistory);
    showToast(t.audioGenerated);
  };

  const importedAudioRef = useRef(null);

  const handlePlayHistory = useCallback((item, customText) => {
    // ── Reproducción de audio importado ──
    if (item.audioSrc) {
      if (importedAudioRef.current) {
        importedAudioRef.current.pause();
        importedAudioRef.current = null;
      }
      if (playingId === item.id) {
        stopSpeech(); setPlayingId(null);
      } else {
        stopSpeech();
        const audio = new Audio(item.audioSrc);
        importedAudioRef.current = audio;
        setPlayingId(item.id);
        setReproduciendo(true);
        audio.play();
        audio.onended = () => { setPlayingId(null); setReproduciendo(false); importedAudioRef.current = null; };
        audio.onerror = () => { setPlayingId(null); setReproduciendo(false); importedAudioRef.current = null; };
      }
      return;
    }
    // ── Reproducción TTS normal ──
    if (playingId === item.id && !customText) { stopSpeech(); }
    else {
      stopSpeech(); setPlayingId(item.id);
      speak(customText || item.texto, item.voz, item.genero, item.velocidad, item.animo, () => setPlayingId(null));
    }
  }, [playingId, stopSpeech, speak]);

  const handleDelete = id => {
    const n = history.filter(h => h.id !== id); setHistory(n); saveHistory(n);
    showToast(t.deleted);
  };

  const handleDownload = async (item, format) => {
    // Imported audio: re-download in its original format (or convert if needed)
    if (item.audioSrc) {
      try {
        const safeName = (item.nombre || `vozcraft-${item.id}`).replace(/[^a-zA-Z0-9_\-]/g, '_');
        if (format === item.audioFormat || !item.audioFormat) {
          // Same format → direct download from data URL
          const res = await fetch(item.audioSrc);
          const blob = await res.blob();
          downloadBlob(blob, `${safeName}.${item.audioFormat || format}`);
          showToast(t.downloaded(format.toUpperCase()));
        } else {
          // Different format → use AudioContext to convert
          const res = await fetch(item.audioSrc);
          const arrayBuf = await res.arrayBuffer();
          if (format === 'wav') {
            const audioCtx = new AudioContext();
            const decoded = await audioCtx.decodeAudioData(arrayBuf);
            const wavBuf = encodeWAV(decoded.getChannelData(0), decoded.sampleRate);
            downloadBlob(new Blob([wavBuf], { type: 'audio/wav' }), `${safeName}.wav`);
          } else {
            downloadBlob(new Blob([arrayBuf], { type: 'audio/mpeg' }), `${safeName}.mp3`);
          }
          showToast(t.downloaded(format.toUpperCase()));
        }
      } catch (e) { console.error(e); showToast(t.audioError, 'error'); }
      return;
    }
    // TTS-generated audio
    try { await generateAndDownloadAudio(item, format); showToast(t.downloaded(format.toUpperCase())); }
    catch (e) { console.error(e); showToast(t.audioError, 'error'); }
  };

  const handleDownloadTxt = item => {
    downloadTranscript(item, language);
    showToast(t.transcriptDl);
  };

  const handleRenameOpen  = item => setRenameItem(item);
  const handleRenameCancel = () => setRenameItem(null);
  const handleRenameConfirm = newName => {
    const updated = history.map(h => h.id === renameItem.id ? { ...h, nombre: newName.trim() } : h);
    setHistory(updated); saveHistory(updated); setRenameItem(null);
    showToast(t.nameUpdated);
  };

  const handleGuardarHistorial = () => {
    downloadBlob(new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' }), 'vozcraft-historial.json');
    showToast(t.historyExported);
  };
  const handleCargarHistorial = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.mp3,.wav';
    input.multiple = false;
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();

      // ── Cargar historial JSON ──
      if (ext === 'json') {
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const parsed = JSON.parse(ev.target.result);
            if (Array.isArray(parsed)) {
              setHistory(parsed); saveHistory(parsed);
              showToast(t.entriesLoaded(parsed.length));
            } else { showToast(t.fileReadError, 'error'); }
          } catch { showToast(t.fileReadError, 'error'); }
        };
        reader.readAsText(file);
        return;
      }

      // ── Cargar audio MP3 / WAV ──
      if (ext === 'mp3' || ext === 'wav') {
        const reader = new FileReader();
        reader.onload = ev => {
          const dataUrl = ev.target.result;
          // Obtener duración vía elemento Audio temporal
          const audioEl = new Audio(dataUrl);
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
          const placeholderText = language === 'es'
            ? `[Audio importado desde archivo: ${file.name}]`
            : `[Audio imported from file: ${file.name}]`;

          const createItem = (duration) => {
            const item = {
              id: Date.now().toString(),
              timestamp: file.lastModified || Date.now(),
              texto: placeholderText,
              nombre: nameWithoutExt,
              voz, genero, velocidad, animo,
              audioSrc: dataUrl,
              audioFormat: ext,
              audioDuration: duration || null,
              isImported: true,
            };
            setHistory(prev => {
              const newH = [item, ...prev].slice(0, 30);
              saveHistory(newH);
              return newH;
            });
            showToast(t.audioLoaded(nameWithoutExt));
          };

          audioEl.onloadedmetadata = () => createItem(audioEl.duration);
          audioEl.onerror = () => createItem(null);
        };
        reader.readAsDataURL(file);
        return;
      }

      showToast(t.fileReadError, 'error');
    };
    input.click();
  };
  const limpiarHistorial = () => { setHistory([]); saveHistory([]); showToast(t.historyCleared); };

  // ─── Theme ───────────
  const bg          = dark ? '#0a1628' : '#eef2fb';
  const cardBg      = dark ? 'rgba(255,255,255,0.035)' : '#ffffff';
  const cardBorder  = dark ? '1px solid rgba(255,255,255,0.07)' : '1.5px solid #dde6f5';
  const textPrimary = dark ? '#f1f5f9' : '#0f172a';
  const textSecondary = dark ? '#94a3b8' : '#64748b';
  const navBg       = dark ? 'rgba(10,22,40,0.97)' : 'rgba(15,40,120,0.98)';

  const ad = ANIMOS.find(a => a.label === animo) || ANIMOS[0];

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: bg, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.3s', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@700;800&display=swap" rel="stylesheet" />

      {/* Rename Modal */}
      {renameItem && (
        <RenameModal item={renameItem} dark={dark} lang={language} onConfirm={handleRenameConfirm} onCancel={handleRenameCancel} />
      )}

      {/* Toast */}
      {toast && (
        <div className="vc-toast" style={{
          position: 'fixed', top: 18, right: 18, zIndex: 99998,
          padding: '11px 18px', borderRadius: 10,
          background: toast.type === 'error' ? '#450a0a' : '#052e16',
          color: toast.type === 'error' ? '#fca5a5' : '#86efac',
          border: `1px solid ${toast.type === 'error' ? '#b91c1c' : '#166534'}`,
          fontSize: 13, fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.25s ease',
        }}>{toast.msg}</div>
      )}

      {/* Navbar */}
      <nav className="vc-nav" style={{
        background: navBg, backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 32px', height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 500, width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: 'linear-gradient(135deg,#7c3aed,#1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17, boxShadow: '0 4px 14px rgba(124,58,237,0.45)', overflow: 'hidden',
          }}>
            <img src="/logo.png" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerText = '🎙'; }} />
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>
            VozCraft
          </span>
        </div>
        <div className="vc-nav-actions" style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setDark(!dark)} style={{
            padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {dark ? '☀' : '🌙'}
            <span className="vc-nav-btn-text">{language === 'en' ? (dark ? ' Day' : ' Night') : (dark ? ' Claro' : ' Oscuro')}</span>
          </button>
          <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} style={{
            padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 12,
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {language === 'es' ? '🇺🇸' : '🇪🇸'}
            <span className="vc-nav-btn-text">{language === 'es' ? ' EN' : ' ES'}</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="vc-hero" style={{ textAlign: 'center', padding: '36px 24px 20px' }}>
        <h1 style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(26px, 3.5vw, 44px)',
          fontWeight: 800,
          color: dark ? '#f1f5f9' : '#0f172a',
          margin: 0,
          letterSpacing: -1,
        }}>
          VozCraft
        </h1>
        <p style={{ color: textSecondary, fontSize: 14, marginTop: 7 }}>{t.subtitle}</p>
      </div>

      {/* Main grid */}
      <div className="vc-main-grid" style={{
        width: '100%', padding: '0 28px 48px',
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20,
      }}>
        {/* Left card */}
        <div className="vc-left-card" style={{
          background: cardBg, border: cardBorder, borderRadius: 16, padding: '26px 28px',
          boxShadow: dark ? '0 16px 50px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.07)',
          backdropFilter: 'blur(10px)',
        }}>
          <div className="vc-controls-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            {/* Voz */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                {t.voice}
              </label>
              <Select value={voz} onChange={setVoz} options={VOCES} dark={dark} lang={language} />
            </div>

            {/* Género de Voz — toggle Normal/Agudo */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                {t.gender}
              </label>
              <GenderToggle value={genero} onChange={setGenero} dark={dark} lang={language} />
            </div>

            {/* Velocidad */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                {t.speed}
              </label>
              <Select value={velocidad} onChange={setVelocidad} options={VELOCIDADES} dark={dark} lang={language} />
            </div>

            {/* Ánimo */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
                {t.mood}
              </label>
              <Select value={animo} onChange={setAnimo} options={ANIMOS} dark={dark} lang={language} />
            </div>
          </div>

          {/* Mood bar */}
          <div style={{
            marginBottom: 18, padding: '10px 14px', borderRadius: 10,
            background: dark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e9eef5',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 22 }}>{ad.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary, marginBottom: 3 }}>
                {language === 'en' && ad.labelEn ? ad.labelEn : ad.label}{' '}
                <span style={{ fontWeight: 400, opacity: 0.6 }}>· {language === 'en' && ad.descEn ? ad.descEn : ad.desc}</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { key: language === 'es' ? 'Tono' : 'Pitch',    val: Math.round((ad.pitch - 0.7) / 0.65 * 100) },
                  { key: language === 'es' ? 'Velocidad' : 'Rate', val: Math.round((ad.rateMulti - 0.78) / 0.52 * 100) },
                  { key: language === 'es' ? 'Volumen' : 'Volume', val: Math.round((ad.volume - 0.88) / 0.12 * 100) },
                ].map(({ key, val }) => (
                  <div key={key} style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: textSecondary, marginBottom: 3 }}>{key}</div>
                    <div style={{ height: 4, borderRadius: 99, background: dark ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}>
                      <div style={{
                        height: '100%', width: `${Math.max(5, Math.min(100, val))}%`, borderRadius: 99,
                        background: 'linear-gradient(90deg,#2563eb,#7c3aed)', transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div style={{ position: 'relative' }}>
            <textarea
              className="vc-textarea"
              value={texto}
              onChange={e => { setTexto(e.target.value); setCharCount(e.target.value.length); }}
              placeholder={t.placeholder}
              maxLength={5000}
              style={{
                width: '100%', minHeight: 190, padding: '13px 15px',
                border: dark ? '1px solid rgba(255,255,255,0.09)' : '1.5px solid #dde6f5',
                borderRadius: 12, resize: 'vertical', boxSizing: 'border-box',
                background: dark ? 'rgba(255,255,255,0.03)' : '#fafbff',
                color: textPrimary, fontSize: 14.5, lineHeight: 1.7,
                fontFamily: "'DM Sans', sans-serif", outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => { e.target.style.borderColor = '#2563eb'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'; }}
              onBlur={e => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.09)' : '#dde6f5'; e.target.style.boxShadow = 'none'; }}
            />
            <div style={{
              position: 'absolute', bottom: 10, right: 13, fontSize: 11,
              color: charCount > 4500 ? '#ef4444' : textSecondary,
            }}>{charCount}/5000</div>
          </div>

          {/* Botón Generar */}
          <div className="vc-generate-wrap" style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
            <button className="vc-generate-btn" onClick={handleGenerar} style={{
              padding: '13px 44px', borderRadius: 12, border: 'none',
              background: generando
                ? 'linear-gradient(135deg,#7c3aed,#5b21b6)'
                : 'linear-gradient(135deg,#991b1b,#b91c1c)',
              color: '#fff', fontSize: 15, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', letterSpacing: 0.4,
              boxShadow: generando ? '0 8px 24px rgba(124,58,237,0.4)' : '0 8px 24px rgba(153,27,27,0.35)',
              transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: 10, minWidth: 210,
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {generando
                ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>{reproduciendo ? t.stop : t.generating}</>
                : <><span>🎧</span>{t.generate}</>
              }
            </button>
          </div>
        </div>

        {/* Right: Historial */}
        <div className="vc-right-card" style={{
          background: cardBg, border: cardBorder, borderRadius: 16, padding: '20px 18px',
          boxShadow: dark ? '0 16px 50px rgba(0,0,0,0.35)' : '0 4px 24px rgba(0,0,0,0.07)',
          backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', minWidth: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: textPrimary, fontFamily: "'Sora', sans-serif", minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {t.history}
              {history.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 500, opacity: 0.5 }}>({history.length})</span>
              )}
            </h3>
            {history.length > 0 && (
              <button onClick={limpiarHistorial} style={{
                flexShrink: 0, padding: '4px 9px', borderRadius: 6, border: 'none',
                background: dark ? 'rgba(239,68,68,0.14)' : '#fee2e2',
                color: '#ef4444', fontSize: 10, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              }}>{t.clearAll}</button>
            )}
          </div>

          <div className="vc-history-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 280, maxHeight: '60vh' }}>
            {history.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: 200, color: textSecondary, fontSize: 13, gap: 10, textAlign: 'center',
              }}>
                <span style={{ fontSize: 34, opacity: 0.2 }}>🎙</span>
                <span>{t.emptyHistory}</span>
              </div>
            ) : (
              history.map(item => (
                <HistoryItem
                  key={item.id} item={item} dark={dark} lang={language}
                  onPlay={handlePlayHistory}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onDownloadTxt={handleDownloadTxt}
                  onRename={handleRenameOpen}
                  playingId={playingId}
                  onStop={stopSpeech}
                />
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={handleGuardarHistorial} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#1d4ed8,#1e40af)',
              color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3,
            }}>{t.save}</button>
            <button onClick={handleCargarHistorial} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
              background: dark ? 'rgba(255,255,255,0.09)' : '#1e293b',
              color: dark ? '#e2e8f0' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3,
            }}>{t.load}</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #dde6f5',
        background: dark ? 'rgba(10,22,40,0.9)' : '#0f2d6e',
        padding: '16px 28px', textAlign: 'center',
        color: dark ? '#475569' : 'rgba(255,255,255,0.55)', fontSize: 13, width: '100%',
      }}>
        © 2026 — Mateo Julio Gomero Rios{' '}
        <a href="https://github.com/MateoRiosdev" target="_blank" rel="noopener noreferrer"
          style={{ color: dark ? '#64748b' : 'rgba(255,255,255,0.75)', fontWeight: 700, textDecoration: 'none' }}
          onMouseEnter={e => e.target.style.textDecoration = 'underline'}
          onMouseLeave={e => e.target.style.textDecoration = 'none'}
        >(MateoRiosdev)</a> · {t.footer}
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:none; } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.94) translateY(8px); } to { opacity:1; transform:none; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? 'rgba(255,255,255,0.1)' : '#c8d5e8'}; border-radius: 99px; }

        /* ── Tablet (≤ 900px) ─────────────────────────────── */
        @media (max-width: 900px) {
          .vc-main-grid {
            grid-template-columns: 1fr !important;
            padding: 0 16px 32px !important;
          }
          .vc-nav {
            padding: 0 16px !important;
            height: 56px !important;
          }
          .vc-hero {
            padding: 24px 16px 14px !important;
          }
          .vc-left-card {
            padding: 20px 18px !important;
          }
          .vc-right-card {
            max-height: none !important;
            overflow-x: hidden !important;
            min-width: 0 !important;
          }
          .vc-history-scroll {
            max-height: 400px !important;
            min-height: 200px !important;
            overflow-x: hidden !important;
          }
        }

        /* ── Mobile (≤ 600px) ─────────────────────────────── */
        @media (max-width: 600px) {
          .vc-textarea {
            min-height: 140px !important;
          }
          .vc-nav {
            padding: 0 12px !important;
            height: 52px !important;
          }
          .vc-nav-actions {
            gap: 6px !important;
          }
          .vc-nav-actions button {
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
          .vc-hero {
            padding: 18px 12px 10px !important;
          }
          .vc-main-grid {
            padding: 0 10px 24px !important;
            gap: 14px !important;
          }
          .vc-left-card {
            padding: 16px 14px !important;
            border-radius: 12px !important;
          }
          .vc-controls-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .vc-generate-wrap {
            margin-top: 14px !important;
          }
          .vc-generate-btn {
            width: 100% !important;
            padding: 13px 20px !important;
            min-width: unset !important;
            justify-content: center !important;
          }
          .vc-right-card {
            padding: 16px 14px !important;
            border-radius: 12px !important;
            overflow-x: hidden !important;
            min-width: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .vc-history-scroll {
            max-height: 350px !important;
            min-height: 160px !important;
            overflow-x: hidden !important;
          }
          .vc-history-scroll > * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .vc-history-btn-row {
            gap: 4px !important;
          }
          .vc-history-btn-row button {
            font-size: 9px !important;
            padding: 5px 7px !important;
          }
          .vc-toast {
            top: 10px !important;
            right: 10px !important;
            left: 10px !important;
            text-align: center !important;
          }
        }

        /* ── Very small phones (≤ 380px) ─────────────────── */
        @media (max-width: 380px) {
          .vc-nav-actions button span {
            display: none;
          }
          .vc-nav-actions button {
            padding: 6px 8px !important;
          }
          .vc-nav-btn-text {
            display: none !important;
          }
        }

        /* ── Ultra-small phones (≤ 375px) ─────────────────── */
        @media (max-width: 375px) {
          html, body { overflow-x: hidden !important; }
          .vc-nav {
            padding: 0 8px !important;
            height: 50px !important;
          }
          .vc-nav-actions {
            gap: 4px !important;
          }
          .vc-nav-actions button {
            padding: 5px 7px !important;
            font-size: 13px !important;
          }
          .vc-hero {
            padding: 14px 8px 8px !important;
          }
          .vc-hero h1 {
            font-size: 22px !important;
          }
          .vc-main-grid {
            padding: 0 6px 20px !important;
            gap: 10px !important;
          }
          .vc-left-card {
            padding: 12px 10px !important;
            border-radius: 10px !important;
          }
          .vc-right-card {
            padding: 12px 10px !important;
            border-radius: 10px !important;
            overflow-x: hidden !important;
            overflow-y: visible !important;
            min-width: 0 !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .vc-controls-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .vc-generate-btn {
            width: 100% !important;
            padding: 12px 16px !important;
            min-width: unset !important;
            font-size: 13px !important;
          }
          .vc-history-scroll {
            max-height: 300px !important;
            min-height: 120px !important;
            overflow-x: hidden !important;
          }
          .vc-history-scroll > * {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .vc-history-btn-row {
            gap: 3px !important;
          }
          .vc-history-btn-row button {
            font-size: 9px !important;
            padding: 5px 6px !important;
          }
          .vc-toast {
            top: 8px !important;
            right: 6px !important;
            left: 6px !important;
            font-size: 11px !important;
            padding: 8px 12px !important;
            text-align: center !important;
          }
        }

        @media (min-width: 601px) and (max-width: 900px) {
          .vc-controls-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
