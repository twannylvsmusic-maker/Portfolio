# Word Search Generator

A modern, feature-rich word search puzzle generator built with Flask, featuring customizable shapes, themes, and professional export options. Perfect for educators, healthcare providers, and anyone looking to create engaging word puzzles.

## 🎯 Target Applications

### 👩‍🏫 **Educational Use**
- **Reading Instruction**: Help students learn new vocabulary and improve reading skills
- **Thematic Learning**: Create puzzles around specific subjects (science, history, literature)
- **Age-Appropriate Content**: Customize difficulty and themes for different grade levels
- **Classroom Activities**: Generate puzzles for lessons, homework, or fun learning breaks

### 🏥 **Healthcare & Therapy**
- **Cognitive Stimulation**: Engage elderly patients with memory and word recognition exercises
- **Therapy Sessions**: Create personalized puzzles for speech therapy and cognitive rehabilitation
- **Patient Engagement**: Provide enjoyable activities for long-term care facilities
- **Customizable Content**: Adapt puzzles to patient interests and cognitive abilities

### 🏢 **Professional & Personal Use**
- **Team Building**: Create company-themed puzzles for events and training
- **Event Planning**: Generate custom puzzles for parties, conferences, and gatherings
- **Personal Learning**: Practice vocabulary in different languages or specialized fields
- **Entertainment**: Create fun puzzles for family game nights and social events

## 🚀 Live Demo

**Try the application:** [Live Demo](https://heroku-create-wordsearch-demo-209b734ec5ec.herokuapp.com/)

## ✨ Features

### 🎨 Shape Customization
- **Basic Shapes**: Square, Circle, Diamond, Triangle, Hexagon
- **Fun Shapes**: Heart, Star, Butterfly, Flower
- **Animal Shapes**: Dog, Cat, Fish
- **Object Shapes**: Tree, House, Car
- **Custom Shapes**: Upload your own images (Beta feature)

### 🎯 Puzzle Generation
- **Smart Algorithm**: Intelligent word placement with collision detection
- **Multiple Directions**: Horizontal, vertical, and diagonal word placement
- **Real-time Preview**: Live puzzle generation as you type
- **Word Validation**: Automatic word processing and formatting

### 🎨 Customization Options
- **Multiple Themes**: Modern, Cozy, Playful
- **Font Selection**: 7 different font options (including large, readable fonts)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme toggle for user preference
- **Accessibility Features**: High contrast options and adjustable font sizes

### 📄 Export Features
- **PDF Export**: Professional layout with proper margins
- **Word Export**: Editable .docx format
- **Custom Formatting**: Fonts, themes, and layout options
- **Print-Ready**: Optimized for both screen and print

## 🛠️ Technologies Used

- **Backend**: Python 3.12, Flask 3.1.2
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PDF Generation**: ReportLab 4.4.4
- **Document Export**: python-docx 1.1.0
- **Image Processing**: Pillow 11.3.0
- **Deployment**: Heroku, GitHub Pages

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or later
- pip (Python package installer)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/twannylvsmusic-maker/wordsearch-generator.git
   cd wordsearch-generator
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   Navigate to `http://127.0.0.1:5000`

### Windows Quick Start
Double-click `start.bat` to automatically set up and run the application.

## 📁 Project Structure

```
wordsearch-generator/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Procfile              # Heroku deployment configuration
├── runtime.txt           # Python version specification
├── start.bat             # Windows startup script
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── styles.css        # CSS styles and themes
│   └── script.js         # JavaScript functionality
└── utils/
    ├── __init__.py
    ├── puzzle_generator.py    # Core puzzle generation algorithm
    ├── shape_masks.py        # Shape definitions and masks
    ├── pdf_exporter.py       # PDF export functionality
    └── word_exporter.py      # Word document export
```

## 🎮 Usage Examples

### For Educators
```
Subject: Solar System
Words: SUN, MOON, EARTH, MARS, JUPITER, SATURN, NEPTUNE, VENUS
Shape: Circle (representing orbits)
Theme: Modern (clean, professional look)
```

### For Healthcare Providers
```
Subject: Memory Care - Family
Words: GRANDMA, GRANDPA, MOTHER, FATHER, SISTER, BROTHER, COUSIN, AUNT
Shape: Heart (emotional connection)
Theme: Cozy (warm, comforting colors)
```

### For Corporate Training
```
Subject: Company Values
Words: INTEGRITY, INNOVATION, TEAMWORK, EXCELLENCE, RESPECT, QUALITY
Shape: Diamond (precious values)
Theme: Modern (professional appearance)
```

## 🎮 General Usage

### Creating Puzzles

1. **Add Words**: Use the "Add Word" button or upload a text file
2. **Select Shape**: Choose from premade shapes or upload custom images
3. **Customize**: Select fonts, themes, and word directions
4. **Preview**: See your puzzle in real-time
5. **Export**: Download as PDF or Word document

### Shape Options

- **Premade Shapes**: Choose from 15+ predefined shapes
- **Custom Upload**: Upload your own images (Beta feature)
- **Draw Custom**: Draw your own shapes (Coming soon)

### Export Options

- **PDF**: Professional layout with 0.5" margins
- **Word**: Editable document format
- **Customizable**: Fonts, themes, and formatting

## 🔧 Technical Implementation

### Puzzle Generation Algorithm
The core algorithm efficiently places words in various directions while respecting shape constraints and avoiding collisions:

```python
def generate_puzzle(words, shape, allow_vertical=True, allow_horizontal=True, allow_diagonal=True):
    # Initialize grid based on shape
    grid = create_shape_grid(shape)
    
    # Sort words by length (longest first) for better placement
    sorted_words = sorted(words, key=len, reverse=True)
    
    placed_words = []
    for word in sorted_words:
        # Try multiple placement strategies
        if place_word_in_grid(word, grid, placed_words, allow_vertical, allow_horizontal, allow_diagonal):
            placed_words.append(word)
    
    return grid, placed_words
```

### Shape System
Modular shape system using mask-based placement, allowing for easy addition of new shapes without modifying core logic.

### Export Pipeline
Robust export system supporting both PDF (ReportLab) and Word (python-docx) formats with consistent formatting and professional layouts.

## 🚨 Beta Features

**Image Upload Feature**: The image upload functionality is currently in beta. Additional improvements and enhancements are coming in future updates. This feature allows users to upload custom images to use as puzzle shapes, but may have limitations in shape detection and optimization.

## 🐛 Troubleshooting

### Common Issues

1. **Python not found**: Install Python 3.8 or later
2. **Dependencies fail**: Run `pip install -r requirements.txt` manually
3. **Port in use**: Change the port in `app.py` (line with `app.run()`)
4. **Browser cache**: Press Ctrl+F5 to hard refresh

### Performance Tips

- Use shorter word lists for faster generation
- Avoid very complex custom shapes for better performance
- Clear browser cache if experiencing display issues

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Robert A. Van Dyke**
- Email: ravandyke44@yahoo.com
- LinkedIn: [linkedin.com/in/robert-van-dyke](https://linkedin.com/in/robert-van-dyke)
- **Portfolio**: [twannylvsmusic-maker.github.io](https://twannylvsmusic-maker.github.io)

## 🙏 Acknowledgments

- Flask community for the excellent web framework
- ReportLab for PDF generation capabilities
- python-docx for Word document support
- All contributors and users who provided feedback

---

**Made with ❤️ by Robert A. Van Dyke**