// Usage: node render.mjs --stills 2,8,14   |   node render.mjs   (full render -> metromics-explainer.mp4)
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const work = path.join(process.env.CLAUDE_JOB_DIR ?? dir, 'tmp', 'video'); fs.mkdirSync(work, { recursive: true });
const VOICE = process.env.VOICE ?? 'am_michael', FPS = 30, LEAD = .25, TAIL = .3;
const tmp = process.env.CLAUDE_JOB_DIR ? path.join(process.env.CLAUDE_JOB_DIR, 'tmp') : dir;
const PY = process.env.KOKORO_PY ?? path.join(tmp, 'tts/bin/python'), KDIR = process.env.KOKORO_DIR ?? path.join(tmp, 'kokoro');
const SEGS = [
  { id: 'problem', min: 7, tts: 'Every lab builds its own pipeline. Different tools, versions and references mean results that are hard to compare.', cap: 'Different tools, versions and references: results that are hard to compare.' },
  { id: 'turn', min: 4, tts: 'Choosing the right workflow should not mean starting from scratch.', cap: 'Choosing the right workflow should not mean starting from scratch.' },
  { id: 'intro', min: 4.2, tts: 'Meet Metro Omics: a tube map for bioinformatics workflows.', cap: 'Meet MetrOmics: a tube map for bioinformatics workflows.' },
  { id: 'a', min: 4.6, tts: 'Each pipeline is a coloured line. Each tool is a station.', cap: 'Each pipeline is a coloured line. Each tool is a station.' },
  { id: 'b', min: 5, tts: 'Answer a few questions, and the recommender suggests the right pipeline.', cap: 'Answer a few questions, and the recommender suggests the right pipeline.' },
  { id: 'c', min: 7.8, tts: 'Open any tool to see its inputs and outputs. Then build your own pipeline, and export the script and a Conda environment.', cap: 'Build your own pipeline: export the script and a Conda environment.' },
  { id: 'end', min: 8.5, tts: 'One shared standard for P M M P centres, built by the Task Force. DNA and RNA today; methylation, proteomics and fragmentomics next.', cap: 'One shared standard for PMMP centres: DNA and RNA today, methylation, proteomics and fragmentomics next.' },
];

const stills = process.argv.includes('--stills') ? process.argv[process.argv.indexOf('--stills') + 1].split(',').map(Number) : null;
if (!stills) execFileSync(PY, [path.join(dir, 'tts.py'), work, VOICE, JSON.stringify(SEGS.map(s => s.tts))], { env: { ...process.env, KOKORO_DIR: KDIR }, stdio: 'inherit' });
let t0 = 0; const segs = [];
for (const [i, s] of SEGS.entries()) {
  const f = path.join(work, `n${i}`);
  const dur = stills ? s.min : Math.max(s.min, +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f + '.wav']).toString() + LEAD + TAIL);
  segs.push({ id: s.id, start: t0, end: t0 + dur, cap: s.cap, audioAt: t0 + LEAD }); t0 += dur;
}
const TL = { total: t0, segs }; console.log('timeline', segs.map(s => `${s.id} ${s.start.toFixed(1)}-${s.end.toFixed(1)}`).join(' | '), 'total', t0.toFixed(1));

if (process.argv.includes('--dry')) process.exit(0);
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--force-device-scale-factor=1'] });
const page = await browser.newPage(); await page.setViewport({ width: 1920, height: 1080 });
await page.evaluateOnNewDocument(tl => { window.TL = tl; }, TL);
await page.goto('file://' + path.join(dir, 'index.html')); await page.waitForFunction('window.READY === true');
page.on('pageerror', e => console.error('PAGE ERROR', e.message));

if (stills) {
  for (const t of stills) { await page.evaluate(t => render(t), t); await page.screenshot({ path: path.join(work, `still_${t}.png`) }); }
} else {
  const frames = path.join(work, 'frames'); fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames);
  const n = Math.ceil(TL.total * FPS);
  for (let f = 0; f < n; f++) { await page.evaluate(t => render(t), f / FPS); await page.screenshot({ path: path.join(frames, String(f).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92 }); if (f % 100 === 0) console.log('frame', f, '/', n); }
  const inputs = segs.flatMap((_, i) => ['-i', path.join(work, `n${i}.wav`)]);
  const fc = segs.map((s, i) => `[${i}]adelay=${Math.round(s.audioAt * 1000)}|${Math.round(s.audioAt * 1000)}[a${i}]`).join(';') + ';' + segs.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${segs.length}:normalize=0[out]`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-map', '[out]', path.join(work, 'narration.wav')]);
  const out = path.join(dir, 'metromics-explainer.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%05d.jpg'), '-i', path.join(work, 'narration.wav'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-t', String(TL.total), out]);
  console.log('done', out);
}
await browser.close();
