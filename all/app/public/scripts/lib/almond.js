/**
 * almond 0.0.3 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
/*jslint strict: false, plusplus: false */
/*global setTimeout: false, require:true */

var requirejs,require,define;
(function(k){function h(a,b){if(a&&"."===a.charAt(0)&&b){var b=b.split("/"),b=b.slice(0,b.length-1),a=b.concat(a.split("/")),c,d;for(c=0;d=a[c];c++)if("."===d)a.splice(c,1),c-=1;else if(".."===d)if(1===c&&(".."===a[2]||".."===a[0]))break;else 0<c&&(a.splice(c-1,2),c-=2);a=a.join("/")}return a}function o(a,b){return function(){return f.apply(k,q.call(arguments,0).concat([a,b]))}}function r(a){return function(b){return h(b,a)}}function s(a){return function(b){e[a]=b}}function n(a){if(l.hasOwnProperty(a)){var b=l[a];
delete l[a];j.apply(k,b)}return e[a]}function p(a,b){var c,d,e=a.indexOf("!");-1!==e?(c=h(a.slice(0,e),b),a=a.slice(e+1),a=(d=n(c))&&d.normalize?d.normalize(a,r(b)):h(a,b)):a=h(a,b);return{f:c?c+"!"+a:a,n:a,p:d}}var e={},l={},q=[].slice,j,f;if("function"!==typeof define)j=function(a,b,c,d){var f=[],j,h,g,i,m;d||(d=a);if("function"===typeof c){!b.length&&c.length&&(b=["require","exports","module"]);for(i=0;i<b.length;i++)if(m=p(b[i],d),g=m.f,"require"===g)f[i]=o(a);else if("exports"===g)f[i]=e[a]=
{},j=!0;else if("module"===g)h=f[i]={id:a,uri:"",exports:e[a]};else if(e.hasOwnProperty(g)||l.hasOwnProperty(g))f[i]=n(g);else if(m.p)m.p.load(m.n,o(d,!0),s(g),{}),f[i]=e[g];else throw a+" missing "+g;b=c.apply(e[a],f);if(a)h&&h.exports!==k?e[a]=h.exports:j||(e[a]=b)}else a&&(e[a]=c)},requirejs=f=function(a,b,c,d){if("string"===typeof a)return n(p(a,b).f);a.splice||(b.splice?(a=b,b=c):a=[]);d?j(k,a,b,c):setTimeout(function(){j(k,a,b,c)},15);return f},f.config=function(){return f},require||(require=
f),define=function(a,b,c){b.splice||(c=b,b=[]);define.unordered?l[a]=[a,b,c]:j(a,b,c)},define.amd={jQuery:!0}})();