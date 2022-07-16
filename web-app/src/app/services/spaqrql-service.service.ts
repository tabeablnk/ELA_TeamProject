import { Injectable } from '@angular/core';
import { randomInt } from 'jspsych/dist/modules/randomization';
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

  //responseArrived: Boolean = false;
  counter_SPARQL_requests = 0;
  distractor_variability_city_questions = 2456;

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
    //diese Methode wird am Anfang über ng_init() aufgerufen -> Initalisierung des Services + erste Anfragen verschicken
    this.sending_request_all_cities();


  }

  sending_request_all_cities(number_of_requested_citys: Number = -1){
    // Funktion wird in der internen Logik aufgerufen, um die Anfrage nach den N-größten bayrischen Städten zu stellen
    // Enthält die Generierung der Anfrage + Aufruf von fetch

    // Falls keine Limitierung an Städten gesetzt wurde bzw. eine Zahl kleiner 3 eingeben wurde, 
    // wird number_of_requested_citys per default auf 5 gesetzt 
    if(number_of_requested_citys < 3){
      number_of_requested_citys = 5;
    }

    var parsedQuery = this.parser.parse(this.prefixes_wikidata + this.sparql_query_all_cities);
    var updatedQuery = parsedQuery;
    //TODO: diese Code-Zeile zum Laufen bringen
    //updatedQuery.limit = number_of_requested_citys;
    
    var generatedQuery = this.generator.stringify(updatedQuery);
    //console.log(generatedQuery);

    this.queryDispatcher.query(generatedQuery).then((response: any) => {
      this.callback_all_cities(response.results);
      console.log(response);
      //this.responseArrived = true;
    });
  }

  callback_all_cities(result_sparql_request:any){
    // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen
    this.counter_SPARQL_requests++;
    this.results_all_cities = result_sparql_request;
    var counter_cities = Object.keys(result_sparql_request).length;

    for (var i = 0; i < counter_cities; i++){
      var population_of_current_city = result_sparql_request[i].population.value; 

      // Grundgerüst für eine neue Frage
      let new_question = {
        questionId: i+100,
        questionType: 1,
        questionTypeName: "SingleChoice",
        category: 1,
        questionText: "AIG: Wie viele Einwohner hat " + result_sparql_request[i].cityLabel.value,
        imageUrl: "",
        tip: "",
        answeredCorrect: false,
        givenAnswers: ["answer1", "answer2"],

        additionalInfos: {
          options: [population_of_current_city, population_of_current_city+this.distractor_variability_city_questions, population_of_current_city-this.distractor_variability_city_questions , population_of_current_city+2*this.distractor_variability_city_questions, population_of_current_city+3*this.distractor_variability_city_questions],
          correctAnswer: population_of_current_city
        }
      }
      //TODO: Überlegen wie mit RandomNumbers mehr Varaibilität in den Options möglich ist, im Moment lösen über SideChannel möglich! (Ist immer die 4 größte, bzw. 2 kleinste Zahl)
      this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
    }
  }

}
