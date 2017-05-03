/**
 * Taken, CommonJS-ified, and heavily modified from:
 * https://github.com/flyingsparx/NodeDirectUploader
 */

S3Upload.prototype.onFinishS3Put = function(signResult, file) {
    return console.log('base.onFinishS3Put()', signResult.publicUrl);
};


S3Upload.prototype.onProgress = function(percent, status, file) {
    return console.log('base.onProgress()', percent, status);
};

S3Upload.prototype.onError = function(status, file) {
    return console.log('base.onError()', status);
};

function S3Upload(file, signedUrl, onProgressCallback, onCompleteCallback) {

    this.onProgress = onProgressCallback;
    this.onFinishS3Put = onCompleteCallback;

    this.uploadFile(file, signedUrl);
}

S3Upload.prototype.uploadToS3 = function(file, signResult) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signResult.signedUrl);
    if (!xhr) {
        this.onError('CORS not supported', file);
    } else {
        xhr.onload = function() {
            if (xhr.status === 200) {
                this.onProgress(100, 'Upload completed', file);
                return this.onFinishS3Put(signResult, file);
            } else {
                return this.onError('Upload error: ' + xhr.status, file);
            }
        }.bind(this);
        xhr.onerror = function(e) {
            return this.onError('XHR error', file);
        }.bind(this);
        xhr.upload.onprogress = function(e) {
            var percentLoaded;
            if (e.lengthComputable) {
                percentLoaded = Math.round((e.loaded / e.total) * 100);
                return this.onProgress(percentLoaded, percentLoaded === 100 ? 'Finalizing' : 'Uploading', file);
            }
        }.bind(this);
    }
    xhr.setRequestHeader('Content-Type', "text/plain;charset=UTF-8");
    this.httprequest = xhr;
    return xhr.send(file);
};

S3Upload.prototype.uploadFile = function(file, signedUrl) {
    this.uploadToS3(file, {signedUrl: signedUrl});
};

S3Upload.prototype.abortUpload = function() {
    this.httprequest && this.httprequest.abort();
};


module.exports = S3Upload;