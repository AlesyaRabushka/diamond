export function dataURItoBlob(dataURI: string){
    // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], {type: mimeString});
}


export async function setNewColor(colorArray:Array<number[]>, oldColor:Array<number>, newColor:Array<number>){
  try {
    const colorStr = oldColor.toString();

    for (let i = 0; i < colorArray.length; i++){
      if (colorArray[i].toString() === colorStr){
        colorArray[i][0] = newColor[0];
        colorArray[i][1] = newColor[1];
        colorArray[i][2] = newColor[2];
        break;
      }
    }

    return colorArray;
  } catch (error) {
    console.log('[HELPER] change color error:', error)
  }
}