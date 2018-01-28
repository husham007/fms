const express= require('express');
const router = express.Router();

// Article model db
let Article=require('../models/articles');

//User model
let User=require('../models/user');


router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article', {
    title:'Add Files'
  });
});

router.post('/add', function(req, res){

  req.checkBody('receiving', 'receiving is required').notEmpty();
  //req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('department', 'Department is required').notEmpty();
  req.checkBody('deptype', 'Department type is required').notEmpty();
  req.checkBody('organization', 'Organization is required').notEmpty();
  req.checkBody('orgtype', 'Organization type is required').notEmpty();
  req.checkBody('file', 'File is required').notEmpty();
  req.checkBody('date', 'date is required').notEmpty();
  req.checkBody('date', 'date is required').isISO8601();
  req.checkBody('subject', 'Subject is required').notEmpty();
  req.checkBody('filename', 'filename is required').notEmpty();
  req.checkBody('status', 'status is required').notEmpty();


  let errors = req.validationErrors();
  if(errors){
    res.render('add_article', {
        title:'add articles',
      errors:errors
    });
  }
  else{
    let article =new Article();
    article.receiving=req.body.receiving;
    article.department=req.body.department;
    article.deptype=req.body.deptype;
    article.organization=req.body.organization;
    article.orgtype=req.body.orgtype;
    article.file=req.body.file;
    article.date=req.body.date;
    article.subject=req.body.subject;
    article.filename=req.body.filename;
    article.status=req.body.status;
    article.author=req.user._id;


    article.save(function(err){
      if (err){
        console.log(err);
        return;
      }else{
        req.flash('success', 'New File Added');
        res.redirect('/articles/files');
      }
    });
  }
});

router.get('/files', ensureAuthenticated, function(req, res){
  Article.find({}, function(err, articles){
      if (err){
      console.log(err);
    }
    else{
      res.render('files', {
      articles: articles
      });
    }
  });
  });


//get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    //console.log(article.author);
    User.findById(article.author, function(err, user){
      //console.log(user);
      res.render('article', {
        article:article,
        author:user.name
      });
    })

  });
});

//access control
function ensureAuthenticated(req,res,next){
  if (req.isAuthenticated()){
    return next();
  }else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if (article.author!= req.user._id){
      if (req.user.usertype!=0)
      {
      req.flash('danger', 'Not Authorized');
      res.redirect('/files');
    }
    }
    res.render('edit_article', {
      title:'Edit Article',
      article:article
    });
  });
});

router.get('/update/:id', ensureAuthenticated, function(req, res){
  let query = {_id:req.params.id}
  let article ={};
  article.status='Received';
  //var d = dateFormat (new Date (), "%Y-%m-%d %H:%M:%S", true);
  //console.log(d);
  Article.update(query, article, function(err){
    if (err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'File Received');
      res.redirect('/articles/files');
    }
  });
});


function dateFormat (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}



router.post('/edit/:id', function(req, res){
  let article ={};
  article.receiving=req.body.receiving;
  article.department=req.body.department;
  article.deptype=req.body.deptype;
  article.organization=req.body.organization;
  article.orgtype=req.body.orgtype;
  article.file=req.body.file;
  article.date=req.body.date;
  article.subject=req.body.subject;
  article.filename=req.body.filename;
  article.status=req.body.status;
  //article.author=req.params.id;

  let query = {_id:req.params.id}
  Article.update(query, article, function(err){
    if (err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'file updated');
      res.redirect('/articles/files');
    }
  });
});

router.delete('/:id', function(req, res){
if (!req.user._id){
  res.status(500).send();
}
  let query={_id:req.params.id};

  Article.findById(req.params.id, function(err, article){
    if (article.author!=req.user._id){
      res.status(500).send();
    }else{
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  })
});

module.exports=router;
