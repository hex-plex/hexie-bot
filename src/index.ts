const axios = require('axios');

module.exports = (app) => {
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' });
    //app.log.info(context);
    const data = context.issue;
    const headers = {'authorization':process.env.PASSWORD};
    const telegram_bot_link = process.env.TELEGRAM_BOT_LINK;
    const response = await axios.get(telegram_bot_link,{headers:headers});
    //app.log.info(response);
    await context.github.issues.createComment(issueComment);
  });
  app.on('issue_comment.created',async (context) => {
    if(context.payload.sender.type != "Bot"){
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
    const github = await app.auth(12536268); // Insert Installation ID here
    const owner = issue.owner;
    const repo = issue.repo;
    const title = issue.title;
    console.log(title);
    // const body = issue.body;
    return await github.issues.create({
      owner: owner,
      repo: repo,
      title: title,
    });
  }
  
  const updateIssue = async function (issue, app, issueId) {
    const github = await app.auth(12536268); // Insert Installation ID here
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

  router.post('/Issue', (req,res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      // Send a request to github through octokit
      console.log(req.body.title)
      const issue = {
        owner: 'Vikhyath08',
        repo: 'solid-octo-spoon',
        title: req.body.title,
        // labels: req.query.labels,
        // body: req.query.body,
        // assignees: req.query.as
      }
      createIssue(issue, app).then(
        res.send('Success')
      ).catch(err => console.log(err))
      app.log.info({body:"Worked"});
    }
    res.status(200).send('Invalid Password!');
  });

  router.patch('/Issue/:id/', (req, res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      // Should edit the main issue comment
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
    }
  });
};
