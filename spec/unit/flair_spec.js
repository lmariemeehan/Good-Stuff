const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

  describe("Flair", () => {
    beforeEach((done) => {
      this.post;
      this.flair;
      sequelize.sync({force: true}).then((res) => {

        Post.create({
          title: "Expeditions to Alpha Centauri",
          body: "A compilation of reports from recent visits to the star system."
        })
        .then((post) => {
          this.post = post;

          Flair.create({
            name: "Work in Progress",
            color: "blue",
            postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });

    describe("#create()", () => {
         it("should create a flair object with a name, color, and assigned post", (done) => {
           Flair.create({
             name: "Awwww",
             color: "orange",
             postId: this.post.id
           })
           .then((flair) => {
             expect(flair.name).toBe("Awwww");
             expect(flair.color).toBe("orange");
             done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
         });

         it("should not create a flair without a name, color, or assigned post", (done) => {
           Flair.create({
             name: "Awwww"
           })
           .then((post) => {
             done();
           })
           .catch((err) => {
             expect(err.message).toContain("Flair.color cannot be null");
             expect(err.message).toContain("Flair.postId cannot be null");
             done();
            })
          });
    });

    describe("#setPost()", () => {
     it("should associate a post and a flair together", (done) => {
       Post.create({
         title: "Challenges of interstellar travel",
         body: "1. The Wi-Fi is terrible"
       })
       .then((newPost) => {
         expect(this.flair.postId).toBe(this.post.id);
         this.flair.setPost(newPost)
         .then((flair) => {
           expect(flair.postId).toBe(newPost.id);
           done();
          });
        })
      });
    });

    describe("#getPost()", () => {
      it("should return the associated post", (done) => {
        this.flair.getPost()
        .then((associatedPost) => {
          expect(associatedPost.title).toBe("Expeditions to Alpha Centauri");
          done();
        });
      });
    });

    });
  });
