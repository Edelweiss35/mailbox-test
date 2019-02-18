var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var formidable = require('formidable');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];
var path = require('path');
var nodeMailer = require('nodemailer');
var popup_tools = require('popup-tools');
var passport = require('passport');
const {google} = require('googleapis');

 
 var passportOAuth2 = require('passport-oauth2');
 //var passportGoogle = require('passport-google-auth');
 var OAuth2Strategy = passportOAuth2.Strategy;
 //var GoogleStrategy = passportGoogle.Strategy;
 var SibApiV3Sdk = require('sib-api-v3-sdk');
 var defaultClient = SibApiV3Sdk.ApiClient.instance;

 GoogleStrategy = require('passport-google-oauth2').Strategy; 
var app = express();
app.set('view engine', 'ejs');

// const socket = require('./websocket');
var { mongoDB } = require('./config');
var Sheet = require('./models/Sheet');
var ExDomain = require('./models/ExDomain');
var User = require('./models/Account');
var Campaign = require('./models/Campaign');
var Message = require('./models/Message');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/app'));  
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
// connection and express server
console.log('Connection established');
mongoDB.connection();

var exDomains = ['Yelp.com', 'Angieslist.com', 'Homeadvisor.com', 'Thumbtack.com'];

app.post('/saveCalled', async function(req, res){
  var params = req.body;
  var id = params.id;
  var checked = params.checked;
  var data = await Sheet.updateData(id, 'Called', checked);
  res.json(data);
});

app.post('/saveStatusChange', async function(req, res){
  var params = req.body;
  var id = params.id;
  var value = params.value;
  var data = await Sheet.updateData(id, 'Status', value);
  res.json(data);
});

app.post('/getMapRank', async function(req, res){
  var params = req.body;
  var idAry = params.idAry;
  var data = await Sheet.getMapRank(idAry);
  res.json(data);
});

app.post('/getGoogleRank', async function(req, res){
  var params = req.body;
  var idAry = params.idAry;
  var data = await Sheet.getGoogleRank(idAry);
  res.json(data);
});

app.post('/getSSStatus', async function(req, res){
  var params = req.body;
  var idAry = params.idAry;
  var data = await Sheet.getSSStatus(idAry);
  res.json(data);
});

app.post('/saveSelectStatus', async function(req, res){
  var params = req.body;
  var idAry = params.idAry;
  var checked = params.checked;
  await Sheet.saveSelectStatus(idAry, checked);
  res.end();
});

app.post('/saveDelStatus', async function(req, res){
  var params = req.body;
  var idAry = params.idAry;
  await Sheet.saveDelStatus(idAry);
  res.end();
});

app.post('/fileupload', async function (req, res) {
  // drop db
  await Sheet.removeAll();
  // parse csv and store on db
  await parseCSV_SaveDB(req);
  // get google ranking
  // getGoogleRanking();
  // get screenshots
  // getScreenshots();
  console.log('Saved all data');
  res.end('Saved');
});
// start-gmail-config-part
 // 
app.get('/google/authorize',  passport.authenticate('google', {scope : [
  'profile',
  'email',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.insert',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.settings.basic'
] }));

