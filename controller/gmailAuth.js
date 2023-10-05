const express = require('express');
const app = express();
const body = require('body-parser');

const path = require('path');
const fs = require('fs').promises;
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const authPerm = require('../model/authPerm');

const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/userinfo.email'
];


async function getAuth(nemail) {
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, 'credentials.json'),
        scopes: SCOPES,
    });
    const authInstance = new authPerm({
        email: nemail,
        authDets: auth,
    });

    return authInstance.save()
        .then(savedAuth => {
            return "auth saved";
        })
        .catch(error => {
            return "error";
        });
}
async function findAuth(userEmail){
    const emailAuth = await authPerm.count({ email: userEmail });
    if (emailAuth !== 0) {
        const response = await authPerm.find({ email: userEmail });
        return response;
    } else {
        let response = await getAuth(userEmail);
        return (response);
    }
}
exports.findAuth = async (req,res)=>{
    const emailAuth = await authPerm.count({ email: req.body.loginEmail });
    if (emailAuth !== 0) {
        const response = await authPerm.find({ email: req.body.loginEmail });
        return response;
    } else {
        let response = await getAuth(req.body.loginEmail );
        return (response);
    }
}

exports.saveToGmail = async(req,res) =>{
    const auth = await findAuth(req.body.loginEmail);
}


exports.getAuth = async (req, res) => {
    // const credentials = await fs.readFile('credentials.json');


    const auth = await authenticate({
        keyfilePath: path.join(__dirname, 'credentials.json'),
        scopes: SCOPES,
    });

    // console.log(auth);
    
    // GET https://gmail.googleapis.com/gmail/v1/users/{userId}/profile

    const gmail = google.gmail({ version: 'v1', auth });

    const response = await gmail.users.labels.list({
        userId: 'me',
    });

    
    const LABEL_NAME = 'Listed_test';

    // Get messages that haven't been replied to
    async function getUnrepliedMessages(auth) {
        const gmail = google.gmail({ version: 'v1', auth });
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: '-in:chats -from:me -has:userlabels ',
            // q: 'from:mjxworks@gmail.com ',
        });
        // console.log(res.data.messages);
        return res.data.messages || [];
    }
    // Send reply to the unreplied messages
    async function autoSendReply(auth, message) {
        const gmail = google.gmail({ version: 'v1', auth });
        const res = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'metadata',
            metadataHeaders: ['Subject', 'From'],
        });


        const subject = res.data.payload.headers.find(
            (header) => header.name === 'Subject'
        ).value;
        const from = res.data.payload.headers.find(
            (header) => header.name === 'From'
        ).value;
        // console.log("--------------------------------------------");
        // console.log(from);
        // console.log("--------------------------------------------");

        const replyTo = from.match(/<(.*)>/)[1];
        const replySubject = subject.startsWith('Re:') ? subject : `Re: ${subject}`;
        const replyBody = `This is a test Reply`;


        const rawMessage = [
            `From: me`,
            `To: ${replyTo}`,
            `Subject: ${replySubject}`,
            `In-Reply-To: ${message.id}`,
            `References: ${message.id}`,
            '',
            replyBody,
        ].join('\n');
        



        const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
    }


    async function createNewLabel(auth) {
        const gmail = google.gmail({ version: 'v1', auth });
        try {
            const res = await gmail.users.labels.create({
                userId: 'me',
                requestBody: {
                    name: LABEL_NAME,
                    labelListVisibility: 'labelShow', 
                    messageListVisibility: 'show', 
                },
            });
            return res.data.id;
        } catch (err) {
            if (err.code === 409) {
                const res = await gmail.users.labels.list({
                    userId: 'me',
                });
                const label = res.data.labels.find((label) => label.name === LABEL_NAME);
                return label.id;
            } else {
                throw err;
            }
        }
    }

    
    async function addLabel(auth, message, labelId) {
        const gmail = google.gmail({ version: 'v1', auth });
        await gmail.users.messages.modify({
            userId: 'me',
            id: message.id,
            requestBody: {
                addLabelIds: [labelId],
                removeLabelIds: ['INBOX'],
            },
        });
    }


    async function main() {
        // Create a label for the app
        const labelId = await createNewLabel(auth);
        console.log(`Created or found label with id ${labelId}`);


        // Repeat steps 1 to 3 at random time intervals between 45 to 120 seconds
        setInterval(async () => {
            const messages = await getUnrepliedMessages(auth);
            console.log(`Found ${messages.length} unreplied messages`);

            for (const message of messages) {
                await autoSendReply(auth, message);
                console.log(`Sent reply to message with id ${message.id}`);

                await addLabel(auth, message, labelId);
                console.log(`Added label to message with id ${message.id}`);
            }
        }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000); // Random interval between 45 and 120 seconds
    }

    main().catch(console.error);

    // const labels = response.data.labels;
    res.send("YOU HAVE SET THE APP");
};