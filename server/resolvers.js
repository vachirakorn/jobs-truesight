const { find, filter, sortBy } = require('lodash');
const { Kind } = require('graphql/language');

const resolveFunctions = {
  Query: {
    currentUser(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      return ct.User.findOne({ _id: ct.user.id });
    },
    getTestSheet(_, params, ct) {
      return ct.TestSheet.find({});
    },
    getTestSheetByUid(_, params, ct) {
      return ct.TestSheet.findOne({ uid: params.uid });
    },
    getAnswerSheet(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
        // return all answer sheets by user id
      return ct.AnswerSheet.find({
        userId: ct.user._id
      });
    },
    getAnswerSheetByUid(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      if (params.done) {
        return ct.AnswerSheet.find({
          testSheetUid: params.testSheetUid,
          userId: ct.user._id,
          done: params.done
        });
      }
      return ct.AnswerSheet.find({
        testSheetUid: params.testSheetUid,
        userId: ct.user._id
      });
    },
    getJobsChoice(_, params, ct) {
      return ct.Job.find({}, null, {
        sort: {
          id: 1 // Sort by Date Added DESC
        }
      });
    }
  },
  // Mutation: {

  // },
  User: {
    id(user) {
      return user._id;
    },
    email(user) {
      console.log(user.email);
      return user.email;
    }
  },
  TestSheet: {
    questions(testSheet) {
      return sortBy(testSheet.questions, 'id');
    }
  },
  AnswerSheet: {
    answers(answerSheet) {
      return sortBy(answerSheet.answers, 'id');
    }
  },
  Question: {
    choices(question) {
      return question.choices;
    }
  },
  Choice: {
    id(choice) {
      return choice._id;
    }
  },
  Date: {
    __parseValue(value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return value.getTime(); // value sent to the client
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }
};

module.exports = resolveFunctions;
