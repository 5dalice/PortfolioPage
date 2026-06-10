interface GoogleLogoProps {
  size?: "large" | "small"
}

export function GoogleLogo({ size = "large" }: GoogleLogoProps) {
  const letters =  [
    { char: "A", color: "#4285f4" }, // blå
    { char: "l", color: "#ea4335" }, // röd
    { char: "i", color: "#fbbc05" }, // gul
    { char: "c", color: "#4285f4" }, // blå
    { char: "e", color: "#34a853" }, // grön
  // { char: " ", color: "transparent" },
  // { char: "E", color: "#4285f4" }, // blå
  // { char: "w", color: "#ea4335" }, // röd
  // { char: "a", color: "#fbbc05" }, // gul
  //  { char: "l", color: "#4285f4" }, // blå
  //  { char: "d", color: "#34a853" }, // grön
  //  { char: "s", color: "#ea4335" }, // röd
  //  { char: "e", color: "#fbbc05" }, // gul
  //  { char: "n", color: "#4285f4" }, // blå
  ];

  const fontSize = size === "large" ? "text-[92px]" : "text-[28px]"

  return (
    <h1 className={`${fontSize} font-normal tracking-[-2px] select-none leading-none`}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            color: letter.color,
            fontFamily: "'Times New Roman', Georgia, serif",
            fontWeight: 400,
          }}
        >
          {letter.char}
        </span>
      ))}
    </h1>
  )
}
