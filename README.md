NodeImageService
================

Queue an image
----------
+ __Method__ Post 
+ __Resource__ /images 
+ __Content__    {
      Account: 'foo',
      Project: 'bar',
      Image: 'base64 image',
      ImageFormat: '.tif'
    }
    
Dequeue an image
-----------------
+ __Method__ Put 
+ __Resource__ /images/top


Check the status of an image
-----------------
+ __Method__ Get 
+ __Resource__ /images/[id]
