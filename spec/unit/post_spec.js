const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

  describe("Post", () => {
    beforeEach((done) => {
      this.topic;
      this.post;
      this.user;

      sequelize.sync({force: true}).then((res) => {
        User.create({
          email: "starman@tesla.com",
          password: "Trekkie4lyfe"
        })
        .then((user) => {
          this.user = user; //store the user

          Topic.create({
            title: "Expeditions to Alpha Centauri",
            description: "A compilation of reports from recent visits to the star system.",
            posts: [{
              title: "My first visit to Proxima Centauri b",
              body: "I saw some rocks.",
              userId: this.user.id
            }]
          }, {
            include: {
              model: Post,
              as: "posts"
            }
          })
          .then((topic) => {
            this.topic = topic; //store the topic
            this.post = topic.posts[0]; //store the post
            done();
          })
        })
      });
    });

  describe("#create()", () => {
    it("should create a post object with a title, body, and assigned topic and user", (done) => {
       Post.create({
         title: "Pros of Cryosleep during the long journey",
         body: "1. Not having to answer the 'are we there yet?' question.",
         topicId: this.topic.id,
         userId: this.user.id
       })
       .then((post) => {
         expect(post.title).toBe("Pros of Cryosleep during the long journey");
         expect(post.body).toBe("1. Not having to answer the 'are we there yet?' question.");
         expect(post.topicId).toBe(this.topic.id);
         expect(post.userId).toBe(this.user.id);
         done();
       })
       .catch((err) => {
         console.log(err);
         done();
       });
     });

     it("should not create a post with missing title, body, or assigned topic", (done) => {
      Post.create({
        title: "Pros of Cryosleep during the long journey"
      })
      .then((post) => {
        done();
        })
        .catch((err) => {
          expect(err.message).toContain("Post.body cannot be null");
          expect(err.message).toContain("Post.topicId cannot be null");
          done();
        })
      });
  });

  describe("#setTopic()", () => {
    it("should associate a topic and a post together", (done) => {
      Topic.create({
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      })
      .then((newTopic) => {
        expect(this.post.topicId).toBe(this.topic.id);
        this.post.setTopic(newTopic)
        .then((post) => {
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      })
    });
  });

  describe("#setUser()", () => {
    it("should associate a post and a user together", (done) => {
      User.create({
        email: "ada@example.com",
        password: "password"
      })
      .then((newUser) => {
        expect(this.post.userId).toBe(this.user.id);
        this.post.setUser(newUser)
        .then((post) => {
          expect(this.post.userId).toBe(newUser.id);
          done();
        });
      })
    });
  });

  describe("#getUser()", () => {
    it("should return the associated topic", (done) => {
      this.post.getUser()
      .then((associatedUser) => {
        expect(associatedUser.email).toBe("starman@tesla.com");
        done();
      });
    });
  });

  //ASSIGNMENT TEST 3: Write a test for the getPoints method of the Post model.
  describe("#getPoints()", () => {
    it("should return the total points for the selected post", (done) => {
      Post.create({
        title: "Testing, testing, 1,2,3",
        body: "1. Let's see if I can gather the total points.",
        topicId: this.topic.id,
        userId: this.user.id,
        votes: [{
          value: 1,
          userId: this.userId,
          postId: this.postId
        }]
      }, {
        include: {
          model: Vote,
          as: "votes"
        }
      })
      .then ((post) => {
        const totalPoints = Post.getPoints();
        expect(this.post.votes).toBe(totalPoints);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    })
  });

  //ASSIGNMENT - TEST 4: Write a test for a method called hasUpvoteFor(). We will call this method on a Post object with userId as an argument. It returns true if the user with the matching userId has an upvote for the post. Implement the method.
  describe("GET /topics/:topicsId/posts/:postId/hasUpvoteFor", () => {
    ("it should return true if there is a matching userId for this upvote", (done) => {
      Post.create({
        title: "Testing, testing, 1,2,3",
        body: "2. Hmmm..let's see who liked my post.",
        topicId: this.topic.id,
        userId: this.user.id,
        votes: [{
          value: 1,
          userId: this.userId,
          postId: this.postId
        }]
      }, {
        include: {
          model: Vote,
          as: "votes"
        }
      })
        .then((post) => {
          this.post.hasUpvoteFor()
          .then((associatedVote) => {
            expect(associatedVote.userId).toBe(this.post.userId); // ensure the right user is returned
            done();
          })
        })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  //ASSIGNMENT - TEST 5: Write a test for a method called hasDownvoteFor(). We will call this method on a Post object with userId as an argument. It returns true if the user with the matching userId has a downvote for the post. Implement the method.
  describe("GET /topics/:topicsId/posts/:postId/hasDownvoteFor", () => {
    ("it should return true if there is a matching userId for this downvote", (done) => {
      Post.create({
        title: "Testing, testing, 1,2,3",
        body: "3. Haters going to hate.",
        topicId: this.topic.id,
        userId: this.user.id,
        votes: [{
          value: 1,
          userId: this.userId,
          postId: this.postId
        }]
      }, {
        include: {
          model: Vote,
          as: "votes"
        }
      })
        .then((post) => {
          this.post.hasDownvoteFor()
          .then((associatedVote) => {
            expect(associatedVote.userId).toBe(this.post.userId); // ensure the right user is returned
            done();
          })
        })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

});
