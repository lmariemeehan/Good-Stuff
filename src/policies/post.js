// #1
const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

// #2
 new() {
   return this._isAdmin() || this._isOwner;
 }

 create() {
   return this.new() || this._isOwner;
 }

// #3
 edit() {
   return this._isAdmin() || this._isOwner;
 }

 update() {
   return this.edit();
 }

 destroy() {
   return this.update();
 }
}
