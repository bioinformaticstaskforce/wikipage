"""Narration with Kokoro (local neural TTS). Usage: python tts.py <out_dir> <voice> <json list of texts>
Needs kokoro-onnx + soundfile, and kokoro-v1.0.onnx / voices-v1.0.bin in $KOKORO_DIR."""
import json, os, sys
import soundfile as sf
from kokoro_onnx import Kokoro

out, voice, texts = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
d = os.environ['KOKORO_DIR']
k = Kokoro(os.path.join(d, 'kokoro-v1.0.onnx'), os.path.join(d, 'voices-v1.0.bin'))
for i, t in enumerate(texts):
    s, sr = k.create(t, voice=voice, speed=float(os.environ.get('SPEED', '1.0')), lang='en-us')
    sf.write(os.path.join(out, f'n{i}.wav'), s, sr)
