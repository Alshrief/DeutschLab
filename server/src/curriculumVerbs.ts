export interface VerbDrillItem {
  infinitive: string;
  translationAr: string;
  type: 'IRREGULAR' | 'MODAL' | 'REGULAR';
  auxiliary: 'haben' | 'sein';
  present: {
    ich: string;
    du: string;
    er_sie_es: string;
    wir: string;
    ihr: string;
    sie_Sie: string;
  };
  prateritum: {
    ich: string;
    du: string;
    er_sie_es: string;
    wir: string;
    ihr: string;
    sie_Sie: string;
  };
  perfektPartizip2: string; // e.g. 'gefahren'
}

export const curatedVerbDrillItems: VerbDrillItem[] = [
  {
    infinitive: 'fahren',
    translationAr: 'يقود / يسافر بوسيلة مواصلات',
    type: 'IRREGULAR',
    auxiliary: 'sein',
    present: { ich: 'fahre', du: 'fährst', er_sie_es: 'fährt', wir: 'fahren', ihr: 'fahrt', sie_Sie: 'fahren' },
    prateritum: { ich: 'fuhr', du: 'fuhrst', er_sie_es: 'fuhr', wir: 'fuhren', ihr: 'fuhrt', sie_Sie: 'fuhren' },
    perfektPartizip2: 'gefahren',
  },
  {
    infinitive: 'gehen',
    translationAr: 'يذهب / يسير على الأقدام',
    type: 'IRREGULAR',
    auxiliary: 'sein',
    present: { ich: 'gehe', du: 'gehst', er_sie_es: 'geht', wir: 'gehen', ihr: 'geht', sie_Sie: 'gehen' },
    prateritum: { ich: 'ging', du: 'gingst', er_sie_es: 'ging', wir: 'gingen', ihr: 'gingt', sie_Sie: 'gingen' },
    perfektPartizip2: 'gegangen',
  },
  {
    infinitive: 'sehen',
    translationAr: 'يرى / يشاهد',
    type: 'IRREGULAR',
    auxiliary: 'haben',
    present: { ich: 'sehe', du: 'siehst', er_sie_es: 'sieht', wir: 'sehen', ihr: 'seht', sie_Sie: 'sehen' },
    prateritum: { ich: 'sah', du: 'sahst', er_sie_es: 'sah', wir: 'sahen', ihr: 'saht', sie_Sie: 'sahen' },
    perfektPartizip2: 'gesehen',
  },
  {
    infinitive: 'geben',
    translationAr: 'يعطي / يمنح',
    type: 'IRREGULAR',
    auxiliary: 'haben',
    present: { ich: 'gebe', du: 'gibst', er_sie_es: 'gibt', wir: 'geben', ihr: 'gebt', sie_Sie: 'geben' },
    prateritum: { ich: 'gab', du: 'gabst', er_sie_es: 'gab', wir: 'gaben', ihr: 'gabt', sie_Sie: 'gaben' },
    perfektPartizip2: 'gegeben',
  },
  {
    infinitive: 'sprechen',
    translationAr: 'يتحدث / يتكلم',
    type: 'IRREGULAR',
    auxiliary: 'haben',
    present: { ich: 'spreche', du: 'sprichst', er_sie_es: 'spricht', wir: 'sprechen', ihr: 'sprecht', sie_Sie: 'sprechen' },
    prateritum: { ich: 'sprach', du: 'sprachst', er_sie_es: 'sprach', wir: 'sprachen', ihr: 'spracht', sie_Sie: 'sprachen' },
    perfektPartizip2: 'gesprochen',
  },
  {
    infinitive: 'nehmen',
    translationAr: 'يأخذ / يتناول',
    type: 'IRREGULAR',
    auxiliary: 'haben',
    present: { ich: 'nehme', du: 'nimmst', er_sie_es: 'nimmt', wir: 'nehmen', ihr: 'nehmt', sie_Sie: 'nehmen' },
    prateritum: { ich: 'nahm', du: 'nahmst', er_sie_es: 'nahm', wir: 'nahmen', ihr: 'nahmt', sie_Sie: 'nahmen' },
    perfektPartizip2: 'genommen',
  },
  {
    infinitive: 'lesen',
    translationAr: 'يقرأ',
    type: 'IRREGULAR',
    auxiliary: 'haben',
    present: { ich: 'lese', du: 'liest', er_sie_es: 'liest', wir: 'lesen', ihr: 'lest', sie_Sie: 'lesen' },
    prateritum: { ich: 'las', du: 'lasest', er_sie_es: 'las', wir: 'lasen', ihr: 'last', sie_Sie: 'lasen' },
    perfektPartizip2: 'gelesen',
  },
  {
    infinitive: 'schlafen',
    translationAr: 'ينام',
    type: 'IRREGULAR',
    auxiliary: 'haben',
    present: { ich: 'schlafe', du: 'schläfst', er_sie_es: 'schläft', wir: 'schlafen', ihr: 'schlaft', sie_Sie: 'schlafen' },
    prateritum: { ich: 'schlief', du: 'schliefst', er_sie_es: 'schlief', wir: 'schliefen', ihr: 'schlieft', sie_Sie: 'schliefen' },
    perfektPartizip2: 'geschlafen',
  },
  {
    infinitive: 'können',
    translationAr: 'يستطيع / يقدر (فعل ناقص)',
    type: 'MODAL',
    auxiliary: 'haben',
    present: { ich: 'kann', du: 'kannst', er_sie_es: 'kann', wir: 'können', ihr: 'könnt', sie_Sie: 'können' },
    prateritum: { ich: 'konnte', du: 'konntest', er_sie_es: 'konnte', wir: 'konnten', ihr: 'konntet', sie_Sie: 'konnten' },
    perfektPartizip2: 'gekonnt',
  },
  {
    infinitive: 'müssen',
    translationAr: 'يجب / يضطر إجبارياً (فعل ناقص)',
    type: 'MODAL',
    auxiliary: 'haben',
    present: { ich: 'muss', du: 'musst', er_sie_es: 'muss', wir: 'müssen', ihr: 'müsst', sie_Sie: 'müssen' },
    prateritum: { ich: 'musste', du: 'musstest', er_sie_es: 'musste', wir: 'mussten', ihr: 'musstet', sie_Sie: 'mussten' },
    perfektPartizip2: 'gemusst',
  },
  {
    infinitive: 'wollen',
    translationAr: 'يريد / يرغب بعزيمة (فعل ناقص)',
    type: 'MODAL',
    auxiliary: 'haben',
    present: { ich: 'will', du: 'willst', er_sie_es: 'will', wir: 'wollen', ihr: 'wollt', sie_Sie: 'wollen' },
    prateritum: { ich: 'wollte', du: 'wolltest', er_sie_es: 'wollte', wir: 'wollten', ihr: 'wolltet', sie_Sie: 'wollten' },
    perfektPartizip2: 'gewollt',
  },
  {
    infinitive: 'bleiben',
    translationAr: 'يبقى / يمكث',
    type: 'IRREGULAR',
    auxiliary: 'sein',
    present: { ich: 'bleibe', du: 'bleibst', er_sie_es: 'bleibt', wir: 'bleiben', ihr: 'bleibt', sie_Sie: 'bleiben' },
    prateritum: { ich: 'blieb', du: 'bliebst', er_sie_es: 'blieb', wir: 'blieben', ihr: 'bliebt', sie_Sie: 'blieben' },
    perfektPartizip2: 'geblieben',
  },
];
