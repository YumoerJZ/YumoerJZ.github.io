// 文章内容
const ARTICLE_TEXT = "昨天的梦里，你又如期的来了。我们在厨房包着包子，你穿着一件淡绿色的裙子。包子馅特别的大，我把皮翻来覆去才包紧那多汁的馅，你在我旁边笑笑我手笨。我不记得最后那蒸出来的包子有多好吃，只在梦醒之后又回到了第一次在悉尼见面的那个时候，我在厨房给你打下手，做了一道云南菜。\n" +
    "\n" +
    "那一夜的月光洒满整个赫斯维尔，觥筹交错间。我不禁感叹认识了一位知性，漂亮，善良的女士啊。\n" +
    "暖风吹到玫瑰湾的午后，草坪上的讨论，夕阳下的步行。清晨的冷冽在从浸在海水中的脚尖传来，暖阳盖过彗星的轨迹。那是我们在邦迪的清晨，我开始了解你的故乡和文化。\n" +
    "\n" +
    "每天从床上艰难的爬起，独自坐上去图书馆的火车，我焦急地等待着你出发的消息。提前占好的位置，舌尖跳动的糖果。在安静的图书馆中，我的心在剧烈地跳动，我感觉慢慢地我好像就爱上了你。不知从何时起，一没有你的消息我便失了神。心跳加快，一遍又一遍的看你的朋友圈，生怕错过你的消息。\n" +
    "\n" +
    "耳边传来你睡醒的喃喃声把我从回忆中拉出来，清晨的阳光洒到床上，我曾有一丝期待去回到梦里。但此时此刻，我更希望是牵着你的手。将那梦境化为现实，度过春夏秋冬。\n" +
    "\n" +
    "节日快乐，我最亲爱的宝贝！\n" +
    "\n" +
    "我爱你";

// 打字速度（毫秒）
const TYPING_SPEED = 100;
// 动画帧间隔时间（毫秒）
const ANIMATION_INTERVAL = 100;
// 烟花动画帧间隔时间（毫秒）
const FIREWORKS_INTERVAL = 200;

const textContainer = document.getElementById('text-container');
const animationContainer = document.getElementById('animation-container');
const fireworksContainer = document.getElementById('fireworks-container');
// 将文章按句子分割
const sentences = ARTICLE_TEXT.match(/[^。？！]+[。？！]?/g) || [];
let sentenceIndex = 0;
let charIndex = 0;
let typingInterval;

// 打字机效果函数
function typeWriter() {
    if (sentenceIndex < sentences.length) {
        const currentSentence = sentences[sentenceIndex];
        if (charIndex < currentSentence.length) {
            textContainer.textContent += currentSentence.charAt(charIndex);
            charIndex++;
            typingInterval = setTimeout(typeWriter, TYPING_SPEED);
        } else {
            // 一句打完，添加换行符
            textContainer.textContent += '\n';
            charIndex = 0;
            sentenceIndex++;
            typingInterval = setTimeout(typeWriter, TYPING_SPEED);
        }
    } else {
        clearTimeout(typingInterval);
        // 滚动到文本底部
        textContainer.scrollTop = textContainer.scrollHeight;
        // 显示动画容器
        setTimeout(() => {
            animationContainer.classList.add('show');
            loadFrames();
            // 显示烟花动画
            setTimeout(() => {
                fireworksContainer.classList.add('show');
                startFireworksAnimation();
            }, 2000);
        }, 500);
    }
}

let frames = [];
let frameIndex = 0;

// 异步加载帧数据
async function loadFrames() {
    try {
        const response = await fetch('ascii_frames.txt');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        // 根据分隔符分割帧
        frames = text.split("---\n").filter(frame => frame.trim()!== "");
        playAnimation();
    } catch (error) {
        console.error('Error loading frames:', error);
    }
}

// 播放动画函数
function playAnimation() {
    if (frames.length > 0) {
        // 显示当前帧
        animationContainer.textContent = frames[frameIndex];
        // 切换到下一帧
        frameIndex = (frameIndex + 1) % frames.length;
        // 定时调用 playAnimation 函数，实现动画循环
        setTimeout(playAnimation, ANIMATION_INTERVAL);
    }
}

// 烟花动画帧
const fireworksFrames = [
    [
        "         ",
        "         ",
        "         ",
        "    *    ",
        "         ",
        "         ",
        "         "
    ],
    [
        "         ",
        "         ",
        "    *    ",
        "   ***   ",
        "    *    ",
        "         ",
        "         "
    ],
    [
        "         ",
        "    *    ",
        "   ***   ",
        "  *****  ",
        "   ***   ",
        "    *    ",
        "         "
    ],
    [
        "    *    ",
        "   ***   ",
        "  *****  ",
        " ******* ",
        "  *****  ",
        "   ***   ",
        "    *    "
    ]
];

let fireworksFrameIndex = 0;

// 启动烟花动画
function startFireworksAnimation() {
    const intervalId = setInterval(() => {
        const currentFrame = fireworksFrames[fireworksFrameIndex];
        fireworksContainer.textContent = currentFrame.join('\n');
        fireworksFrameIndex = (fireworksFrameIndex + 1) % fireworksFrames.length;
        if (fireworksFrameIndex === 0) {
            clearInterval(intervalId);
            // 循环播放烟花动画
            setTimeout(startFireworksAnimation, 1000);
        }
    }, FIREWORKS_INTERVAL);
}

// 页面加载完成后开始打字机效果
document.addEventListener('DOMContentLoaded', typeWriter);