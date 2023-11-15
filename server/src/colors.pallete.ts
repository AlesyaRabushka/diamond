const colorsPallete6 = [[ 250, 132, 43], [237, 171, 86], [ 209, 91, 143], [171, 37, 36], [0, 187, 46], [52, 129, 184]]

const colorsPallete12 = [[41, 44, 47], [111, 74, 47], [245, 255, 0], [247, 249, 239], [16, 44, 84], [198, 54, 120],
[39, 98, 53], [141, 29, 44], [144, 70, 132], [127, 176, 178], [250, 171, 33], [231, 18, 202]]

const colorsPallete18 = [[ 250, 132, 43], [237, 171, 86], [ 209, 91, 143], [171, 37, 36], [0, 187, 46], [52, 129, 184],
[41, 44, 47], [111, 74, 47], [245, 255, 0], [247, 249, 239], [16, 44, 84], [198, 54, 120],
[39, 98, 53], [141, 29, 44], [144, 70, 132], [127, 176, 178], [250, 171, 33], [231, 18, 202]]

let colorPalletes: Array<number[][]> = []
colorPalletes.push(colorsPallete6)
colorPalletes.push(colorsPallete12)
colorPalletes.push(colorsPallete18)

export const getColorPallete = (colorAmount: number) => {
    try {
        for (let i = 0; i < colorPalletes.length; i++){
            if (colorAmount == colorPalletes[i].length){
                return colorPalletes[i]
            }
        }
    } catch (error) {
        console.log('getColorPallete error');

        throw error;
    }
}