import {read} from "jimp";
import { createCanvas, loadImage } from "canvas";

type Args = {
    amount: number;
    format: string;
    group: number;
    sample: number;
  }
  
  type Data = Uint8ClampedArray
  
  type Handler = (data: Data, args: Args) => Output
  
  type Hex = string
  
  type Input = (Hex | Rgb)[]
  
  type Item = Url | HTMLImageElement
  
  type Output = Hex | Rgb | (Hex | Rgb)[]
  
  type Rgb = [r: number, g: number, b: number]
  
  type Url = string

  const getArgs = ({
    amount = 3,
    format = 'array',
    group = 20,
    sample = 10,
  } = {}): Args => ({ amount, format, group, sample })
  
  const format = (input: Input, args: Args): Output => {
    const list = input.map((val) => {
      const rgb = Array.isArray(val) ? val : val.split(',').map(Number) as Rgb
      return args.format === 'hex' ? rgbToHex(rgb) : rgb
    })
  
    return args.amount === 1 || list.length === 1 ? list[0] : list
  }
  
  const group = (number: number, grouping: number): number => {
    const grouped = Math.round(number / grouping) * grouping
  
    return Math.min(grouped, 255)
  }
  
  const rgbToHex = (rgb: Rgb): Hex => '#' + rgb.map((val) => {
    const hex = val.toString(16)
  
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
  
  const getImageData = async (imageBuffer: Buffer) =>{
    const image = await loadImage(imageBuffer)

    const canvas = createCanvas(image.width, image.height);


    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return data.data;
  }
    // new Promise((resolve, reject) => {
    //   const canvas = document.createElement('canvas')
    //   const context = <CanvasRenderingContext2D>canvas.getContext('2d')
    //   const img = new Image
  
    //   img.onload = () => {
    //     canvas.height = img.height
    //     canvas.width = img.width
    //     context.drawImage(img, 0, 0)
  
    //     const data = context.getImageData(0, 0, img.width, img.height).data
  
    //     resolve(data)
    //   }
    //   img.onerror = () => reject(Error('Image loading failed.'))
    //   img.crossOrigin = ''
    //   img.src = src

    // })
  
  const getAverage = (data: Data, args: Args): Output => {
    const gap = 4 * args.sample
    const amount = data.length / gap
    const rgb = { r: 0, g: 0, b: 0 }
  
    for (let i = 0; i < data.length; i += gap) {
      rgb.r += data[i]
      rgb.g += data[i + 1]
      rgb.b += data[i + 2]
    }
  
    return format([[
      Math.round(rgb.r / amount),
      Math.round(rgb.g / amount),
      Math.round(rgb.b / amount)
    ]], args)
  }
  
  const getProminent = (data: Data, args: Args): Output => {
    console.log('check 1')
    const gap = 4 * args.sample
    const colors: { [key: string]: number } = {}
    
    for (let i = 0; i < data.length; i += gap) {
      const rgb = [
        group(data[i], args.group),
        group(data[i + 1], args.group),
        group(data[i + 2], args.group),
      ].join()
      
      colors[rgb] = colors[rgb] ? colors[rgb] + 1 : 1
    }
    console.log('check 2')
    
    return format(
      Object.entries(colors)
      .sort(([_keyA, valA], [_keyB, valB]) => valA > valB ? -1 : 1)
      .slice(0, args.amount)
        .map(([rgb]) => rgb),
      args
    )
  }
  
  const prominent = (buffer: Buffer, args?: Partial<Args>) => 
    getImageData(buffer)
    .then(
      (data: Data) => getProminent(data, getArgs(args))
    )
  
  export { prominent }