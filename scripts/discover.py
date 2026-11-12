#!/usr/bin/env python3
"""Discover recent arXiv candidates. Discovery is NOT scientific validation."""
import json, urllib.request, urllib.parse, xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/"data"/"candidates.json"
query=" OR ".join("cat:"+c for c in ["cs.AI","cs.LG","cs.CL","cs.RO","cs.CV"])
url="https://export.arxiv.org/api/query?"+urllib.parse.urlencode({"search_query":query,"start":0,"max_results":150,"sortBy":"submittedDate","sortOrder":"descending"})
req=urllib.request.Request(url,headers={"User-Agent":"AIResearchObservatory/0.1 (research discovery; GitHub Actions)"})
with urllib.request.urlopen(req,timeout=45) as response:
    xml=response.read()
root=ET.fromstring(xml)
ns={"a":"http://www.w3.org/2005/Atom"}
cutoff=datetime.now(timezone.utc)-timedelta(days=7)
entries=[]
for item in root.findall("a:entry",ns):
    def field(name):
        return (item.findtext("a:"+name,default="",namespaces=ns) or "").strip()
    published=field("published")
    updated=field("updated")
    if not published or max(datetime.fromisoformat(published.replace("Z","+00:00")),datetime.fromisoformat(updated.replace("Z","+00:00")))<cutoff:
        continue
    entries.append({"id":field("id"),"title":" ".join(field("title").split()),"published":published,"updated":updated,"abstract":" ".join(field("summary").split())[:1300],"status":"candidate_unreviewed","source":"arxiv"})
payload={"generated_at":datetime.now(timezone.utc).isoformat(),"window_days":7,"notice":"Candidatos sin validación científica; no aparecen automáticamente como seleccionados.","items":entries}
DEST.parent.mkdir(parents=True,exist_ok=True)
new=json.dumps(payload,ensure_ascii=False,indent=2)+"\n"
# Keep the audit timestamp only when candidate content changes, avoiding pointless commits.
if DEST.exists():
    old=json.loads(DEST.read_text(encoding="utf-8"))
    if old.get("items")==entries:
        print("No candidate changes")
        raise SystemExit(0)
DEST.write_text(new,encoding="utf-8")
print(f"Saved {len(entries)} candidates")
