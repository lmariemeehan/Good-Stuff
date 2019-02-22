const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/posts";

const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

  describe("routes : flairs", () => {
    beforeEach((done) => {
      this.post;
      this.flair;
      sequelize.sync({force: true}).then((res) => {

        Post.create({
          title: "Winter Games",
          body: "Post your Winter Games stories."
        })
        .then((post) => {
          this.post = post;

          Flair.create({
            name: "Stories",
            color: "white",
            postId: this.post.id
          })
          .then((flair) => {
            this.flair = flair;
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
      });

      describe("GET /posts/:postId/flairs/new", () => {
        it("should render a new flair form", (done) => {
          request.get(`${base}/${this.post.id}/flairs/new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Flair");
            done();
          });
        });
      });

      describe("POST /posts/:postId/flairs/create", () => {
         it("should create a new flair and redirect", (done) => {
            const options = {
              url: `${base}/${this.post.id}/flairs/create`,
              form: {
                name: "Interesting stuff",
                color: "teal"
              }
            };
            request.flair(options,
              (err, res, body) => {
                Flair.findOne({where: {name: "Interesting stuff"}})
                .then((flair) => {
                  expect(flair).not.toBeNull();
                  expect(flair.name).toBe("Interesting stuff");
                  expect(flair.color).toBe("teal");
                  expect(flair.postId).not.toBeNull();
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
              }
            );
          });
       });

      describe("GET /posts/:postId/flairs/:id", () => {
         it("should render a view with the selected flair", (done) => {
           request.get(`${base}/${this.post.id}/flairs/${this.flair.id}`, (err, res, body) => {
             expect(err).toBeNull();
             expect(body).toContain("Stories");
             done();
           });
         });
      });

      describe("POST /posts/:postId/flairs/:id/destroy", () => {
         it("should delete the flair with the associated ID", (done) => {
           expect(this.flair.id).toBe(1);
           request.flair(`${base}/${this.post.id}/flairs/${this.flair.id}/destroy`, (err, res, body) => {
             Flair.findById(1)
             .then((flair) => {
               expect(err).toBeNull();
               expect(post).toBeNull();
               done();
             })
           });
         });
       });

       describe("GET /posts/:postId/flairs/:id/edit", () => {
          it("should render a view with an edit flair form", (done) => {
            request.get(`${base}/${this.post.id}/flairs/${this.flair.id}/edit`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Edit Post");
              expect(body).toContain("Stories");
              done();
            });
          });
        });

      describe("POST /posts/:postId/flairs/:id/update", () => {
        it("should return a status code 302", (done) => {
          request.flair({
            url: `${base}/${this.post.id}/flairs/${this.flair.id}/update`,
            form: {
              name: "Snowman Building Competition",
              color: "purple"
            }
          }, (err, res, body) => {
            expect(res.statusCode).toBe(302);
            done();
          });
        });
        it("should update the flair with the given values", (done) => {
            const options = {
              url: `${base}/${this.post.id}/flairs/${this.flair.id}/update`,
              form: {
                name: "Snowman Building Competition"
              }
            };
            request.flair(options,
              (err, res, body) => {
              expect(err).toBeNull();
              Flair.findOne({
                where: {id: this.flair.id}
              })
              .then((flair) => {
                expect(flair.name).toBe("Snowman Building Competition");
                done();
              });
            });
          });
      });

    });
  });
