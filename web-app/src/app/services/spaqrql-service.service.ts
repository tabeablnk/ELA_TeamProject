import { Injectable } from '@angular/core';
import * as Sparql from 'sparqljs'
import { CategoryQuestionsService } from './category-questions.service';

class SPARQLQueryDispatcher {

  endpoint: any;
  constructor(endpoint: any) {
    this.endpoint = endpoint;
  }

  query(sparqlQuery: any) {
    const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
    const headers = { 'Accept': 'application/sparql-results+json' };

    //Nutzung der fetch-API um die Anfrag an Wikidata zu schicken und die Reultate als JSON zurück zu erhalten
    return fetch( fullUrl, { headers } ).then((body: any) => body.json());
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpaqrqlServiceService {

  responseArrived: Boolean = false;

  constructor(private categoryQuestions: CategoryQuestionsService) { }

  initGeneratedQuestions() {
    //diese Methode wird am Anfang aufgerufen, am besten du sendest hier schon mal die SPARQUL Anfrage mit fetch
    //über den categoryQuestinoService kannst du dann Fragen zu den verschiedenen QuestionsSets hinzufügen, wie hier zum Beispiel eine Single-Choice Frage für die Kategorie Demografie z.B.


    // Endpoint von WikiData an den die Anfrage geschickt werden muss
    var endpointUrl = 'https://query.wikidata.org/sparql';

    // Hier entsprechend die Query als String einpflegen
    var sparqlQuery = `#Bayrische Städte nach Anzahl der Einwohner (Top 100)
    #defaultView:BubbleChart
    SELECT DISTINCT ?city ?cityLabel ?population ?gps
    WHERE
    {
      ?city wdt:P31/wdt:P279* wd:Q515 .
      ?city wdt:P131*/wdt:P31*/wdt:P361*/wdt:P706* wd:Q980 .
      ?city wdt:P1082 ?population .
      ?city wdt:P625 ?gps .
      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "de" .
      }
    }
    ORDER BY DESC(?population) LIMIT 10`;

    const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );

    const prefixes_wikidata = 'PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n'+ 
              'PREFIX wd: <http://www.wikidata.org/entity/>\n' + 
              'PREFIX wikibase: <http://wikiba.se/ontology#>\n' + 
              'PREFIX bd: <http://www.bigdata.com/rdf#>\n';


    // installed sparqljs with npm install sparqljs (s. Notion for links to documantation)
    // Parse a SPARQL query to a JSON object
    //var SparqlParser = require('sparqljs').Parser;
    var parser = new Sparql.Parser();
    var parsedQuery = parser.parse(prefixes_wikidata + sparqlQuery);
    //console.log(parsedQuery)

    // Regenerate a SPARQL query from a JSON object
    //var SparqlGenerator = require('sparqljs').Generator;
    var generator = new Sparql.Generator;
    var generatedQuery = generator.stringify(parsedQuery);
    console.log(generatedQuery);
    queryDispatcher.query(generatedQuery).then((response: any) => {
      console.log(response);
      this.responseArrived = true;
    });


    //create new Question
    // let new_question = {
    //     questionId: 0,
    //     questionType: 1,
    //     questionTypeName: "SingleChoice",
    //     category: 1,
    //     questionText: "Wo liegt die Alte Mainbrücke?",
    //     imageUrl: "",
    //     tip: "Hier ein Tipp",
    //     answeredCorrect: false,
    //     givenAnswers: ["answer1", "answer2"],

    //     additionalInfos: {
    //       options: ["München", "Würzburg", "Nürnberg", "Erlangen", "Hof"],
    //       correctAnswer: "Würzburg"
    //     }
    // }
    // this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
  }
}