app.get('/google/callback',passport.authenticate('google', {successRedirect : '/mailbox/accounts/add',failureRedirect : '/'}));
passport.use(new GoogleStrategy({
  clientID        : "410833159801-v4ed124qchf92d0ephe7h7otvp23o7ia.apps.googleusercontent.com",
  clientSecret    : "4KUG-B_pIN_GHqMISTz2sOuN",
  //callbackURL     : http://127.0.0.1:8080/google/callback",
  callbackURL     : "https://cuteleads.herokuapp.com/google/callback",
},
function(token, refreshToken, profile, done) {

  // make the code asynchronous
  // User.findOne won't fire until we have all our data back from Google
  process.nextTick(function(){
    
    // try to find the user based on thier google id
    User.findOne({'id': profile.id}, function(err, user){
      if (err)
        return done(err);
      console.log("token= " + token + " " + "refreshToken= " + refreshToken);
      if (user){
        // if a user is found, log them in
        /*** get message list api test code                         */
        const oAuth2Client = new google.auth.OAuth2(
          "410833159801-v4ed124qchf92d0ephe7h7otvp23o7ia.apps.googleusercontent.com",
          "4KUG-B_pIN_GHqMISTz2sOuN",
          "https://cuteleads.herokuapp.com/google/callback"
        )
               
        oAuth2Client.credentials = {access_token: token}
        const gmail = google.gmail({version: 'v1'});
      //  gmail.users.getProfile({ userId: user.id, auth: oAuth2Client },
        Message.removeAll();
        gmail.users.messages.list({ userId: user.id, auth: oAuth2Client,q:'before:2019/02/15 after:2019/02/01' },
            function(err, response) {
              console.log(response.data);
              var nCnt = response.data.messages.length;
              
              for (var i = 0; i < nCnt; i++) {
                var message_id = response['data']['messages'][i]['id'];
                gmail.users.messages.get({auth: oAuth2Client, userId: 'me', 'id': message_id}, function(err, response) {
                  if (err) {
                      console.log('The API returned an error: ' + err);
                      return;
                  }
         
                 console.log(response['data']);
                 
                 var newMsg          = new Message();
                
                  // set all of the relevant information
                  newMsg.id    = response['data'].id;
                  newMsg.threadId = response['data'].threadId;
                  newMsg.snippet  = response['data'].snippet;
                  newMsg.historyId = response['data'].historyId; // pull the first email
                  newMsg.date = response['headers'].date;
                  // save the user
                  newMsg.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newMsg);
                  });
              });
              }
 
              // Retreive the actual message using the message id
              
              
              res.send(response);
          });
       /***************************************************** */   
        //return done(null, user);-
      }else{
        // if the user isnt in our database, create a new user
        var newUser          = new User();

        // set all of the relevant information
        newUser.id    = profile.id;
        newUser.token = token;
        newUser.name  = profile.displayName;
        newUser.email = profile.emails[0].value; // pull the first email

         // save the user
         newUser.save(function(err) {
          if (err)
              throw err;
          return done(null, newUser);
        });
      }

    })
  })}
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
      done(err, user); 
   });
});

app.get('/google/gmailInbox', async function(req, res){
  const oAuth2Client = new google.auth.OAuth2(
    "410833159801-v4ed124qchf92d0ephe7h7otvp23o7ia.apps.googleusercontent.com",
    "4KUG-B_pIN_GHqMISTz2sOuN",
    "https://cuteleads.herokuapp.com/google/callback"
  )
  oAuth2Client.credentials = {access_token: token}
  const gmail = google.gmail({version: 'v1'});
  gmail.users.getProfile({ userId: user.id, auth: oAuth2Client },
      function(err, response) {
        console.log(response.data)
        res.json(response.data);
    });
})

app.post('/mailbox/campaigns', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'email.address',
          pass: 'user.password'
      }
  });
  let mailOptions = {
      from: '"user.name" <email.address>', // sender address
      to: req.body.to, // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.body, // plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }

      console.log('Message %s sent: %s', info.messageId, info.response);

      var newCampaign = new Campaign();

      // set all of the relevant information
      newCampaign.user = 'email.address';
      newCampaign.namefrom = 'user.name';
      newCampaign.emailaddressfrom = 'email.address.from';
      newCampaign.to = req.body.to;
      newCampaign.subject = req.body.subject;
      newCampaign.text = req.body.body;

       // save the campaign
       newCampaign.save(function(err) {
        if (err)
            throw err;
        return res.render(path.join(__dirname, './views/mailbox/campaigns'));
      });

          res.render(path.join(__dirname, './views/mailbox/campaigns'));
      });
  });
// end-gmail-config-part


app.get('/getCSVData', async function (req, res) {
  var result = await Sheet.getSheets();
  res.json(result);
});

app.get('/getInbox', async function (req, res) {
  var result = await Message.getMessage();
  res.json(result);
});

app.get('/getAccount', async function (req, res) {
  var result = await User.getAccount();
  res.json(result);
});

