// Woordenlijst Leiden page 1-2
let wordsGerman = [
  // page 1
  'auch',
  ['außerdem', 'zudem', 'zusätzlich', 'hinzu kommt'],
  'ebenfalls',
  ['erweiterung', 'weiterführung', 'ergänzung'],
  ['erstens', 'zweitens', 'drittens'],
  'nicht nur, sondern auch',
  'sowie',
  ['begründung', 'grund'],
  'denn',
  'indem',
  'nämlich',
  'schließlich',
  'weil',
  'gegensatz',
  'aber',
  'allerdings',
  ['dagegen', 'hingegen'],
  'dennoch',
  'doch',
  'jedoch',
  'eigentlich',
  'einerseits, andererseits',
  ['immerhin', 'ohnehin'],
  'nicht, sondern',
  'obwohl',
  'stattdessen',
  ['trotzdem', 'trotz'],
  'während',
  ['zwar, aber', 'zwar, doch'],

  // page 2
  ['folge', 'schlussfolgerung'],
  'also',
  'daher',
  'damit',
  'demnach',
  'deshalb',
  'deswegen',
  'je...desto',
  'so',
  'so dass',
  ['illustrieren', 'konkretisieren'],
  'etwa',
  'so',
  'zum Beispiel',
  'vergleichen',
  'auch',
  ['eben so wie', 'genau so wie'],
  ['entweder...noch', 'weder...noch'],
  'steigerung',
  'erst recht',
  'gar',
  'sogar',
  ['tatsächlich', 'in der Tat'],
  'zumal',
  'einschränkung',
  'jedenfalls',
  'nur',
  'zusatz',
  'übrigens',
  'zusätzlich'
];
let wordsDutch = [
  // page 1
  'ook',
  'bovendien',
  ['eveneens', 'ook'],
  ['uitbreiding', 'opsomming'],
  ['ten eerste', 'ten tweede', 'ten derde'],
  ['niet alleen', 'maar ook'],
  ['evenals', 'alsook'],
  ['reden', 'oorzaak'],
  'want',
  'doordat',
  'namelijk',
  'per slot van rekening',
  'omdat',
  'tegenstelling',
  'maar',
  'echter',
  'daarentegen',
  'desalniettemin',
  'toch',
  'echter',
  'eigenlijk',
  ['enerzijds', 'anderzijds'],
  ['in ieder geval', 'toch'],
  'niet, maar',
  'hoewel',
  'in plaats daarvan',
  ['desondanks', 'ondanks'],
  'terwijl',
  'weliswaar, maar',

  // page 2
  ['gevolg', 'conclusie'],
  'dus',
  'vandaar',
  ['zodat', 'om te bereiken dat'],
  ['dus', 'daarom'],
  ['derhalve', 'daarom'],
  ['daarom', 'vandaar'],
  'hoe...hoe',
  ['dus', 'daarom'],
  'zodat',
  ['voorbeeld geven', 'concreet maken'],
  'bijvoorbeeld',
  ['zo', 'bijvoorbeeld'],
  'bijvoorbeeld',
  'vergelijken',
  'ook',
  ['net zo als', 'precies zo als'],
  'noch...noch',
  'versterking',
  'pas echt',
  'al helemaal',
  'zelfs',
  'inderdaad',
  ['vooral', 'omdat'],
  'beperking',
  ['in elk geval', 'in ieder geval'],
  ['slechts', 'alleen', 'alleen maar'],
  'extra informatie',
  'overigens',
  ['daar komt bij', 'daarnaast']
];

let wordlistInput = wordsGerman;
let wordlistOutput = wordsDutch;

let
  inputField,
  query,
  answer,
  correctAnswers = 0,
  totalAnswers = 0,
  sleep = 120,
  frameCountSleep,
  i;

function setup() {
  createCanvas(400, 400);
  inputField = createInput();
  inputField.position(width / 2 - 83, height + 15);
  getQuery();
}

function draw() {
  background(220);
  textSize(24);

  text(query, width / 2 - query.length * 6, height / 4);
  text(correctAnswers + '/' + totalAnswers, width / 2 - 25, height / 2);
  if (frameCount < frameCountSleep) {
    text(answer, width / 2 - answer.length * 6, height / 4 * 3);
  }
}

function getQuery() {
  query = random(wordlistInput);
  i = wordlistInput.indexOf(query);

  if (Array.isArray(query)) {
    query = random(query);
  }
}

function getAnswer() {
  if (inputField.value()) {
    totalAnswers++;
    if (Array.isArray(wordlistOutput[i])) {
      if (inputField.value().indexOf(wordlistOutput[i])) {
        correctAnswers++;
      } else {
        frameCountSleep = sleep + frameCount;
      }
    } else {
      answer = wordlistOutput[i];
      if (inputField.value() === answer) {
        correctAnswers++;
      } else {
        frameCountSleep = sleep + frameCount;
      }
    }

    getQuery()
    inputField.value('');
  }
}

function keyPressed() {
  switch (keyCode) {
    case 13: // enter
      getAnswer();
      break;
  }
}