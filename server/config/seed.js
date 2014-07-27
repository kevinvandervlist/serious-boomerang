/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Album = require('../api/album/album.model');
var Media = require('../api/media/media.model');
var Comment = require('../api/comment/comment.model');

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
  }, function () {
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
        }, {
          albumId: album._id,
            name: 'three.mp4',
            addedOn: new Date(),
            timestamp: new Date(),
            mediaType: 'video'
        }, function() {
          Comment.find({}).remove(function() {
            Media.findOne({albumId: album._id, name: 'one.jpg'}, function(err, media) {
              User.findOne({name: 'usera'}, function(err, user) {
                Comment.create({
                  mediaId: media._id,
                  author: user._id,
                  text: 'A first comment',
                  timestamp: new Date()
                })
              });
              User.findOne({name: 'userb'}, function(err, user) {
                Comment.create({
                  mediaId: media._id,
                  author: user._id,
                  text: 'A second comment',
                  timestamp: new Date()
                })
              });
            });
          });
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
    Album.findOne({name: 'Baz'}, function (err, album) {
      Media.create({
          albumId: album._id,
          name: 'DSC_0001.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0006.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0007.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0008.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0009.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0010.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0011.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0013.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0014.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0015.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0016.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0017.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0018.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0019.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0020.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0022.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0023.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0024.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0025.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0026.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0027.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0028.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0029.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0030.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0031.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0032.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0033.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0034.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0035.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0036.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0037.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0038.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0039.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0040.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0041.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0042.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0043.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0044.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0045.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0046.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0048.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0049.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0051.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0053.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0054.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0055.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0056.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0057.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0058.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0059.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0060.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0061.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0062.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0063.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0064.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0065.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0066.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0067.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0068.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0069.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0070.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0071.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0072.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0073.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0074.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0075.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0076.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0077.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0078.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0080.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0081.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0082.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0083.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0085.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0086.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0087.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0088.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0089.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0090.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0091.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0092.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0093.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0094.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0095.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0096.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0097.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0098.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0099.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0102.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0103.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0104.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0106.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0107.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0108.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0109.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0110.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0111.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0112.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0113.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0114.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        },
        {
          albumId: album._id,
          name: 'DSC_0115.JPG',
          addedOn: new Date(),
          timestamp: new Date(),
          mediaType: 'image'
        });
    });
    });
  });
