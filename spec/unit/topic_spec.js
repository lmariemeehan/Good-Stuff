const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {

  beforeEach((done) => {
//#1
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {

//#2
      Topic.create({
        title: "Health benefits of fasting",
        description: "A list of reasons of why occasional fasting may be good for you."
      })
      .then((topic) => {
        this.topic = topic;
//#3
        Post.create({
          title: "I'm going to try fasting one day per week",
          body: "I've read that it helps fight inflammation and decreases insulin resistance.",
//#4
          topicId: this.topic.id
        })
        .then((topic) => {
          this.topic = topic;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#create()", () => {
     it("should create a topic object with a title & a description", (done) => {
       Topic.create({
         title: "May boost brain function and fight neurodegenerative disorders",
         description: "Studies are showing that it may prevent alzheimer's disease.",
         topicId: this.topic.id
       })
       .then((topic) => {

         expect(topic.title).toBe("May boost brain function and fight neurodegenerative disorders");
         expect(topic.description).toBe("Studies are showing that it may prevent alzheimer's disease.");
         done();

       })
       .catch((err) => {
         console.log(err);
         done();
       });
     });

     it("should not create a topic without a title or description" (done) => {
          Topic.create({
            title: "May boost brain function and fight neurodegenerative disorders"
          })
          .then((topic) => {
            done();
          })
          .catch((err) => {

            expect(err.message).toContain("Topic.description cannot be null");
            expect(err.message).toContain("Topic.topicId cannot be null");
            done();

          })
        });
   });

   describe("#getPosts()", () => {
        it("should return an array of model instances", (done) => {

          Post.create({
            title: "Challenges of fasting",
            body: "I'm starving"
            topicId: this.topic.id
          })
          .then((newPost) => {
            expect(newPost.topicId).toBe(this.topic.id);
            done();
            });
          })
        });

  });
