const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');


const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://mail.google.com/'
];

