var express = require('express');
var request = require('request');
var geoip = require('geoip-lite');
var CountryLanguage = require('country-language');
var bodyParser = require('body-parser')
var app = express();
var ipClient;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var result, time;
var test1,test2,test3;
var check1,check2,check3;
var percent1,percent2,percent3;

app.get('/', function(req, res) {
    percent1 = null;
    percent2 = null;
    percent3 = null;
    result = 0;
    //console.log(JSON.stringify(req.headers));
    console.log("------------------------------------------------------");
    //ipClient = '217.182.175.75'; //Proxy
    //ipClient = '104.248.140.7'; //VPN
    ipClient = '109.64.87.92'; //Real IP
    //ipClient = req.header('x-forwarded-for');
    console.log("Client Connected..");
    console.log(`Client IP: ${ipClient}`);
    console.log("------------------BlackBoxProxyBlock----------------------");
    BlackBoxProxyBlock(ipClient,res,req);
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
  }

app.listen(port);

app.use(express.static(__dirname + '/'));
console.log("Server is running..");

function BlackBoxProxyBlock(ipClient,res,req)
{
  request(`http://proxy.mind-media.com/block/proxycheck.php?ip=${ipClient}`,function(error,response,body){
    if(error || body == 'X'){
      console.log('BlackBoxProxyBlock error:', body);
      test1 = 'yellow';
      check1 = 'Checking Error';
    }
    else{
      if(body == 'N'){
          test1 = 'green';
          check1 = 'Succeed';
        }
        else{
          test1 = 'red';
          check1 = 'Failed';
          result += 0.3;
          percent1 = ' - 30%'
        }
        console.log('BlackBoxProxyBlock result is:', body);
      }
    console.log('1. Result is:', result);
    console.log("------------------HostChecker--------------------");
    HostChecker(ipClient,res,req);
  }
)};



function HostChecker(ipClient,res,req)
{
   request(`https://www.ipqualityscore.com/api/json/ip/uglNEXB1BLgftt4M5FyKRFrpdRFk6t0W/${ipClient}`,function(error,response,body){
    var bodyData = JSON.parse(body);
    if(error || bodyData['success'] == false){
      console.log('HostChecker error:', bodyData['success']);
      test2 = 'yellow';
      check2 = 'Checking Error';
    }
    else{
      if(bodyData['host'] == ipClient){
          test2 = 'red';
          check2 = 'Failed';
          result += 0.15;
          percent2 = ' - 15%'
        }
        else{
          test2 = 'green';
          check2 = 'Succeed';
        }
        console.log('HostChecker result is:', bodyData['host']);
      }
    console.log('2. Result is:', result);
    console.log("------------------ContryLanguage--------------------");
    ContryLanguage(ipClient,res,req);
})};



function ContryLanguage(ipClient,res,req){
  request(`https://api.ipgeolocation.io/timezone?apiKey=3f643672d11b4aff9c827233f1e5cb05&tz=Asia/Jerusalem`,function(error,response,body){
    if (error) {console.log(error)};
    time = JSON.parse(body)['time_24'];
    
  var answer = 0;
  try {
    var contry = geoip.lookup(ipClient)['country'];
    var accept_language = req.header('accept-language');
    console.log('Country:',contry);
    console.log('Accept_Language:', accept_language);
  } catch (err) {console.log(err);}

  CountryLanguage.getCountryLanguages(contry, function (err, languages) {
    if (err) {
      console.log(err);
    }
    else {
      languages.forEach(function (languageCodes) {
        console.log('#.', languageCodes.iso639_1);
        answer += accept_language.includes(languageCodes.iso639_1);
        })
      }
    })

  console.log('ContryLanguage result is:', answer);
  if(answer < 1){
    test3 = 'red';
    check3 = 'Failed';
    result += 0.25;
    percent3 = ' - 25%'
  }
  else{
    test3 = 'green';
    check3 = 'Succeed';
  }
  console.log('3. Result is:', result);

  res.render('index',{result:result,time:time,ipClient:ipClient,test1:test1,test2:test2,test3:test3,check1:check1,check2:check2,check3:check3,percent1,percent2,percent3});
  });
};