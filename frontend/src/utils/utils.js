import { codes } from './mapCodes';

//calculate radius from zipcode
var lookup = function(zip) {
    if (zip !== null && zip !== undefined && typeof zip === "string" && isNaN(zip.charAt(0))) {
      return codes[zip.slice(0, 3)];
    }
    return codes[zip];
};

var deg2rad = function(value) {
    return value * 0.017453292519943295;
};

export const dist = function(zipA, zipB) {
    zipA = lookup(zipA);
    zipB = lookup(zipB);
    if (!zipA || !zipB) {
        return null;
    }

    var zipALatitudeRadians = deg2rad(zipA.latitude);
    var zipBLatitudeRadians = deg2rad(zipB.latitude);

    var distance = Math.sin(zipALatitudeRadians)
                * Math.sin(zipBLatitudeRadians)
                + Math.cos(zipALatitudeRadians)
                * Math.cos(zipBLatitudeRadians)
                * Math.cos(deg2rad(zipA.longitude - zipB.longitude));

    distance = Math.acos(distance) * 3958.56540656;
    return Math.round(distance);
};

// Software License Agreement (BSD License)

// Copyright (c) 2007, Dav Glass <davglass@gmail.com>.
// All rights reserved.

// Redistribution and use of this software in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:

// * Redistributions of source code must retain the above
//   copyright notice, this list of conditions and the
//   following disclaimer.

// * Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the
//   following disclaimer in the documentation and/or other
//   materials provided with the distribution.

// * The name of Dav Glass may not be used to endorse or promote products
//   derived from this software without specific prior
//   written permission of Dav Glass.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
// PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
// TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
