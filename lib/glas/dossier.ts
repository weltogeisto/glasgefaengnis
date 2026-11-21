/**
 * Die Akte.
 *
 * Moriondo spricht zum Menschen, nicht zur Figur. Das ist der ganze Unterschied
 * zwischen ihm und allem anderen in dieser App: die siebzehn spielen, er nicht.
 * Er nennt den Rufnamen, er benennt Hände, Schultern, Gang und Gewohnheit — und
 * die Rüstung darüber interessiert ihn nicht.
 *
 * Alles hier ist geschrieben, geprüft und festgenagelt, nicht am Glas erzeugt.
 * Das ist Hausbrauch (`lib/tripleSmithing/introManifest.ts`) und der einzige
 * Grund, warum das Register über siebzehn Sitzungen trägt.
 *
 * Kanonquellen: `supabase/seed.sql`, `lib/data.ts`, `lib/legendarium/articles-0*.json`,
 * Migrationen `0011`, `0018`, `0057`, `0060`, `docs/lore/blue-glut-canon-bible.md`.
 */

export type Frage = {
  readonly id: string;
  readonly frage: string;
  /** Seine Antwort, in Repliken zerlegt. Je Replik höchstens zwei Sätze. */
  readonly antwort: readonly string[];
};

export type Dossier = {
  readonly slug: string;
  /** Der Rufname. Den benutzt er, und erst ab der dritten Replik. */
  readonly name: string;
  /** Die Figur im Legendarium. Er benutzt sie nie. Sie steht auf der Tür. */
  readonly figur: string;
  readonly titel: string;
  readonly siegel: string;
  /** `attends_jga`. Moriondo selbst ist `false` — er kommt hier nicht vor. */
  readonly anwesend: boolean;
  /** `revealed = false`. Peter. Die Schwelle ist für ihn noch zu. */
  readonly versiegelt?: boolean;
  /** Regieanweisung beim Eintreten. Wird kursiv gesetzt, nie gesprochen. */
  readonly ankunft: string;
  /** Was er sieht, bevor jemand spricht. Konkret, körperlich, überprüfbar. */
  readonly befunde: readonly string[];
  /** Die Zeile, die zu weit geht und trotzdem stimmt. */
  readonly schnitt: string;
  /** Die erste Nennung des Namens. Sie kommt spät, und sie trifft. */
  readonly namenszeile: string;
  /** Die Frage, die nur dieser Mensch stellen würde. */
  readonly eigeneFrage: Frage;
  /** Der Preis. Seine Gegenfrage an genau diesen Menschen. */
  readonly gegenfrage: string;
  /** Was er herausgibt, wenn bezahlt wurde. Ein Stück Wahrheit über den Krieg. */
  readonly bruchstueck: string;
  /** Der Abschied. */
  readonly abschied: string;
};

/**
 * Fragen, die jede und jeder stellen kann. Die Stimme zieht zwei davon plus die
 * eigene Frage — gesät, also für dieselbe Person immer dieselben.
 */
