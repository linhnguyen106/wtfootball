// Copyright 2016, Google, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

Parse.Cloud.define('hello', function(req, res) {
  res.success('Hello, world!');
});
Parse.Cloud.afterSave("Comment", function(request) {
                      var query = new Parse.Query("Entry");
                      query.get(request.object.get("postId").id, {
                                success: function(post) {
                                post.increment("comments");
                                post.save();
                                var postUserId = post.get("userId");
                                var userQuery = new Parse.Query(Parse.User);
                                query.equalTo("objectId", postUserId);  // find post owner
                                query.find({
                                           success: function(owner) {
                                           // Do stuff
                                           console.log("find user");
                                           var regId = owner.get("registrationID");
                                           var pushQuery = new Parse.Query(Parse.Installation);
                                           var commentUser = request.object.get("userName");
                                           var commentUserId = request.object.get("userId");
                                           query.equalTo("deviceToken", regId);
                                           Parse.Push.send({
                                                           where: query, // Set our Installation query
                                                           data: {
                                                           alert: "Willie Hayes injured by own pop fly.",
                                                           action : "Comment",
                                                           userName : commentUser,
                                                           userId : commentUserId,
                                                           postId : request.object.get("postId").id
                                                           }
                                                           }, {
                                                           success: function() {
                                                           // Push was successful
                                                           console.log("push sucessful!");
                                                           },
                                                           error: function(error) {
                                                           // Handle error
                                                           console.log(error);

                                                           }
                                                           });

                                           }
                                           });
                                
                                
                                },
                                error: function(error) {
                                console.error("Got an error " + error.code + " : " + error.message);
                                }
                                });
                      
                      
                      });

