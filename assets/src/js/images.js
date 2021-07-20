// if ('NodeList' in window && !NodeList.prototype.forEach) {
//     console.info('polyfill for IE11');
//     NodeList.prototype.forEach = function (callback, thisArg) {
//         thisArg = thisArg || window;
//         for (var i = 0; i < this.length; i++) {
//             callback.call(thisArg, this[i], i, this);
//         }
//     };
// }

// var srcsetSupported = "srcset" in document.createElement("img");
// if(!srcsetSupported){
//     // srcset not supported, just load the images
//     $('[data-original-src]').each(function(){
//         var thissrc = $(this).data('original-src');
//         thissrc = thissrc.replace(/\.jpg/,'-cover.jpg');
//         thissrc = thissrc.replace(/\.png/,'-cover.png');
//         thissrc = thissrc.replace(/\.svg/,'-cover.svg');
//         $(this).attr('src', thissrc);
//     });
// }

document.addEventListener('lazybeforesizes', function(e){
    var sizes = [
        { width: 320, suffix: 'small' },
        { width: 480, suffix: 'medium' },
        { width: 800, suffix: 'large' },
        { width: 1200, suffix: 'extra-large' },
        { width: 2000, suffix: 'cover' }
    ];

    var $image = $(e.target);
    var originalSrc = $image.attr('data-original-src');

    var imagePath = originalSrc.slice(0, originalSrc.lastIndexOf('.'));
    var imageExtension = originalSrc.slice(originalSrc.lastIndexOf('.'));

    var srcsetAttr = '';

    sizes.forEach(function(size){
        srcsetAttr += imagePath + '-' + size.suffix + imageExtension + ' ' + size.width + 'w, ';
    });

    var src = imagePath + '-cover' + imageExtension;
    $image.attr('data-srcset', srcsetAttr);
    $image.attr('src', src);
});