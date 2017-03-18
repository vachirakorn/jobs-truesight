const { find, filter } = require('lodash');

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' }
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 }
];

const resolveFunctions = {
  Query: {
    posts() {
      return posts;
    },
    author(_, { id }) {
      return find(authors, { id });
    },
    currentUser(_, params, ct) {
      if (ct.user !== undefined && ct.user !== null) {
        return ct.User.findOne({ _id: ct.user.id }).then(
          user => new ct.User(user)
        );
      }
      return undefined;
    }
  },
  Mutation: {
    upvotePost(_, { postId }) {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    }
  },
  Subscription: {
    postUpvoted(post) {
      return post;
    }
  },
  Author: {
    posts(author) {
      return filter(posts, { authorId: author.id });
    }
  },
  Post: {
    author(post) {
      return find(authors, { id: post.authorId });
    }
  },
  User: {
    email(user) {
      console.log(user.email);
      return user.email;
    }
  }
};

module.exports = resolveFunctions;