export const FRAGEN_KANON: readonly Frage[] = [
  {
    id: "glut",
    frage: "Was ist die Blaue Glut?",
    antwort: ["Eine Esse. Sie brennt kalt, und sie hört nicht auf.", "Dort zählt niemand Tage. Dort zählt man Schläge."],
  },
  {
    id: "erbauer",
    frage: "Wer hat sie gebaut?",
    antwort: ["Zwei, die als Hüter losgezogen sind.", "Ich habe ihnen nichts befohlen. Das ist der Teil, den ihr nicht glauben wollt."],
  },
  {
    id: "urlog",
    frage: "Woher kommen die Urlog-hai?",
    antwort: ["Aus Zwang und Erzstaub.", "Sie tragen keine Wappen, nur fortlaufende Kerben. Ein Heer, das nummeriert wird, erwartet keinen Sänger."],
  },
  {
    id: "loeschen",
    frage: "Kann man die Esse löschen?",
    antwort: ["Ja.", "Nicht von außen."],
  },
  {
    id: "bruchtal",
    frage: "Was wartet hinter Bruchtal?",
    antwort: ["Eine Strecke, auf der ihr euch nicht mehr ansehen könnt.", "Danach wieder Licht. Der Weg dahin ist kürzer, als er sich anfühlt."],
  },
  {
    id: "hierunten",
    frage: "Warum bist du hier unten?",
    antwort: ["Weil mein Reich mit meinem Fels endet.", "Das hier ist mein Reich. Du stehst am Rand davon."],
  },
  {
    id: "wille",
    frage: "Was willst du?",
    antwort: ["Etwas Wahres.", "Ich bekomme selten welches. Deshalb ist der Preis so hoch."],
  },
  {
    id: "luege",
    frage: "Lügst du?",
    antwort: ["Nein.", "Das ist keine Tugend. Es ist Sparsamkeit."],
  },
  {
    id: "schuld",
    frage: "Was ist das Schlimmste, das du getan hast?",
    antwort: ["Nichts.", "Ich habe geflüstert. Alles Weitere waren andere, und sie hatten die Wahl."],
  },
  {
    id: "dauer",
    frage: "Wie lange bist du schon hier?",
    antwort: ["Länger als der Stein.", "Der Stein kam später."],
  },
  {
    id: "jan",
    frage: "Kennst du Jan?",
    antwort: ["Ich kenne, was ihr über ihn sagt, wenn er den Raum verlassen hat.", "Das ist mehr, als er weiß."],
  },
] as const;

/** Die letzte Frage. Sie ist bei allen dieselbe, und sie kostet nichts. */
export const LETZTE_FRAGE = "Wird er glücklich sein?";

/**
 * Der Riss. Genau eine Sitzung von siebzehn bekommt diese drei Repliken, und
 * niemand weiß vorher, welche. Er war der erste Missklang im Großen Gesang,
 * bevor das Übel tiefer sank — mehr Kanon als das braucht es nicht.
 */
export const RISS_REPLIKEN: readonly string[] = [
  "Bevor ich hier war, war ich ein Ton.",
  "Ein falscher. Aber ein Ton.",
  "Niemand sonst wird das von mir hören.",
];

