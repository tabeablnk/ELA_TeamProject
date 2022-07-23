import { Injectable } from '@angular/core';
import { Console } from 'console';
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

  all_cities_response_arrived: Boolean = false;
  counter_SPARQL_requests = 0;
  distractor_variability_city_questions = 2456;
  percental_distraction_coefficient = 5; // Number indicates percental distraction 
  max_value_random_int = 10 // Number > 4!
  question_id_aig = 100;


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

  sparql_query_one_city_4_specific_attributes = `SELECT DISTINCT ?area ?postalcode ?firstmentioned ?above_see_level
  WHERE
  {
    wd:Q2090 wdt:P2046 ?area;
             wdt:P1249 ?firstmentioned;
             wdt:P281 ?postalcode;
             wdt:P2044 ?above_see_level.
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
    this.sending_request_all_cities(10);

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
    var updatedQuery = JSON.parse(JSON.stringify(parsedQuery));
    //console.log(updatedQuery);
    //console.log(number_of_requested_citys);
    updatedQuery.limit = number_of_requested_citys;
    //console.log(updatedQuery);
    
    var generatedQuery = this.generator.stringify(updatedQuery);
    //console.log(generatedQuery);

    this.queryDispatcher.query(generatedQuery).then((response: any) => {
      this.results_all_cities = response.results.bindings;
      this.callback_all_cities_trivial_distractors(response.results.bindings);
      this.callback_all_cities_percential_distractors(response.results.bindings);
      this.callback_all_cities_percential_and_random_distractors(response.results.bindings);
      this.callback_all_cities_city_names_as_distrators(response.results.bindings);
      this.callback_all_cities_generate_map_questions(response.results.bindings);
      this.callback_all_cities_sort_order_task(response.results.bindings);
      console.log(response);
      this.counter_SPARQL_requests++;
      this.all_cities_response_arrived = true;
      this.sending_request_some_attributes_for_one_city();
    });
  }

  callback_all_cities_trivial_distractors(result_sparql_request:any){
    // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen
    var counter_cities = Object.keys(result_sparql_request).length;
    //console.log(result_sparql_request);

    for (var i = 0; i < counter_cities; i++){
      //console.log(i);
      var population_of_current_city:number = result_sparql_request[i].population.value; 
      //console.log(population_of_current_city);

      // Grundgerüst für eine neue Frage
      var distractor1:number = +population_of_current_city+this.distractor_variability_city_questions;
      var distractor2:number = +population_of_current_city-this.distractor_variability_city_questions;
      var distractor3:number = +population_of_current_city+2*this.distractor_variability_city_questions;
      var distractor4:number = +population_of_current_city+3*this.distractor_variability_city_questions;

      let new_question = {
        questionId: this.question_id_aig,
        questionType: 1,
        questionTypeName: "SingleChoice",
        category: 1,
        questionText: "AIG: Wie viele Einwohner hat " + result_sparql_request[i].cityLabel.value +"?",
        imageUrl: "",
        timeNeeded: 0,
        alreadyAnsweredCount: 0,
        triesSummedUp:0,
        timeSummedUp:0,
        tip: "",
        answeredCorrect: false,
        givenAnswers: [],
        additionalInfos: {
          options: [population_of_current_city, 
                    distractor1, 
                    distractor2, 
                    distractor3, 
                    distractor4],
          correctAnswer: population_of_current_city
        }
      }
      this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
      this.question_id_aig++;
    }
  }

  callback_all_cities_percential_distractors(result_sparql_request:any){
    // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen
    var counter_cities = Object.keys(result_sparql_request).length;
    //console.log(result_sparql_request);

    for (var i = 0; i < counter_cities; i++){
      //console.log(i);
      var population_of_current_city:number = result_sparql_request[i].population.value; 
      //console.log(population_of_current_city);
      //console.log(typeof(population_of_current_city));

      // Grundgerüst für eine neue Frage
      var distractor1:number = +population_of_current_city+Math.round(this.percental_distraction_coefficient*population_of_current_city/100);
      var distractor2:number = +population_of_current_city-Math.round(this.percental_distraction_coefficient*population_of_current_city/100);
      var distractor3:number = +population_of_current_city+Math.round(2*this.percental_distraction_coefficient*population_of_current_city/100);
      var distractor4:number = +population_of_current_city+Math.round(3*this.percental_distraction_coefficient*population_of_current_city/100);

      let new_question = {
        questionId: this.question_id_aig,
        questionType: 1,
        questionTypeName: "SingleChoice",
        category: 1,
        questionText: "AIG: Wie viele Einwohner hat " + result_sparql_request[i].cityLabel.value +"?",
        imageUrl: "",
        timeNeeded: 0,
        alreadyAnsweredCount: 0,
        triesSummedUp:0,
        timeSummedUp:0,
        tip: "",
        answeredCorrect: false,
        givenAnswers: [],
        additionalInfos: {
          options: [population_of_current_city, 
                    distractor1, 
                    distractor2, 
                    distractor3, 
                    distractor4],
          correctAnswer: population_of_current_city
        }
      }
      this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
      this.question_id_aig++;
    }
  }

  getRandomInt(min:number, max:number) {
    return min + Math.floor(Math.random() * (max - min));
  }

  callback_all_cities_percential_and_random_distractors(result_sparql_request:any){
    // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen
    var counter_cities = Object.keys(result_sparql_request).length;
    console.log(result_sparql_request);

    for (var i = 0; i < counter_cities; i++){
      console.log(i);
      var population_of_current_city:number = result_sparql_request[i].population.value; 
      console.log(population_of_current_city);

      // Grundgerüst für eine neue Frage
      var random_int_distractor1 = this.getRandomInt(1,this.max_value_random_int);
      var random_int_distractor2 = this.getRandomInt(1,this.max_value_random_int);

      var random_int_distractor3 =this.getRandomInt(1,this.max_value_random_int);
      while(random_int_distractor3 == random_int_distractor1){
        random_int_distractor3 = this.getRandomInt(1, this.max_value_random_int);
      }

      var random_int_distractor4 =this.getRandomInt(1,this.max_value_random_int);
      while(random_int_distractor4 == random_int_distractor2){
        random_int_distractor4 = this.getRandomInt(1, this.max_value_random_int);
      }

      var distractor1:number = +population_of_current_city+Math.round(random_int_distractor1*this.percental_distraction_coefficient*population_of_current_city/100);
      var distractor2:number = +population_of_current_city-Math.round(random_int_distractor2*this.percental_distraction_coefficient*population_of_current_city/100);
      var distractor3:number = +population_of_current_city+Math.round(random_int_distractor3*this.percental_distraction_coefficient*population_of_current_city/100);
      var distractor4:number = +population_of_current_city-Math.round(random_int_distractor4*this.percental_distraction_coefficient*population_of_current_city/100);

      let new_question = {
        questionId: this.question_id_aig,
        questionType: 1,
        questionTypeName: "SingleChoice",
        category: 1,
        questionText: "AIG: Wie viele Einwohner hat " + result_sparql_request[i].cityLabel.value +"?",
        imageUrl: "",
        timeNeeded: 0,
        alreadyAnsweredCount: 0,
        triesSummedUp:0,
        timeSummedUp:0,
        tip: "",
        answeredCorrect: false,
        givenAnswers: [],
        additionalInfos: {
          options: [population_of_current_city, 
                    distractor1, 
                    distractor2, 
                    distractor3, 
                    distractor4],
          correctAnswer: population_of_current_city
        }
      }
      this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
      this.question_id_aig++;
    }
  }

  callback_all_cities_generate_map_questions(result_sparql_request:any){
    // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen
    var counter_cities = Object.keys(result_sparql_request).length;

    for (var i = 0; i < counter_cities; i++){
      var coordinates_of_current_city = result_sparql_request[i].gps.value.match(/[+-]?\d+(\.\d+)?/g).reverse();

      let new_question = 
      {
        questionId: this.question_id_aig,
        questionType: 2,
        questionTypeName: "MapQuestion",
        category: 1,
        questionText: "AIG: Wo liegt " + result_sparql_request[i].cityLabel.value + "?",
        imageUrl: "",
        timeNeeded: 0,
        alreadyAnsweredCount: 0,
        tip: "-",
        answeredCorrect: false,
        triesSummedUp:0,
        timeSummedUp:0,
        givenAnswers: ["", ""],
    
        additionalInfos: {
          correctAnswer: coordinates_of_current_city,
        }
      };
      this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
      this.question_id_aig++;
    }
  }

  getRandomArray(arr:any, n:any, distict_to:number) {
     //Pick random distinct arry elements from an bigger array and checks that the correct answer is not picked
      var result = new Array(n),
          len = arr.length,
          taken = new Array(len);
      if (n > len)
          throw new RangeError("getRandom: more elements taken than available");
      while (n--) {
          var x = Math.floor(Math.random() * len);
          if(x == distict_to){
            n++;
            continue;
          }
          result[n] = arr[x in taken ? taken[x] : x];
          taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
  }

  callback_all_cities_city_names_as_distrators(result_sparql_request:any){
        // Funktion wird asynchron von fetch aufgerufen, sobald die Antwort auf die SPARQL-Anfrage vorhanden ist
    // Hier: Auswertung der Ergebnisse + Erstellung der Fragen aus den Ergebnissen
    this.results_all_cities = result_sparql_request;
    var counter_cities = Object.keys(result_sparql_request).length;
    console.log(result_sparql_request);

    for (var i = 0; i < counter_cities; i++){
      console.log(i);
      var population_of_current_city:number = result_sparql_request[i].population.value; 
      console.log(population_of_current_city);
      var name_of_current_city = result_sparql_request[i].cityLabel.value;

      // Grundgerüst für eine neue Frage

      var randomly_picked_elements = this.getRandomArray(result_sparql_request,4,i);

      var distractor1 = randomly_picked_elements[0].cityLabel.value;
      var distractor2 = randomly_picked_elements[1].cityLabel.value;
      var distractor3 = randomly_picked_elements[2].cityLabel.value;
      var distractor4 = randomly_picked_elements[3].cityLabel.value;

      let new_question = {
        questionId: this.question_id_aig,
        questionType: 1,
        questionTypeName: "SingleChoice",
        category: 1,
        questionText: "AIG: Welche Stadt hat aktuell " + population_of_current_city  +" Einwohner?",
        imageUrl: "",
        timeNeeded: 0,
        alreadyAnsweredCount: 0,
        triesSummedUp:0,
        timeSummedUp:0,
        tip: "",
        answeredCorrect: false,
        givenAnswers: [],
        additionalInfos: {
          options: [name_of_current_city, 
                    distractor1, 
                    distractor2, 
                    distractor3, 
                    distractor4],
          correctAnswer: name_of_current_city
        }
      }
      this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
      this.question_id_aig++;
    }
  }

  compare_population_of_two_cities(firstEl: any, secondEl: any){
    if(firstEl.population.value > secondEl.population.value){
      return 1;
    }else{
      return -1;
    }

  }

  callback_all_cities_sort_order_task(result_sparql_request:any){
    // Gebe mit aus dem aktuellen Request 5 zufällige Städte samt Einwohnerzahlen zurück und sortiere dieses Array nach der Einwohnerzahl
    var randomly_picked_elements = this.getRandomArray(result_sparql_request,5,-1).sort(this.compare_population_of_two_cities);


    let new_question ={
      questionId: this.question_id_aig,
      questionType: 6,
      questionTypeName: "SortOrder",
      category: 1,
      questionText: "AIG: Sortieren Sie die folgenden Städte nach der Einwohnerzahl (Meiste zu Wenigste)",
      imageUrl: "",
      timeNeeded: 0,
      alreadyAnsweredCount: 0,
      tip: "-",
      answeredCorrect: false,
      triesSummedUp:0,
      timeSummedUp:0,
      givenAnswers: [],
  
      additionalInfos: {
        options: ["", ""],
        correctAnswer: [
          {
            name: randomly_picked_elements[0].cityLabel.value,
            value: randomly_picked_elements[0].population.value 
          },
          {
            name: randomly_picked_elements[1].cityLabel.value,
            value: randomly_picked_elements[1].population.value 
          },
          {
            name: randomly_picked_elements[2].cityLabel.value,
            value: randomly_picked_elements[2].population.value 
          },
          {
            name: randomly_picked_elements[3].cityLabel.value,
            value: randomly_picked_elements[3].population.value 
          },
          {
            name: randomly_picked_elements[4].cityLabel.value,
            value: randomly_picked_elements[4].population.value 
          }
        ]
      }
    }
    this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
    this.question_id_aig++;
  }

  sending_request_some_attributes_for_one_city(tag_for_city:string = 'Q2090'){
    var parsedQuery = this.parser.parse(this.prefixes_wikidata + this.sparql_query_one_city_4_specific_attributes);
    var updatedQuery = JSON.parse(JSON.stringify(parsedQuery));
    for(var i = 0; i < 4; i++){
      updatedQuery.where[0].triples[i].subject.value = 'http://www.wikidata.org/entity/'+ tag_for_city;
    }
    var generatedQuery = this.generator.stringify(updatedQuery);

    this.queryDispatcher.query(generatedQuery).then((response: any) => {
      this.callback_some_attributes_for_one_city(response.results.bindings);

      this.callback_some_attributes_for_one_city(response.results.bindings);
      this.callback_some_attributes_for_one_city(response.results.bindings);
      this.callback_some_attributes_for_one_city(response.results.bindings);
      this.callback_some_attributes_for_one_city(response.results.bindings);
      this.callback_some_attributes_for_one_city(response.results.bindings);
      this.callback_some_attributes_for_one_city(response.results.bindings);

      console.log(response);
      this.counter_SPARQL_requests++;
    });
  }

  getRandomFiledBoolArray(size:number, number_of_false:number){   
    var result = new Array(size).fill(true);
    var i = 0;
    while(i < number_of_false){
      var current_index = this.getRandomInt(0, size-1);
      if(result[current_index] == false){
        result[current_index] = true;
        i++;
      }
    }
    return result;
  }

  callback_some_attributes_for_one_city(result_sparql_request:any){
    var postalcode = result_sparql_request[0].postalcode.value;
    var above_see_level = result_sparql_request[0].above_see_level.value;
    var area = result_sparql_request[0].area.value;
    var firstmentioned = result_sparql_request[0].firstmentioned.value;

    var distractor_postalcode = "90"+this.getRandomInt(0,9)+this.getRandomInt(0,9)+this.getRandomInt(0,9)+" - 92000";
    var distractor_above_see_level = above_see_level + this.getRandomInt(-10,10)*above_see_level/50;
    var distractor_area = area + this.getRandomInt(-10,10)*area/50;
    var distractor_firstmentioned = this.getRandomInt(1,29)+"."+this.getRandomInt(1,12)+"."+this.getRandomInt(10, 1900);

    var number_of_wrong_answers = this.getRandomInt(1,3);

    var position_of_correct_answers = this.getRandomFiledBoolArray(4, number_of_wrong_answers);

    let new_question= {
      questionId: this.question_id_aig,
      questionType: 5,
      questionTypeName: "MultipleChoice",
      category: 1,
      questionText: "AIG: Welche dieser Fakten über " + result_sparql_request[0].cityLabel.value+ " sind wahr?",
      imageUrl: "",
      timeNeeded: 0,
      alreadyAnsweredCount: 0,
      tip: "-",
      answeredCorrect: false,
      triesSummedUp:0,
      timeSummedUp:0,
      givenAnswers: [{}],
  
      additionalInfos: {
        correctAnswer: [position_of_correct_answers[0]? postalcode : "blub", 
                        position_of_correct_answers[1]?  above_see_level: "blob",
                        position_of_correct_answers[2]? area : "bla",
                        position_of_correct_answers[3]? firstmentioned : "blib"],
        options: [position_of_correct_answers[0]? postalcode : distractor_postalcode, 
                  position_of_correct_answers[1]?  above_see_level: distractor_above_see_level,
                  position_of_correct_answers[2]? area : distractor_area,
                  position_of_correct_answers[3]? firstmentioned : distractor_firstmentioned]
      }
    }
    this.categoryQuestions.addCategoryQuestion(Category.Demografie, new_question);
    this.question_id_aig++;
  }
}
