import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from './models/state-enum.model';
import { CategoryQuestionsService } from './services/category-questions.service';
import { LoginGuardService } from './services/login-guard.service';
import { StateService } from './services/state.service';

// Import der fetch-API für SPARQL-Requests
import fetch from 'node-fetch';


class SPARQLQueryDispatcher {

  endpoint: any;
  constructor( endpoint: any ) {
  this.endpoint = endpoint;
}

query( sparqlQuery: any ) {
  const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
  const headers = { 'Accept': 'application/sparql-results+json' };

  // Nutzung der fetch-API um die Anfrag an Wikidata zu schicken und die Reultate als JSON zurück zu erhalten
  return fetch( fullUrl, { headers } ).then((body: any) => body.json());
}
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'web-app';

  loggedIn:any; 

  constructor(private loginGuard: LoginGuardService, private router: Router, private state: StateService, private categoryQuestions: CategoryQuestionsService){
    this.loggedIn = loginGuard.canActivate(); 
  }

  ngOnInit(): void {
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
    var SparqlParser = require('sparqljs').Parser;
    var parser = new SparqlParser();
    var parsedQuery = parser.parse(prefixes_wikidata + sparqlQuery);
    //console.log(parsedQuery)

    // Regenerate a SPARQL query from a JSON object
    var SparqlGenerator = require('sparqljs').Generator;
    var generator = new SparqlGenerator();
    var generatedQuery = generator.stringify(parsedQuery);
    console.log(generatedQuery);
    queryDispatcher.query(generatedQuery).then((response: any) => console.log(response.results.bindings));
    


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

    let url = window.location.href;
    if(url.includes("category")) {
      let currentCategory: Number = +url.charAt(url.length - 1);
      switch (currentCategory) {
        case 1:  
          this.state.setCategory(Category.Demografie);
          break;
        case 2:
          this.state.setCategory(Category.Kultur);
          break;
        case 3:
          this.state.setCategory(Category.Geographie);
          break;
        case 4:
          this.state.setCategory(Category.Geschichte);
          break;          
      }
     
    }
    
  }

  openDashboard() {

  }

  openHome() {
    this.router.navigate(['/home']);
  }
}
