class BBCodeToAnsi {
  parse(bbcodeText: string): string {
    let parsedBBCode: string = bbcodeText

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
      .replaceAll("[center]", "\n\t\t\t")
      .replaceAll("[/center]", "")
      .replaceAll("[right]", "\n\t\t\t\t\t\t")
      .replaceAll("[/right]", "")

      // URL (link).
      // Only unnamed URLs can be universally supported in terminals (by letting the terminal
      // recognize it as-is). As of April 2022, support for named URLs is still in progress
      // for many popular terminals.
      .replaceAll("[url]", "")
      .replaceAll("[/url]", "")

      // Text color.
      .replaceAll("[color=black]", "\u001b[30m")
      .replaceAll("[color=red]", "\u001b[91m")
      .replaceAll("[color=green]", "\u001b[92m")
      .replaceAll("[color=lime]", "\u001b[92m")
      .replaceAll("[color=yellow]", "\u001b[93m")
      .replaceAll("[color=blue]", "\u001b[94m")
      .replaceAll("[color=magenta]", "\u001b[95m")
      .replaceAll("[color=pink]", "\u001b[38;5;218m")
      .replaceAll("[color=purple]", "\u001b[38;5;98m")
      .replaceAll("[color=cyan]", "\u001b[96m")
      .replaceAll("[color=white]", "\u001b[97m")
      .replaceAll("[color=orange]", "\u001b[38;5;208m")
      .replaceAll("[color=gray]", "\u001b[90m")
      .replaceAll("[/color]", "\u001b[39m")

      // Background color (highlighting text).
      .replaceAll("[bgcolor=black]", "\u001b[40m")
      .replaceAll("[bgcolor=red]", "\u001b[101m")
      .replaceAll("[bgcolor=green]", "\u001b[102m")
      .replaceAll("[bgcolor=lime]", "\u001b[102m")
      .replaceAll("[bgcolor=yellow]", "\u001b[103m")
      .replaceAll("[bgcolor=blue]", "\u001b[104m")
      .replaceAll("[bgcolor=magenta]", "\u001b[105m")
      .replaceAll("[bgcolor=pink]", "\u001b[48;5;218m")
      .replaceAll("[bgcolor=purple]", "\u001b[48;5;98m")
      .replaceAll("[bgcolor=cyan]", "\u001b[106m")
      .replaceAll("[bgcolor=white]", "\u001b[107m")
      .replaceAll("[bgcolor=orange]", "\u001b[48;5;208m")
      .replaceAll("[bgcolor=gray]", "\u001b[100m")
      .replaceAll("[/bgcolor]", "\u001b[49m")

      // Foreground color (redacting text).
      // Emulated by using the same color for both foreground and background.
      .replaceAll("[fgcolor=black]", "\u001b[30;40m")
      .replaceAll("[fgcolor=red]", "\u001b[91;101m")
      .replaceAll("[fgcolor=green]", "\u001b[92;102m")
      .replaceAll("[fgcolor=lime]", "\u001b[92;102m")
      .replaceAll("[fgcolor=yellow]", "\u001b[93;103m")
      .replaceAll("[fgcolor=blue]", "\u001b[94;104m")
      .replaceAll("[fgcolor=magenta]", "\u001b[95;105m")
      .replaceAll("[fgcolor=pink]", "\u001b[38;5;218;48;5;218m")
      .replaceAll("[fgcolor=purple]", "\u001b[38;5;98;48;5;98m")
      .replaceAll("[fgcolor=cyan]", "\u001b[96;106m")
      .replaceAll("[fgcolor=white]", "\u001b[97;107m")
      .replaceAll("[fgcolor=orange]", "\u001b[38;5;208;48;5;208m")
      .replaceAll("[fgcolor=gray]", "\u001b[90;100m")
      .replaceAll("[/fgcolor]", "\u001b[39;49m");

    return parsedBBCode;
  }
}

export default BBCodeToAnsi;
