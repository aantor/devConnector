const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator/check")
const { StatusCodes } = require("http-status-codes")
const auth = require("../../middleware/auth")

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route     Post api/posts
// @desc      Post route
// @access    Private
router.post("/", [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() })
  }
  try {
    const user = await User.findById(req.user.id).select('-password');

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })

    const post = await newPost.save()

    res.json(post)

  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }

})


// @route     GET api/posts
// @desc      Get all posts
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }) // sort by date most recent
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
});

// @route     GET api/posts/:id
// @desc      Get a post by id
// @access    Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Post not found' })
    }
    res.json(post);

  } catch (err) {
    console.error(err.message)
    // run when user does'nt provide a valid object id
    if (err.kind == 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Post not found' })
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
});

// @route     DELETE api/posts/:id
// @desc      Delete a post
// @access    Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Post not found' })
    }
    // check user
    if (post.user.toString() !== req.user.id) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'User not authorized' })
    }

    await post.remove()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Post not found' })
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
});

// @route     PUT api/posts/like/:id
// @desc      Like a post
// @access    Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Post already liked' })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
})

// @route     PUT api/posts/unlike/:id
// @desc      Like a post
// @access    Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the post has already been liked
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Post has not yet been liked' })
    }

    // check remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }
})

// @route     Post api/posts/comment/:id
// @desc      Comment on a post
// @access    Private
router.post("/comment/:id", [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() })
  }
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }

    post.comments.unshift(newComment)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
  }

})

// @route     Delete api/posts/comment/:post_id/:comment_id
// @desc      Delete comment
// @access    Private
router.delete('/comment/:post_id/:comment_id', auth , async (req,res)=> {
try {
  const post = await Post.findById(req.params.post_id);
  
  // Pull out commment
  const comment = post.comments.find(comment => comment.id === req.params.comment_id)

  // Make sure comment exists
  if(!comment) {
    return res.status(StatusCodes.NOT_FOUND).json({msg: 'Comment does not exist'});
  }

  // Check authorized user
  if(comment.user.toString() !== req.user.id) {
    return res.status(StatusCodes.UNAUTHORIZED).json({msg: 'User not authorized'})
  }

   // check remove index
   const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
   post.comments.splice(removeIndex, 1)

   await post.save()

   res.json(post.comments)

} catch (err) {
  console.error(err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Server error")
}
})



module.exports = router