app.get('/', function(req, res){
  res.render('home');
});

app.get('/leads', function(req, res){
  res.render('leads');
});

app.get('/mailbox', function(req, res){
  res.render('mailbox');
});

app.get('/mailbox/sequences', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/sequences'));
});
//app.get('/sequences', function(req, res){
 // res.render('sequences');
//});

app.get('/mailbox/campaigns', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/campaigns'));
});

app.get('/mailbox/helpcenter', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/helpcenter'));
});

app.get('/mailbox/inbox', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/inbox'));
});

app.get('/mailbox/members', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/members'));
});

app.get('/mailbox/accounts', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/accounts'));
});

app.get('/mailbox/queue', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/queue'));
});

app.get('/mailbox/sequences', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/sequences'));
});

app.get('/mailbox/templates', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/templates'));
});

app.get('/mailbox/unsubscribed', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/unsubscribed'));
});

app.get('/login/signup', function(req, res){
  res.render(path.join(__dirname, './views/login/signup'));
});

app.get('/mailbox/accounts/add', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/accounts/add'));
});

app.get('/mailbox/accounts/add/simple', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/accounts/add/simple'));
});

app.get('/mailbox/accounts/add/advanced', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/accounts/add/advanced'));
});

app.get('/mailbox/sequences/newsequence', function(req, res){
  res.render(path.join(__dirname, './views/mailbox/sequences/newsequence'));
});

var ws = undefined;

