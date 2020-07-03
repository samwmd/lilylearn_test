const dialogflow = require('dialogflow').v2beta1;
const uuid = require('uuid');
const projectId = 'agent1-iicsvo'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
const path = require('path')
const sessionId = uuid.v4();

// Handle CORS
app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// 
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
// render the error page
res.status(err.status || 500);
res.send('error');//this or res.status(err.status || 500).send('error')
});

//Open index page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/agent_ui/index.html'));
});

app.use(bodyParser.urlencoded({
  extended : false
}))

app.post('/send-msg',(req,res)=>{

  runSample(req.body.fname).then(data=>{
    res.send({Reply:data})
  })
})
/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
async function runSample(textInput,projectId = 'agent1-iicsvo') {
  // A unique identifier for the given session

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
      keyFilename:"Agent1-b28bb6fc1478.json"
  });
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: textInput,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(result.fulfillmentText);
  return result.fulfillmentText;
}
var stdin = process.openStdin();
stdin.addListener("data", function(d) {

    runSample(d);
  });

  app.listen(port,()=>{
    console.log("Running on port "+port);
  })