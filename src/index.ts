const axios = require('axios');
const commands = require('probot-commands')

module.exports = (app) => {
  app.on('issues.opened', async (context) => {
    if(context.payload.sender.type != "Bot"){
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' });
    const data = context.issue;
    const headers = {'authorization':process.env.PASSWORD};
    const telegram_bot_link = process.env.TELEGRAM_BOT_LINK;
    await axios.get(telegram_bot_link,{headers:headers});
    await context.github.issues.createComment(issueComment);
    }
  });
  app.on('issue_comment.created',async (context) => {
    if(context.payload.sender.type != "Bot"){
      let commentBody = context.payload.comment.body;
      if (commentBody.startsWith("EDIT")){
        let withoutFirstLine = commentBody.substring(commentBody.indexOf("\n")+1);
        if (withoutFirstLine.startsWith("Abstract")){
          // Edit Issue Abstract
        }
        else if(withoutFirstLine.startsWith("Topics Covered")){
          // Edit Issue Topics Covered
        }
        else if(withoutFirstLine.startsWith("Expected Duration")){
          // Edit Issue Expected Duration
        }
        else if(withoutFirstLine.startsWith("Track")){
          // Edit Issue Track
        }
        else if(withoutFirstLine.startsWith("Prerequisites")){
          // Edit Issue Prerequisites
        }
        else if(withoutFirstLine.startsWith("Resources")){
          // Edit Issue Resources
        }
        else if(withoutFirstLine.startsWith("Content")){
          // Edit Issue Content
        }
      }
      const issueComment = context.issue({ body: 'Thanks for the insight'});
      await context.github.issues.createComment(issueComment);
    }
  });


  const router = app.route('/my-app');
  router.use(require('express').static('public'));
  router.use(require('express').json())

  router.get('/hello-world',(req,res) => {
    res.send('HelloWorld');
  });

  const createIssue = async function (issue, app) {
    const github = await app.auth(process.env.INSTALLATION_ID); // Insert Installation ID here
    const owner = issue.owner;
    const repo = issue.repo;
    const title = issue.title;
    const body = issue.body;
    return await github.issues.create({
      owner: owner,
      repo: repo,
      title: title,
      body: body,
    });
  }

  const updateIssue = async function (issue, app, issueId) {
    const github = await app.auth(process.env.INSTALLATION_ID); // Insert Installation ID here
    const owner = issue.owner;
    const repo = issue.repo;
    const title = issue.title;
    console.log(title);
    // const body = issue.body;
    return await github.issues.update({
      owner: owner,
      repo: repo,
      issue_number: issueId,
      title: title,
    });
  }

  const closeIssue = async function (issue, app, issueId) {
    const github = await app.auth(process.env.INSTALLATION_ID); // Insert Installation ID here
    const owner = issue.owner;
    const repo = issue.repo;
    return await github.issues.update({
      owner: owner,
      repo: repo,
      issue_number: issueId,
      state: "closed",
    });

  }

  // To create a new issue
  router.post('/Issue', async (req,res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      // Do body preprocessing here
      let actualBody = 'By: @' + req.body.author;
      actualBody += '\n\n**Abstract**\n' + (req.body.abstract == undefined ? '(No Abstract)' : req.body.abstract);
      actualBody += '\n\n**Topics Covered**\n' + (req.body.topics == undefined ? '(No Topic Provided)' :req.body.topics);
      actualBody += '\n\n**Expected Duration**\n' + (req.body.duration == undefined ? '(No Duration Provided)' : req.body.duration);
      actualBody += '\n\n**Difficulty**\n';
      actualBody += (parseInt(req.body.difficulty) == 0) ? 'Beginner' : (parseInt(req.body.difficulty) == 1) ? 'Intermediate' : 'Advanced';
      actualBody += '\n\n**Pre-Requisites**\n' + (req.body.prereq == undefined ? '(No Pre-Requisites Provided)' : req.body.prereq);
      actualBody += '\n\n**Resources**\n' + (req.body.resources == undefined ? '(No Resources Provided)' : req.body.resources);
      actualBody += '\n\n**Content**\n' + (req.body.content == undefined ? '(No Content Provided)' : req.body.content);
      actualBody += '\n\n### Note\n The time and venue will be decided in the Telegram group, so make sure you\'ve joined it.'
      console.log(actualBody);
      const issue = {
        owner: 'Vikhyath08',
        repo: 'solid-octo-spoon',
        title: req.body.title,
        body: actualBody,
        // labels: req.query.labels,
        // assignees: req.query.as
      }
      await createIssue(issue, app).then(
        res.status(200).send('Success')
      ).catch(err => console.log(err))
      app.log.info({body:"Worked"});

    } else {
      res.status(200).send('Invalid Password!');
    }
  });

  // To update an existing issue
  router.patch('/Issue/:id/', (req, res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      const issueId = req.params.id;
      const issue = {
        owner: 'Vikhyath08',
        repo: 'solid-octo-spoon',
        title: req.body.title,
        // labels: req.query.labels,
        // body: req.query.body,
        // assignees: req.query.as
      }
      updateIssue(issue, app, issueId).then(
        res.send('Success')
      ).catch(err => console.log(err))
      app.log.info({body:"Worked"});
    } else {
      res.status(200).send('Invalid Password!');
    }
  });

  // To close an existing issue
  router.delete('/Issue/:id/', (req, res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      const issueId = req.params.id;
      const issue = {
        owner: 'Vikhyath08',
        repo: 'solid-octo-spoon',
      }
      closeIssue(issue, app, issueId).then(
        res.send('Success')
      ).catch(err => console.log(err))
      app.log.info({body:"Worked"});
    } else {
      res.status(200).send('Invalid Password!');
    }
  });
};
