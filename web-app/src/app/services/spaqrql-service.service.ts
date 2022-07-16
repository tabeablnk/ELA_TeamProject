import { Injectable } from '@angular/core';
import * as Sparql from 'sparqljs'
import internal from 'stream';
import { Category } from '../models/state-enum.model';
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
  counter_SPARQL_requests = 0;

  // Endpoint von WikiData an den die Anfrage geschickt werden muss
  endpointUrl = 'https://query.wikidata.org/sparql';
  queryDispatcher = new SPARQLQueryDispatcher( this.endpointUrl );

  // Prefixes und vorbereitete Anfragen
  prefixes_wikidata = 'PREFIX wdt: <http://www.wikidata.org/prop/direct/>\n'+ 
            'PREFIX wd: <http://www.wikidata.org/entity/>\n' + 
            'PREFIX wikibase: <http://wikiba.se/ontology#>\n' + 
            'PREFIX bd: <http://www.bigdata.com/rdf#>\n';

  // Nützliche SPARQL-Querys (als String)  
  sparql_query_all_cities = `#Bayrische Städte nach Anzahl der Einwohner (Top 100)
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
  ORDER BY DESC(?population) LIMIT 10`

  sparql_query_one_city_specific_attribute = `#Flüsse bei/um Nürnberg
  SELECT DISTINCT ?river ?riverLabel
  WHERE
  {
    wd:Q2090 wdt:P206 ?river.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "de". }
  }`
  
  // Parser: SPARQL Query (String) -> JSON Objekt 
  parser = new Sparql.Parser();

  // Generator: JSON Objekt -> SPARQL Query (String)
  generator = new Sparql.Generator();

  // Gespeicherte Zwischenergebnisse
  results_all_cities:any;

  constructor(private categoryQuestions: CategoryQuestionsService) { }

  initGeneratedQuestions() {
    //diese Methode wird am Anfang aufgerufen, am besten du sendest hier schon mal die SPARQUL Anfrage mit fetch
    //über den categoryQuestinoService kannst du dann Fragen zu den verschiedenen QuestionsSets hinzufügen, wie hier zum Beispiel eine Single-Choice Frage für die Kategorie Demografie z.B.


    

    // installed sparqljs with npm install sparqljs (s. Notion for links to documantation)

    var parsedQuery = this.parser.parse(this.prefixes_wikidata + this.sparql_query_all_cities);
    var generatedQuery = this.generator.stringify(parsedQuery);
    console.log(generatedQuery);
    this.queryDispatcher.query(generatedQuery).then((response: any) => {
      // TODO: write a mehtod that generates the question and call it here with suitable data
      // the method should take the data from Sparql and insert into the question-queue...
      console.log(response);
      this.responseArrived = true;
    });
  }

  sending_request_all_cities(){
    // Funktion wird in der internen Logik aufgerufen, um die Anfrage nach den N-größten bayrischen Städten zu stellen
    // Enthält die Generierung der Anfrage + Aufruf von fetch


  }

  callback_all_cities(){
    // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen

    // Grundgerüst für eine neue Frage
    let new_question = {
      questionId: 0,
      questionType: 1,
      questionTypeName: "SingleChoice",
      category: 1,
      questionText: "Wo liegt die Alte Mainbrücke?",
      imageUrl: "",
      tip: "Hier ein Tipp",
      answeredCorrect: false,
      givenAnswers: ["answer1", "answer2"],

      additionalInfos: {
        options: ["München", "Würzburg", "Nürnberg", "Erlangen", "Hof"],
        correctAnswer: "Würzburg"
      }
    }
    this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);

  }

}
