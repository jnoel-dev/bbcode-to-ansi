"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BBCodeToAnsi {
    constructor(defaultAnsiTextColor = "") {
        this.defaultAnsiTextColor = defaultAnsiTextColor;
    }
    hexToRgb(hex, colorFormatType) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `\u001b[${colorFormatType};2;${r};${g};${b}m`;
    }
    parseColorTags(bbcodeText, tagString, colorFormatType) {
        // Covert any hex values to rgb
        const tagStringRegexGlobal = new RegExp(`(?<=\\[${tagString}=)(?!#)([a-zA-Z_]+)(?=\\])`, "g");
        const hexTagStringRegex = new RegExp(`\\[${tagString}=(#[A-Fa-f0-9]{6})\\]`);
        const hexTagStringRegexGlobal = new RegExp(hexTagStringRegex.source, "g");
        let bbcodeTextFormatted = bbcodeText;
        const colorText = bbcodeText.match(tagStringRegexGlobal);
        if (colorText !== null) {
            colorText.forEach((colorText) => {
                bbcodeTextFormatted = bbcodeTextFormatted.replace(colorText, colorText.toLowerCase().replaceAll("_", ""));
            });
        }
        const hexColorText = bbcodeText.match(hexTagStringRegexGlobal);
        if (hexColorText !== null) {
            hexColorText.forEach((hexColorTagSet) => {
                const textToBeFormatted = hexColorTagSet.match(hexTagStringRegex)[1];
                const replacementText = this.hexToRgb(textToBeFormatted, colorFormatType);
                bbcodeTextFormatted = bbcodeTextFormatted.replace(`[${tagString}=${textToBeFormatted}]`, replacementText);
            });
        }
        bbcodeTextFormatted = bbcodeTextFormatted
            .replaceAll(`[${tagString}=black]`, `\u001b[${colorFormatType};2;0;0;0m`)
            .replaceAll(`[${tagString}=silver]`, `\u001b[${colorFormatType};2;192;192;192m`)
            .replaceAll(`[${tagString}=gray]`, `\u001b[${colorFormatType};2;128;128;128m`)
            .replaceAll(`[${tagString}=grey]`, `\u001b[${colorFormatType};2;128;128;128m`)
            .replaceAll(`[${tagString}=white]`, `\u001b[${colorFormatType};2;255;255;255m`)
            .replaceAll(`[${tagString}=maroon]`, `\u001b[${colorFormatType};2;128;0;0m`)
            .replaceAll(`[${tagString}=red]`, `\u001b[${colorFormatType};2;255;0;0m`)
            .replaceAll(`[${tagString}=purple]`, `\u001b[${colorFormatType};2;128;0;128m`)
            .replaceAll(`[${tagString}=fuchsia]`, `\u001b[${colorFormatType};2;255;0;255m`)
            .replaceAll(`[${tagString}=green]`, `\u001b[${colorFormatType};2;0;128;0m`)
            .replaceAll(`[${tagString}=lime]`, `\u001b[${colorFormatType};2;0;255;0m`)
            .replaceAll(`[${tagString}=olive]`, `\u001b[${colorFormatType};2;128;128;0m`)
            .replaceAll(`[${tagString}=yellow]`, `\u001b[${colorFormatType};2;255;255;0m`)
            .replaceAll(`[${tagString}=navy]`, `\u001b[${colorFormatType};2;0;0;128m`)
            .replaceAll(`[${tagString}=blue]`, `\u001b[${colorFormatType};2;0;0;255m`)
            .replaceAll(`[${tagString}=teal]`, `\u001b[${colorFormatType};2;0;128;128m`)
            .replaceAll(`[${tagString}=aqua]`, `\u001b[${colorFormatType};2;0;255;255m`)
            .replaceAll(`[${tagString}=orange]`, `\u001b[${colorFormatType};2;255;165;0m`)
            .replaceAll(`[${tagString}=darkred]`, `\u001b[${colorFormatType};2;139;0;0m`)
            .replaceAll(`[${tagString}=brown]`, `\u001b[${colorFormatType};2;165;42;42m`)
            .replaceAll(`[${tagString}=firebrick]`, `\u001b[${colorFormatType};2;178;34;34m`)
            .replaceAll(`[${tagString}=crimson]`, `\u001b[${colorFormatType};2;220;20;60m`)
            .replaceAll(`[${tagString}=darkorange]`, `\u001b[${colorFormatType};2;255;140;0m`)
            .replaceAll(`[${tagString}=gold]`, `\u001b[${colorFormatType};2;255;215;0m`)
            .replaceAll(`[${tagString}=darkgoldenrod]`, `\u001b[${colorFormatType};2;184;134;11m`)
            .replaceAll(`[${tagString}=rosybrown]`, `\u001b[${colorFormatType};2;188;143;143m`)
            .replaceAll(`[${tagString}=darkgreen]`, `\u001b[${colorFormatType};2;0;100;0m`)
            .replaceAll(`[${tagString}=forestgreen]`, `\u001b[${colorFormatType};2;34;139;34m`)
            .replaceAll(`[${tagString}=darkcyan]`, `\u001b[${colorFormatType};2;0;139;139m`)
            .replaceAll(`[${tagString}=lightseagreen]`, `\u001b[${colorFormatType};2;32;178;170m`)
            .replaceAll(`[${tagString}=darkblue]`, `\u001b[${colorFormatType};2;0;0;139m`)
            .replaceAll(`[${tagString}=mediumblue]`, `\u001b[${colorFormatType};2;0;0;205m`)
            .replaceAll(`[${tagString}=darkviolet]`, `\u001b[${colorFormatType};2;148;0;211m`)
            .replaceAll(`[${tagString}=darkmagenta]`, `\u001b[${colorFormatType};2;139;0;139m`)
            .replaceAll(`[${tagString}=indianred]`, `\u001b[${colorFormatType};2;205;92;92m`)
            .replaceAll(`[${tagString}=lightcoral]`, `\u001b[${colorFormatType};2;240;128;128m`)
            .replaceAll(`[${tagString}=salmon]`, `\u001b[${colorFormatType};2;250;128;114m`)
            .replaceAll(`[${tagString}=darksalmon]`, `\u001b[${colorFormatType};2;233;150;122m`)
            .replaceAll(`[${tagString}=lightsalmon]`, `\u001b[${colorFormatType};2;255;160;122m`)
            .replaceAll(`[${tagString}=lightpink]`, `\u001b[${colorFormatType};2;255;182;193m`)
            .replaceAll(`[${tagString}=deeppink]`, `\u001b[${colorFormatType};2;255;20;147m`)
            .replaceAll(`[${tagString}=mediumvioletred]`, `\u001b[${colorFormatType};2;199;21;133m`)
            .replaceAll(`[${tagString}=palevioletred]`, `\u001b[${colorFormatType};2;219;112;147m`)
            .replaceAll(`[${tagString}=blueviolet]`, `\u001b[${colorFormatType};2;138;43;226m`)
            .replaceAll(`[${tagString}=darkslateblue]`, `\u001b[${colorFormatType};2;72;61;139m`)
            .replaceAll(`[${tagString}=mediumslateblue]`, `\u001b[${colorFormatType};2;123;104;238m`)
            .replaceAll(`[${tagString}=tomato]`, `\u001b[${colorFormatType};2;255;99;71m`)
            .replaceAll(`[${tagString}=orangered]`, `\u001b[${colorFormatType};2;255;69;0m`)
            .replaceAll(`[${tagString}=khaki]`, `\u001b[${colorFormatType};2;240;230;140m`)
            .replaceAll(`[${tagString}=lavender]`, `\u001b[${colorFormatType};2;230;230;250m`)
            .replaceAll(`[${tagString}=thistle]`, `\u001b[${colorFormatType};2;216;191;216m`)
            .replaceAll(`[${tagString}=plum]`, `\u001b[${colorFormatType};2;221;160;221m`)
            .replaceAll(`[${tagString}=violet]`, `\u001b[${colorFormatType};2;238;130;238m`)
            .replaceAll(`[${tagString}=orchid]`, `\u001b[${colorFormatType};2;218;112;214m`)
            .replaceAll(`[${tagString}=magenta]`, `\u001b[${colorFormatType};2;255;0;255m`)
            .replaceAll(`[${tagString}=mediumorchid]`, `\u001b[${colorFormatType};2;186;85;211m`)
            .replaceAll(`[${tagString}=rebeccapurple]`, `\u001b[${colorFormatType};2;102;51;153m`)
            .replaceAll(`[${tagString}=slateblue]`, `\u001b[${colorFormatType};2;106;90;205m`)
            .replaceAll(`[${tagString}=mediumspringgreen]`, `\u001b[${colorFormatType};2;0;250;154m`)
            .replaceAll(`[${tagString}=springgreen]`, `\u001b[${colorFormatType};2;0;255;127m`)
            .replaceAll(`[${tagString}=mediumseagreen]`, `\u001b[${colorFormatType};2;60;179;113m`)
            .replaceAll(`[${tagString}=seagreen]`, `\u001b[${colorFormatType};2;46;139;87m`)
            .replaceAll(`[${tagString}=greenyellow]`, `\u001b[${colorFormatType};2;173;255;47m`)
            .replaceAll(`[${tagString}=chartreuse]`, `\u001b[${colorFormatType};2;127;255;0m`)
            .replaceAll(`[${tagString}=lawngreen]`, `\u001b[${colorFormatType};2;124;252;0m`)
            .replaceAll(`[${tagString}=lightgreen]`, `\u001b[${colorFormatType};2;144;238;144m`)
            .replaceAll(`[${tagString}=palegreen]`, `\u001b[${colorFormatType};2;152;251;152m`)
            .replaceAll(`[${tagString}=darkseagreen]`, `\u001b[${colorFormatType};2;143;188;143m`)
            .replaceAll(`[${tagString}=lightcyan]`, `\u001b[${colorFormatType};2;224;255;255m`)
            .replaceAll(`[${tagString}=paleturquoise]`, `\u001b[${colorFormatType};2;175;238;238m`)
            .replaceAll(`[${tagString}=aquamarine]`, `\u001b[${colorFormatType};2;127;255;212m`)
            .replaceAll(`[${tagString}=turquoise]`, `\u001b[${colorFormatType};2;64;224;208m`)
            .replaceAll(`[${tagString}=mediumturquoise]`, `\u001b[${colorFormatType};2;72;209;204m`)
            .replaceAll(`[${tagString}=darkturquoise]`, `\u001b[${colorFormatType};2;0;206;209m`)
            .replaceAll(`[${tagString}=cadetblue]`, `\u001b[${colorFormatType};2;95;158;160m`)
            .replaceAll(`[${tagString}=steelblue]`, `\u001b[${colorFormatType};2;70;130;180m`)
            .replaceAll(`[${tagString}=lightsteelblue]`, `\u001b[${colorFormatType};2;176;196;222m`)
            .replaceAll(`[${tagString}=powderblue]`, `\u001b[${colorFormatType};2;176;224;230m`)
            .replaceAll(`[${tagString}=lightblue]`, `\u001b[${colorFormatType};2;173;216;230m`)
            .replaceAll(`[${tagString}=skyblue]`, `\u001b[${colorFormatType};2;135;206;235m`)
            .replaceAll(`[${tagString}=lightskyblue]`, `\u001b[${colorFormatType};2;135;206;250m`)
            .replaceAll(`[${tagString}=deepskyblue]`, `\u001b[${colorFormatType};2;0;191;255m`)
            .replaceAll(`[${tagString}=dodgerblue]`, `\u001b[${colorFormatType};2;30;144;255m`)
            .replaceAll(`[${tagString}=royalblue]`, `\u001b[${colorFormatType};2;65;105;225m`)
            .replaceAll(`[${tagString}=midnightblue]`, `\u001b[${colorFormatType};2;25;25;112m`)
            .replaceAll(`[${tagString}=cornsilk]`, `\u001b[${colorFormatType};2;255;248;220m`)
            .replaceAll(`[${tagString}=beige]`, `\u001b[${colorFormatType};2;245;245;220m`)
            .replaceAll(`[${tagString}=wheat]`, `\u001b[${colorFormatType};2;245;222;179m`)
            .replaceAll(`[${tagString}=sandybrown]`, `\u001b[${colorFormatType};2;244;164;96m`)
            .replaceAll(`[${tagString}=goldenrod]`, `\u001b[${colorFormatType};2;218;165;32m`)
            .replaceAll(`[${tagString}=peru]`, `\u001b[${colorFormatType};2;205;133;63m`)
            .replaceAll(`[${tagString}=chocolate]`, `\u001b[${colorFormatType};2;210;105;30m`)
            .replaceAll(`[${tagString}=saddlebrown]`, `\u001b[${colorFormatType};2;139;69;19m`)
            .replaceAll(`[${tagString}=sienna]`, `\u001b[${colorFormatType};2;160;82;45m`)
            .replaceAll(`[${tagString}=burlywood]`, `\u001b[${colorFormatType};2;222;184;135m`)
            .replaceAll(`[${tagString}=tan]`, `\u001b[${colorFormatType};2;210;180;140m`)
            .replaceAll(`[${tagString}=moccasin]`, `\u001b[${colorFormatType};2;255;228;181m`)
            .replaceAll(`[${tagString}=navajowhite]`, `\u001b[${colorFormatType};2;255;222;173m`)
            .replaceAll(`[${tagString}=bisque]`, `\u001b[${colorFormatType};2;255;228;196m`)
            .replaceAll(`[${tagString}=blanchedalmond]`, `\u001b[${colorFormatType};2;255;235;205m`)
            .replaceAll(`[${tagString}=darkkhaki]`, `\u001b[${colorFormatType};2;189;183;107m`)
            .replaceAll(`[${tagString}=gainsboro]`, `\u001b[${colorFormatType};2;220;220;220m`)
            .replaceAll(`[${tagString}=lightgray]`, `\u001b[${colorFormatType};2;211;211;211m`)
            .replaceAll(`[${tagString}=lightgrey]`, `\u001b[${colorFormatType};2;211;211;211m`)
            .replaceAll(`[${tagString}=darkgray]`, `\u001b[${colorFormatType};2;169;169;169m`)
            .replaceAll(`[${tagString}=darkgrey]`, `\u001b[${colorFormatType};2;169;169;169m`)
            .replaceAll(`[${tagString}=dimgray]`, `\u001b[${colorFormatType};2;105;105;105m`)
            .replaceAll(`[${tagString}=dimgrey]`, `\u001b[${colorFormatType};2;105;105;105m`)
            .replaceAll(`[${tagString}=lightslategray]`, `\u001b[${colorFormatType};2;119;136;153m`)
            .replaceAll(`[${tagString}=lightslategrey]`, `\u001b[${colorFormatType};2;119;136;153m`)
            .replaceAll(`[${tagString}=slategray]`, `\u001b[${colorFormatType};2;112;128;144m`)
            .replaceAll(`[${tagString}=slategrey]`, `\u001b[${colorFormatType};2;112;128;144m`)
            .replaceAll(`[${tagString}=darkslategray]`, `\u001b[${colorFormatType};2;47;79;79m`)
            .replaceAll(`[${tagString}=darkslategrey]`, `\u001b[${colorFormatType};2;47;79;79m`)
            .replaceAll(`[${tagString}=aliceblue]`, `\u001b[${colorFormatType};2;240;248;255m`)
            .replaceAll(`[${tagString}=ghostwhite]`, `\u001b[${colorFormatType};2;248;248;255m`)
            .replaceAll(`[${tagString}=honeydew]`, `\u001b[${colorFormatType};2;240;255;240m`)
            .replaceAll(`[${tagString}=ivory]`, `\u001b[${colorFormatType};2;255;255;240m`)
            .replaceAll(`[${tagString}=azure]`, `\u001b[${colorFormatType};2;240;255;255m`)
            .replaceAll(`[${tagString}=snow]`, `\u001b[${colorFormatType};2;255;250;250m`)
            .replaceAll(`[${tagString}=linen]`, `\u001b[${colorFormatType};2;250;240;230m`)
            .replaceAll(`[${tagString}=oldlace]`, `\u001b[${colorFormatType};2;253;245;230m`)
            .replaceAll(`[${tagString}=floralwhite]`, `\u001b[${colorFormatType};2;255;250;240m`)
            .replaceAll(`[${tagString}=seashell]`, `\u001b[${colorFormatType};2;255;245;238m`)
            .replaceAll(`[${tagString}=mistyrose]`, `\u001b[${colorFormatType};2;255;228;225m`)
            .replaceAll(`[${tagString}=antiquewhite]`, `\u001b[${colorFormatType};2;250;235;215m`)
            .replaceAll(`[${tagString}=papayawhip]`, `\u001b[${colorFormatType};2;255;239;213m`)
            .replaceAll(`[${tagString}=peachpuff]`, `\u001b[${colorFormatType};2;255;218;185m`)
            .replaceAll(`[${tagString}=lemonchiffon]`, `\u001b[${colorFormatType};2;255;250;205m`)
            .replaceAll(`[${tagString}=lightgoldenrodyellow]`, `\u001b[${colorFormatType};2;250;250;210m`)
            .replaceAll(`[${tagString}=lightyellow]`, `\u001b[${colorFormatType};2;255;255;224m`)
            .replaceAll(`[${tagString}=coral]`, `\u001b[${colorFormatType};2;255;127;80m`)
            .replaceAll(`[${tagString}=cornflowerblue]`, `\u001b[${colorFormatType};2;100;149;237m`)
            .replaceAll(`[${tagString}=cyan]`, `\u001b[${colorFormatType};2;0;255;255m`)
            .replaceAll(`[${tagString}=darkolivegreen]`, `\u001b[${colorFormatType};2;85;107;47m`)
            .replaceAll(`[${tagString}=darkorchid]`, `\u001b[${colorFormatType};2;153;50;204m`)
            .replaceAll(`[${tagString}=hotpink]`, `\u001b[${colorFormatType};2;255;105;180m`)
            .replaceAll(`[${tagString}=indigo]`, `\u001b[${colorFormatType};2;75;0;130m`)
            .replaceAll(`[${tagString}=lavenderblush]`, `\u001b[${colorFormatType};2;255;240;245m`)
            .replaceAll(`[${tagString}=limegreen]`, `\u001b[${colorFormatType};2;50;205;50m`)
            .replaceAll(`[${tagString}=mediumaquamarine]`, `\u001b[${colorFormatType};2;102;205;170m`)
            .replaceAll(`[${tagString}=mediumpurple]`, `\u001b[${colorFormatType};2;147;112;219m`)
            .replaceAll(`[${tagString}=mintcream]`, `\u001b[${colorFormatType};2;245;255;250m`)
            .replaceAll(`[${tagString}=olivedrab]`, `\u001b[${colorFormatType};2;107;142;35m`)
            .replaceAll(`[${tagString}=palegoldenrod]`, `\u001b[${colorFormatType};2;238;232;170m`)
            .replaceAll(`[${tagString}=palevioletred]`, `\u001b[${colorFormatType};2;219;112;147m`)
            .replaceAll(`[${tagString}=pink]`, `\u001b[${colorFormatType};2;255;192;203m`)
            .replaceAll(`[${tagString}=whitesmoke]`, `\u001b[${colorFormatType};2;245;245;245m`)
            .replaceAll(`[${tagString}=yellowgreen]`, `\u001b[${colorFormatType};2;154;205;50m`)
            .replaceAll(`[/${tagString}]`, `\u001b[${colorFormatType + 1}m`);
        return bbcodeTextFormatted;
    }
    setDefaultAnsiTextColor(defaultAnsiTextColor = "") {
        this.defaultAnsiTextColor = defaultAnsiTextColor;
    }
    parse(bbcodeText = "") {
        // Hacky workaround foreground color. whitespace + background color to emulate foreground color
        const tagStringRegex = new RegExp("\\[fgcolor(?:=[^\\]]+)?\\](.*?)\\[/fgcolor\\]");
        const tagStringRegexGlobal = new RegExp(tagStringRegex.source, "g");
        const fgcolorText = bbcodeText.match(tagStringRegexGlobal);
        if (fgcolorText !== null) {
            fgcolorText.forEach((fgcolorTagSet) => {
                const textToBeFormatted = fgcolorTagSet.match(tagStringRegex)[1];
                const replacementText = textToBeFormatted.replace(/./g, " ");
                bbcodeText = bbcodeText.replace(textToBeFormatted, replacementText);
            });
            bbcodeText = bbcodeText.replaceAll("fgcolor", "bgcolor");
        }
        bbcodeText = this.parseColorTags(bbcodeText, "color", 38);
        bbcodeText = this.parseColorTags(bbcodeText, "fgcolor", 38);
        bbcodeText = this.parseColorTags(bbcodeText, "bgcolor", 48);
        const parsedBBCode = bbcodeText
            .replaceAll("[b]", "\u001b[1m")
            .replaceAll("[/b]", "\u001b[22m")
            // Italic.
            .replaceAll("[i]", "\u001b[3m")
            .replaceAll("[/i]", "\u001b[23m")
            // Underline.
            .replaceAll("[u]", "\u001b[4m")
            .replaceAll("[/u]", "\u001b[24m")
            // Strikethrough.
            .replaceAll("[s]", "\u001b[9m")
            .replaceAll("[/s]", "\u001b[29m")
            // Indentation (looks equivalent to 4 spaces).
            .replaceAll("[indent]", "    ")
            .replaceAll("[/indent]", "")
            // Code.
            // Terminal fonts are already fixed-width, so use faint coloring to distinguish it
            // from normal text.
            .replaceAll("[code]", "\u001b[2m")
            .replaceAll("[/code]", "\u001b[22m")
            // Without knowing the terminal width, we can't fully emulate [center] and [right] behavior.
            // This is only an approximation that doesn't take the terminal width into account.
            .replaceAll("[center]", "\t\t\t")
            .replaceAll("[/center]", "")
            .replaceAll("[right]", "\t\t\t\t\t\t")
            .replaceAll("[/right]", "")
            // URL (link).
            // Only unnamed URLs can be universally supported in terminals (by letting the terminal
            // recognize it as-is). As of April 2022, support for named URLs is still in progress
            // for many popular terminals.
            .replaceAll("[url]", "")
            .replaceAll("[/url]", "");
        // Reset any active ansi formatting potentially applied above. This ensures terminal is reset for standard output afterwords.
        return (this.defaultAnsiTextColor +
            parsedBBCode +
            "\u001b[39m" +
            "\u001b[49m" +
            "\u001b[22m" +
            "\u001b[23m" +
            "\u001b[24m" +
            "\u001b[29m" +
            "\u001b[22m" +
            this.defaultAnsiTextColor);
    }
}
exports.default = BBCodeToAnsi;
