const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCh4jca6BqwtmKT\n1z/w+g/6aI7UwbN3EQlrIfXgZp8C8gopG/Oxv29T4LMW4fkVqVAOMgQbkpPEQ+CP\nBUOv0PwwXHiX/y08iZQZPGzuddsR107eEkoLiuiBoobyiSwc+bA+HMegSFyP0kJ0\nBFBD2NfarjGjk2bwu/5JyKTimhJ/qTcGGbAxKaV/M3Exa8VE3nNH88FXxs0toqZM\nBPdymOFP1G4lFTA9XJO8r6E3TUAcUpVkTZcm83WndD2zTWzmTFmAkeHv85Ndg6sW\nZV5SZvydTREfV7gtMiE+A0EG1xsgnJkfrTbhIzG048Kg5LfsJZKOHPvp4T4e+XvD\nJjUQVyvfAgMBAAECggEANJ/dqwUF3ClGDWpdUmBv/kasG9SmGxAyQB3nmJ2zllkJ\nXYjFJSSms50pishF2TlTmXG/7RiuqZApOUUMVmS4/p2o5DxjP7k3qCaBANnWL8wO\nytkmMe9jmvSzKrfV28t9dAuWB3BOisBesulOEGg271NONq8tuRdb2C9+Dl3ooo/i\ngGQ/nsOLSlQh09gQnpKBaIXmCgCBJGpE1pGqPc1DLZ06Vq18lHwtO7Y7M5pkBQgs\nxsZr/g3g379TJvCyYCuZGxTljLUmjlEE/j58tXp1051qAtbOfbOJzIz+DT0r3tFK\ngaMs7IuYgCKOqQcg3+HFomzAyuh2XlbODoopLbLxAQKBgQDY6bT1DnSEgAuwMkZk\nyyCrs9NuSozY+RRnpZ6RLYR95bJgVJYnrUr5YH/y8dgCG2v0Cd9sNDNJ9S2YqQZ0\nABeqt5EQLJag5WkOsb305IBgb5jABpr5pVlJj+MJJnjU1KSpYiIHXmh5MMSF63CT\ndr1XzVw+Z6mr+k4ahTAab+QPAQKBgQC/DfumGdsIkbfjBuXUVBfLIpTEXbLY+8SY\n3rCmblNJn4pTUUhKVYEovGH4Qd65rPP+oUH4BIe+R++TguLUxJvTrEEazXdhNIkl\nA8FWYkwPPThvD+VAx9VKrK4u009X1aeXjdfRhFhnQOV+3PpGXkrKHciyy1Oq4xa3\nVxvVFyga3wKBgHcNfpZpwqXeqYuhbGVx35Kd9lO4cym7O+nPSwKfmvKGmaqpgmhw\ngo/w2Qj8l/RAHLYqnQgEdooHGWmKi9IrItI+Qk5ASsQwZcL85yd8KsHDPnFWrsSK\nbkEjyhaBmRwnQeD9zXOB65FopNRj7rvhFfcU7aYKu2N61FdV9prsAp4BAoGAHr5v\nSlFKz9wzDRNlFH/bvFJ6QgcZ6pTJFBhxsLZ8LJLBvZqM2Xlc6WM3GK3w20wbj1P/\nu5tvBI2q3b/oJHjm4m8LovaBSWEc2Jn8GJyExMcDN8wFBiGiDvwuo1ZZpDa7W0X1\n/r8fQq5Mv9drZrtxqYiVbUAO3KbiVuprjiTFzV0CgYAjA7RwP1A8UBtkND00m0qR\nF1dV6LMzqM3dU8bfcqd7pSWjBroDbYYwdGhu6clotJIp96bOrqYCpq7Uz0UimjvS\nP46ZwgZX1I9Jf3Ij8e15fd2X0W1wvy4krlHQQkxsBjV9ne0fJ3ytcDwJ+gMms1iN\n1Y7RhLqlAe6HUEcf6HN3DA==\n-----END PRIVATE KEY-----\n"
const GOOGLE_CLIENT_EMAIL = "reservas@reservas-272221.iam.gserviceaccount.com"
const GOOGLE_PROJECT_NUMBER = "486998148634"
const GOOGLE_CLIENT_ID = "114911829804648376231"
const GOOGLE_CALENDAR_ID = "6158d7t58jpa8ognt2pf4ba4ug@group.calendar.google.com"
// const YOUR_CLIENT_SECRET = 'Nzg-DZDD7wNWW3fdyuHm_hPW'
// const YOUR_REDIRECT_URL = ["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
const TOKEN_PATH = 'token.json';
// const OAuth2 = google.auth.OAuth2;


// Load client secrets from a local file.
fs.readFile('./credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
    createEvent('2020-04-01T15:00:00+02:00','2020-04-01T15:30:00+02:00', 5, 'Prueba', 'martha.marquez@alumnos.uneatlantico.es', auth);
  });
}

function createEvent(start_time, end_time, room_id, subject, email, auth){
    
        // let d1 = new Date(start_time),
        // month1 = '' + (d1.getMonth() + 1),
        // day1 = '' + d1.getDate(),
        // year1 = d1.getFullYear();

        // if (month1.length < 2) month1 = '0' + month1;
        // if (day1.length < 2) day1 = '0' + day1;
        
        // start_time=  [year1, month1, day1].join('-');
        
        // console.log(start_time);
        
        // let d2 = new Date(end_time),
        // month2 = '' + (d2.getMonth() + 1),
        // day2 = '' + d2.getDate(),
        // year2 = d2.getFullYear();
        
        // if (month2.length < 2) month2 = '0' + month2;
        // if (day2.length < 2) day2 = '0' + day2;
        
        // end_time =  [year2, month2, day2].join('-');
        
        // console.log(end_time);
                
        let event = {
            'summary': subject,
            'location': 'Sala '+room_id,
            // 'description': subject,
            'start': {
                'dateTime': start_time,
                'timeZone': 'Europe/Madrid',
            },
            'end': {
                'dateTime': end_time,
                'timeZone': 'Europe/Madrid',
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=1'
            ],
            'attendees': [
            {'email': email}
            // {'email': GOOGLE_CLIENT_EMAIL}
        ],
            'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10},
            ],
        },
    };

    console.log(event);
    
    const Calendar = google.calendar({version: 'v3', auth});
    Calendar.events.insert({
            auth: auth,
            calendarId: GOOGLE_CALENDAR_ID,//'primary'
            resource: event,
        }, function(err, event) {
            if (err) {
            console.log('There was an error contacting the Calendar service: ' + err);
            return;
            }
            console.log('Event created: %s', event);
        });
    
}

// function callAppsScript(auth) {
//     const script = google.script({version: 'v1', auth});
//     script.projects.create({
//       resource: {
//         title: 'My Script',
//       },
//     }, (err, res) => {
//       if (err) return console.log(`The API create method returned an error: ${err}`);
//       script.projects.updateContent({
//         scriptId: res.data.scriptId,
//         auth,
//         resource: {
//           files: [{
//             name: 'hello',
//             type: 'SERVER_JS',
//             source: 'function helloWorld() {\n  console.log("Hello, world!");\n}',
//           }, {
//             name: 'appsscript',
//             type: 'JSON',
//             source: '{\"timeZone\":\"America/New_York\",\"exceptionLogging\":' +
//              '\"CLOUD\"}',
//           }],
//         },
//       }, {}, (err, res) => {
//         if (err) return console.log(`The API updateContent method returned an error: ${err}`);
//         console.log(`https://script.google.com/d/${res.data.scriptId}/edit`);
//       });
//     });
//   }