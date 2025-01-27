export const ASCII_CONSTRAINTS = {
  OUTPUT_WIDTH: { MIN: 1, MAX: 300 },
  OUTPUT_HEIGHT: { MIN: 1, MAX: 300 },
  FONT_SIZE: { MIN: 1, MAX: 90 },
}

export const ASCII_CHAR_PRESETS = [
  "@%#*+=-:. ",
  "01",
  "█▓▒░ ",
  "█▇▆▅▄▃▂▁ ",
  "→↗↑↖←↙↓↘ ",
  ". . . 🔥 🔥 🔥 . . .", // Emoji preset
]

export const ASCII_COLOUR_PRESETS = ["#FFFFFF", "#33FF00", "#FFB000", "#0099FF"]

export interface AsciiConfig {
  outputWidth: number
  outputHeight: number
  chars: string
  fontFamily: string
  fontSize: number
  colour: string
  animate: boolean
}

export const DEFAULT_ASCII_CONFIG: AsciiConfig = {
  outputWidth: 100,
  outputHeight: 75,
  chars: ASCII_CHAR_PRESETS[5], // Use emoji preset
  fontFamily: "monospace, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif",
  fontSize: 16,
  colour: ASCII_COLOUR_PRESETS[1],
  animate: true,
}

export function generateAscii(data: ImageData, config: AsciiConfig) {
  const { outputWidth, outputHeight, chars } = config
  const { width: sourceWidth, height: sourceHeight, data: pixels } = data
  const ascii = new Array(outputHeight)
    .fill(null)
    .map(() => new Array(outputWidth).fill({ char: " ", colour: config.colour }))

  const sampleWidth = sourceWidth / outputWidth
  const sampleHeight = sourceHeight / outputHeight

  const charsArr = Array.from(chars).reverse()

  for (let row = 0; row < outputHeight; row++) {
    for (let col = 0; col < outputWidth; col++) {
      let r = 0,
        g = 0,
        b = 0,
        count = 0

      const step = Math.max(1, Math.floor(Math.min(sampleWidth, sampleHeight) / 4))
      const x0 = Math.floor(col * sampleWidth)
      const y0 = Math.floor(row * sampleHeight)

      for (let dy = 0; dy < sampleHeight; dy += step) {
        for (let dx = 0; dx < sampleWidth; dx += step) {
          const pixelX = Math.min(Math.floor(x0 + dx), sourceWidth - 1)
          const pixelY = Math.min(Math.floor(y0 + dy), sourceHeight - 1)

          const i = (pixelY * sourceWidth + pixelX) * 4
          r += pixels[i]
          g += pixels[i + 1]
          b += pixels[i + 2]
          count++
        }
      }

      if (count > 0) {
        r /= count
        g /= count
        b /= count
      }

      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const idx = Math.round((luminance / 255) * (chars.length - 1))
      ascii[row][col] = {
        char: charsArr[idx] ?? " ",
        colour: config.colour || `rgb(${r},${g},${b})`,
      }
    }
  }

  return ascii
}

export function renderAscii(source: HTMLCanvasElement, target: HTMLCanvasElement, config: AsciiConfig) {
  const sourceCtx = source.getContext("2d", { willReadFrequently: true })
  const targetCtx = target.getContext("2d")
  if (!sourceCtx || !targetCtx) return

  const imageData = sourceCtx.getImageData(0, 0, source.width, source.height)
  const ascii = generateAscii(imageData, config)

  target.width = source.width
  target.height = source.height
  targetCtx.fillStyle = "black"
  targetCtx.fillRect(0, 0, target.width, target.height)

  targetCtx.font = `${config.fontSize}px ${config.fontFamily}`
  targetCtx.textBaseline = "top"
  const charWidth = target.width / config.outputWidth
  const charHeight = target.height / config.outputHeight

  for (let row = 0; row < ascii.length; row++) {
    for (let col = 0; col < ascii[row].length; col++) {
      const { char, colour } = ascii[row][col]
      targetCtx.fillStyle = colour

      // Check if the character is an emoji
      if (/\p{Emoji}/u.test(char)) {
        // For emojis, use a larger font size and center the emoji
        const emojiSize = Math.min(charWidth, charHeight) * 1.2 // Slightly larger than the cell
        targetCtx.font = `${emojiSize}px ${config.fontFamily}`
        const x = col * charWidth + (charWidth - emojiSize) / 2
        const y = row * charHeight + (charHeight - emojiSize) / 2
        targetCtx.fillText(char, x, y)
        // Reset font for non-emoji characters
        targetCtx.font = `${config.fontSize}px ${config.fontFamily}`
      } else {
        // For non-emoji characters, render as before
        targetCtx.fillText(char, col * charWidth, row * charHeight)
      }
    }
  }
}

export async function generateAsciiText(source: HTMLCanvasElement, config: AsciiConfig) {
  const ctx = source.getContext("2d")
  if (!ctx) return ""

  const imageData = ctx.getImageData(0, 0, source.width, source.height)
  const ascii = generateAscii(imageData, config)
  return ascii.map((row) => row.map((cell) => cell.char).join("")).join("\n")
}

