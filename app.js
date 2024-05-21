document.addEventListener("DOMContentLoaded", function () {
    const scoreDisplay = document.getElementById("score-display");
    const colorGrid = document.getElementById("color-grid");
    const resetButton = document.getElementById("reset-button");
    const baseDifference = 20; // Độ khác biệt màu ban đầu
    const difficultyIncrement = 2; // Mức tăng độ khó
    let numberOfSquares = 4; // Số ô màu ban đầu
    let score = 0;
    let colorDifference = baseDifference;
    const difficultyThresholds = [
        { score: 50, increase: 2 },
        { score: 120, increase: 3 },
    ];
    let nextThresholdIndex = 0;

    function init() {
        resetButton.addEventListener("click", function() {
            resetGame(true);
        });
        colorGrid.addEventListener("click", function(event) {
            if (event.target.classList.contains("color-square")) {
                const clickedColor = event.target.style.backgroundColor;
                if (clickedColor === pickedColor) {
                    score += 10;
                    updateScore();
                    checkAndIncreaseDifficulty();
                    resetGame(false);
                } else {
                    if (score > 0) {
                        score -= 10;
                        updateScore();
                    }
                    event.target.style.backgroundColor = "#f4f4f4";
                }
            }
        });
        resetGame(false);
    }

    function resetGame(isResetButton) {
        if (isResetButton) {
            score = 0;
            colorDifference = baseDifference;
            numberOfSquares = 4;
            nextThresholdIndex = 0;
            resetButton.disabled = false;
            colorGrid.style.display = "grid";
        }

        colors = generateColors(numberOfSquares);
        pickedColor = colors.find(color => color.isDifferent).value;
        setupColorSquares();
        updateScore();
    }

    function setupColorSquares() {
        colorGrid.innerHTML = '';
        colorGrid.style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(numberOfSquares))}, 100px)`;
        for (let color of colors) {
            const square = document.createElement("div");
            square.classList.add("color-square");
            square.style.backgroundColor = color.value;
            colorGrid.appendChild(square);
        }
    }

    function generateColors(num) {
        const baseColor = randomColor();
        const colors = Array(num).fill({ value: baseColor, isDifferent: false });

        const differentIndex = Math.floor(Math.random() * num);
        colors[differentIndex] = { value: generateDifferentColor(baseColor), isDifferent: true };

        return colors;
    }

    function generateDifferentColor(baseColor) {
        const baseRGB = getRGB(baseColor);

        const r = adjustColorValue(baseRGB.r, colorDifference);
        const g = adjustColorValue(baseRGB.g, colorDifference);
        const b = adjustColorValue(baseRGB.b, colorDifference);

        return `rgb(${r}, ${g}, ${b})`;
    }

    function adjustColorValue(value, difference) {
        const newValue = value + (Math.random() < 0.5 ? -difference : difference);
        return Math.min(255, Math.max(0, newValue));
    }

    function getRGB(color) {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
        return result ? { r: parseInt(result[1]), g: parseInt(result[2]), b: parseInt(result[3]) } : null;
    }

    function randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function updateScore() {
        scoreDisplay.textContent = `Điểm: ${score}`;
    }

    function checkAndIncreaseDifficulty() {
        if (nextThresholdIndex < difficultyThresholds.length && score >= difficultyThresholds[nextThresholdIndex].score) {
            colorDifference = Math.max(3, colorDifference - difficultyIncrement);
            numberOfSquares += difficultyThresholds[nextThresholdIndex].increase; // Tăng số ô vuông lên khi đạt ngưỡng điểm
            nextThresholdIndex++; // Chuyển sang ngưỡng tiếp theo
        }

        if (score >= 1000) {
            endGame();
        }
    }

    function endGame() {
        alert("Chúc mừng! Bạn đã phá đảo trò chơi!");
        colorGrid.style.display = "none"; // Ẩn lưới màu
        resetButton.disabled = true; // Vô hiệu hóa nút chơi lại
    }

    init();
});
