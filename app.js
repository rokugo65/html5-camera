var app = new Vue({
  el: '#app',
  data: {
    cameraWidth:0,
    cameraHeight:0,
    videoSroucesArray:[],
    currentVideo:0,
    currentStream:''
  },
  methods:{
    changeCamera: async function(){
      this.currentStream.getVideoTracks().forEach(function(devise) {
          devise.stop();
      });

      this.currentVideo++;
      if ( this.currentVideo == this.videoSroucesArray.length){
        this.currentVideo = 0;
      }

      var constraints = {
        video: {
          optional: [{
            sourceId: this.videoSroucesArray[this.currentVideo].deviceId
          }]
        }
      };

      let currentStream;
      await navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        currentStream = mediaStream;
        video.srcObject = mediaStream;
      })
      this.currentStream = currentStream;

    },
    takePicture: async function(){
      let canvas = document.getElementById('canvas');
      const base64 = canvas.toDataURL();
      const blob = this.base64ToBlob(base64.replace(/^.*,/, ""));
      this.saveBlob(blob,'image.png');
    },
    base64ToBlob:function(base64) {
      var bin = atob(base64.replace(/^.*,/, ''));
      var buffer = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
          buffer[i] = bin.charCodeAt(i);
      }
      try{
          var blob = new Blob([buffer.buffer], {
              type: 'image/png'
          });
      }catch (e){
          return false;
      }
      return blob;
    },
    saveBlob:function(blob, fileName){
    var dataUrl = url.createObjectURL(blob);
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = dataUrl;
    a.download = fileName;
    a.dispatchEvent(event);
}
  },
  mounted:async function(){
    navigator.mediaDevices.enumerateDevices();

    this.cameraWidth = window.innerWidth;
    this.cameraHeight = (this.cameraWidth * 2)/3;

    let video  = document.getElementById('video');
    let canvas = document.getElementById('canvas');
    let videoSroucesArray;
    let currentStream;

    await navigator.mediaDevices.enumerateDevices().then(async function(sourcesInfo) {
      videoSroucesArray = sourcesInfo.filter(function(elem) {
          return elem.kind == 'videoinput';
      });
      var constraints = {
        video: {
          optional: [{
            sourceId: videoSroucesArray[0].deviceId
          }]
        }
      };
      await navigator.mediaDevices.getUserMedia(constraints)
      .then(mediaStream => {
        currentStream = mediaStream;
        video.srcObject = mediaStream;
      })
    });
    this.currentStream = currentStream;
    this.videoSroucesArray = videoSroucesArray;

    ctx = canvas.getContext("2d");
    let width = this.cameraWidth;
    let height = this.cameraHeight;
    setInterval(function(){
      ctx.drawImage(video, 0, 0, width, height);
    }, 1000/60);
  } 
})
  