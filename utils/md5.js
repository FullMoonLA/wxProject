    // /*  
    //  * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message  
    //  * Digest Algorithm, as defined in RFC 1321.  
    //  * Version 1.1 Copyright (C) Paul Johnston 1999 - 2002.  
    //  * Code also contributed by Greg Holt  
    //  * See http://pajhome.org.uk/site/legal.html for details.  
    //  */    
        
    // /*  
    //  * Add integers, wrapping at 2^32. This uses 16-bit operations internally  
    //  * to work around bugs in some JS interpreters.  
    //  */    
    // function safe_add(x, y)    
    // {    
    //   let lsw = (x & 0xFFFF) + (y & 0xFFFF)
    //   let msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    //   return (msw << 16) | (lsw & 0xFFFF)    
    // }    
        
    // /*  
    //  * Bitwise rotate a 32-bit number to the left.  
    //  */    
    // function rol(num, cnt)    
    // {    
    //   return (num << cnt) | (num >>> (32 - cnt))    
    // }    
        
    // /*  
    //  * These functions implement the four basic operations the algorithm uses.  
    //  */    
    // function cmn(q, a, b, x, s, t)    
    // {    
    //   return safe_add(rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)    
    // }    
    // function ff(a, b, c, d, x, s, t)    
    // {    
    //   return cmn((b & c) | ((~b) & d), a, b, x, s, t)    
    // }    
    // function gg(a, b, c, d, x, s, t)    
    // {    
    //   return cmn((b & d) | (c & (~d)), a, b, x, s, t)    
    // }    
    // function hh(a, b, c, d, x, s, t)    
    // {    
    //   return cmn(b ^ c ^ d, a, b, x, s, t)    
    // }    
    // function ii(a, b, c, d, x, s, t)    
    // {    
    //   return cmn(c ^ (b | (~d)), a, b, x, s, t)    
    // }    
        
    // /*  
    //  * Calculate the MD5 of an array of little-endian words, producing an array  
    //  * of little-endian words.  
    //  */    
    // function coreMD5(x)    
    // {    
    //   let a =  1732584193
    //   let b = -271733879
    //   let c = -1732584194
    //   let d =  271733878
        
    //   for(let i = 0; i < x.length; i += 16)
    //   {    
    //     let olda = a
    //     let oldb = b
    //     let oldc = c
    //     let oldd = d
        
    //     a = ff(a, b, c, d, x[i+ 0], 7 , -680876936)    
    //     d = ff(d, a, b, c, x[i+ 1], 12, -389564586)    
    //     c = ff(c, d, a, b, x[i+ 2], 17,  606105819)    
    //     b = ff(b, c, d, a, x[i+ 3], 22, -1044525330)    
    //     a = ff(a, b, c, d, x[i+ 4], 7 , -176418897)    
    //     d = ff(d, a, b, c, x[i+ 5], 12,  1200080426)    
    //     c = ff(c, d, a, b, x[i+ 6], 17, -1473231341)    
    //     b = ff(b, c, d, a, x[i+ 7], 22, -45705983)    
    //     a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416)    
    //     d = ff(d, a, b, c, x[i+ 9], 12, -1958414417)    
    //     c = ff(c, d, a, b, x[i+10], 17, -42063)    
    //     b = ff(b, c, d, a, x[i+11], 22, -1990404162)    
    //     a = ff(a, b, c, d, x[i+12], 7 ,  1804603682)    
    //     d = ff(d, a, b, c, x[i+13], 12, -40341101)    
    //     c = ff(c, d, a, b, x[i+14], 17, -1502002290)    
    //     b = ff(b, c, d, a, x[i+15], 22,  1236535329)    
        
    //     a = gg(a, b, c, d, x[i+ 1], 5 , -165796510)    
    //     d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632)    
    //     c = gg(c, d, a, b, x[i+11], 14,  643717713)    
    //     b = gg(b, c, d, a, x[i+ 0], 20, -373897302)    
    //     a = gg(a, b, c, d, x[i+ 5], 5 , -701558691)    
    //     d = gg(d, a, b, c, x[i+10], 9 ,  38016083)    
    //     c = gg(c, d, a, b, x[i+15], 14, -660478335)    
    //     b = gg(b, c, d, a, x[i+ 4], 20, -405537848)    
    //     a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438)    
    //     d = gg(d, a, b, c, x[i+14], 9 , -1019803690)    
    //     c = gg(c, d, a, b, x[i+ 3], 14, -187363961)    
    //     b = gg(b, c, d, a, x[i+ 8], 20,  1163531501)    
    //     a = gg(a, b, c, d, x[i+13], 5 , -1444681467)    
    //     d = gg(d, a, b, c, x[i+ 2], 9 , -51403784)    
    //     c = gg(c, d, a, b, x[i+ 7], 14,  1735328473)    
    //     b = gg(b, c, d, a, x[i+12], 20, -1926607734)    
        
    //     a = hh(a, b, c, d, x[i+ 5], 4 , -378558)    
    //     d = hh(d, a, b, c, x[i+ 8], 11, -2022574463)    
    //     c = hh(c, d, a, b, x[i+11], 16,  1839030562)    
    //     b = hh(b, c, d, a, x[i+14], 23, -35309556)    
    //     a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060)    
    //     d = hh(d, a, b, c, x[i+ 4], 11,  1272893353)    
    //     c = hh(c, d, a, b, x[i+ 7], 16, -155497632)    
    //     b = hh(b, c, d, a, x[i+10], 23, -1094730640)    
    //     a = hh(a, b, c, d, x[i+13], 4 ,  681279174)    
    //     d = hh(d, a, b, c, x[i+ 0], 11, -358537222)    
    //     c = hh(c, d, a, b, x[i+ 3], 16, -722521979)    
    //     b = hh(b, c, d, a, x[i+ 6], 23,  76029189)    
    //     a = hh(a, b, c, d, x[i+ 9], 4 , -640364487)    
    //     d = hh(d, a, b, c, x[i+12], 11, -421815835)    
    //     c = hh(c, d, a, b, x[i+15], 16,  530742520)    
    //     b = hh(b, c, d, a, x[i+ 2], 23, -995338651)    
        
    //     a = ii(a, b, c, d, x[i+ 0], 6 , -198630844)    
    //     d = ii(d, a, b, c, x[i+ 7], 10,  1126891415)    
    //     c = ii(c, d, a, b, x[i+14], 15, -1416354905)    
    //     b = ii(b, c, d, a, x[i+ 5], 21, -57434055)    
    //     a = ii(a, b, c, d, x[i+12], 6 ,  1700485571)    
    //     d = ii(d, a, b, c, x[i+ 3], 10, -1894986606)    
    //     c = ii(c, d, a, b, x[i+10], 15, -1051523)    
    //     b = ii(b, c, d, a, x[i+ 1], 21, -2054922799)    
    //     a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359)    
    //     d = ii(d, a, b, c, x[i+15], 10, -30611744)    
    //     c = ii(c, d, a, b, x[i+ 6], 15, -1560198380)    
    //     b = ii(b, c, d, a, x[i+13], 21,  1309151649)    
    //     a = ii(a, b, c, d, x[i+ 4], 6 , -145523070)    
    //     d = ii(d, a, b, c, x[i+11], 10, -1120210379)    
    //     c = ii(c, d, a, b, x[i+ 2], 15,  718787259)    
    //     b = ii(b, c, d, a, x[i+ 9], 21, -343485551)    
        
    //     a = safe_add(a, olda)    
    //     b = safe_add(b, oldb)    
    //     c = safe_add(c, oldc)    
    //     d = safe_add(d, oldd)    
    //   }    
    //   return [a, b, c, d]    
    // }    
        
    // /*  
    //  * Convert an array of little-endian words to a hex string.  
    //  */    
    // function binl2hex(binarray)    
    // {    
    //   let hex_tab = "0123456789abcdef"
    //   let str = ""
    //   for(let i = 0; i < binarray.length * 4; i++)
    //   {    
    //     str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +    
    //            hex_tab.charAt((binarray[i>>2] >> ((i%4)*8)) & 0xF)    
    //   }    
    //   return str    
    // }    
        
    // /*  
    //  * Convert an array of little-endian words to a base64 encoded string.  
    //  */    
    // function binl2b64(binarray)    
    // {    
    //   let tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    //   let str = ""
    //   for(let i = 0; i < binarray.length * 32; i += 6)
    //   {    
    //     str += tab.charAt(((binarray[i>>5] << (i%32)) & 0x3F) |    
    //                       ((binarray[i>>5+1] >> (32-i%32)) & 0x3F))    
    //   }    
    //   return str    
    // }    
        
    // /*  
    //  * Convert an 8-bit character string to a sequence of 16-word blocks, stored  
    //  * as an array, and append appropriate padding for MD4/5 calculation.  
    //  * If any of the characters are >255, the high byte is silently ignored.  
    //  */    
    // function str2binl(str)    
    // {    
    //   let nblk = ((str.length + 8) >> 6) + 1 // number of 16-word blocks
    //   let blks = new Array(nblk * 16)
    //   for(let i = 0; i < nblk * 16; i++) blks[i] = 0
    //   for(let i = 0; i < str.length; i++)
    //     blks[i>>2] |= (str.charCodeAt(i) & 0xFF) << ((i%4) * 8)    
    //   blks[i>>2] |= 0x80 << ((i%4) * 8)    
    //   blks[nblk*16-2] = str.length * 8    
    //   return blks    
    // }    
        
    // /*  
    //  * Convert a wide-character string to a sequence of 16-word blocks, stored as  
    //  * an array, and append appropriate padding for MD4/5 calculation.  
    //  */    
    // function strw2binl(str)    
    // {    
    //   let nblk = ((str.length + 4) >> 5) + 1 // number of 16-word blocks
    //   let blks = new Array(nblk * 16)
    //   for(let i = 0; i < nblk * 16; i++) blks[i] = 0
    //   for(let i = 0; i < str.length; i++)
    //     blks[i>>1] |= str.charCodeAt(i) << ((i%2) * 16)    
    //   blks[i>>1] |= 0x80 << ((i%2) * 16)    
    //   blks[nblk*16-2] = str.length * 16    
    //   return blks    
    // }    
        
    
    // /*  
    //  * External interface  
    //  */    
    // function md5    (str) { return binl2hex(coreMD5( str2binl(str))) }    
    // function MD5    (str) { return binl2hex(coreMD5( str2binl(str))) }    
    // function hexMD5 (str) { return binl2hex(coreMD5( str2binl(str))) }    
    // function hexMD5w(str) { return binl2hex(coreMD5(strw2binl(str))) }    
    // function b64MD5 (str) { return binl2b64(coreMD5( str2binl(str))) }    
    // function b64MD5w(str) { return binl2b64(coreMD5(strw2binl(str))) }      
    
    // module.exports = {
    //   md5: md5,
    //   MD5: MD5,
    //   hexMD5: hexMD5,
    //   hexMD5w: hexMD5w,
    //   b64MD5: b64MD5,
    //   b64MD5w: b64MD5w
    // }
