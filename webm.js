FFmpeg = require('fluent-ffmpeg');

var input = '/tmp/test/org.mp4';
var output = '/tmp/test/dest.webm';

new FFmpeg({
  source: input
})
  .withVideoCodec('libvpx')
  .withVideoBitrate('500k')
  .withFps(30)
  .size('690x?')
  .audioCodec('libvorbis')
  .audioBitrate('128k')
  .toFormat('webm')
  .on('error', function (err) {
    callback(err);
  })
  .on('end', function () {
    console.log('end');
  })
  .saveToFile(output);
