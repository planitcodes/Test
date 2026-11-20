"""Put the faster-whisper "small" model in ~/.cache/clipdesk/whisper-small.

Tries Hugging Face first (the normal faster-whisper source). If that host is blocked (some firewalls, cloud sandboxes),
falls back to an npm mirror of the same CTranslate2 int8 model, split in 4 parts, and checks the sha256 after joining.

usage: python get_whisper.py
"""
import hashlib, io, json, sys, tarfile, urllib.request
from pathlib import Path

DEST = Path.home() / ".cache" / "clipdesk" / "whisper-small"
NPM = "https://registry.npmjs.org/@skillninja/shortmovie-telop-model-p{i}"
FILES = ["config.json", "tokenizer.json", "vocabulary.json", "preprocessor_config.json"]


def from_hf():
    from faster_whisper.utils import download_model
    path = download_model("small")
    for f in Path(path).iterdir():
        (DEST / f.name).write_bytes(f.read_bytes())


def from_npm():
    parts, want = [], None
    for i in range(4):
        meta = json.load(urllib.request.urlopen(NPM.format(i=i), timeout=30))
        tgz = meta["versions"][meta["dist-tags"]["latest"]]["dist"]["tarball"]
        print(f"part {i + 1}/4 ...", flush=True)
        with tarfile.open(fileobj=io.BytesIO(urllib.request.urlopen(tgz, timeout=600).read())) as t:
            for m in t.getmembers():
                name = Path(m.name).name
                if name.startswith("model.bin.part"):
                    parts.append(t.extractfile(m).read())
                elif name in FILES:
                    (DEST / name).write_bytes(t.extractfile(m).read())
                elif name == "model.sha256":
                    want = t.extractfile(m).read().decode().split()[0]
    blob = b"".join(parts)
    got = hashlib.sha256(blob).hexdigest()
    if want and got != want:
        sys.exit(f"checksum mismatch: {got} != {want}")
    (DEST / "model.bin").write_bytes(blob)


def main():
    if (DEST / "model.bin").exists():
        print(f"already there: {DEST}"); return
    DEST.mkdir(parents=True, exist_ok=True)
    try:
        from_hf(); print(f"from Hugging Face -> {DEST}")
    except Exception as e:
        print(f"Hugging Face unavailable ({str(e)[:80]}), using the npm mirror")
        from_npm(); print(f"from npm -> {DEST}")


if __name__ == "__main__":
    main()
