FFmpeg = require('fluent-ffmpeg');

var input = '/tmp/test/org.mp4';
var output = '/tmp/test/dest.mp4';

new FFmpeg({
  source: input
})
  .withVideoCodec('libx264')
  .addOption('-profile:v', 'main')
  .withVideoBitrate('500k')
  .withFps(30)
  .size('690x?')
  .audioCodec('libvorbis')
  .audioBitrate('128k')
  .addOption('-movflags', 'faststart')
  .toFormat('mp4')
  .on('error', function (err) {
    callback(err);
  })
  .on('end', function () {
    console.log('end');
  })
  .saveToFile(output);
