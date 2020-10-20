module.exports = (app) => {
  app.on('issues.opened', async (context) => {
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' });
    app.log.info(context);
    await context.github.issues.createComment(issueComment);
  });
  app.on('issue_comment.created',async (context) => {
    if(context.sender.type != "Bot"){
      const issueComment = context.issue({ body: 'Thanks for the insight'});
      app.log.info(context);
      await context.github.issues.createComment(issueComment);
    }
  });
  const router = app.route('/my-app');
  router.use(require('express').static('public'));
  router.get('/hello-world',(req,res) => {
    res.send('HelloWorld');
  });
  router.post('/Issue', (req,res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      // Send a request to github through octokit
      app.log.info({body:"Worked"});
    }
    res.status(200).send('Invalid Password!');
  });
  router.delete('/Issue', (req,res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      // Send a close request to github through octokit
      app.log.info({body:"Worked"});
    }
    res.status(200).send('Invalid Password!');
  });
  router.patch('/Issue', (req, res) => {
    const password = req.headers.authentication;
    if(password === process.env.PASSWORD){
      // Should edit the main issue comment
      app.log.info({body:"Worked"});
    }
  });
};