var server = app.listen(port, async function(){
  console.log("Express server listening on port " + app.get('port'));

  // socket.createServer(server);

  for( var i in exDomains ){
    var domain = exDomains[i];
    var isExist = await ExDomain.isExist(domain);
    if(!isExist)
      await ExDomain.saveExcludedDomain(domain);
  }

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox']});
  startSSEngine(browser);
  getGoogleRanking(browser);
  // getMapRank(browser);
});
getGoogleRanking= async (browser)=> {
  console.log('start getGoogleRanking');

  var ele = await Sheet.getGoogleUnRankedSheet();
  if(ele == null){
    setTimeout(function() {
      getGoogleRanking(browser);
    }, 1000);
    return;
  }

  const page = await browser.newPage();
  page.once('load', () => console.log('Page loaded!'));
  try{
    await page.goto('https://www.startpage.com', { waitUntil: 'networkidle0' });
    await page.waitFor(2000);
  } catch (error){
    console.log('startpage error', error);
    setTimeout(function() {
      getGoogleRanking(browser);
    }, 1000);
    return;
  }

  var id = ele._id;
  var website = ele.Website;
  var kw = ele.Keyword;
  var city = ele.City;
  var query = city + ' ' + kw;
  console.log(query);
  var queryResult = await getGoogleQueryResult(page, query);
  if( queryResult == null){
    await page.close();
    setTimeout(function(){
      getGoogleRanking(browser);
    }, 1000);
    return;
  }
  var newResult = removeExDomainsFromQueryResult(queryResult);
  var queryRank = await getRankFromQueryResult(newResult, website);
  console.log(query, queryRank);
  await Sheet.updateData(id, 'Query', query);
  await Sheet.updateData(id, 'GoogleRank', queryRank);

  await page.close();
  setTimeout(function(){
    getGoogleRanking(browser);
  }, 1000);
}
getMapRank = async(browser) => {
  
  console.log('start getMapRanking');
  
  var ele = await Sheet.getMapUnRankedSheet();
  if(ele == null){
    setTimeout(function() {
      getMapRank(browser);
    }, 1000);
    return;
  }

  const page = await browser.newPage();
  page.once('load', () => console.log('Page loaded!'));
  try{
    await page.goto('https://www.google.com/maps/', { waitUntil: 'networkidle0' });
    await page.waitFor(2000);
  } catch (error){
    console.log('go to google map error', error);
    setTimeout(function() {
      getMapRank(browser);
    }, 1000);
    return;
  }

  var id = ele._id;
  var website = ele.Website;
  var company = ele.Company;
  var phone = ele.Phone;
  var domain = website.slice(website.indexOf('//') + 2);
  domain = domain.replace('www.', '');
  if(domain.indexOf('/') > 0)
    domain = domain.slice(0, domain.indexOf('/'));
    
  var kw = ele.Keyword;
  var city = ele.City;
  var query = city + ' ' + kw;
  console.log(query);

  var queryResult = await queryMapRank(page, query, company, phone, domain);
  if( queryResult == null){
    await page.close();
    setTimeout(function(){
      getMapRank(browser);
    }, 1000);
    return;
  }
  await Sheet.updateData(id, 'MapRank', queryResult);

  await page.close();
  setTimeout(function(){
    getMapRank(browser);
  }, 1000);
}
queryMapRank = async(page, query, company, phone, domain) =>{
  const navigationPromise = page.waitForNavigation();
  await page.evaluate(function() { document.querySelector('input#searchboxinput').value = ''; });
  await page.type('input#searchboxinput', query, { delay: 100 });
  await page.keyboard.press('Enter');
  await navigationPromise;
  await page.waitFor(5000);
  try{
    await getMapSS(page, 'div.section-scrollbox', query+'-map.jpg');
  } catch (error){
    console.log('getMapSS error', error);
    return null;
  }
  try{
    for (var i = 0; i < 10; i++) {
      const items = await page.$x('//div[@data-result-index]');
      if(items.length > i){
        var item = items[i];
        await item.click();
        await page.waitFor(3000);
        await page.waitForXPath('//h1[contains(@class, "section-hero-header-title")]');
        let resultCompany = await page.evaluate( () => document.querySelector( 'h1.section-hero-header-title' ).textContent );
        const phoneSpan = await page.$x('//div[contains(@class,"section-info-line") and descendant::span[@aria-label="Phone"]]//span[contains(@class,"widget-pane-link")]');
        const websiteSpan = await page.$x('//div[contains(@class,"section-info-line") and descendant::span[@aria-label="Website"]]//span[contains(@class,"widget-pane-link")]');
        let resultPhone = await page.evaluate(span => span.textContent, phoneSpan[0]);
        let resultWebsite = await page.evaluate(span => span.textContent, websiteSpan[0]);
        console.log('company = ', company, resultCompany);
        console.log('phone = ', phone, resultPhone);
        console.log('domain = ', domain, resultWebsite);
        if( company == resultCompany || phone == resultPhone || domain == resultWebsite ){
          return i+1;
        }
        const backToList = await page.$x("//button[contains(@class,'section-back-to-list-button')]");
        await backToList[0].click();
        await page.waitFor(2000);
      }
      else{
        console.log("can't find the listss");
        return null;
      }
    }
    
  }catch(error){
    console.log("Error", error);
    return null;
  }

  return '10+';
}
getMapSS = async (page, selector, filename) => {
  const rect = await page.evaluate(selector => {
    const element = document.querySelector(selector);
    const {x, y, width, height} = element.getBoundingClientRect();
    return {left: x, top: y, width, height, id: element.id};
  }, selector);

  return await page.screenshot({
    path: './app/img/SS/'+filename,
    clip: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    }
  });
}
getGoogleQueryResult= async (page, query)=>{

  const navigationPromise = page.waitForNavigation();
  
  var queryResult = [];
  await page.evaluate(function() { document.querySelector('input#query').value = ''; });
  await page.type('input#query', query, { delay: 100 });
  await page.keyboard.press('Enter');
  await navigationPromise;
  await page.waitFor(4000);

  try{
    const urlSpans = await page.$x('//span[contains(@class,"search-item__url")]');
    if(urlSpans.length > 0){
      console.log('k = 1', 'length', urlSpans.length);
      for (const urlSpan of urlSpans) {
        let text = await page.evaluate(ele => ele.innerHTML, urlSpan);
        queryResult.push(text);
      }
    }
    else{
      console.log("k=1 can't find the urls");
      return null;
    }
  }catch(error){
    console.log("k=1", error);
    return null;
  }

  for( var k = 0; k < 5; k++){
    try{
      const nextBtn = await page.$x("//button[@name='startat'][2]");
      await nextBtn[0].click();
      await page.waitFor(2000);
    } catch(error){
      return null;
    }
    try{
      await page.waitForXPath('//span[contains(@class,"search-item__url")]');
    } catch(error){
      console.log(error);
      return null;
    }
    
    const urlSpans = await page.$x('//span[contains(@class,"search-item__url")]');
    console.log(k + 2, 'length', urlSpans.length);
    for (const urlSpan of urlSpans) {
      let text = await page.evaluate(ele => ele.innerHTML, urlSpan);
      queryResult.push(text);
    }
  }
  console.log(queryResult.length);
  return queryResult;
}

