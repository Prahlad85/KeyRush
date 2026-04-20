export const shortSentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "Sphinx of black quartz, judge my vow.",
  "How vexingly quick daft zebras jump!",
  "Bright vixens jump; dozy fowl quack.",
  "Jackdaws love my big sphinx of quartz.",
  "The five boxing wizards jump quickly.",
  "Quick zephyrs blow, vexing daft Jim.",
  "Waltz, bad nymph, for quick jigs vex!",
  "Glib jocks quiz nymph to vex dwarf.",
  "Jived fox nymph grabs quick waltz."
];

export const fullParagraphs = [
  "The rapid technological advancements of the twenty-first century have fundamentally transformed how we communicate, work, and perceive the world around us. With the advent of ubiquitous broadband internet and powerful mobile devices, information is now accessible instantaneously from virtually anywhere on the planet. This unprecedented connectivity has fostered global communities but also introduced complex challenges regarding privacy, attention spans, and the veracity of information.",
  "A majestic eagle soared high above the rugged mountain peaks, its keen eyes scanning the valleys below for any sign of movement. The crisp autumn air carried the scent of pine and decaying leaves, a reminder of the impending winter. Far below, a winding river cut through the landscape like a silver ribbon, reflecting the golden hues of the setting sun. Nature's beauty lay in its intricate balance, a delicate cycle of life and death playing out in silence.",
  "In the heart of the bustling metropolis, neon lights painted the rain-slicked streets in vibrant shades of pink and blue. People hurried past each other, heads bowed against the relentless drizzle, lost in their own encapsulated worlds of digital chatter and urgent tasks. The symphony of the city was a chaotic blend of honking horns, wailing sirens, and the rhythmic thrum of subterranean trains, a testament to human ingenuity and our endless pursuit of progress."
];

export const generateHardChars = (length = 150) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 6 === 0 && i !== length - 1) result += " ";
  }
  return result;
};

export const getRandomText = (difficulty) => {
  if (difficulty === 'easy') {
    return shortSentences[Math.floor(Math.random() * shortSentences.length)];
  } else if (difficulty === 'medium') {
    return fullParagraphs[Math.floor(Math.random() * fullParagraphs.length)];
  } else if (difficulty === 'hard') {
    return generateHardChars(150);
  }
  return shortSentences[0];
};
