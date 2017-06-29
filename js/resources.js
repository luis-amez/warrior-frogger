// Load and cache the images
(function() {
  var resourceCache = {};
  var loading = [];
  var readyCallbacks = [];

  // Public image loading function
  // Parameter: urlOrArr, and array of strings or a string pointing to image files
  function load(urlOrArr) {
    if(urlOrArr instanceof Array) {
      // If it is an array, loop and call the method for every element
      urlOrArr.forEach(function(url) {
          _load(url);
      });
    } else {
      // If not, call the method directly
      _load(urlOrArr);
    }
  }

  // Private iamge loader
  function _load(url) {
    if(resourceCache[url]) {
      // It the URL has been loaded, return it, don't load again
      return resourceCache[url];
    } else {
      // Else, load the image
      var img = new Image();
      img.onload = function() {
        // Once loaded, add the image to the cache
        resourceCache[url] = img;

        // When the image is loaded and chached, call the onReady callback function
        if(isReady()) {
          readyCallbacks.forEach(function(func) { func(); });
        }
      };

      // Set the initial cache value to false and point the src to the URL
      resourceCache[url] = false;
      img.src = url;
    }
  }

  // Get images that have been previously loaded
  function get(url) {
    return resourceCache[url];
  }

  // Determines if all the images are loaded
  function isReady() {
    var ready = true;
    for(var k in resourceCache) {
      if(resourceCache.hasOwnProperty(k) &&
       !resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  // Called when all requested images are properly loaded
  function onReady(func) {
      readyCallbacks.push(func);
  }

  // Defines publicly accesible functions
  window.Resources = {
      load: load,
      get: get,
      onReady: onReady,
      isReady: isReady
  };
})();
