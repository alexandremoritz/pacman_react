# Context

A test to see what AI can generate with just a few prompts in less than 30 minutes. The game is working, but it is very basic…

This could serve as a benchmark: how long will a human play a game after 30 minutes of AI-generated code from scratch?

Time to beat: 5 minutes. :)


Currently hosted: https://calm-toffee-e723d4.netlify.app/

--- 

# React PacMan like Game 🎮

## 🎯 Features

- **Classic PacMan Gameplay**: Navigate through the maze, collect dots, and avoid ghosts
- **Power Mode**: Collect power pellets to turn the tables on the ghosts
- **Basic Ghost**: Ghosts move autonomously with different behaviors in normal and vulnerable states
- **Smooth Animations**: Fluid character movements and transitions
- **Responsive Controls**: Arrow key controls with intelligent turning mechanics
- **Score Tracking**: Keep track of current score and high score
- **Auto-Reset**: Game automatically resets when all dots are collected
- **Game Over State**: Clear game over screen with restart functionality

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alexandremoritz/pacman_react

2. Navigate to the project directory:
   ```bash
   cd react-pacman
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173`

## 🎮 How to Play

- Use the **Arrow Keys** to control PacMan's direction
- Collect all dots to complete the level
- Eat power pellets to turn ghosts vulnerable
- Avoid ghosts in their normal state
- Chase and eat vulnerable ghosts for bonus points
- Try to beat your high score!

## 🏗️ Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Programming Language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build Tool
- [Lucide React](https://lucide.dev/) - Icons

## 📝 Game Rules

- Each dot collected: 10 points
- Power pellet: 50 points
- Eating a vulnerable ghost: 200 points
- Complete the level by collecting all dots and power pellets
- Game resets automatically when all dots are collected
- High score is preserved during the session

## 🎨 Customization

The game includes several customizable constants in `App.tsx`:

```typescript
const GRID_SIZE = 15;
const CELL_SIZE = 30;
const GHOST_SPEED = 300;
const PACMAN_SPEED = 200;
const POWER_PELLET_DURATION = 10000;
```

Adjust these values to modify:
- Maze size
- Character sizes
- Movement speeds
- Power pellet duration

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original PacMan game by Namco
- React and TypeScript communities
- All contributors and players!
