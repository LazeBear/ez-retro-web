const COLORS = {
  BLACK_1: '#162121',
  BLACK_2: '#2F3B47',
  BLACK_3: '#3E4860',
  BLACK_4: '#51537B',
  BLUE_1: '#05204A',
  BLUE_2: '#2D3C6C',
  BLUE_3: '#3C52AA',
  BLUE_4: '#1E3FE6',
  GREEN_1: '#034523',
  GREEN_2: '#045D32',
  GREEN_3: '#800080',
  GREEN_4: '#C200C2',
  RED_1: '#79231B',
  RED_2: '#93361A',
  RED_3: '#C84F0E',
  RED_4: '#E71613'
};

export default COLORS;

export function getRandomColor() {
  const colors = Object.values(COLORS);
  const rand = Math.floor(Math.random() * (colors.length - 1));
  return colors[rand];
}