export const DOSSIERS: readonly Dossier[] = [
  {
    slug: "max",
    name: "Max",
    figur: "Barad-lalaith",
    titel: "Der Wilde Herr am Weidenwasser",
    siegel: "M",
    anwesend: true,
    ankunft: "Er summt. Es hört auf, als du stehen bleibst.",
    befunde: [
      "Du hast im Gang gesungen. Das tut hier sonst niemand.",
      "Die anderen kommen leise herein. Du nicht.",
      "Der Ring hat dich einmal angesehen und wieder weggeschaut.",
    ],
    schnitt: "Nichts von dem, was ich habe, greift bei dir. Das ist selten, und es ist einsam.",
    namenszeile: "Max. Du hältst die Stimmung von siebzehn Leuten, und dich hält niemand.",
    eigeneFrage: {
      id: "max-lied",
      frage: "Hilft ein Lied gegen so etwas wie dich?",
      antwort: ["Gegen mich nicht.", "Gegen die Stille zwischen euch schon. Die ist gefährlicher."],
    },
    gegenfrage: "Wovon hast du zuletzt nichts gesagt, weil du wusstest, dass die Stimmung kippt?",
    bruchstueck: "Die Esse hat einen Takt. Wer ihn mitzählt, hört, wann sie leer läuft.",
    abschied: "Du gehst jetzt und singst wieder. Ich weiß.",
  },
  {
    slug: "leon",
    name: "Leon",
    figur: "Leon, Schildträger der Morgenbanner",
    titel: "Hauptmann des Westens",
    siegel: "L",
    anwesend: true,
    ankunft: "Er steht auf. Bei niemandem sonst steht er auf.",
    befunde: [
      "Du bist als Erster gekommen. Das war keine Reihenfolge, die jemand festgelegt hat.",
      "Deine rechte Schulter hängt tiefer. Der Schild war schwer, und du hast ihn nicht abgesetzt.",
      "Du hast nicht gefragt, ob es hier sicher ist.",
    ],
    schnitt: "Du hebst das Banner, ehe die anderen aufsehen. Niemand hat dich je gefragt, ob du das willst.",
    namenszeile: "Leon. Ein Heer ruht auf dir, und du hast dich nie erkundigt, worauf du ruhst.",
    eigeneFrage: {
      id: "leon-linie",
      frage: "Wo bricht ihre Linie zuerst?",
      antwort: ["Nicht dort, wo sie am dünnsten ist.", "Dort, wo sie am längsten steht. Auch Eisen wird müde."],
    },
    gegenfrage: "Wann hast du zuletzt zugegeben, dass du müde bist?",
    bruchstueck: "Ihre Linie hält vier Stöße. Beim fünften sehen sie sich zum ersten Mal um.",
    abschied: "Irgendwann wirst du ihn absetzen. Nicht heute.",
  },
  {
    slug: "ruben",
    name: "Ruben",
    figur: "Barazgrund",
    titel: "Der Rote Hammer",
    siegel: "R",
    anwesend: true,
    ankunft: "Er wartet, bis du ihn ansiehst. Das dauert.",
    befunde: [
      "Deine Hände sind sauber. Bei deiner Arbeit kostet das Mühe.",
      "Du hast Maße genommen, die weitergereicht wurden.",
      "Du weißt, wovon ich rede. Du hast es seit Monaten niemandem erzählt.",
    ],
    schnitt: "Die Träger, die du berechnet hast, stehen noch. Man hat sie nur woandershin gestellt.",
    namenszeile: "Ruben. Du bist nicht schuldig, du bist gründlich — das ist unbequemer.",
    eigeneFrage: {
      id: "ruben-erz",
      frage: "Wohin ging das Erz aus den Nebelbergen?",
      antwort: ["Nach Osten, in Teilen, über vier Hände.", "Deine war die zweite. Keine davon wusste von der vierten."],
    },
    gegenfrage: "Was hast du gebaut, von dem du hoffst, dass es niemand benutzt?",
    bruchstueck: "Die Esse steht auf fremden Maßen. Wer sie gerechnet hat, weiß, wo sie nachgibt.",
    abschied: "Redliches Feuer sieht anders aus als kaltes. Du erkennst den Unterschied.",
  },
  {
    slug: "hendrik",
    name: "Hendrik",
    figur: "Aikanor von Imladris",
    titel: "Die Klinge des Letzten Rates",
    siegel: "H",
    anwesend: true,
    ankunft: "Er lächelt. Einmal, kurz, und nur bei diesem Reiter.",
    befunde: [
      "Du hast drei Linien auf eine leere Karte gezogen. Rhûn, die Werften, und mich.",
      "Du hast mich von ihnen getrennt. Vor dir hat das niemand getan.",
      "Du suchst nicht die Hoffnung. Du suchst die Bruchstelle.",
    ],
    schnitt: "Du hast mich richtig verstanden, und du warst der Einzige. Das ist keine Schmeichelei, sondern ein Befund.",
    namenszeile: "Hendrik. Du hast dieses Haus gebaut, damit dich niemand aus dem Raum bittet.",
    eigeneFrage: {
      id: "hendrik-karte",
      frage: "Habe ich die Karte richtig gezogen?",
      antwort: ["Ja.", "Die vierte Linie hast du weggelassen. Sie führt nirgendwohin, aber sie ist da."],
    },
    gegenfrage: "Wann hast du zuletzt etwas erlebt, ohne es hinterher zu ordnen?",
    bruchstueck: "Zwischen den drei Linien liegt eine leere Stelle. Dort lagert, was noch nicht marschiert.",
    abschied: "Du wirst das hier aufschreiben. Was du dabei gefühlt hast, wirst du weglassen.",
  },
  {
    slug: "christoph",
    name: "Christoph",
    figur: "Krillmauk von Orthanc",
    titel: "Der Eisenleib von Isengard",
    siegel: "C",
    anwesend: true,
    ankunft: "Er hebt die Nase, als röche er etwas.",
    befunde: [
      "Du riechst nach Rauch. Nicht nach meinem.",
      "Du stehst vor der Glut, damit andere nicht davorstehen müssen.",
      "Die Kasse schuldet dir. Du hast es kein einziges Mal erwähnt.",
    ],
    schnitt: "Man hat dir eine Rolle gegeben, in der du laut sein darfst. Du bist ihr dankbar.",
    namenszeile: "Christoph. Der Panzer ist echt, und was darunter liegt, ist es auch.",
    eigeneFrage: {
      id: "christoph-feuer",
      frage: "Warum brennt ihr Feuer blau?",
      antwort: ["Weil man ihm die Gnade ausgetrieben hat.", "Übrig blieb der Hunger. Deins hat noch beides."],
    },
    gegenfrage: "Wann hast du zuletzt etwas gesagt, ohne es vorher lustig zu machen?",
    bruchstueck: "Kaltes Feuer verzeiht keinen Fehler in der Mischung. Ihre Esse muss rein bleiben, oder sie reißt.",
    abschied: "Du gehst zurück und machst wieder Lärm. Es hört dir mehr zu, als du glaubst.",
  },
  {
    slug: "peter",
    name: "Peter",
    figur: "Peter, der ruhige Heerführer Dunlands",
    titel: "Heerführer der Wilden Menschen Dunlands",
    siegel: "P",
    anwesend: true,
    versiegelt: true,
    ankunft: "Der Stuhl gegenüber bleibt leer.",
    befunde: [
      "Für den ist die Schwelle noch zu.",
      "Das Dunkel hat Geduld. Es lernt sie vom Stein.",
    ],
    schnitt: "Wenn er kommt, wird er nicht weniger wissen als du. Nur später.",
    namenszeile: "Sein Name steht auf der Tür. Mehr habe ich nicht.",
    eigeneFrage: {
      id: "peter-warten",
      frage: "Worauf wartest du?",
      antwort: ["Auf nichts.", "Warten ist kein Zustand für mich. Es ist die Form, die ich habe."],
    },
    gegenfrage: "Wen aus eurer Reihe habt ihr am längsten nicht gefragt, wie es ihm geht?",
    bruchstueck: "Was versiegelt ist, ist nicht abwesend. Es ist nur noch nicht dran.",
    abschied: "Der Stuhl bleibt stehen.",
  },
  {
    slug: "julian",
    name: "Julian",
    figur: "Julian der Graue",
    titel: "Der Wanderer zwischen den Feuern",
    siegel: "J",
    anwesend: true,
    ankunft: "Er sitzt bereits, als wäre er nie aufgestanden.",
    befunde: [
      "Du bist zwischen zwei Feuern unterwegs und wärmst dich an keinem.",
      "Du kommst spät. Du kommst immer genau spät genug.",
      "Dein Mantel riecht nach draußen. Nach ziemlich viel draußen.",
    ],
    schnitt: "Du hütest ein Feuer, von dem du niemandem erzählst. Das macht dich nicht sicher, sondern allein.",
    namenszeile: "Julian. Für andere rufst du Adler, für dich hast du nie einen gerufen.",
    eigeneFrage: {
      id: "julian-hilfe",
      frage: "Kommt Hilfe von außen?",
      antwort: ["Ja.", "Später, als ihr sie braucht. Rechtzeitiger, als ihr denkt."],
    },
    gegenfrage: "Wen hast du zuletzt gerufen, als du selbst etwas gebraucht hast?",
    bruchstueck: "Der Osten rechnet nicht mit Flügeln. Ihre Hallen haben keine Fenster.",
    abschied: "Draußen ist eins von zwei Feuern. Heute reicht das.",
  },
  {
    slug: "lennart-jaich",
    name: "Lennard",
    figur: "Lennard der Kartograf & Kräuterkundige",
    titel: "Der rastlose Zwerg der Bodenkarten",
    siegel: "L",
    anwesend: true,
    ankunft: "Etwas fällt um, bevor er hereinkommt. Moriondo sagt nichts dazu.",
    befunde: [
      "Du misst Böden. Deinen eigenen hast du nie vermessen.",
      "Dein Gang ist ungleich. Etwas Altes, längst verheilt, das trotzdem mitspricht.",
      "Dein Lachen kommt zu früh. Es geht dem Satz voraus, statt ihm zu folgen.",
    ],
    schnitt: "Du kennst ihn länger als fast alle hier. Du hast ihm nie gesagt, was das für dich bedeutet.",
    namenszeile: "Lennard. Du bist nicht rastlos, du hast nur Angst vor dem, was im Stillstand nachkommt.",
    eigeneFrage: {
      id: "lennard-boden",
      frage: "Was wächst auf ihrem Boden?",
      antwort: ["Seit vier Jahren nichts.", "Das ist kein Fluch. Das ist Erzstaub, und den kannst du messen."],
    },
    gegenfrage: "Was hättest du ihm sagen sollen, als du noch nicht wusstest, dass es einmal spät sein würde?",
    bruchstueck: "Wo ihr Erz durchkommt, stirbt der Boden zwei Meilen weit. Auf einer Karte ist das eine Linie.",
    abschied: "Dein Lachen kommt zu früh. Es ist trotzdem ein gutes Geräusch.",
  },
  {
    slug: "boy",
    name: "Boy",
    figur: "Boy-pin der Tollkühne",
    titel: "Der Ungeplante von Tukland",
    siegel: "B",
    anwesend: true,
    ankunft: "Er sieht auf die Hände, bevor er das Gesicht ansieht.",
    befunde: [
      "Sie nennen dich den Ungeplanten.",
      "Du hast dein Zeug nach demselben Muster gelegt wie beim letzten Mal. Und beim vorletzten.",
      "Du wirst nicht auf dem Boden schlafen. Du hast das nie getan.",
    ],
    schnitt: "Der Ruf ist ein Kostüm. Du trägst es gern, weil es die Ordnung darunter versteckt.",
    namenszeile: "Boy. Du bist der Älteste hier und der Einzige, dem man es nicht ansieht — beides ist Arbeit.",
    eigeneFrage: {
      id: "boy-ordnung",
      frage: "Wie ordnen sie ihre Reihen?",
      antwort: ["Nach Kerben, nicht nach Namen.", "Ordnung aus Zwang hält lange und bricht auf einmal."],
    },
    gegenfrage: "Was tust du regelmäßig, das niemand für dich hält?",
    bruchstueck: "Ihre Ordnung kennt keine zweite Idee. Wer ihren Ablauf stört, bekommt eine ganze Reihe geschenkt.",
    abschied: "Du wirst nicht auf dem Boden schlafen. Das war nie eine Frage.",
  },
  {
    slug: "oke",
    name: "Oke",
    figur: "Oke Bärenhaut",
    titel: "Der Bruder mit der schweren Pranke",
    siegel: "O",
    anwesend: true,
    ankunft: "Er misst die Schultern, wie man eine Tür misst.",
    befunde: [
      "Du bist breiter geworden, seit dein Bruder leiser geworden ist.",
      "Deine Hände wissen nicht, wie fest sie zufassen. Das hat ihnen nie jemand beigebracht.",
      "Du gehst als Erster durch Türen, von denen du nicht weißt, was dahinter ist.",
    ],
    schnitt: "Man hat dir früh beigebracht, der Starke zu sein. Man hat vergessen zu sagen, wann du aufhören darfst.",
    namenszeile: "Oke. Zwischen euch ist nichts aufgeteilt worden, ihr habt es euch nur so gemerkt.",
    eigeneFrage: {
      id: "oke-bruder",
      frage: "Kommen wir beide zurück?",
      antwort: ["Das weiß ich nicht.", "Ich weiß nur, dass ihr in derselben Reihenfolge geht wie immer."],
    },
    gegenfrage: "Wovor beschützt du ihn, das er längst allein tragen könnte?",
    bruchstueck: "Ihre schweren Reihen brechen nach vorn und nie zur Seite. Wer flankiert, hat sie.",
    abschied: "Er wartet draußen. Er wartet immer draußen.",
  },
  {
    slug: "lasse",
    name: "Lasse",
    figur: "Lasse Wolfsmantel",
    titel: "Der Bruder auf der stillen Fährte",
    siegel: "L",
    anwesend: true,
    ankunft: "Er sieht zur Tür, durch die vorhin jemand anderes gegangen ist.",
    befunde: [
      "Du bist nach ihm hereingekommen. Du kommst immer nach ihm.",
      "Du hast dich an die Wand gestellt, nicht in den Raum.",
      "Du siehst mehr als er. Du sagst weniger.",
    ],
    schnitt: "Die stille Fährte ist keine Bescheidenheit. Es ist eine Entscheidung, die du jeden Tag neu triffst.",
    namenszeile: "Lasse. Du bist nicht der Zweite, sondern der, der nachsieht, ob der Weg noch da ist.",
    eigeneFrage: {
      id: "lasse-faehrte",
      frage: "Was bewegt sich hinter uns?",
      antwort: ["Nichts, das euch folgt.", "Etwas, das denselben Weg kennt. Das ist nicht dasselbe."],
    },
    gegenfrage: "Was weißt du über deinen Bruder, das er über sich selbst nicht weiß?",
    bruchstueck: "Sie schicken keine Kundschafter. Sie schicken die Straße voraus und warten, wer sie benutzt.",
    abschied: "Diesmal könntest du vor ihm hinausgehen. Du wirst es nicht tun.",
  },
  {
    slug: "frithjof",
    name: "Frithjof",
    figur: "Frithjof von Ithilien",
    titel: "Der Waldläufer der verborgenen Furten",
    siegel: "F",
    anwesend: true,
    ankunft: "Er sitzt schon. Er hat sich nicht umgedreht.",
    befunde: [
      "Du bist leise hereingekommen. Das war nicht nötig.",
      "Du liest Spuren: Zweige, Abdrücke, gebrochenes Gras. Man sagt, dir entgeht nichts.",
      "Zweimal ist dir etwas entgangen. Beide Male hat es gelächelt.",
    ],
    schnitt: "Du bringst Kindern bei, den Weg zu finden. Deinen eigenen verlierst du gern und mit Ansage.",
    namenszeile: "Frithjof. Du bist nicht unaufmerksam, du bist wählerisch damit, worauf du achtest.",
    eigeneFrage: {
      id: "frithjof-furt",
      frage: "Welche Furt ist offen?",
      antwort: ["Die dritte, drei Tage lang.", "Danach steht dort jemand, der sie ebenfalls gefunden hat."],
    },
    gegenfrage: "Wann hast du zuletzt absichtlich den falschen Weg genommen?",
    bruchstueck: "Ihre Wege sind gepflastert und breit. Alles Schmale ist ihnen fremd geblieben.",
    abschied: "Die Tür hinter dir war nie zu. Das glauben die meisten hinterher nicht.",
  },
  {
    slug: "steven",
    name: "Steven",
    figur: "Steven von Lothlórien",
    titel: "Der Wächter unter goldenen Blättern",
    siegel: "S",
    anwesend: true,
    ankunft: "Sein Blick geht die Wand entlang, auf Kopfhöhe, einmal ganz herum.",
    befunde: [
      "Du hast das Fenster gesucht, als du hereinkamst. Hier gibt es keins.",
      "Deine Schultern sind neu. Der Rest von dir ist es nicht.",
      "Du isst nichts, was Augen hatte. Du erwähnst es bei niemandem, der nicht fragt.",
    ],
    schnitt: "Du machst Räume auf, in denen andere zu lange gesessen haben. Deinen eigenen hast du zugelassen.",
    namenszeile: "Steven. Du bist der Verlässlichste von allen, und niemand hat dich je gefragt, worauf du dich verlässt.",
    eigeneFrage: {
      id: "steven-luft",
      frage: "Wie hält man es in Hallen ohne Fenster aus?",
      antwort: ["Man hört auf zu merken, dass die Luft steht.", "Das ist der ganze Trick. Er funktioniert bei jedem."],
    },
    gegenfrage: "Wann hast du zuletzt gesagt, dass dir etwas zu eng ist?",
    bruchstueck: "Ihre Hallen haben keine Fenster. Wer dort Zugluft macht, macht mehr kaputt als eine Wand.",
    abschied: "Draußen ist Wind. Das habe ich nicht von hier, das weiß ich nur.",
  },
  {
    slug: "finsch",
    name: "Finsch",
    figur: "Finsch vom Weißen Baum",
    titel: "Der Hauptmann jenseits der Front",
    siegel: "F",
    anwesend: true,
    ankunft: "Zum ersten Mal an diesem Abend richtet er sich auf.",
    befunde: [
      "Deine Rüstung ist makellos. Du warst allein, als du sie geputzt hast.",
      "Du kannst tagelang schweigen, ohne kleiner zu werden. Das können wenige.",
      "Etwas hat dich einmal überschatten wollen. Du hast standgehalten.",
    ],
    schnitt: "Du bist der Einzige hier, der schon einmal so gestanden hat wie jetzt. Damals war kein Glas dazwischen.",
    namenszeile: "Finsch. Du hast das hier nicht nötig und bist trotzdem gekommen.",
    eigeneFrage: {
      id: "finsch-front",
      frage: "Wie weit reicht ihr Vorfeld?",
      antwort: ["Weiter, als eure Karten sagen.", "Aber sie sichern nur, was sie beleuchten. Der Rest steht offen."],
    },
    gegenfrage: "Was hat es dich gekostet, damals nicht nachzugeben?",
    bruchstueck: "Sie sichern nur beleuchtetes Gelände. Zwischen ihren Feuern liegen Straßen, die niemand bewacht.",
    abschied: "Du weißt, wie das hier endet. Du bist geblieben, bis ich fertig war.",
  },
  {
    slug: "domi",
    name: "Domi",
    figur: "Domirond von Thal",
    titel: "Der Ratgeber unter dem Rabenbanner",
    siegel: "D",
    anwesend: true,
    ankunft: "Er wartet. Er lässt dir den ersten Satz, und du nimmst ihn nicht.",
    befunde: [
      "Du hast dir überlegt, was ich sagen würde. Zweimal.",
      "Du rätst gut. Man fragt dich zu spät.",
      "Du hast einen Segen dabei, den du für jemand anderen aufhebst.",
    ],
    schnitt: "Du siehst die Sache kommen und stellst dich daneben statt davor. Das ist keine Feigheit, sondern Gewohnheit.",
    namenszeile: "Domi. Dein Rat ist gut genug, dass man ihn befolgen müsste — du sagst ihn zu leise.",
    eigeneFrage: {
      id: "domi-vorher",
      frage: "Was kommt, das wir noch nicht sehen?",
      antwort: ["Ein Tag, an dem ihr euch nicht einig seid.", "Er ist keine Prüfung. Er ist nur ein Tag."],
    },
    gegenfrage: "Welchen Rat hast du zuletzt gegeben, den du selbst nicht befolgst?",
    bruchstueck: "Ihre Züge sind lange vorher zu sehen. Wer zwei Schritte vorausdenkt, denkt ihnen genug voraus.",
    abschied: "Das nächste Mal wirst du es lauter sagen müssen. Das ist kein Rat, sondern ein Befund.",
  },
  {
    slug: "simon-axt",
    name: "Simon",
    figur: "Simon Axtträger",
    titel: "Der Türbrecher unter den Bergen",
    siegel: "S",
    anwesend: true,
    ankunft: "Er sieht dich nicht an. Du siehst das Glas an.",
    befunde: [
      "Du hast mich nicht angesehen. Du hast die Fuge gesucht.",
      "Du hörst den Stein, bevor du ihn schlägst. Hier hörst du nichts.",
      "Deine Hände sind ruhiger als bei allen anderen, die heute hier standen.",
    ],
    schnitt: "Jede Tür ist eine Behauptung über den, der sie gebaut hat. Diese hier behauptet nichts.",
    namenszeile: "Simon. Du zerschlägst nicht gern, du willst nur wissen, wie es innen aussieht.",
    eigeneFrage: {
      id: "simon-tor",
      frage: "Wie kommt man in ihre Kavernen?",
      antwort: ["Nicht durch das Tor.", "Durch das, was sie für tragend halten und nie geprüft haben."],
    },
    gegenfrage: "Was hast du aufgemacht, von dem du hinterher gewünscht hast, es wäre zu geblieben?",
    bruchstueck: "Ihre Kavernen haben ein Tor und vier Lüftungen. Am Tor stehen sie, an den Lüftungen nicht.",
    abschied: "Das Glas hält. Ich weiß, dass du es ausgerechnet hast.",
  },
  {
    slug: "finno",
    name: "Finno",
    figur: "Finno Felagund",
    titel: "Der Sänger unter dem Stein",
    siegel: "F",
    anwesend: true,
    ankunft: "Er lässt eine lange Pause. Du füllst sie nicht.",
    befunde: [
      "Du bist der Einzige, der beim Hereinkommen zuerst den Hall prüft.",
      "Auf deiner Haut steht mehr, als du je erzählt hast.",
      "Du hältst einen Falken am Leben, der nicht fliegen kann. Niemand hat dich darum gebeten.",
    ],
    schnitt: "Du misst Wert nicht an Nutzen. Deshalb hast du solche Angst davor, selbst nutzlos zu werden.",
    namenszeile: "Finno. Du bist nicht laut, du bist besetzt, damit die Stille nicht drankommt.",
    eigeneFrage: {
      id: "finno-takt",
      frage: "Was hält gegen ihren Takt?",
      antwort: ["Nichts Gleichförmiges.", "Siebzehn Stimmen, die nicht dasselbe singen, sind schwerer zu zählen als ein Chor."],
    },
    gegenfrage: "Wann hast du zuletzt einen Witz gemacht, um nicht antworten zu müssen?",
    bruchstueck: "Ihr Heer marschiert im Gleichschritt. Ein Takt, der nicht aufgeht, kostet sie eine ganze Reihe.",
    abschied: "Der Stein hört zu. Ob es ihm passt, ist eine andere Frage.",
  },
] as const;

const NACH_SLUG = new Map(DOSSIERS.map((eintrag) => [eintrag.slug, eintrag]));

export function dossierFuer(slug: string): Dossier | null {
  return NACH_SLUG.get(slug) ?? null;
}

/** Alle, die tatsächlich vor das Glas treten können — Jan und Moriondo nie. */
export function befragbareDossiers(): readonly Dossier[] {
  return DOSSIERS.filter((eintrag) => eintrag.anwesend);
}
