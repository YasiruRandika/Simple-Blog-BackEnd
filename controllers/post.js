const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let fetchedPosts;

  const postQuery = Post.find();

  if(currentPage && pageSize) {
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }

  postQuery.then(documents => {
    fetchedPosts = documents;
    console.log(Post.count())
    return Post.count();
  })
  .then(count => {
    return res.status(200).json({
      message:'Post fetched Successully',
      posts:fetchedPosts,
      maxPosts : count
    });
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;

  if(req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url +"/images/" + req.file.filename;
  }
  console.log(imagePath);

  const post = new Post({
    _id : req.body.id,
    title : req.body.title,
    content : req.body.content,
    imagePath : imagePath,
    creator : req.userData.userId
  });

  Post.updateOne({ _id: req.params.id, creator : req.userData.userId }, post).then(result => {
    if(result.n > 0) {
    res.status(200).json({
      message: "Update successful!",
      imagePath : result.imagePath
  });
} else {
  res.status(401).json({
    message:'Authorization Failed'
  })
}
  });
};

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title : req.body.title,
    content : req.body.content,
    imagePath : url +"/images/" + req.file.filename,
    creator: req.userData.userId
  });

  post.save()
  .then(result => {
    console.log(post);
  res.status(201).json({
    message:"Post Added",
    ...result,
    postId:result._id,
    imagePath : result.imagePath
  });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator : req.userData.userId }).then(result => {
    console.log(result);
    if(result.n > 0) {
    res.status(200).json({ message: "Post deleted!" });
    } else {
      res.status(401).json({ message: "Auth Failed" });
    }
  });
};

exports.getPostById = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      console.log(post);
      res.status(200).json(
        {
          _id : post._id,
          title : post.title,
          content : post.content,
          imagePath : post.imagePath
        }
      );
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
};
