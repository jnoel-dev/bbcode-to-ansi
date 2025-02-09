# bbcode-to-ansi
BBCode to ANSI parser. Created specifically for Godot external debuggers to support print_rich() terminal output. Project based on https://github.com/Calinou/godot-bbcode-to-ansi

## Install
`npm install bbcode-to-ansi`

## Usage
```js
import BBCodeToAnsi from 'bbcode-to-ansi';
const bbcodeParser = new BBCodeToAnsi();

const bbcOutput = '[b][color=fuchsia]Colorful text output![/color][b]';
bbcodeParser.parse(bbcOutput);
// \u001b[1m\u001b[38;2;255;0;255mColorful text output\u001b[39m\u001b[22m
```
## Limitations
 - Output terminal must support 24bit true color for all BBCode color options
 - Only the following tags are supported `b` `i` `u` `s` `indent` `code` `center` `right` `url` `color` `bgcolor` `fgcolor`
 - If named colors are used, all spaces in the color name must be replaced with an underscore. Example: use`[color=dark_goldenrod]` instead of `[color=darkgoldenrod]`
