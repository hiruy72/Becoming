export const theme = {
  colors: {
    background: '#0B0C10',
    surface: '#1F2833',
    primary: '#66FCF1',
    secondary: '#45A29E',
    text: '#C5C6C7',
    textLight: '#FFFFFF',
    border: '#2C3A47',
    error: '#FF5733',
    success: '#4BB543'
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
    h2: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
    h3: { fontSize: 20, fontWeight: '600', color: '#FFFFFF' },
    body: { fontSize: 16, color: '#C5C6C7' },
    caption: { fontSize: 12, color: '#45A29E' },
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 24,
    round: 9999,
  }
} as const;