removeExDomainsFromQueryResult =(queryResult) => {
  var newResult = [];
  for( var i = 0; i < queryResult.length; i++){
    var url = queryResult[i].toLowerCase();
    var isExDomain = false;
    for( var j in exDomains){
      var exDomain = exDomains[j].toLowerCase();
      isExDomain = url.includes(exDomain);
      if(isExDomain)
        break;
    }
    if(!isExDomain){
      newResult.push(queryResult[i]);
    }
  }
  return newResult;
}

getRankFromQueryResult = async (queryResult, website) => {
  var websiteUrl = website.toLowerCase();
  var gotRank = false;
  for( var i = 0; i < queryResult.length; i++){
    var url = queryResult[i].toLowerCase();
    gotRank = url.includes(websiteUrl);
    if(gotRank){
      return i+1;
    }
  }
  if(!gotRank)
    return '50+';
}

parseCSV_SaveDB = (req) => {
  return new Promise((resolve)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var path = files.filetoupload.path;
      fs.createReadStream(path)
      .pipe(csv())
      .on('data', function(data){
        try {
          //perform the operation
          Sheet.saveSheet(data.Company, data.Address1, data.Address2, data.ZIPCode, data.City, 
                                data.Region, data.Country, data.Phone, data.Contact, data.Website, 
                                data.Responsive, data.Email, data.Facebook, data.Twitter, data.GooglePlus, 
                                data.Linkedin, data.Instagram, data.Youtube, data.Facebook, data.Keyword);
        }
        catch(err) {
          //error handler
          console.log('error : ', err);
        }
      })
      .on('end',async function(){
        resolve();
      });  
    });
  });
}

startSSEngine = async (browser) => {
  const page = await browser.newPage();
  getSS(page);
}

getSS = async(page) => {
  console.log('start getScreenShot');
  var ele = await Sheet.getSSEmptySheet();
  if(ele == null){
    setTimeout(function(){getSS(page)}, 1000);
    return;
  }
  var _id = ele._id;
  var website = ele.Website;
  var fileName = website.slice(website.indexOf('//') + 2);
  fileName = fileName.replace('www.', '');
  fileName = fileName.replace(/\//g, '>');
  
  var mobileFileName = fileName + '-mobile.jpg';
  var desktopFileName = fileName + '-desktop.jpg';
  const desktopViewPort={width:1920, height:1080};
  const mobileViewPort={width:375, height:667};

  try{
    await page.setViewport(desktopViewPort);
  } catch (error){
    console.log('setViewport', error.message);
    setTimeout(function(){getSS(page)}, 1000);
    return;
  }
  try {
    await page.goto(website);
    await page.waitFor(3000);
  } catch (err) {
    console.log('goto page', err.message);
    await Sheet.updateData(_id, 'SS404', true);
    await Sheet.updateData(_id, 'SSCaptured', true);
    setTimeout(function(){getSS(page)}, 1000);
    return;
  }
  await page.screenshot({path: './app/img/SS/'+desktopFileName, type: 'jpeg'});
  await page.emulate(iPhone);
  await page.screenshot({path: './app/img/SS/'+mobileFileName, type: 'jpeg'});

  await Sheet.updateData(_id, 'SSCaptured', true);
  console.log(desktopFileName, 'captured');

  // socket.sendMsg(desktopFileName);
  setTimeout(function(){getSS(page)}, 1000);
}