function md5(string) {
     function md5_RotateLeft(lValue, iShiftBits) {
         return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    
  }
     function md5_AddUnsigned(lX, lY) {
         let lX4, lY4, lX8, lY8, lResult;
         lX8 = (lX & 0x80000000);
       lY8 = (lY & 0x80000000);
       lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
           return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    
    }
         if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
       
      } else {
                 return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
       
      }
      
    } else {
             return (lResult ^ lX8 ^ lY8);
      
    }
    
  }
    function md5_F(x, y, z) {
         return (x & y) | ((~x) & z);
    
  }
     function md5_G(x, y, z) {
         return (x & z) | (y & (~z));
    
  }
     function md5_H(x, y, z) {
         return (x ^ y ^ z);
    
  }
     function md5_I(x, y, z) {
         return (y ^ (x | (~z)));
    
  }
     function md5_FF(a, b, c, d, x, s, ac) {
         a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
         return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    
  };
   function md5_GG(a, b, c, d, x, s, ac) {
       a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
   
  };
     function md5_HH(a, b, c, d, x, s, ac) {
         a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
         return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    
  };
    function md5_II(a, b, c, d, x, s, ac) {
         a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    
  };
    function md5_ConvertToWordArray(string) {
        let lWordCount;
         let lMessageLength = string.length;
        let lNumberOfWords_temp1 = lMessageLength + 8;
        let lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        let lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
         let lWordArray = Array(lNumberOfWords - 1);
         let lBytePosition = 0;
         let lByteCount = 0;
         while (lByteCount < lMessageLength) {
             lWordCount = (lByteCount - (lByteCount % 4)) / 4;
             lBytePosition = (lByteCount % 4) * 8;
             lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
      
    }
         lWordCount = (lByteCount - (lByteCount % 4)) / 4;
         lBytePosition = (lByteCount % 4) * 8;
         lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
         lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
         lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
         return lWordArray;
    
  };
     function md5_WordToHex(lValue) {
         let WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
         for (lCount = 0; lCount <= 3; lCount++) {
             lByte = (lValue >>> (lCount * 8)) & 255;
             WordToHexValue_temp = "0" + lByte.toString(16);
             WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      
    }
         return WordToHexValue;
    
  };
     function md5_Utf8Encode(string) {
         string = string.replace(/\r\n/g, "\n");
         let utftext = "";
         for (let n = 0; n < string.length; n++) {
             let c = string.charCodeAt(n);
             if (c < 128) {
                 utftext += String.fromCharCode(c);
        
      } else if ((c > 127) && (c < 2048)) {
                 utftext += String.fromCharCode((c >> 6) | 192);
                 utftext += String.fromCharCode((c & 63) | 128);
        
      } else {
                 utftext += String.fromCharCode((c >> 12) | 224);
                 utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                 utftext += String.fromCharCode((c & 63) | 128);
        
      }
      
    }
         return utftext;
    
  };
     let x = Array();
     let k, AA, BB, CC, DD, a, b, c, d;
     let S11 = 7, S12 = 12, S13 = 17, S14 = 22;
     let S21 = 5, S22 = 9, S23 = 14, S24 = 20;
     let S31 = 4, S32 = 11, S33 = 16, S34 = 23;
     let S41 = 6, S42 = 10, S43 = 15, S44 = 21;
     string = md5_Utf8Encode(string);
     x = md5_ConvertToWordArray(string);
     a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
     for (k = 0; k < x.length; k += 16) {
         AA = a; BB = b; CC = c; DD = d;
         a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
         d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
         c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
         b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
         a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
         d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
         c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
         b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
         a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
         d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
         c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
         b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
         a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
         d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
         c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
         b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
         a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
         d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
         c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
         b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
         a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
         d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
         c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
         b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
         a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
         d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
         c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
         b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
         a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
         d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
         c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
         b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
         a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
         d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
         c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
         b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
         a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
         d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
         c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
         b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
         a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
         d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
         c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
         b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
         a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
         d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
         c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
         b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
         a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
         d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
         c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
         b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
         a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
         d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
         c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
         b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
         a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
         d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
         c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
         b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
         a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
         d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
         c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
         b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
         a = md5_AddUnsigned(a, AA);
         b = md5_AddUnsigned(b, BB);
         c = md5_AddUnsigned(c, CC);
         d = md5_AddUnsigned(d, DD);
    
  }
     return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
  
}
module.exports = {
      md5: md5
      }