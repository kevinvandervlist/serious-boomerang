/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Album = require('../api/album/album.model');
var Media = require('../api/media/media.model');

Thing.find({}).remove(function () {
  Thing.create({
    name: 'Development Tools',
    info: 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Sass, CoffeeScript, and Less.'
  }, {
    name: 'Server and Client integration',
    info: 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
  }, {
    name: 'Smart Build System',
    info: 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
  }, {
    name: 'Modular Structure',
    info: 'Best practice client and server structures allow for more code reusability and maximum scalability'
  }, {
    name: 'Optimized Build',
    info: 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
  }, {
    name: 'Deployment Ready',
    info: 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
  });
});

User.find({}).remove(function () {
  User.create({
    provider: 'local',
    name: 'usera',
    email: 'usera@b.c',
    password: 'test'
  }, {
    provider: 'local',
    name: 'userb',
    email: 'userb@b.c',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@b.c',
    password: 'test'
  });
});

Album.find({}).remove(function () {
  Album.create({
      name: 'Foo',
      description: 'Album foo description',
      startDate: new Date(),
      endDate: new Date(),
      locations: []
    }, {
      name: 'Bar',
      description: 'Album bar description',
      startDate: new Date(1293682278 * 1000),
      endDate: new Date(1293683278 * 1000),
      locations: []
    }, {
      name: 'Baz',
      description: 'Album baz yay',
      startDate: new Date(1293682178 * 1000),
      endDate: new Date(1293683178 * 1000),
      locations: []
    }
    , function () {
      Media.find({}).remove(function () {
        Album.findOne({name: 'Foo'}, function (err, album) {
          if (err) {
            console.error(err);
            return;
          }
          if (album === null) {
            console.error('Album not found');
            return;
          }
          Media.create({
            albumId: album._id,
            name: 'one.jpg',
            addedOn: new Date(),
            timestamp: new Date(),
            mediaType: 'image'
          }, {
            albumId: album._id,
            name: 'two.jpg',
            addedOn: new Date(),
            timestamp: new Date(),
            mediaType: 'image'
          });
        });
      });
      Album.findOne({name: 'Bar'}, function (err, album) {
        if (err) {
          console.error(err);
          return;
        }
        if (album === null) {
          console.error('Album not found');
          return;
        }
        Media.create({
          albumId: album._id,
          name: 'one.jpg',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        }, {
          albumId: album._id,
          name: 'two.jpg',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        }, {
          albumId: album._id,
          name: 'three.jpg',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        });
      });
    });
});
