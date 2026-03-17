// Theme configuration for next-themes
export const themeConfig = {
  attribute: 'class',
  defaultTheme: 'system',
  enableSystem: true,
  disableTransitionOnChange: false,
};

// Theme colors
export const themes = {
  light: {
    background: 'rgb(255, 255, 255)',
    foreground: 'rgb(9, 9, 11)',
    card: 'rgb(255, 255, 255)',
    primary: 'rgb(37, 99, 235)',
    secondary: 'rgb(229, 231, 235)',
    muted: 'rgb(229, 231, 235)',
    accent: 'rgb(37, 99, 235)',
  },
  dark: {
    background: 'rgb(15, 23, 42)',
    foreground: 'rgb(248, 250, 252)',
    card: 'rgb(30, 41, 59)',
    primary: 'rgb(59, 130, 246)',
    secondary: 'rgb(30, 41, 59)',
    muted: 'rgb(71, 85, 105)',
    accent: 'rgb(59, 130, 246)',
  },
};

// CSS variables for themes
export const cssVariables = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --primary: 219.2 92.2% 59.6%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 13.3% 91%;
    --secondary-foreground: 0 0% 3.6%;
    --muted: 220 13.3% 91%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 219.2 92.2% 59.6%;
    --accent-foreground: 0 0% 100%;
    --border: 220 13.3% 91%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 216.9 13.8% 9.8%;
    --foreground: 210 40% 98%;
    --card: 217.2 32.6% 17.5%;
    --card-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 216.9 13.8% 9.8%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 16.3% 46.9%;
    --accent: 217.2 91.2% 59.8%;
    --accent-foreground: 216.9 13.8% 9.8%;
    --border: 217.2 32.6% 17.5%;
    --radius: 0.5rem;
  }
}
`;
