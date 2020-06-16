const prettifyDate = (date) => {

    var seconds = (new Date() - date) / 1000;
  
    var interval = seconds / 31536000;
  
    if (interval > 1) {
      return interval.toFixed(0) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return interval.toFixed(0) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return interval.toFixed(0) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return interval.toFixed(1) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return interval.toFixed(1) + " minutes ago";
    }
    return seconds.toFixed(1) + " seconds ago";
}

module.exports = prettifyDate