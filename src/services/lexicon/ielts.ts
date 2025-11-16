export const IELTS_WORDS: string[] = [
  'climate','environment','emission','pollution','ecosystem','habitat','biodiversity','conservation','renewable','solar','wind','hydro','geothermal','sustainability','carbon','footprint','recycle','waste','resource','energy','transport','commute','urban','rural','development','economy','industry','agriculture','education','university','research','innovation','technology','data','analysis','trend','increase','decrease','rise','decline','growth','impact','effect','cause','result','solution','policy','regulation','law','government','public','private','funding','grant','budget','cost','benefit','risk','safety','health','medicine','hospital','patient','treatment','diet','exercise','obesity','smoking','alcohol','culture','society','community','family','children','youth','elderly','language','communication','media','internet','website','platform','application','service','customer','marketing','advertising','brand','product','quality','feature','feedback','survey','interview','report','presentation','lecture','seminar','workshop','assignment','exam','score','grade','library','museum','art','music','theatre','film','history','geography','science','biology','chemistry','physics','mathematics','statistics','environmental','engineering','architecture','design','material','structure','process','method','strategy','plan','project','deadline','schedule','time','budget','resource','team','leader','manager','employee','career','job','salary','promotion','training','skill','experience','qualification','volunteer','tourism','travel','hotel','airport','flight','ticket','reservation','restaurant','cafe','menu','vegetarian','vegan','allergy','organic','fresh','seasonal','local','import','export','shipping','logistics','warehouse','supply','demand','market','price','profit','loss','balance','account','payment','bank','loan','mortgage','insurance','tax','inflation','currency','exchange'
]

export function getDistractors(count: number, exclude: Set<string>): string[] {
  const pool = IELTS_WORDS.filter((w) => !exclude.has(w.toLowerCase()))
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break
    const idx = Math.floor(Math.random() * pool.length)
    out.push(pool[idx])
    pool.splice(idx, 1)
  }
  return out
}