const mongoose = require("mongoose");

const VideoSchema = mongoose.Schema({
  video: {
    data: Buffer,
    contentType: String,
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
