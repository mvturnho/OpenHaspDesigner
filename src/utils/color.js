export default function color_convert(color) {
    var matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
    var match = matchColors.exec(color);
    // console.log(match)
    if (match !== null) {
        return "#" + componentToHex(match[1]) + componentToHex(match[2]) + componentToHex(match[3]);
    }
}

export function componentToHex(c) {
    // console.log(c)
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function splitColorOpa(color) {
    // console.log("COLOR " + color);
    if (color.length > 7) {
        const outcolor = color.slice(0, -2);
        const opa = ("0x" + color.slice(7)) / 255;
        return { color: outcolor, opacity: opa };
    }
    return {color:color, opacity: '0xff'};

}
