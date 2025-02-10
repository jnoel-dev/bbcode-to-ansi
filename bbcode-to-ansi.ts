class BBCodeToAnsi {
  defaultAnsiTextColor: string;

  constructor(defaultAnsiTextColor: string = "") {
    this.defaultAnsiTextColor = defaultAnsiTextColor;
  }

  private hexToRgb(hex: string, colorFormatType: number) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `\u001b[${colorFormatType};2;${r};${g};${b}m`;
  }
  private parseHexColorTags(
    bbcodeText: string,
    tagString: string,
    colorFormatType: number
  ) {
    // Covert any hex values to rgb
    const tagStringRegex = new RegExp(`\\[${tagString}=(#[A-Fa-f0-9]{6})\\]`);
    const tagStringRegexGlobal = new RegExp(tagStringRegex.source, "g");
    let bbcodeTextFormatted = bbcodeText;

    const hexColorText = bbcodeText.match(tagStringRegexGlobal);
    if (hexColorText !== null) {
      hexColorText.forEach((hexColorTagSet) => {
        const textToBeFormatted = hexColorTagSet.match(tagStringRegex)![1];
        const replacementText = this.hexToRgb(
          textToBeFormatted,
          colorFormatType
        );
        bbcodeTextFormatted = bbcodeTextFormatted.replace(
          `[${tagString}=${textToBeFormatted}]`,
          replacementText
        );
      });
    }

    return bbcodeTextFormatted;
  }

  setDefaultAnsiTextColor(defaultAnsiTextColor: string = "") {
    this.defaultAnsiTextColor = defaultAnsiTextColor;
  }

  parse(bbcodeText: string = ""): string {
    // Hacky workaround foreground color. whitespace + background color to emulate foreground color
    const tagStringRegex = new RegExp(
      "\\[fgcolor(?:=[^\\]]+)?\\](.*?)\\[/fgcolor\\]"
    );
    const tagStringRegexGlobal = new RegExp(tagStringRegex.source, "g");

    const fgcolorText = bbcodeText.match(tagStringRegexGlobal);
    if (fgcolorText !== null) {
      fgcolorText.forEach((fgcolorTagSet) => {
        const textToBeFormatted = fgcolorTagSet.match(tagStringRegex)![1];
        const replacementText = textToBeFormatted.replace(/./g, " ");
        bbcodeText = bbcodeText.replace(textToBeFormatted, replacementText);
      });
      bbcodeText = bbcodeText.replaceAll("fgcolor", "bgcolor");
    }

    bbcodeText = this.parseHexColorTags(bbcodeText, "color", 38);
    bbcodeText = this.parseHexColorTags(bbcodeText, "fgcolor", 38);
    bbcodeText = this.parseHexColorTags(bbcodeText, "bgcolor", 48);

    const parsedBBCode: string = bbcodeText

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
      .replaceAll("[/url]", "")

      // Text color.
      .replaceAll("[color=black]", "\u001b[38;2;0;0;0m")
      .replaceAll("[color=silver]", "\u001b[38;2;192;192;192m")
      .replaceAll("[color=gray]", "\u001b[38;2;128;128;128m")
      .replaceAll("[color=grey]", "\u001b[38;2;128;128;128m")
      .replaceAll("[color=white]", "\u001b[38;2;255;255;255m")
      .replaceAll("[color=maroon]", "\u001b[38;2;128;0;0m")
      .replaceAll("[color=red]", "\u001b[38;2;255;0;0m")
      .replaceAll("[color=purple]", "\u001b[38;2;128;0;128m")
      .replaceAll("[color=fuchsia]", "\u001b[38;2;255;0;255m")
      .replaceAll("[color=green]", "\u001b[38;2;0;128;0m")
      .replaceAll("[color=lime]", "\u001b[38;2;0;255;0m")
      .replaceAll("[color=olive]", "\u001b[38;2;128;128;0m")
      .replaceAll("[color=yellow]", "\u001b[38;2;255;255;0m")
      .replaceAll("[color=navy]", "\u001b[38;2;0;0;128m")
      .replaceAll("[color=blue]", "\u001b[38;2;0;0;255m")
      .replaceAll("[color=teal]", "\u001b[38;2;0;128;128m")
      .replaceAll("[color=aqua]", "\u001b[38;2;0;255;255m")
      .replaceAll("[color=orange]", "\u001b[38;2;255;165;0m")
      .replaceAll("[color=dark_red]", "\u001b[38;2;139;0;0m")
      .replaceAll("[color=brown]", "\u001b[38;2;165;42;42m")
      .replaceAll("[color=firebrick]", "\u001b[38;2;178;34;34m")
      .replaceAll("[color=crimson]", "\u001b[38;2;220;20;60m")
      .replaceAll("[color=dark_orange]", "\u001b[38;2;255;140;0m")
      .replaceAll("[color=gold]", "\u001b[38;2;255;215;0m")
      .replaceAll("[color=dark_goldenrod]", "\u001b[38;2;184;134;11m")
      .replaceAll("[color=rosy_brown]", "\u001b[38;2;188;143;143m")
      .replaceAll("[color=dark_green]", "\u001b[38;2;0;100;0m")
      .replaceAll("[color=forest_green]", "\u001b[38;2;34;139;34m")
      .replaceAll("[color=dark_cyan]", "\u001b[38;2;0;139;139m")
      .replaceAll("[color=light_sea_green]", "\u001b[38;2;32;178;170m")
      .replaceAll("[color=dark_blue]", "\u001b[38;2;0;0;139m")
      .replaceAll("[color=medium_blue]", "\u001b[38;2;0;0;205m")
      .replaceAll("[color=dark_violet]", "\u001b[38;2;148;0;211m")
      .replaceAll("[color=dark_magenta]", "\u001b[38;2;139;0;139m")
      .replaceAll("[color=indian_red]", "\u001b[38;2;205;92;92m")
      .replaceAll("[color=light_coral]", "\u001b[38;2;240;128;128m")
      .replaceAll("[color=salmon]", "\u001b[38;2;250;128;114m")
      .replaceAll("[color=dark_salmon]", "\u001b[38;2;233;150;122m")
      .replaceAll("[color=light_salmon]", "\u001b[38;2;255;160;122m")
      .replaceAll("[color=light_pink]", "\u001b[38;2;255;182;193m")
      .replaceAll("[color=deep_pink]", "\u001b[38;2;255;20;147m")
      .replaceAll("[color=medium_violet_red]", "\u001b[38;2;199;21;133m")
      .replaceAll("[color=pale_violet_red]", "\u001b[38;2;219;112;147m")
      .replaceAll("[color=blue_violet]", "\u001b[38;2;138;43;226m")
      .replaceAll("[color=dark_slate_blue]", "\u001b[38;2;72;61;139m")
      .replaceAll("[color=medium_slate_blue]", "\u001b[38;2;123;104;238m")
      .replaceAll("[color=tomato]", "\u001b[38;2;255;99;71m")
      .replaceAll("[color=orange_red]", "\u001b[38;2;255;69;0m")
      .replaceAll("[color=khaki]", "\u001b[38;2;240;230;140m")
      .replaceAll("[color=lavender]", "\u001b[38;2;230;230;250m")
      .replaceAll("[color=thistle]", "\u001b[38;2;216;191;216m")
      .replaceAll("[color=plum]", "\u001b[38;2;221;160;221m")
      .replaceAll("[color=violet]", "\u001b[38;2;238;130;238m")
      .replaceAll("[color=orchid]", "\u001b[38;2;218;112;214m")
      .replaceAll("[color=magenta]", "\u001b[38;2;255;0;255m")
      .replaceAll("[color=medium_orchid]", "\u001b[38;2;186;85;211m")
      .replaceAll("[color=rebecca_purple]", "\u001b[38;2;102;51;153m")
      .replaceAll("[color=slateblue]", "\u001b[38;2;106;90;205m")
      .replaceAll("[color=medium_spring_green]", "\u001b[38;2;0;250;154m")
      .replaceAll("[color=spring_green]", "\u001b[38;2;0;255;127m")
      .replaceAll("[color=medium_sea_green]", "\u001b[38;2;60;179;113m")
      .replaceAll("[color=sea_green]", "\u001b[38;2;46;139;87m")
      .replaceAll("[color=green_yellow]", "\u001b[38;2;173;255;47m")
      .replaceAll("[color=chartreuse]", "\u001b[38;2;127;255;0m")
      .replaceAll("[color=lawn_green]", "\u001b[38;2;124;252;0m")
      .replaceAll("[color=light_green]", "\u001b[38;2;144;238;144m")
      .replaceAll("[color=pale_green]", "\u001b[38;2;152;251;152m")
      .replaceAll("[color=dark_sea_green]", "\u001b[38;2;143;188;143m")
      .replaceAll("[color=light_cyan]", "\u001b[38;2;224;255;255m")
      .replaceAll("[color=pale_turquoise]", "\u001b[38;2;175;238;238m")
      .replaceAll("[color=aquamarine]", "\u001b[38;2;127;255;212m")
      .replaceAll("[color=turquoise]", "\u001b[38;2;64;224;208m")
      .replaceAll("[color=medium_turquoise]", "\u001b[38;2;72;209;204m")
      .replaceAll("[color=dark_turquoise]", "\u001b[38;2;0;206;209m")
      .replaceAll("[color=cadet_blue]", "\u001b[38;2;95;158;160m")
      .replaceAll("[color=steel_blue]", "\u001b[38;2;70;130;180m")
      .replaceAll("[color=light_steel_blue]", "\u001b[38;2;176;196;222m")
      .replaceAll("[color=powder_blue]", "\u001b[38;2;176;224;230m")
      .replaceAll("[color=light_blue]", "\u001b[38;2;173;216;230m")
      .replaceAll("[color=sky_blue]", "\u001b[38;2;135;206;235m")
      .replaceAll("[color=light_sky_blue]", "\u001b[38;2;135;206;250m")
      .replaceAll("[color=deep_sky_blue]", "\u001b[38;2;0;191;255m")
      .replaceAll("[color=dodger_blue]", "\u001b[38;2;30;144;255m")
      .replaceAll("[color=royal_blue]", "\u001b[38;2;65;105;225m")
      .replaceAll("[color=midnight_blue]", "\u001b[38;2;25;25;112m")
      .replaceAll("[color=corn_silk]", "\u001b[38;2;255;248;220m")
      .replaceAll("[color=beige]", "\u001b[38;2;245;245;220m")
      .replaceAll("[color=wheat]", "\u001b[38;2;245;222;179m")
      .replaceAll("[color=sandy_brown]", "\u001b[38;2;244;164;96m")
      .replaceAll("[color=goldenrod]", "\u001b[38;2;218;165;32m")
      .replaceAll("[color=peru]", "\u001b[38;2;205;133;63m")
      .replaceAll("[color=chocolate]", "\u001b[38;2;210;105;30m")
      .replaceAll("[color=saddle_brown]", "\u001b[38;2;139;69;19m")
      .replaceAll("[color=sienna]", "\u001b[38;2;160;82;45m")
      .replaceAll("[color=burlywood]", "\u001b[38;2;222;184;135m")
      .replaceAll("[color=tan]", "\u001b[38;2;210;180;140m")
      .replaceAll("[color=moccasin]", "\u001b[38;2;255;228;181m")
      .replaceAll("[color=navajo_white]", "\u001b[38;2;255;222;173m")
      .replaceAll("[color=bisque]", "\u001b[38;2;255;228;196m")
      .replaceAll("[color=blanched_almond]", "\u001b[38;2;255;235;205m")
      .replaceAll("[color=dark_khaki]", "\u001b[38;2;189;183;107m")
      .replaceAll("[color=gainsboro]", "\u001b[38;2;220;220;220m")
      .replaceAll("[color=light_gray]", "\u001b[38;2;211;211;211m")
      .replaceAll("[color=light_grey]", "\u001b[38;2;211;211;211m")
      .replaceAll("[color=dark_gray]", "\u001b[38;2;169;169;169m")
      .replaceAll("[color=dark_grey]", "\u001b[38;2;169;169;169m")
      .replaceAll("[color=dim_gray]", "\u001b[38;2;105;105;105m")
      .replaceAll("[color=dim_grey]", "\u001b[38;2;105;105;105m")
      .replaceAll("[color=light_slate_gray]", "\u001b[38;2;119;136;153m")
      .replaceAll("[color=light_slate_grey]", "\u001b[38;2;119;136;153m")
      .replaceAll("[color=slate_gray]", "\u001b[38;2;112;128;144m")
      .replaceAll("[color=slate_grey]", "\u001b[38;2;112;128;144m")
      .replaceAll("[color=dark_slate_gray]", "\u001b[38;2;47;79;79m")
      .replaceAll("[color=dark_slate_grey]", "\u001b[38;2;47;79;79m")
      .replaceAll("[color=alice_blue]", "\u001b[38;2;240;248;255m")
      .replaceAll("[color=ghost_white]", "\u001b[38;2;248;248;255m")
      .replaceAll("[color=honeydew]", "\u001b[38;2;240;255;240m")
      .replaceAll("[color=ivory]", "\u001b[38;2;255;255;240m")
      .replaceAll("[color=azure]", "\u001b[38;2;240;255;255m")
      .replaceAll("[color=snow]", "\u001b[38;2;255;250;250m")
      .replaceAll("[color=linen]", "\u001b[38;2;250;240;230m")
      .replaceAll("[color=old_lace]", "\u001b[38;2;253;245;230m")
      .replaceAll("[color=floral_white]", "\u001b[38;2;255;250;240m")
      .replaceAll("[color=seashell]", "\u001b[38;2;255;245;238m")
      .replaceAll("[color=misty_rose]", "\u001b[38;2;255;228;225m")
      .replaceAll("[color=antique_white]", "\u001b[38;2;250;235;215m")
      .replaceAll("[color=papaya_whip]", "\u001b[38;2;255;239;213m")
      .replaceAll("[color=peach_puff]", "\u001b[38;2;255;218;185m")
      .replaceAll("[color=lemon_chiffon]", "\u001b[38;2;255;250;205m")
      .replaceAll("[color=light_goldenrod_yellow]", "\u001b[38;2;250;250;210m")
      .replaceAll("[color=light_yellow]", "\u001b[38;2;255;255;224m")
      .replaceAll("[color=coral]", "\u001b[38;2;255;127;80m")
      .replaceAll("[color=cornflower_blue]", "\u001b[38;2;100;149;237m")
      .replaceAll("[color=cyan]", "\u001b[38;2;0;255;255m")
      .replaceAll("[color=dark_olive_green]", "\u001b[38;2;85;107;47m")
      .replaceAll("[color=dark_orchid]", "\u001b[38;2;153;50;204m")
      .replaceAll("[color=hotpink]", "\u001b[38;2;255;105;180m")
      .replaceAll("[color=indigo]", "\u001b[38;2;75;0;130m")
      .replaceAll("[color=lavender_blush]", "\u001b[38;2;255;240;245m")
      .replaceAll("[color=lime_green]", "\u001b[38;2;50;205;50m")
      .replaceAll("[color=medium_aquamarine]", "\u001b[38;2;102;205;170m")
      .replaceAll("[color=medium_purple]", "\u001b[38;2;147;112;219m")
      .replaceAll("[color=mint_cream]", "\u001b[38;2;245;255;250m")
      .replaceAll("[color=olive_drab]", "\u001b[38;2;107;142;35m")
      .replaceAll("[color=pale_goldenrod]", "\u001b[38;2;238;232;170m")
      .replaceAll("[color=pale_violetred]", "\u001b[38;2;219;112;147m")
      .replaceAll("[color=pink]", "\u001b[38;2;255;192;203m")
      .replaceAll("[color=white_smoke]", "\u001b[38;2;245;245;245m")
      .replaceAll("[color=yellow_green]", "\u001b[38;2;154;205;50m")
      .replaceAll("[/color]", "\u001b[39m")

      // Background color (highlighting text).
      .replaceAll("[bgcolor=black]", "\u001b[48;2;0;0;0m")
      .replaceAll("[bgcolor=silver]", "\u001b[48;2;192;192;192m")
      .replaceAll("[bgcolor=gray]", "\u001b[48;2;128;128;128m")
      .replaceAll("[bgcolor=grey]", "\u001b[48;2;128;128;128m")
      .replaceAll("[bgcolor=white]", "\u001b[48;2;255;255;255m")
      .replaceAll("[bgcolor=maroon]", "\u001b[48;2;128;0;0m")
      .replaceAll("[bgcolor=red]", "\u001b[48;2;255;0;0m")
      .replaceAll("[bgcolor=purple]", "\u001b[48;2;128;0;128m")
      .replaceAll("[bgcolor=fuchsia]", "\u001b[48;2;255;0;255m")
      .replaceAll("[bgcolor=green]", "\u001b[48;2;0;128;0m")
      .replaceAll("[bgcolor=lime]", "\u001b[48;2;0;255;0m")
      .replaceAll("[bgcolor=olive]", "\u001b[48;2;128;128;0m")
      .replaceAll("[bgcolor=yellow]", "\u001b[48;2;255;255;0m")
      .replaceAll("[bgcolor=navy]", "\u001b[48;2;0;0;128m")
      .replaceAll("[bgcolor=blue]", "\u001b[48;2;0;0;255m")
      .replaceAll("[bgcolor=teal]", "\u001b[48;2;0;128;128m")
      .replaceAll("[bgcolor=aqua]", "\u001b[48;2;0;255;255m")
      .replaceAll("[bgcolor=orange]", "\u001b[48;2;255;165;0m")
      .replaceAll("[bgcolor=dark_red]", "\u001b[48;2;139;0;0m")
      .replaceAll("[bgcolor=brown]", "\u001b[48;2;165;42;42m")
      .replaceAll("[bgcolor=firebrick]", "\u001b[48;2;178;34;34m")
      .replaceAll("[bgcolor=crimson]", "\u001b[48;2;220;20;60m")
      .replaceAll("[bgcolor=dark_orange]", "\u001b[48;2;255;140;0m")
      .replaceAll("[bgcolor=gold]", "\u001b[48;2;255;215;0m")
      .replaceAll("[bgcolor=dark_goldenrod]", "\u001b[48;2;184;134;11m")
      .replaceAll("[bgcolor=rosy_brown]", "\u001b[48;2;188;143;143m")
      .replaceAll("[bgcolor=dark_green]", "\u001b[48;2;0;100;0m")
      .replaceAll("[bgcolor=forest_green]", "\u001b[48;2;34;139;34m")
      .replaceAll("[bgcolor=dark_cyan]", "\u001b[48;2;0;139;139m")
      .replaceAll("[bgcolor=light_sea_green]", "\u001b[48;2;32;178;170m")
      .replaceAll("[bgcolor=dark_blue]", "\u001b[48;2;0;0;139m")
      .replaceAll("[bgcolor=medium_blue]", "\u001b[48;2;0;0;205m")
      .replaceAll("[bgcolor=dark_violet]", "\u001b[48;2;148;0;211m")
      .replaceAll("[bgcolor=dark_magenta]", "\u001b[48;2;139;0;139m")
      .replaceAll("[bgcolor=indian_red]", "\u001b[48;2;205;92;92m")
      .replaceAll("[bgcolor=light_coral]", "\u001b[48;2;240;128;128m")
      .replaceAll("[bgcolor=salmon]", "\u001b[48;2;250;128;114m")
      .replaceAll("[bgcolor=dark_salmon]", "\u001b[48;2;233;150;122m")
      .replaceAll("[bgcolor=light_salmon]", "\u001b[48;2;255;160;122m")
      .replaceAll("[bgcolor=light_pink]", "\u001b[48;2;255;182;193m")
      .replaceAll("[bgcolor=deep_pink]", "\u001b[48;2;255;20;147m")
      .replaceAll("[bgcolor=medium_violet_red]", "\u001b[48;2;199;21;133m")
      .replaceAll("[bgcolor=pale_violet_red]", "\u001b[48;2;219;112;147m")
      .replaceAll("[bgcolor=blue_violet]", "\u001b[48;2;138;43;226m")
      .replaceAll("[bgcolor=dark_slate_blue]", "\u001b[48;2;72;61;139m")
      .replaceAll("[bgcolor=medium_slate_blue]", "\u001b[48;2;123;104;238m")
      .replaceAll("[bgcolor=tomato]", "\u001b[48;2;255;99;71m")
      .replaceAll("[bgcolor=orange_red]", "\u001b[48;2;255;69;0m")
      .replaceAll("[bgcolor=khaki]", "\u001b[48;2;240;230;140m")
      .replaceAll("[bgcolor=lavender]", "\u001b[48;2;230;230;250m")
      .replaceAll("[bgcolor=thistle]", "\u001b[48;2;216;191;216m")
      .replaceAll("[bgcolor=plum]", "\u001b[48;2;221;160;221m")
      .replaceAll("[bgcolor=violet]", "\u001b[48;2;238;130;238m")
      .replaceAll("[bgcolor=orchid]", "\u001b[48;2;218;112;214m")
      .replaceAll("[bgcolor=magenta]", "\u001b[48;2;255;0;255m")
      .replaceAll("[bgcolor=medium_orchid]", "\u001b[48;2;186;85;211m")
      .replaceAll("[bgcolor=rebecca_purple]", "\u001b[48;2;102;51;153m")
      .replaceAll("[bgcolor=slateblue]", "\u001b[48;2;106;90;205m")
      .replaceAll("[bgcolor=medium_spring_green]", "\u001b[48;2;0;250;154m")
      .replaceAll("[bgcolor=spring_green]", "\u001b[48;2;0;255;127m")
      .replaceAll("[bgcolor=medium_sea_green]", "\u001b[48;2;60;179;113m")
      .replaceAll("[bgcolor=sea_green]", "\u001b[48;2;46;139;87m")
      .replaceAll("[bgcolor=green_yellow]", "\u001b[48;2;173;255;47m")
      .replaceAll("[bgcolor=chartreuse]", "\u001b[48;2;127;255;0m")
      .replaceAll("[bgcolor=lawn_green]", "\u001b[48;2;124;252;0m")
      .replaceAll("[bgcolor=light_green]", "\u001b[48;2;144;238;144m")
      .replaceAll("[bgcolor=pale_green]", "\u001b[48;2;152;251;152m")
      .replaceAll("[bgcolor=dark_sea_green]", "\u001b[48;2;143;188;143m")
      .replaceAll("[bgcolor=light_cyan]", "\u001b[48;2;224;255;255m")
      .replaceAll("[bgcolor=pale_turquoise]", "\u001b[48;2;175;238;238m")
      .replaceAll("[bgcolor=aquamarine]", "\u001b[48;2;127;255;212m")
      .replaceAll("[bgcolor=turquoise]", "\u001b[48;2;64;224;208m")
      .replaceAll("[bgcolor=medium_turquoise]", "\u001b[48;2;72;209;204m")
      .replaceAll("[bgcolor=dark_turquoise]", "\u001b[48;2;0;206;209m")
      .replaceAll("[bgcolor=cadet_blue]", "\u001b[48;2;95;158;160m")
      .replaceAll("[bgcolor=steel_blue]", "\u001b[48;2;70;130;180m")
      .replaceAll("[bgcolor=light_steel_blue]", "\u001b[48;2;176;196;222m")
      .replaceAll("[bgcolor=powder_blue]", "\u001b[48;2;176;224;230m")
      .replaceAll("[bgcolor=light_blue]", "\u001b[48;2;173;216;230m")
      .replaceAll("[bgcolor=sky_blue]", "\u001b[48;2;135;206;235m")
      .replaceAll("[bgcolor=light_sky_blue]", "\u001b[48;2;135;206;250m")
      .replaceAll("[bgcolor=deep_sky_blue]", "\u001b[48;2;0;191;255m")
      .replaceAll("[bgcolor=dodger_blue]", "\u001b[48;2;30;144;255m")
      .replaceAll("[bgcolor=royal_blue]", "\u001b[48;2;65;105;225m")
      .replaceAll("[bgcolor=midnight_blue]", "\u001b[48;2;25;25;112m")
      .replaceAll("[bgcolor=corn_silk]", "\u001b[48;2;255;248;220m")
      .replaceAll("[bgcolor=beige]", "\u001b[48;2;245;245;220m")
      .replaceAll("[bgcolor=wheat]", "\u001b[48;2;245;222;179m")
      .replaceAll("[bgcolor=sandy_brown]", "\u001b[48;2;244;164;96m")
      .replaceAll("[bgcolor=goldenrod]", "\u001b[48;2;218;165;32m")
      .replaceAll("[bgcolor=peru]", "\u001b[48;2;205;133;63m")
      .replaceAll("[bgcolor=chocolate]", "\u001b[48;2;210;105;30m")
      .replaceAll("[bgcolor=saddle_brown]", "\u001b[48;2;139;69;19m")
      .replaceAll("[bgcolor=sienna]", "\u001b[48;2;160;82;45m")
      .replaceAll("[bgcolor=burlywood]", "\u001b[48;2;222;184;135m")
      .replaceAll("[bgcolor=tan]", "\u001b[48;2;210;180;140m")
      .replaceAll("[bgcolor=moccasin]", "\u001b[48;2;255;228;181m")
      .replaceAll("[bgcolor=navajo_white]", "\u001b[48;2;255;222;173m")
      .replaceAll("[bgcolor=bisque]", "\u001b[48;2;255;228;196m")
      .replaceAll("[bgcolor=blanched_almond]", "\u001b[48;2;255;235;205m")
      .replaceAll("[bgcolor=dark_khaki]", "\u001b[48;2;189;183;107m")
      .replaceAll("[bgcolor=gainsboro]", "\u001b[48;2;220;220;220m")
      .replaceAll("[bgcolor=light_gray]", "\u001b[48;2;211;211;211m")
      .replaceAll("[bgcolor=light_grey]", "\u001b[48;2;211;211;211m")
      .replaceAll("[bgcolor=dark_gray]", "\u001b[48;2;169;169;169m")
      .replaceAll("[bgcolor=dark_grey]", "\u001b[48;2;169;169;169m")
      .replaceAll("[bgcolor=dim_gray]", "\u001b[48;2;105;105;105m")
      .replaceAll("[bgcolor=dim_grey]", "\u001b[48;2;105;105;105m")
      .replaceAll("[bgcolor=light_slate_gray]", "\u001b[48;2;119;136;153m")
      .replaceAll("[bgcolor=light_slate_grey]", "\u001b[48;2;119;136;153m")
      .replaceAll("[bgcolor=slate_gray]", "\u001b[48;2;112;128;144m")
      .replaceAll("[bgcolor=slate_grey]", "\u001b[48;2;112;128;144m")
      .replaceAll("[bgcolor=dark_slate_gray]", "\u001b[48;2;47;79;79m")
      .replaceAll("[bgcolor=dark_slate_grey]", "\u001b[48;2;47;79;79m")
      .replaceAll("[bgcolor=alice_blue]", "\u001b[48;2;240;248;255m")
      .replaceAll("[bgcolor=ghost_white]", "\u001b[48;2;248;248;255m")
      .replaceAll("[bgcolor=honeydew]", "\u001b[48;2;240;255;240m")
      .replaceAll("[bgcolor=ivory]", "\u001b[48;2;255;255;240m")
      .replaceAll("[bgcolor=azure]", "\u001b[48;2;240;255;255m")
      .replaceAll("[bgcolor=snow]", "\u001b[48;2;255;250;250m")
      .replaceAll("[bgcolor=linen]", "\u001b[48;2;250;240;230m")
      .replaceAll("[bgcolor=old_lace]", "\u001b[48;2;253;245;230m")
      .replaceAll("[bgcolor=floral_white]", "\u001b[48;2;255;250;240m")
      .replaceAll("[bgcolor=seashell]", "\u001b[48;2;255;245;238m")
      .replaceAll("[bgcolor=misty_rose]", "\u001b[48;2;255;228;225m")
      .replaceAll("[bgcolor=antique_white]", "\u001b[48;2;250;235;215m")
      .replaceAll("[bgcolor=papaya_whip]", "\u001b[48;2;255;239;213m")
      .replaceAll("[bgcolor=peach_puff]", "\u001b[48;2;255;218;185m")
      .replaceAll("[bgcolor=lemon_chiffon]", "\u001b[48;2;255;250;205m")
      .replaceAll(
        "[bgcolor=light_goldenrod_yellow]",
        "\u001b[48;2;250;250;210m"
      )
      .replaceAll("[bgcolor=light_yellow]", "\u001b[48;2;255;255;224m")
      .replaceAll("[bgcolor=coral]", "\u001b[48;2;255;127;80m")
      .replaceAll("[bgcolor=cornflower_blue]", "\u001b[48;2;100;149;237m")
      .replaceAll("[bgcolor=cyan]", "\u001b[48;2;0;255;255m")
      .replaceAll("[bgcolor=dark_olive_green]", "\u001b[48;2;85;107;47m")
      .replaceAll("[bgcolor=dark_orchid]", "\u001b[48;2;153;50;204m")
      .replaceAll("[bgcolor=hotpink]", "\u001b[48;2;255;105;180m")
      .replaceAll("[bgcolor=indigo]", "\u001b[48;2;75;0;130m")
      .replaceAll("[bgcolor=lavender_blush]", "\u001b[48;2;255;240;245m")
      .replaceAll("[bgcolor=lime_green]", "\u001b[48;2;50;205;50m")
      .replaceAll("[bgcolor=medium_aquamarine]", "\u001b[48;2;102;205;170m")
      .replaceAll("[bgcolor=medium_purple]", "\u001b[48;2;147;112;219m")
      .replaceAll("[bgcolor=mint_cream]", "\u001b[48;2;245;255;250m")
      .replaceAll("[bgcolor=olive_drab]", "\u001b[48;2;107;142;35m")
      .replaceAll("[bgcolor=pale_goldenrod]", "\u001b[48;2;238;232;170m")
      .replaceAll("[bgcolor=pale_violetred]", "\u001b[48;2;219;112;147m")
      .replaceAll("[bgcolor=pink]", "\u001b[48;2;255;192;203m")
      .replaceAll("[bgcolor=white_smoke]", "\u001b[48;2;245;245;245m")
      .replaceAll("[bgcolor=yellow_green]", "\u001b[48;2;154;205;50m")
      .replaceAll("[/bgcolor]", "\u001b[49m");

    // Reset any active ansi formatting potentially applied above. This ensures terminal is reset for standard output afterwords.
    return (
      this.defaultAnsiTextColor +
      parsedBBCode +
      "\u001b[39m" +
      "\u001b[49m" +
      "\u001b[22m" +
      "\u001b[23m" +
      "\u001b[24m" +
      "\u001b[29m" +
      "\u001b[22m" +
      this.defaultAnsiTextColor
    );
  }
}

export default BBCodeToAnsi;
