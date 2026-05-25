export type VerbCategory = 'auxiliary' | 'modal' | 'irregular' | 'regular'

export interface Verb {
  infinitive: string
  english: string
  category: VerbCategory
  conjugation: {
    ich: string
    du: string
    erSieEs: string
    wir: string
    ihr: string
    Sie: string
  }
  example: { de: string; en: string }
}

export const verbs: Verb[] = [
  // — Auxiliaries —
  {
    infinitive: 'sein',
    english: 'to be',
    category: 'auxiliary',
    conjugation: { ich: 'bin', du: 'bist', erSieEs: 'ist', wir: 'sind', ihr: 'seid', Sie: 'sind' },
    example: { de: 'Wir sind in Berlin.', en: 'We are in Berlin.' },
  },
  {
    infinitive: 'haben',
    english: 'to have',
    category: 'auxiliary',
    conjugation: { ich: 'habe', du: 'hast', erSieEs: 'hat', wir: 'haben', ihr: 'habt', Sie: 'haben' },
    example: { de: 'Sie haben ein Auto.', en: 'They have a car.' },
  },
  {
    infinitive: 'werden',
    english: 'to become / will',
    category: 'auxiliary',
    conjugation: { ich: 'werde', du: 'wirst', erSieEs: 'wird', wir: 'werden', ihr: 'werdet', Sie: 'werden' },
    example: { de: 'Ihr werdet müde.', en: 'You (pl.) are getting tired.' },
  },

  // — Modals —
  {
    infinitive: 'können',
    english: 'can / to be able to',
    category: 'modal',
    conjugation: { ich: 'kann', du: 'kannst', erSieEs: 'kann', wir: 'können', ihr: 'könnt', Sie: 'können' },
    example: { de: 'Wir können Deutsch sprechen.', en: 'We can speak German.' },
  },
  {
    infinitive: 'müssen',
    english: 'must / to have to',
    category: 'modal',
    conjugation: { ich: 'muss', du: 'musst', erSieEs: 'muss', wir: 'müssen', ihr: 'müsst', Sie: 'müssen' },
    example: { de: 'Ihr müsst jetzt gehen.', en: 'You (pl.) have to go now.' },
  },
  {
    infinitive: 'wollen',
    english: 'to want to',
    category: 'modal',
    conjugation: { ich: 'will', du: 'willst', erSieEs: 'will', wir: 'wollen', ihr: 'wollt', Sie: 'wollen' },
    example: { de: 'Sie wollen Kaffee trinken.', en: 'They want to drink coffee.' },
  },
  {
    infinitive: 'möchten',
    english: 'would like to',
    category: 'modal',
    conjugation: { ich: 'möchte', du: 'möchtest', erSieEs: 'möchte', wir: 'möchten', ihr: 'möchtet', Sie: 'möchten' },
    example: { de: 'Wir möchten bitte zahlen.', en: 'We would like to pay, please.' },
  },
  {
    infinitive: 'dürfen',
    english: 'may / to be allowed to',
    category: 'modal',
    conjugation: { ich: 'darf', du: 'darfst', erSieEs: 'darf', wir: 'dürfen', ihr: 'dürft', Sie: 'dürfen' },
    example: { de: 'Darf ich Sie etwas fragen?', en: 'May I ask you something?' },
  },
  {
    infinitive: 'sollen',
    english: 'should / to be supposed to',
    category: 'modal',
    conjugation: { ich: 'soll', du: 'sollst', erSieEs: 'soll', wir: 'sollen', ihr: 'sollt', Sie: 'sollen' },
    example: { de: 'Du sollst um 9 Uhr da sein.', en: 'You are supposed to be there at 9.' },
  },

  // — Irregular —
  {
    infinitive: 'gehen',
    english: 'to go',
    category: 'irregular',
    conjugation: { ich: 'gehe', du: 'gehst', erSieEs: 'geht', wir: 'gehen', ihr: 'geht', Sie: 'gehen' },
    example: { de: 'Gehen Sie oft ins Kino?', en: 'Do you often go to the cinema?' },
  },
  {
    infinitive: 'kommen',
    english: 'to come',
    category: 'irregular',
    conjugation: { ich: 'komme', du: 'kommst', erSieEs: 'kommt', wir: 'kommen', ihr: 'kommt', Sie: 'kommen' },
    example: { de: 'Woher kommen Sie?', en: 'Where do you come from?' },
  },
  {
    infinitive: 'sprechen',
    english: 'to speak',
    category: 'irregular',
    conjugation: { ich: 'spreche', du: 'sprichst', erSieEs: 'spricht', wir: 'sprechen', ihr: 'sprecht', Sie: 'sprechen' },
    example: { de: 'Sprechen Sie Englisch?', en: 'Do you speak English?' },
  },
  {
    infinitive: 'heißen',
    english: 'to be called',
    category: 'irregular',
    conjugation: { ich: 'heiße', du: 'heißt', erSieEs: 'heißt', wir: 'heißen', ihr: 'heißt', Sie: 'heißen' },
    example: { de: 'Wie heißen Sie?', en: 'What is your name?' },
  },
  {
    infinitive: 'essen',
    english: 'to eat',
    category: 'irregular',
    conjugation: { ich: 'esse', du: 'isst', erSieEs: 'isst', wir: 'essen', ihr: 'esst', Sie: 'essen' },
    example: { de: 'Was esst ihr gern?', en: 'What do you (pl.) like to eat?' },
  },
  {
    infinitive: 'fahren',
    english: 'to drive / travel',
    category: 'irregular',
    conjugation: { ich: 'fahre', du: 'fährst', erSieEs: 'fährt', wir: 'fahren', ihr: 'fahrt', Sie: 'fahren' },
    example: { de: 'Fährst du mit dem Bus?', en: 'Are you going by bus?' },
  },
  {
    infinitive: 'schlafen',
    english: 'to sleep',
    category: 'irregular',
    conjugation: { ich: 'schlafe', du: 'schläfst', erSieEs: 'schläft', wir: 'schlafen', ihr: 'schlaft', Sie: 'schlafen' },
    example: { de: 'Er schläft noch.', en: 'He is still sleeping.' },
  },
  {
    infinitive: 'lesen',
    english: 'to read',
    category: 'irregular',
    conjugation: { ich: 'lese', du: 'liest', erSieEs: 'liest', wir: 'lesen', ihr: 'lest', Sie: 'lesen' },
    example: { de: 'Liest du gern Bücher?', en: 'Do you like reading books?' },
  },
  {
    infinitive: 'sehen',
    english: 'to see',
    category: 'irregular',
    conjugation: { ich: 'sehe', du: 'siehst', erSieEs: 'sieht', wir: 'sehen', ihr: 'seht', Sie: 'sehen' },
    example: { de: 'Siehst du das?', en: 'Do you see that?' },
  },
  {
    infinitive: 'nehmen',
    english: 'to take',
    category: 'irregular',
    conjugation: { ich: 'nehme', du: 'nimmst', erSieEs: 'nimmt', wir: 'nehmen', ihr: 'nehmt', Sie: 'nehmen' },
    example: { de: 'Ich nehme den Zug.', en: 'I take the train.' },
  },
  {
    infinitive: 'geben',
    english: 'to give',
    category: 'irregular',
    conjugation: { ich: 'gebe', du: 'gibst', erSieEs: 'gibt', wir: 'geben', ihr: 'gebt', Sie: 'geben' },
    example: { de: 'Gibt es hier ein Hotel?', en: 'Is there a hotel here?' },
  },
  {
    infinitive: 'wissen',
    english: 'to know (a fact)',
    category: 'irregular',
    conjugation: { ich: 'weiß', du: 'weißt', erSieEs: 'weiß', wir: 'wissen', ihr: 'wisst', Sie: 'wissen' },
    example: { de: 'Weißt du, wo das ist?', en: 'Do you know where that is?' },
  },
  {
    infinitive: 'trinken',
    english: 'to drink',
    category: 'irregular',
    conjugation: { ich: 'trinke', du: 'trinkst', erSieEs: 'trinkt', wir: 'trinken', ihr: 'trinkt', Sie: 'trinken' },
    example: { de: 'Was trinkst du?', en: 'What are you drinking?' },
  },
  {
    infinitive: 'schreiben',
    english: 'to write',
    category: 'irregular',
    conjugation: { ich: 'schreibe', du: 'schreibst', erSieEs: 'schreibt', wir: 'schreiben', ihr: 'schreibt', Sie: 'schreiben' },
    example: { de: 'Er schreibt eine E-Mail.', en: 'He is writing an email.' },
  },
  {
    infinitive: 'anrufen',
    english: 'to call (phone)',
    category: 'irregular',
    conjugation: { ich: 'rufe an', du: 'rufst an', erSieEs: 'ruft an', wir: 'rufen an', ihr: 'ruft an', Sie: 'rufen an' },
    example: { de: 'Ich rufe dich morgen an.', en: 'I will call you tomorrow.' },
  },
  {
    infinitive: 'ankommen',
    english: 'to arrive',
    category: 'irregular',
    conjugation: { ich: 'komme an', du: 'kommst an', erSieEs: 'kommt an', wir: 'kommen an', ihr: 'kommt an', Sie: 'kommen an' },
    example: { de: 'Wann kommst du an?', en: 'When do you arrive?' },
  },
  {
    infinitive: 'einladen',
    english: 'to invite',
    category: 'irregular',
    conjugation: { ich: 'lade ein', du: 'lädst ein', erSieEs: 'lädt ein', wir: 'laden ein', ihr: 'ladet ein', Sie: 'laden ein' },
    example: { de: 'Ich lade dich zum Geburtstag ein.', en: 'I invite you to the birthday party.' },
  },

  // — Regular —
  {
    infinitive: 'machen',
    english: 'to make / do',
    category: 'regular',
    conjugation: { ich: 'mache', du: 'machst', erSieEs: 'macht', wir: 'machen', ihr: 'macht', Sie: 'machen' },
    example: { de: 'Was macht ihr heute?', en: 'What are you (pl.) doing today?' },
  },
  {
    infinitive: 'wohnen',
    english: 'to live / reside',
    category: 'regular',
    conjugation: { ich: 'wohne', du: 'wohnst', erSieEs: 'wohnt', wir: 'wohnen', ihr: 'wohnt', Sie: 'wohnen' },
    example: { de: 'Wo wohnen Sie?', en: 'Where do you live?' },
  },
  {
    infinitive: 'arbeiten',
    english: 'to work',
    category: 'regular',
    conjugation: { ich: 'arbeite', du: 'arbeitest', erSieEs: 'arbeitet', wir: 'arbeiten', ihr: 'arbeitet', Sie: 'arbeiten' },
    example: { de: 'Wo arbeiten Sie?', en: 'Where do you work?' },
  },
  {
    infinitive: 'kaufen',
    english: 'to buy',
    category: 'regular',
    conjugation: { ich: 'kaufe', du: 'kaufst', erSieEs: 'kauft', wir: 'kaufen', ihr: 'kauft', Sie: 'kaufen' },
    example: { de: 'Ich kaufe Brot im Supermarkt.', en: 'I buy bread at the supermarket.' },
  },
  {
    infinitive: 'brauchen',
    english: 'to need',
    category: 'regular',
    conjugation: { ich: 'brauche', du: 'brauchst', erSieEs: 'braucht', wir: 'brauchen', ihr: 'braucht', Sie: 'brauchen' },
    example: { de: 'Ich brauche Hilfe.', en: 'I need help.' },
  },
  {
    infinitive: 'lernen',
    english: 'to learn / study',
    category: 'regular',
    conjugation: { ich: 'lerne', du: 'lernst', erSieEs: 'lernt', wir: 'lernen', ihr: 'lernt', Sie: 'lernen' },
    example: { de: 'Sie lernt jeden Tag Deutsch.', en: 'She studies German every day.' },
  },
]
